<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :sider-width="210"
    v-bind="settings"
  >
    <!-- 1.0.0+ 版本 pro-layout 提供 API，
          我们推荐使用这种方式进行 LOGO 和 title 自定义
    -->
    <template v-slot:menuHeaderRender>
      <div>
        <img v-if="userInfo.companyLogo" :src="userInfo.companyLogo" alt="公司logo">
        <img v-else src="@/assets/company.png">
        <h1>{{ userInfo.shortCompanyName || title }}</h1>
      </div>
    </template>
    <!-- 1.0.0+ 版本 pro-layout 提供 API,
          增加 Header 左侧内容区自定义
    -->
    <!-- <template v-slot:headerContentRender>
      <div>
        <a-tooltip title="刷新页面">
          <a-icon type="reload" style="font-size: 18px;cursor: pointer;" @click="() => { $message.info('只是一个DEMO') }" />
        </a-tooltip>
      </div>
    </template> -->

    <!-- <setting-drawer :settings="settings" @change="handleSettingChange">
      <div style="margin: 12px 0;">
        This is SettingDrawer custom footer content.
      </div>
    </setting-drawer> -->
    <template v-slot:rightContentRender>
      <right-content
        :top-menu="settings.layout === 'topmenu'"
        :is-mobile="isMobile"
        :theme="settings.theme"
      />
    </template>
    <!-- custom footer / 自定义Footer -->
    <template v-slot:footerRender>
      <global-footer />
    </template>
    <router-view />
  </pro-layout>
</template>

<script>
// import { SettingDrawer } from 'xx-ant-design-vue-pro-layout'
import {
  CONTENT_WIDTH_TYPE,
  SIDEBAR_TYPE,
  TOGGLE_MOBILE_TYPE
} from '@/store/mutation-types'

import defaultSettings from '@/settings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import { mapGetters } from 'vuex'
import { getMenu } from '@/api/user'
import { appMixin } from '@/store/mixin'

export default {
  name: 'BasicLayout',
  mixins: [appMixin],
  components: {
    // SettingDrawer,
    RightContent,
    GlobalFooter
  },
  data () {
    return {
      // preview.pro.antdv.com only use.
      isProPreviewSite:
        process.env.VUE_APP_PREVIEW === 'true' &&
        process.env.NODE_ENV !== 'development',
      // end

      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth:
          defaultSettings.layout === 'sidemenu'
            ? CONTENT_WIDTH_TYPE.Fluid
            : defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false
      },
      // 媒体查询
      query: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created () {
    getMenu().then(({ data }) => {
      // this.menus = data
      // console.log(data)
      this.menus = this.formatMenu(data)
      // console.log(this.menus)
    })
    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    formatMenu (data) {
      if (data && data.length) {
        const menu = data.map(obj => {
          const newObj = {
            meta: {}
          }
          if (obj.children && obj.children.length) {
            newObj.children = this.formatMenu(obj.children)
          }
          newObj.meta.title = obj.menuText
          newObj.meta.icon = obj.icon || null
          newObj.path = obj.limitsPath
          newObj.name = obj.limitsPath
          if (obj.display === '0' && !(obj.children && obj.children.length)) {
            newObj.hideChildrenInMenu = true
          } else if (obj.display === '0') {
            newObj.hidden = true
          }
          return newObj
        })
        return menu
      } else {
        return data
      }
    },
    handleMediaQuery (val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse (val) {
      this.collapsed = val
    }
    /* handleSettingChange ({ type, value }) {
      console.log('type', type, value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
          }
          break
      }
    } */
  }
}
</script>

<style lang="less">
@import "./BasicLayout.less";
</style>
