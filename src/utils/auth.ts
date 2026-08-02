const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * 认证基于后端 httpOnly Cookie（Sa-Token），前端不再读写 token。
 * 保留 clearToken 用于登出时清理旧版本遗留的 localStorage 数据。
 */
const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export { clearToken };
