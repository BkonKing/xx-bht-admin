import request from '@/utils/request'

export const goodsApi = {
  goodsCost: '/goodscost_json/goods',
  saveSpecsCost: '/ajax_goodscost/submit_goods_specs_cost'
}

// 获取商品成本表
export function getGoodsCost (data) {
  return request({
    url: goodsApi.goodsCost,
    method: 'post',
    data
  })
}

// 保存商品成本
export function saveSpecsCost (data) {
  return request({
    url: goodsApi.saveSpecsCost,
    method: 'post',
    data
  })
}
