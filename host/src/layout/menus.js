const APP1 = process.env.VUE_APP_MICRO_APP1_NAME;
const APP2 = process.env.VUE_APP_MICRO_APP2_NAME;

export default [
  {
    path: '/',
    title: '首页',
  },

  {
    path: APP1,
    title: '微应用1',
    children: [
      {
        path: `/${APP1}/order`,
        title: '订单管理',
      },
      {
        path: `/${APP1}/product`,
        title: '产品管理',
      },
    ],
  },

  {
    path: APP2,
    title: '微应用2',
    children: [
      {
        path: `/${APP2}/user`,
        title: '用户管理',
      },
      {
        path: `/${APP2}/role`,
        title: '角色管理',
      },
    ],
  },
];
