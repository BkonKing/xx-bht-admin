import request from '@/utils/request'

export const goodsApi = {
  getActivityList: '/fullorder_json/getActivityList',
  optActivity: '/fullorder_json/optActivity',
  getActivityInfo: '/fullorder_json/getActivityInfo',
  addActivity: '/fullorder_json/addActivity',
  getActivityGoods: '/fullorder_json/getActivityGoods',
  getGoodsList: '/fullorder_json/getGoodsList',
  getGoodsListByIds: '/fullorder_json/getGoodsListByIds',
  getGoodsCategory: '/fullorder_json/getGoodsCategory',
  getDiscountList: '/fullorder_json/getDiscountList',
  optSetting: '/fullorder_json/optSetting',
  getDiscountDetail: '/fullorder_json/getDiscountDetail'
}

// 获取满件活动列表
export function getActivityList (data) {
  return request({
    url: goodsApi.getActivityList,
    method: 'post',
    data
  })
}

// 获取满件活动列表
export function optActivity (data) {
  return request({
    url: goodsApi.optActivity,
    method: 'post',
    data
  })
}
// 获取活动详情
export function getActivityInfo (data) {
  return request({
    url: goodsApi.getActivityInfo,
    method: 'post',
    data
  })
}
// 添加修改活动
export function saveActivity (data) {
  return request({
    url: goodsApi.addActivity,
    method: 'post',
    data
  })
}
// 根据活动id获取商品列表
export function getActivityGoods (data) {
  return request({
    url: goodsApi.getActivityGoods,
    method: 'post',
    data
  })
}
// 获取所有商品
export function getGoodsList (data) {
  return request({
    url: goodsApi.getGoodsList,
    method: 'post',
    data
  })
}
// 根据商品ID串获取商品列表
export function getGoodsListByIds (data) {
  return request({
    url: goodsApi.getGoodsListByIds,
    method: 'post',
    data
  })
}
// 获取商品分类
export function getGoodsCategory (data) {
  return request({
    url: goodsApi.getGoodsCategory,
    method: 'post',
    data
  })
}
// 获取优惠设置列表
export function getDiscountList (data) {
  return request({
    url: goodsApi.getDiscountList,
    method: 'post',
    data
  })
}
// 操作优惠设置
export function setDiscount (data) {
  return request({
    url: goodsApi.optSetting,
    method: 'post',
    data
  })
}
// 根据ID获取优惠设置
export function getDiscountDetail (data) {
  return request({
    url: goodsApi.getDiscountDetail,
    method: 'post',
    data
  })
}
