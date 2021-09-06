<template>
  <page-header-view :title="info.title">
    <template v-slot:content>
      <div>
        展示时间：{{ info.stime ? `${info.stime} ~ ${info.etime}` : "--" }}
      </div>
      <div style="margin-top: 9px;">内容形式：{{ info.content_desc }}</div>
    </template>

    <!-- actions -->
    <template v-slot:extra>
      <a-button @click="goEdit">编辑</a-button>
      <a-tooltip
        overlayClassName="preview-tooltip"
        trigger="click"
        placement="bottom"
      >
        <template slot="title">
          <div class="preview-tooltip-text">请手机扫码预览</div>
          <img src="" alt="" />
        </template>
        <a-button type="primary">预览</a-button>
      </a-tooltip>
    </template>

    <template v-slot:extraContent>
      <div class="status-list">
        <div>
          <div class="text">状态</div>
          <div class="heading">{{ info.is_open === 1 ? "开启" : "关闭" }}</div>
        </div>
        <div>
          <div class="text">商品</div>
          <div class="heading">{{ info.goods_num }}</div>
        </div>
        <div>
          <div class="text">浏览量</div>
          <div class="heading">{{ info.visit_num }}</div>
        </div>
      </div>
    </template>

    <a-card
      v-if="isListType"
      title="专题简介"
      class="intro-card"
      style="margin-top: 24px"
      :bordered="false"
    >
      <a-row type="flex">
        <a-col flex="72px">简介图片：</a-col>
        <a-col>
          <t-image
            v-if="info.topic_url"
            :images="[info.topic_url]"
            class="topic-image"
          ></t-image>
          <span v-else>--</span>
        </a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="72px">简介标题：</a-col>
        <a-col>{{ info.topic_title || "--" }}</a-col>
      </a-row>
      <a-row type="flex">
        <a-col flex="72px">简介内容：</a-col>
        <a-col flex="1"> {{ info.topic_content || "--" }}</a-col>
      </a-row>
    </a-card>

    <a-card
      v-if="isListType"
      :title="`专题商品（${info.group_count}个组 ${info.goods_count}个商品）`"
      style="margin-top: 24px"
      :bordered="false"
    >
      <a-table
        ref="table"
        size="default"
        rowKey="combination_id"
        :columns="columns"
        :dataSource="info.combination"
        :pagination="false"
        :expandedRowKeys="defaultExpandedRowKeys"
      >
        <a-table
          slot="expandedRowRender"
          slot-scope="text"
          rowKey="goods_id"
          :columns="innerColumns"
          :data-source="text.list"
          :pagination="false"
          :showHeader="false"
        >
          <template slot="model" slot-scope="text">
            <div v-for="(item, i) in text" :key="i" class="xx-flex">
              <div class="xx-flex-label">{{ item.specs_name }}</div>
              <div class="xx-flex-value">
                ￥{{ item.s_price }}|￥{{ item.vip_price }}|￥{{ item.e_price }}
              </div>
            </div>
          </template>
          <template slot="inventory" slot-scope="text, row">
            <div v-for="(item, i) in row.spec_info" :key="i">
              {{ item.stock }}（{{ item.auction_stock || 0 }}）
            </div>
          </template>
        </a-table>
      </a-table>
    </a-card>

    <a-card v-else title="专题图片" style="margin-top: 24px" :bordered="false">
      <a-table
        ref="table"
        size="default"
        rowKey="id"
        class="special-image-table"
        :columns="imgColumns"
        :dataSource="info.list"
        :pagination="false"
      >
        <template slot="column1" slot-scope="text, record">
          <image-card :data="record.list[0]"></image-card>
        </template>
        <template slot="column2" slot-scope="text, record">
          <image-card :data="record.list[1]"></image-card>
        </template>
        <template slot="column3" slot-scope="text, record">
          <image-card :data="record.list[2]"></image-card>
        </template>
      </a-table>
    </a-card>
  </page-header-view>
</template>

<script>
import PageHeaderView from '@/layouts/PageHeaderView'
import { TImage } from '@/components'
import ImageCard from '@/views/commodity/special/components/ImageCard'
import { getSpecialById } from '@/api/commodity/specail'

export default {
  name: 'SpecialDetail',
  components: {
    PageHeaderView,
    ImageCard,
    TImage
  },
  data () {
    return {
      id: '',
      info: {
        combination: []
      },
      defaultExpandedRowKeys: [],
      columns: [
        {
          title: '序号',
          width: 70,
          customRender (text, record, index) {
            return index + 1
          }
        },
        {
          title: '组名称',
          width: 200,
          dataIndex: 'combination_content',
          customRender: (text, row) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '组图片',
          width: 90,
          dataIndex: 'combination_pic',
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
          title: '分类',
          width: 110
        },
        {
          title: '规格/价格(现价|会员价|优享价)'
        },
        {
          title: '库存(可拍)',
          width: 150
        },
        {
          title: '状态',
          width: 70
        },
        {
          title: '排序',
          width: 70,
          dataIndex: 'list_order'
        }
      ],
      innerColumns: [
        {
          title: '商品编码',
          width: 70,
          dataIndex: 'goods_id',
          customRender: (text, row) => {
            return <a href={row.id}>{text}</a>
          }
        },
        {
          title: '商品名称',
          width: 200,
          dataIndex: 'goods_name',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '组图片',
          width: 90,
          dataIndex: 'thumb',
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
          title: '分类',
          width: 110,
          dataIndex: 'category_name'
        },
        {
          title: '规格/价格(现价|会员价|优享价)',
          dataIndex: 'spec_info',
          scopedSlots: { customRender: 'model' }
        },
        {
          title: '库存(可拍)',
          width: 150,
          scopedSlots: { customRender: 'inventory' }
        },
        {
          title: '状态',
          width: 70,
          dataIndex: 'shelf'
        },
        {
          title: '排序',
          width: 70,
          dataIndex: 'list_order'
        }
      ],
      imgColumns: [
        {
          title: '行',
          align: 'center',
          width: 50,
          customRender (text, record, index) {
            return index + 1
          }
        },
        {
          title: '列1',
          width: '30%',
          ellipsis: true,
          scopedSlots: { customRender: 'column1' }
        },
        {
          title: '列2',
          width: '30%',
          ellipsis: true,
          scopedSlots: { customRender: 'column2' }
        },
        {
          title: '列3',
          width: '30%',
          ellipsis: true,
          scopedSlots: { customRender: 'column3' }
        },
        {
          title: '排序',
          dataIndex: 'list_order',
          align: 'center',
          width: 100
        }
      ]
    }
  },
  computed: {
    isListType () {
      return this.info.content_type === '1'
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getSpecialById()
  },
  methods: {
    getSpecialById () {
      getSpecialById({
        special_id: this.id
      }).then(({ data }) => {
        this.info = data
        this.defaultExpandedRowKeys = this.info.combination.map(obj => obj.combination_id)
      })
    },
    goEdit () {
      this.$router.push({
        name: 'specialEdit',
        query: {
          id: this.id
        }
      })
    }
  }
}
</script>

<style lang="less">
.preview-tooltip {
  .preview-tooltip-text {
    color: @error-color;
  }
  .ant-tooltip-arrow::before {
    background-color: #fff;
  }
  .ant-tooltip-inner {
    padding: 8px 12px;
    background: #fff;
  }
  img {
    width: 100px;
    height: 100px;
    margin-top: 10px;
  }
}
.special-image-table {
  td {
    vertical-align: top;
  }
}
.goods-image {
  .image-box {
    margin: 0;
  }
  img {
    width: 45px;
    height: 45px;
  }
}
.topic-image img {
  max-width: 400px;
  max-height: 200px;
}
.xx-flex {
  display: flex;
  .xx-flex-label {
    flex: 1;
    width: 0;
    .textOverflow();
  }
  .xx-flex-value {
    flex: 1;
    width: 0;
  }
}
.heading {
  font-size: 20px;
  color: #000000d9;
}
.intro-card {
  .ant-row-flex + .ant-row-flex {
    margin-top: 20px;
  }
}
</style>
