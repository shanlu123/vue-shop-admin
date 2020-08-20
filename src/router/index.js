import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/users/Users'
import Rights from '../components/rights/Rights'
import Roles from '../components/rights/Roles'

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
