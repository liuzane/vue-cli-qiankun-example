import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
    },

    {
      path: '/:prefix(app1|app2)/:rest*',
      name: 'MicroAppContainer',
      component: () => import('@/views/micro-page/index.vue'),
    },
  ],
});

export default router;
