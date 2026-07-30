# 校园论坛后台安全修复计划

## P0 — Critical（立即修复）

### 1. 安装 DOMPurify + 类型定义
- `pnpm add dompurify @types/dompurify`
- 修复 XSS 根因：`src/utils/markdown.ts` 的 `renderMarkdown()` 在 `marked.parse()` 输出后追加 `DOMPurify.sanitize()`
- 同步修复 `src/components/markdown-renderer/index.vue`，确保 `v-html` 渲染的内容经过净化

### 2. 修复 Open Redirect — `src/views/redirect/index.vue`
- 读取 `route.params.path` 后，仅允许内部路由（如 `/dashboard/workplace`），禁止 `http(s)://` 或 `//` 开头的外部 URL
- 非法路径 fallback 到 `/dashboard/workplace`

### 3. 移除硬编码凭据 — `src/views/login/components/login-form.vue`
- 删除 `useStorage('login-config', ...)` 中的默认 `password: '123456'`
- 仅在 `rememberPassword` 为 true 时保留用户名，密码字段不再持久化到 localStorage

### 4. 限制 `switchRoles()` 仅开发环境可用 — `src/store/modules/user/index.ts`
- 使用 `import.meta.env.MODE !== 'production'` 守卫，生产环境直接返回空 Promise

### 5. 替换 `Set` 为 `string[]` — `src/store/modules/tab-bar/`
- `types.ts`：`cacheTabList: string[]`
- `index.ts`：所有 `Set` 方法（`.add/.delete/.clear`）改为数组等价操作，getter 不再需要 `Array.from()`

---

## P1 — High（1-2 周内）

### 6. 提取共享 BFS 工具函数
- 新建 `src/utils/bfs.ts`，统一提取 `hooks/permission.ts` 和 `router/guard/permission.ts` 中重复的 BFS/队列遍历逻辑
- 两处改为 import 共享函数

### 7. 提取 `withTimeout` 工具函数
- 新建 `src/utils/promise.ts`，提取 `router/guard/userLoginInfo.ts` 中的 `withTimeout`
- 守卫文件改为 import

### 8. 修复类型安全问题
- `src/hooks/request.ts`：消除 `as unknown as` 双重断言
- 审查各处 `as any` 类型断言（user store 的 `role` 赋值等），用适当类型替代

---

## P2 — Medium（2-4 周）

### 9. 事件总线内存泄漏 — `src/utils/event-bus.ts`
- 添加 `cleanup()` 方法，允许调用方注销所有 handler（配合组件 `onUnmounted`）
- 考虑升级为 mitt（已存在于 dependencies），逐步替换自定义 EventBus

### 10. CSRF Token 拦截器
- 在 `src/api/interceptor.ts` 请求拦截器中附加 `X-CSRF-Token` header

### 11. 提取 CRUD 通用逻辑
- 分析 management 各页面（category、tag、post、comment）重复的表格/搜索/分页/删除逻辑，提取为 composable

---

## P3 — Low（长期架构优化）

### 12. 系统性类型安全改进
- 清理松散 `interface`、补充缺失类型定义

---

## 执行顺序

P0 五项并行或顺序实施 → 安装依赖 → 逐文件修复 → 跑 `pnpm type:check` + `pnpm lint-staged` 验证