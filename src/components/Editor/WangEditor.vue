<template>
  <div :class="prefixCls">
    <div ref="editor" class="editor-wrapper"></div>
    <a-modal
      v-model="htmlVisible"
      title="HTML代码"
      :maskClosable="false"
      :width="740"
      @ok="handleOk"
    >
      <a-textarea
        v-model="htmlValue"
        :autoSize="{ minRows: 15, maxRows: 20 }"
      ></a-textarea>
    </a-modal>
  </div>
</template>

<script>
import WEditor from 'wangeditor'
import htmlMenu from './WangEditorMenu'
import axios from 'axios'

export default {
  name: 'WangEditor',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-editor-wang'
    },
    // eslint-disable-next-line
    value: {
      type: String
    },
    placeholder: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 390
    },
    zIndex: {
      type: Number,
      default: 7
    }
  },
  data () {
    return {
      htmlVisible: false,
      htmlValue: '',
      editor: null,
      editorContent: null,
      editorConfig: {
        zIndex: this.zIndex,
        height: this.height,
        placeholder: this.placeholder,
        excludeMenus: ['code', 'emoticon', 'video'],
        showFullScreen: true,
        customUploadImg: (resultFiles, insertImgFn) => {
          // resultFiles 是 input 中选中的文件列表
          // insertImgFn 是获取图片 url 后，插入到编辑器的方法
          if (resultFiles.length === 1) {
            this.uploadImage(resultFiles[0], insertImgFn)
          } else {
            this.multipleUploadImage(resultFiles, insertImgFn)
          }
        },
        uploadImgServer: '/library/um_editors/upload_file/upload_json.php',
        uploadFileName: 'imgFile',
        uploadImgParams: {
          dir: 'image'
        },
        uploadImgHooks: {
          customInsert: (insertImgFn, result) => {

          }
        },
        onchange: html => {
          this.editorContent = html
        },
        onSwitchingMode: () => {
          this.htmlVisible = true
          this.htmlValue = this.editorContent
        }
      }
    }
  },
  watch: {
    value (val) {
      if (this.editorContent !== val) {
        this.setValue(val)
      }
    },
    editorContent (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    uploadImage (file, insertImgFn) {
      const formData = new FormData()
      Object.entries(this.editorConfig.uploadImgParams).forEach(
        ([key, value]) => {
          formData.append(key, value)
        }
      )
      formData.append(this.editorConfig.uploadFileName, file)
      return axios({
        url: this.editorConfig.uploadImgServer,
        method: 'post',
        baseURL: '',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      }).then(({ data }) => {
        this.customInsert(insertImgFn, data)
      })
    },
    multipleUploadImage (files, insertImgFn) {
      if (files.length > 0) {
        this.uploadImage(files[0], insertImgFn).then(() => {
          files.shift()
          this.multipleUploadImage(files, insertImgFn)
        })
      }
    },
    customInsert (insertImgFn, result) {
      // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
      const { url } = result
      insertImgFn(url)
      // 上传图片，返回结果，将图片插入到编辑器中
      const img = new Image()
      img.src = url
      img.onload = () => {
        // 图片必须加载完成才能获取尺寸
        if (img.width > 600) {
          this.setValue(
            this.editorContent.replace(
              '<img src="' + url + '"',
              '<img src="' + url + '" width="600"'
            )
          )
        }
      }
    },
    setValue (val) {
      this.editorContent = val
      this.editor.txt.html(val)
    },
    initEditor () {
      this.editor = new WEditor(this.$refs.editor)
      Object.keys(this.editorConfig).forEach(key => {
        this.editor.config[key] = this.editorConfig[key]
      })
      const menuKey = 'HTML'
      this.editor.menus.extend(menuKey, htmlMenu)
      this.editor.config.menus.push(menuKey)
      this.editor.create()
    },
    handleOk () {
      this.setValue(this.htmlValue)
      this.htmlVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
  }
  /deep/ .w-e-toolbar .w-e-menu strong {
    color: #999;
  }
}
</style>
