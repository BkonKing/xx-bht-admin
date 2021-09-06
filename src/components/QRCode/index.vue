<template>
  <img :src="url">
</template>

<script>
import QRCode from 'qrcode'
export default {
  name: 'QRCode',
  props: {
    qrcode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      url: ''
    }
  },
  created () {
    this.create()
  },
  methods: {
    create () {
      QRCode.toDataURL(this.qrcode)
        .then(url => {
          this.url = url
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style></style>
