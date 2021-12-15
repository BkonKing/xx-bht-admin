import {
  RouteView
} from '@/layouts'

export default {
  path: '/marketing',
  name: 'marketing',
  component: RouteView,
  meta: {
    title: '营销中心'
  },
  redirect: '/marketing/fullOrder/list', // 二级菜单需要重定向一个三级菜单地址
  children: [
    {
      path: '/marketing/setting',
      name: 'marketingSetting',
      component: () => import(/* webpackChunkName: "marketing" */ '@/views/marketing/setting'),
      meta: {
        title: '营销设置'
      }
    },
    {
      path: '/marketing/fullOrder/list',
      name: 'fullOrderList',
      component: () => import(/* webpackChunkName: "fullOrder" */ '@/views/marketing/fullOrder/list'),
      meta: {
        title: '满件优惠'
      }
    },
    {
      path: '/marketing/fullOrder/detail',
      name: 'fullOrderDetail',
      component: () => import(/* webpackChunkName: "fullOrder" */ '@/views/marketing/fullOrder/detail'),
      meta: {
        title: '活动详情'
      }
    },
    {
      path: '/marketing/fullOrder/edit',
      name: 'fullOrderEdit',
      component: () => import(/* webpackChunkName: "fullOrder" */ '@/views/marketing/fullOrder/edit'),
      meta: {
        title: '活动编辑'
      }
    }
  ]
}
