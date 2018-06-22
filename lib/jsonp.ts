import Jsonp from './core/Jsonp'
import { options } from './types/types'

// facade in facade pattern
// same as axios, zepto
function createInstance (options: options) {
  const jsonp = new Jsonp(options)

  // from initState(options)
  return jsonp._globalCallback
}

export default createInstance
