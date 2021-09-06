<template>
  <a-row>
    <a-col :xs="24" :md="12" :style="{ height: '350px' }">
      <a-form-model ref="form" :model="form" :rules="rules" layout="vertical">
        <a-form-model-item label="登录账号" prop="account">
          <a-input v-model="form.account" disabled />
        </a-form-model-item>
        <a-form-model-item label="登录密码" prop="pwd" required>
          <a-input-password
            v-model="form.pwd"
            v-number-input.EnNum
            placeholder="请输入"
            :maxLength="18"
          />
          <div class="pwd-alert">限6~18个字符</div>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            type="primary"
            :disabled="!form.pwd || !isChange"
            @click="handleSubmit"
            >更新信息</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </a-col>
  </a-row>
</template>
<script>
import { updateSecuritySet } from '@/api/user'
export default {
  data () {
    return {
      form: {
        account: '',
        pwd: ''
      },
      rules: {
        pwd: [
          { required: true, message: '必填' },
          { min: 6, message: '必须大于6位' }
        ]
      },
      isChange: false
    }
  },
  watch: {
    'form.pwd' (val) {
      val && (this.isChange = true)
    }
  },
  mounted () {
    this.form.account = this.$store.getters.userInfo.account
  },
  methods: {
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.updateSecuritySet()
        } else {
          return false
        }
      })
    },
    updateSecuritySet () {
      updateSecuritySet(this.form).then(() => {
        this.$message.success('更新成功')
        this.isChange = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pwd-alert {
  margin-top: 4px;
  line-height: 22px;
  color: #00000072;
}
</style>
