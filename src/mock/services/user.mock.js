import {
  specailApi
} from '@/api/commodity/specail'

// export const UserMenu = [
//   RegExp(specailApi.searchGoods),
//   'post',
//   {
//     code: '200',
//     success: true,
//     message: 'OK',
//     list: [
//       {
//         id: 1,
//         goods_name: '见山·佛手【吟秋】八月'
//       },
//       {
//         id: 2,
//         goods_name: '测试测试测试测试商品'
//       },
//       {
//         id: 3,
//         goods_name: '见山·水仙【吟秋】'
//       },
//       {
//         id: 4,
//         goods_name: '厚道·水仙'
//       },
//       {
//         id: 5,
//         goods_name: '见山·肉桂[观月]1'
//       },
//       {
//         id: 6,
//         goods_name: '厚道·肉桂'
//       },
//       {
//         id: 7,
//         goods_name: '见山·铁罗汉[观月]1'
//       },
//       {
//         id: 8,
//         goods_name: '2021年一月试喝茶'
//       },
//       {
//         id: 9,
//         goods_name: '八月会员试喝茶'
//       },
//       {
//         id: 10,
//         goods_name: '忘山·肉桂【咏月】1'
//       },
//       {
//         id: 11,
//         goods_name: '藏山·老枞【咏月】'
//       },
//       {
//         id: 12,
//         goods_name: '九月会员试喝茶'
//       },
//       {
//         id: 13,
//         goods_name: '会员专供|牛栏坑纯料肉桂【限量】'
//       },
//       {
//         id: 14,
//         goods_name: '限量礼盒'
//       },
//       {
//         id: 15,
//         goods_name: '见山·肉桂【霜华】'
//       },
//       {
//         id: 16,
//         goods_name: '见山·黄观音【霜华】2020年10月新茶'
//       },
//       {
//         id: 17,
//         goods_name: '十月会员试喝茶'
//       },
//       {
//         id: 21,
//         goods_name: '特级岩茶'
//       },
//       {
//         id: 23,
//         goods_name: '忘山·古井老枞【龙潜】 2020年11月新茶'
//       },
//       {
//         id: 24,
//         goods_name: '藏山·水帘洞肉桂【龙潜】 2020年11月新茶'
//       },
//       {
//         id: 25,
//         goods_name: '十一月会员试喝茶'
//       },
//       {
//         id: 26,
//         goods_name: '1.1元——厚道好茶包邮秒杀'
//       },
//       {
//         id: 27,
//         goods_name: '藏山·石乳[嘉平]2020年12月新茶'
//       },
//       {
//         id: 28,
//         goods_name: '藏山·状元大红袍[嘉平]'
//       },
//       {
//         id: 29,
//         goods_name: '十二月会员试喝茶'
//       },
//       {
//         id: 30,
//         goods_name: '见山·铁罗汉[观月]2020年12月新茶'
//       },
//       {
//         id: 31,
//         goods_name: '忘山·肉桂【咏月】'
//       },
//       {
//         id: 32,
//         goods_name: '见山·肉桂[花朝]'
//       },
//       {
//         id: 33,
//         goods_name: '弥陀岩·水仙[花朝]'
//       },
//       {
//         id: 34,
//         goods_name: '2021年二月试喝茶'
//       },
//       {
//         id: 35,
//         goods_name: '见山·佛手【吟秋】'
//       },
//       {
//         id: 36,
//         goods_name: '藏山·竹窠老枞【晓春】'
//       },
//       {
//         id: 37,
//         goods_name: '2021年三月试喝茶'
//       },
//       {
//         id: 38,
//         goods_name: '忘山·牛栏肉桂【清和】'
//       },
//       {
//         id: 40,
//         goods_name: '见山·肉桂【观月】'
//       },
//       {
//         id: 41,
//         goods_name: '2021年四月试喝茶'
//       },
//       {
//         id: 42,
//         goods_name: '忘山·古井老枞【龙潜】'
//       },
//       {
//         id: 43,
//         goods_name: '藏山·水帘洞肉桂【龙潜】'
//       },
//       {
//         id: 44,
//         goods_name: '2021年五月试喝茶'
//       },
//       {
//         id: 45,
//         goods_name: '藏山·石乳[嘉平]'
//       },
//       {
//         id: 46,
//         goods_name: '见山·铁罗汉[观月]'
//       },
//       {
//         id: 47,
//         goods_name: '2021年六月试喝茶'
//       },
//       {
//         id: 48,
//         goods_name: '见山·黄观音【霜华】'
//       },
//       {
//         id: 49,
//         goods_name: '藏山·白鸡冠【季夏】'
//       },
//       {
//         id: 50,
//         goods_name: '2021年七月试喝茶'
//       }
//     ]
//   }
// ]

// export const getCategory = [
//   RegExp(specailApi.getCategory),
//   'post',
//   {
//     code: '200',
//     success: true,
//     message: 'OK',
//     list: [
//       {
//         id: '1',
//         category_name: '茶叶'
//       },
//       {
//         id: '6',
//         category_name: '见山'
//       },
//       {
//         id: '7',
//         category_name: '藏山'
//       },
//       {
//         id: '8',
//         category_name: '忘山'
//       }
//     ]
//   }
// ]

// export const getGoods = [
//   RegExp(specailApi.getGoods),
//   'post',
//   {
//     code: '200',
//     success: true,
//     message: 'OK',
//     list: [
//       {
//         id: 15,
//         goods_name: '见山·肉桂【霜华】',
//         thumb: '/library/uploads/image/20200924/20200924165825_92343.jpg',
//         is_open: 1,
//         category_id: '6',
//         category_name: '见山',
//         shelf: '上架'
//       },
//       {
//         id: 16,
//         goods_name: '肉桂',
//         thumb: '/library/uploads/image/20200924/20200924165825_92343.jpg',
//         is_open: 0,
//         category_id: '6',
//         category_name: '见山',
//         shelf: '下架'
//       }
//     ]
//   }
// ]

// export const getAllSpecial = [
//   RegExp(specailApi.getAllSpecial),
//   'post',
//   {
//     code: '200',
//     success: true,
//     message: 'OK',
//     list: [
//       {
//         id: '6',
//         title: '专题1'
//       },
//       {
//         id: '7',
//         title: '专题2'
//       },
//       {
//         id: '8',
//         title: '专题2'
//       },
//       {
//         id: '33',
//         title: '专题图文20210903'
//       }
//     ]
//   }
// ]

// export const getSpecByGoodsId = [
//   RegExp(specailApi.getSpecByGoodsId),
//   'post',
//   {
//     code: '200',
//     success: true,
//     message: 'OK',
//     list: [
//       {
//         id: 15,
//         goods_name: '见山·黄观音【霜华】',
//         spec_list: [
//           {
//             s_price: '42.00',
//             vip_price: '37.00',
//             e_price: '35.00',
//             stock: 9,
//             volume: 2,
//             id: 85,
//             specs_name: '8.3g/泡*6泡/盒',
//             auction_stock: 7
//           },
//           {
//             s_price: '84.00',
//             vip_price: '74.00',
//             e_price: '70.00',
//             stock: 9,
//             volume: 1,
//             id: 86,
//             specs_name: '8.3g/泡*12泡/盒',
//             auction_stock: 8
//           },
//           {
//             s_price: '210.00',
//             vip_price: '185.00',
//             e_price: '175.00',
//             stock: 6,
//             volume: 0,
//             id: 88,
//             specs_name: '8.3g/泡*30泡/盒',
//             auction_stock: 6
//           }
//         ]
//       }
//       // {
//       //   id: 49,
//       //   goods_name: '黄观音',
//       //   spec_list: [
//       //     {
//       //       s_price: '42.00',
//       //       vip_price: '37.00',
//       //       e_price: '35.00',
//       //       stock: 9,
//       //       volume: 2,
//       //       id: 85,
//       //       specs_name: '8.3g/泡*6泡/盒',
//       //       auction_stock: 7
//       //     }
//       //   ]
//       // }
//     ]
//   }
// ]

// import {
//   userApi
// } from '@/api/user'
// import {
//   asyncRoutes
// } from '@/router'

// const setMenu = (data) => {
//   return data.map(obj => {
//     delete obj.component
//     if (obj.children && obj.children.length) {
//       obj.children = setMenu(obj.children)
//     }
//     return obj
//   })
// }

// export const UserMenu = [
//   RegExp(userApi.UserMenu),
//   'get',
//   {
//     code: '200',
//     success: true,
//     message: 'OK',
//     data: setMenu(asyncRoutes)
//   }
// ]
