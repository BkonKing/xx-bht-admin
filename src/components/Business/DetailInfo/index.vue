<template>
  <div class="header-info">
    <span
      >{{ title
      }}<a-tooltip overlayClassName="max-tooltip" v-if="$slots.tooltip" placement="top">
        <template slot="title">
          <slot name="tooltip"></slot>
        </template>
        <a-icon type="info-circle" style="margin-left: 5px;" /> </a-tooltip
    ></span>
    <p>
      <slot>{{ value }}</slot>
    </p>
    <em v-if="bordered" />
  </div>
</template>

<script>
export default {
  name: 'Info',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    bordered: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~ant-design-vue/es/style/themes/default.less";

.ant-tooltip {
  max-width: 310px;
}

.header-info {
  position: relative;
  text-align: center;
  & > span {
    display: inline-block;
    margin-bottom: 4px;
    color: @text-color-secondary;
    font-size: @font-size-base;
    line-height: 22px;
  }
  & > p {
    margin: 0;
    color: @heading-color;
    font-size: 24px;
    line-height: 32px;
  }
  & > em {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 56px;
    background-color: @border-color-split;
  }
}
</style>
