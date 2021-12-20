<template>
  <div>
    <div v-if="selectedRows && selectedRows.length">
      <div style="margin-bottom: 20px;">
        已选择{{ selectedRows.length }}个商品：
      </div>
      <div class="tag-box">
        <a-tag
          v-for="(item, index) in selectedRows"
          :key="item.id"
          closable
          class="goods-tag"
          @close="removeSelected(item)"
        >
          {{ item.goods_name }}
        </a-tag>
      </div>
    </div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="商品分类">
              <a-select v-model="queryParam.category_id" placeholder="请选择">
                <a-select-option
                  v-for="option in categoryOptions"
                  :value="option.id"
                  :key="option.id"
                >
                  {{ option.category_name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="商品状态">
              <a-select v-model="queryParam.is_open" placeholder="请选择">
                <a-select-option :value="1">
                  上架
                </a-select-option>
                <a-select-option :value="0">
                  下架
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="商品">
              <a-input
                v-model="queryParam.search"
                placeholder="ID、名称"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :dataSource="tableData"
      :rowSelection="rowSelection"
      :rowSelectionPaging="true"
      :scroll="{ y: 300 }"
      :pagination="false"
    >
    </a-table>
  </div>
</template>

<script>
import { /* STable */ TImage } from '@/components'
import clonedeep from 'lodash.clonedeep'
import { getCategory } from '@/api/commodity/specail'
import { getGoodsList } from '@/api/marketing/fullOrder'

export default {
  name: 'goodsTable',
  components: {
    // STable
    // eslint-disable-next-line vue/no-unused-components
    TImage
  },
  props: {
    disabledRowkeys: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      categoryOptions: [],
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        {
          title: '商品编号',
          dataIndex: 'id',
          width: 80
        },
        {
          title: '分类',
          dataIndex: 'category_name',
          width: 150
        },
        {
          title: '图片',
          dataIndex: 'thumb',
          width: 100,
          customRender: text => {
            const src = [text]
            return (
              <t-image images={src} class="goods-image group-image"></t-image>
            )
          }
        },
        {
          title: '商品名称',
          dataIndex: 'goods_name'
        },
        {
          title: '商品状态',
          dataIndex: 'shelf',
          width: 100
        }
      ],
      data: [],
      tableData: []
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
        // getCheckboxProps: record => ({
        //   props: {
        //     disabled: this.disabledRowkeys.includes(+record.id)
        //   }
        // })
      }
    }
  },
  created () {
    this.getGoods()
    this.getCategory()
  },
  methods: {
    getGoods () {
      getGoodsList().then(({ list }) => {
        this.data = clonedeep(list)
        this.tableData = clonedeep(list)
        this.selectedRowKeys = clonedeep(this.disabledRowkeys)
        this.setSelectedRow()
      })
    },
    getCategory () {
      getCategory().then(({ list }) => {
        this.categoryOptions = list
      })
    },
    // 本地搜索
    search () {
      this.tableData = this.data.filter(obj => {
        const {
          is_open: isOpen,
          search,
          category_id: categoryId
        } = this.queryParam
        const isOpenBool = isOpen === undefined || obj.is_open === isOpen
        const searchBool =
          !search || obj.goods_name.indexOf(search) > -1 || obj.id == search
        const categoryBool = !categoryId || obj.category_id === categoryId
        return isOpenBool && searchBool && categoryBool
      })
    },
    reset () {
      this.queryParam = {}
      this.tableData = clonedeep(this.data)
    },
    removeSelected ({ id }) {
      const ids = new Set(this.selectedRowKeys)
      ids.delete(id)
      this.selectedRowKeys = Array.from(ids)
      this.setSelectedRow()
    },
    // 取消选中
    deselect () {
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      // 全选
      if (selectedRowKeys.length > this.selectedRowKeys.length) {
        this.selectedRowKeys = this.sorteduniq([
          ...this.selectedRowKeys,
          ...selectedRowKeys
        ])
        this.setSelectedRow()
      } else if (selectedRowKeys.length < this.selectedRowKeys.length) {
        this.selectedRowKeys = selectedRowKeys
        this.setSelectedRow()
      }
    },
    setSelectedRow () {
      this.selectedRows = this.data.filter(row => {
        return this.selectedRowKeys.indexOf(row.id) > -1
      })
    },
    sorteduniq (arr) {
      return Array.from(new Set(arr))
    }
  }
}
</script>

<style lang="less" scoped>
.tag-box {
  padding-bottom: 19px;
  margin-bottom: 24px;
  border-bottom: 1px solid #eee;
}
.goods-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
.goods-image {
  /deep/ .image-box {
    margin: 0;
    img {
      width: 35px;
      height: 35px;
    }
  }
}
</style>
