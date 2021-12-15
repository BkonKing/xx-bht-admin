<template>
  <page-header-view :title="info.activity_name">
    <template v-slot:content>
      <a-descriptions size="small" :column="2">
        <a-descriptions-item label="活动类型">
          {{ info.activity_type_desc || "--" }}
        </a-descriptions-item>
        <a-descriptions-item label="创建人">
          {{ info.admin_name }} {{ info.activity_ctime }}
        </a-descriptions-item>
        <a-descriptions-item label="活动对象">
          {{ info.activity_user_type_desc || "--" }}
        </a-descriptions-item>
        <a-descriptions-item label="活动时间">
          {{ info.activity_time_desc || "--" }}
        </a-descriptions-item>
        <!-- <a-descriptions-item label="活动商品标识">
          {{ info.activity_pic || "--" }}
        </a-descriptions-item> -->
        <a-descriptions-item label="活动说明" :span="2">
          {{ info.activity_desc || "--" }}
        </a-descriptions-item>
      </a-descriptions>
    </template>

    <!-- actions -->
    <template v-slot:extra>
      <a-button
        v-if="['0', '2'].includes(info.activity_status)"
        @click="handleDelete"
        >删除</a-button
      >
      <a-button
        v-if="info.activity_status === '1'"
        type="primary"
        @click="handleFinish"
        >结束</a-button
      >
      <a-button type="primary" @click="goEdit">编辑</a-button>
    </template>

    <template v-slot:extraContent>
      <div class="status-list">
        <div style="flex: 0 0 110px;">
          <div class="text">状态</div>
          <div class="heading">{{ info.activity_status_desc }}</div>
        </div>
      </div>
    </template>

    <a-card :bordered="false" style="margin-top: 24px">
      <a-row type="flex">
        <a-col flex="1">
          <detail-info
            title="商品数"
            :value="info.activity_goods_count"
            :bordered="true"
          />
        </a-col>
        <a-col flex="1">
          <detail-info
            title="订单量"
            :value="info.activity_order_count"
            :bordered="true"
          />
        </a-col>
        <a-col flex="1">
          <detail-info
            title="销量"
            :value="info.activity_sale_count"
            :bordered="true"
          >
            <template v-slot:tooltip>
              <div>活动商品的销量</div>
            </template>
          </detail-info>
        </a-col>
        <a-col flex="1">
          <detail-info title="销售额" :value="info.activity_order_price">
            <template v-slot:tooltip>
              <div>活动商品的销售额</div>
            </template>
          </detail-info>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="活动规则" style="margin-top: 24px">
      <a-table
        ref="ruleTable"
        size="default"
        rowKey="id"
        :columns="ruleColumns"
        :data-source="info.rule_list"
        :pagination="false"
      >
      </a-table>
    </a-card>

    <a-card title="活动商品" style="margin-top: 24px">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="商品分类">
                <a-select v-model="queryParam.category_id" placeholder="请选择">
                  <a-select-option
                    v-for="item in CategoryStatus"
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
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :showPagination="true"
        >
        </s-table>
      </div>
    </a-card>
  </page-header-view>
</template>

<script>
// /store/couponDetail
import clonedeep from 'lodash.clonedeep'
import { STable, AdvancedForm, DetailInfo, TImage } from '@/components'
import {
  getActivityInfo,
  getActivityGoods,
  getGoodsCategory,
  optActivity
} from '@/api/marketing/fullOrder'

export default {
  name: 'storeCouponDetail',
  components: {
    AdvancedForm,
    DetailInfo,
    STable,
    // eslint-disable-next-line vue/no-unused-components
    TImage
  },
  data () {
    return {
      goodsStatus: [
        { value: '1', label: '上架' },
        { value: '0', label: '下架' }
      ],
      id: '',
      info: {
        log_data: []
      },
      CategoryStatus: [],
      queryParam: {},
      ruleColumns: [
        {
          title: '满件打折',
          dataIndex: 'full_discount'
        }
        // {
        //   title: '满件送礼',
        //   dataIndex: 'full_gifts'
        // },
        // {
        //   title: '赠送礼品',
        //   dataIndex: 'gift_giving'
        // }
      ],
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
          dataIndex: 'specs_name',
          customRender: (text, row) => {
            return (
              <div class="flex-center">
                <span class="specification-span">{text} </span>
                <span>
                  ￥{row.s_price} | ￥{row.vip_price} | ￥{row.e_price}
                </span>
              </div>
            )
          }
        },
        {
          title: '库存(可拍)',
          dataIndex: 'stock',
          width: 120,
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
          dataIndex: 'is_open_name',
          width: 100
        },
        {
          title: '订单量',
          dataIndex: 'order_count',
          width: 100,
          sorter: true
        },
        {
          title: '销售量',
          dataIndex: 'sale_count',
          width: 100,
          sorter: true
        },
        {
          title: '销售额',
          dataIndex: 'activity_order_price',
          width: 100,
          sorter: true
        }
      ],
      loadData: parameter => {
        const sortText = {
          ascend: 'asc',
          descend: 'desc'
        }
        const params = clonedeep(this.queryParam)
        params.order_field = parameter.sortField
        params.order_value = sortText[parameter.sortOrder]
        params.activity_id = this.id
        return getActivityGoods(Object.assign(parameter, params))
      }
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getActivityInfo()
    this.getGoodsCategory()
  },
  methods: {
    getGoodsCategory () {
      getGoodsCategory({
        id: this.id
      }).then(({ data }) => {
        this.CategoryStatus = data
      })
    },
    getActivityInfo () {
      getActivityInfo({
        id: this.id
      }).then(({ info }) => {
        this.info = info
      })
    },
    refreshPage () {
      this.getActivityInfo()
      this.refreshTable()
    },
    refreshTable (bool = false) {
      this.$refs.table.refresh(bool)
    },
    resetTable () {
      this.queryParam = {}
      this.refreshTable(true)
    },
    goEdit () {
      this.$router.push({
        name: 'fullOrderEdit',
        query: {
          id: this.id
        }
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
    // 结束操作
    handleFinish () {
      this.confirm({
        title: '结束活动',
        content: '确定结束该活动吗？',
        fn: () => {
          this.finishCoupon()
        }
      })
    },
    finishCoupon () {
      optActivity({
        ids: this.id,
        type: 2
      }).then(({ success }) => {
        if (success) {
          this.$message.success('提交成功')
          this.refreshPage()
        }
      })
    },
    // 删除操作
    handleDelete (id = this.selectedRowKeys) {
      this.confirm({
        title: '删除活动',
        content: '确定删除该活动吗？',
        fn: () => {
          this.deleteCoupon()
        }
      })
    },
    deleteCoupon () {
      optActivity({
        ids: this.id,
        type: 1
      }).then(({ success }) => {
        if (success) {
          this.$message.success('删除成功')
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-descriptions-item {
  vertical-align: top;
  > span {
    vertical-align: top;
  }
}
.detail-layout {
  margin-left: 44px;
}
.text {
  text-align: right;
  color: rgba(0, 0, 0, 0.45);
}

.heading {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  text-align: right;
}

.no-data {
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  line-height: 64px;
  font-size: 16px;

  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
}

/deep/ .ant-pro-page-header-wrap-page-header-warp {
  .ant-pro-page-header-wrap-extraContent {
    position: initial;
  }
}
.status-list {
  display: flex;
  justify-content: flex-end;
  text-align: left;
  .text,
  .heading {
    padding-left: 40px;
  }
}

.table-page-search-wrapper
  /deep/
  .ant-form-inline
  .ant-form-item
  > .ant-form-item-label {
  min-width: 80px;
  flex-shrink: 0;
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

.specification-span {
  display: inline-block;
  max-width: 60%;
  margin-right: 5px;
  .textOverflow();
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>
