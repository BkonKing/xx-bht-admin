import Vue from 'vue'
import Router from 'vue-router'
// import {
//   UserLayout,
//   BasicLayout
//   RouteView
//   BlankLayout
// } from '@/layouts'
// import userRoutes from './modules/user'

Vue.use(Router)

const asyncRoutes = []

const moduleRoutes = require.context('./modules', true, /\.js$/)

moduleRoutes.keys().forEach((name) => {
  const route = moduleRoutes(name).default
  if (Array.isArray(route)) {
    asyncRoutes.push(...route)
  } else {
    asyncRoutes.push(route)
  }
})

export {
  asyncRoutes
}

/**
 * 基础路由
 * @type { *[] }
 */
// export const constantRoutes = [{
//     path: '/user',
//     component: UserLayout,
//     redirect: '/user/login',
//     hidden: true,
//     children: [{
//       path: '/login',
//       name: 'login',
//       meta: {
//         title: '登录'
//       },
//       component: () => import( /* webpackChunkName: "user" */ '@/views/user/Login')
//     }]
//   },

//   {
//     name: 'index',
//     path: '',
//     component: BasicLayout,
//     redirect: '/403', // 首页重定向
//     meta: {
//       title: '首页'
//     },
//     children: asyncRoutes
//   },

//   {
//     path: '/403',
//     name: '403',
//     component: () => import( /* webpackChunkName: "fail" */ '@/views/exception/403')
//   },

//   {
//     path: '/404',
//     name: '404',
//     component: () => import( /* webpackChunkName: "fail" */ '@/views/exception/404')
//   }
// ]

// 找不到路由则显示404
const errorRoute = [{
  path: '*',
  redirect: '/404',
  hidden: true
}]

export default new Router({
  mode: process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true' ? 'history' : 'hash',
  routes: asyncRoutes.concat(errorRoute),
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})
