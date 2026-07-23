// 基础模块
import { registerMicroApps, start } from 'qiankun';
import Vue from 'vue';
import ElementUI from 'element-ui';

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
    name: process.env.VUE_APP_MICRO_APP1_NAME,
    entry: process.env.VUE_APP_MICRO_APP1_URL,
    container: '#micro-container',
    activeRule: `${process.env.VUE_APP_PUBLIC_PATH}#/${process.env.VUE_APP_MICRO_APP1_NAME}`,
  },
  {
    name: process.env.VUE_APP_MICRO_APP2_NAME,
    entry: process.env.VUE_APP_MICRO_APP2_URL,
    container: '#micro-container',
    activeRule: `${process.env.VUE_APP_PUBLIC_PATH}#/${process.env.VUE_APP_MICRO_APP2_NAME}`,
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
