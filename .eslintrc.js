// https://eslint.org/docs/user-guide/configuring
                                                               
module.exports = {
  // root: true 找寻配置的最高级目录，即当前目录
  root: true,
  // if you are using webpack
  // parserOptions: {
  //   parser: 'babel-eslint'
  // },
  env: {
    browser: true,
  },
  extends: [
    // rules:
    // https://github.com/standard/standard/blob/master/docs/RULES-zhcn.md
    // usage: https://github.com/standard/eslint-config-standard#usage
    'standard'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
