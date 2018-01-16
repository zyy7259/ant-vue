const cwd = process.cwd();
const envUtil = require('./env');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const webpackMerge = require('webpack-merge');
const notifier = require('node-notifier');
const glob = require('glob');

const srcJSDir = path.join(cwd, 'src');
const nodeModulesDir = path.join(cwd, 'node_modules');

function genNestedEntry(dir) {
  dir = path.resolve(cwd, dir);
  const entry = {};
  const arr = glob.sync(path.join(dir, '**', '*.js'));
  arr.forEach(filePath => {
    const key = path.relative(dir, filePath).replace('.js', '');
    entry[key] = filePath;
  });
  return entry;
}

module.exports = function(options = {}) {
  const isDevelopment = envUtil.isDevelopment();
  const notProduction = envUtil.notProduction();
  const isProduction = envUtil.isProduction();

  const flattenBaseFileName = `[name].[ext]${isProduction ? '?[hash]' : ''}`;
  const baseFileName = `[path]${flattenBaseFileName}`;

  const {
    // is webpack1
    webpack1 = false,
    // is vue project
    vue,
    // is react project
    react,
    // is support ie8
    ie8,
    // relative to process.cwd()
    entryDir,
    // html context, which will be used to decide the output name of html file
    // the default value is 'src/html', it means if you have a html file src/html/user/profile/index.html
    // it will be placed at dist/${htmlOutputPath}/user/profile/index.html
    htmlContext = 'src/html',
    htmlLoader,
    // use CommonsChunkPlugin
    common,
    // if, name of library
    library,
    minChunks = 2,
    // if enable webpack's Hot Module Replacement feature
    hot,
    // if enable webpack's devtool
    devtool,
    extractCSS = true,
    // drop console when uglify
    dropConsole,
    babelPlugins = [],
    transformRuntime,
    includeJSDirs = [],
    excludeJSDirs = [],
    // 是否平铺所有资源
    flatten,
    // 是否开启分析
    analyse,
    config: configToMerge,
    // specifi a default value, in case some config file exists in node_modules,
    // which will lead a require error
    postcssConfigPath = path.join(cwd, 'postcss.config.js')
  } = options;

  // 资源路径相关的变量
  let {
    // js output path, which will be append to output.path(which is dist)
    // the default value is 'js', which means the js files will be placed in dir dist/js
    jsOutputPath = 'js',
    // css output path, which will be append to output.path(which is dist)
    // the default value is 'css', which means the css files will be placed in dir dist/css
    cssOutputPath = 'css',
    // html output path, which will be append to output.path(which is dist)
    // the default value is 'html', which means the html files will be placed in dir dist/html
    htmlOutputPath = 'html',
    // font output path, which will be append to output.path(which is dist)
    // the default value is 'font', which means the font files will be placed in dir dist/font
    fontOutputPath = 'font',
    fileLoaderOptions = {
      name: baseFileName
    }
  } = options;
  const {
    urlLoaderOptionsForImage = {},
    fileLoaderOptionsForHtml = {
      name: path.join(htmlOutputPath, baseFileName)
    },
    fileLoaderOptionsForFont = {
      name: path.join(fontOutputPath, baseFileName)
    }
  } = options;

  if (flatten) {
    jsOutputPath = '';
    cssOutputPath = '';
    htmlOutputPath = '';
    fontOutputPath = '';
    fileLoaderOptions = {
      name: flattenBaseFileName
    };
    delete urlLoaderOptionsForImage.name;
    delete fileLoaderOptionsForHtml.name;
    delete fileLoaderOptionsForFont.name;
  }

  // - 处理 entry
  let entry = {};
  if (library) {
    entry = {
      index: 'src/index'
    };
  } else if (entryDir) {
    entry = genNestedEntry(entryDir);
  }

  // - 处理 output
  const output = library
    ? {
        path: path.join(cwd, 'dist'),
        filename: `${library}.js`,
        library,
        libraryTarget: 'umd'
      }
    : {
        path: path.join(cwd, 'dist'),
        filename: path.join(jsOutputPath, '[name].js'),
        chunkFilename: path.join(jsOutputPath, '[name].js')
      };
  // 开发环境设置 publicPath, 不设置了, 这样使用 webpack-dev-server 的时候, 内存里的文件可以跟 dist 下面的文件区别开
  // if (notProduction) {
  //   output.publicPath = '/dist/';
  // }
  // output.publicPath = 'http://cdn.com/';

  // - loader 相关的 key, 根据版本而变化
  const KEY_RULES = webpack1 ? 'loaders' : 'rules';
  const KEY_USE = webpack1 ? 'loaders' : 'use';

  // - 处理 babel
  // https://babeljs.io/docs/plugins/transform-runtime/#technical-details
  babelPlugins.push([
    'transform-runtime',
    Object.assign(
      {
        // Removes the inline Babel helpers and uses the module babel-runtime/helpers instead.
        helpers: true,
        // disable polyfill Promise/Set/Map, etc.
        polyfill: false,
        // generator functions are transformed to use a regenerator runtime that does not pollute the global scope.
        regenerator: true,
        // Sets the name/path of the module used when importing helpers.
        moduleName: 'babel-runtime'
      },
      transformRuntime
    )
  ]);
  const babelModules = webpack1 ? 'commonjs' : false;
  // Setting `modules` to false will not transform modules, which will be parsed by webpack
  // https://babeljs.io/docs/plugins/preset-env
  // https://webpack.js.org/guides/migrating/#mixing-es2015-with-amd-and-commonjs
  // http://babeljs.io/docs/plugins/#pluginpreset-ordering
  const babelPresets = [['env', { modules: babelModules }], ['stage-0']];
  if (vue) {
    babelPresets.push('vue');
  }
  if (react) {
    babelPresets.push('react');
    if (notProduction) {
      // https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html#component-stack-traces
      babelPlugins.push('babel-plugin-transform-react-jsx-source');
    }
  }
  const babelOptions = library
    ? {
        cacheDirectory: true
      }
    : {
        presets: babelPresets,
        plugins: babelPlugins,
        cacheDirectory: true,
        // https://github.com/babel/babel-loader/pull/483
        babelrc: false
      };
  const babelLoader = `babel-loader?${JSON.stringify(babelOptions)}`;

  // - 处理 css
  // https://webpack.js.org/loaders/css-loader/#root
  const cssSourceMap = isDevelopment;
  let cssQuery = {
    root: cwd,
    sourceMap: cssSourceMap
  };
  cssQuery = '?' + JSON.stringify(cssQuery);
  let postcssQuery = isDevelopment ? { sourceMap: 'inline' } : {};
  if (postcssConfigPath) {
    postcssQuery.config = { path: postcssConfigPath };
  }
  if (Object.keys(postcssQuery).length) {
    postcssQuery = '?' + JSON.stringify(postcssQuery);
  } else {
    postcssQuery = '';
  }
  const cssLoader = extractCSS
    ? ExtractTextPlugin.extract([
        require.resolve('css-loader') + cssQuery,
        require.resolve('postcss-loader') + postcssQuery
      ])
    : [
        'style-loader',
        'css-loader' + cssQuery,
        'postcss-loader' + postcssQuery
      ];
  const cssFileName = library
    ? '[name].css'
    : path.join(cssOutputPath, '[name].css');
  const extractTextPluginArgs = webpack1
    ? [cssFileName, { allChunks: true, disable: !extractCSS }]
    : [
        {
          filename: cssFileName,
          allChunks: true,
          disable: !extractCSS
        }
      ];

  // 处理 html
  let htmlRule = {
    test: /\.html?$/,
    loader: `${require.resolve('file-loader')}?name=[name].[ext]`
  };
  if (htmlLoader) {
    htmlRule = {
      test: /\.html$/,
      // https://webpack.js.org/loaders/html-loader/#export-into-html-files
      // The html-loader will parse the URLs, require the images and everything you expect. The extract loader will parse the javascript back into a proper html file, ensuring images are required and point to proper path, and the file loader will write the .html file for you.
      [KEY_USE]: [
        `file-loader?${JSON.stringify(
          Object.assign(
            {
              // https://webpack.js.org/loaders/file-loader/#context
              context: path.join(cwd, htmlContext)
            },
            fileLoaderOptions,
            fileLoaderOptionsForHtml
          )
        )}`,
        'extract-loader',
        `html-loader?${JSON.stringify({
          // https://webpack.js.org/loaders/html-loader/#export-into-html-files
          // see https://webpack.js.org/loaders/css-loader/#root
          root: cwd
        })}`
      ]
    };
  }

  // 为了兼容性, loader 的 options 统一用 url query 来写 https://webpack.js.org/guides/migrating/#what-are-options-
  let config = {
    entry,
    output,
    module: {
      [KEY_RULES]: [
        { test: /\.(txt|tpl|template)$/, loader: 'raw-loader' },
        { test: /\.yaml$/, [KEY_USE]: ['json-loader', 'yaml-loader'] },
        {
          test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
          loader: `file-loader?${JSON.stringify(
            Object.assign({}, fileLoaderOptions, fileLoaderOptionsForFont)
          )}`
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          loader: `url-loader?${JSON.stringify(
            Object.assign(
              {
                // limit for base64 inlining in bytes
                limit: 3 * 1000
              },
              fileLoaderOptions,
              urlLoaderOptionsForImage
            )
          )}`
        },
        htmlRule,
        {
          test: /\.css$/,
          [Array.isArray(cssLoader) ? KEY_USE : 'loader']: cssLoader
        },
        {
          test: /\.js$/,
          include: [srcJSDir, ...includeJSDirs],
          exclude: [...excludeJSDirs],
          loader: babelLoader
        }
      ]
    },
    resolve: {
      alias: {
        src: path.join(cwd, 'src'),
        res: path.join(cwd, 'res'),
        static: path.join(cwd, 'static'),
        es: path.join(cwd, 'es'),
        lib: path.join(cwd, 'lib'),
        dist: path.join(cwd, 'dist'),
        axios: path.join(cwd, 'node_modules/axios/dist/axios.min')
      },
      extensions: ['.js', '.json', '.yaml', '.yml']
    },
    plugins: [
      new CaseSensitivePathsPlugin(),
      new FriendlyErrorsWebpackPlugin({
        onErrors: (severity, errors) => {
          const error = errors[0];
          switch (severity) {
            case 'warning':
              notifier.notify({
                title: 'ant-vue',
                message: 'warn',
                sound: true
              });
              break;
            case 'error':
              notifier.notify({
                title: 'ant-vue',
                message: `${severity} : ${error.name}`,
                subtitle: error.file || '',
                sound: true
              });
              break;
            default:
              break;
          }
        }
      }),
      new ExtractTextPlugin(...extractTextPluginArgs),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(envUtil.getNodeEnv()),
          MOCK: JSON.stringify(process.env.MOCK)
        }
      })
    ],
    devServer: {
      port: library ? 7000 : 9000,
      // navigating to the /webpack-dev-server route will show where files are served
      contentBase: cwd,
      // enable webpack's Hot Module Replacement feature
      hot,
      // default this is localhost. If you want your server to be accessible externally, specify it like this
      host: '0.0.0.0',
      disableHostCheck: true,
      // Enable gzip compression for everything served
      compress: true,
      // Shows a full-screen overlay in the browser when there are compiler errors.
      overlay: true
    },
    node: false
  };

  // pre loader
  const preLoaders = [
    {
      test: /\.js$/,
      [KEY_USE]: ['source-map-loader'],
      enforce: 'pre',
      include: nodeModulesDir
    }
  ];
  if (webpack1) {
    config.module.preLoaders = preLoaders;
  } else {
    config.module[KEY_RULES].push(...preLoaders);
  }

  // vue
  if (vue) {
    const vueLoader = {
      test: /\.vue$/,
      loader: 'vue-loader'
    };
    if (webpack1) {
      config.vue = {
        cssSourceMap,
        // 配置 ExtractTextPlugin
        loaders: {
          css: cssLoader,
          postcss: cssLoader
        },
        // esModule 为 true 时会插入 import 到代码里面, webpack2 及以上可以处理 import
        esModule: false
      };
    } else {
      vueLoader.options = {
        cssSourceMap,
        extractCSS
      };
    }
    config.module[KEY_RULES].push(vueLoader);
    config.resolve.extensions.push('.vue');
  }

  // other webpack1 related
  if (webpack1) {
    config.module[KEY_RULES].push({
      test: /\.json$/,
      loader: 'json-loader'
    });
    // see https://webpack.js.org/configuration/resolve/#resolve-extensions for empty string
    config.resolve.extensions.unshift('');
    config.babel = babelOptions;
    if (isProduction) {
      config.plugins.push(
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
      );
    }
  }

  /**
   * 环境相关
   */

  // 非线上环境
  if (notProduction) {
    config.output.pathinfo = true;
  }
  // 开发环境
  if (isDevelopment) {
    if (hot) {
      config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
      );
    }
    // devtool
    // https://webpack.js.org/guides/build-performance/#devtool
    if (devtool) {
      config.devtool =
        typeof devtool === 'string' ? devtool : 'cheap-module-eval-source-map';
    }
  }

  /**
   * 插件
   */

  /* eslint-disable no-inner-declarations */
  // screw_ie8 https://github.com/mishoo/UglifyJS2/issues/1246#issuecomment-237535244
  // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/#uglifyoptions
  function makeUglifyJsPlugin(uglifyOptions = {}) {
    const { sourceMap } = uglifyOptions;
    return new webpack.optimize.UglifyJsPlugin({
      ie8,
      compress: {
        drop_console: dropConsole,
        // display warnings when dropping unreachable code or unused declarations etc.
        warnings: false
      },
      output: {
        ascii_only: true
      },
      sourceMap
    });
  }
  // previously use StatsPlugin
  // const {
  //   path: statsPath = 'stats.json',
  //   options: statsOptions = {},
  // } = stats;
  // config.plugins.push(new StatsPlugin(statsPath, statsOptions));
  function makeStatsPlugin(statsOptions = {}) {
    const {
      reportFilename = 'report.html',
      statsFilename = 'stats.json'
    } = statsOptions;
    return new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename,
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename,
      statsOptions: null,
      logLevel: 'silent'
    });
  }
  /* eslint-enable no-inner-declarations */

  // production 线上环境
  if (isProduction) {
    // library, 打两次
    if (library) {
      config = webpackMerge(config, configToMerge, {
        devtool: 'source-map'
      });
      const minConfig = webpackMerge({}, config);
      minConfig.plugins = config.plugins.slice(0);
      // 些许差异
      config.plugins.push(makeStatsPlugin()); // statsPlugin 只有最后一个才生效
      minConfig.plugins.push(
        makeStatsPlugin({
          reportFilename: 'report.min.html',
          statsFilename: 'stats.min.json'
        })
      );
      minConfig.plugins.push(makeUglifyJsPlugin({ sourceMap: true }));
      minConfig.entry = {
        'index.min': 'src/index'
      };
      return [config, minConfig];
    }

    // 非 library, uglify & optimize
    config.plugins.push(
      makeUglifyJsPlugin({ sourceMap: false }),
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 }),
      // in chars (a char is a byte)
      new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 50000 })
    );
  }

  // CommonsChunkPlugin
  if (common) {
    config.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        minChunks
      })
    );
  }

  // 统计
  if (analyse) {
    config.plugins.push(makeStatsPlugin());
  }

  config = webpackMerge(config, configToMerge);

  return config;
};
