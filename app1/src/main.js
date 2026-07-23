import './public-path';

// 基础模块
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

let instance = null;


// 渲染应用
async function render(props = {}) {
  const { container } = props;
  instance = new Vue({
    router,
    render: h => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}


// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

const MICRO_APP_NAME = process.env.VUE_APP_NAME;

// 应用引导初始化：微应用首次加载时执行一次
export async function bootstrap() {
  console.log(`${MICRO_APP_NAME} bootstrap`);
}


// 应用挂载：每次进入微应用时执行
export async function mount(props) {
  console.log(`${MICRO_APP_NAME} mount`, props);
  render(props);
  // 项目渲染完成
  props.setGlobalState({ init: true });
}


// 应用卸载：每次离开微应用时执行
export async function unmount() {
  console.log(`${MICRO_APP_NAME} unmount`);
  if (instance) {
    instance.$destroy();
    instance = null;
  }
}
