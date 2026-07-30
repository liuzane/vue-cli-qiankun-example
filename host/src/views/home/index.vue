<template>
  <el-card
    shadow="never"
    class="home-card"
  >
    <!-- 项目标题区域 -->
    <div class="project-header">
      <i class="el-icon-connection title-icon" />
      <el-link
        type="primary"
        target="_blank"
        href="https://github.com/liuzane/vue-cli-qiankun-example"
        class="project-title"
      >
        vue-cli-qiankun-example
      </el-link>
    </div>

    <!-- 项目介绍 -->
    <div class="project-intro">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <i class="el-icon-document" />
                <span>项目概述</span>
              </div>
            </template>
            <p class="project-intro__description">
              本项目是基于 Qiankun + Vue 2 的微前端演示应用，通过主应用（Host）作为基座动态加载两个独立的业务子应用，实现模块解耦与独立部署。
            </p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <i class="el-icon-menu" />
                <span>核心功能</span>
              </div>
            </template>
            <p class="project-intro__description">
              主应用提供全局布局、侧边栏菜单及子应用注册调度；子应用 app1 负责订单管理和产品管理，子应用 app2 负责用户管理和角色管理，均包含列表展示、分页查询等基础操作。
            </p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <i class="el-icon-s-platform" />
                <span>技术架构</span>
              </div>
            </template>
            <p class="project-intro__description">
              采用 Vue CLI 构建，使用 Element UI 组件库，各子应用独立集成 MockDB 模拟数据，通过 Qiankun 实现路由隔离、生命周期管理和跨域通信。
            </p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <i class="el-icon-video-play" />
                <span>运行方式</span>
              </div>
            </template>
            <p class="project-intro__description">
              各模块可独立开发调试，默认端口分别为 3000（主应用）、3001（app1）、3002（app2），按顺序启动子应用后再启动主应用即可统一访问。
            </p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-divider>
      <i class="el-icon-tools" />
      <span>技术栈与依赖</span>
    </el-divider>

    <!-- 技术栈对比表格：主应用 vs 子应用概览 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card
          shadow="never"
          class="tech-card new-tech"
        >
          <template #header>
            <div class="card-header">
              <el-tag
                type="primary"
                size="large"
                effect="dark"
              >
                主应用 (基座)
              </el-tag>
            </div>
          </template>
          <el-descriptions
            :column="1"
            border
            size="small"
          >
            <el-descriptions-item label="微前端框架">
              <el-tag
                size="small"
                type="primary"
              >
                Qiankun
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="路由调度">
              <el-tag
                size="small"
                type="primary"
              >
                Vue Router @3 + activeRule 路由匹配
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="全局布局">
              <el-tag
                size="small"
                type="primary"
              >
                侧边栏 + 顶部导航
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="应用间通信">
              <el-tag
                size="small"
                type="primary"
              >
                Props 传递
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="构建工具">
              <el-tag
                size="small"
                type="primary"
              >
                Vue CLI
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card
          shadow="never"
          class="tech-card old-tech"
        >
          <template #header>
            <div class="card-header">
              <el-tag
                type="warning"
                size="large"
                effect="dark"
              >
                子应用
              </el-tag>
            </div>
          </template>
          <el-descriptions
            :column="1"
            border
            size="small"
          >
            <el-descriptions-item label="技术栈">
              <el-tag
                size="small"
                type="warning"
              >
                Vue 2 / Vue CLI
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="路由">
              <el-tag
                size="small"
                type="warning"
              >
                Vue Router @3 + Hash 路由
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="数据模拟">
              <el-tag
                size="small"
                type="warning"
              >
                MockDB
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="UI 组件">
              <el-tag
                size="small"
                type="warning"
              >
                Element UI
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="独立运行">
              <el-tag
                size="small"
                type="success"
              >
                支持
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-divider>
      <el-icon><InfoFilled /></el-icon>
      架构亮点
    </el-divider>

    <!-- 架构亮点 -->
    <el-row
      :gutter="20"
      class="feature-row"
    >
      <el-col :span="6">
        <el-card
          shadow="never"
          class="feature-item"
        >
          <i class="el-icon-s-operation" style="font-size: 32px; color: #409EFF;" />
          <h4>微前端应用编排</h4>
          <p>基于 Qiankun 构建微前端架构，主应用负责整体布局、菜单导航和应用调度，各业务模块独立开发、独立部署、独立发布，既保证系统整体一致性，又提升业务迭代效率。</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          shadow="never"
          class="feature-item"
        >
          <i class="el-icon-connection" style="font-size: 32px; color: #67C23A;" />
          <h4>主子应用解耦</h4>
          <p>主应用统一管理子应用的注册、加载、挂载和卸载，子应用专注于自身业务实现。各应用既可独立运行进行开发调试，也可无缝接入主应用，实现开发、测试、部署相互独立。</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          shadow="never"
          class="feature-item"
        >
          <i class="el-icon-share" style="font-size: 32px; color: #E6A23C;" />
          <h4>路由隔离与统一调度</h4>
          <p>每个子应用维护独立的路由系统，主应用通过 activeRule 完成应用级路由匹配与切换，实现路由隔离、页面无缝跳转和统一导航，有效避免多应用间的路由冲突。</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          shadow="never"
          class="feature-item"
        >
          <i class="el-icon-set-up" style="font-size: 32px; color: #F56C6C;" />
          <h4>配置化扩展能力</h4>
          <p>采用配置驱动的应用注册机制，新增或下线子应用仅需调整注册配置，无需改动核心框架代码。随着业务不断扩展，可快速接入更多业务模块，保持系统良好的可维护性和可扩展性。</p>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'Home',

  computed: {
    app1Url() {
      const microApp1Url = process.env.VUE_APP_MICRO_APP1_URL;
      const routePath = '#/order';
      return process.env.NODE_ENV === 'development'
        ? `http:${microApp1Url}${routePath}`
        : `${window.location.origin}${microApp1Url}${routePath}`;
    },
    app2Url() {
      const microApp2Url = process.env.VUE_APP_MICRO_APP2_URL;
      const routePath = '#/user';
      return process.env.NODE_ENV === 'development'
        ? `http:${microApp2Url}${routePath}`
        : `${window.location.origin}${microApp2Url}${routePath}`;
    },
  },
};
</script>

<style scoped>
.project-header {
  display: flex;
  align-items: center;
  padding: 16px 0 8px;
  flex-wrap: wrap;
  gap: 12px;
}

.project-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.title-icon {
  font-size: 28px;
  color: #409EFF;
}

.project-intro {
  margin: 16px 0 8px;
}

.project-intro__description {
  color: #606266;
  line-height: 1.8;
  font-size: 14px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.tech-card {
  height: 100%;
}

.tech-card :deep(.el-card__header) {
  background-color: #f5f7fa;
}

.new-tech :deep(.el-card__header) {
  background-color: #ecf5ff;
}

.old-tech :deep(.el-card__header) {
  background-color: #fdf6ec;
}

.feature-row {
  margin: 8px 0 4px;
}

.feature-item {
  text-align: center;
  padding: 20px 12px;
  border-radius: 8px;
  background: #fafafa;
  height: 100%;
  min-height: 160px;
}

.feature-item h4 {
  margin: 12px 0 8px;
  font-size: 16px;
  color: #303133;
}

.feature-item p {
  margin: 0;
  font-size: 13px;
  color: #909399;
  line-height: 1.6;
}

.github-section {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.github-link {
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.el-divider {
  margin: 28px 0 20px;
}

.el-divider .el-icon {
  margin: 0 8px;
}
</style>
