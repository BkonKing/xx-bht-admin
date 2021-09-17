<template>
  <a-card title="供应商" style="margin-top: 24px" :bordered="false">
    <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="供应商" required>
        <div class="edit-table">
          <a-row class="edit-table-header" type="flex">
            <a-col class="form-required-after" flex="70px">启用</a-col>
            <a-col class="form-required-after" flex="1">供应商名称</a-col>
            <a-col class="form-required-after" flex="1">地区</a-col>
            <a-col flex="150px">已发货（件）</a-col>
            <a-col class="jc-center" flex="80px">操作</a-col>
          </a-row>
          <a-form-model
            v-for="(record, index) in supplierData"
            :key="index"
            :ref="`supplierData${index}`"
            :model="record"
            :rules="supplierRules"
            class="edit-table-body"
          >
            <a-row type="flex">
              <a-col flex="70px" style="width: 0">
                <a-form-model-item prop="seller_is_open">
                  <a-checkbox v-model="record.seller_is_open"></a-checkbox>
                </a-form-model-item>
              </a-col>
              <a-col flex="1">
                <a-form-model-item
                  prop="seller_name"
                  required
                  style="width: 100%;"
                >
                  <a-auto-complete
                    v-model="record.seller_name"
                    style="width: 100%"
                    @select="(value, option) => onSelect(value, option, index)"
                    :filter-option="filterOption"
                  >
                    <a-input :maxLength="50" placeholder="请输入"></a-input>
                    <template slot="dataSource">
                      <a-select-option
                        v-for="item in supplierList"
                        :key="item.id"
                        :value="item.id"
                      >
                        {{ item.seller_name }}
                      </a-select-option>
                    </template>
                  </a-auto-complete>
                </a-form-model-item>
              </a-col>
              <a-col flex="1">
                <a-form-model-item prop="region" required style="width: 100%;">
                  <a-input
                    v-model="record.region"
                    placeholder="请输入"
                    v-max-byte-input="50"
                    style="width: 100%;"
                  />
                </a-form-model-item>
              </a-col>
              <a-col flex="150px">
                {{ record.deliver_num }}
              </a-col>
              <a-col class="jc-center" flex="80px">
                <a class="td-block" @click="remove(index)">删除</a>
              </a-col>
            </a-row>
          </a-form-model>
          <a-button
            style="width: 100%; margin-top: 16px; margin-bottom: 8px"
            type="dashed"
            icon="plus"
            @click="addSupplier"
            >新增供应商</a-button
          >
        </div>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
import { getSeller } from '@/api/commodity/goods'

export default {
  name: 'supplierTable',
  data () {
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 16 }, sm: { span: 16 } },
      supplierList: [],
      supplierData: [],
      supplierRules: {
        seller_name: [
          {
            required: true,
            message: '请输入供应商名称'
          }
        ],
        region: [
          {
            required: true,
            message: '请输入地区'
          }
        ]
      }
    }
  },
  created () {
    this.getSeller()
  },
  methods: {
    getSeller () {
      getSeller().then(({ list }) => {
        this.supplierList = list.map(obj => {
          obj.id = String(obj.id)
          return obj
        })
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.toUpperCase()) >= 0
      )
    },
    onSelect (value, option, index) {
      const active = this.supplierList.findIndex(obj => obj.id === value)
      const { region, deliver_num: num, id } = this.supplierList[active]
      this.$set(this.supplierData[index], 'region', region)
      this.$set(this.supplierData[index], 'deliver_num', num)
      this.$set(this.supplierData[index], 'seller_id', id)
      const ref = `supplierData${index}`
      this.$refs[ref][0].validateField('region')
    },
    searchResult (value) {
      return this.supplierList.filter(obj => {
        return obj.seller_name.indexOf(value) > -1
      })
    },
    addSupplier () {
      this.supplierData.push({})
    },
    remove (index) {
      this.supplierData.splice(index, 1)
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
        this.supplierData.map((obj, index) => {
          return this.formValidate(this.$refs[`supplierData${index}`][0])
        })
      )
    }
  }
}
</script>

<style lang="less" scoped>
.edit-table-header > .ant-col,
.edit-table-body > .ant-row-flex > .ant-col {
  display: flex;
  align-items: center;
  padding: 12px;
}
.jc-center {
  justify-content: center;
  text-align: center;
}
</style>
