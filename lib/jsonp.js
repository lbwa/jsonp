import Jsonp from './core/Jsonp'

// facade in facade pattern
// same as axios, zepto
function createInstance (options) {
  const jsonp = new Jsonp()

  jsonp.checkOptions(options)

  jsonp.initState(options)

  jsonp.encodeURL(jsonp.options.url)

  jsonp.insertToElement(jsonp._request)

  return jsonp._globalCallback // from initState(options)
}

export default createInstance
