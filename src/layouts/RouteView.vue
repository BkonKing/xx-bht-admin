<template>
  <keep-alive :max="max" :include="keepAlives">
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  name: 'RouteView',
  props: {
    keepAlive: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      max: 1,
      keepAlives: []
    }
  },
  watch: {
    $route: {
      handler ({ meta, name }) {
        if (meta.keepAlive && !this.keepAlives.includes(name)) {
          this.keepAlives = [name]
        }
      },
      immediate: true
    }
  }
  // render () {
  //   const {
  //     $route: { meta, name }
  //   } = this
  //   if (meta.keepAlive && !this.keepAlives.includes(name)) {
  //     this.keepAlives = [name]
  //   }
  //   console.log(this.keepAlives)
  //   const inKeep = (
  //     <keep-alive max={this.max} include={this.keepAlives}>
  //       <router-view />
  //     </keep-alive>
  //   )
  //   return inKeep
  // }
}
</script>
