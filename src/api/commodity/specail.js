import request from '@/utils/request'

export const specailApi = {
  searchGoods: '/commodity_special/searchGoods',
  getAllSpecial: '/commodity_special/getAllSpecial',
  getCategory: '/commodity_special/getCategory',
  getGoods: '/commodity_special/getGoods',
  getSpecByGoodsId: '/commodity_special/getSpecByGoodsId',
  addSpecial: '/commodity_special/addSpecial',
  delSpecial: '/commodity_special/delSpecial',
  getSpecialById: '/commodity_special/getSpecialById',
  getList: '/commodity_special/getList'
}

// 获取所有的商品（添加专题图文使用）
export function searchGoods (data) {
  return request({
    url: specailApi.searchGoods,
    method: 'post',
    data
  })
}

// 获取所有专题（添加专题图文使用）
export function getAllSpecial (data) {
  return request({
    url: specailApi.getAllSpecial,
    method: 'post',
    data
  })
}

// 获取所有的商品分类
export function getCategory (data) {
  return request({
    url: specailApi.getCategory,
    method: 'post',
    data
  })
}

// 获取所有的商品（添加专题商品使用）
export function getGoods (data) {
  return request({
    url: specailApi.getGoods,
    method: 'post',
    data
  })
}

// 根据商品ID获取规格
export function getSpecByGoodsId (data) {
  return request({
    url: specailApi.getSpecByGoodsId,
    method: 'post',
    data
  })
}

export function addSpecial (data) {
  return request({
    url: specailApi.addSpecial,
    method: 'post',
    data
  })
}

export function delSpecial (data) {
  return request({
    url: specailApi.delSpecial,
    method: 'post',
    data
  })
}

export function getSpecialById (data) {
  return request({
    url: specailApi.getSpecialById,
    method: 'post',
    data
  })
}

export function getList (data) {
  return request({
    url: specailApi.getList,
    method: 'post',
    data
  })
}
