const MICRO_APP_NAME = process.env.VUE_APP_NAME;
const basePath = window.__POWERED_BY_QIANKUN__ ? `/${MICRO_APP_NAME}` : '';

export default [
  {
    path: `${basePath}/user`,
    name: 'User',
    component: () => import('@/views/user/index.vue'),
  },

  {
    path: `${basePath}/role`,
    name: 'Role',
    component: () => import('@/views/role/index.vue'),
  },
];
