const config = require('./script/webpack.config.base')({
  library: true,
  extractCss: false,
  // 是否是 vue 项目
  vue: true,
  // 如果设置了 entryDir, 那么会自动读取该文件夹下面的文件, 并设置为 webpack 的 entry
  // entryDir: './src/entry',
  // 是否平铺所有资源
  flatten: true,
  // 是否开启 CommonsChunkPlugin, 抽取公共代码
  common: true,
  // 生产环境压缩混淆代码的时候, 是否移除 console
  dropConsole: false,
  // if enable webpack's Hot Module Replacement feature
  hot: false,
  // 是否在开发环境 (process.env.NODE_ENV === 'development') 开启 webpack 的 devtool
  devtool: false,
  // 是否开启 webpack 打包分析, 会在 dist 目录生成 report.html, 打开即可看到打包详情
  analyse: true,
  // 额外的配置, 会被 merge 到最终的 webpack config
  config: {
    // 可以在这里手动设置 entry, 设置之后会跟从 entryDir 里面读取到的配置进行合并
    // entry: {
    // },
    output: {
      filename: 'ant-vue.js',
      library: 'antVue'
    }
  }
});

// console.log(JSON.stringify(config, null, 4));

module.exports = config;
