<template>
  <div>
    <a-card :bordered="false" class="ant-pro-components-tag-select">
      <a-form layout="inline">
        <standard-form-row
          v-if="projectList && projectList.length"
          title="参与项目"
          block
          style="padding-bottom: 3px;"
        >
          <a-form-item>
            <tag-select v-model="projectIds" @change="getData">
              <tag-select-option
                v-for="tag in projectList"
                :key="tag.projectId"
                :value="tag.projectId"
                >{{ tag.projectName }}</tag-select-option
              >
            </tag-select>
          </a-form-item>
        </standard-form-row>

        <standard-form-row title="其它选项" grid last>
          <a-row>
            <a-col :lg="8" :md="10" :sm="10" :xs="24">
              <a-form-item
                :wrapper-col="{ sm: { span: 16 }, xs: { span: 24 } }"
                label="公司"
              >
                <a-input
                  v-model="serachText"
                  placeholder="ID、名称"
                  @change="getData"
                  style="max-width: 200px; width: 100%;"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </standard-form-row>
      </a-form>
    </a-card>

    <div class="ant-pro-pages-list-applications-filterCardList">
      <a-list
        :loading="loading"
        :data-source="companyList"
        :grid="{ gutter: 24, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
        style="margin-top: 24px;"
      >
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-card
            class="add-project-card"
            v-if="
              index === 0 && permissions.CreatePermission && isParentCompany
            "
            :body-style="{ paddingBottom: 20 }"
            @click="openAddCompany"
          >
            <a-icon type="plus"></a-icon>新增公司
          </a-card>
          <a-card
            v-else
            class="project-card"
            :body-style="{ paddingBottom: 20 }"
          >
            <a-card-meta>
              <template slot="title">
                <div class="project-header">
                  <span class="project-title">{{ item.companyName }}</span>
                  <!-- <a-tag v-if="item.stage" color="blue" class="project-stage">
                    {{ item.stage }}
                  </a-tag> -->
                </div>
              </template>
              <template slot="avatar">
                <a-avatar v-if="item.companyLogo" size="large" :src="item.companyLogo" />
                <img v-else src="@/assets/company.png" style="width: 48px; height: 48px;">
              </template>
            </a-card-meta>
            <template slot="actions">
              <div
                class="actions-span"
                @click.stop="openCompanyPermiss(item.id)"
                v-if="+permissions.AllotsPermission === 1 && item.id !== '1'"
              >
                权限
              </div>
              <div
                class="actions-span"
                @click.stop="openEditCompany(item)"
                v-if="+permissions.UpdatePermission === 1"
              >
                编辑
              </div>
              <div
                class="actions-span"
                @click.stop="removeCompany(item)"
                v-if="+permissions.RemovePermission === 1 && item.id !== '1'"
              >
                删除
              </div>
            </template>
            <card-info
              :company-num="item.relationProjectNum"
              :contract-num="item.relationContractNum"
              :order-num="item.relationOrderNum"
            ></card-info>
          </a-card>
        </a-list-item>
      </a-list>
    </div>

    <a-modal
      :title="title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :width="640"
      :maskClosable="false"
      :keyboard="false"
      @ok="handleOkProject"
      @cancel="closeModal"
    >
      <project-form
        ref="projectForm"
        :projectList="projectList"
        :stage-list="projectStageList"
      ></project-form>
    </a-modal>
    <companyPermiss ref="companyPermiss"></companyPermiss>
  </div>
</template>

<script>
import moment from 'moment'
import clonedeep from 'lodash.clonedeep'
import { TagSelect, StandardFormRow } from '@/components'
import CardInfo from './modules/CardInfo.vue'
import projectForm from './modules/projectForm.vue'
import {
  toGetAllProject,
  toCompanyList,
  toAddCompany,
  toUpdateCompany,
  toRemoveCompany
} from '@/api/permissionManage'
import companyPermiss from './modules/companyPermiss.vue'

const TagSelectOption = TagSelect.Option
// const AvatarListItem = AvatarList.AvatarItem

export default {
  components: {
    companyPermiss,
    TagSelect,
    TagSelectOption,
    StandardFormRow,
    CardInfo,
    projectForm
  },
  data () {
    return {
      data: [],
      projectIds: [],
      serachText: '',
      stage: '',
      projectList: [], // 所有项目列表
      companyList: [],
      projectStageList: [],
      loading: true,
      title: '',
      visible: false,
      confirmLoading: false
    }
  },
  filters: {
    fromNow (date) {
      return moment(date).fromNow()
    }
  },
  watch: {
    visible (newVal) {
      if (newVal === false) {
        this.$refs.projectForm.mode = 'add'
      }
    }
  },
  created () {
    this.getAllProject()
    this.getData()
  },
  methods: {
    // 配置公司对应的权限
    openCompanyPermiss (id) {
      this.$refs.companyPermiss.isShow = true
      this.$refs.companyPermiss.id = id
    },
    // 获取所有项目
    getAllProject () {
      toGetAllProject({
        allots: 1
      }).then(({ data }) => {
        this.projectList = data
        console.log('所有项目', data)
      })
    },
    // 获取公司列表
    getData () {
      toCompanyList({
        projectIds: this.projectIds.join(','),
        serachText: this.serachText
      }).then(({ data }) => {
        const companyList = this.permissions.CreatePermission ? [{}] : []
        this.companyList = companyList.concat(data)
        this.loading = false
      })
    },
    // 打开新增项目弹窗
    openAddCompany () {
      this.title = '新增公司'
      this.showModal()
      this.$refs.projectForm && this.$refs.projectForm.resetFields()
    },
    // 打开编辑项目弹窗
    openEditCompany (obj) {
      this.title = '编辑公司'
      this.showModal()
      this.$refs.projectForm && this.$refs.projectForm.resetFields()
      // this.$refs.projectForm.mode = 'edit'
      this.$nextTick(() => {
        const data = clonedeep(obj)
        data.companyLogo = []
        if (obj.companyLogo) {
          data.companyLogo.push(obj.companyLogo)
        }
        if (obj.provinceId) {
          data.area = [obj.provinceId, obj.cityId, obj.areaId]
        }
        const glStatus = []
        data.projectIds = obj.projectIds.map((item) => {
          item.glStatus && glStatus.push(item.projectId)
          return item.projectId
        })
        data.glStatus = glStatus
        data.adminPassword = ''
        this.$refs.projectForm.setFieldsValue(data)
      })
    },
    showModal () {
      this.visible = true
    },
    handleOkProject (e) {
      this.$refs.projectForm.handleSubmit().then(res => {
        this.confirmLoading = true
        const data = clonedeep(res)
        if (data.companyLogo.length > 0) {
          data.companyLogo = data.companyLogo[0]
        }
        if (data.area && data.area.length) {
          data.provinceId = data.area[0]
          data.cityId = data.area[1]
          data.areaId = data.area[2]
        }
        if (data.id) {
          this.updateCompany(data)
        } else {
          this.addCompany(data)
        }
      })
    },
    addCompany (data) {
      toAddCompany(data)
        .then(({ success }) => {
          if (success) {
            this.$message.success('添加公司成功')
            this.getData()
            this.visible = false
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    updateCompany (data) {
      toUpdateCompany(data)
        .then(({ success }) => {
          if (success) {
            this.$message.success('提交成功')
            this.getData()
            this.visible = false
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    closeModal () {
      this.visible = false
    },
    removeCompany ({ id, companyName }) {
      const that = this
      this.$confirm({
        title: '删除公司',
        content: `确定删除"${companyName}"吗`,
        icon: h => <a-icon theme="filled" type="exclamation-circle" />,
        onOk () {
          toRemoveCompany({
            id
          }).then(({ data }) => {
            that.$message.success('删除公司成功')
            that.getData()
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.add-project-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 197px;
  background: none;
  border: 1px dashed #ccc;
  cursor: pointer;
}
.project-card {
  height: 197px;
}
/deep/ .ant-avatar-lg {
  width: 48px;
  height: 48px;
}
/deep/ .ant-card-actions {
  li {
    margin: 0;
    div {
      padding: 12px 0;
    }
  }
  > li:not(:last-child) {
    border-right: none;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 12px;
      right: 0;
      width: 1px;
      height: calc(100% - 24px);
      background: #e8e8e8;
    }
  }
}
.project-header {
  display: flex;
  justify-content: space-between;
}
.project-title {
  font-size: 16px;
  font-weight: bold;
  flex: 1;
  .textOverflow();
}
.project-stage {
  max-width: 88px;
  margin-right: 0;
}
</style>
