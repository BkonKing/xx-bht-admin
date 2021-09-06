<template>
  <div class="operaLog">
    <a-card class="card">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline">
          <a-row :gutter="36">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="模块">
                <a-cascader
                  placeholder="请选择"
                  v-model="logType"
                  :field-names="{
                    label: 'logType',
                    value: 'typeId',
                    children: 'children'
                  }"
                  :options="options"
                  change-on-select
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="操作员">
                <a-select v-model="adminId" placeholder="请选择">
                  <a-select-option
                    v-for="(item, index) in logAdminArr"
                    :key="index"
                    :value="item.adminId"
                  >
                    {{ item.admin }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <template v-if="bol">
              <a-col :md="8" :sm="24">
                <a-form-model-item label="操作时间">
                  <a-range-picker
                    v-model="operaTime"
                    style="width: 100%"
                    :placeholder="['开始时间', '结束时间']"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="操作类型">
                  <a-input
                    v-model="operationType"
                    placeholder="关键字"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="操作说明">
                  <a-input v-model="serachText" placeholder="关键字"></a-input>
                </a-form-model-item>
              </a-col>
            </template>
            <a-col :md="8" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="(bol && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="search">查询</a-button>
                <a-button style="margin-left: 8px" @click="reset">重置</a-button>
                <a @click="toggle" style="margin-left: 8px">
                  {{ bol ? "收起" : "展开" }}
                  <a-icon :type="bol ? 'up' : 'down'"
                /></a>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card class="card2">
      <a-table
        rowKey="id"
        :columns="columns"
        :pagination="false"
        :data-source="tableData"
      >
      </a-table>
      <div class="pagination">
        <!-- :default-current="pagination.currentPage" -->
        <a-pagination
          v-model="pagination.currentPage"
          show-quick-jumper
          show-size-changer
          :page-size-options="pagination.sizes"
          :total="pagination.total"
          :page-size.sync="pagination.pageSize"
          :show-total="
            (total, range) =>
              `共 ${total} 条记录 第${pagination.currentPage}/${Math.ceil(
                total / pagination.pageSize
              )}页`
          "
          @change="onChange"
          @showSizeChange="sizeChange"
        />
      </div>
    </a-card>
  </div>
</template>

<script>
import {
  toGetLogsList,
  toGetLogType,
  toGetLogAdmin
} from '@/api/permissionManage'
import moment from 'moment'
export default {
  data () {
    return {
      options: [],
      bol: true,
      tableData: [],
      columns: [
        {
          title: 'id',
          dataIndex: 'id',
          width: '90px'
        },
        {
          title: '操作时间',
          dataIndex: 'ctime',
          width: '165px'
        },
        {
          title: '模块',
          dataIndex: 'logType',
          width: '15%'
          // ellipsis: true
        },
        {
          title: '操作员',
          dataIndex: 'admin',
          width: '160px'
          // ellipsis: true
        },
        {
          title: '操作类型',
          dataIndex: 'operationType',
          width: '90px'
        },
        {
          title: '操作说明',
          dataIndex: 'content',
          key: 'content',
          width: '40%'
          // ellipsis: true
        }
      ],
      pagination: {
        // 任务流水列表页码
        sizes: ['1', '5', '10', '15'], // 页容量
        currentPage: 1, // 默认页
        total: 50, // 总数
        pageSize: 10 // 默认页容量
      },
      startDate: '', // 否date开始日期：2021-03-13
      endDate: '', // 否date结束日期：2021-03-16
      logType: [], // 否int操作模块
      operationType: '', // 否varchar操作类型关键字
      serachText: '', // 否varchar操作说明关键字
      adminId: undefined, // 否int操作员
      operaTime: [],
      logAdminArr: [] // 操作日志员
    }
  },
  methods: {
    reset () {
      this.startDate = ''
      this.endDate = ''
      this.logType = ''
      this.operationType = ''
      this.serachText = ''
      this.adminId = undefined
      this.operaTime = []
      this.pagination.currentPage = 1
      this.getData()
    },
    // 查询
    search () {
      this.pagination.currentPage = 1
      this.getData()
    },
    // 任务流水页码改变事件
    onChange (page, size) {
      // console.log('Page: ', page)
      this.pagination.currentPage = page
      this.getData()
    },
    // 任务流水页容量改变事件
    sizeChange (current, size) {
      // console.log('size: ', size)
      this.pagination.currentPage = 1
      this.pagination.pageSize = size
      this.getData()
    },
    // 获取日志列表
    getData () {
      toGetLogsList({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        startDate:
          this.operaTime.length > 0
            ? moment(this.operaTime[0]).format('YYYY-MM-DD')
            : '',
        endDate:
          this.operaTime.length > 0
            ? moment(this.operaTime[1]).format('YYYY-MM-DD')
            : '',
        logType: this.logType[this.logType.length - 1],
        operationType: this.operationType,
        searchText: this.serachText,
        adminId: this.adminId
      }).then(({ data }) => {
        this.tableData = data.records
        this.pagination.total = +data.total
        console.log('获取日志列表', data)
      })
    },
    // 展开
    toggle () {
      this.bol = !this.bol
    }
  },
  created () {
    this.getData()
    // 获取日志对应模块
    toGetLogType().then(res => {
      this.options = res.data
      console.log('获取日志的模块', res)
    })
    // 获取操作日志员
    toGetLogAdmin().then(res => {
      this.logAdminArr = res.data
      console.log('获取操作日志成员', res)
    })
  }
}
</script>

<style lang="less" scoped>
.card {
  /deep/ .ant-form-item-label {
    min-width: 88px;
  }
  /deep/ .ant-card-body {
    padding: 24px 24px 4px 24px;
  }
  .piker-time {
    width: 100% !important;
  }
  .btns {
    text-align: right;
    button {
      margin-right: 10px;
    }
  }
}
.card2 {
  margin-top: 20px;
}
.pagination {
  margin-top: 10px;
  /deep/ .ant-pagination {
    padding-top: 10px;
    padding-bottom: 20px;
    text-align: right;
  }
  /deep/ .ant-pagination-total-text {
    float: left;
    // margin-left: 20px;
    // margin-right: 300px;
  }
}
</style>
