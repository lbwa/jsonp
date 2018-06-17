const path = require('path')
const version = process.env.VERSION || require('../package.json').version
const alias = require('rollup-plugin-alias')
const babel = require('rollup-plugin-babel')
const { terser } = require('rollup-plugin-terser')

const banner = 
  '/*!\n' +
  ' * jsonp v' + version + '\n' +
  ' * Copyrights (c) 2018-' + new Date().getFullYear() + ' Bowen (lbwa)\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const resolve = p => path.resolve(__dirname, '../', p)

export default {
  input: resolve('src/index.js'),
  output: {
    file: resolve('dist/bundle.min.js'),
    name: 'jsonp',
    format: 'umd',
    banner
  },
  plugins: [
    // define aliases and extension which should be resolved
    alias({
      utils: resolve('utils') // url alias, eg. utils -> ../utils
    }),
    // minify
    terser({
      output: {
        comments: /^!/
      }
    }),
    // convert to lower ES version
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
