import { noop, defineEnumerable } from './utils'
class JSONP {
  constructor (url, options, callback) {
    this.checkOptions(options, callback)

    this.initState(options, callback)

    this.encodeURL(url)

    this.insertToElement(this._url)
  }

  encodeURL (url) {
    // name of query parameter to specify the callback name
    // eg. ?callback=...
    const params = this._options.params || 'jsonpCallback'
    const id = encodeURIComponent(this._id)
    url += `${url.indexOf('?') < 0 ? '?' : '&'}${params}=${id}`

    //  TODO: add other parameter to url excluding callback parameter

    this._url = url
  }

  checkOptions (options, callback) {
    if (typeof options === 'function' && typeof callback === 'object') {
      [callback, options] = [options, callback]
    }

    this._options = options ? options : {}
  }

  initState (options, callback) {
    defineEnumerable(this, '_timer', null)
    defineEnumerable(this, '_url', null)
    defineEnumerable(this, '_id', null)
    defineEnumerable(this, '_insertScript', null)
    defineEnumerable(this, '_target', null)

    // period of request without timeout error
    const timeout = options.timeout || 6000

    // prefix for callback name in global env
    const prefix = options.prefix || 'jsonpCallback'

    // unique global callback name in global env
    this._id = prefix + Date.now()

    window[this._id] = (data) => {
      // Once invoked window[this._id],clean timer for limiting request period
      this.cleanScript()
      callback(data)
    }

    // timer is used to limit request period
    if (timeout) {
      this._timer = setTimeout(() => {
        window[this._id] = noop
        this._timer = null
        this.cleanScript()
        throw new Error('JSONP request unsuccessfully (eg. timeout).')
      }, timeout)
    }
  }

  insertToElement (url) {
    this._target = document.getElementsByTagName('script')[0] || document.body.lastElementChild

    this._insertScript = document.createElement('script')
    this._insertScript.src = url

    this._target.parentNode.insertBefore(this._insertScript, this._target)
  }

  cleanScript () {
    if (this._insertScript.parentNode) {
      this._target.parentNode.removeChild(this._insertScript)
      this._insertScript = null
    }

    if (this._timer) clearTimeout(this._timer)
  }
}

export default JSONP
