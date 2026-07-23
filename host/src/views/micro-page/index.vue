<template>
  <div class="micro-page-wrapper">
    <div id="micro-container" />
    <div
      v-if="loading"
      v-loading="loading"
      element-loading-text="应用加载中"
      element-loading-spinner="el-icon-loading"
      class="loading"
    />
  </div>
</template>

<script>
import { initGlobalState } from 'qiankun';

export default {
  name: 'MicroPage',

  data() {
    return {
      loading: true,
      actions: null,
    };
  },

  watch: {
    '$route.path': {
      handler(newPath, oldPath) {
        // 判断微应用路由是否变化
        if (this.actions && newPath.split('/')[1] !== oldPath.split('/')[1]) {
          this.actions.setGlobalState({ init: false });
        }
      },
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      // 初始化 state
      this.actions = initGlobalState({ init: false });
      this.actions.onGlobalStateChange((state) => {
        this.loading = !state.init;
      });
    },
  },
};
</script>

<style scoped>
.micro-page-wrapper,
.loading {
  height: 100%;
}
</style>
