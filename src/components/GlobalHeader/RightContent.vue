<template>
  <div :class="wrpCls" style="display: flex;align-items: center;">
    <!-- <a-icon type="question-circle" style="font-size: 22px;" @click="openHelp" /> -->
    <!-- <message-center style="margin-left: 24px;"></message-center> -->
    <avatar-dropdown
      :menu="showMenu"
      :current-user="currentUser"
      :class="prefixCls"
      style="margin-left:3px;"
    />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
// import MessageCenter from './MessageCenter.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown
    // MessageCenter
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      showMessage: false,
      currentUser: {}
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${
          this.isMobile || !this.topMenu ? 'light' : this.theme
        }`]: true
      }
    },
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.setCurrentUser()
  },
  methods: {
    setCurrentUser () {
      const account = (this.userInfo && this.userInfo.account) || '昵称'
      const avatar = (this.userInfo && this.userInfo.avatar) || ''
      this.currentUser = {
        name: account,
        avatar: avatar
      }
    }
    // openHelp () {
    //   window.open('https://view.officeapps.live.com/op/view.aspx?src=https://ytdwz.tosolomo.com/upload/files/%E6%B0%B8%E5%90%8C%E8%BE%BE%E7%89%A9%E8%B5%84%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.docx', '_target')
    // }
  },
  watch: {
    userInfo () {
      this.setCurrentUser()
    }
  }
}
</script>
