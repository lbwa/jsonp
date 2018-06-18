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

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  input: resolve('src/index.js'),
  output: {
    file: resolve(isProduction ? 'dist/bundle.min.js' : 'dist/bundle.js'),
    name: 'jsonp',
    format: 'umd',
    banner
  },
  plugins: [
    // define aliases and extension which should be resolved
    alias({
      utils: resolve('utils') // url alias, eg. utils -> ../utils
    }),
    // rollup-plugin-replace, be used to inject environment variable to output
    // replace({
    //   exclude: 'node_modules/**',
    //   ENVIRONMENT: JSON.stringify(process.env.NODE_ENV)
    // }),
    // convert to lower ES version
    babel({
      exclude: 'node_modules/**'
    }),
    // minify output
    isProduction && terser({
      output: {
        comments: /^!/
      }
    })
  ]
}

export default config
