import Vue from 'vue'
import { Icon } from 'ant-design-vue'

const TFIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2239419_oagx09rutn9.js' // ε¨ iconfont.cn δΈηζ
})

TFIcon.install = function (Vue) {
  Vue.component('TFIcon', TFIcon)
}

Vue.use(TFIcon)
