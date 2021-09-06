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
      component: () => import('@/views/permissionManage/personList'),
      meta: {
        title: '人员列表'
      }
    },
    {
      path: '/permissionManage/roleManage',
      name: 'roleManage',
      component: () => import('@/views/permissionManage/roleManage'),
      meta: {
        title: '角色管理'
      }
    },
    {
      path: '/permissionManage/companManage',
      name: 'companManage',
      component: () => import('@/views/permissionManage/companManage'),
      meta: {
        title: '公司管理'
      }
    },
    {
      path: '/permissionManage/operaLog',
      name: 'operaLog',
      component: () => import('@/views/permissionManage/operaLog'),
      meta: {
        title: '操作日志'
      }
    },
    {
      path: '/permissionManage/permissMenu',
      name: 'permissMenu',
      component: () => import('@/views/permissionManage/permissMenu'),
      meta: {
        title: '权限菜单'
      }
    }
  ]
}
