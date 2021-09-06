import { Empty } from 'ant-design-vue'

const AProp = {
  type: Array,
  default: () => []
}

const loadingMixin = {
  beforeCreate () {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  props: {
    data: AProp,
    scale: AProp,
    tooltip: AProp,
    padding: {
      type: Array,
      default: () => [50, 50]
    },
    height: {
      type: [Number, String],
      default: 500
    },
    position: {
      type: String,
      default: 'name*value'
    }
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    spinStyle () {
      if (this.data.length > 0) {
        return { height: typeof this.height === 'number' ? this.height + 'px' : this.height }
      } else {
        return { height: 'auto', margin: '32px 0', width: '100%' }
      }
    }
  },
  methods: {
    switchLoading (val) {
      this.loading = val || !this.loading
    }
  },
  watch: {
    data: {
      handler (value) {
        setTimeout(() => {
          if (value) {
            this.loading = false
          }
        })
      }
    }
  }
}

export default loadingMixin
