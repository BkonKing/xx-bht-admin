<template>
  <div>
    <!--计时器-->
    <span :class="upClass" v-if="timeTotal"
      >{{ upText }} {{ timerString }}</span
    >
    <!-- 倒计时 -->
    <span :class="downClass" v-else>{{ downText }} {{ countString }}</span>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: [String, Number],
      default: 0
    },
    downClass: {
      type: String,
      default: ''
    },
    downText: {
      type: String,
      default: '剩余'
    },
    upClass: {
      type: String,
      default: ''
    },
    upText: {
      type: String,
      default: '超时'
    },
    // 延迟时间（多久执行一次的时间）
    delay: {
      type: Number,
      default: 1000
    }
  },
  data () {
    return {
      // 计时器
      d: 0, // 定义天，时，分，秒，毫秒并初始化为0；
      h: 0,
      m: 0,
      s: 0,
      timeTotal: 0, // 计时总时长 ms
      countUpTimer: 0, // 定时器
      // 倒计时
      day: '',
      hour: '',
      minute: '',
      second: '',
      countDowmTotal: 0, // 倒计时总时长 ms
      countDowmTimer: '',
      // 公共
      lastTime: 0, // 上一次开始执行时间
      first: true
    }
  },
  mounted () {
    if (this.time > 0) {
      this.countDowmTotal = this.time * 1000
      this.setCountDownNumber()
      this.countDowm()
    } else {
      const time = Math.abs(this.time)
      this.timeTotal = time * 1000
      this.setTimerNumber()
      this.countUp()
    }
  },
  methods: {
    // 计时
    countUp () {
      this.countUpTimer && clearTimeout(this.countUpTimer)
      const deviation = this.getDeviation()
      // 增加计时总时长，可以在这里减去偏差值，这偏差值不用判断
      // 如果在setTimeout延迟时间中，则需要判断偏差是否小于delay，小于则使用delay
      // （因为矫正回来（延迟时间小于delay），start-this.lastTime会比delay小，则偏差值就会为负值，矫正就会又偏移）
      this.timeTotal = this.timeTotal + this.delay // 毫秒
      this.setTimerNumber()
      this.first = false
      this.countUpTimer = setTimeout(() => {
        this.countUp()
      }, this.delay - deviation)
    },
    // 将计时总时间转换为时间
    setTimerNumber () {
      const time = this.timeTotal / 1000
      this.d = Math.floor(time / 86400)
      this.h = Math.floor((time / 3600) % 24)
      this.m = Math.floor((time / 60) % 60)
      this.s = Math.floor(time % 60)
    },
    // 倒计时
    countDowm () {
      this.countDowmTimer && clearTimeout(this.countDowmTimer)
      const deviation = this.getDeviation()
      // 减少倒计时总时长，可以在这里减去偏差值，这偏差值不用判断
      const residue = this.countDowmTotal - this.delay
      this.countDowmTotal = residue > 0 ? residue : 0 // 毫秒
      this.setCountDownNumber()
      if (this.countDowmTotal) {
        this.countDowmTimer = setTimeout(() => {
          this.countDowm()
        }, this.delay - deviation)
      } else {
        // 倒计时结束，开启计时器
        this.$emit('finish', true)
        clearTimeout(this.countDowmTimer)
        this.countUp()
      }
    },
    setCountDownNumber () {
      const time = this.countDowmTotal / 1000
      this.day = Math.floor(time / 86400)
      this.hour = Math.floor((time / 3600) % 24)
      this.minute = Math.floor((time / 60) % 60)
      this.second = Math.floor(time % 60)
    },
    // 获取两次执行间隔跟delay的偏差值
    getDeviation () {
      let deviation = 0 // 偏差值
      // 获取当前时间，可以更改为服务器时间
      const start = new Date().getTime()
      // 计算上次跟这次执行的除去delay的偏差时间
      if (!this.first) {
        const pcTime = start - this.lastTime - this.delay
        // deviation = pcTime
        deviation = pcTime > 0 ? pcTime : 0
      }
      // 记录这次当前时间，留作下次比较
      this.lastTime = start
      this.first = false
      return deviation
    },
    // 补0
    formatNum (num) {
      return num < 10 ? '0' + num : '' + num
    }
  },
  computed: {
    // 倒计时显示
    countString () {
      const time = `${this.hourString}:${this.minuteString}`
      return this.day ? this.day + '天' + time : time
    },
    hourString () {
      return this.formatNum(this.hour)
    },
    minuteString () {
      return this.formatNum(this.minute)
    },
    secondString () {
      return this.formatNum(this.second)
    },
    // 计时器显示
    timerString () {
      const time = `${this.formatNum(this.h)}:${this.formatNum(this.m)}`
      return this.d ? this.d + '天' + time : time
    }
  },
  beforeDestroy () {
    this.countUpTimer && clearTimeout(this.countUpTimer)
    this.countDowmTimer && clearTimeout(this.countDowmTimer)
  }
}
</script>
