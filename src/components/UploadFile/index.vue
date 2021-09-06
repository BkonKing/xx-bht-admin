<template>
  <a-upload
    :class="{ 'max-upload-file': fileList && fileList.length > 5 }"
    v-bind="$attrs"
    :action="`${action}/file/uploads/uFile`"
    list-type="picture"
    name="upFile"
    :file-list="fileList"
    multiple
    :beforeUpload="beforeUpload"
    @preview="handlePreview"
    @change="handleChange"
  >
    <div v-if="fileList.length < maxLength">
      <a-button icon="upload">上传文件</a-button>
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
    }
  },
  data () {
    return {
      fileList: this.format(this.value),
      uploadList: [],
      action:
        process.env.NODE_ENV === 'production'
          ? process.env.VUE_APP_API_BASE_URL
          : '/api'
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
          name: item.name,
          status: 'done',
          response: {
            data: item.url
          },
          url: item.url
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
      if (url.indexOf('.doc') > 0 || url.indexOf('.docx') > 0) {
        window.open(
          `https://view.officeapps.live.com/op/view.aspx?src=${url}`,
          '_target'
        )
        return
      }
      window.open(url, '_target')
    },
    beforeUpload (file, fileList) {
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
      if (file.status === 'uploading' && !this.isImageUrl(file)) {
        file.url = ' .txt'
      }
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
      if (
        (file.status === 'done' && file.response.success) ||
        file.status === 'removed'
      ) {
        if (file.status === 'done') {
          const index = this.fileList.findIndex(obj => obj.uid === file.uid)
          this.$set(this.fileList[index], 'url', file.response.data)
          // this.fileList[index].url = file.response.data
        }
        const uploadList = fileList
          .map(obj => {
            if (obj.response) {
              return {
                url: obj.response.data,
                name: obj.name
              }
            }
          })
          .filter(item => {
            return item && item.url
          })
        this.uploadList = uploadList
        this.$emit('input', uploadList)
      }
    },
    isImageUrl (file) {
      const url = file.thumbUrl || file.url || file.type
      const extension = this.extname(url)
      if (
        /^data:image\//.test(url) ||
        /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(extension)
      ) {
        return true
      }
    },
    extname (url = '') {
      const temp = url.split('/')
      const filename = temp[temp.length - 1]
      const filenameWithoutSuffix = filename.split(/#|\?/)[0]
      return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0]
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
.max-upload-file {
  /deep/ .ant-upload-list-picture {
    height: 370px;
    overflow: auto;
  }
}
</style>
