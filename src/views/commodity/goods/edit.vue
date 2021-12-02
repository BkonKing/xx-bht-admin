<template>
  <page-header-view :title="false" :breadcrumb="false">
    <a-card title="基础信息" :bordered="false">
      <a-form-model
        ref="BasicForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item required prop="category_id" label="商品分类">
          <a-tree-select
            v-model="form.category_id"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="categoryOptions"
            placeholder="请选择"
            :replaceFields="{ key: 'id', value: 'id', title: 'category_name' }"
            tree-default-expand-all
          >
            <span slot="title" slot-scope="{ title }" style="color: #08c">
              {{ title }}
            </span>
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item required prop="goods_name" label="商品标题">
          <a-input
            v-model="form.goods_name"
            v-max-byte-input="60"
            placeholder="请输入"
          ></a-input>
          <div class="form-hint-text">最多允许输入30个汉字（60个字符）</div>
        </a-form-model-item>
        <a-form-model-item required prop="sub_title" label="商品副标题">
          <a-input
            v-model="form.sub_title"
            placeholder="请输入"
            v-max-byte-input="60"
          ></a-input>
          <div class="form-hint-text">最多允许输入30个汉字（60个字符）</div>
        </a-form-model-item>
        <a-form-model-item prop="keyword" label="商品关键词">
          <a-select
            v-model="form.keyword"
            mode="tags"
            style="width: 100%"
            placeholder="输入单个词，结尾加enter键自动创建一个词"
            :dropdownMenuStyle="{ display: 'none' }"
          >
          </a-select>
          <div class="form-hint-text">
            输入单个词，结尾加enter键自动创建一个词，用于商品搜索匹配
          </div>
        </a-form-model-item>
        <a-form-model-item label="上下架定时">
          <a-form-model-item prop="mount_time">
            <a-row type="flex">
              <a-col class="date-before">上架</a-col>
              <a-col flex="1">
                <a-date-picker
                  v-model="form.mount_time"
                  :disabled-date="disabledStartDate"
                  :show-time="{ defaultValue: defaultTime }"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择"
                  @ok="$refs.BasicForm.validateField('descend_time')"
                  @blur="$refs.BasicForm.validateField('descend_time')"
                />
              </a-col>
            </a-row>
          </a-form-model-item>
          <a-form-model-item prop="descend_time" style="margin-top: 20px;">
            <a-row type="flex">
              <a-col class="date-before">下架</a-col>
              <a-col flex="1">
                <a-date-picker
                  v-model="form.descend_time"
                  :disabled-date="disabledEndDate"
                  :show-time="{ defaultValue: defaultTime }"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择"
                  @ok="$refs.BasicForm.validateField('descend_time')"
                />
              </a-col>
            </a-row>
          </a-form-model-item>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="list_order">
          <a-input
            v-model="form.list_order"
            v-number-input
            palceholder="排序值"
            style="width: 246px;"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <supplier-table ref="supplier-table"></supplier-table>
    <a-card title="销售信息" style="margin-top: 24px" :bordered="false">
      <a-form-model
        ref="sellForm"
        :model="sellForm"
        :rules="sellRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item required prop="discount_vip" label="会员折扣">
          <a-input-number
            v-model="sellForm.discount_vip"
            :min="0"
            :max="100"
            :precision="1"
          /><span style="margin-left: 10px;">%</span>
        </a-form-model-item>
        <a-form-model-item
          label="规格属性"
          :wrapper-col="{ span: 20 }"
          required
        >
          <model-table
            ref="model-table"
            :discount="sellForm.discount_vip"
            :goodsId="goodsId"
          ></model-table>
        </a-form-model-item>
        <a-form-model-item label="可购买用户" prop="buying_roles">
          <a-radio-group
            v-model="sellForm.buying_roles"
            :options="plainOptions"
          />
          <div class="form-hint-text">对商品的购买权限</div>
        </a-form-model-item>
        <a-form-model-item label="商品限购" prop="quota_num">
          <a-row type="flex">
            <a-col flex="160px"
              ><a-input-number
                v-model="sellForm.quota_num"
                :min="0"
                decimalSeparator="0"
              /><span style="margin-left: 10px;">件/人 --</span></a-col
            >
            <a-col flex="1">
              <a-form-model-item prop="quota_time">
                <a-date-picker
                  v-model="sellForm.quota_time"
                  :show-time="{ defaultValue: defaultTime }"
                  placeholder="开始时间"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <div class="form-hint-text">
            在设置的时间开始对用户进行购买数量限制
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card title="图文描述" style="margin-top: 24px" :bordered="false">
      <a-form-model
        ref="imageTextForm"
        :model="imageTextForm"
        :rules="imageTextRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item required prop="thumb" label="商品主图">
          <upload-image
            v-model="imageTextForm.thumb"
            maxLength="1"
            :needHost="false"
            @input="$refs.imageTextForm.validateField('thumb')"
          ></upload-image>
          <div style="margin-top: -11px;color: #00000072;">
            尺寸500*500；大小不超过2MB；支持扩展名：.png .jpg；
          </div>
        </a-form-model-item>
        <a-form-model-item required prop="pic" label="商品图片">
          <upload-image
            v-model="imageTextForm.pic"
            maxLength="10"
            :needHost="false"
            @input="$refs.imageTextForm.validateField('pic')"
          ></upload-image>
          <div style="margin-top: -11px;color: #00000072;">
            尺寸500*300；大小不超过2MB；支持扩展名：.png .jpg；
          </div>
        </a-form-model-item>
        <a-form-model-item required prop="content" label="详情描述">
          <kindeditor
            v-model="imageTextForm.content"
            :height="500"
            @input="$refs.imageTextForm.validateField('content')"
          ></kindeditor>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <div style="height: 80px;"></div>
    <footer-tool-bar style="width: 100%;">
      <a-button @click="cancel" style="margin-right: 15px;">
        取消
      </a-button>
      <a-button type="primary" @click="handleSubmit" :loading="loading"
        >提交</a-button
      >
    </footer-tool-bar>
  </page-header-view>
</template>

<script>
import moment from 'moment'
import PageHeaderView from '@/layouts/PageHeaderView'
import FooterToolBar from '@/components/FooterToolbar'
import { UploadImage, kindeditor } from '@/components'
import supplierTable from './components/supplierTable'
import { getAllCategory, editGoods, getEditGoods } from '@/api/commodity/goods'
import ModelTable from './components/modelTable'
import clonedeep from 'lodash.clonedeep'

export default {
  name: 'goodsEdit',
  components: {
    PageHeaderView,
    FooterToolBar,
    UploadImage,
    kindeditor,
    ModelTable,
    supplierTable
  },
  data () {
    const restrictionTime = (rule, value, callback) => {
      if (this.sellForm.quota_num && !this.sellForm.quota_time) {
        callback(new Error('请设定限购时间'))
      } else {
        callback()
      }
    }
    const restrictionNum = (rule, value, callback) => {
      if (!this.sellForm.quota_num && this.sellForm.quota_time) {
        callback(new Error('请设定限购量'))
      } else {
        callback()
      }
    }
    const endTime = (rule, value, callback) => {
      const startValue = this.form.mount_time
      const endValue = this.form.descend_time
      if (moment(endValue).isBefore(startValue)) {
        callback(new Error('下架时间必须大于上架时间'))
      } else if (!startValue && moment(endValue).isBefore(moment())) {
        callback(new Error('下架时间必须大于等于今天'))
      } else {
        callback()
      }
    }
    return {
      goodsId: '',
      defaultTime: moment('00:00:00', 'HH:mm:ss'),
      loading: false,
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 16 }, sm: { span: 16 } },
      form: {
        category_id: undefined, // 商品分类
        goods_name: '',
        sub_title: '',
        mount_time: '',
        descend_time: '',
        keyword: []
      },
      categoryOptions: [],
      storeGoods: [], // 仓库商品
      rules: {
        category_id: [{ required: true, message: '请选择商品分类' }],
        goods_name: [{ required: true, message: '请输入商品标题' }],
        sub_title: [{ required: true, message: '请输入商品副标题' }],
        descend_time: { validator: endTime }
      },
      sellForm: {
        discount_vip: '',
        quota_num: '',
        buying_roles: 0,
        quota_time: ''
      },
      sellRules: {
        discount_vip: [{ required: true, message: '请输入会员折扣' }],
        quota_num: [{ validator: restrictionNum }],
        quota_time: [{ validator: restrictionTime }]
      },
      plainOptions: [
        { label: '不限', value: 0 },
        { label: '会员', value: 1 },
        { label: '非会员', value: 2 }
      ],
      imageTextForm: {
        thumb: [],
        pic: [],
        content: ''
      },
      imageTextRules: {
        thumb: [{ required: true, message: '请上传商品主图' }],
        pic: [{ required: true, message: '请上传商品图片' }],
        content: [{ required: true, message: '请输入详情描述' }]
      }
    }
  },
  computed: {},
  watch: {
    // 商品编辑嵌入到页面的弹窗中，不能刷新页面，所以要监听路由变化，然后手动刷新当前页面，不然参数变更不会触发生命周期
    $route () {
      window.location.reload()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.goodsId = this.$route.query.id
      this.goodsId && this.getEditGoods()
      this.getAllCategory()
    },
    // 获取仓库系统的商品
    getAllCategory () {
      getAllCategory().then(({ list }) => {
        this.categoryOptions = list
      })
    },
    disabledStartDate (startValue) {
      const endValue = this.form.descend_time
      // 去除时分秒
      const startMomentValue = moment(startValue.format('YYYY-MM-DD'))
      if (!endValue) {
        return false
      }
      return startMomentValue.valueOf() > moment(endValue).valueOf()
    },
    disabledEndDate (endValue) {
      const startValue = this.form.mount_time
      const endMomentValue = moment(endValue).valueOf()
      // 没有开始时间，则结束时间要大于等于今天
      if (!startValue) {
        return moment().startOf('day').valueOf() > endMomentValue
      }
      return moment(startValue).startOf('day').valueOf() > endMomentValue
    },
    // 获取编辑商品的信息
    getEditGoods () {
      getEditGoods({
        goods_id: this.goodsId
      }).then(({ goods_info, goods_specs_list, seller_goods_list }) => {
        const {
          id,
          category_id,
          goods_name,
          sub_title,
          keyword,
          discount_vip,
          quota_num,
          quota_time,
          buying_roles,
          thumb,
          pic_url_arr,
          content,
          mount_time,
          descend_time,
          list_order
        } = goods_info
        this.form = {
          category_id,
          goods_name,
          sub_title,
          keyword: keyword ? keyword.split('|') : [],
          goods_id: id,
          list_order: list_order,
          mount_time: +mount_time
            ? moment(mount_time * 1000).format('YYYY-MM-DD HH:mm:ss') + ''
            : '',
          descend_time: +descend_time
            ? moment(descend_time * 1000).format('YYYY-MM-DD HH:mm:ss') + ''
            : ''
        }
        this.sellForm = {
          discount_vip: discount_vip * 100,
          buying_roles: 0,
          quota_num,
          quota_time
        }
        this.imageTextForm = {
          thumb: thumb ? [thumb] : [],
          pic: pic_url_arr || [],
          content
        }
        this.$refs['supplier-table'].supplierData = seller_goods_list.map(
          obj => {
            obj.seller_is_open = !!+obj.is_open
            return obj
          }
        )
        this.$refs['model-table'].tableData = goods_specs_list.map(obj => {
          obj.specs_img = obj.specs_img ? [obj.specs_img] : ''
          obj.is_show = !!+obj.is_show
          obj.is_combination = !!+obj.is_combination
          obj.s_type = !!+obj.s_type
          obj.bind_product_id = +obj.bind_product_id
            ? obj.bind_product_id
            : undefined
          if (obj.combination_spec && obj.combination_spec !== '0') {
            obj.combination_spec = obj.combination_spec.map(obj => {
              obj.s_type = !!+obj.s_type
              return obj
            })
            obj.fold = true
          } else {
            obj.combination_spec = []
          }
          return obj
        })
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
      Promise.all([
        this.formValidate('BasicForm'),
        this.formValidate('sellForm'),
        this.formValidate('imageTextForm'),
        this.$refs['supplier-table'].validate(),
        this.$refs['model-table'].validate()
      ]).then(() => {
        this.saveGoods({
          ...this.form,
          ...this.sellForm,
          ...this.imageTextForm,
          seller: this.$refs['supplier-table'].supplierData,
          combination: this.$refs['model-table'].tableData
        })
      })
    },
    saveGoods (p) {
      const params = clonedeep(p)
      params.thumb = params.thumb[0] || ''
      params.keyword = params.keyword.join('|')
      const combination = params.combination.map(obj => {
        obj.is_combination = obj.is_combination ? 1 : 0
        obj.is_show = obj.is_show ? 1 : 0
        obj.s_type = obj.s_type ? 1 : 0
        obj.specs_img = obj.specs_img[0] || ''
        if (Array.isArray(obj.combination_spec)) {
          // 商品规格只保存规格id
          obj.combination_spec = obj.combination_spec.map(
            model => model.specs_id
          ).filter(value => value)
        }
        return obj
      })
      // 组合商品存到combination，非组合存到spec
      params.combination = []
      params.spec = []
      combination.forEach(obj => {
        +obj.is_combination
          ? params.combination.push(obj)
          : params.spec.push(obj)
      })
      editGoods(params).then(({ success, message }) => {
        if (success) {
          this.$message.success(this.goodsId ? message : '添加成功')
          // 嵌入：调用父窗口的关闭弹窗和列表刷新
          this.cancel()
          top.goods_table.draw(false)
        } else {
          this.$message.error('提交失败')
        }
      })
    },
    // 调用父窗口的关闭弹窗
    cancel () {
      top.$('#goods_operate_modal').modal('hide')
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
.date-before {
  height: 32px;
  padding: 4px 11px;
  line-height: 24px;
  border: 1px solid #d9d9d9;
  border-right: none;
}
</style>
