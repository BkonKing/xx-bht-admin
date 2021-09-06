import {
  RouteView
} from '@/layouts'

export default {
  path: '/commodity',
  name: 'commodity',
  component: RouteView,
  meta: {
    title: '商品管理'
  },
  redirect: '/commodity/special/list', // 二级菜单需要重定向一个三级菜单地址
  children: [
    {
      path: '/commodity/special/list',
      name: 'specialList',
      component: () => import(/* webpackChunkName: "special" */ '@/views/commodity/special/list'),
      meta: {
        title: '专题管理'
      }
    },
    {
      path: '/commodity/special/detail',
      name: 'specialDetail',
      component: () => import(/* webpackChunkName: "special" */ '@/views/commodity/special/detail'),
      meta: {
        title: '专题详情'
      }
    },
    {
      path: '/commodity/special/edit',
      name: 'specialEdit',
      component: () => import(/* webpackChunkName: "special" */ '@/views/commodity/special/edit'),
      meta: {
        title: '编辑专题'
      }
    }
  ]
}
