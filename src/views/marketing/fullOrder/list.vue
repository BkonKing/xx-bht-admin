<template>
  <page-header-view>
    <a-card class="search-card" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="活动名称">
                <a-input
                  v-model="queryParam.user_text"
                  placeholder="名称"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="活动状态">
                <a-select
                  v-model="queryParam.coupon_status"
                  :options="couponStatus"
                  placeholder="请选择"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商品">
                <a-input
                  v-model="queryParam.user_text"
                  placeholder="ID、名称"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="活动类型">
                <a-select
                  v-model="queryParam.coupon_scene"
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
            <router-link
              :to="`/store/couponDetail?id=${record.id}`"
              target="_blank"
              >查看</router-link
            >
            <a
              v-if="['2', '3'].includes(record.coupon_status)"
              @click="batchDelete([record.id])"
              >删除</a
            >
            <a
              v-if="record.coupon_status === '1'"
              @click="batchFinish([record.id])"
              >结束</a
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
import {
  getAllCategory,
  getProjectList,
  finishCoupon,
  deleteCoupon
} from '@/api/marketing/fullOrder'

export default {
  name: 'CouponList',
  components: {
    AdvancedForm,
    STable
  },
  data () {
    return {
      couponStatus: [
        {
          label: '未发布',
          value: '2'
        },
        {
          label: '领取中',
          value: '1'
        },
        {
          label: '已结束',
          value: '3'
        }
      ],
      useTypes: [
        {
          label: 'APP使用',
          value: '0'
        },
        {
          label: '线下使用',
          value: '1'
        },
        {
          label: 'APP及线下',
          value: '2'
        }
      ],
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '活动名称',
          dataIndex: 'coupon_status_name'
        },
        {
          title: '活动状态',
          dataIndex: 'shops_coupon_name'
        },
        {
          title: '活动时间',
          dataIndex: 'coupon_mode_name',
          customRender: (text, row) => {
            return (<div>
              <div>{text}</div>
              <div>{row.endTime}</div>
            </div>)
          }
        },
        {
          title: '活动类型',
          dataIndex: 'coupon_scene_name'
        },
        {
          title: '商品数',
          dataIndex: 'denomination',
          sorter: true
        },
        {
          title: '订单量',
          dataIndex: 'threshold_price',
          sorter: true
        },
        {
          title: '销售量',
          dataIndex: 'is_limit',
          sorter: true
        },
        {
          title: '创建时间',
          dataIndex: 'ctime'
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
        params.sort_field = parameter.sortField
        params.sort_type = sortText[parameter.sortOrder]
        return getAllCategory(Object.assign(parameter, params))
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
  created () {
  },
  methods: {
    refreshTable (bool = false) {
      this.$refs.table.refresh(bool)
    },
    resetTable () {
      this.queryParam = {}
      this.refreshTable(true)
    },
    addActivity () {

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
        id.length > 1 ? `，确定结束${id.length}个活动吗？` : '确定结束该活动吗？'
      this.confirm({
        title: '结束店铺券',
        content,
        fn: () => {
          this.finishCoupon(id.join(','))
        }
      })
    },
    finishCoupon (id) {
      finishCoupon({
        shops_coupon_id_text: id
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
          this.$message.success('提交成功')
          this.refreshTable()
        } else {
          this.$message.error(message)
        }
      })
    },
    // 删除操作
    batchDelete (id = this.selectedRowKeys) {
      const content =
        id.length > 1 ? `，确定删除${id.length}个活动吗？` : '确定删除该活动吗？'
      this.confirm({
        title: '删除店铺券',
        content,
        fn: () => {
          this.deleteCoupon(this.selectedRowKeys.join(','))
        }
      })
    },
    deleteCoupon (id) {
      deleteCoupon({
        shops_coupon_id_text: id
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
          this.$message.success('删除成功')
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
