const NODE_ENV_PRODUCTION = 'production';
const NODE_ENV_DEVELOPMENT = 'development';

const env = {
  getNodeEnv() {
    // 默认返回线上环境, 更安全
    return process.env.NODE_ENV || NODE_ENV_PRODUCTION;
  },
  isProduction() {
    return env.getNodeEnv() === NODE_ENV_PRODUCTION;
  },
  notProduction() {
    return !env.isProduction();
  },

  isDevelopment() {
    return env.getNodeEnv() === NODE_ENV_DEVELOPMENT;
  },

  notDevelopment() {
    return !env.isDevelopment();
  }
};

module.exports = env;
