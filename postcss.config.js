const config = genConfig({
  pc: false,
  rem: false,
  pxtorem: {}
});

module.exports = config;

/**
 *  生成 postcss 配置, https://github.com/michael-ciniawsky/postcss-load-config
 *
 *  @param  {Object} [options={}] options
 *  @param {Boolean} [options.pc=false] if support pc
 *  @param {Boolean} [options.rem=false] if use pxtorem to transform pixel to rem
 *  @param {Object} [options.pxtorem={}] options for pxtorem
 * - see https://github.com/cuth/postcss-pxtorem#options
 * - rootValue is rewritten to 100 for convenience
 *
 *  @return {Object}
 */
function genConfig(options = {}) {
  const { pc, rem, pxtorem } = options;

  const browsers = [
    'last 2 versions',
    'Firefox ESR',
    '> 1%',
    'iOS >= 8',
    'Android >= 4'
  ];
  if (pc) {
    browsers.push('ie >= 8');
  }

  const postcssConfig = {
    // https://github.com/michael-ciniawsky/postcss-load-config#plugins
    plugins: {
      precss: {
        import: {
          path: [process.cwd()]
        }
      },
      autoprefixer: {
        browsers
      },
      'postcss-pxtorem': rem ? pxtorem : false,
      'postcss-inline-svg': {
        path: process.cwd()
      },
      cssnano: {
        preset: [
          'default',
          {
            // http://cssnano.co/optimisations/mergelonghand/
            // 禁用 mergeLonghand, 这样可以写多条 padding/margin 规则来适配 iPhone X
            mergeLonghand: false
          }
        ]
      }
    }
  };

  return postcssConfig;
}
