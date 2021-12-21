import Vue from 'vue'
import Router from 'vue-router'
import pageMaps from './pageMaps'
// import {
//   UserLayout,
//   BasicLayout
//   RouteView
//   BlankLayout
// } from '@/layouts'
// import userRoutes from './modules/user'

/**
 * 重写路由的push方法
 */
// 保存原来的push函数
const routerPush = Router.prototype.push
// 重写push函数
Router.prototype.push = function push (location, onComplete, onAbort) {
  if (process.env.NODE_ENV === 'production') {
    let url = `#${location}`
    if (typeof location !== 'string') {
      url = this.resolve(location).href
    }
    const href = url.split('?')[0]
    if (pageMaps[href]) {
      const hash = encodeURIComponent(`/new_version/index.html${url}`)
      const newHref = `/nsolid${pageMaps[href]}?url=${hash}`
      // 如果重新跳转的地址跟顶层地址一样就刷新顶层页面
      if ((top.location.origin + newHref) === top.location.href) {
        top.location.reload()
        return
      }
      top.location.href = newHref
      return
    } else {
      // 调用原来的push函数，并捕获异常
      return routerPush.call(this, location, onComplete, onAbort)
    }
  }
  // 调用原来的push函数，并捕获异常
  return routerPush.call(this, location, onComplete, onAbort)
}

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
const constantRoutes = [{
  path: '',
  redirect: '/commodity'
}]
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
  routes: constantRoutes.concat(asyncRoutes, errorRoute),
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
