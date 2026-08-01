import axios from 'axios';
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import eventBus from '@/utils/event-bus';
import { reportSecurityError } from '@/utils/security';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

// 认证基于 httpOnly Cookie（后端 Sa-Token），前端不保存/不携带 token
const REFRESH_URL = '/auth/refresh';
const AUTH_FAILURE_CODES = [401, 50008, 50012, 50014];

// Token 刷新状态（同一时间只允许一个刷新请求，其余 401 请求排队）
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

const isRefreshUrl = (url?: string): boolean =>
  !!url && url.includes('/auth/refresh');

/**
 * 调用后端刷新接口。access/refresh token 均由 httpOnly Cookie 携带，
 * 刷新成功后 Cookie 自动更新，无需前端解析或存储。
 */
const refreshAccessToken = (): Promise<void> =>
  axios.post(REFRESH_URL).then(() => undefined);

const retryRequest = (config: InternalAxiosRequestConfig) => {
  (config as InternalAxiosRequestConfig & { _retry?: boolean })._retry = true;
  return axios(config);
};

// 防止"登录已过期"弹窗重复弹出
let authFailureModalShown = false;

// 处理认证失败
function handleAuthFailure() {
  if (authFailureModalShown) return;
  authFailureModalShown = true;
  Modal.error({
    title: '登录已过期',
    content: '请重新登录',
    okText: '重新登录',
    onOk() {
      authFailureModalShown = false;
      eventBus.emit('auth:failed', { reason: 'token_expired' });
    },
  });
}

/**
 * 统一处理 token 失效：刷新后重试原请求；刷新失败则弹窗并登出。
 * 刷新接口自身失败或请求已重试过一次时，直接进入登出流程，避免死循环。
 */
const handleAuthExpired = (
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> => {
  const retried = (config as InternalAxiosRequestConfig & { _retry?: boolean })
    ._retry;
  if (retried || isRefreshUrl(config.url)) {
    handleAuthFailure();
    return Promise.reject(new Error('登录已过期，请重新登录'));
  }

  if (isRefreshing) {
    // 已有刷新在途，排队等待刷新完成后重试
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(() => retryRequest(config));
  }

  isRefreshing = true;
  return refreshAccessToken()
    .then(() => {
      processQueue(null);
      return retryRequest(config);
    })
    .catch((error) => {
      processQueue(error);
      handleAuthFailure();
      return Promise.reject(error);
    })
    .finally(() => {
      isRefreshing = false;
    });
};

// 响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    const successCodes = [200, 0, 20000, undefined];
    if (res.code !== undefined && !successCodes.includes(res.code)) {
      const errorMsg = res.msg || res.message || 'Error';

      // 业务码 401：token 过期，尝试刷新
      if (AUTH_FAILURE_CODES.includes(res.code)) {
        return handleAuthExpired(response.config);
      }

      Message.error({
        content: errorMsg,
        duration: 5 * 1000,
      });

      return Promise.reject(new Error(errorMsg));
    }

    // 解包响应数据：后端 ResponseAdvice 包装了一层 { code, msg, data: T }
    const responseData = res.data || res;
    response.data = responseData;

    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const config = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const msg =
      (error.response?.data as any)?.msg ||
      (error.response?.data as any)?.message ||
      error.message ||
      '请求错误';

    // HTTP 401：token 过期，尝试刷新后重试（刷新接口本身或已重试过的请求除外）
    if (
      status === 401 &&
      config &&
      !config._retry &&
      !isRefreshUrl(config.url)
    ) {
      return handleAuthExpired(config);
    }

    // 记录安全错误
    if (status === 401 || status === 403) {
      reportSecurityError(new Error(msg), 'auth_error');
    }

    Message.error({
      content: msg,
      duration: 5 * 1000,
    });

    return Promise.reject(error);
  },
);
