<template>
  <a-result status="403" title="403" sub-title="对不起，您没有权限访问该页面。">
    <template #extra>
      <a-button type="primary" @click="goback">
        返回
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Exception403',
  methods: {
    goback () {
      this.$router.go(-1)
    }
  }
}
</script>
