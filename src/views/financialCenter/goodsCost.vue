<template>
  <page-header-view>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="商品">
                <a-input
                  v-model="queryParam.goods_text"
                  placeholder="ID、名称"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="批次">
                <a-input
                  v-model="queryParam.cost_name"
                  placeholder="名称"
                  v-number-input
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="reset"
                  >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :expandedRowRender="expandedRowRender"
      >
        <template slot="action" slot-scope="text, record, index">
          <span class="table-action" v-if="record.editable">
            <a @click="save(record, index)">保存</a>
            <a @click="handleCancel(index)">取消</a>
          </span>
          <span class="table-action" v-else>
            <a @click="handleEdit(index)">编辑</a>
          </span>
        </template>
        <!-- <a-table
          slot="expandedRowRender"
          slot-scope="expandedData, expandedDataIndex"
          v-if="
            expandedData.specs_cost_data && expandedData.specs_cost_data.length
          "
          rowKey="specs_id"
          :columns="innerColumns"
          :data-source="expandedData.specs_cost_data"
          :pagination="false"
          :showHeader="false"
        >
          <template slot="cost" slot-scope="costList, row, index">
            <a-row type="flex" :gutter="20">
              <template
                v-if="
                  tableData[expandedDataIndex] &&
                    tableData[expandedDataIndex].editable
                "
              >
                <a-col flex="250px" v-for="(item, i) in costList" :key="i">
                  <a-row type="flex" align="middle">
                    <a-col flex="100px"
                      ><a-input
                        v-model="item.cost_name"
                        placeholder="批次名称"
                        :maxLength="15"
                      ></a-input
                    ></a-col>
                    <a-col flex="100px"
                      ><a-input
                        v-model="item.cost_price"
                        prefix="￥"
                        :maxLength="12"
                        v-number-input
                      ></a-input
                    ></a-col>
                    <a-icon
                      type="minus-circle"
                      style="margin-left: 10px;"
                      @click="delCost(expandedDataIndex, index, i)"
                    />
                  </a-row>
                </a-col>
              </template>
              <template v-else>
                <a-col v-for="(item, i) in costList" :key="i">
                  <div>{{ item.cost_name }}</div>
                  <div>￥{{ item.cost_price }}</div>
                </a-col>
              </template>
            </a-row>
          </template>
          <template slot="action" slot-scope="data, row, index">
            <span
              v-if="
                tableData[expandedDataIndex] &&
                  tableData[expandedDataIndex].editable
              "
              class="table-action"
            >
              <a @click="addCost(expandedDataIndex, index)">新增成本价</a>
            </span>
          </template>
        </a-table> -->
      </s-table>
    </a-card>
  </page-header-view>
</template>

<script>
// /financialCenter/goodsCost
import cloneDeep from 'lodash.clonedeep'
import { STable } from '@/components'
import { getGoodsCost, saveSpecsCost } from '@/api/financialCenter/index'

export default {
  name: 'financialCenterGoodsCost',
  components: {
    STable
  },
  data () {
    return {
      icon: h => (
        <a-icon theme="filled" type="close-circle" style="color: red" />
      ),
      // 查询参数
      queryParam: {},
      cacheData: [],
      tableData: [],
      columns: [
        {
          title: '商品ID',
          dataIndex: 'id',
          width: 80
        },
        {
          title: '商品名称',
          dataIndex: 'goods_name',
          width: 130,
          customRender: (text, row) => {
            const href = `/nsolid/commodity/goods?goods_id=${row.id}`
            return (
              <a class="two-Multi" href={href} target="_blank">
                {text}
              </a>
            )
          }
        },
        {
          title: '规格',
          dataIndex: 'specs_num',
          width: 130
        },
        {
          title: '成本价',
          dataIndex: 'cost_text',
          width: 450,
          customRender: text => {
            return text || '--'
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 105,
          scopedSlots: { customRender: 'action' }
        }
      ],
      innerColumns: [
        {
          title: 'ID',
          width: 80
        },
        {
          title: '商品名称',
          width: 130
        },
        {
          title: '规格',
          dataIndex: 'specs_name',
          width: 130,
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '成本价',
          dataIndex: 'specs_cost_list',
          width: 450,
          scopedSlots: { customRender: 'cost' }
        },
        {
          title: '操作',
          width: 105,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getGoodsCost(Object.assign(parameter, this.queryParam)).then(
          res => {
            this.tableData = res.data.records
            this.cacheData = cloneDeep(res.data.records)
            return res
          }
        )
      },
      expandedRowKeys: []
    }
  },
  methods: {
    expandedRowRender (record, expandedDataIndex) {
      const editable = record && record.editable
      const props = {
        rowKey: 'specs_id',
        columns: this.innerColumns,
        dataSource: record.specs_cost_data,
        pagination: false,
        showHeader: false
      }
      const scopedSlots = {
        cost: (data, row, index) => {
          const editForm = data.map((item, i) => {
            return (
              <a-col flex="250px" key={i} class="cost-input-row">
                <a-row type="flex" align="middle">
                  <a-col flex="100px">
                    <a-input
                      v-model={item.cost_name}
                      placeholder="批次名称"
                      maxLength={15}
                    ></a-input>
                  </a-col>
                  <a-col flex="100px">
                    <a-input
                      v-model={item.cost_price}
                      prefix="￥"
                      maxLength={12}
                      v-number-input={undefined}
                    ></a-input>
                  </a-col>
                  <a-icon
                    type="minus-circle"
                    style="margin-left: 10px;"
                    onClick={() => {
                      this.delCost(expandedDataIndex, index, i)
                    }}
                  />
                </a-row>
              </a-col>
            )
          })
          const textData = data.map((item, i) => {
            return (
              <a-col key={i}>
                <div>{item.cost_name}</div>
                <div>￥{item.cost_price}</div>
              </a-col>
            )
          })
          const marginTop = editable ? { marginTop: '-10px' } : ''
          return (
            <a-row
              type="flex"
              gutter={20}
              style={marginTop}
            >
              {editable ? editForm : textData}
            </a-row>
          )
        },
        action: (data, row, index) => {
          return editable ? (
            <span class="table-action">
              <a onClick={() => this.addCost(expandedDataIndex, index)}>
                新增成本价
              </a>
            </span>
          ) : (
            ''
          )
        }
      }
      const table = (
        <a-table {...{ props, scopedSlots: { ...scopedSlots } }}></a-table>
      )
      return table
    },
    refresh (bool = false) {
      this.expandedRowKeys = []
      this.$refs.table.refresh(bool)
    },
    reset () {
      this.queryParam = {}
      this.refresh(true)
    },
    save (goodsData) {
      const specsCostData = goodsData.specs_cost_data.map(obj => {
        return {
          goods_id: goodsData.id,
          ...obj
        }
      })
      saveSpecsCost({
        specs_cost_data: specsCostData
      }).then(() => {
        this.refresh()
      })
    },
    handleEdit (index) {
      const target = this.tableData[index]
      if (target) {
        this.setEditable(index, true)
      }
    },
    handleCancel (index) {
      this.$set(this.tableData, index, cloneDeep(this.cacheData[index]))
      this.setEditable(index, false)
    },
    setEditable (index, value) {
      this.$set(this.tableData[index], 'editable', value)
    },
    addCost (expandedDataIndex, index) {
      this.tableData[expandedDataIndex].specs_cost_data[
        index
      ].specs_cost_list.push({
        cost_name: '',
        cost_price: ''
      })
    },
    delCost (expandedDataIndex, specIndex, index) {
      this.tableData[expandedDataIndex].specs_cost_data[
        specIndex
      ].specs_cost_list.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-pro-page-header-wrap-children-content {
  padding-bottom: 24px;
}
.cost-input-row {
  margin-top: 10px;
}
</style>
