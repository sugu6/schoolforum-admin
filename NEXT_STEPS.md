# 安全实施完成 - 下一步行动指南

## 立即可执行的命令

### 1. 验证安全修复

```bash
# 运行安全检查脚本
pnpm security:check

# 检查依赖漏洞
pnpm security:audit

# 类型检查
pnpm type:check

# 构建测试
pnpm build
```

### 2. 更新过时的依赖（推荐）

当前有 33 个过时包，建议按优先级更新：

```bash
# 查看过时的包
pnpm outdated

# 更新主要依赖（分步更新以减少风险）
pnpm update vite @vitejs/plugin-vue @vitejs/plugin-vue-jsx
pnpm update vue vue-router pinia
pnpm update @arco-design/web-vue
pnpm update @vueuse/core
pnpm update axios

# 更新所有开发依赖
pnpm update -D
```

**注意**: 更新前请确保备份代码，并在测试环境充分测试。

### 3. 配置生产环境

编辑 `.env.production`:

```bash
# 必须修改：设置实际的后端 API 地址
VITE_API_BASE_URL='https://your-api-domain.com'

# 保持启用
VITE_FORCE_HTTPS=true

# 如果 CSP 导致问题，保持 false；否则可尝试 true
VITE_ENABLE_STRICT_CSP=false
```

### 4. 配置后端支持

确保后端 API 支持以下功能：

1. **Refresh Token 端点**
   ```
   POST /users/refresh-token
   Body: { "refreshToken": "xxx" }
   Response: { "code": 200, "data": { "token": "xxx", "refreshToken": "xxx" } }
   ```

2. **CSRF Token 验证**（可选，如果使用 CSRF）
   - 提供 CSRF token 端点
   - 验证 `X-CSRF-Token` 请求头

3. **CORS 配置**（如果前后端分离部署）
   - 指定允许的源（禁止 `*`）
   - 允许 `Authorization` 和 `X-CSRF-Token` 头
   - 仅在必要时启用 `credentials`

---

## 优先级任务清单

### 🔥 必须完成（部署前）

- [ ] 配置 `.env.production` 中的 `VITE_API_BASE_URL`
- [ ] 确保后端支持 HTTPS
- [ ] 配置服务器安全头（参考 `DEPLOYMENT_SECURITY_CHECKLIST.md`）
- [ ] 测试登录/登出功能
- [ ] 测试 Token 刷新机制

### ⚠️ 强烈建议（本周内）

- [ ] 更新依赖包（特别是 vite、vue-router）
- [ ] 实现后端 `/users/refresh-token` 端点
- [ ] 配置服务器 CSP 策略
- [ ] 配置 HTTPS 和 HSTS
- [ ] 测试 XSS 防护（提交包含脚本的 Markdown 内容）

### 💡 建议完成（下个迭代）

- [ ] 实现 HttpOnly Cookie 存储 token
- [ ] 添加登录尝试限制
- [ ] 实现 CSRF Token 验证
- [ ] 添加双重认证（2FA）
- [ ] 配置错误监控（Sentry 等）

---

## 常见问题

### Q1: CSP 导致页面样式或脚本失效怎么办？

**A**: 在生产环境初始阶段，可以暂时放宽 CSP：

```bash
# 在 .env.production 中设置
VITE_ENABLE_STRICT_CSP=false
```

或者调整 `config/vite.config.prod.ts` 中的 CSP 策略，添加所需的源。

### Q2: 如何禁用某些安全功能用于本地开发？

**A**: 修改环境变量：

```bash
# .env.development
VITE_ENABLE_SECURITY_CHECKS=false
```

### Q3: Token 加密是否足够安全？

**A**: Base64 编码不是加密，只是编码。对于更高安全要求，建议：
1. 使用 Web Crypto API 进行 AES 加密
2. 或者使用 HttpOnly Cookie（推荐）

### Q4: 如何验证 HTTPS 配置？

**A**: 使用以下工具：
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- [Security Headers](https://securityheaders.com/)

---

## 测试验证步骤

### 1. 本地测试

```bash
# 启动开发服务器
pnpm dev

# 测试登录
# 1. 打开 http://localhost:8081
# 2. 使用 admin / 123456 登录
# 3. 检查浏览器开发者工具 Application → LocalStorage
# 4. 确认 token 已被加密（不是明文）

# 测试 XSS 防护
# 1. 创建一个包含 <script>alert('xss')</script> 的帖子
# 2. 确认脚本不会执行
```

### 2. 构建测试

```bash
# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview

# 访问 http://localhost:4173
# 使用浏览器开发者工具检查安全头
```

### 3. 安全头检查

在浏览器开发者工具 → Network → 选择请求 → Headers → Response Headers 中检查：

```
✓ X-Content-Type-Options: nosniff
✓ X-Frame-Options: DENY
✓ X-XSS-Protection: 1; mode=block
✓ Referrer-Policy: strict-origin-when-cross-origin
✓ Strict-Transport-Security: max-age=31536000; includeSubDomains; preload (仅 HTTPS)
```

---

## 监控和维护

### 定期任务

1. **每周**
   - 检查依赖更新：`pnpm outdated`
   - 查看安全公告

2. **每月**
   - 运行依赖漏洞扫描：`pnpm audit`
   - 检查日志中的异常行为

3. **每季度**
   - 进行安全审计
   - 更新安全文档
   - 进行渗透测试（如适用）

---

## 参考文档

- [SECURITY.md](SECURITY.md) - 详细安全措施
- [SECURITY_AUDIT.md](SECURITY_AUDIT.md) - 安全审计报告
- [DEPLOYMENT_SECURITY_CHECKLIST.md](DEPLOYMENT_SECURITY_CHECKLIST.md) - 部署检查清单
- [SECURITY_FIXES_SUMMARY.md](SECURITY_FIXES_SUMMARY.md) - 修复详情

---

## 支持

如遇到安全问题或疑问：

1. 查看 `SECURITY.md` 获取详细说明
2. 运行 `pnpm security:check` 进行自动诊断
3. 参考 `DEPLOYMENT_SECURITY_CHECKLIST.md` 进行验证

---

**状态**: ✅ 安全修复已完成，等待部署验证
**最后更新**: 2026-07-31
