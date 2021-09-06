<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import zhCn from 'ant-design-vue/lib/locale-provider/zh_CN'
// import { appMixin } from '@/store/mixin'
import 'moment/locale/zh-cn'
export default {
  // mixins: [appMixin],
  data () {
    return {
      locale: zhCn
    }
  },
  created () {
    // if (localStorage.getItem('access_token')) {
    //   this.$store.dispatch('GetInfo')
    // }
  }
}
</script>

<style>
.limit-width {
  min-width: 1200px;
}
</style>
