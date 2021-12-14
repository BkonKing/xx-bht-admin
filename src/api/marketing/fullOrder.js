import request from '@/utils/request'

export const goodsApi = {
  getAllCategory: '/combination_json/getAllCategory',
  getSpecInfo: '/combination_json/getSpecInfo',
  getAllGoods: '/combination_json/getAllGoods',
  getGoodSpec: '/stock/getGoodSpec',
  getSeller: '/combination_json/getSeller',
  goods_edit: '/ajax_commodity/goods_edit',
  edit_goods: '/combination_json/edit_goods'
}

// 获取商品分类
export function getAllCategory (data) {
  return request({
    url: goodsApi.getAllCategory,
    method: 'post',
    data
  })
}

// 获取仓库系统的商品
export function getGoodSpec () {
  const {
    VUE_APP_PRODUCTION_HOST: productionHost,
    VUE_APP_TEST_STORE: testStoreUrl,
    VUE_APP_PRODUCTION_STORE: productionStoreUrl
  } = process.env
  return request({
    url: goodsApi.getGoodSpec,
    baseURL: location.host === productionHost ? productionStoreUrl : testStoreUrl,
    method: 'get'
  })
}

// 根据商品ID和规格ID获取规格信息
export function getSpecInfo (data) {
  return request({
    url: goodsApi.getSpecInfo,
    method: 'post',
    data
  })
}

// 获取所有的商品名称（添加组合商品时使有用）
export function getAllGoods (data) {
  return request({
    url: goodsApi.getAllGoods,
    method: 'post',
    data
  })
}

// 获取所有的供应商
export function getSeller (data) {
  return request({
    url: goodsApi.getSeller,
    method: 'post',
    data
  })
}

// 添加修改（商品）
export function editGoods (data) {
  return request({
    url: goodsApi.goods_edit,
    method: 'post',
    data
  })
}

// 获取编辑商品的信息
export function getEditGoods (data) {
  return request({
    url: goodsApi.edit_goods,
    method: 'post',
    data
  })
}
