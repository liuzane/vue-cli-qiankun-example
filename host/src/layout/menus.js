// 枚举
import { MICRO_APP_NAME } from '@/enums';

export default [
  {
    path: '/',
    title: '首页',
  },

  {
    path: MICRO_APP_NAME.App1,
    title: '微应用1',
    children: [
      {
        path: `/${MICRO_APP_NAME.App1}/order`,
        title: '订单管理',
      },
      {
        path: `/${MICRO_APP_NAME.App1}/product`,
        title: '产品管理',
      },
    ],
  },

  {
    path: MICRO_APP_NAME.App2,
    title: '微应用2',
    children: [
      {
        path: `/${MICRO_APP_NAME.App2}/user`,
        title: '用户管理',
      },
      {
        path: `/${MICRO_APP_NAME.App2}/role`,
        title: '角色管理',
      },
    ],
  },
];
