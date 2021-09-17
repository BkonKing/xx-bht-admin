import MaxByteInput from './max-byte-input'

const install = function (Vue) {
  Vue.directive('max-byte-input', MaxByteInput)
}

if (window.Vue) {
  window.action = MaxByteInput
  Vue.use(install); // eslint-disable-line
}

MaxByteInput.install = install
export default MaxByteInput
