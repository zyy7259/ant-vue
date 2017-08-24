const config = require('zoro-kit-vue/webpack.config')({
  library: true,
  config: {
    output: {
      filename: 'ant-vue.js',
      library: 'antVue'
    }
  }
});

// console.log(config);

module.exports = config;
