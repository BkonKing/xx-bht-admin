import request from '@/utils/request'

export const userApi = {
  Login: '/slognin/ajax_login',
  Logout: '/system/slognin/logout',
  UserInfo: '/public/common/getAccountInfo',
  updateBasicSet: '/system/account/updateBasicSet',
  updateSecuritySet: '/system/account/updateSecuritySet',
  UserMenu: '/public/common/leftMenu',
  allots: '/public/common/allots',
  bdCode: '/public/common/bdCode',
  bdStatus: '/public/common/bdStatus',
  uploadImg: '/file/uploads/uImages',
  getMessageList: '/public/common/getMessageList',
  getShortMessage: '/public/common/getShortMessage',
  readMessageById: '/public/common/readMessageById',
  readAllMessage: '/public/common/readAllMessage',
  clearMessage: '/public/common/clearMessage',
  getMessageCount: '/public/common/getMessageCount'
}

/**
 * 登录
 * data: {
 *     username: '',
 *     password: '',
 * }
 * @param data
 * @returns {*}
 */
export function login (data) {
  return request({
    url: userApi.Login,
    method: 'post',
    data
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'post'
  })
}

export function updateBasicSet (data) {
  return request({
    url: userApi.updateBasicSet,
    method: 'post',
    data
  })
}

export function updateSecuritySet (data) {
  return request({
    url: userApi.updateSecuritySet,
    method: 'post',
    data
  })
}

export function getDdCode (data) {
  return request({
    url: userApi.bdCode,
    method: 'post',
    data
  })
}

export function getDdStatus (data) {
  return request({
    url: userApi.bdStatus,
    method: 'post',
    data
  })
}

export function uploadImg (data) {
  console.log(data)
  return request({
    url: userApi.uploadImg,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function getMenu () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

// 前端页面权限判断接口
export function getAllots (data) {
  return request({
    url: userApi.allots,
    method: 'post',
    data
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post'
  })
}
// 获取消息列表接口(已验证)
export function toGetMessageList (params) {
  return request({
    url: userApi.getMessageList,
    params
  })
}
// 获取弹窗消息接口(已验证)
export function toGetShortMessage (params) {
  return request({
    url: userApi.getShortMessage

  })
}
// 设置消息已读接口(已验证)
export function toReadMessageById (data) {
  return request({
    url: userApi.readMessageById,
    method: 'post',
    data
  })
}
// 消息全部已读接口(已验证)
export function toReadAllMessage () {
  return request({
    url: userApi.readAllMessage

  })
}
// 清除弹窗通知接口(已验证)
export function toClearMessage (data) {
  return request({
    method: 'post',
    url: userApi.clearMessage,
    data
  })
}
// 获取弹窗消息数量接口
export function getMessageCount () {
  return request({
    url: userApi.getMessageCount
  })
}
