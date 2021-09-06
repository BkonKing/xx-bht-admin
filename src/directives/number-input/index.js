import NumberInput from './number-input'

const install = function (Vue) {
  Vue.directive('number-input', NumberInput)
}

if (window.Vue) {
  window.action = NumberInput
  Vue.use(install); // eslint-disable-line
}

NumberInput.install = install
export default NumberInput
