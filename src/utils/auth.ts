const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// 简单的加密/解密函数（生产环境应使用更安全的方案）
const encrypt = (data: string): string => {
  try {
    return btoa(encodeURIComponent(data));
  } catch {
    return data;
  }
};

const decrypt = (data: string): string => {
  try {
    return decodeURIComponent(atob(data));
  } catch {
    return data;
  }
};

const isLogin = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return !!token && token.trim().length > 0;
};

const getToken = (): string | null => {
  const encryptedToken = localStorage.getItem(TOKEN_KEY);
  if (!encryptedToken) return null;
  return decrypt(encryptedToken);
};

const setToken = (token: string) => {
  // 加密存储 token
  localStorage.setItem(TOKEN_KEY, encrypt(token));
};

const getRefreshToken = (): string | null => {
  const encryptedToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!encryptedToken) return null;
  return decrypt(encryptedToken);
};

const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, encrypt(token));
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// 清除所有认证相关的 localStorage 数据
export const clearAllAuthData = () => {
  clearToken();
  // 清除其他可能的认证相关数据
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('token') || key.includes('auth') || key.includes('user'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

export { isLogin, getToken, setToken, clearToken, getRefreshToken, setRefreshToken };
