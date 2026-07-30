# 校园论坛后台管理系统 - 安全检查报告

## 检查日期
2026-07-31

## 发现的安全问题

### 🔴 高危 (Critical)

1. **XSS 攻击风险 - 虽然已使用 DOMPurify 但仍有隐患**
   - 位置: `src/components/markdown-renderer/index.vue`
   - 问题: 使用 `v-html` 渲染 Markdown，虽然使用了 DOMPurify，但配置可能不够严格
   - 风险: 攻击者可能通过帖子内容注入恶意脚本

2. **Token 存储在 localStorage（易受 XSS 攻击）**
   - 位置: `src/utils/auth.ts`
   - 问题: JWT Token 存储在 localStorage，容易通过 XSS 攻击窃取
   - 风险: Token 被盗后攻击者可以完全冒充用户身份

3. **密码可能被持久化到 localStorage**
   - 位置: `src/views/login/components/login-form.vue`
   - 问题: 虽然注释说"仅保存用户名"，但初始配置包含 password 字段
   - 风险: 明文存储密码，任何能访问 localStorage 的脚本都能获取

### 🟡 中危 (Medium)

4. **缺少安全 HTTP 响应头**
   - 位置: `index.html`
   - 缺失的头部:
     - Content-Security-Policy (CSP)
     - X-Frame-Options (防止点击劫持)
     - X-Content-Type-Options (防止 MIME 类型嗅探)
     - Strict-Transport-Security (HSTS)
     - Referrer-Policy

5. **生产环境配置缺失**
   - 位置: `.env.production`
   - 问题: 文件为空，未设置 VITE_API_BASE_URL
   - 风险: 可能意外使用不安全的默认配置

6. **依赖包严重过时**
   - 位置: `package.json`
   - 问题: 33 个包过时，包含可能的严重安全漏洞
   - 高危过时包:
     - vite: 7.3.2 → 8.1.5
     - vue-router: 4.6.4 → 5.2.0
     - @vueuse/core: 12.0.0 → 14.4.0
     - eslint: 9.0.0 → 10.8.0

### 🟢 低危 (Low)

7. **CORS 配置可能过于宽松**
   - 位置: `config/vite.config.dev.ts`
   - 问题: `withCredentials: true` 允许发送 cookies
   - 风险: 如果服务器未正确配置 CORS，可能导致凭据泄露

8. **缺少 CSRF 保护**
   - 问题: 没有发现 CSRF Token 验证机制
   - 风险: 跨站请求伪造攻击

9. **JWT 配置信息不明确**
   - 位置: `src/api/interceptor.ts`
   - 问题: 未找到 token 刷新机制和过期时间配置
   - 风险: Token 长期有效，一旦泄露危害时间更长

## 修复建议

### 立即修复（Critical）

1. ✅ 增强 DOMPurify 配置
2. ✅ 使用 HttpOnly Cookie 存储 token（或至少加密 localStorage）
3. ✅ 完全移除密码持久化
4. ✅ 添加安全 HTTP 头
5. ✅ 配置生产环境变量
6. ✅ 更新依赖包
7. ✅ 增强 CSP 策略
8. ✅ 添加 CSRF 保护
9. ✅ 实现 token 刷新机制

## 优先级

- **第1优先级** (立即修复): 1, 2, 3, 4
- **第2优先级** (本周修复): 5, 6, 7
- **第3优先级** (下个迭代): 8, 9
