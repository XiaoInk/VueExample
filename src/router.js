import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'

Vue.use(VueRouter)

// 定义路由
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home, redirect: '/welcome', children: [{ path: '/welcome', component: Welcome }] }
]

// 定义路由对象
const router = new VueRouter({
  routes
})

// 导出路由对象
export default router
