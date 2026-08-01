# AGENTS.md

本文件为 Codex (Codex.ai/code) 在此仓库中工作时提供指导。

## 项目概述

**校园论坛后台管理系统** — 基于 Arco Design Pro Vue 模板构建的 Vue 3 + TypeScript SPA，用于管理校园论坛的用户、帖子、评论、公告、分类和标签。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API, `<script setup>`) |
| 语言 | TypeScript 4.8 |
| 构建 | Vite 3（配置文件在 `config/` 目录） |
| 包管理器 | **pnpm**（锁文件: `pnpm-lock.yaml`） |
| UI 库 | @arco-design/web-vue ^2.44.7 |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| HTTP | Axios（JWT Bearer Token） |
| 图表 | ECharts + vue-echarts |
| 国际化 | vue-i18n (zh-CN, en-US) |
| CSS | Less |
| 代码质量 | ESLint (Airbnb), Prettier, Stylelint, Husky + lint-staged |
| 提交规范 | commitlint (`@commitlint/config-conventional`) |

## 常用命令

```bash
pnpm dev            # 启动开发服务器（ESLint + 热更新）
pnpm build          # vue-tsc 类型检查 + 生产构建（gzip、imagemin）
pnpm preview        # 构建并预览生产版本
pnpm report         # 构建并生成 bundle 体积报告
pnpm type:check     # 仅 vue-tsc 类型检查（跳过库检查）
pnpm lint-staged    # 对暂存文件运行 prettier → eslint/stylelint
pnpm prepare        # 安装 Husky git hooks（首次克隆后执行）
```

## 项目架构

```
src/
├── main.ts                 # 入口：注册 ArcoVue/Router/Pinia/i18n/指令/全局组件/mock
├── App.vue                 # 根组件：Arco ConfigProvider 包裹 <router-view>
├── config/settings.json    # 默认设置（theme, navbar, menu, footer, tabBar 等）
│
├── router/
│   ├── index.ts            # 路由实例 + 守卫注册；/login 路由直接在此定义（不走模块发现）
│   ├── constants.ts        # WHITE_LIST, NOT_FOUND, DEFAULT_ROUTE, REDIRECT_ROUTE_NAME
│   ├── routes/
│   │   ├── index.ts        # import.meta.glob 自动发现 ./modules/*.ts 和 ./externalModules/*.ts
│   │   ├── base.ts         # DEFAULT_LAYOUT、重定向、404 路由
│   │   └── modules/        # 业务路由模块（dashboard.ts, management.ts）
│   └── guard/
│       ├── index.ts        # 组合三个守卫：页面 → 登录态 → 权限
│       ├── userLoginInfo.ts# isLogin() 检查 → userStore.info() 获取用户详情 → 失败则登出
│       └── permission.ts   # 角色权限 + 服务端菜单（menuFromServer 标志）
│
├── store/
│   ├── index.ts            # 创建 Pinia，导出 useAppStore/useUserStore/useTabBarStore
│   ├── modules/app/        # 应用设置（主题、设备、菜单）；fetchServerMenuConfig()
│   ├── modules/user/       # 用户状态、登录/登出、switchRoles() 角色切换
│   └── modules/tab-bar/    # 多标签页（tagList, cacheTabList）；BAN_LIST 排除 redirect
│
├── api/
│   ├── interceptor.ts      # Axios 拦截器：Bearer token + 统一错误处理
│   ├── user.ts             # 用户 API：login, logout, getUserInfo, getMenuList, getUserList, deleteUser
│   ├── post.ts             # 帖子 API：getPostList, getPostDetail, deletePost, setPostPinned, setPostEssential
│   ├── comment.ts          # 评论 API：getCommentList, getCommentDetail, deleteComment
│   ├── announcement.ts     # 公告 API：CRUD + publish, offline, toggleTop
│   ├── category.ts         # 分类 API：getCategoryList, create, update, delete
│   ├── tag.ts              # 标签 API：getTagList, create, update, delete
│   ├── dashboard.ts        # 仪表盘 API：queryContentData, queryPopularList
│   └── message.ts          # 消息 API：queryMessageList, setMessageStatus, queryChatList
│
├── hooks/                  # 组合式函数（request, permission, locale, themes, loading, responsive, user, chart-option, visible）
├── layout/
│   ├── default-layout.vue  # 主布局：navbar + sidebar（移动端 drawer） + tab-bar + content + footer
│   └── page-layout.vue     # 路由页面内容包装器
├── components/             # 全局组件（在 components/index.ts 中以插件模式自动注册）
├── views/
│   ├── login/              # 登录页（banner + login-form；默认账号 admin/123456）
│   ├── dashboard/workplace/# 仪表盘（announcement, data-panel, content-chart, popular-content 等面板）
│   ├── management/         # 业务管理页面
│   │   ├── user/           # 用户管理（表格 + 详情模态框）
│   │   ├── announcement/   # 公告管理（CRUD + 发布/下架/置顶）
│   │   ├── category/       # 分类管理（CRUD + 状态管理）
│   │   ├── tag/            # 标签管理（CRUD + 关联分类）
│   │   ├── post/           # 帖子管理（搜索 + 置顶/精华切换 + 删除）
│   │   └── comment/        # 评论管理（查看详情 + 删除）
│   ├── not-found/          # 404
  │
  ├── locale/                 # i18n 翻译文件
  ├── directive/              # v-permission 权限指令
├── utils/
│   ├── auth.ts             # Token 存取：isLogin/getToken/setToken/clearToken（localStorage key='token'）
│   ├── security.ts         # 安全工具：CSRF、安全 JSON 解析、URL 校验、输入净化
│   ├── markdown.ts         # Markdown 渲染（marked + DOMPurify 净化）
│   ├── route-listener.ts   # 路由变更发布订阅（mitt），组件通过 listenerRouteChange() 订阅
│   ├── env.ts              # import.meta.env.MODE !== 'production' 判断开发环境
│   └── index.ts            # openWindow, regexUrl
└── types/                  # 全局 TypeScript 类型定义
```

## 业务路由结构

```
/                          → redirect to /login
/login                     → 登录页（无需认证）
/dashboard/workplace       → 仪表盘
/management/user           → 用户管理
/management/announcement   → 公告管理
/management/category       → 分类管理
/management/tag            → 标签管理
/management/post           → 帖子管理
/management/comment        → 评论管理
```

所有路由 `meta.roles: ['*']`（所有角色可访问）。

## API 端点参考

| 模块 | 端点 | 方法 |
|------|------|------|
| 用户 | `/users/login` | POST (params) |
| 用户 | `/users/logout` | POST |
| 用户 | `/users/info` | GET |
| 用户 | `/users/list/page` | GET |
| 用户 | `/users/getInfo/:id` | GET |
| 用户 | `/users/remove/:id` | DELETE |
| 帖子 | `/posts/list/page` | GET |
| 帖子 | `/posts/get/:id` | GET |
| 帖子 | `/posts/delete/:id` | DELETE |
| 帖子 | `/posts/pinned/:id` | PUT (params) |
| 帖子 | `/posts/essential/:id` | PUT (params) |
| 评论 | `/comments/list/page` | GET |
| 评论 | `/comments/get/:id` | GET |
| 评论 | `/comments/delete/:id` | DELETE |
| 公告 | `/announcements/admin/list` | GET |
| 公告 | `/announcements` | POST |
| 公告 | `/announcements/:id` | GET/PUT/DELETE |
| 公告 | `/announcements/:id/publish` | PUT |
| 公告 | `/announcements/:id/offline` | PUT |
| 公告 | `/announcements/:id/top` | PUT |
| 分类 | `/categories/list/page` | GET |
| 分类 | `/categories/get/:id` | GET |
| 分类 | `/categories/add` | POST |
| 分类 | `/categories/update/:id` | PUT (params) |
| 分类 | `/categories/delete/:id` | DELETE |
| 标签 | `/tags/list` | GET |
| 标签 | `/tags/get/:id` | GET |
| 标签 | `/tags/add` | POST |
| 标签 | `/tags/update/:id` | PUT (params) |
| 标签 | `/tags/delete/:id` | DELETE |

## 数据模型

### 分页响应
```typescript
interface PageResponse<T> {
  records: T[]; pageNumber: number; pageSize: number;
  totalPage: number; totalRow: number;
}
```

### 用户 (User)
```typescript
interface User {
  id: number; username: string; email: string; role: string;  // role: 'SUPER_ADMIN' | 'ADMIN' | 其他
  avatarUrl?: string; bio?: string; gender?: string; age?: number;
  isActive: string;  // 'ACTIVE' | 禁用
  level?: number; exp?: number; points?: number;
  continuousSignDays?: number; totalSignDays?: number;
  createdAt: string; updatedAt: string; lastLoginAt?: string;
}
```

### 帖子 (Post)
```typescript
interface Post {
  id: number; authorId: number; authorName: string; authorAvatar?: string;
  title: string; content: string; categoryId: number; categoryName?: string;
  tagNames?: string[]; coverImage?: string;
  viewCount: number; likeCount: number; commentCount: number; favoriteCount?: number;
  isPinned: string;   // 'PINNED' | 'NORMAL'
  isEssential: string; // 'ESSENTIAL' | 'NORMAL'
  createdAt: string; updatedAt: string;
}
```

### 公告 (Announcement)
```typescript
interface Announcement {
  id: number; title: string; content: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
  status: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
  isTop: number; // 0 | 1
  publisherId: number; publisher?: { id: number; username: string; avatarUrl?: string };
  createdAt: string; updatedAt: string;
}
```

### 分类 (Category)
```typescript
interface Category {
  id: number; name: string; parentId: number; level: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_DELETION';
  postCount: number; children?: Category[];
  createdAt: string; updatedAt: string;
}
```

### 标签 (Tag)
```typescript
interface Tag {
  id: number; name: string; categoryId: number; postCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_DELETION';
  createdAt: string; updatedAt: string;
}
```

### 评论 (Comment)
```typescript
interface Comment {
  id: number; content: string; postId: number; userId: number;
  parentId?: number; replyToId?: number; likeCount: number; status: string;
  user?: { id: number; username: string; avatarUrl?: string };
  post?: { id: number; title: string };
  createdAt: string; updatedAt: string;
}
```

## 关键架构决策

### 包管理器
项目使用 **pnpm** 作为包管理器（`pnpm-lock.yaml` 存在于项目根目录）。Husky `commit-msg` 钩子直接调用 `pnpm commitlint`。所有命令应使用 `pnpm` 执行。

### API 拦截器 (`src/api/interceptor.ts`)
- **请求**：自动注入 `Authorization: Bearer <token>`（从 localStorage 读取）
- **响应格式**：`{ code: number, msg: string, data: T }`
- **成功码**：`[200, 0, 20000, undefined]`
- **自动登出码**：`[401, 50008, 50012, 50014]` → 弹模态框"登录已过期" → 强制登出 + `window.location.reload()`
- 其他非成功码通过 `Message.error` 显示

### 认证流程
1. 登录 → `POST /users/login` → 返回 `{ user, token }` → `setToken(token)` + 更新 userStore
2. 登录表单默认值 `admin / 123456`，通过 `@vueuse/core` 的 `useStorage` 持久化到 localStorage (`login-config`)
3. 路由守卫 `userLoginInfo`：`isLogin()` 为 true → `userStore.info()` 获取详情 → 失败则登出并重定向到 `/login?redirect=...`
4. 登出：`POST /users/logout` → `clearToken()` + `resetInfo()` + `removeRouteListener()` + `clearServerMenu()`
5. userStore 提供 `switchRoles()` 在 'user' ↔ 'admin' 切换（仅调试用）

### 路由机制
- 业务路由通过 `import.meta.glob('./modules/*.ts', { eager: true })` 自动发现
- 同时加载 `./externalModules/*.ts` 用于外部扩展
- 每个模块导出单个路由对象或路由数组
- `/login` 路由在 `router/index.ts` 硬编码，不走模块发现
- 初始路由 `/` → redirect 到 `/login`

### 权限系统
- 路由 `meta.roles` 定义允许角色；`v-permission` 指令控制元素可见性
- `menuFromServer` 标志（默认 false）切换客户端/服务端菜单
- 服务端菜单通过 `appStore.fetchServerMenuConfig()` → `POST /api/user/menu` 获取
- 白名单路由：login, notFound

### 环境变量
- `.env.development` / `.env.production` 设置 `VITE_API_BASE_URL`
- 当前 `.env.development` 值为空 → axios 使用相对路径（同源部署）
- `import.meta.env.MODE !== 'production'` 判断开发环境

### Vite 配置
配置文件在 `config/` 目录（非项目根目录）：
- `config/vite.config.base.ts` — 基础配置
- `config/vite.config.dev.ts` — 开发配置
- `config/vite.config.prod.ts` — 生产配置

所有 scripts 通过 `--config` 指定对应文件。

### 状态管理
- **app store**：主题/侧边栏/设备类型/服务端菜单。`toggleTheme(dark)` 切换 `arco-theme` 属性
- **user store**：认证状态、用户信息、角色。`info()` 从 `/users/info` 获取用户详情
- **tab-bar store**：多标签页，默认初始化为 Dashboard，BAN_LIST 排除 redirect。`resetTabList()` 恢复默认

### 代码规范
- **ESLint**：`airbnb-base` + `@typescript-eslint/recommended` + `plugin:vue/vue3-recommended` + `plugin:prettier/recommended`
- **Prettier**：单引号、分号、80 字符宽、2 空格缩进
- **Stylelint**：`stylelint-config-standard` + `stylelint-config-recommended-vue`
- **Husky**：`pre-commit` 运行 `npm run lint-staged`；`commit-msg` 运行 `pnpm commitlint --edit`
- **提交格式**：Conventional Commits (`type(scope): description`)

### 路由变更通信
`utils/route-listener.ts` 使用 mitt 实现发布订阅模式。组件通过 `listenerRouteChange(handler, immediate)` 订阅路由变更，避免单独监听路由造成的渲染性能浪费。

### 全局组件
`src/components/` 的组件通过 `src/components/index.ts` 插件模式自动注册，无需手动 import。

### 默认设置 (`src/config/settings.json`)
```json
{
  "theme": "light", "navbar": true, "menu": true,
  "footer": true, "tabBar": false, "menuFromServer": false,
  "menuWidth": 220, "themeColor": "#165DFF", "device": "desktop"
}
```
