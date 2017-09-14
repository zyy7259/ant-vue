const config = require('zoro-kit-vue/webpack.config')({
  library: true,
  extractCss: false,
  config: {
    output: {
      filename: 'ant-vue.js',
      library: 'antVue',
    },
  },
});

// console.log(config);

module.exports = config;
