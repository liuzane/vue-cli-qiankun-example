import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes';

Vue.use(VueRouter);

const MICRO_APP_NAME = process.env.VUE_APP_NAME;
const base = window.__POWERED_BY_QIANKUN__ ? `/${MICRO_APP_NAME}` : '/';

const router = new VueRouter({
  mode: 'hash',
  base,
  routes,
});

export default router;
