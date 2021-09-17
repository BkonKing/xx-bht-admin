<template>
  <page-header-view>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="专题状态">
                <a-select v-model="queryParam.isOpen" placeholder="请选择">
                  <a-select-option
                    v-for="option in statusOptions"
                    :value="option.value"
                    :key="option.value"
                  >
                    {{ option.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="专题名称">
                <a-input
                  v-model="queryParam.specialSearch"
                  placeholder="ID、名称"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商品">
                <a-input
                  v-model="queryParam.goodsSearch"
                  placeholder="ID、名称"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="refresh">查询</a-button>
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
      <div class="table-operator">
        <a-button type="primary" @click="goEdit">新增</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :sortKey="{ ascend: 'asc', descend: 'desc' }"
        :data="loadData"
        :showPagination="true"
      >
        <span class="table-action" slot="action" slot-scope="text, record">
          <template>
            <a @click="goDetail(record)">查看</a>
            <a @click="goEdit(record)">编辑</a>
            <a-popconfirm
              :icon="icon"
              placement="top"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleRemove(record)"
            >
              <template slot="title">
                <p>
                  你确定要删除这行内容吗？
                </p>
              </template>
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-view>
</template>

<script>
import PageHeaderView from '@/layouts/PageHeaderView'
import { STable } from '@/components'
import { getList, delSpecial } from '@/api/commodity/specail'

export default {
  name: 'SpecialList',
  components: {
    PageHeaderView,
    STable
  },
  data () {
    return {
      statusOptions: [
        { value: '1', text: '开启' },
        { value: '2', text: '关闭' }
      ],
      icon: h => (
        <a-icon theme="filled" type="close-circle" style="color: red" />
      ),
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '专题名称',
          dataIndex: 'title',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '展示形式',
          dataIndex: 'type_desc'
        },
        {
          title: '商品',
          dataIndex: 'goods_num',
          sorter: true
        },
        {
          dataIndex: 'visit_num',
          sorter: true,
          title: () => {
            return <div>浏览量<a-tooltip>
              <template slot="title">
                  一个用户仅算一次
              </template>
              <a-icon
                type="info-circle"
                style="color: #797979;margin-top: 3px;margin-left: 3px;"
              />
            </a-tooltip></div>
          }
        },
        {
          title: '专题状态',
          dataIndex: 'open_desc'
        },
        {
          title: '开启时间',
          dataIndex: 'stime',
          customRender: (text, row) => {
            const ele = (
              <div>
                {text ? <div>起 {text}</div> : ''}
                {row.etime ? <div>止 {row.etime}</div> : ''}
              </div>
            )
            return text || row.etime ? ele : '--'
          }
        },
        {
          title: '创建时间',
          dataIndex: 'ctime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          class: 'nowrap',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getList(Object.assign(parameter, this.queryParam))
      }
    }
  },
  methods: {
    refresh (bool) {
      this.$refs.table.refresh(bool)
    },
    reset () {
      this.queryParam = {}
      this.refresh(true)
    },
    handleRemove ({ id }) {
      delSpecial({
        special_id: id
      }).then(({ data }) => {
        this.$message.success('删除专题成功')
        this.$refs.table.refresh()
      })
    },
    goEdit ({ id }) {
      this.$router.push({
        name: 'specialEdit',
        query: {
          id
        }
      })
    },
    goDetail ({ id }) {
      this.$router.push({
        name: 'specialDetail',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
