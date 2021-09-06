<template>
  <page-header-view>
    <a-card title="基础信息" :bordered="false">
      <a-form-model
        ref="BasicForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item required prop="title" label="专题名称">
          <a-input
            v-model="form.title"
            placeholder="请输入"
            :maxLength="15"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item required prop="is_open" label="是否开启">
          <a-switch v-model="form.is_open" @change="$refs.BasicForm.validateField('time')"></a-switch>
          <a-form-model-item prop="time" style="margin-top: 10px;">
            <a-range-picker
              v-model="form.time"
              :show-time="{ defaultValue: [defaultTime, defaultTime] }"
              :placeholder="['开始时间', '结束时间']"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              style="width: 100%;"
            />
          </a-form-model-item>
          <div style="color: #00000072;">
            达到设定时间将自动展示和关闭
          </div>
        </a-form-model-item>
        <a-form-model-item label="内容形式">
          <a-radio-group v-model="form.type" :options="contRadioGroup" />
        </a-form-model-item>
        <a-form-model-item v-if="isListType" label="商品排列">
          <a-radio-group
            v-model="form.arrange"
            :options="permutationRadioGroup"
          />
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card
      v-if="isListType"
      title="专题简介"
      style="margin-top: 24px"
      :bordered="false"
    >
      <a-form-model
        ref="introForm"
        :model="introForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item prop="introduction_image" label="简介图片">
          <upload-image
            v-model="introForm.introduction_image"
            maxLength="1"
          ></upload-image>
          <div style="margin-top: -11px;color: #00000072;">
            单张；支持扩展名：.png .jpg；
          </div>
        </a-form-model-item>
        <a-form-model-item prop="introduction_title" label="简介标题">
          <a-input
            v-model="introForm.introduction_title"
            placeholder="请输入"
            :maxLength="10"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item prop="introduction_content" label="简介内容">
          <a-textarea
            v-model="introForm.introduction_content"
            placeholder="请输入"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            :maxLength="500"
          />
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <special-goods v-if="isListType" ref="special-goods"></special-goods>
    <special-images v-else ref="special-images"></special-images>
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
import PageHeaderView from '@/layouts/PageHeaderView'
import FooterToolBar from '@/components/FooterToolbar'
import { /* STable, */ UploadImage } from '@/components'
import SpecialGoods from '@/views/commodity/special/components/SpecialGoods'
import SpecialImages from '@/views/commodity/special/components/SpecialImages'
import { addSpecial, getSpecialById } from '@/api/commodity/specail'

export default {
  name: 'SpecialEdit',
  components: {
    PageHeaderView,
    FooterToolBar,
    // STable,
    UploadImage,
    SpecialGoods,
    SpecialImages
  },
  data () {
    const validateTime = (rule, value, callback) => {
      if (this.form.is_open && !value[0]) {
        callback(new Error('请设定开启时间'))
      } else {
        callback()
      }
    }
    return {
      specialId: '',
      defaultTime: moment('00:00:00', 'HH:mm:ss'),
      loading: false,
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 10 } },
      form: {
        title: '',
        is_open: true,
        time: [],
        type: '1', // 专题类型 1专题商品2 图片专题
        arrange: 1 // 1一行一个 2一行两个
      },
      rules: {
        title: [{ required: true, message: '请输入专题名称' }],
        time: [
          {
            validator: validateTime
          }
        ]
      },
      // 内容形式
      contRadioGroup: [
        {
          value: '1',
          label: '商品列表'
        },
        {
          value: '2',
          label: '图片内容'
        }
      ],
      // 商品排列
      permutationRadioGroup: [
        {
          value: 1,
          label: '一行一个'
        },
        {
          value: 2,
          label: '一行两个'
        }
      ],
      introForm: {
        introduction_title: '',
        introduction_image: [],
        introduction_content: ''
      }
    }
  },
  computed: {
    isListType () {
      return this.form.type === '1'
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
        this.form = {
          title: data.title,
          is_open: data.is_open === 1,
          time: [data.stime, data.etime],
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
    // 商品列表回填
    setGoodsList (data) {
      this.$nextTick(() => {
        if (this.isListType) {
          data.combination.forEach(obj => {
            obj.combination_pic = obj.combination_pic ? [obj.combination_pic] : []
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
      return this.$refs['special-goods'].tableData.map(obj => {
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
/deep/ .ant-upload-list-picture-card-container,
/deep/ .ant-upload.ant-upload-select-picture-card {
  width: 100%;
  height: 190px;
  margin-bottom: 0;
}
</style>
