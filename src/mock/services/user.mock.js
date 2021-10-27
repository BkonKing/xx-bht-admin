// import { goodsApi } from '@/api/commodity/goods'

// export const getAllCategory = [
//   RegExp(goodsApi.getAllCategory),
//   'post',
//   {
//     code: 200,
//     message: '成功',
//     success: true,
//     list: [
//       {
//         category_name: '茶叶',
//         id: 1,
//         parent_id: 0,
//         list_order: 0,
//         children: [
//           {
//             category_name: '见山',
//             id: 6,
//             parent_id: 1,
//             list_order: 0,
//             children: ''
//           },
//           {
//             category_name: '藏山',
//             id: 7,
//             parent_id: 1,
//             list_order: 0,
//             children: ''
//           },
//           {
//             category_name: '忘山',
//             id: 8,
//             parent_id: 1,
//             list_order: 0,
//             children: ''
//           }
//         ]
//       },
//       {
//         category_name: '测试',
//         id: 2,
//         parent_id: 0,
//         list_order: 0,
//         children: ''
//       },
//       {
//         category_name: '器具',
//         id: 3,
//         parent_id: 0,
//         list_order: 0,
//         children: [
//           {
//             category_name: '茶杯',
//             id: 4,
//             parent_id: 3,
//             list_order: 0,
//             children: ''
//           },
//           {
//             category_name: '酒杯',
//             id: 5,
//             parent_id: 3,
//             list_order: 0,
//             children: ''
//           }
//         ]
//       }
//     ]
//   }
// ]

// export const getGoodSpec = [
//   RegExp(goodsApi.getGoodSpec),
//   'post',
//   {
//     code: '200',
//     message: '请求成功',
//     success: true,
//     list: [
//       {
//         id: 5,
//         name: '见山肉桂[观月]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 39
//       },
//       {
//         id: 6,
//         name: '见山肉桂[观月]02',
//         spec: '12泡装（8.3克/泡）',
//         num: 9
//       },
//       {
//         id: 7,
//         name: '见山肉桂[观月]03',
//         spec: '散茶（8.3克/泡）',
//         num: 4
//       },
//       {
//         id: 8,
//         name: '见山铁罗汉[观月]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 13
//       },
//       {
//         id: 9,
//         name: '见山铁罗汉[观月]02',
//         spec: '12泡装（8.3克/泡）',
//         num: 9
//       },
//       {
//         id: 10,
//         name: '见山铁罗汉[观月]03',
//         spec: '散茶（8.3克/泡）',
//         num: 18
//       },
//       {
//         id: 11,
//         name: '见山水仙[吟秋]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 5
//       },
//       {
//         id: 12,
//         name: '见山水仙[吟秋]02',
//         spec: '12泡装（8.3克/泡）',
//         num: 6
//       },
//       {
//         id: 13,
//         name: '见山水仙[吟秋]03',
//         spec: '30泡装（8.3克/泡）',
//         num: 4
//       },
//       {
//         id: 14,
//         name: '见山水仙[吟秋]04',
//         spec: '散茶（8.3克/泡）',
//         num: 0
//       },
//       {
//         id: 15,
//         name: '见山佛手[吟秋]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 17
//       },
//       {
//         id: 16,
//         name: '见山佛手[吟秋]02',
//         spec: '12泡装（8.3克/泡）',
//         num: 4
//       },
//       {
//         id: 17,
//         name: '见山佛手[吟秋]03',
//         spec: '30泡装（8.3克/泡）',
//         num: 0
//       },
//       {
//         id: 18,
//         name: '见山佛手[吟秋]04',
//         spec: '散茶（8.3克/泡）',
//         num: 8
//       },
//       {
//         id: 19,
//         name: '忘山·肉桂[咏月]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 37
//       },
//       {
//         id: 20,
//         name: '忘山·肉桂[咏月]02',
//         spec: '散茶（8.3克/泡）',
//         num: 5
//       },
//       {
//         id: 21,
//         name: '藏山·老枞[咏月]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 11
//       },
//       {
//         id: 22,
//         name: '藏山·老枞[咏月]02',
//         spec: '散茶（8.3克/泡）',
//         num: 0
//       },
//       {
//         id: 23,
//         name: '牛栏坑肉桂',
//         spec: '单泡装（8.3克/泡）',
//         num: 9
//       },
//       {
//         id: 24,
//         name: '限量牛肉礼盒',
//         spec: '铜罐*1+竹盒*1',
//         num: 19
//       },
//       {
//         id: 25,
//         name: '见山·肉桂[霜华]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 25
//       },
//       {
//         id: 26,
//         name: '见山·肉桂[霜华]02',
//         spec: '30泡装（8.3克/泡）',
//         num: 2
//       },
//       {
//         id: 27,
//         name: '见山·肉桂[霜华]03',
//         spec: '散茶（8.3克/泡）',
//         num: 4
//       },
//       {
//         id: 28,
//         name: '见山·黄观音[霜华]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 9
//       },
//       {
//         id: 29,
//         name: '见山·黄观音[霜华]02',
//         spec: '30泡装（8.3克/泡）',
//         num: 6
//       },
//       {
//         id: 30,
//         name: '见山·黄观音[霜华]03',
//         spec: '散茶（8.3克/泡）',
//         num: 25
//       },
//       {
//         id: 31,
//         name: '忘山·古井老枞[龙潜]01',
//         spec: '3泡装（10克/泡）',
//         num: 40
//       },
//       {
//         id: 32,
//         name: '忘山·古井老枞[龙潜]02',
//         spec: '散茶（10克/泡）',
//         num: 16
//       },
//       {
//         id: 33,
//         name: '藏山·水帘洞肉桂[龙潜]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 44
//       },
//       {
//         id: 34,
//         name: '藏山·水帘洞肉桂[龙潜]02',
//         spec: '散茶（8.3克/泡）',
//         num: 16
//       },
//       {
//         id: 35,
//         name: '藏山·石乳[嘉平]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 27
//       },
//       {
//         id: 36,
//         name: '藏山·石乳[嘉平]02',
//         spec: '12泡装（8.3克/泡）',
//         num: 0
//       },
//       {
//         id: 37,
//         name: '藏山·石乳[嘉平]03',
//         spec: '散茶（8.3克/泡）',
//         num: 15
//       },
//       {
//         id: 38,
//         name: '藏山·状元大红袍[嘉平]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 23
//       },
//       {
//         id: 39,
//         name: '藏山·状元大红袍[嘉平]02',
//         spec: '散茶（8.3克/泡）',
//         num: 0
//       },
//       {
//         id: 40,
//         name: '见山·肉桂[花朝]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 11
//       },
//       {
//         id: 41,
//         name: '见山·肉桂[花朝]02',
//         spec: '8.3克/泡',
//         num: 15
//       },
//       {
//         id: 42,
//         name: '弥陀岩·水仙[花朝]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 10
//       },
//       {
//         id: 43,
//         name: '弥陀岩·水仙[花朝]02',
//         spec: '8.3克/泡',
//         num: 14
//       },
//       {
//         id: 44,
//         name: '藏山·竹窠老枞[春晓]01',
//         spec: '6泡装（8.3克/泡）',
//         num: 16
//       },
//       {
//         id: 45,
//         name: '藏山·竹窠老枞[春晓]02',
//         spec: '8.3克/泡',
//         num: 5
//       },
//       {
//         id: 46,
//         name: '忘山·牛栏坑肉桂[清和]01',
//         spec: '3泡装（10克/泡）',
//         num: 23
//       },
//       {
//         id: 47,
//         name: '忘山·牛栏坑肉桂[清和]02',
//         spec: '10克/泡',
//         num: 12
//       },
//       {
//         id: 48,
//         name: '见山·黄观音[霜华]04',
//         spec: '12泡装（8.3克/泡）',
//         num: 9
//       },
//       {
//         id: 49,
//         name: '见山·白鸡冠【季夏】01',
//         spec: '6泡装（8.3克/泡）',
//         num: 11
//       },
//       {
//         id: 50,
//         name: '见山·白鸡冠【季夏】02',
//         spec: '散茶（8.3克/泡）',
//         num: 16
//       },
//       {
//         id: 51,
//         name: '测试了',
//         spec: '散茶（8.3克/泡）',
//         num: 46
//       }
//     ]
//   }
// ]

// export const getAllGoods = [
//   RegExp(goodsApi.getAllGoods),
//   'post',
//   {
//     code: 200,
//     message: '成功',
//     list: [
//       {
//         id: 1,
//         goods_name: '见山·佛手【吟秋】八月',
//         thumb: 'https://bht.com/library/uploads/image/20200804/20200804101230_74247.jpg',
//         is_open: true,
//         category_id: 6,
//         category_name: '见山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 11,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20200804/20200804103231_66456.jpg'
//           },
//           {
//             id: 20,
//             specs_name: '8.3g/泡*12泡/盒',
//             specs_img: '/library/uploads/image/20200804/20200804103219_31837.png'
//           },
//           {
//             id: 21,
//             specs_name: '8.3g/泡*30泡/盒',
//             specs_img: '/library/uploads/image/20200804/20200804103225_19578.jpg'
//           }
//         ]
//       },
//       {
//         id: 2,
//         goods_name: '测试测试测试测试商品',
//         thumb: 'https://bht.com/library/uploads/image/20200513/20200513154841_27006.png',
//         is_open: true,
//         category_id: 7,
//         category_name: '藏山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 3,
//             specs_name: '12泡',
//             specs_img: '/library/uploads/image/20200513/20200513094818_32749.jpg'
//           },
//           {
//             id: 4,
//             specs_name: '1泡',
//             specs_img: '/library/uploads/image/20200513/20200513094920_50144.jpg'
//           }
//         ]
//       },
//       {
//         id: 3,
//         goods_name: '见山·水仙【吟秋】',
//         thumb: 'https://bht.com/library/uploads/image/20200804/20200804101727_89876.jpg',
//         is_open: true,
//         category_id: 6,
//         category_name: '见山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 5,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20200804/20200804103122_66549.jpg'
//           },
//           {
//             id: 22,
//             specs_name: '8.3g/泡*12泡/盒',
//             specs_img: '/library/uploads/image/20200804/20200804103128_30655.png'
//           },
//           {
//             id: 23,
//             specs_name: '8.3g/泡*30泡/盒',
//             specs_img: '/library/uploads/image/20200804/20200804103135_28848.jpg'
//           }
//         ]
//       },
//       {
//         id: 11,
//         goods_name: '藏山·老枞【咏月】',
//         thumb: 'https://bht.com/library/uploads/image/20200904/20200904170207_74103.jpg',
//         is_open: true,
//         category_id: 7,
//         category_name: '藏山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 26,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20200904/20200904165907_79577.jpg'
//           }
//         ]
//       },
//       {
//         id: 13,
//         goods_name: '会员专供|牛栏坑纯料肉桂【限量】',
//         thumb: 'https://bht.com/library/uploads/image/20200928/20200928162302_17001.jpg',
//         is_open: true,
//         category_id: 1,
//         category_name: '茶叶',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 31,
//             specs_name: '8.3g/泡*1泡/盒',
//             specs_img: '/library/uploads/image/20200928/20200928162309_67886.jpg'
//           }
//         ]
//       },
//       {
//         id: 14,
//         goods_name: '限量礼盒',
//         thumb: 'https://bht.com/library/uploads/image/20200914/20200914134412_58871.jpg',
//         is_open: true,
//         category_id: 1,
//         category_name: '茶叶',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 33,
//             specs_name: '12cm*12cm*11cm',
//             specs_img: '/library/uploads/image/20200914/20200914134144_19914.jpg'
//           }
//         ]
//       },
//       {
//         id: 15,
//         goods_name: '见山·肉桂【霜华】',
//         thumb: 'https://bht.com/library/uploads/image/20200924/20200924165825_92343.jpg',
//         is_open: true,
//         category_id: 6,
//         category_name: '见山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 34,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20200928/20200928155750_41761.jpg'
//           },
//           {
//             id: 35,
//             specs_name: '8.3g/泡*30泡/盒',
//             specs_img: '/library/uploads/image/20200924/20200924165736_11808.jpg'
//           }
//         ]
//       },
//       {
//         id: 28,
//         goods_name: '藏山·状元大红袍[嘉平]',
//         thumb: 'https://bht.com/library/uploads/image/20201130/20201130182111_57410.jpg',
//         is_open: true,
//         category_id: 7,
//         category_name: '藏山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 55,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20201130/20201130182102_14255.jpg'
//           }
//         ]
//       },
//       {
//         id: 31,
//         goods_name: '忘山·肉桂【咏月】',
//         thumb: 'https://bht.com/library/uploads/image/20201230/20201230103119_32624.jpg',
//         is_open: true,
//         category_id: 8,
//         category_name: '忘山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 60,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20201230/20201230103032_92302.jpg'
//           }
//         ]
//       },
//       {
//         id: 32,
//         goods_name: '见山·肉桂[花朝]',
//         thumb: 'https://bht.com/library/uploads/image/20210126/20210126144218_45844.jpg',
//         is_open: true,
//         category_id: 6,
//         category_name: '见山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 61,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20210126/20210126144148_87588.jpg'
//           }
//         ]
//       },
//       {
//         id: 33,
//         goods_name: '弥陀岩·水仙[花朝]',
//         thumb: 'https://bht.com/library/uploads/image/20210126/20210126144703_72043.jpg',
//         is_open: true,
//         category_id: 6,
//         category_name: '见山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 62,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20210126/20210126144647_73598.jpg'
//           }
//         ]
//       },
//       {
//         id: 35,
//         goods_name: '见山·佛手【吟秋】',
//         thumb: 'https://bht.com/library/uploads/image/20210225/20210225154105_34283.jpg',
//         is_open: true,
//         category_id: 6,
//         category_name: '见山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 65,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20210225/20210225152834_76790.jpg'
//           }
//         ]
//       },
//       {
//         id: 36,
//         goods_name: '藏山·竹窠老枞【晓春】',
//         thumb: 'https://bht.com/library/uploads/image/20210301/20210301112303_20416.jpg',
//         is_open: true,
//         category_id: 7,
//         category_name: '藏山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 66,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20210301/20210301112138_46709.jpg'
//           }
//         ]
//       },
//       {
//         id: 38,
//         goods_name: '忘山·牛栏肉桂【清和】',
//         thumb: 'https://bht.com/library/uploads/image/20210322/20210322144411_10307.jpg',
//         is_open: true,
//         category_id: 8,
//         category_name: '忘山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 69,
//             specs_name: '10g/泡*3泡/盒',
//             specs_img: '/library/uploads/image/20210322/20210322144404_99414.jpg'
//           }
//         ]
//       },
//       {
//         id: 40,
//         goods_name: '见山·肉桂【观月】',
//         thumb: 'https://bht.com/library/uploads/image/20210322/20210322151722_13814.jpg',
//         is_open: true,
//         category_id: 6,
//         category_name: '见山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 72,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20210322/20210322151554_59316.jpg'
//           },
//           {
//             id: 73,
//             specs_name: '8.3g/泡*12泡/盒',
//             specs_img: '/library/uploads/image/20210322/20210322151639_96645.jpg'
//           }
//         ]
//       },
//       {
//         id: 42,
//         goods_name: '忘山·古井老枞【龙潜】',
//         thumb: 'https://bht.com/library/uploads/image/20210428/20210428094212_91042.jpg',
//         is_open: true,
//         category_id: 8,
//         category_name: '忘山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 76,
//             specs_name: '10g/泡*3泡/盒',
//             specs_img: '/library/uploads/image/20210428/20210428093246_60619.jpg'
//           }
//         ]
//       },
//       {
//         id: 43,
//         goods_name: '藏山·水帘洞肉桂【龙潜】',
//         thumb: 'https://bht.com/library/uploads/image/20210428/20210428094845_20431.jpg',
//         is_open: true,
//         category_id: 7,
//         category_name: '藏山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 77,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20210428/20210428094634_95517.jpg'
//           }
//         ]
//       },
//       {
//         id: 46,
//         goods_name: '见山·铁罗汉[观月]',
//         thumb: 'https://bht.com/library/uploads/image/20210528/20210528111200_86493.jpg',
//         is_open: true,
//         category_id: 6,
//         category_name: '见山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 81,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20210528/20210528110957_57067.jpg'
//           },
//           {
//             id: 82,
//             specs_name: '8.3g/泡*12泡/盒',
//             specs_img: '/library/uploads/image/20210528/20210528111019_51550.png'
//           }
//         ]
//       },
//       {
//         id: 48,
//         goods_name: '见山·黄观音【霜华】',
//         thumb: 'https://bht.com/library/uploads/image/20210629/20210629112902_32564.jpg',
//         is_open: true,
//         category_id: 6,
//         category_name: '见山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 85,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20210629/20210629102951_60794.jpg'
//           },
//           {
//             id: 86,
//             specs_name: '8.3g/泡*12泡/盒',
//             specs_img: '/library/uploads/image/20210629/20210629103103_25086.jpg'
//           },
//           {
//             id: 88,
//             specs_name: '8.3g/泡*30泡/盒',
//             specs_img: '/library/uploads/image/20210629/20210629111648_75035.jpg'
//           }
//         ]
//       },
//       {
//         id: 49,
//         goods_name: '藏山·白鸡冠【季夏】',
//         thumb: 'https://bht.com/library/uploads/image/20210629/20210629105416_40393.jpg',
//         is_open: true,
//         category_id: 7,
//         category_name: '藏山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 87,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20210629/20210629105001_86672.jpg'
//           }
//         ]
//       },
//       {
//         id: 51,
//         goods_name: '见山·肉桂[花朝]-2021.8',
//         thumb: 'https://bht.com/library/uploads/image/20210810/20210810093750_45745.jpg',
//         is_open: true,
//         category_id: 6,
//         category_name: '见山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 91,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20210810/20210810093638_77512.jpg'
//           }
//         ]
//       },
//       {
//         id: 52,
//         goods_name: '见山·奇兰[桂月]',
//         thumb: 'https://bht.com/library/uploads/image/20210810/20210810094145_64448.jpg',
//         is_open: true,
//         category_id: 6,
//         category_name: '见山',
//         shelf: '上架',
//         spec_list: [
//           {
//             id: 92,
//             specs_name: '8.3g/泡*6泡/盒',
//             specs_img: '/library/uploads/image/20210810/20210810094103_60745.jpg'
//           }
//         ]
//       }
//     ],
//     success: true
//   }
// ]

// export const getSpecInfo = [
//   RegExp(goodsApi.getSpecInfo),
//   'post',
//   {
//     code: 200,
//     message: '请求成功',
//     success: true,
//     list: [
//       {
//         s_price: '0.03',
//         y_price: '120.00',
//         vip_price: '0.03',
//         e_price: '0.01',
//         stock: 983,
//         bind_product_id: 0,
//         specs_img: '/library/uploads/image/20200513/20200513092049_58852.jpg',
//         specs_name: '6泡',
//         goods_id: 11,
//         available_stock: 983,
//         bind_info: '',
//         goods_name: '见山·佛手【吟秋】八月'
//       }
//     ]
//   }
// ]

// export const getSeller = [
//   RegExp(goodsApi.getSeller),
//   'post',
//   {
//     code: 200,
//     message: '请求成功',
//     success: true,
//     list: [
//       {
//         id: '1',
//         seller_name: '商家1',
//         region: '福州'
//       },
//       {
//         id: '2',
//         seller_name: '商家2',
//         region: '福州'
//       },
//       {
//         id: '3',
//         seller_name: '三月兔旗舰店',
//         region: '福州'
//       },
//       {
//         id: '7',
//         seller_name: '商家',
//         region: '福州'
//       },
//       {
//         id: '8',
//         seller_name: '肖彩云',
//         region: '福州'
//       },
//       {
//         id: '9',
//         seller_name: '七月试喝茶',
//         region: '福州'
//       },
//       {
//         id: '10',
//         seller_name: '222',
//         region: '福州'
//       }
//     ]
//   }
// ]

// // export const UserMenu = [
// //   RegExp(userApi.UserMenu),
// //   'get',
// //   {
// //     code: '200',
// //     success: true,
// //     message: 'OK',
// //     data: setMenu(asyncRoutes)
// //   }
// // ]
