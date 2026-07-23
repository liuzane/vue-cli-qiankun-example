# 子应用2 - 用户与角色管理

基于 Vue CLI + Vue 2 + Element UI 构建的 Qiankun 微前端子应用，提供用户管理和角色管理页面。表格和分页组件使用 Element UI 直接实现，数据由 MockDB 在浏览器内存中模拟，支持独立开发和运行。

## 项目简介

该应用是 [Vue CLI Qiankun Example](https://github.com/liuzane/vue-cli-qiankun-example) 的微前端子应用之一，独立开发、部署，并通过 Qiankun 框架被主应用加载。主要业务功能：

- 用户列表：展示系统用户数据，支持分页浏览
- 角色列表：展示角色数据，支持分页浏览

所有表格展示及分页操作均使用 Element UI 组件实现，数据来源于 MockDB（内存数据库），无需后端服务即可快速原型开发。

## 技术栈

| 技术                | 说明                                                                 |
| ------------------- | -------------------------------------------------------------------- |
| Vue CLI             | 构建工具，提供开发服务器与打包能力                                     |
| Vue 2               | UI 框架                                                             |
| Vue Router 3        | 内部路由（用户 / 角色页面切换）                                       |
| Vuex 3              | 可选状态管理（本示例未使用）                                          |
| Element UI          | 组件库，提供表格、分页、卡片等 UI 组件                                |
| Qiankun             | 微前端框架，该应用作为子应用接入，需暴露生命周期                       |
| MockDB              | 内存数据库，用于模拟用户、角色数据，支持初始化和查询                   |

## 前置条件

- Node.js >= 8 && <= 16
- npm / yarn / pnpm 均可
- 了解 Qiankun 基本概念及子应用接入规范
- 主应用需能够访问本子应用的开发地址（默认 `http://localhost:3002`）

> 本子应用完全独立，无需依赖其他共享模块，可直接单独启动开发。

## 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/liuzane/vue-cli-qiankun-example.git
cd app2

# 2. 安装依赖
npm install

# 3. 开发模式启动
npm run serve

# 4. 生产构建
npm run build
```

应用默认运行在 `http://localhost:3002`（Vue CLI 默认端口，具体以终端输出为准）。

### 与主应用联调

1. 启动本子应用（确保 `http://localhost:3002` 可访问）
2. 启动主应用（`http://localhost:3000`）
3. 主应用通过 Qiankun 的 `registerMicroApps` 配置 `entry: '//localhost:3002'` 和 `activeRule: '/app2'`，访问主应用的 `/app2` 路径时自动加载本应用。


## 独立访问

在不通过主应用的情况下，可直接访问 `http://localhost:3002`，该应用会独立运行（需自行处理路由根路径）。开发时可通过独立访问快速调试业务逻辑，无需启动主应用。


欢迎提交 Issue 或 PR，共同完善本项目！