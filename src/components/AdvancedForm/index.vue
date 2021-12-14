<template>
  <a-col :md="(!advanced && isAdvanced && 8) || md" :sm="24">
    <span
      class="table-page-search-submitButtons"
      :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
    >
      <a-button type="primary" @click="search">查询</a-button>
      <a-button style="margin-left: 8px" @click="reset">重置</a-button>
      <a v-if="isAdvanced" @click="advanced = !advanced" style="margin-left: 8px">
        {{ advanced ? "收起" : "展开" }}
        <a-icon :type="advanced ? 'up' : 'down'" />
      </a>
    </span>
  </a-col>
</template>

<script>
export default {
  name: 'AdvancedForm',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    md: {
      type: Number,
      default: 8
    },
    isAdvanced: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      advanced: this.value
    }
  },
  methods: {
    search () {
      this.$emit('search')
    },
    reset () {
      this.$emit('reset')
    }
  },
  watch: {
    value (val) {
      this.advanced = val
    },
    advanced (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>
.table-page-search-submitButtons {
  text-align: right;
}
</style>
