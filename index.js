import { noop, defineEnumerable } from './utils'
class JSONP {
  constructor (url, options, callback) {
    this.checkOptions(options, callback)

    this.initState(options, callback)

    this.insertToElement(url)

    // if (timeout) {
    //   this._timer = setTimeout(() => {
        // window[id] = noop
    //     this._timer = null
    //     this.cleanScript()
    //   }, timeout)
    // }
  }

  initState (options, callback) {
    // const timeout = options.timeout || 6000
    const prefix = options.prefix || 'jsonpCallback'
    // const id = prefix + Data.now()
    const id = prefix
    window[id] = (data) => {
      this.cleanScript()
      callback(data)
    }

    defineEnumerable(this, '_timer', null)
    defineEnumerable(this, '_script', null)
    defineEnumerable(this, '_target', null)
  }

  checkOptions (options, callback) {
    if (typeof options !== 'object' || typeof callback !== 'function') {
      throw new Error('Wrong options or callback')
    }
  }

  insertToElement (url) {
    this._target = document.getElementsByTagName('script')[0] || document.body.lastElementChild

    this._script = document.createElement('script')
    this._script.src = url

    this._target.parentNode.insertBefore(this._script, this._target)
  }

  cleanScript () {
    console.log('cleanScript running')
    this._target.parentNode.removeChild(this._script)
    this._script = null
  }
}

export default JSONP
