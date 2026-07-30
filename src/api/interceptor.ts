import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { getToken, getRefreshToken, clearToken } from '@/utils/auth';
import eventBus from '@/utils/event-bus';
import { generateCsrfToken, reportSecurityError } from '@/utils/security';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

// CSRF Token 管理
let csrfToken: string | null = null;

const getCsrfToken = (): string => {
  if (!csrfToken) {
    csrfToken = generateCsrfToken();
  }
  return csrfToken;
};

// 请求拦截器
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加认证 Token
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加 CSRF Token（对非 GET 请求，排除登录和刷新 token 接口）
    if (
      config.method &&
      ['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase()) &&
      !config.url?.includes('/users/login') &&
      !config.url?.includes('/users/refresh-token')
    ) {
      const csrfHeaderName = 'X-CSRF-Token';
      config.headers[csrfHeaderName] = getCsrfToken();
    }

    // 仅对敏感数据请求禁用缓存（用户信息、统计数据等）
    // 公开数据（分类、标签等）保留浏览器缓存以提升性能
    const noCachePatterns = [
      '/users/info',
      '/users/list',
      '/dashboard',
      '/posts/pinned',
      '/posts/essential',
    ];

    if (config.method === 'get' && noCachePatterns.some(pattern => config.url?.includes(pattern))) {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      config.headers.Pragma = 'no-cache';
    } else if (config.method === 'get') {
      // 公开数据使用浏览器缓存
      config.headers['Cache-Control'] = 'public, max-age=300'; // 5 分钟缓存
    }

    // 安全头
    config.headers['X-Content-Type-Options'] = 'nosniff';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Token 刷新处理
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (
  error: Error | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// 响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 调试：打印登录响应（仅开发环境）
    if (import.meta.env.MODE !== 'production' && response.config.url?.includes('/users/login')) {
      console.log('[Interceptor] Login response:', {
        url: response.config.url,
        status: response.status,
        dataKeys: Object.keys(res || {}),
        hasUser: !!res?.user,
        userPreview: res?.user ? { id: res.user.id, username: res.user.username } : null
      });
    }

    const successCodes = [200, 0, 20000, undefined];
    if (res.code !== undefined && !successCodes.includes(res.code)) {
      const errorMsg = res.msg || res.message || 'Error';

      // Token 过期，尝试刷新
      if ([401, 50008, 50012, 50014].includes(res.code)) {
        if (isRefreshing) {
          // 如果正在刷新，将请求加入队列
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              response.config.headers.Authorization = `Bearer ${token}`;
              return axios(response.config);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        isRefreshing = true;

        const refreshToken = getRefreshToken();

        if (refreshToken) {
          return axios
            .post('/users/refresh-token', { refreshToken })
            .then(({ data }) => {
              // 解包响应：后端包装了两层 { code, msg, data: { token, refreshToken } }
              const responseData = data.data || data;
              const { token: newToken, refreshToken: newRefreshToken } = responseData;

              if (newToken) {
                // 保存新 token
                import('@/utils/auth').then(({ setToken, setRefreshToken }) => {
                  setToken(newToken);
                  if (newRefreshToken) {
                    setRefreshToken(newRefreshToken);
                  }
                });

                // 更新请求头
                response.config.headers.Authorization = `Bearer ${newToken}`;

                // 处理队列中的请求
                processQueue(null, newToken);

                // 重试原始请求
                return axios(response.config);
              }

              processQueue(new Error('Token 刷新失败'), null);
              handleAuthFailure();
              return Promise.reject(new Error('Token 刷新失败'));
            })
            .catch((error) => {
              processQueue(error, null);
              handleAuthFailure();
              return Promise.reject(error);
            })
            .finally(() => {
              isRefreshing = false;
            });
        } else {
          // 没有 refresh token，直接登出
          isRefreshing = false;
          handleAuthFailure();
          return Promise.reject(new Error(errorMsg));
        }
      }

      Message.error({
        content: errorMsg,
        duration: 5 * 1000,
      });

      return Promise.reject(new Error(errorMsg));
    }

    // 解包响应数据：后端 ResponseAdvice 包装了一层 { code, msg, data: T }
    // 返回实际的业务数据，避免在所有组件中重复解包
    const responseData = res.data || res;
    response.data = responseData;

    return response;
  },
  (error: AxiosError) => {
    const msg =
      (error.response?.data as any)?.msg ||
      (error.response?.data as any)?.message ||
      error.message ||
      '请求错误';

    Message.error({
      content: msg,
      duration: 5 * 1000,
    });

    // 记录安全错误
    if (error.response?.status === 401 || error.response?.status === 403) {
      reportSecurityError(new Error(msg), 'auth_error');
    }

    return Promise.reject(error);
  }
);

// 处理认证失败
function handleAuthFailure() {
  Modal.error({
    title: '登录已过期',
    content: '请重新登录',
    okText: '重新登录',
    onOk() {
      eventBus.emit('auth:failed', { reason: 'token_expired' });
    },
  });
}
