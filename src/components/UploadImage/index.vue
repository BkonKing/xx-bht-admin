<template>
  <a-upload
    v-bind="$attrs"
    :action="`${action}/commodity_special/picLoad`"
    list-type="picture-card"
    name="imgFile"
    :file-list="fileList"
    multiple
    :beforeUpload="beforeUpload"
    @preview="handlePreview"
    @change="handleChange"
  >
    <div v-if="fileList.length < maxLength">
      <a-icon type="plus" />
      <div class="ant-upload-text">
        {{uploadText}}
      </div>
    </div>
  </a-upload>
</template>

<script>
import { getBase64 } from '@/utils/util'
export default {
  name: 'UploadImage',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    maxLength: {
      type: [Number, String],
      default: 9
    },
    uploadText: {
      type: String,
      default: '上传'
    }
  },
  data () {
    return {
      fileList: this.format(this.value),
      uploadList: [],
      action: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : '/api'
    }
  },
  methods: {
    genId (length) {
      return Number(
        Math.random()
          .toString()
          .substr(3, length) + Date.now()
      ).toString(36)
    },
    format (list) {
      return list.map(item => {
        const index = this.genId(5)
        return {
          uid: index,
          name: index,
          status: 'done',
          response: {
            data: item
          },
          url: item
        }
      })
    },
    async handlePreview (file) {
      // 不是完成状态点击无效
      if (file.status !== 'done') {
        return
      }
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      const url = file.response ? file.response.data : file.url
      this.$viewerApi({
        options: {
          toolbar: true,
          initialViewIndex: this.value.findIndex(obj => url === obj)
        },
        images: this.value
      })
    },
    beforeUpload (file, fileList) {
      console.log(file)
      const index = parseInt(this.maxLength) - this.fileList.length
      if (index > 0) {
        const active = fileList.findIndex(obj => obj.name === file.name) + 1
        if (active <= index) {
          return file
        } else {
          return false
        }
      } else {
        return false
      }
    },
    handleChange ({ file, fileList, event }) {
      const max = parseInt(this.maxLength)
      const index = max - this.fileList.length
      const deleteCount = index < 0 ? Math.abs(index) : 0
      // 上传失败
      if (file.status === 'done' && !file.response.success) {
        this.$message.error(file.response.message)
        const errorIndex = this.fileList.findIndex(obj => obj.uid === file.uid)
        this.fileList[errorIndex].status = 'error'
        return
      }
      this.fileList = fileList
      if (deleteCount) {
        this.fileList.splice(this.fileList.length - 1, deleteCount)
      }
      if (file.status === 'done' || file.status === 'removed') {
        const uploadList = fileList.map(obj => {
          if (obj.response) {
            return obj.response.data
          }
        }).filter(item => {
          return item
        })
        this.uploadList = uploadList
        this.$emit('input', uploadList)
      }
    }
  },
  watch: {
    value (val) {
      if (val !== this.uploadList) {
        this.fileList = this.format(val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-upload-list-picture-card .ant-upload-list-item {
  width: 100%;
  height: 100%;
}
</style>
