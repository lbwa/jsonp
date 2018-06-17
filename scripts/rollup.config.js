// import babel from 'rollup-plugin-babel'
import alias from 'rollup-plugin-alias'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'index.js',
  output: {
    file: 'dist/bundle.js',
    name: 'jsonp',
    format: 'umd'
  },
  plugins: [
    alias(),
    terser()
    // babel({
    //   exclude: 'node_modules/**'
    // })
  ]
}