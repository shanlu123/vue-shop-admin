import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import './plugins/element.js'

import './assets/css/global.css'
import './assets/font/iconfont.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

// 时间格式化的全局过滤器
Vue.filter('dateFormat', function(oldVal) {
  const dt = new Date(oldVal)
  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDate() + '').padStart(2, '0')
  const hour = (dt.getHours() + '').padStart(2, '0')
  const minute = (dt.getMinutes() + '').padStart(2, '0')
  const seconds = (dt.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
