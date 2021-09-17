<template>
  <div class="c-form">
    <a-row type="flex">
      <a-col flex="90px">
        <a-select
          v-model="val.type"
          placeholder="跳转至"
          @change="handleTypeChange"
          style="width: 90px;"
        >
          <a-select-option :value="1">
            商品
          </a-select-option>
          <a-select-option :value="2">
            专题
          </a-select-option>
        </a-select></a-col
      >
      <a-col flex="1" style="width: 0;">
        <a-select
          v-model="val.id"
          show-search
          option-filter-prop="children"
          :allowClear="true"
          :showArrow="false"
          :dropdownMatchSelectWidth="false"
          :filter-option="filterOption"
          style="width: 100%"
        >
          <a-select-option
            v-for="item in options"
            :key="item.value"
            :value="item.value"
            >{{ item.label}}</a-select-option
          >
        </a-select>
      </a-col>
    </a-row>
    <upload-image v-model="val.pic_url" maxLength="1"></upload-image>
  </div>
</template>

<script>
import { UploadImage } from '@/components'
// import cloneDeep from 'lodash.clonedeep'
export default {
  name: 'cform',
  components: {
    UploadImage
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    goodsOptions: {
      type: Array,
      default: () => []
    },
    specialOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      val: this.value
    }
  },
  computed: {
    isGoodsType () {
      return this.val.type === 1
    },
    options () {
      if (!this.val.type) {
        return []
      }
      return this.isGoodsType ? this.newGoodsOptions : this.newSpecialOptions
    },
    newGoodsOptions () {
      return this.goodsOptions.map(obj => {
        return {
          value: obj.id,
          label: obj.goods_name
        }
      })
    },
    newSpecialOptions () {
      return this.specialOptions.map(obj => {
        return {
          value: obj.id,
          label: obj.title
        }
      })
    }
  },
  watch: {
    val: {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    },
    value (val) {
      this.val = val
    }
  },
  methods: {
    handleTypeChange () {
      this.val.id = ''
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0 ||
        option.key == input.toLowerCase()
      )
    }
  }
}
</script>

<style lang="less" scoped>
.c-form {
  line-height: 1;
}
/deep/ .ant-upload-list-picture-card-container,
/deep/ .ant-upload.ant-upload-select-picture-card {
  height: 160px !important;
  margin-top: 10px;
}
</style>
