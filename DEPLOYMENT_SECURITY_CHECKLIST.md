# 安全部署检查清单

在部署到生产环境之前，请确保完成以下所有检查项。

## 部署前检查

### 环境配置

- [ ] `.env.production` 已正确配置 `VITE_API_BASE_URL`
- [ ] `.env.production` 的 `VITE_FORCE_HTTPS` 设置为 `true`
- [ ] 所有敏感信息已从代码中移除
- [ ] 没有硬编码的密码、密钥或 API 密钥
- [ ] 环境变量已设置为生产值

### 依赖安全

- [ ] 运行 `pnpm audit` 检查依赖漏洞
- [ ] 所有高危和中危漏洞已修复
- [ ] 依赖包已更新到稳定版本
- [ ] `pnpm-lock.yaml` 已提交到版本控制

### 构建配置

- [ ] Vite 生产构建成功（`pnpm build`）
- [ ] TypeScript 类型检查通过（`pnpm type:check`）
- [ ] ESLint 和 Stylelint 检查通过
- [ ] bundle 体积在可接受范围内（`pnpm report`）

### 安全头配置

- [ ] 服务器配置了 HTTPS
- [ ] SSL 证书已正确安装
- [ ] HSTS 已启用
- [ ] CSP 策略已配置并测试
- [ ] X-Frame-Options 设置为 DENY
- [ ] X-Content-Type-Options 设置为 nosniff

### CORS 配置

- [ ] 后端 API 已配置正确的 CORS 策略
- [ ] CORS 不允许 `*`（除非是完全公开的 API）
- [ ] `Access-Control-Allow-Credentials` 仅在必要时启用
- [ ] `Access-Control-Max-Age` 已合理设置

### 认证和授权

- [ ] JWT Token 有过期时间
- [ ] 实现了 Refresh Token 机制
- [ ] 密码策略已实施（复杂度要求）
- [ ] 登录尝试限制已实施
- [ ] 实现了适当的权限检查

### 数据安全

- [ ] 敏感数据已加密存储
- [ ] 数据库连接使用加密连接
- [ ] 日志中不包含敏感信息
- [ ] 错误消息不暴露内部细节

### XSS 防护

- [ ] 所有用户输入都经过验证和转义
- [ ] 使用 DOMPurify 净化 HTML 内容
- [ ] 不直接使用 `v-html`（除非经过严格净化）
- [ ] CSP 已配置

### CSRF 防护

- [ ] 实现了 CSRF Token 验证
- [ ] 使用了 SameSite Cookie 属性
- [ ] 验证了 Referer/Origin 头

### 文件上传

- [ ] 上传的文件类型已限制
- [ ] 上传的文件大小已限制
- [ ] 上传的文件已重命名
- [ ] 上传的文件存储在非 Web 根目录

### API 安全

- [ ] 所有 API 端点都有认证保护（除非明确公开）
- [ ] 实现了速率限制
- [ ] API 请求参数已验证
- [ ] 实现了适当的错误处理

### 前端安全

- [ ] 没有使用 `eval()`
- [ ] 没有使用危险的 `innerHTML`（除非经过净化）
- [ ] 第三方脚本从可信 CDN 加载
- [ ] Subresource Integrity (SRI) 用于外部资源

## 部署后检查

### 功能测试

- [ ] 登录/登出功能正常
- [ ] 权限控制正常工作
- [ ] Token 刷新机制正常
- [ ] 所有页面可正常访问
- [ ] API 调用正常

### 安全测试

- [ ] 使用浏览器开发者工具检查安全头
- [ ] 测试 HTTPS 重定向
- [ ] 测试 CSP 是否生效（查看浏览器控制台）
- [ ] 测试点击劫持防护
- [ ] 测试 XSS 防护（提交恶意脚本测试）
- [ ] 测试 CSRF 防护
- [ ] 测试暴力破解防护

### 性能测试

- [ ] 页面加载时间正常
- [ ] API 响应时间可接受
- [ ] 资源大小合理

### 监控

- [ ] 错误监控已启用（如 Sentry）
- [ ] 日志系统已配置
- [ ] 性能监控已配置
- [ ] 告警机制已设置

## 持续维护

### 定期任务

- [ ] 每周检查依赖包更新
- [ ] 每月进行安全扫描
- [ ] 每季度进行安全审计
- [ ] 及时修复发现的安全漏洞

### 监控指标

- [ ] 监控异常登录尝试
- [ ] 监控 API 错误率
- [ ] 监控服务器资源使用
- [ ] 监控证书过期时间

## 应急响应

### 准备事项

- [ ] 制定安全事件响应计划
- [ ] 明确联系人和职责
- [ ] 准备回滚方案
- [ ] 定期进行应急演练

### 漏洞披露

- [ ] 建立漏洞报告流程
- [ ] 提供安全联系方式
- [ ] 制定漏洞修复时间表

## 安全文档

- [ ] 阅读 `SECURITY.md` 了解详细的安全措施
- [ ] 了解安全编码规范
- [ ] 知道如何报告安全问题

---

## 快速检查命令

### 检查安全头

```bash
# 使用 curl 检查
curl -I https://your-domain.com

# 应该看到以下头：
# Strict-Transport-Security
# X-Content-Type-Options
# X-Frame-Options
# X-XSS-Protection
# Content-Security-Policy
```

### 检查 SSL 配置

```bash
# 使用 SSL Labs 测试
https://www.ssllabs.com/ssltest/

# 或使用命令行工具
curl https://your-domain.com --tlsv1.2
```

### 检查依赖漏洞

```bash
pnpm audit
pnpm audit --audit-level=high  # 只查看高危漏洞
```

### 检查 HTTPS 重定向

```bash
curl -I http://your-domain.com
# 应该返回 301 或 302 重定向到 https://
```

---

**最后更新**: 2026-07-31
**版本**: 1.0.0
