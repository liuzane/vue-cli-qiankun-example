const MICRO_APP_NAME = process.env.VUE_APP_NAME;
const basePath = window.__POWERED_BY_QIANKUN__ ? `/${MICRO_APP_NAME}` : '';

export default [
  {
    path: `${basePath}/order`,
    name: 'Order',
    component: () => import('@/views/order/index.vue'),
  },

  {
    path: `${basePath}/product`,
    name: 'Product',
    component: () => import('@/views/product/index.vue'),
  },
];
