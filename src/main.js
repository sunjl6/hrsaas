import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Component from '@/components'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import checkPermission from './mixin/checkPermission'
import '@/styles/index.scss' // global css
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives' // 导入自定义指令

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
Vue.use(Component)
// set ElementUI lang to EN
Vue.mixin(checkPermission) // 添加注册全局混入方法
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册

Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
