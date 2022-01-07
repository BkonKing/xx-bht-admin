import {
  RouteView
} from '@/layouts'

export default {
  path: '/financialCenter',
  name: 'financialCenter',
  component: RouteView,
  meta: {
    title: '财务中心'
  },
  redirect: '/financialCenter/goodsCost', // 二级菜单需要重定向一个三级菜单地址
  children: [
    {
      path: '/financialCenter/goodsCost',
      name: 'financialCenterGoodsCost',
      component: () => import(/* webpackChunkName: "financialCenter" */ '@/views/financialCenter/goodsCost'),
      meta: {
        title: '商品成本'
      }
    }
  ]
}
