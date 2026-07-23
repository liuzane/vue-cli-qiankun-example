<template>
  <el-container id="app">
    <AppSider />
    <el-container direction="vertical">
      <AppHeader />
      <el-main class="main-content">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 组件
import AppHeader from './AppHeader.vue';
import AppSider from './AppSider.vue';

export default {
  name: 'AppLayout',

  components: {
    AppHeader,
    AppSider,
  },
};
</script>

<style scoped>
#app {
  background-color: #f0f2f5;
}

.body-container {
  flex: 1;
  overflow: hidden;
}

.main-content {
  padding: 12px;
  overflow-y: auto;
}
</style>
