<template>
  <a-form-model
    :model="form"
    ref="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :rules="rules"
  >
    <a-form-model-item label="登录账号" prop="account">
      <a-input
        v-model="form.account"
        @blur="setAccount"
        :maxLength="20"
        autocomplete="off"
        placeholder="请输入2~20个中文、英文或数字"
      ></a-input>
    </a-form-model-item>

    <a-form-model-item label="登录密码">
      <a-input
        type="password"
        v-model="form.password"
        @blur="setPasswd"
        :maxLength="18"
        autocomplete="new-password"
        placeholder="请输入6~18个英文、数字"
      ></a-input>
      <div v-if="mode === 'add'" style="color: #00000072;">
        密码未填默认为888888
      </div>
    </a-form-model-item>
    <a-form-model-item label="选择角色" prop="roleId">
      <a-tree-select
        v-model="form.roleId"
        style="width: 100%"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :tree-data="treeData"
        placeholder="请选择"
        :replaceFields="{ key: 'id', value: 'id', title: 'roleName' }"
        tree-default-expand-all
      >
        <span slot="title" slot-scope="{ title }" style="color: #08c">
          {{ title }}
        </span>
      </a-tree-select>
    </a-form-model-item>
    <a-form-model-item label="真实姓名" prop="realName">
      <a-input
        v-model="form.realName"
        :maxLength="15"
        @blur="setName"
        placeholder="请输入1~15个字"
      ></a-input>
    </a-form-model-item>
    <a-form-model-item label="手机号">
      <a-input
        v-model="form.mobile"
        placeholder="请输入11位手机号"
        :maxLength="11"
        oninput="value=value.replace(/[^0-9]/g,'')"
      ></a-input>
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
  </a-form-model>
</template>

<script>
import {
  toGetRoles,
  toAddAdmin,
  toUpdateAdmin,
  toGetAllProject
} from '@/api/permissionManage'
import bus from '@/utils/bus'

export default {
  name: 'addForm',
  props: {
    record: {
      type: Object,
      default: null
    },
    mode: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      treeExpandedKeys: [],
      projectList: [],
      treeData: [],
      form: {
        account: '', // 是varchar人员登录账户
        password: undefined, // 否varchar登录密码
        realName: '', // 否varchar姓名
        mobile: '', // 否varchar手机号
        roleId: undefined // 是int权限角色ID
      },
      rules: {
        account: [
          { required: true, message: '请输入登录账号', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'change' }
        ],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    options () {
      return this.projectList.map(option => {
        return {
          label: option.projectName,
          value: option.projectId
        }
      })
    }
  },
  mounted () {
    if (this.record) {
      this.form = this.record
      this.form.projectIds = this.record.projectIds.map(obj => obj.projectId)
    }
  },

  methods: {
    // 获取角色
    async getRole () {
      const res = await toGetRoles()
      this.treeData = res.data
      console.log('获取角色', res)
    },
    // 获取所有项目
    getAllProject () {
      toGetAllProject({
        allots: 1
      }).then(({ data }) => {
        this.projectList = data
      })
    },
    // 设置姓名
    setName () {
      if (this.form.realName !== '') {
        if (this.form.realName.length < 1) {
          this.$message.error('请输入正确的姓名')
        }
      }
    },
    // 设置账号
    setAccount (e) {
      // console.log(e.target.value)
      e.target.value = e.target.value.replace(
        // eslint-disable-next-line no-useless-escape
        /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,
        ''
      )
    },
    // 设置密码
    setPasswd (e) {
      // eslint-disable-next-line no-useless-escape
      e.target.value = e.target.value.replace(/[^\a-\z\A-\Z0-9]/g, '')
    },
    onOk () {
      return new Promise(resolve => {
        this.$refs.form.validate(result => {
          if (result) {
            if (this.mode === 'add') {
              toAddAdmin(this.form).then(() => {
                this.$message.success('添加成功')
                bus.$emit('refresh', 'add')
              })
            } else {
              toUpdateAdmin(this.form).then(() => {
                this.$message.success('提交成功')
                this.form.id === this.$store.state.user.info.id &&
                  this.$store.dispatch('GetInfo')
                bus.$emit('refresh', 'mode')
              })
            }
            resolve(true)
          } else {
            this.$message.error('验证失败')
          }
        })
      })
    },
    onCancel () {
      console.log('监听了 modal cancel 事件')
      return new Promise(resolve => {
        resolve(true)
      })
    }
  },
  created () {
    this.getRole()
    this.getAllProject()
  }
}
</script>

<style lang="less" scoped>
.ant-form-horizontal .ant-form-item:last-child {
  margin-bottom: 0;
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
.joinProject {
  color: rgba(0, 0, 0, 0.45);
  line-height: 1;
}
</style>
