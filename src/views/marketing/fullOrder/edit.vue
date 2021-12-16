<template>
  <page-header-view>
    <a-card title="基础信息" :bordered="false">
      <a-form-model
        ref="BasicForm"
        :model="formData"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item required prop="activity_name" label="活动名称">
          <a-input
            v-model="formData.activity_name"
            placeholder="请输入"
            :maxLength="25"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item required prop="time" label="活动时间">
          <a-range-picker
            v-model="formData.time"
            :show-time="{ defaultValue: [defaultTime, defaultTime] }"
            :placeholder="['开始时间', '结束时间']"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
          />
          <div style="color: #00000072;">
            达到设定时间将自动开始和结束
          </div>
        </a-form-model-item>
        <a-form-model-item prop="activity_desc" label="活动描述">
          <a-textarea
            v-model="formData.activity_desc"
            placeholder="请输入"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            :maxLength="500"
          />
        </a-form-model-item>
        <a-form-model-item label="活动商品" prop="activity_goods_type">
          <a-radio-group
            v-model="formData.activity_goods_type"
            :options="goodsTypes"
          />
        </a-form-model-item>
        <a-form-model-item label="活动对象">
          <a-radio :defaultChecked="true">全部用户</a-radio>
        </a-form-model-item>
        <a-form-model-item label="活动类型">
          <a-radio :defaultChecked="true">满件打折</a-radio>
        </a-form-model-item>
        <a-form-model-item label="活动规则" required>
          <a-row
            v-for="(item, index) in formData.activity_rules"
            :key="index"
            :gutter="20"
            type="flex"
            style="margin-bottom: 24px;"
          >
            <a-col flex="1"
              ><a-form-model-item
                :prop="`activity_rules.${index}.number`"
                :rules="{ required: true, message: '请填写' }"
              >
                <a-input
                  v-model="item.number"
                  v-number-input
                  :maxLength="10"
                  suffix="件"
                ></a-input></a-form-model-item
            ></a-col>
            <a-col flex="1"
              ><a-form-model-item
                :prop="`activity_rules.${index}.discount`"
                :rules="[{ required: true, message: '请填写' }]"
              >
                <a-input
                  v-model="item.discount"
                  v-number-input
                  :maxLength="10"
                  suffix="折"
                ></a-input></a-form-model-item
            ></a-col>
            <a-col>
              <a-icon
                class="close-btn"
                type="minus-circle"
                @click="delRule(index)"
              />
            </a-col>
          </a-row>
          <div class="addBtn" @click="addRule">+ <span>添加</span></div>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card v-if="isPartGoods" title="活动商品" style="margin-top: 24px">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="商品分类">
                <a-select v-model="queryParam.category_id" placeholder="请选择">
                  <a-select-option
                    v-for="item in categoryStatus"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.category_name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商品状态">
                <a-select
                  v-model="queryParam.is_open"
                  :options="goodsStatus"
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
            <advanced-form
              :md="24"
              :isAdvanced="false"
              @reset="resetTable"
              @search="refreshTable(true)"
            ></advanced-form>
          </a-row>
        </a-form>
        <div class="table-operator">
          <a-button type="primary" @click="visible = true">
            添加商品
          </a-button>
          <a-button @click="batchOperate">
            批量移除
          </a-button>
        </div>
        <a-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data-source="filterTableData"
          :alert="{ clear: true }"
          :rowSelection="rowSelection"
          :rowSelectionPaging="true"
          :showPagination="true"
        >
          <template v-slot:specs="text">
            <div v-html="text"></div>
          </template>
          <template slot="action" slot-scope="text, record">
            <a @click="batchDelete([record.goods_id])"> 删除</a>
          </template>
        </a-table>
      </div>
    </a-card>
    <div style="height: 80px;"></div>
    <footer-tool-bar style="width: 100%;">
      <a-button @click="$router.go(-1)" style="margin-right: 15px;">
        取消
      </a-button>
      <a-button type="primary" @click="handleSubmit" :loading="loading"
        >提交</a-button
      >
    </footer-tool-bar>
    <a-modal
      title="选择商品"
      width="800px"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleAddOk"
      @cancel="handleAddCancel"
    >
      <goods-table
        v-if="visible"
        ref="goods-table"
        :disabledRowkeys="goodsIds"
      ></goods-table>
    </a-modal>
  </page-header-view>
</template>

<script>
import moment from 'moment'
import cloneDeep from 'lodash.clonedeep'
import PageHeaderView from '@/layouts/PageHeaderView'
import FooterToolBar from '@/components/FooterToolbar'
import GoodsTable from './components/GoodsTable'
import { AdvancedForm, TImage } from '@/components'
import {
  saveActivity,
  getActivityGoods,
  getActivityInfo,
  getGoodsCategory,
  getGoodsListByIds
} from '@/api/marketing/fullOrder'

export default {
  name: 'SpecialEdit',
  components: {
    PageHeaderView,
    FooterToolBar,
    AdvancedForm,
    GoodsTable,
    // eslint-disable-next-line vue/no-unused-components
    TImage
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      id: '',
      defaultTime: moment('00:00:00', 'HH:mm:ss'),
      loading: false,
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 10 } },
      goodsStatus: [
        { value: 1, label: '上架' },
        { value: 0, label: '下架' }
      ],
      categoryStatus: [],
      formData: {
        activity_name: '',
        time: [],
        activity_desc: '',
        activity_goods_type: 1,
        activity_rules: []
      },
      rules: {
        activity_name: [{ required: true, message: '请输入活动名称' }],
        time: [{ required: true, message: '请选择时间' }]
      },
      goodsTypes: [
        {
          value: 1,
          label: '全部商品'
        },
        {
          value: 2,
          label: '部分商品'
        }
      ],
      queryParam: {},
      couponStatus: [],
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        {
          title: '商品编号',
          dataIndex: 'id'
        },
        {
          title: '分类',
          dataIndex: 'category_name'
        },
        {
          title: '图片',
          dataIndex: 'thumb',
          customRender: text => {
            const src = [text]
            return (
              <t-image images={src} class="goods-image group-image"></t-image>
            )
          }
        },
        {
          title: '商品名称',
          dataIndex: 'goods_name',
          customRender: (text, row) => {
            return (
              <a
                class="two-Multi"
                href={`/nsolid/commodity/goods?goods_id=${row.id}`}
                target="_blank"
              >
                {text}
              </a>
            )
          }
        },
        {
          title: '规格 / 价格(现价|会员价|优享价)',
          dataIndex: 'sell_text',
          scopedSlots: { customRender: 'specs' }
        },
        {
          title: '库存(可拍)',
          dataIndex: 'stock',
          customRender: (text, row) => {
            return (
              <div>
                <span>{text}</span>
                <span>({row.available_stock})</span>
              </div>
            )
          }
        },
        {
          title: '商品状态',
          dataIndex: 'is_open_name'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      allTableData: [],
      filterTableData: [],
      loadData: parameter => {
        const params = cloneDeep(this.queryParam)
        params.activity_id = this.id
        return getActivityGoods(Object.assign(parameter, params))
      }
    }
  },
  computed: {
    isPartGoods () {
      return +this.formData.activity_goods_type === 2
    },
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },
    goodsIds () {
      return this.allTableData.map(obj => obj.goods_id)
    }
  },
  created () {
    this.id = this.$route.query.id
    this.id && this.getActivityInfo()
    this.getGoodsCategory()
  },
  methods: {
    getGoodsCategory () {
      getGoodsCategory({
        id: this.id
      }).then(({ data }) => {
        this.categoryStatus = data
      })
    },
    getActivityInfo () {
      getActivityInfo({
        id: this.id
      }).then(({ info }) => {
        const time = info.activity_time_desc
        if (time) {
          const timeArr = time.split('~')
          info.time = [timeArr[0], timeArr[1]]
        }
        this.formData = {
          id: info.id,
          activity_name: info.activity_name,
          time: info.time || [],
          activity_desc: info.activity_desc,
          activity_goods_type: info.activity_goods_type,
          activity_rules: info.rule_list || []
        };
        +info.activity_goods_type === 2 && this.getActivityGoods()
      })
    },
    async getActivityGoods () {
      const { data } = await getActivityGoods({
        activity_id: this.id
      })
      const records = data.records || []
      this.allTableData = records
      this.filterTableData = cloneDeep(records)
    },
    addRule () {
      this.formData.activity_rules.push({
        number: '',
        discount: ''
      })
    },
    delRule (index) {
      this.formData.activity_rules.splice(index, 1)
    },
    // 批量操作
    batchOperate () {
      if (this.selectedRowKeys.length) {
        this.batchDelete()
      } else {
        this.$message.warning('请选择后再进行操作')
      }
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
    // 删除操作
    batchDelete (id = this.selectedRowKeys) {
      const content =
        id.length > 1
          ? `，确定移除${id.length}个商品吗？`
          : '确定移除该商品吗？'
      this.confirm({
        title: '移除商品',
        content,
        fn: () => {
          this.deleteGoods(id)
        }
      })
    },
    deleteGoods (ids) {
      ids.forEach(id => {
        const index = this.allTableData.findIndex(obj => obj.goods_id === id)
        this.allTableData.splice(index, 1)
        this.refreshTable()
      })
    },
    formValidate (form) {
      return new Promise((resolve, reject) => {
        this.$refs[form].validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject(new Error(false))
            return false
          }
        })
      })
    },
    handleSubmit () {
      Promise.all([this.formValidate('BasicForm')]).then(() => {
        if (
          !this.formData.activity_rules ||
          !this.formData.activity_rules.length
        ) {
          this.$message.warning('请添加一条活动规则')
          return
        }
        if (
          this.formData.activity_goods_type === 2 &&
          this.goodsIds.length === 0
        ) {
          this.$message.warning('请至少添加一个活动商品')
          return
        }
        this.saveActivity(cloneDeep(this.formData))
      })
    },
    saveActivity (params) {
      const { time } = params
      if (time && time.length) {
        params.activity_time = `${time[0]}~${time[1]}`
      }
      params.type = this.id ? 2 : 1
      params.activity_type = 1
      params.activity_user_type = 1
      if (params.activity_goods_type === 2) {
        params.goods_ids = this.goodsIds.join(',')
      }
      saveActivity(params).then(({ success, message }) => {
        if (success) {
          this.$message.success('提交成功')
          this.$router.go(-1)
        }
      })
    },
    handleAddOk () {
      const ids = this.$refs['goods-table'].selectedRowKeys
      if (ids && ids.length) {
        const goodsIds = cloneDeep(ids)
        const newIds = goodsIds.filter(id => {
          return this.allTableData.findIndex(obj => +obj.id === +id) === -1
        })
        this.getGoodsListByIds(newIds)
      }
    },
    async getGoodsListByIds (ids) {
      const { data } = await getGoodsListByIds({
        goods_ids: ids.join(',')
      })
      this.allTableData.unshift(...data.records)
      this.visible = false
      this.resetTable()
    },
    handleAddCancel () {
      this.visible = false
    },
    refreshTable () {
      this.filterTableData = this.allTableData.filter(obj => {
        const {
          is_open: isOpen,
          sSearch: search,
          category_id: categoryId
        } = this.queryParam
        const isOpenBool = isOpen === undefined || obj.is_open === isOpen
        const searchBool =
          !search ||
          obj.goods_name.indexOf(search) > -1 ||
          obj.goods_id == search
        const categoryBool = !categoryId || +obj.category_id === +categoryId
        return isOpenBool && searchBool && categoryBool
      })
    },
    resetTable () {
      this.queryParam = {}
      this.filterTableData = cloneDeep(this.allTableData)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-thead > tr > th {
  padding: 12px 8px;
}
/deep/ .ant-table-tbody > tr > td {
  padding: 12px 8px;
  vertical-align: top;
  line-height: 32px;
}
.introduction-upload /deep/ .ant-upload-list-picture-card-container,
.introduction-upload /deep/ .ant-upload.ant-upload-select-picture-card {
  width: 100%;
  height: 190px;
  margin-bottom: 0;
}
.addBtn {
  width: calc(100% - 38px);
  height: 32px;
  border-radius: 4px;
  border: 1px dashed #d9d9d9;
  text-align: center;
  line-height: 28px;
  cursor: pointer;
}
.close-btn {
  display: flex;
  margin-top: 7px;
  font-size: 18px;
}
.goods-image {
  /deep/ .image-box {
    margin: 0;
    img {
      width: 45px;
      height: 45px;
    }
  }
}
/deep/ .one {
  margin-right: 10px;
}
</style>
