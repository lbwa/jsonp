import { noop, defineEnumerable, euc } from '../utils/index.js'

const defaultOptions = {
  timeout: 6000,
  prefix: 'callback',
  callbackParams: 'jsonpCallback',
  urlParams: {}
}

export default class Jsonp {
  constructor (options) {
    this.checkOptions(options)

    this.initState(options)

    this.encodeURL(options.url)

    this.insertToElement(this._request)
  }

  checkOptions (options) {
    if (!options || !options.url) throw new Error('Please check your request url.')

    this.options = options
  }

  genJsonpCallback (options) {
    if (options.jsonpCallback) {
      this._jsonpCallback = options.jsonpCallback
    } else {
      // prefix for callback name in global env
      const prefix = defaultOptions.prefix

      // unique global callback name in global env
      this._jsonpCallback = prefix + Date.now()
    }
  }

  defineGlobalCallback () {
    /**
     * 1. Once invoked window[this._jsonpCallback], it will clean timer for limiting
     *    request period and script element which is used to JSONP.
     * 2. use arrow function to define `this` object value (Jsonp instance).
     */
    return new Promise((resolve, reject) => {
      // handle 404/500 in response
      this._insertScript.onerror = () => {
        this.cleanScript()
        reject(new Error(`Countdown has been clear! JSONP request unsuccessfully due to 404/500`))
      }

      window[this._jsonpCallback] = (data) => {
        this.cleanScript()
        resolve(data)
      }
    })
  }

  genTimer (options) {
    // limit request period
    const timeout = options.timeout || defaultOptions.timeout

    // use arrow function to define `this` object value (Jsonp instance).
    if (timeout) {
      this._timer = setTimeout(() => {
        window[this._jsonpCallback] = noop
        this._timer = null
        this.cleanScript()
        throw new Error('JSONP request unsuccessfully (eg.timeout or wrong url).')
      }, timeout)
    }
  }

  genScript () {
    this._target = document.getElementsByTagName('script')[0] || document.body.lastElementChild
    this._insertScript = document.createElement('script')
  }

  initState (options) {
    defineEnumerable(this, '_timer', null)
    defineEnumerable(this, '_request', null)
    defineEnumerable(this, '_jsonpCallback', null)
    defineEnumerable(this, '_insertScript', null)
    defineEnumerable(this, '_target', null)

    this.genScript()

    // set this._jsonpCallback
    this.genJsonpCallback(options)

    // invoke defineGlobalCallback after setting this._jsonpCallback
    defineEnumerable(this, '_globalCallback', this.defineGlobalCallback())

    // set timer for limit request time
    this.genTimer(options)
  }

  encodeURL (url) {
    // name of query parameter to specify the callback name
    // eg. ?callback=...
    const callbackParams = this.options.callbackParams || defaultOptions.callbackParams
    const id = euc(this._jsonpCallback)
    url += `${url.indexOf('?') < 0 ? '?' : '&'}${callbackParams}=${id}`

    //  add other parameter to url excluding callback parameter
    const params = this.options.urlParams || defaultOptions.urlParams
    const keys = Object.keys(params)
    keys.forEach(key => {
      const value = params[key] !== undefined ? params[key] : ''
      url += `&${key}=${euc(value)}`
    })

    this._request = url
  }

  // activate JSONP
  insertToElement (url) {
    this._insertScript.src = url
    this._target.parentNode.insertBefore(this._insertScript, this._target)
  }

  cleanScript () {
    if (this._insertScript.parentNode) {
      this._target.parentNode.removeChild(this._insertScript)
      this._insertScript = null
    }

    window[this._jsonpCallback] = noop
    if (this._timer) clearTimeout(this._timer)
  }
}
