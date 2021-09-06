<template>
  <div class="main">
    <a-form-model
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :model="form"
      :rules="rules"
    >

      <a-form-model-item prop="admin_name">
        <a-input
          v-model="form.admin_name"
          :maxLength="20"
          size="large"
          type="text"
          placeholder="账户"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="pwd">
        <a-input-password
          v-model="form.pwd"
          :maxLength="18"
          size="large"
          placeholder="密码"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-model-item>
        <a-form-model-item>

        <a-checkbox v-model="autoLogin">自动登录</a-checkbox>
      </a-form-model-item>

      <a-form-model-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"

          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
          @click="submit"
        >确定</a-button>
      </a-form-model-item>

    </a-form-model>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { login } from '@/api/user'
export default {
  data () {
    return {
      form: {
        admin_name: '',
        pwd: ''
      },
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      autoLogin: false,
      rules: {
        admin_name: [
          { required: true, message: '请输入账户', trigger: 'change' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },

  created () {
    console.log(this.$store.state.login.isAutoLogin, this.$store.state.login.isLogout)
    this.autoLogin = this.$store.state.login.isAutoLogin
    if (!localStorage.getItem('access_token')) {
      if (this.autoLogin) {
        const accountInfo = this.$store.state.login.accountInfo
        this.form = JSON.parse(JSON.stringify(accountInfo))
        if (!this.$store.state.login.isLogout) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.submit()
            })
          })
        }
      }
    }
  },
  methods: {
    submit () {
      this.$refs.formLogin.validate(async result => {
        if (result) {
          await login(this.form)
            .then((res) => {
              if (this.autoLogin) {
                this.$store.commit('setAccountInfo', JSON.parse(JSON.stringify(this.form)))
                this.$store.commit('setAutoLogin', this.autoLogin)
                window.localStorage.setItem('autoLogin', this.autoLogin)
                window.localStorage.setItem('accountInfo', JSON.stringify(this.form))
              } else {
                window.localStorage.removeItem('autoLogin')
                window.localStorage.removeItem('accountInfo')
                this.$store.commit('setAccountInfo', {})
                this.$store.commit('setAutoLogin', this.autoLogin)
              }
              this.$store.dispatch('GetInfo')
              // console.log(res.oauthToken)
              window.localStorage.setItem('access_token', res.oauthToken)

              this.$router.push('/')
            })
        } else {
          this.$message.error('验证失败')
        }
      })
    },
    loginSuccess (res) {
      this.$router.push('/home')
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed (err) {
      console.log(err)
      this.isLoginError = true
      this.$notification.error({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }
  .forge-password {
    font-size: 14px;
  }
  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
