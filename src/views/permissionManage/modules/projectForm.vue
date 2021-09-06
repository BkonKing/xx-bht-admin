<template>
  <a-form-model
    ref="projectForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <div class="form-title">公司信息</div>
    <a-form-model-item label="公司logo">
      <upload-image v-model="form.companyLogo" maxLength="1"></upload-image>
      <div class="logoText">支持扩展名.png .jpg; 建议比例1:1</div>
    </a-form-model-item>
    <a-form-model-item label="公司名称" prop="companyName" required>
      <a-input
        v-model="form.companyName"
        :maxLength="50"
        placeholder="请输入"
      />
    </a-form-model-item>
    <a-form-model-item label="公司简称" required>
      <a-row type="flex">
        <a-col flex="1">
          <a-form-model-item prop="shortName">
            <a-input
              v-model="form.shortName"
              placeholder="中文简称"
              :maxLength="20"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col flex="30px" style="text-align: center;">--</a-col>
        <a-col flex="1">
          <a-form-model-item prop="shortEng">
            <a-input
              v-model="form.shortEng"
              placeholder="英文简称"
              oninput="value=value.replace(/[^\a-\z\A-\Z]/g,'')"
              :maxLength="11"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model-item>
    <a-form-model-item label="参与项目" prop="projectIds">
      <a-checkbox-group
        v-if="options && options.length"
        v-model="form.projectIds"
        :options="options"
        class="projectIds-checkbox"
      />
      <template v-else>暂无项目</template>
      <div class="joinProject">参与项目，才有对项目有相关处理权限</div>
    </a-form-model-item>
    <a-form-model-item label="负责人">
      <a-row type="flex">
        <a-col flex="1">
          <a-form-model-item>
            <a-input
              v-model="form.manage"
              placeholder="姓名"
              :maxLength="10"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col flex="30px" style="text-align: center;">--</a-col>
        <a-col flex="1">
          <a-form-model-item>
            <a-input
              v-model="form.manageMobile"
              v-number-input
              placeholder="手机号"
              :maxLength="11"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model-item>
    <a-form-model-item label="公司地址" prop="area">
      <a-cascader v-model="form.area" :options="area" placeholder="请选择" />
      <a-form-model-item prop="address" style="margin-top: 24px"
        ><a-textarea v-model="form.address" rows="4" placeholder="详细地址" />
      </a-form-model-item>
    </a-form-model-item>
    <div class="form-title">超级管理员</div>

    <a-form-model-item label="登录账号" prop="adminAccount" required>
      <a-input
        v-model="form.adminAccount"
        :maxLength="20"
        oninput="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
        placeholder="请输入2~20个中文、英文或数字"
      />
    </a-form-model-item>
    <a-form-model-item label="登录密码">
      <a-input
        v-model="form.adminPassword"
        :maxLength="18"
        type="password"
        oninput="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')"
        placeholder="请输入6~18个英文、数字"
      />
      <div v-if="!form.id" style="color: #00000072;">
        密码未填默认为888888
      </div>
    </a-form-model-item>
    <a-form-model-item label="真实姓名" required>
      <a-row type="flex">
        <a-col flex="1">
          <a-form-model-item prop="adminRealname">
            <a-input
              v-model="form.adminRealname"
              placeholder="姓名"
              :maxLength="15"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col flex="30px" style="text-align: center;">--</a-col>
        <a-col flex="1">
          <a-form-model-item prop="adminMobile">
            <a-input
              v-model="form.adminMobile"
              v-number-input
              :maxLength="11"
              placeholder="手机号"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import chinaArea from '@/utils/chinaArea'
import { UploadImage } from '@/components'
import cloneDeep from 'lodash.clonedeep'

const initialForm = {
  companyName: '', // 是varchar公司名称
  projectIds: [], // 否array参与的项目 array(“1”,”5”,”135”)
  companyLogo: [], // 否varcharLOGO图片 /upload/images/2021/kk.jpg
  manage: '', // 否varchar公司负责人
  manageMobile: '', // 否varchar公司负责人电话
  provinceId: '', // 否int省份ID
  cityId: '', // 否int城市ID
  areaId: '', // 否int县区ID
  address: '', // 否varchar详细地址
  adminAccount: '', // 是varchar管理员登录账号
  adminPassword: '', // 是varchar管理员登录密码
  adminRealname: '', // 是varchar管理员真实姓名
  adminMobile: '', // 是varchar管理员手机号
  shortName: '', // 是varchar公司中文简称
  shortEng: '' // 是varchar公司英文简称
}
export default {
  name: 'RepositoryForm',
  components: {
    UploadImage
  },
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    },
    projectList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: cloneDeep(initialForm),
      rules: {
        companyName: [{ required: true, message: '请输入公司名称' }],
        adminAccount: [{ required: true, message: '请输入管理员登录账号' }],
        // adminPassword: [{ required: true, message: '请输入管理员登录密码' }],
        adminRealname: [{ required: true, message: '请输入管理员真实姓名' }],
        adminMobile: [{ required: true, message: '请输入管理员手机号' }],
        shortName: [{ required: true, message: '请输入公司中文简称' }],
        shortEng: [{ required: true, message: '请输入公司英文简称' }]
      },
      area: chinaArea,
      mode: 'add'
    }
  },

  computed: {
    options () {
      return this.projectList.map(option => {
        return {
          label: option.projectName,
          value: option.projectId,
          disabled:
            this.form.glStatus && this.form.glStatus.includes(option.projectId)
        }
      })
    }
  },
  methods: {
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.$refs.projectForm.validate(valid => {
          if (valid) {
            resolve(this.form)
          } else {
            reject(new Error(false))
            return false
          }
        })
      })
    },
    setFieldsValue (data) {
      this.form = data
    },
    resetFields () {
      this.$refs.projectForm.resetFields()
      this.form = cloneDeep(initialForm)
    }
  }
}
</script>

<style lang="less" scoped>
.form-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
}
.projectIds-checkbox {
  width: 100%;
  max-height: 260px;
  overflow-y: auto;
  /deep/ .ant-checkbox-wrapper {
    display: block;
    margin-top: 5px;
  }
}
.logoText {
  margin-top: -20px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
}
.joinProject {
  color: rgba(0, 0, 0, 0.45);
  line-height: 1;
}
</style>
