import Jsonp from './core/Jsonp'

// facade in facade pattern
// same as axios, zepto
function createInstance (options) {
  const jsonp = new Jsonp(options)

  // from initState(options)
  return jsonp._globalCallback
}

export default createInstance
