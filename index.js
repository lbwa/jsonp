class JSONP {
  constructor (url, options, callback) {
    this.checkOptions(options, callback)

    this.insert(url)

    this.cleaner()
  }

  defineProperty (target, key, value) {
    Reflect.defineProperty(target, key, {
      enumerable: false,
      writable: true,
      value
    })
  }

  checkOptions (options, callback) {
    if (typeof options !== 'object' || typeof callback !== 'function') {
      throw new Error('Wrong options or callback')
    }
  }

  insert (url) {
    const target = document.getElementsByTagName('script')[0] || document.body.lastElementChild
    this.defineProperty(this, '_target', target)
    
    const script = document.createElement('script')
    script.src = url
    this.defineProperty(this, '_script', script)

    target.parentNode.insertBefore(script, target)
  }

  cleaner () {
    this._target.parentNode.removeChild(this._script)
    this._script = null
  }
}

export default JSONP
