// 大于零
export const GreaterZero = (rule, value, callback) => {
  if (+value <= 0) {
    callback(new Error('请输入大于零的数'))
  } else {
    callback()
  }
}
