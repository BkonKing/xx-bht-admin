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
        <a-form-model-item required prop="title" label="活动名称">
          <a-input
            v-model="formData.title"
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
        <a-form-model-item prop="introduction_content" label="活动描述">
          <a-textarea
            v-model="formData.introduction_content"
            placeholder="请输入"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            :maxLength="500"
          />
        </a-form-model-item>
        <a-form-model-item label="活动商品">
          <a-radio-group v-model="formData.type" :options="goodsTypes" />
        </a-form-model-item>
        <a-form-model-item label="活动对象">
          <a-radio :defaultChecked="true">全部用户</a-radio>
        </a-form-model-item>
        <a-form-model-item label="活动类型">
          <a-radio :defaultChecked="true">满件打折</a-radio>
        </a-form-model-item>
        <a-form-model-item label="活动规则" required>
          <a-row
            v-for="(item, index) in formData.cancelList"
            :key="item.id"
            :gutter="20"
            type="flex"
            style="margin-bottom: 24px;"
          >
            <a-col flex="1"
              ><a-form-model-item
                :prop="`cancelList.${index}.content`"
                :rules="{ required: true, message: '请输入取消原因' }"
              >
                <a-input
                  v-model="item.content"
                  :maxLength="20"
                  placeholder="取消原因"
                  @change="setChange"
                ></a-input></a-form-model-item
            ></a-col>
            <a-col flex="1"
              ><a-form-model-item>
                <a-input
                  v-model="item.list_order"
                  :maxLength="20"
                  v-number-input.int
                  @blur="changeSort"
                  @change="setChange"
                  placeholder="排序"
                ></a-input></a-form-model-item
            ></a-col>
            <a-col>
              <a-icon
                class="close-btn"
                type="minus-circle"
                @click="delCancel(index)"
              />
            </a-col>
          </a-row>
          <div class="addBtn" @click="addCancel">+ <span>添加</span></div>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <special-goods v-if="isListType" ref="special-goods"></special-goods>
    <special-images v-else ref="special-images"></special-images>
    <a-card title="活动商品" style="margin-top: 24px">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="商品分类">
                <a-select
                  v-model="queryParam.item_id"
                  :options="couponStatus"
                  placeholder="请选择"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商品状态">
                <a-select
                  v-model="queryParam.item_id"
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
    <div style="height: 80px;"></div>
    <footer-tool-bar style="width: 100%;">
      <a-button @click="$router.go(-1)" style="margin-right: 15px;">
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
import clonedeep from 'lodash.clonedeep'
import PageHeaderView from '@/layouts/PageHeaderView'
import FooterToolBar from '@/components/FooterToolbar'
import SpecialGoods from '@/views/commodity/special/components/SpecialGoods'
import SpecialImages from '@/views/commodity/special/components/SpecialImages'
import { STable, AdvancedForm, DetailInfo, TImage } from '@/components'
import { addSpecial, getSpecialById } from '@/api/commodity/specail'

export default {
  name: 'SpecialEdit',
  components: {
    PageHeaderView,
    FooterToolBar,
    STable,
    SpecialGoods,
    SpecialImages
  },
  data () {
    return {
      specialId: '',
      defaultTime: moment('00:00:00', 'HH:mm:ss'),
      loading: false,
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 10 } },
      formData: {
        title: '',
        is_open: true,
        time: [],
        type: '1', // 专题类型 1专题商品2 图片专题
        arrange: 1 // 1一行一个 2一行两个
      },
      rules: {
        title: [{ required: true, message: '请输入专题名称' }],
        time: [{ required: true, message: '请输入专题名称' }]
      },
      goodsTypes: [
        {
          value: '1',
          label: '全部商品'
        },
        {
          value: '2',
          label: '部分商品'
        }
      ],
      introForm: {
        introduction_title: '',
        introduction_image: [],
        introduction_content: ''
      },
      columns: [
        {
          title: '商品编号',
          dataIndex: 'id'
        },
        {
          title: '分类',
          dataIndex: 'c_status_name'
        },
        {
          title: '图片',
          dataIndex: 'c_status_name',
          customRender: (text) => {
            const src = [text]
            return <t-image images={src} class="goods-image group-image"></t-image>
          }
        },
        {
          title: '商品名称',
          dataIndex: 'nickname',
          customRender: (text, row) => {
            return (
              <a
                class="two-Multi"
                href={`/zht/user/user/getUserList?uid=${row.uid}`}
                target="_blank"
              >
                {text}
              </a>
            )
          }
        },
        {
          title: '规格 / 价格(现价|会员价|优享价)',
          dataIndex: 'realname',
          customRender: (text, row) => {
            return (
              <div>
                <span class="specification-span">{text}</span>
                <span>{row.mobile} | </span>
                <span>{row.mobile} | </span>
                <span>{row.mobile} | </span>
              </div>
            )
          }
        },
        {
          title: '库存(可拍)',
          dataIndex: 'pay_money',
          customRender: (text, row) => {
            return (
              <div>
                <span>{text}</span>
                <span>({row.mobile})</span>
              </div>
            )
          }
        },
        {
          title: '商品状态',
          dataIndex: 'g_etime'
        },
        {
          title: '订单量',
          dataIndex: 'g_etime1',
          sorter: true,
          customRender: (text, row) => {
            return (
              <a
                class="two-Multi"
                href={`/zht/user/user/getUserList?uid=${row.uid}`}
                target="_blank"
              >
                {text}
              </a>
            )
          }
        },
        {
          title: '销售量',
          dataIndex: 'g_etime2',
          sorter: true,
          customRender: (text, row) => {
            return (
              <a
                class="two-Multi"
                href={`/zht/user/user/getUserList?uid=${row.uid}`}
                target="_blank"
              >
                {text}
              </a>
            )
          }
        },
        {
          title: '销售额',
          dataIndex: 'sygq_time',
          sorter: true
        }
      ],
      loadData: parameter => {
        const sortText = {
          ascend: 'asc',
          descend: 'desc'
        }
        const params = clonedeep(this.queryParam)
        params.sort_field = parameter.sortField
        params.sort_type = sortText[parameter.sortOrder]
        return getAllCategory(
          Object.assign(parameter, params)
        )
      }
    }
  },
  computed: {
    isListType () {
      return this.formData.type === '1'
    }
  },
  created () {
    this.specialId = this.$route.query.id
  },
  mounted () {
    this.specialId && this.getSpecialById()
  },
  methods: {
    // 编辑获取专题内容
    getSpecialById () {
      getSpecialById({
        special_id: this.specialId
      }).then(({ data }) => {
        // 基础信息
        this.formData = {
          title: data.title,
          is_open: data.is_open === 1,
          type: data.content_type,
          arrange: data.arrange
        }
        // 商品专题简介
        this.introForm = {
          introduction_title: data.topic_title,
          introduction_image: data.topic_url ? [data.topic_url] : [],
          introduction_content: data.topic_content
        }
        this.setGoodsList(data)
      })
    },
    addCancel () {
      this.formData.cancelList.push({
        id: Math.random() * 100000,
        content: '',
        list_order: ''
      })
    },
    delCancel (index) {
      this.formData.cancelList.splice(index, 1)
    },
    // 商品列表回填
    setGoodsList (data) {
      this.$nextTick(() => {
        if (this.isListType) {
          data.combination.forEach(obj => {
            obj.combination_pic = obj.combination_pic
              ? [obj.combination_pic]
              : []
            obj.fold = true // 展开
            obj.list.forEach(goods => {
              goods.is_open = goods.is_open === '1'
            })
          })
          this.$refs['special-goods'].tableData = data.combination
        } else {
          this.$refs['special-images'].tableData = data.list.map(obj => {
            return {
              list_order: obj.list_order,
              list: obj.list.map(image => ({
                id: image.jump_id,
                type: image.jump_type,
                pic_url: image.image_url ? [image.image_url] : []
              }))
            }
          })
        }
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
        if (this.isListType) {
          this.addSpecial({
            ...this.form,
            ...this.introForm,
            combination: this.formatGoodsData()
          })
        } else {
          this.addSpecial({
            ...this.form,
            list: this.formatImageData()
          })
        }
      })
    },
    // 专题商品列表数据格式化
    formatGoodsData () {
      return this.$refs['special-goods'].tableData
        .filter(obj => {
          return (
            obj.combination_content || obj.combination_pic[0] || obj.list.length
          )
        })
        .map(obj => {
          return {
            combination_content: obj.combination_content,
            combination_pic: obj.combination_pic[0] || '',
            combination_type: 1,
            list_order: obj.list_order,
            list: obj.list.map(goods => ({
              goods_id: goods.goods_id,
              is_open: goods.is_open ? 1 : 0,
              list_order: goods.list_order
            }))
          }
        })
    },
    // 图片专题数据格式化
    formatImageData () {
      return this.$refs['special-images'].tableData.map(obj => {
        return {
          list_order: obj.list_order,
          list: obj.list.map(image => ({
            id: image.id,
            type: image.type,
            pic_url: image.pic_url[0]
          }))
        }
      })
    },
    // 新增/修改专题
    addSpecial (params) {
      const { time } = params
      if (time && time.length) {
        params.stime = time[0]
        params.etime = time[1]
      }
      if (params.introduction_image) {
        params.introduction_image = params.introduction_image[0] || ''
      }
      if (params.wx_sharepic) {
        params.wx_sharepic = params.wx_sharepic[0] || ''
      }
      // 是否开启 1开启 2关闭
      params.is_open = params.is_open ? 1 : 2
      // 操作类型 1添加 2修改
      params.opt_type = this.specialId ? 2 : 1
      this.specialId && (params.special_id = this.specialId)
      addSpecial(params).then(({ success }) => {
        if (success) {
          this.$message.success('提交成功')
          this.$router.go(-1)
        }
      })
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
</style>
