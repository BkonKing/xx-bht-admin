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
            v-model="formData.activity_type"
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
            :key="item.id"
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
        <div class="table-operator">
          <a-button type="primary" @click="visible = true">
            添加商品
          </a-button>
          <a-button @click="batchOperate">
            批量移除
          </a-button>
        </div>
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="{ clear: true }"
          :rowSelection="rowSelection"
          :rowSelectionPaging="true"
          :showPagination="true"
        >
          <template>
            <a @click="batchDelete([record.id])"> 删除</a>
          </template>
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
        :disabledRowkeys="disabledRowkeys"
      ></goods-table>
    </a-modal>
  </page-header-view>
</template>

<script>
import moment from 'moment'
import clonedeep from 'lodash.clonedeep'
import PageHeaderView from '@/layouts/PageHeaderView'
import FooterToolBar from '@/components/FooterToolbar'
import GoodsTable from './components/GoodsTable'
import { STable, AdvancedForm, DetailInfo, TImage } from '@/components'
import { addSpecial, getSpecialById, getActivityGoods, getSpecInfo } from '@/api/marketing/fullOrder'

export default {
    name: 'SpecialEdit',
    components: {
        PageHeaderView,
        FooterToolBar,
        STable,
        AdvancedForm,
        GoodsTable
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
            formData: {
                activity_name: "",
                time: [],
                activity_desc: '',
                activity_goods_type: '1',
                is_open: true,
                activity_rules: []
            },
            rules: {
                activity_name: [{ required: true, message: '请输入活动名称' }],
                time: [{ required: true, message: '请选择时间' }]
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
                    dataIndex: 'specs_name',
                    customRender: (text, row) => {
                        return (
                            <div>
                            <span class="specification-span">{text}</span>
                            <span>￥{row.s_price} | ￥{row.vip_price} | ￥{row.e_price}</span>
                            </div>
                        )
                    }
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
                // {
                //     title: '订单量',
                //     dataIndex: 'order_count',
                //     sorter: true,
                //     customRender: (text, row) => {
                //         return (
                //             <a
                //     class="two-Multi"
                //         href={`/zht/user/user/getUserList?uid=${row.uid}`}
                //         target="_blank"
                //             >
                //             {text}
                //             </a>
                //     )
                //     }
                // },
                // {
                //     title: '销售量',
                //     dataIndex: 'sale_count',
                //     sorter: true,
                //     customRender: (text, row) => {
                //         return (
                //             <a
                //     class="two-Multi"
                //         href={`/zht/user/user/getUserList?uid=${row.uid}`}
                //         target="_blank"
                //             >
                //             {text}
                //             </a>
                //     )
                //     }
                // },
                // {
                //     title: '销售额',
                //     dataIndex: 'activity_order_price',
                //     sorter: true
                // },
                // {
                //   title: '销售额',
                //   dataIndex: 'sygq_time1',
                //   sorter: true
                // },
                {
                    title: '操作',
                    dataIndex: 'sygq_time2',
                    scopedSlots: { customRender: 'action' }
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
        }
    },
    created () {
        this.id = this.$route.query.id
    },
    mounted () {
        this.id && this.getSpecInfo()
    },
    methods: {
        // 编辑获取专题内容
        getSpecInfo () {
            getSpecInfo({
                id: this.id
            }).then(({ info }) => {
                // 基础信息
                this.formData = {
                    activity_name: info.activity_name,
                    time: info.activity_time_desc,
                    is_open: info.is_open === 1,
                    activity_desc: info.activity_desc,
                    activity_goods_type: info.activity_goods_type
                }
                this.setGoodsList(info)
            })
        },
        addRule () {
            this.formData.activity_rules.push({
                id: Math.random() * 100000,
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
                    this.deleteCoupon(this.selectedRowKeys.join(','))
                }
            })
        },
        deleteCoupon (id) {
            deleteCoupon({
                shops_coupon_id_text: id
            }).then(({ success, message }) => {
                if (success) {
                    const ids = id.split(',')
                    // 选中selectedRowKeys去除删除的key
                    this.selectedRowKeys = this.selectedRowKeys.filter(
                        obj => !ids.includes(obj)
                    )
                    this.selectedRows = this.selectedRows.filter(
                        obj => !ids.includes(obj)
                    )
                    this.$message.success('删除成功')
                    this.refreshTable()
                } else {
                    this.$message.error(message)
                }
            })
        },
        // 商品列表回填
        setGoodsList (data) {
            this.$nextTick(() => {
                if (this.isPartGoods) {
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
                if (this.isPartGoods) {
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
            params.opt_type = this.id ? 2 : 1
            this.id && (params.special_id = this.id)
            addSpecial(params).then(({ success }) => {
                if (success) {
                    this.$message.success('提交成功')
                    this.$router.go(-1)
                }
            })
        },
        handleAddOk () {},
        handleAddCancel () {
            this.visible = false
        },
        refreshTable (bool = false) {
            this.$refs.table.refresh(bool)
        },
        resetTable () {
            this.queryParam = {}
            this.refreshTable(true)
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
</style>
