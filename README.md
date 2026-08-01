# 海语校园论坛后台管理系统 (Haiyu Admin)

<p align="center">
  <strong>校园论坛社区平台 - 后台管理端</strong>
</p>

---

## 项目地址

| 项目 | 地址 |
|------|------|
| 管理后台 | https://schoolforum.sugu6.top/admin/ |
| 在线站点（用户端） | https://schoolforum.sugu6.top |
| GitHub | https://github.com/sugu6/schoolforum-admin |
| Gitee | https://gitee.com/y3342113181/schoolforum-admin |

---

## 项目简介

基于 Vue 3 + TypeScript + Arco Design Pro 构建的校园论坛后台管理系统，用于管理校园论坛的用户、帖子、评论、公告、分类和标签。

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| [Vue](https://vuejs.org/) | 3.x | 前端框架 |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | 类型系统 |
| [Vite](https://vitejs.dev/) | 8.x | 构建工具 |
| [Arco Design Vue](https://arco.design/vue/) | 2.x | UI 组件库 |
| [Pinia](https://pinia.vuejs.org/) | 2.x | 状态管理 |
| [Vue Router](https://router.vuejs.org/) | 4.x | 路由 |
| [Axios](https://axios-http.com/) | 1.x | HTTP 请求 |
| [ECharts](https://echarts.apache.org/) | 5.x | 数据图表 |

---

## 功能模块

- **仪表盘**：数据统计、内容趋势、最近帖子/公告/评论
- **用户管理**：用户列表、角色与状态管理
- **帖子管理**：搜索筛选、置顶/精华切换、删除
- **评论管理**：查看详情、删除
- **公告管理**：CRUD、发布/下架/置顶
- **分类管理**：一级/二级分类维护
- **标签管理**：标签维护与分类关联
- **注销账号管理**：注销申请审核与倒计时
- **搜索索引管理**：重建/清空搜索索引

---

## 快速开始

```bash
# 克隆项目
git clone https://github.com/sugu6/schoolforum-admin.git
cd schoolforum-admin

# 安装依赖
pnpm install

# 启动开发服务器（默认 8081 端口）
pnpm dev

# 类型检查
pnpm type:check

# 生产构建
pnpm build
```

> 生产环境部署在 `/admin/` 子路径（与用户端同域），API 走同域 `/api` 转发。

---

## 相关项目

| 项目 | 仓库 |
|------|------|
| 用户端前端 | [sugu6/schoolforum](https://github.com/sugu6/schoolforum) |
| 后端服务 | [sugu6/schoolforum-backend](https://github.com/sugu6/schoolforum-backend) |
