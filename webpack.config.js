const config = require('zoro-kit-vue/webpack.config')({
  lib: true,
  config: {
    output: {
      filename: 'ant-vue.js',
      library: 'antVue'
    }
  }
});

console.log(config);
module.exports = config;
