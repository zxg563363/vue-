/*
 * @Author: your name
 * @Date: 2021-11-01 21:47:19
 * @LastEditTime: 2021-11-01 22:10:40
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \coal-web\config\index.js
 */
'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    // 可以代理多个地址
    proxyTable: [{
        context: ['/api-','/auth'],
        target: 'http://120.133.52.104:10300/',
        // target: 'http://192.168.30.115:10300/', 192.168.1.59  192.168.0.206
        // target: 'http://192.168.30.115:10300/', 192.168.0.59
        // target: 'http://192.168.0.141:10300/',  http://192.168.0.59:10300/
        ignorePath: false,
        changeOrigin: true,
        secure: false,
      }],
// {
//           '/': {
//               target: 'http://192.168.1.59:10300/',
//               changeOrigin: true,
//               // pathRewrite: {
//               //     '^/api': ''
//               // }
//           }
//       },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),
    login:  path.resolve(__dirname, '../dist/login.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
