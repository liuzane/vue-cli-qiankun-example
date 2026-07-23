<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>

<script>
// 布局组件
import AppLayout from '@/layout';

export default {
  name: 'App',

  components: {
    AppLayout,
  },
};
</script>

<style>
</style>
