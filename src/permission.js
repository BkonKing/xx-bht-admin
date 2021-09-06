import router from './router'
// import store from './store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import {
  setDocumentTitle,
  domTitle
} from '@/utils/domUtil'
// import {
//   getAllots
// } from '@/api/user'
// import storage from 'store'
// import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

// const allowList = ['login'] // 免登录路由name
// const allotWhiteList = ['login', '403', '404'] // 免权限路由name
// const loginRoutePath = '/user/login'

router.beforeEach(async (to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  next()
  // if (!allotWhiteList.includes(to.name)) {
  //   const {
  //     data: permissions
  //   } = await getAllots({
  //     limitsPath: to.path
  //   })
  //   if (permissions.limitsPath) {
  //     store.commit('SET_PERMISSIONS', permissions)
  //   } else {
  //     next({
  //       path: '/403'
  //     })
  //   }
  // }
  // if (storage.get('access_token')) {
  //   next()
  // } else {
  //   if (allowList.includes(to.name)) {
  //     // 在免登录名单，直接进入
  //     next()
  //   } else {
  //     next({
  //       path: loginRoutePath,
  //       query: {
  //         redirect: to.fullPath
  //       }
  //     })
  //     NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
  //   }
  // }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
