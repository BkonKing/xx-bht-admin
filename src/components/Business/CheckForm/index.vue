<template>
  <div>
    <div class="selected" v-if="selectedRowKeys.length > 0">
      <a-icon class="icon" type="info-circle" />
      已选择 <span class="span1">{{ selectedRowKeys.length }}</span> 项
    </div>
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item v-if="label" :label="label">
        {{showValue}}
      </a-form-model-item>
      <a-form-model-item label="是否通过" prop="auidtStatus">
        <a-radio-group v-model="form.auidtStatus">
          <a-radio :value="1">
            通过
          </a-radio>
          <a-radio :value="2">
            不通过
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="审核说明" prop="describe">
        <a-textarea
          v-model="form.describe"
          placeholder="请输入"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          style="max-width: 328px;"
        />
      </a-form-model-item>
      <a-form-model-item label="图片">
        <upload-image v-model="form.annex" maxLength="10"></upload-image>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import UploadImage from '../../UploadImage/index.vue'
import clonedeep from 'lodash.clonedeep'
const form = {
  auidtStatus: 1,
  describe: '',
  annex: []
}
export default {
  name: 'CheckForm',
  components: {
    UploadImage
  },
  props: {
    selectedRowKeys: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    showValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: clonedeep(form),
      rules: {
        auidtStatus: [{ required: true, message: '请填写', trigger: 'change' }]
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
  },
  methods: {
    // 审核
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve(this.form)
          } else {
            reject(new Error(false))
            return false
          }
        })
      })
    },
    resetFields () {
      this.$refs.form.resetFields()
      this.form = clonedeep(form)
    }
  }
}
</script>

<style lang="less" scoped>
.selected {
  margin-top: 10px;
  width: 100%;
  height: 40px;
  padding-left: 15px;
  line-height: 40px;
  background-color: rgba(230, 247, 255, 1);
  border-width: 1px;
  border-style: solid;
  border-color: rgba(186, 231, 255, 1);
  border-radius: 4px;
  .icon {
    color: #0e77d1;
    margin-right: 10px;
  }
  .span1 {
    color: #0e77d1;
  }
  .span2 {
    cursor: pointer;
    color: #0e77d1;
    margin-left: 10px;
  }
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

/deep/ .ant-form-item {
  margin-bottom: 16px;
}
</style>
