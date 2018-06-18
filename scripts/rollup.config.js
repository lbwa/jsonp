const path = require('path')
const version = process.env.VERSION || require('../package.json').version
const alias = require('rollup-plugin-alias')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const { terser } = require('rollup-plugin-terser')

const banner = 
  '/*!\n' +
  ' * better-jsonp v' + version + '\n' +
  ' * Copyrights (c) 2018-' + new Date().getFullYear() + ' Bowen (lbwa)\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const resolve = p => path.resolve(__dirname, '../', p)

const builds = {
  'development': {
    entry: resolve('lib/index.js'),
    dest: resolve('dist/better-jsonp.js'),
    format: 'umd',
    banner,
    plugins: []
  },
  'production': {
    entry: resolve('lib/index.js'),
    dest: resolve('dist/better-jsonp.min.js'),
    format: 'umd',
    banner,
    plugins: [
      terser({
        output: {
          comments: /^!/
        }
      })
    ]
  }
}

function genConfig (env) {
  const options = builds[env]
  const config = {
    input: options.entry,
    output: {
      file: options.dest,
      format: options.format,
      banner: options.banner,

      // module name in global env. eg. window.JSONP = function () {...}
      name: options.moduleName || 'JSONP'
    },
    plugins: [
      // define aliases and extension which should be resolved
      alias({
        utils: resolve('lib/utils') // url alias, eg. utils -> ../utils
      }),
      // rollup-plugin-replace, be used to inject environment variable to output
      replace({
        exclude: 'node_modules/**',
        ENVIRONMENT: JSON.stringify(process.env.NODE_ENV)
      }),
      // convert to lower ES version
      babel({
        exclude: 'node_modules/**'
      }),
      ...options.plugins
    ],
  }

  return config
}

// rollup -c scripts/rollup.config.js --environment NODE_ENV:production
module.exports = genConfig(process.env.NODE_ENV)
