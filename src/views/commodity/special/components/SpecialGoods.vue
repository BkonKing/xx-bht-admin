<template>
  <a-card title="专题商品" style="margin-top: 24px" :bordered="false">
    <div class="spcecial-table">
      <a-row class="spcecial-header" type="flex">
        <a-col flex="70px"></a-col>
        <a-col flex="160px">组名称</a-col>
        <a-col flex="200px">组图片</a-col>
        <a-col flex="1">规格/价格(现价|会员价|优享价)</a-col>
        <a-col flex="120px">库存(可拍)</a-col>
        <a-col flex="76px">上架</a-col>
        <a-col flex="90px">排序</a-col>
        <a-col flex="60px">操作</a-col>
      </a-row>
      <div class="spcecial-tbody">
        <a-row v-for="(group, index) in tableData" :key="index" type="flex">
          <a-col flex="70px">
            <div
              v-if="!group.fold"
              class="ant-table-row-expand-icon ant-table-row-collapsed"
              type="plus-square"
              @click="group.fold = !group.fold"
            />
            <div
              v-else
              class="ant-table-row-expand-icon ant-table-row-expanded"
              type="minus-square"
              @click="group.fold = !group.fold"
            />
          </a-col>
          <a-col flex="160px">
            <a-input v-model="group.combination_content" placeholder="组名称"></a-input>
          </a-col>
          <a-col flex="200px">
            <upload-image
              v-model="group.combination_pic"
              maxLength="1"
              upload-text=""
              class="goods-upload-image"
            ></upload-image>
          </a-col>
          <a-col flex="1"></a-col>
          <a-col flex="196px"></a-col>
          <a-col flex="90px">
            <a-input
              v-model="group.list_order"
              v-number-input.int
              @blur="changeSort(tableData, 'list_order')"
            ></a-input>
          </a-col>
          <a-col flex="60px">
            <a @click="removeGroup(index)">删除</a>
          </a-col>
          <div v-show="group.fold" class="nested-table">
            <template v-if="group.list && group.list.length">
              <a-row
                v-for="(row, i) in group.list"
                :key="i"
                type="flex"
                class="nested-tr"
              >
                <a-col flex="70px"
                  ><a
                    :href="`/nsolid/commodity/goods?goods_id=${row.goods_id}`"
                    target="_blank"
                    >{{ row.goods_id }}</a
                  ></a-col
                >
                <a-col flex="160px"
                  ><div class="two-Multi">{{ row.goods_name }}</div></a-col
                >
                <a-col flex="200px"
                  ><img class="goods-image" :src="row.thumb" alt="" />{{
                    row.category_name
                  }}</a-col
                >
                <a-col flex="1">
                  <div style="width: 100%;">
                    <div
                      v-for="(item, i) in row.spec_info"
                      :key="i"
                      class="xx-flex"
                    >
                      <div class="xx-flex-label">{{ item.specs_name }}</div>
                      <div class="xx-flex-value">
                        ￥{{ item.s_price }}|￥{{ item.vip_price }}|￥{{
                          item.e_price
                        }}
                      </div>
                    </div>
                  </div>
                </a-col>
                <a-col flex="120px">
                  <div style="width: 100%;">
                    <div v-for="(item, i) in row.spec_info" :key="i">
                      {{ item.stock }}（{{ item.auction_stock || 0 }}）
                    </div>
                  </div>
                </a-col>
                <a-col flex="76px">
                  <a-switch v-model="row.is_open" />
                </a-col>
                <a-col flex="90px">
                  <a-input
                    v-model="row.list_order"
                    v-number-input.int
                    @blur="changeSort(group.list, 'list_order')"
                  ></a-input>
                </a-col>
                <a-col flex="60px"
                  ><a @click="removeGoods(group.list, i)">移除</a></a-col
                >
              </a-row>
            </template>
            <a-row type="flex">
              <a-col flex="70px"></a-col>
              <a-col flex="160px">
                <div class="add-btn nested-add-btn" @click="addGoods(index)">
                  + 添加商品
                </div>
              </a-col>
              <a-col flex="1"></a-col>
            </a-row>
          </div>
        </a-row>
      </div>
    </div>
    <div class="add-btn" @click="addGroup">
      + 添加组
    </div>
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
  </a-card>
</template>

<script>
import goodsTable from '@/views/commodity/special/components/goodsTable'
import { UploadImage } from '@/components'
import { sort } from '@/utils/util'
import { getSpecByGoodsId } from '@/api/commodity/specail'
export default {
  name: 'SpecialGoods',
  components: {
    goodsTable,
    UploadImage
  },
  data () {
    return {
      tableData: [
        {
          combination_content: '',
          combination_pic: [],
          list_order: '',
          list: [],
          fold: true
        }
      ],
      visible: false,
      addIndex: undefined, // 添加商品所在行index
      disabledRowkeys: [], // 已经添加过商品
      confirmLoading: false

      // 加载数据方法 必须为 Promise 对象
      // loadData: parameter => {
      //   return getOrderList(Object.assign(parameter, this.queryParam))
      // }
    }
  },
  methods: {
    addGroup () {
      this.tableData.push({
        combination_content: undefined,
        combination_pic: [],
        list_order: '',
        list: [],
        fold: true
      })
    },
    removeGroup (index) {
      this.tableData.splice(index, 1)
    },
    addGoods (index) {
      this.addIndex = index
      this.disabledRowkeys = this.tableData[this.addIndex].list.map(
        obj => obj.goods_id
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
      getSpecByGoodsId({
        ids
      }).then(({ success, list }) => {
        if (success) {
          this.tableData[this.addIndex].list.push(...list)
          this.handleAddCancel()
        }
      })
    },
    handleAddCancel () {
      this.$refs['goods-table'].deselect()
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.spcecial-table {
  .spcecial-header {
    background: #fafafa;
    font-weight: bold;
    border: 1px solid #e8e8e8;
  }
  .spcecial-tbody {
    > .ant-row-flex {
      border-bottom: 1px solid #e8e8e8;
    }
  }
  .ant-col {
    display: flex;
    align-items: center;
    padding: 12px;
    overflow-wrap: break-word;
  }
  .nested-table {
    width: 100%;
    background: #fafafa;
    .ant-row-flex {
      border-top: 1px solid #e8e8e8;
    }
    .nested-add-btn {
      background: #fff;
      margin-top: 0;
    }
    .goods-image {
      width: 45px;
      height: 45px;
      margin-right: 24px;
    }
  }
  .xx-flex {
    display: flex;
    .xx-flex-label {
      width: 104px;
      margin-right: 15px;
      .textOverflow();
    }
    .xx-flex-value {
      flex: 1;
      width: 0;
    }
  }
  /deep/ .ant-upload-list-picture-card-container,
  /deep/ .ant-upload.ant-upload-select-picture-card {
    width: 90px;
    height: 45px;
    .ant-upload-list-item {
      padding: 4px;
    }
  }
  /deep/ .ant-upload-list-item-uploading-text {
    display: none;
  }
}
.add-btn {
  margin-top: 12px;
  width: 100%;
  height: 32px;
  border-radius: 4px;
  border: 2px dashed #eeeeee;
  text-align: center;
  line-height: 28px;
  cursor: pointer;
}
</style>
