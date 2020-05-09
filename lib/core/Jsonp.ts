import { options } from '../utils/types'
import { noop } from '../utils/index'

const PREFIX = 'callback'

export default class Jsonp {
  handler: Promise<object> // facade API based on error handler and response handler

  private _url: string // converted url based on basic url and other params
  private _jsonpCallback: string // response handler
  private _reference: Element // reference element
  private _script: HTMLScriptElement | null // trigger element
  private _timer: number

  constructor({
    url,
    timeout = 6000,
    jsonpCallback = `${PREFIX}${Date.now()}`,
    callbackParams = 'jsonpCallback',
    urlParams = {}
  }: options) {
    this.checkOptions({
      url,
      jsonpCallback
    })
    this.initState({
      timeout,
      jsonpCallback
    })
    this.encodeURL({
      url,
      callbackParams,
      urlParams
    })
    this.insert(this._url)
  }

  checkOptions({ url, jsonpCallback }: options) {
    if (!url) throw new Error('Please check your request url.')

    // Every jsonp request will reset global request function named value of
    // jsonpCallback, so this value MUST NOT be `jsonp`.

    // This checking only works in CDN installing, not as a dependency using
    if (jsonpCallback === 'jsonp')
      throw new Error(
        "Don't name jsonpCallback to `jsonp` for unexpected reset. Please use any non-jsonp value"
      )
  }

  initState({
    timeout,
    jsonpCallback
  }: {
    timeout: options['timeout']
    jsonpCallback: options['jsonpCallback']
  }) {
    this.createScript()

    // unique response handler
    this._jsonpCallback = jsonpCallback

    // keep behind setting this._jsonpCallback
    this.handler = this.createHandler()

    // set timer for limit request time
    this.createTimer(timeout)
  }

  createScript() {
    this._reference =
      document.getElementsByTagName('script')[0] ||
      document.body.lastElementChild
    this._script = document.createElement('script')
  }

  /**
   * 1. Request timer will be cleaned when response handler invoked.
   * 2. use arrow function to keep `this` keywords value (Jsonp instance).
   */
  createHandler() {
    return new Promise<object>((resolve, reject) => {
      // handle 404/500 in response
      this._script.onerror = () => {
        this.cleanScript()
        // clear timer
        if (this._timer) {
          window.clearTimeout(this._timer)
          this._timer = null
        }
        reject(
          new Error(
            `[SCRIPT ONERROR]: JSONP request unsuccessfully due to 404/500`
          )
        )
      }
      ;(window as any)[this._jsonpCallback] = (data: object) => {
        this.cleanScript()
        resolve(data)
      }
    })
  }

  // create a request timer for limiting request period
  createTimer(timeout: options['timeout']) {
    // It can be disable when param timeout equal falsy value (0, null etc.)
    if (timeout) {
      const id = window.setTimeout(() => {
        ;(window as any)[this._jsonpCallback] = noop
        this.cleanScript()
        this._timer = null
        throw new Error(
          '[TIMEOUT]: JSONP request unsuccessfully (eg.timeout or wrong url).'
        )
      }, timeout)
      this._timer = id
    }
  }

  encodeURL({ url, callbackParams, urlParams }: options) {
    // name of query parameter to specify the callback name
    // eg. ?callback=...
    const id = encodeURIComponent(this._jsonpCallback)
    url += `${url.indexOf('?') < 0 ? '?' : '&'}${callbackParams}=${id}`

    // add other parameters to url ending excluding callback name parameter
    const keys = Object.keys(urlParams)
    keys.forEach(key => {
      const value = urlParams[key] !== undefined ? urlParams[key] : ''
      url += `&${key}=${encodeURIComponent(value)}`
    })

    // converted request url
    this._url = url
  }

  // activate JSONP
  insert(url: string) {
    this._script.src = url
    this._reference.parentNode.insertBefore(this._script, this._reference)
  }

  cleanScript() {
    if (this._script && this._script.parentNode) {
      this._script.parentNode.removeChild(this._script)
      this._script = null
    }

    // reset response handler
    ;(window as any)[this._jsonpCallback] = noop
  }
}
