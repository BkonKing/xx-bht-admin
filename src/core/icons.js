import Vue from 'vue'
import { Icon } from 'ant-design-vue'

const TFIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2239419_oagx09rutn9.js' // 在 iconfont.cn 上生成
})

TFIcon.install = function (Vue) {
  Vue.component('TFIcon', TFIcon)
}

Vue.use(TFIcon)
