<template>
  <div>
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
      :expandIconAsCell="false"
      :expandIconColumnIndex="0"
      :dataSource="tableData"
      :pagination="false"
      :scroll="{ y: 380 }"
    >
      <a-table
        v-if="text.spec_list && text.spec_list.length"
        slot="expandedRowRender"
        slot-scope="text"
        rowKey="id"
        :columns="innerColumns"
        :data-source="text.spec_list"
        :rowSelection="rowSelection"
        :rowSelectionPaging="true"
        :pagination="false"
        :showHeader="false"
      >
      </a-table>
    </a-table>
  </div>
</template>

<script>
// import { STable } from '@/components'
import clonedeep from 'lodash.clonedeep'
import { getCategory } from '@/api/commodity/specail'
import { getAllGoods } from '@/api/commodity/goods'
import { TImage } from '@/components'

export default {
  name: 'goodsTable',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    TImage
  },
  props: {
    sRowKeys: {
      type: Array,
      default: () => []
    },
    goodsId: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      categoryOptions: [],
      queryParam: {},
      selectedRowKeys: this.sRowKeys,
      selectedRows: [],
      columns: [
        {
          title: '',
          width: 60,
          dataIndex: 'ids'
        },
        {
          title: '商品编号',
          width: 100,
          dataIndex: 'id',
          customRender: (text, row) => {
            const url = `/nsolid/commodity/goods?id=${text}`
            return (
              <a href={url} target="_blank">
                {text}
              </a>
            )
          }
        },
        {
          title: '分类',
          width: 110,
          dataIndex: 'category_name'
        },
        {
          title: '图片',
          dataIndex: 'thumb',
          width: 90,
          customRender: text => {
            return <img class="" src={text} />
          }
        },
        {
          title: '商品/规格名称',
          dataIndex: 'goods_name'
        },
        {
          title: '上架',
          dataIndex: 'shelf'
        }
      ],
      innerColumns: [
        {
          title: '商品编码',
          width: 100,
          dataIndex: 'id1'
        },
        {
          title: '分类',
          width: 110,
          dataIndex: 'category_name1'
        },
        {
          title: '图片',
          width: 90,
          dataIndex: 'specs_img',
          customRender: text => {
            if (text) {
              const src = [text]
              const img = <t-image images={src} class="goods-image"></t-image>
              return img
            } else {
              return ''
            }
          }
        },
        {
          title: '规格名称',
          dataIndex: 'specs_name'
        },
        {
          title: '上架',
          dataIndex: 'list_order'
        }
      ],
      data: [], // 原始数据
      tableData: [] // 实际数据（包含搜索）
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => {
          return {
            props: {
              disabled: !!+record.is_combination
            }
          }
        }
      }
    }
  },
  watch: {
    sRowKeys: {
      deep: true,
      handler (val) {
        console.log('sRowKeys', val)
        this.selectedRowKeys = val
      }
    }
  },
  created () {
    this.getAllGoods()
    this.getCategory()
  },
  methods: {
    getAllGoods () {
      getAllGoods({
        goods_id: this.goodsId
      }).then(({ list }) => {
        this.data = clonedeep(list)
        this.tableData = clonedeep(list)
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
        const isOpenBool = isOpen === undefined || obj.is_open === !!+isOpen
        const searchBool =
          !search || obj.goods_name.indexOf(search) > -1 || obj.id == search
        const categoryBool = !categoryId || obj.category_id == categoryId
        return isOpenBool && searchBool && categoryBool
      })
    },
    reset () {
      this.queryParam = {}
      this.tableData = clonedeep(this.data)
    },
    // 取消选中
    deselect () {
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .goods-image .image-box {
  margin: 0;
}
img, /deep/ img {
  width: 45px;
  height: 45px;
}
</style>
