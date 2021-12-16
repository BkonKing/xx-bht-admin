<template>
  <page-header-view>
    <a-card class="search-card" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="活动名称">
                <a-input
                  v-model="queryParam.activity_name"
                  placeholder="名称"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="活动状态">
                <a-select
                  v-model="queryParam.activity_status"
                  :options="couponStatus"
                  placeholder="请选择"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商品">
                <a-input
                  v-model="queryParam.sSearch"
                  placeholder="ID、名称"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="活动类型">
                <a-select
                  v-model="queryParam.activity_type"
                  :options="useTypes"
                  placeholder="请选择"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <advanced-form
              :md="16"
              :isAdvanced="false"
              @reset="resetTable"
              @search="refreshTable(true)"
            ></advanced-form>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-button type="primary" @click="addActivity">
          新增活动
        </a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="2" @click="batchOperate(1)">
              结束
            </a-menu-item>
            <a-menu-item key="3" @click="batchOperate(2)">
              删除
            </a-menu-item>
          </a-menu>
          <a-button> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="{ clear: true }"
        :rowSelection="rowSelection"
        :rowSelectionPaging="true"
        :showPagination="true"
      >
        <span class="table-action" slot="action" slot-scope="text, record">
          <template>
            <a :href="`/marketing/fullOrder/detail?id=${record.id}`">查看</a>
            <a :href="`/marketing/fullOrder/edit?id=${record.id}`">编辑</a>
            <a
              v-if="['0', '2'].includes(record.activity_status)"
              @click="batchDelete([record.id])"
              >删除</a
            >
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-view>
</template>

<script>
// /store/list
import cloneDeep from 'lodash.clonedeep'
import { STable, AdvancedForm } from '@/components'
import { getActivityList, optActivity } from '@/api/marketing/fullOrder'

export default {
  name: 'CouponList',
  components: {
    AdvancedForm,
    STable
  },
  data () {
    return {
      couponStatus: [
        { value: '1', label: '进行中' },
        { value: '2', label: '已暂停' },
        { value: '3', label: '已结束' }
      ],
      useTypes: [
        { value: '1', label: '满件打折' },
        { value: '2', label: '满件送礼' },
        { value: '3', label: '满件送礼+打折' }
      ],
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '活动名称',
          dataIndex: 'activity_name'
        },
        {
          title: '活动状态',
          dataIndex: 'activity_status_desc'
        },
        {
          title: '活动时间',
          dataIndex: 'activity_stime',
          customRender: (text, row) => {
            const eTime = row.activity_etime
            const ele = (
              <div>
                {text ? <div>起 {text}</div> : ''}
                {eTime ? <div>止 {eTime}</div> : ''}
              </div>
            )
            return text || eTime ? ele : '--'
          }
        },
        {
          title: '活动类型',
          dataIndex: 'activity_type_desc'
        },
        {
          title: '商品数',
          dataIndex: 'activity_goods_count',
          sorter: true
        },
        {
          title: '订单量',
          dataIndex: 'activity_order_count',
          sorter: true
        },
        {
          title: '销售量',
          dataIndex: 'activity_sale_count',
          sorter: true
        },
        {
          title: '创建时间',
          dataIndex: 'activity_ctime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '140px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const sortText = {
          ascend: 'asc',
          descend: 'desc'
        }
        const params = cloneDeep(this.queryParam)
        params.order_field = parameter.sortField
        params.order_value = sortText[parameter.sortOrder]
        return getActivityList(Object.assign(parameter, params))
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  created () {},
  methods: {
    refreshTable (bool = false) {
      this.$refs.table.refresh(bool)
    },
    resetTable () {
      this.queryParam = {}
      this.refreshTable(true)
    },
    addActivity () {
      this.$router.push({
        name: 'fullOrderEdit'
      })
    },
    confirm ({ title, content, fn }) {
      this.$confirm({
        title,
        content,
        icon: () => (
          <a-icon
            type="exclamation-circle"
            style="color: #faad14"
            theme="filled"
          />
        ),
        cancelText: '取消',
        okText: '确定',
        onOk () {
          fn()
        },
        onCancel () {}
      })
    },
    // 批量操作
    batchOperate (key) {
      if (this.selectedRowKeys.length) {
        const methodName = {
          1: 'batchFinish',
          2: 'batchDelete'
        }
        this[methodName[key]]()
      } else {
        this.$message.warning('请选择后再进行操作')
      }
    },
    // 结束操作
    batchFinish (id = this.selectedRowKeys) {
      const content =
        id.length > 1 ? `确定结束${id.length}个活动吗？` : '确定结束该活动吗？'
      this.confirm({
        title: '结束活动',
        content,
        fn: () => {
          this.optActivity(id.join(','), 2)
        }
      })
    },
    // 删除操作
    batchDelete (id = this.selectedRowKeys) {
      const content =
        id.length > 1 ? `确定删除${id.length}个活动吗？` : '确定删除该活动吗？'
      this.confirm({
        title: '删除活动',
        content,
        fn: () => {
          this.deleteInfo(id.join(','), 1)
        }
      })
    },
    optActivity (id, type) {
      optActivity({
        ids: id,
        type
      }).then(({ success, message }) => {
        if (success) {
          const ids = id.split(',')
          // 选中selectedRowKeys去除删除的key
          this.selectedRowKeys = this.selectedRowKeys.filter(
            obj => !ids.includes(obj)
          )
          this.selectedRows = this.selectedRows.filter(
            obj => !ids.includes(obj)
          )
          this.$message.success(type === 1 ? '删除成功' : '结束成功')
          this.refreshTable()
        } else {
          this.$message.error(message)
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style lang="less" scoped>
.table-page-search-wrapper
  /deep/
  .ant-form-inline
  .ant-form-item
  > .ant-form-item-label {
  min-width: 80px;
  flex-shrink: 0;
}
.alert-text {
  color: @error-color;
}
/deep/ .ant-form-item-control,
/deep/ .ant-form-item-label {
  line-height: 32px;
}
.table-action a + a {
  margin-left: 10px;
}
</style>
