module.exports = {
  // 校验 js 代码格式, 如果没有通过校验, 那么不能提交代码
  '*.js': ['eslint', 'git add'],
  // 校验并修复可以修复的 js 代码格式问题, 如果没有通过校验, 那么不能提交代码
  // '*.js': ['prettier-eslint --write', 'git add'],
  // 校验 css 代码格式, 如果没有通过校验, 那么不能提交代码
  '*.css': ['stylelint', 'git add']
  // 校验并修复可以修复的 css 代码格式问题, 如果没有通过校验, 那么不能提交代码
  // '*.css': ['stylelint --fix', 'git add']
};
