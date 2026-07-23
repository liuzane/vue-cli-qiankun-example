// 基础模块
import { registerMicroApps, start } from 'qiankun';
import Vue from 'vue';
import ElementUI from 'element-ui';

// 枚举
import { MICRO_APP_NAME } from '@/enums';

// 路由
import router from './router';

// 样式
import '@/styles';

// 应用入口
import App from './App.vue';


Vue.use(ElementUI, { size: 'small' });

Vue.config.productionTip = false;

// 注册子应用
registerMicroApps([
  {
    name: MICRO_APP_NAME.App1,
    entry: '//localhost:3001',
    container: '#micro-container',
    activeRule: `#/${MICRO_APP_NAME.App1}`,
  },
  {
    name: MICRO_APP_NAME.App2,
    entry: '//localhost:3002',
    container: '#micro-container',
    activeRule: `#/${MICRO_APP_NAME.App2}`,
  },
]);

const DATABASE_NAME = 'vue-cli-qiankun-example-db';
window.mockDB.databaseName = DATABASE_NAME;

async function init() {
  // 数据库模块
  const { initIndexedDB } = window.mockDB.init;
  await initIndexedDB(DATABASE_NAME);

  // 初始化应用
  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app');

  // 启动 qiankun
  start();
}

init();
