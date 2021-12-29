import {
  PageView
} from '@/layouts'

export default {
  path: '/permissionManage',
  name: 'permissionManage',
  component: PageView,
  meta: {
    title: '权限管理',
    icon: 'table'
  },
  redirect: '/permissionManage/personList',
  children: [
    {
      path: '/permissionManage/personList',
      name: 'personList',
      component: () => import(/* webpackChunkName: "user" */ '@/views/permissionManage/personList'),
      meta: {
        title: '人员列表'
      }
    },
    {
      path: '/permissionManage/roleManage',
      name: 'roleManage',
      component: () => import(/* webpackChunkName: "user" */ '@/views/permissionManage/roleManage'),
      meta: {
        title: '角色管理'
      }
    },
    {
      path: '/permissionManage/companManage',
      name: 'companManage',
      component: () => import(/* webpackChunkName: "user" */ '@/views/permissionManage/companManage'),
      meta: {
        title: '公司管理'
      }
    },
    {
      path: '/permissionManage/operaLog',
      name: 'operaLog',
      component: () => import(/* webpackChunkName: "user" */ '@/views/permissionManage/operaLog'),
      meta: {
        title: '操作日志'
      }
    },
    {
      path: '/permissionManage/permissMenu',
      name: 'permissMenu',
      component: () => import(/* webpackChunkName: "user" */ '@/views/permissionManage/permissMenu'),
      meta: {
        title: '权限菜单'
      }
    }
  ]
}
