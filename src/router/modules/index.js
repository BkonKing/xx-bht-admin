export default [
  {
    path: '/MessageCenter/index',
    name: 'MessageCenterIndex',
    component: () => import('@/views/user/MessageCenter'),
    meta: {
      title: '消息中心'
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/user/Account'),
    meta: {
      title: '账号中心'
    },
    redirect: '/account/base',
    children: [{
      path: '/account/base',
      name: 'AccountBase',
      component: () => import('@/views/user/Account/BaseSetting'),
      meta: {
        title: '基本设置'
      }
    }, {
      path: '/account/security',
      name: 'AccountSecurity',
      component: () => import('@/views/user/Account/Security'),
      meta: {
        title: '安全设置'
      }
    }]
  }

]
