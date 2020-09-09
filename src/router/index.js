import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
  import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login')
const Home = () =>
  import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home')
const Welcome = () =>
  import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome')

const Users = () =>
  import(/* webpackChunkName: "Users" */ '../components/users/Users')

const Rights = () =>
  import(/* webpackChunkName: "Rights_Roles" */ '../components/rights/Rights')
const Roles = () =>
  import(/* webpackChunkName: "Rights_Roles" */ '../components/rights/Roles')

const Categories = () =>
  import(/* webpackChunkName: "Categories_Params_Goods_Add" */ '../components/goods/Categories')
const Params = () =>
  import(/* webpackChunkName: "Categories_Params_Goods_Add" */ '../components/goods/Params')
const Goods = () =>
  import(/* webpackChunkName: "Categories_Params_Goods_Add" */ '../components/goods/Goods')
const Add = () =>
  import(/* webpackChunkName: "Categories_Params_Goods_Add" */ '../components/goods/Add')

const Orders = () =>
  import(/* webpackChunkName: "Orders" */ '../components/order/Orders')

const Reports = () =>
  import(/* webpackChunkName: "Reports" */ '../components/report/Reports')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [{
      path: '/home/welcome',
      component: Welcome
    }, {
      path: '/home/users',
      component: Users
    }, {
      path: '/home/rights',
      component: Rights
    }, {
      path: '/home/roles',
      component: Roles
    }, {
      path: '/home/categories',
      component: Categories
    }, {
      path: '/home/params',
      component: Params
    }, {
      path: '/home/goods',
      component: Goods
    }, {
      path: '/home/add',
      component: Add
    }, {
      path: '/home/orders',
      component: Orders
    }, {
      path: '/home/reports',
      component: Reports
    }]
  }
]

const router = new VueRouter({
  routes
})

// 为路由添加路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  else {
    const token = window.sessionStorage.getItem('token')
    if (token) next()
    else {
      next('/login')
    }
  }
})

export default router
