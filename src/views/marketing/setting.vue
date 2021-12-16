<template>
  <page-header-view>
    <a-card title="优惠设置">
      <a-table
        ref="ruleTable"
        size="default"
        rowKey="id"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
      >
        <span class="table-action" slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-popconfirm
              v-if="+record.is_del_opt"
              :icon="icon"
              placement="top"
              ok-text="确定"
              cancel-text="取消"
              @confirm="delSetting(record.id)"
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
      </a-table>
      <div class="addBtn" @click="addSetting">+ <span>添加</span></div>
    </a-card>
    <a-modal
      title="编辑优惠"
      width="800px"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model
        ref="form"
        :model="formData"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          v-if="+formData.is_default === 0"
          required
          prop="time"
          label="启用时间"
          :rules="{ required: true, message: '请选择时间' }"
        >
          <a-range-picker
            v-model="formData.time"
            :show-time="{ defaultValue: [defaultTime, defaultTime] }"
            :placeholder="['开始时间', '结束时间']"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
          />
        </a-form-model-item>
        <a-form-model-item label="优惠叠加" prop="superposition">
          <a-checkbox-group
            v-model="formData.superposition"
            :options="discountsOptions"
            @change="setSuperpositionContent"
          />
        </a-form-model-item>
        <a-form-model-item style="margin-bottom: 0;">
          <template v-slot:label
            ><div class="flex-center">
              优惠叠加顺序<a-tooltip
                placement="top"
                title="多种优惠同享时，优惠顺序从上至下"
              >
                <a-icon type="info-circle" style="margin-left: 5px;" />
              </a-tooltip></div
          ></template>
          <a-row
            v-for="(item, index) in formData.superposition_content"
            :key="item.id"
            :gutter="20"
            type="flex"
            style="margin-bottom: 24px;"
          >
            <a-col flex="1">
              <a-form-model-item>
                <a-input
                  :value="item.superposition_id | superpositionContent"
                  :disabled="true"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col flex="1"
              ><a-form-model-item
                :prop="`superposition_content.${index}.list_order`"
              >
                <a-input
                  v-model="item.list_order"
                  v-number-input
                  :maxLength="10"
                  @blur="changeSort"
                ></a-input></a-form-model-item
            ></a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item prop="calculation">
          <template v-slot:label
            ><div class="flex-center">
              优惠计算<a-tooltip
                placement="top"
                title="优惠是按哪种价格进行计算"
              >
                <a-icon type="info-circle" style="margin-left: 5px;" />
              </a-tooltip></div
          ></template>
          <a-radio-group
            v-model="formData.calculation"
            :options="calculationOptions"
          />
        </a-form-model-item>
        <a-form-model-item prop="remark" label="设置备注">
          <a-input v-model="formData.remark" :maxLength="20"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </page-header-view>
</template>

<script>
import moment from 'moment'
import {
  getDiscountList,
  setDiscount,
  getDiscountDetail
} from '@/api/marketing/fullOrder'
import cloneDeep from 'lodash.clonedeep'
export default {
  data () {
    return {
      icon: h => (
        <a-icon theme="filled" type="close-circle" style="color: red" />
      ),
      columns: [
        {
          title: '启用时间',
          dataIndex: 'stime',
          customRender: (text, row) => {
            const eTime = row.etime
            const ele = (
              <div>
                {text ? <div>起 {text}</div> : ''}
                {eTime ? <div>止 {eTime}</div> : ''}
              </div>
            )
            return text || eTime ? ele : '默认(其他时间)'
          }
        },
        {
          title: '启用状态',
          dataIndex: 'is_open_desc'
        },
        {
          title: '优惠叠加',
          dataIndex: 'superposition_desc'
        },
        {
          title: '优惠顺序',
          dataIndex: 'stacking_sequence_desc'
        },
        {
          title: '优惠计算',
          dataIndex: 'calculation_desc'
        },
        {
          title: '设置备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      visible: false,
      confirmLoading: false,
      defaultTime: moment('00:00:00', 'HH:mm:ss'),
      loading: false,
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 10 } },
      calculationOptions: [
        {
          label: '按原价计算',
          value: 0
        },
        {
          label: '按实际售价计算',
          value: 1
        }
      ],
      discountsOptions: [
        {
          label: '优惠券',
          value: '1'
        },
        {
          label: '满额优惠',
          value: '2'
        },
        {
          label: '满件优惠',
          value: '3'
        }
      ],
      formData: {
        is_default: 0,
        time: [],
        superposition: ['1', '2', '3'],
        superposition_content: [
          { superposition_id: '1', list_order: '' },
          { superposition_id: '2', list_order: '' },
          { superposition_id: '3', list_order: '' }
        ],
        calculation: 0,
        remark: ''
      },
      oldSuperposition: []
    }
  },
  watch: {
    'formData.superposition': {
      handler (newValue, oldValue) {
        this.oldSuperposition = oldValue
      }
    }
  },
  filters: {
    superpositionContent (value) {
      const text = {
        1: '优惠劵',
        2: '满额优惠',
        3: '满件活动'
      }
      return text[value]
    }
  },
  created () {
    this.getDiscountList()
  },
  methods: {
    getDiscountList () {
      getDiscountList().then(({ list }) => {
        this.tableData = list || []
      })
    },
    addSetting () {
      this.formData = {
        is_default: 0,
        time: [],
        superposition: ['1', '2', '3'],
        superposition_content: [
          { superposition_id: '1', list_order: '' },
          { superposition_id: '2', list_order: '' },
          { superposition_id: '3', list_order: '' }
        ],
        calculation: 0,
        remark: ''
      }
      this.$nextTick(() => {
        this.oldSuperposition = this.formData.superposition
      })
      this.visible = true
    },
    handleEdit ({ id }) {
      getDiscountDetail({ id }).then(({ info }) => {
        info.time = info.stime && info.etime ? [info.stime, info.etime] : []
        info.superposition = info.superposition
          ? info.superposition.split(',')
          : []
        this.formData = info
        this.$nextTick(() => {
          this.oldSuperposition = this.formData.superposition
        })
        this.visible = true
      })
    },
    setSuperpositionContent () {
      this.$nextTick(() => {
        const newValue = this.formData.superposition || []
        const oldValue = this.oldSuperposition || []
        if (newValue.length > oldValue.length) {
          const active = newValue.find(obj => !oldValue.includes(obj))
          if (active) {
            this.formData.superposition_content.push({
              superposition_id: active,
              list_order: ''
            })
          }
        } else if (newValue.length < oldValue.length) {
          const active = oldValue.find(old => {
            return !newValue.includes(old)
          })
          if (active) {
            const activeIndex = this.formData.superposition_content.findIndex(
              obj => obj.superposition_id === active
            )
            this.formData.superposition_content.splice(activeIndex, 1)
          }
        }
      })
    },
    changeSort (e) {
      this.formData.superposition_content = this.formData.superposition_content.sort(
        (value, value2) => {
          return (
            parseInt(value2.list_order || 0) - parseInt(value.list_order || 0)
          )
        }
      )
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
    handleOk () {
      this.formValidate('form').then(() => {
        this.setDiscount(cloneDeep(this.formData))
      })
    },
    setDiscount (params) {
      const { time } = params
      if (time && time.length) {
        // params.stime = time[0]
        // params.etime = time[1]
        params.enable_time = `${time[0]}~${time[1]}`
      }
      params.type = params.id ? 2 : 1
      params.superposition = params.superposition.join(',')
      setDiscount(params).then(({ success }) => {
        if (success) {
          this.$message.success('提交成功')
          this.visible = false
          this.getDiscountList()
        }
      })
    },
    delSetting (id) {
      setDiscount({
        id,
        type: 3
      }).then(({ success }) => {
        if (success) {
          this.$message.success('删除成功')
          this.getDiscountList()
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.addBtn {
  width: 100%;
  height: 32px;
  margin-top: 24px;
  border-radius: 4px;
  border: 1px dashed #d9d9d9;
  text-align: center;
  line-height: 28px;
  cursor: pointer;
}
.flex-center {
  display: inline-flex;
  align-items: center;
}
</style>
