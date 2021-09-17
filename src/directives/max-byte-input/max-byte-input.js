function onInput (el, ele, binding, vNode, e) {
  const value = ele.value
  const max = parseInt(binding.value)
  let len = 0
  if (max) { // 如果存在字符串，则执行计划
    for (let i = 1; i < value.length; i++) { // 遍历字符串，枚举每个字符
      if (value.charCodeAt(i) > 255) { // 字符编码大于255，说明是双字节字符
        len += 2 // 则累加2个
      } else {
        len++ // 否则递加一次
      }
      if (len >= max) {
        const val = value.slice(0, len === max ? i : i - 1)
        ele.value = val
        vNode.componentInstance.stateValue = val
        vNode.componentInstance.$emit('change', val)
        vNode.componentInstance.$emit('input', val)
        break
      }
    }
  }
}

export default {
  bind (el, binding, vNode) {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener('input', (e) => onInput(el, ele, binding, vNode, e), false)
  },
  unbind (el) {
    el.removeEventListener('input', el.handler)
  }
}
