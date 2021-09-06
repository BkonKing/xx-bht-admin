import 'core-js/stable'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ProLayout, {
  PageHeaderWrapper
} from 'xx-ant-design-vue-pro-layout'
import themePluginConfig from '../config/themePluginConfig'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import * as filters from './filters' // 全局filter

import './mock'

import '@/core/icons'

import bootstrap from './core/bootstrap' // 获取localstorage赋值到vuex
import './core/lazy_use' // 懒加载组件
import './permission' // 路由权限控制
import './styles/global.less' // 全局样式
import './styles/antd-reset.less' // ant 样式覆盖

import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

Vue.use(VueViewer)

Vue.config.productionTip = false

// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

// 注册全局实用过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 注册全局指令
const context = require.context('./directives', true, /index\.js$/)

context.keys().forEach((key) => {
  Object.keys(context(key)).forEach((paramKey) => {
    Vue.use(context(key)[paramKey])
  })
})

new Vue({
  router,
  store,
  // 初始化 localstorage, vuex
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
