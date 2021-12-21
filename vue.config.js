const path = require('path')
const webpack = require('webpack')
const buildDate = JSON.stringify(new Date().toLocaleString())
const createThemeColorReplacerPlugin = require('./config/plugin.config')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer')
// const CompressionPlugin = require('compression-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// const isProd = process.env.NODE_ENV === 'production'

// const assetsCDN = {
//   // webpack build externals
//   externals: {
//     vue: 'Vue',
//     'vue-router': 'VueRouter',
//     vuex: 'Vuex',
//     axios: 'axios'
//   },
//   css: [],
//   // https://unpkg.com/browse/vue@2.6.10/
//   js: [
//     '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
//     '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
//     '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
//     '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
//   ]
// }

// vue.config.js
const vueConfig = {
  publicPath: process.env.NODE_ENV === 'production' ? '/new_version' : '/',
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        APP_VERSION: `"${require('./package.json').version}"`,
        BUILD_DATE: buildDate
      })
    ]
    // if prod, add externals
    // externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    // if prod is on
    // assets require on cdn
    // if (isProd) {
    //   config.plugin('html').tap(args => {
    //     args[0].cdn = assetsCDN
    //     return args
    //   })
    // }
    // 只留下Moment的中文包
    config
      .plugin('ContextReplacementPlugin')
      .use(webpack.ContextReplacementPlugin, [/moment[/\\]locale$/, /zh-cn/])

    if (process.env.use_analyzer) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(WebpackBundleAnalyzer.BundleAnalyzerPlugin)
    }

    // if (process.env.NODE_ENV === 'production') {
    //   // gzip开启
    //   config
    //     .plugin('CompressionPlugin')
    //     .use(CompressionPlugin, [])
    // }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          hack: `true; @import "${path.join(__dirname, 'src/styles/variable.less')}"; @import "${path.join(__dirname, 'src/styles/mixins.less')}";`,
          // less 变量，定制主题
          'primary-color': '#1890ff',
          // 'link-color': '#F5222D',
          'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 5000,
    open: true,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      '/api': {
        // target: 'https://ytdwz.tosolomo.com/nsolid/spi/v2',
        target: 'https://bhtdevelop.mhshjy.com/nsolid',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: true,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
