const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

const plugins = []
if (IS_PROD) {
  plugins.push('transform-remove-console')
}

// lazy load ant-design-vue
// if your use import on Demand, Use this code
plugins.push(['import', {
  libraryName: 'ant-design-vue',
  libraryDirectory: 'es',
  style: true // `style: true` 会加载 less 文件
}])

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3
      }
    ]
  ],
  plugins,
  env: {
    development: {
      // babel-plugin-dynamic-import-node plugin只做一件事，就是把所有的import()转换成require()。
      // 当你有大量的页面时，这个插件可以显著地提高热更新的速度。
      plugins: ['dynamic-import-node']
    }
  }
}
