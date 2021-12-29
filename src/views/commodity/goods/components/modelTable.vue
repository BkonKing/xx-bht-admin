<template>
  <div class="edit-table">
    <a-row class="edit-table-header" type="flex">
      <a-col flex="26px"></a-col>
      <a-col class="form-required-after" flex="160px">规格</a-col>
      <a-col class="form-required-after jc-center" flex="54px">图片</a-col>
      <a-col class="form-required-after" flex="1">售价</a-col>
      <a-col flex="1">原价</a-col>
      <a-col class="form-required-after" flex="1">会员价</a-col>
      <a-col class="form-required-after" flex="1">优享价</a-col>
      <a-col class="form-required-after" flex="1">关联仓库</a-col>
      <a-col flex="100px">库存(可拍)</a-col>
      <a-col flex="90px">排序</a-col>
      <a-col class="jc-center" flex="60px">试喝</a-col>
      <a-col class="jc-center" flex="60px"
        >组合<a-tooltip>
          <template slot="title">
            多个商品组合
          </template>
          <a-icon
            type="info-circle"
            style="color: #797979;margin-top: 3px;margin-left: 3px;"
          /> </a-tooltip
      ></a-col>
      <a-col class="jc-center" flex="60px"
        >显示<a-tooltip>
          <template slot="title">
            小程序显示规格
          </template>
          <a-icon
            type="info-circle"
            style="color: #797979;margin-top: 3px;margin-left: 3px;"
          /> </a-tooltip
      ></a-col>
      <a-col class="jc-center" flex="44px">操作</a-col>
    </a-row>
    <a-form-model
      v-for="(group, index) in tableData"
      :key="index"
      :ref="`tableData${index}`"
      :model="group"
      :rules="rules"
      class="edit-table-body"
    >
      <a-row type="flex">
        <a-col flex="26px" class="jc-center">
          <div
            v-if="group.is_combination"
            class="ant-table-row-expand-icon "
            :class="[
              group.fold ? 'ant-table-row-expanded' : 'ant-table-row-collapsed'
            ]"
            type="minus-square"
            @click="group.fold = !group.fold"
          />
        </a-col>
        <!-- 规格 -->
        <a-col flex="160px">
          <a-form-model-item prop="specs_name">
            <a-input
              v-model="group.specs_name"
              placeholder="规格"
              v-max-byte-input="50"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <!-- 图片 -->
        <a-col flex="54px">
          <a-form-model-item prop="specs_img" style="height: 45px;">
            <upload-image
              v-model="group.specs_img"
              maxLength="1"
              upload-text=""
              :needHost="false"
              class="goods-upload-image"
              @input="$refs[`tableData${index}`][0].validateField('specs_img')"
            ></upload-image>
          </a-form-model-item>
        </a-col>
        <!-- 售价 -->
        <a-col flex="1">
          <a-form-model-item prop="s_price">
            <a-input
              v-model="group.s_price"
              v-number-input="2"
              prefix="￥"
              @change="handleSPriceChange(group)"
            />
          </a-form-model-item>
        </a-col>
        <!-- 原价 -->
        <a-col flex="1">
          <a-form-model-item prop="y_price">
            <a-input v-model="group.y_price" v-number-input="2" prefix="￥" />
          </a-form-model-item>
        </a-col>
        <!-- 会员价 -->
        <a-col flex="1">
          <a-form-model-item prop="vip_price">
            <a-input v-model="group.vip_price" disabled prefix="￥" />
          </a-form-model-item>
        </a-col>
        <!-- 优享价 -->
        <a-col flex="1">
          <a-form-model-item prop="e_price">
            <a-input v-model="group.e_price" v-number-input="2" prefix="￥" />
          </a-form-model-item>
        </a-col>
        <!-- 关联仓库 -->
        <a-col flex="1" style="width: 0">
          <div v-if="group.is_combination">
            {{
              group.combination_spec.length
                ? `${group.combination_spec.length}个商品`
                : ""
            }}
          </div>
          <a-form-model-item v-else prop="bind_product_id" style="width: 100%;">
            <a-select
              v-model="group.bind_product_id"
              show-search
              option-filter-prop="children"
              :filter-option="filterOption"
              :dropdownMatchSelectWidth="false"
              @change="bindProduct(group)"
              placeholder="请选择"
              style="width: 100%;"
            >
              <a-select-option
                v-for="item in storeGoods"
                :key="item.id"
                :value="item.id"
                >{{ item.id }} {{ item.name }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </a-col>
        <!-- 库存(可拍) -->
        <a-col v-if="group.is_combination" flex="100px">{{
          group.combination_spec | minStock
        }}</a-col>
        <a-col v-else flex="100px">{{
          group.stock || group.available_stock
            ? `${group.stock}（${group.available_stock}）`
            : ""
        }}</a-col>
        <!-- 排序 -->
        <a-col flex="90px">
          <a-form-model-item prop="list_order">
            <a-input v-model="group.list_order"></a-input>
          </a-form-model-item>
        </a-col>
        <!-- 试喝 -->
        <a-col class="jc-center" flex="60px">
          <a-checkbox v-model="group.s_type"></a-checkbox>
        </a-col>
        <!-- 组合 -->
        <a-col class="jc-center" flex="60px">
          <a-checkbox
            v-model="group.is_combination"
            @click="judgeSpecs(group)"
            @change="e => handleCombination(e, group)"
          ></a-checkbox>
        </a-col>
        <!-- 显示 -->
        <a-col class="jc-center" flex="60px">
          <a-switch v-model="group.is_show"></a-switch>
        </a-col>
        <a-col class="jc-center" flex="44px">
          <a @click="removeGroup(index)">删除</a>
        </a-col>
        <!-- 组合商品 -->
        <div v-show="group.fold" class="nested-table">
          <template
            v-if="group.combination_spec && group.combination_spec.length"
          >
            <a-row
              v-for="(row, i) in group.combination_spec"
              :key="i"
              type="flex"
              class="nested-tr"
            >
              <a-col flex="26px"></a-col>
              <!-- 规格 -->
              <a-col flex="160px">
                {{ row.goods_name }} {{ row.specs_name }}
              </a-col>
              <!-- 图片 -->
              <a-col flex="54px"
                ><img class="goods-image" :src="row.specs_img" alt=""
              /></a-col>
              <!-- 售价 -->
              <a-col flex="1">￥{{ row.s_price }}</a-col>
              <!-- 原价 -->
              <a-col flex="1">￥{{ row.y_price }}</a-col>
              <!-- 会员价 -->
              <a-col flex="1">￥{{ row.vip_price }}</a-col>
              <!-- 优享价 -->
              <a-col flex="1">￥{{ row.e_price }}</a-col>
              <!-- 关联仓库 -->
              <a-col flex="1" v-html="row.bind_info"></a-col>
              <!-- 库存(可拍) -->
              <a-col flex="100px"
                >{{ row.stock }}（{{ row.available_stock }}）</a-col
              >
              <!-- 排序 -->
              <a-col flex="90px"></a-col>
              <!-- 试喝 -->
              <a-col class="jc-center" flex="60px">
                <a-checkbox v-model="row.s_type" disabled></a-checkbox>
              </a-col>
              <!-- 组合 -->
              <a-col flex="60px"></a-col>
              <!-- 显示 -->
              <a-col flex="60px"></a-col>
              <a-col class="jc-center" flex="44px"
                ><a @click="removeGoods(group.combination_spec, i)"
                  >移除</a
                ></a-col
              >
            </a-row>
          </template>
          <a-row type="flex">
            <a-col flex="26px"></a-col>
            <a-col flex="160px">
              <a-button
                class="nested-add-btn"
                type="dashed"
                icon="plus"
                @click="addGoods(index)"
                >添加组合商品</a-button
              >
            </a-col>
            <a-col flex="1"></a-col>
          </a-row>
        </div>
      </a-row>
    </a-form-model>
    <a-button
      style="width: 100%; margin-top: 16px; margin-bottom: 8px"
      type="dashed"
      icon="plus"
      @click="addGroup"
      >新增规格</a-button
    >
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
        :goodsId="goodsId"
        :sRowKeys="sRowKeys"
      ></goods-table>
    </a-modal>
  </div>
</template>

<script>
import { UploadImage } from '@/components'
import { getGoodSpec, getSpecInfo, judgeSpecs } from '@/api/commodity/goods'
import goodsTable from './goodsTable'
import { sort } from '@/utils/util'
import NP from 'number-precision'

export default {
  name: 'modelTable',
  components: {
    UploadImage,
    goodsTable
  },
  props: {
    discount: {
      type: [Number, String],
      default: 1
    },
    goodsId: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      tableData: [],
      rules: {
        specs_name: [{ required: true, message: '请输入规格名称' }],
        specs_img: [{ required: true, message: '请上传' }],
        s_price: [{ required: true, message: '请输入售价' }],
        // vip_price: [{ required: true, message: '请输入会员价' }],
        e_price: [{ required: true, message: '请输入优享价' }],
        bind_product_id: [{ required: true, message: '请关联仓库' }]
      },
      visible: false,
      activeProductIndex: 0,
      addIndex: undefined, // 添加商品所在行index
      sRowKeys: [], // 已经添加过商品
      confirmLoading: false,
      storeGoods: [] // 仓库商品
    }
  },
  filters: {
    minStock (data) {
      if (!data || !data.length) {
        return ''
      }
      let minIndex = 0
      // let astock = 0
      data.reduce((previousValue, currentValue, index) => {
        // 取小值和对应的i
        const cur = parseFloat(currentValue.stock)
        const status = cur > previousValue
        if (status) {
          minIndex = index
        }
        return status ? previousValue : cur
      }, 0)
      return `${data[minIndex].stock}（${data[minIndex].available_stock}）`
    }
  },
  watch: {
    discount () {
      this.tableData.forEach(obj => {
        this.handleSPriceChange(obj)
      })
    }
  },
  created () {
    this.getGoodSpec()
  },
  methods: {
    // 获取仓库系统的商品
    getGoodSpec () {
      getGoodSpec().then(({ list }) => {
        this.storeGoods = list
      })
    },
    // 仓库搜索
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 售价变更，更改会员价
    handleSPriceChange (group) {
      group.vip_price = NP.times(group.s_price, this.discount / 100).toFixed(2)
    },
    // 非组合绑定商品
    bindProduct (group) {
      const index = this.storeGoods.findIndex(
        obj => obj.id === group.bind_product_id
      )
      this.$set(group, 'stock', this.storeGoods[index].num || 0)
      this.$set(
        group,
        'available_stock',
        this.storeGoods[index].available_stock || 0
      )
    },
    async judgeSpecs (group) {
      const { specs_id: specsId, is_combination: isCombination } = group
      if (!specsId || isCombination) {
        return
      }
      await judgeSpecs({
        specs_id: specsId
      }).catch(({ specs_name: specsName, goods_name: goodsName }) => {
        this.$message.warning(
            `规格"${specsName}"，是商品"${goodsName}"的组合规格，请先修改`
        )
        group.fold = false
        group.is_combination = false
      })
    },
    // 触发组合商品
    handleCombination (e, group) {
      const isCombination = e.target.checked
      group.fold = isCombination
      !isCombination && (group.combination_spec = [])
    },
    addGroup () {
      this.tableData.push({
        specs_name: undefined,
        specs_img: [],
        s_price: undefined,
        y_price: undefined,
        vip_price: undefined,
        e_price: undefined,
        bind_product_id: undefined,
        list_order: undefined,
        is_combination: false,
        s_type: false,
        is_show: false,
        combination_spec: [],
        fold: false
      })
    },
    removeGroup (index) {
      this.tableData.splice(index, 1)
    },
    addGoods (index) {
      this.addIndex = index
      this.sRowKeys = this.tableData[this.addIndex].combination_spec.map(
        obj => obj.specs_id
      )
      this.visible = true
    },
    removeGoods (data, index) {
      data.splice(index, 1)
    },
    // 排序失去焦点重新排序
    changeSort (data, key) {
      data = sort(data, key)
    },
    handleAddOk () {
      const ids = this.$refs['goods-table'].selectedRowKeys
      getSpecInfo({
        spec_id: ids
      }).then(({ success, list }) => {
        if (success) {
          this.tableData[this.addIndex].combination_spec = list.map(obj => {
            obj.s_type = !!+obj.s_type
            return obj
          })
          this.handleAddCancel()
        }
      })
    },
    handleAddCancel () {
      this.$refs['goods-table'].deselect()
      this.visible = false
    },
    formValidate (ref) {
      return new Promise((resolve, reject) => {
        ref.validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject(new Error(false))
            return false
          }
        })
      })
    },
    validate () {
      return Promise.all(
        this.tableData.map((obj, index) => {
          return this.formValidate(this.$refs[`tableData${index}`][0])
        })
      )
    }
  }
}
</script>

<style lang="less" scoped>
.edit-table-body .ant-row-flex .ant-col {
  display: flex;
  align-items: center;
}
.nested-table {
  width: 100%;
  background: #fafafa;
  .ant-row-flex {
    border-top: 1px solid #e8e8e8;
    .ant-col {
      padding: 6px 4px;
      line-height: 1;
    }
  }
  .nested-add-btn {
    width: 100%;
  }
  .goods-image {
    width: 45px;
    height: 45px;
  }
}
/deep/ .ant-upload-list-picture-card-container,
/deep/ .ant-upload.ant-upload-select-picture-card {
  width: 45px;
  height: 45px;
  margin: 0;
  .ant-upload-list-item {
    padding: 4px;
  }
}
/deep/ .ant-upload-list-item-uploading-text {
  display: none;
}
.jc-center {
  justify-content: center;
  text-align: center;
}
</style>
