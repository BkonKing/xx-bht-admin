<template>
  <a-card class="card" title="消息中心" :bordered="false">
    <a slot="extra" @click="readAll">全部已读</a>
    <s-table
      ref="table"
      size="default"
      class="message-table"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :showHeader="false"
      :showPagination="true"
    >
      <a-row
        slot="content"
        class="message-item"
        slot-scope="text, record"
        type="flex"
      >
        <a-col
          flex="auto"
          :style="{
            color: record.isRead === '1' ? '#0000003F' : '',
            cursor: 'pointer'
          }"
          @click="openPage(record)"
          >{{ record.content }}</a-col
        >
        <a-col
          flex="130px"
          :style="{ color: record.isRead === '1' ? '#0000003F' : '' }"
          >{{ record.ctime }}</a-col
        >
      </a-row>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import {
  toGetMessageList,
  toReadMessageById,
  toReadAllMessage
} from '@/api/user'
export default {
  name: 'MessageCenter',
  components: {
    STable
  },
  data () {
    return {
      columns: [
        {
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' }
        }
      ],
      loadData: parameter => {
        return toGetMessageList(parameter)
      }
    }
  },
  methods: {
    // 打开新窗口
    openPage (item) {
      toReadMessageById({ messageId: item.id })
      const paths = {
        1: '/project/detail',
        2: '/contract/detail',
        3: '/supplier/detail',
        4: '/order/detail'
      }
      const path = `${paths[item.sourceType]}?id=${item.sourceId}`
      const href = this.$router.resolve({
        path
      }).href
      window.open(href, '_blank')
      item.isRead = '1'
    },
    readAll () {
      toReadAllMessage().then(() => {
        this.$message.success('全部已读成功')
        this.$refs.table.reload()
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-tbody > tr > td {
  background: #fff !important;
}
.message-item {
  width: 100%;
}
</style>
