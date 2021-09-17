<template>
  <div class="kindeditor">
    <textarea v-model="content" :id="id" name="content"></textarea>
  </div>
</template>

<script>
import '../../../node_modules/kindeditor/kindeditor-all.js'
import '../../../node_modules/kindeditor/lang/zh-CN.js'
import '../../../node_modules/kindeditor/themes/default/default.css'

export default {
  name: 'kindeditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: 'xx-kindeditor'
    }
  },
  data () {
    return {
      editor: null,
      content: this.value
    }
  },
  watch: {
    value (val) {
      this.editor && val !== this.content && this.editor.html(val)
    },
    content (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const that = this
      window.KindEditor.ready(function (K) {
        that.editor = K.create(`#${that.id}`, {
          afterChange () {
            that.content = this.html()
          },
          filterMode: false, // 是否开启过滤模式
          uploadJson: '/library/um_editors/upload_file/upload_json.php',
          // 指定上传文件的服务器端程序
          fileManagerJson: '/library/um_editors/upload_file/file_manager_json.php',
          // 指定浏览远程图片的服务器端程序
          allowFileManager: false,
          allowImageManager: true,
          height: 390,
          afterBlur: function () {
            this.sync()
          },
          afterUpload: function (url, data, name) {
            // 上传文件后执行的回调函数，必须为3个参数
            if (name == 'image' || name == 'multiimage') {
              // 单个和批量上传图片时
              var img = new Image()
              img.src = url
              img.onload = function () {
                // 图片必须加载完成才能获取尺寸
                if (img.width > 600) {
                  that.editor.html(
                    that.editor
                      .html()
                      .replace(
                        '<img src="' + url + '"',
                        '<img src="' + url + '" width="600"'
                      )
                  )
                }
              }
            }
          }
        })
      })
    }
  }
}
</script>

<style></style>
