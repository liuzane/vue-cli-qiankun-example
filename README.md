# Qiankun Vue CLI Example

一个基于 Qiankun + Vue 构建的微前端演示项目。包含一个主应用（Host）和两个业务子应用（订单/产品管理、用户/角色管理）。每个子应用独立开发、部署，由主应用通过 Qiankun 动态加载，并共用 MockDB 提供的本地模拟数据服务。


## 项目结构

```
qiankun-vue-cli-example/
├── host/                 # 主应用（基座） - 全局布局、菜单、子应用注册与加载
├── app1/                 # 子应用1 - 订单管理、产品管理
└── app2/                 # 子应用2 - 用户管理、角色管理
```


## 模块说明

| 模块     | 描述                                                                 | 默认开发地址       |
| -------- | -------------------------------------------------------------------- | ------------------ |
| **host** | 主应用，提供整体布局、侧边栏菜单，通过 Qiankun 注册并加载子应用。       | `http://localhost:3000` |
| **app1** | 子应用1，展示订单列表和产品列表，使用 Element UI 表格、分页及 MockDB 数据。 | `http://localhost:3001` |
| **app2** | 子应用2，展示用户列表和角色列表，同样使用 Element UI 组件与 MockDB 数据。 | `http://localhost:3002` |


## 技术栈

- **微前端框架**：Qiankun
- **构建工具**：Vue CLI
- **前端框架**：Vue 2
- **路由**：Vue Router 3（各应用独立路由）
- **UI 组件库**：Element UI
- **本地数据模拟**：MockDB（由各子应用独立使用）


## 快速开始

### 前置要求

- Node.js >= 8 && <= 16
- npm / yarn / pnpm

### 配置 Git 大小写敏感

Mac/Windows 用户请执行：

```bash
git config core.ignorecase false
```

### 安装依赖

依次进入每个模块目录安装依赖：

```bash
npm install --prefix host && npm install --prefix app1 && npm install --prefix app2
```

### 启动开发环境（推荐顺序）

1. **启动子应用 app1 和 app2**（建议先启动，避免主应用加载超时）

```bash
# 新终端
cd app1 && npm run serve

# 新终端
cd app2 && npm run serve
```

2. **启动主应用 host**

```bash
cd host
npm run serve
```

3. 访问主应用：`http://localhost:8080`

> 若端口被占用，请查看各模块启动日志中的实际端口，并修改 host 中配置的子应用地址（环境变量或 `micro-app.js` 配置）。

### 独立访问各模块

- app1（订单/产品）：`http://localhost:8081` （可独立开发调试，MockDB 数据自动初始化）
- app2（用户/角色）：`http://localhost:8082`
- host 主应用：`http://localhost:8080`

### 打包项目

在根目录执行以下命令：

```bash
npm run build --prefix host && npm run build --prefix app1 && npm run build --prefix app2
```

各子应用会分别在各自目录的 `dist/` 中生成打包产物。若需统一部署，可将 `host/dist/` 作为主入口，子应用 `dist/` 部署到对应子路径（如 `app1/`、`app2/`），并确保主应用中 `activeRule` 配置正确。


## 注意事项

- Qiankun 要求子应用必须暴露 `bootstrap`、`mount`、`unmount` 生命周期函数，本示例已通过 Vue CLI 插件 `@vue/cli-plugin-qiankun` 自动配置。
- 各子应用使用 MockDB 初始化本地数据，数据仅在内存中保存，刷新页面会重置。
- 跨域问题已在各子应用的 `vue.config.js` 中通过 `devServer` 配置解决，生产环境需由服务器配置 CORS 或使用 `nginx` 转发。

---

欢迎提交 Issue 或 PR，共同完善本项目！


## 线上地址
https://liuzane.github.io/qiankun-vue-cli-example


## 许可证
MIT License
Copyright (c) 2026-present, liuzane