import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import NProgress from 'nprogress'

// elementui中的样式
import './plugins/element.js'

// 全局样式表
import './assets/css/global.css'

// 阿里字体图标样式
import './assets/font/iconfont.css'

// 富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 进度条样式
import 'nprogress/nprogress.css'

// 配置axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  NProgress.start() // 在请求拦截器中显示进度条
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done() // 在响应拦截器中隐藏进度条
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

// 树形表格控件
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

// 富文本编辑器
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
