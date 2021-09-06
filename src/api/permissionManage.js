import request from '@/utils/request'

export const permissionApi = {
  getRoles: '/system/roles/getRoles',
  getAllotsMenus: '/system/roles/getAllotsMenus',
  updateBatchRole: '/system/roles/updateBatchRole',
  removeBatchRole: '/system/roles/removeBatchRole',
  removeRole: '/system/roles/removeRole',
  updateAllotsMenus: '/system/roles/updateAllotsMenus',
  getAdminList: '/system/admin/getAdminList',
  addAdmin: '/system/admin/addAdmin',
  removeAdmin: '/system/admin/removeAdmin',
  updateAdmin: '/system/admin/updateAdmin',
  getAdminMenus: '/system/admin/getAllotsMenus',
  updateAdminMenus: '/system/admin/updateAllotsMenus',
  getAllRoles: '/public/common/getAllRoles',
  getAllProject: '/public/common/getAllProject',
  companyList: '/system/company/companyList',
  addCompany: '/system/company/addCompany',
  updateCompany: '/system/company/updateCompany',
  removeCompany: '/system/company/removeCompany',
  getAllCompanyMenus: '/system/company/getAllotsMenus',
  updateAllCompanyMenus: '/system/company/updateAllotsMenus',
  getLogsList: '/system/logs/getLogsList',
  getLogType: '/public/common/getLogType',
  getLogAdmin: '/public/common/getLogAdmin',
  getMenus: '/system/menus/getMenus',
  updateBatchMenu: '/system/menus/updateBatchMenu',
  removeMenu: '/system/menus/removeMenu',
  removeBatchMenu: '/system/menus/removeBatchMenu'
}
// 角色管理接口(已验证)
export function toGetRoles () {
  return request({
    url: permissionApi.getRoles,
    method: 'post'
  })
}
// 批量添加/编辑角色接口(已验证)
export function toUpdateBatchRole (data) {
  return request({
    url: permissionApi.updateBatchRole,
    method: 'post',
    data
  })
}
// 批量删除角色接口(已验证)
export function toRemoveBatchRole (data) {
  return request({
    url: permissionApi.removeBatchRole,
    method: 'post',
    data
  })
}
// 删除角色接口(已验证)
export function toRemoveRole (data) {
  return request({
    url: permissionApi.removeRole,
    method: 'post',
    data
  })
}
// 角色对应的菜单数据接口(已验证)
export function toGetAllotsMenus (params) {
  return request({
    url: permissionApi.getAllotsMenus,
    method: 'get',
    params
  })
}
// 配置角色对应的权限接口(已验证)
export function toUpdateAllotsMenus (data) {
  return request({
    url: permissionApi.updateAllotsMenus,
    method: 'post',
    data
  })
}
// 人员列表接口(已验证)
export function toGetAdminList (params) {
  return request({
    url: permissionApi.getAdminList,
    method: 'post',
    params
  })
}

// 新增人员接口(已验证)
export function toAddAdmin (data) {
  return request({
    url: permissionApi.addAdmin,
    method: 'post',
    data
  })
}
// 删除人员接口(已验证)
export function toRemoveAdmin (data) {
  return request({
    url: permissionApi.removeAdmin,
    method: 'post',
    data
  })
}
// 修改人员接口(已验证)
export function toUpdateAdmin (data) {
  return request({
    url: permissionApi.updateAdmin,
    method: 'post',
    data
  })
}
// 管理员对应的菜单数据接口(已验证)
export function toGetAdminMenus (params) {
  return request({
    url: permissionApi.getAdminMenus,
    params
  })
}
// 配置管理员对应的权限接口(已验证)
export function toUpdateAdminMenus (data) {
  return request({
    url: permissionApi.updateAdminMenus,
    method: 'post',
    data
  })
}
// 获取所有角色接口(已验证)
export function getAllRoles () {
  return request({
    url: permissionApi.getAllRoles,
    method: 'post'
  })
}
// 所有项目接口(已验证)
export function toGetAllProject (params) {
  return request({
    url: permissionApi.getAllProject,
    method: 'get',
    params
  })
}
// 公司管理接口(已验证)
export function toCompanyList (params) {
  return request({
    url: permissionApi.companyList,
    method: 'get',
    params
  })
}
// 创建公司接口(已验证)
export function toAddCompany (data) {
  return request({
    url: permissionApi.addCompany,
    method: 'post',
    data
  })
}
// 编辑公司接口(已验证)
export function toUpdateCompany (data) {
  return request({
    url: permissionApi.updateCompany,
    method: 'post',
    data
  })
}
// 删除公司接口(已验证)
export function toRemoveCompany (data) {
  return request({
    url: permissionApi.removeCompany,
    method: 'post',
    data
  })
}
// 公司对应的菜单数据接口(已验证)
export function toGetAllCompanyMenus (params) {
  return request({
    url: permissionApi.getAllCompanyMenus,
    method: 'post',
    params
  })
}
// 配置公司对应的权限接口(已验证)
export function toUpdateAllCompanyMenus (data) {
  return request({
    url: permissionApi.updateAllCompanyMenus,
    method: 'post',
    data
  })
}
// 操作日志列表接口(已验证)
export function toGetLogsList (params) {
  return request({
    url: permissionApi.getLogsList,
    params
  })
}
// 操作日志模块接口(已验证)
export function toGetLogType (params) {
  return request({
    url: permissionApi.getLogType,
    params
  })
}
// 日志操作员接口(已验证)
export function toGetLogAdmin () {
  return request({
    url: permissionApi.getLogAdmin

  })
}
// 后台菜单管理对象接口(已验证)
export function toGetMenus (params) {
  return request({
    url: permissionApi.getMenus,
    params
  })
}
// 批量添加/编辑菜单接口(已验证)
export function toUpdateBatchMenu (data) {
  return request({
    url: permissionApi.updateBatchMenu,
    method: 'post',
    data
  })
}
// 删除菜单接口(已验证)
export function toRemoveMenu (data) {
  return request({
    url: permissionApi.removeMenu,
    method: 'post',
    data
  })
}
// 批量删除菜单接口(已验证)
export function toRemoveBatchMenu (data) {
  return request({
    url: permissionApi.removeBatchMenu,
    method: 'post',
    data
  })
}
