<template>
  <div class="image-card">
    <div v-if="data.jump_name" class="jump-name">
      {{ data.jump_type === 1 ? "跳转商品" : "跳转专题" }}：{{ data.jump_name }}
    </div>
    <div v-else>--</div>
    <t-image
      v-if="data.image_url"
      :images="[data.image_url]"
      class="special-img"
    />
  </div>
</template>

<script>
import { TImage } from '@/components'
export default {
  name: 'ImageCard',
  components: {
    TImage
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="less" scoped>
.special-img {
  /deep/ .image-box {
    margin: 0;
  }
  /deep/ img {
    width: 100%;
    max-height: 180px;
  }
}
.image-card {
  width: 100%;
}
.jump-name {
  width: 100%;
  margin-bottom: 10px;
  .textOverflow();
}
</style>
