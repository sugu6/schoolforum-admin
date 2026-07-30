/**
 * 安全工具函数集
 */

/**
 * 生成 CSRF Token
 */
export const generateCsrfToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * 安全的随机字符串生成
 */
export const generateSecureRandom = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * 检查是否为有效的 HTTPS 连接
 */
export const isSecureContext = (): boolean => {
  return window.isSecureContext || location.protocol === 'https:';
};

/**
 * 安全地设置 Cookie（设置 HttpOnly, Secure, SameSite 属性说明）
 * 注意：前端无法直接设置 HttpOnly 标志，这需要在服务端完成
 */
export const setSecureCookie = (
  name: string,
  value: string,
  days: number = 7,
  secure: boolean = true
): void => {
  const secureFlag = secure && isSecureContext() ? 'Secure;' : '';
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `expires=${expires.toUTCString()}`,
    'path=/',
    secureFlag,
    'SameSite=Strict',
    // HttpOnly 需要在服务端设置
  ].join('; ');
};

/**
 * 安全的 JSON 解析（防止原型污染）
 */
export const safeJsonParse = <T = any>(
  jsonString: string,
  defaultValue: T
): T => {
  try {
    const parsed = JSON.parse(jsonString);

    // 检查原型污染
    if (parsed && typeof parsed === 'object') {
      if (parsed.__proto__ || parsed.constructor || parsed.prototype) {
        console.warn('检测到潜在的 JSON 原型污染攻击');
        return defaultValue;
      }
    }

    return parsed;
  } catch {
    return defaultValue;
  }
};

/**
 * 验证 URL 是否安全（防止 open redirect）
 */
export const isValidUrl = (url: string, allowedDomains?: string[]): boolean => {
  try {
    const parsed = new URL(url, window.location.origin);

    // 允许相对路径
    if (parsed.origin === window.location.origin) {
      return true;
    }

    // 检查是否在允许的域名列表中
    if (allowedDomains && allowedDomains.length > 0) {
      return allowedDomains.some(domain => parsed.hostname === domain);
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * 清理用户输入（防止 XSS）
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * 检查浏览器是否支持现代安全特性
 */
export const checkSecuritySupport = (): {
  crypto: boolean;
  secureContext: boolean;
  serviceWorker: boolean;
} => {
  return {
    crypto: typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function',
    secureContext: window.isSecureContext || false,
    serviceWorker: 'serviceWorker' in navigator,
  };
};

/**
 * 报告安全错误
 */
export const reportSecurityError = (error: Error, context?: string): void => {
  console.error(`[Security Error]${context ? ` [${context}]` : ''}:`, error);

  // 在生产环境中，这里应该发送到错误追踪服务
  if (import.meta.env.PROD) {
    // TODO: 发送到 Sentry 或其他错误追踪服务
  }
};
