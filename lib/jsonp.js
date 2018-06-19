import Jsonp from './core/Jsonp'

function createInstance (options) {
  const jsonp = new Jsonp()

  jsonp.checkOptions(options)

  jsonp.initState(options)

  const instance = jsonp.defineGlobalCallback() // return a promise

  // bind(Jsonp.prototype.defineGlobalCallback, jsonp)

  jsonp.encodeURL(jsonp._options.url)

  jsonp.insertToElement(jsonp._url)

  // Once invoked window[this._jsonpCallback], it will clean script which is
  // used to JSONP from HTML

  return instance
}

export default createInstance
