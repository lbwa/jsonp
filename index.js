import { noop, defineEnumerable } from './utils'
class JSONP {
  constructor (url, options, callback) {
    this.checkOptions(options, callback)

    this.initState(options, callback)

    this.insertToElement(url)
  }

  initState (options, callback) {
    const timeout = options.timeout || 6000
    const prefix = options.prefix || 'jsonpCallback'
    // const id = prefix + Data.now()
    const id = prefix

    // callback in global env
    window[id] = (data) => {
      // 当返回数据，即 window[id] 被执行时，那么清除超时倒计时
      this.cleanScript()
      callback(data)
    }

    defineEnumerable(this, '_timer', null)
    defineEnumerable(this, '_script', null)
    defineEnumerable(this, '_target', null)

    if (timeout) {
      this._timer = setTimeout(() => {
        window[id] = noop
        this._timer = null
        this.cleanScript()
      }, timeout)
    }
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
    if (this._script.parentNode) {
      this._target.parentNode.removeChild(this._script)
      this._script = null
    }

    if (this._timer) clearTimeout(this._timer)
  }
}

export default JSONP
