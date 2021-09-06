<template>
  <div class="personList">
    <a-card class="card">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline">
          <a-row :gutter="36">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="角色">
                <a-tree-select
                  v-model="roleId"
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
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="人员">
                <a-input
                  v-model="searchText"
                  placeholder="姓名、手机号"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <div class="btns">
                <a-button type="primary" @click="search">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card class="card2">
      <div class="table-operator">
        <a-button
          v-if="+permissions.CreatePermission === 1"
          type="primary"
          @click="add"
          >新增人员</a-button
        >
      </div>
      <s-table
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :showPagination="true"
      >
        <template slot="opera" slot-scope="text, record">
          <div class="table-action">
            <a
              @click="openEditPermiss(record)"
              v-if="+permissions.AllotsPermission === 1"
              >权限</a
            >
            <a @click="edit(record)" v-if="+permissions.UpdatePermission === 1"
              >编辑</a
            >
            <a
              @click="delPerson(record)"
              v-if="+permissions.RemovePermission === 1"
              >删除</a
            >
          </div>
        </template>
      </s-table>
    </a-card>
    <permissModal
      ref="permissModal"
      @success="$refs.table.refresh()"
    ></permissModal>
  </div>
</template>

<script>
import { STable } from '@/components'
import {
  toGetAdminList,
  toRemoveAdmin,
  toGetRoles
} from '@/api/permissionManage'
import addForm from './modules/addForm'
import permissModal from './modules/permissModal.vue'
import bus from '@/utils/bus'
export default {
  components: {
    permissModal,
    STable
  },
  data () {
    return {
      tableData: [],
      treeData: [],
      columns: [
        {
          title: '人员姓名',
          dataIndex: 'realName',
          key: 'realName',
          width: '10%'
        },
        {
          title: '登录账号 ',
          dataIndex: 'account',
          key: 'account',
          width: '10%'
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          key: 'roleName',
          width: '16%'
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
          width: '14.22222222%'
        },
        {
          title: '添加时间',
          dataIndex: 'ctime',
          key: 'ctime',
          width: '16%'
        },
        {
          title: '最后登录',
          dataIndex: 'loginTime',
          key: 'loginTime',
          width: '20%'
        },
        {
          title: '操作',
          dataIndex: 'opera',
          key: 'opera',
          scopedSlots: { customRender: 'opera' },
          width: '14.22222222%'
          // align: 'right'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, {
          roleId: this.roleId,
          searchText: this.searchText
        })
        return toGetAdminList(requestParameters).then(res => {
          return res
        })
      },
      roleId: undefined, // 角色id
      searchText: '', // 姓名、手机号关键字
      allRole: []
    }
  },
  created () {
    this.getRole()
  },
  mounted () {
    bus.$on('refresh', value => {
      this.$refs.table.refresh()
    })
  },
  methods: {
    // 获取角色
    async getRole () {
      const res = await toGetRoles()
      this.treeData = res.data
    },
    // 编辑权限
    openEditPermiss (record) {
      this.$refs.permissModal.isShow = true
      this.$refs.permissModal.id = record.id
    },
    // 重置
    reset () {
      this.roleId = undefined
      this.searchText = ''
      this.$refs.table.refresh(true)
    },
    // 搜索
    search () {
      this.$refs.table.refresh(true)
    },
    // 编辑
    edit (item) {
      const record = JSON.parse(JSON.stringify(item))

      this.$dialog(
        addForm,
        {
          mode: 'edit',
          record,
          on: {
            ok () {
              console.log('ok 回调')
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        {
          title: '编辑人员',
          width: 700,
          centered: true,
          maskClosable: false,
          dialogClass: 'person-form-dialog'
        }
      )
    },
    // 删除人员
    delPerson (item) {
      const self = this
      console.log('删除id', item.id)
      this.$confirm({
        title: '删除人员',
        icon: h => <a-icon theme="filled" type="exclamation-circle" />,
        content: () => `确定删除"${item.realName}"吗`,
        onOk: () => {
          toRemoveAdmin({ id: item.id }).then(() => {
            self.$message.success('删除成功')

            self.$refs.table.refresh()
          })
        },
        onCancel () {
          console.log('Cancel')
        },
        class: 'test'
      })
    },
    // 新增人员
    add () {
      this.$dialog(
        addForm,
        // component props
        {
          mode: 'add',
          on: {
            ok () {
              // console.log('ok 回调')
              console.log('执行了ok')
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '新增人员',
          width: 700,
          centered: true,
          maskClosable: false,
          dialogClass: 'person-form-dialog'
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.personList {
  .card {
    /deep/ .ant-card-body {
      padding: 24px 24px 4px 24px;
    }
    .btns {
      text-align: right;
      button {
        margin-right: 10px;
      }
    }
  }
  .card2 {
    margin-top: 24px;
  }
}
</style>

<style lang="less">
.person-form-dialog .ant-modal-body {
  max-height: 650px;
}
</style>
