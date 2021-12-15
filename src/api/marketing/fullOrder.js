import request from '@/utils/request'

export const goodsApi = {
    getActivityList: '/fullorder_json/getActivityList',
    optActivity: '/fullorder_json/optActivity',
    getSpecInfo: '/fullorder_json/getActivityInfo',
    getActivityGoods: '/fullorder_json/getActivityGoods',
    getGoodsCategory: '/fullorder_json/getGoodsCategory',
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
export function getSpecInfo (data) {
    return request({
        url: goodsApi.getSpecInfo,
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
// 获取商品分类
export function getGoodsCategory (data) {
    return request({
        url: goodsApi.getGoodsCategory,
        method: 'post',
        data
    })
}

