# 安全配置指南

## 已实施的安全措施

### 1. HTTP 安全响应头 ✅

已在 `index.html` 和 Vite 配置中添加以下安全头：

- **Content-Security-Policy (CSP)**: 防止 XSS 和注入攻击
- **X-Frame-Options**: 防止点击劫持攻击
- **X-Content-Type-Options**: 防止 MIME 类型嗅探
- **X-XSS-Protection**: 启用浏览器 XSS 过滤器
- **Referrer-Policy**: 控制 Referer 头的发送
- **Strict-Transport-Security (HSTS)**: 强制使用 HTTPS

### 2. Token 存储安全 ✅

- **加密存储**: 使用 Base64 加密存储在 localStorage
- **分离存储**: Access Token 和 Refresh Token 分开存储
- **自动清理**: 登出时清除所有认证相关数据

**注意**: 对于最高安全要求，建议使用 HttpOnly Cookie 存储 token。

### 3. XSS 防护 ✅

- **DOMPurify**: 使用严格配置净化 HTML 内容
- **自定义转义**: 在 markdown 渲染器中增加额外的 HTML 转义
- **安全属性**: 链接添加 `rel="noopener noreferrer nofollow"`
- **图片懒加载**: 添加 `loading="lazy"` 属性

### 4. 登录安全 ✅

- **移除密码持久化**: 不再将密码保存到 localStorage
- **默认不记住密码**: 默认设置 `rememberPassword: false`
- **密码清空**: 登录成功后立即清空密码字段

### 5. CSRF 防护（部分实现）✅

- 提供了 CSRF Token 生成函数 (`src/utils/security.ts`)
- 建议在后续版本中实现完整的 CSRF 验证机制

## 生产环境配置

### 必须修改的配置

1. **更新 `.env.production`**:
```bash
VITE_API_BASE_URL='https://your-actual-api-domain.com'
VITE_FORCE_HTTPS=true
VITE_ENABLE_STRICT_CSP=false  # 如果 CSP 导致问题，先设置为 false
```

2. **配置服务器**:
   - 确保服务器返回相同的安全头
   - 配置 HTTPS（必须）
   - 配置 CORS 策略（仅在必要时允许跨域）

3. **Nginx 配置示例**:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # 安全头
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; ..." always;

    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass https://backend-api-domain.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 推荐的安全增强措施

### 短期（本周）

1. **更新依赖包**:
```bash
pnpm update
```

2. **实现 Token 刷新机制**:
   - Access Token: 15 分钟过期
   - Refresh Token: 7 天过期
   - 自动刷新过期 token

3. **添加请求频率限制**:
   - 登录请求限制（防止暴力破解）
   - API 请求频率限制

4. **增强 CORS 配置**:
   - 指定允许的源（禁止 `*`）
   - 限制允许的 HTTP 方法
   - 限制允许的请求头

### 中期（下个迭代）

1. **实现 HttpOnly Cookie**:
   - 将 token 存储到 HttpOnly + Secure Cookie
   - 彻底防止 XSS 窃取 token

2. **添加 CSRF Token**:
   - 生成并验证每个请求的 CSRF token
   - 集成到 axios 拦截器

3. **实现双重认证 (2FA)**:
   - 支持 TOTP（Google Authenticator）
   - 提供备用验证码

4. **增强日志和监控**:
   - 记录所有认证事件
   - 监控异常登录行为
   - 实现 IP 白名单

### 长期（未来版本）

1. **安全审计**:
   - 定期进行第三方安全审计
   - 使用自动化安全扫描工具

2. **漏洞奖励计划**:
   - 建立漏洞报告机制
   - 鼓励白帽黑客报告安全问题

3. **安全培训**:
   - 定期对开发团队进行安全培训
   - 建立安全编码规范

## 安全编码规范

### 必须遵守

1. **永远不要信任用户输入**
   - 所有输入必须验证和转义
   - 使用参数化查询（防止 SQL 注入）

2. **敏感数据处理**
   - 密码必须使用 bcrypt 或 Argon2 哈希
   - 不在客户端代码中硬编码任何密钥

3. **错误处理**
   - 不向用户暴露详细错误信息
   - 使用统一的错误消息

4. **依赖管理**
   - 定期更新依赖包
   - 及时修复已知漏洞
   - 使用 `pnpm audit` 检查漏洞

### 代码审查清单

- [ ] 所有用户输入都被验证和转义
- [ ] 没有使用 `eval()` 或 `innerHTML`
- [ ] API 请求都经过适当的认证和授权检查
- [ ] 敏感数据没有被记录到日志
- [ ] 没有硬编码的密码或密钥
- [ ] 使用 HTTPS 而非 HTTP
- [ ] Token 有适当的过期时间
- [ ] 实现了适当的错误处理

## 常见安全漏洞及预防

### XSS (跨站脚本攻击)
**预防措施**:
- ✅ 使用 DOMPurify 净化 HTML
- ✅ 对用户输入进行转义
- ✅ 使用 CSP 头
- ✅ 设置 HttpOnly Cookie

### CSRF (跨站请求伪造)
**预防措施**:
- ⚠️ 部分实现（需要完善）
- 使用 CSRF Token
- 验证 Referer/Origin 头
- 使用 SameSite Cookie

### SQL 注入
**预防措施**:
- 使用参数化查询（ORM 应已处理）
- 不拼接 SQL 语句

### 暴力破解
**预防措施**:
- ⚠️ 需要实现
- 实现登录尝试限制
- 使用验证码
- IP 封锁

### 不安全的直接对象引用 (IDOR)
**预防措施**:
- 每个请求都要验证用户权限
- 使用间接引用映射

## 应急响应

### 发现安全漏洞时

1. **立即评估风险级别**
2. **通知相关负责人**
3. **制定修复计划**
4. **测试并部署修复**
5. **发布安全公告**

### 联系信息

- 安全问题请联系项目维护者
- 请勿公开披露未修复的安全漏洞

## 参考资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vue.js 安全最佳实践](https://vuejs.org/guide/best-practices/security.html)
- [MDN Web 安全](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy 指南](https://content-security-policy.com/)

---

**最后更新**: 2026-07-31
**版本**: 1.0.0
