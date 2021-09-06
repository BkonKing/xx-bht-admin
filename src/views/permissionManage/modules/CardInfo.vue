<template>
  <div class="cardInfo">
    <div>
      <p>项目</p>
      <p class="num-span">{{ companyNum }}</p>
    </div>
    <div>
      <p>合同</p>
      <p class="num-span">{{ contractNum }}</p>
    </div>
    <div>
      <p>订单</p>
      <p class="num-span">{{ orderNum }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardInfo',
  props: {
    companyNum: {
      type: [String, Number],
      default: 0
    },
    contractNum: {
      type: [String, Number],
      default: 0
    },
    orderNum: {
      type: [String, Number],
      default: 0
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.cardInfo {
  .clearfix();

  margin-top: 4px;
  margin-left: 40px;
  & > div {
    position: relative;
    float: left;
    width: 33.33%;
    text-align: left;
    padding-left: 24px;
    p {
      margin: 0;
      font-size: 24px;
      line-height: 32px;
    }
    p:first-child {
      margin-bottom: 4px;
      color: @text-color-secondary;
      font-size: 12px;
      line-height: 20px;
    }
    .num-span {
      font-size: 26px;
      font-weight: bold;
    }
  }
}
</style>
