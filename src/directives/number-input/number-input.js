function onInput (el, ele, binding, vNode, e) {
  let val = ele.value
  const value = el.dataset.bv ? JSON.parse(el.dataset.bv) : binding.value
  // modifiers为修饰符对象，传入了int，则其int属性为true
  if (binding.modifiers.int) {
    val = ele.value.replace(/[^\d]/g, '')
  } else if (binding.modifiers.EnNum) {
    // 只能输入英文数字
    val = ele.value.replace(/[^A-Za-z0-9]/g, '')
  } else {
    // 清除"数字"和"."以外的字符
    val = val.replace(/[^\d.]/g, '')
    // 只保留第一个, 清除多余的
    val = val.replace(/\.{2,}/g, '.')
    // 第一个字符如果是.号，则补充前缀0
    val = val.replace(/^\./g, '0.')
    if (typeof value !== 'undefined') {
      // 期望保留的最大小数位数
      let pointKeep = 0
      if (typeof value === 'string' ||
       typeof value === 'number') {
        pointKeep = parseInt(value)
      } else if (typeof value === 'object') {
        // 支持新的小数点保留位配置
        pointKeep = value.decimal
      }
      if (!isNaN(pointKeep)) {
        if (!Number.isInteger(pointKeep) ||
        pointKeep < 0) {
          pointKeep = 0
        }
        const str = '^(\\d+)\\.(\\d{' + pointKeep + '}).*$'
        const reg = new RegExp(str)
        if (pointKeep === 0) {
          // 不需要小数点
          val = val.replace(reg, '$1')
        } else {
          // 通过正则保留小数点后指定的位数
          val = val.replace(reg, '$1.$2')
        }
      }
    }
  }
  // 支持输入的最大值和最小值的限制
  if (val !== '' && typeof value === 'object') {
    let { min, max } = value
    if (!isNaN(min)) {
      min = typeof min === 'number' ? min : parseFloat(min)
      if (min >= 0) {
        // 不能是负数
        val = val.replace('-', '')
      }
      if (parseFloat(val) < min) {
        val = min
      }
    }
    if (!isNaN(max)) {
      max = typeof max === 'number' ? max : parseFloat(max)
      if (parseFloat(val) > max) {
        val = max
      }
    }
  }
  ele.value = val
  vNode.componentInstance.stateValue = val
  vNode.componentInstance.$emit('change.value', val)
  vNode.componentInstance.$emit('change', val)
  vNode.componentInstance.$emit('input', val)
}

export default {
  bind (el, binding, vNode) {
    if (binding.value) {
      el.dataset.bv = JSON.stringify(binding.value)
    }
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener('input', (e) => onInput(el, ele, binding, vNode, e), false)
  },
  componentUpdated (el, { value }) {
    if (value) {
      el.dataset.bv = JSON.stringify(value)
    }
  },
  unbind (el) {
    el.removeEventListener('input', el.handler)
  }
}
