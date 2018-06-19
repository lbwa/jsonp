/*!
 * better-jsonp v1.0.0
 * Copyrights (c) 2018 Bowen (lbwa)
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Jsonp = factory());
}(this, (function () { 'use strict';

  function noop() {}

  function defineEnumerable(target, key, value) {
    Reflect.defineProperty(target, key, {
      enumerable: false,
      writable: true,
      value: value
    });
  }

  function euc(value) {
    return encodeURIComponent(value);
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var defaultOptions = {
    timeout: 6000,
    prefix: 'callback',
    callbackParams: 'jsonpCallback',
    urlParams: {}
  };

  var Jsonp = function () {
    function Jsonp() {
      classCallCheck(this, Jsonp);
    }

    createClass(Jsonp, [{
      key: 'checkOptions',
      value: function checkOptions(options) {
        if (!options.url) throw new Error('Please check your request url.');

        this.options = options;
      }
    }, {
      key: 'generateJsonpCallback',
      value: function generateJsonpCallback(options) {
        if (options.jsonpCallback) {
          this._jsonpCallback = options.jsonpCallback;
        } else {
          // prefix for callback name in global env
          var prefix = defaultOptions.prefix;

          // unique global callback name in global env
          this._jsonpCallback = prefix + Date.now();
        }
      }
    }, {
      key: 'defineGlobalCallback',
      value: function defineGlobalCallback() {
        var _this = this;

        /**
         * 1. Once invoked window[this._jsonpCallback], it will clean timer for limiting
         *    request period and script element which is used to JSONP.
         * 2. use arrow function to define `this` object value (Jsonp instance).
         */
        return new Promise(function (resolve, reject) {
          window[_this._jsonpCallback] = function (data) {
            _this.cleanScript();
            resolve(data);
          };
        });
      }
    }, {
      key: 'generateTimer',
      value: function generateTimer(options) {
        var _this2 = this;

        // limit request period
        var timeout = options.timeout || defaultOptions.timeout;

        // use arrow function to define `this` object value.
        if (timeout) {
          this._timer = setTimeout(function () {
            window[_this2._jsonpCallback] = noop;
            _this2._timer = null;
            _this2.cleanScript();
            throw new Error('JSONP request unsuccessfully (eg.timeout or wrong url).');
          }, timeout);
        }
      }
    }, {
      key: 'initState',
      value: function initState(options) {
        defineEnumerable(this, '_timer', null);
        defineEnumerable(this, '_request', null);
        defineEnumerable(this, '_jsonpCallback', null);
        defineEnumerable(this, '_insertScript', null);
        defineEnumerable(this, '_target', null);

        // set this._jsonpCallback
        this.generateJsonpCallback(options);

        // invoke defineGlobalCallback after setting this._jsonpCallback
        defineEnumerable(this, '_globalCallback', this.defineGlobalCallback());

        // set timer for limit request time
        this.generateTimer(options);
      }
    }, {
      key: 'encodeURL',
      value: function encodeURL(url) {
        // name of query parameter to specify the callback name
        // eg. ?callback=...
        var callbackParams = this.options.callbackParams || defaultOptions.callbackParams;
        var id = euc(this._jsonpCallback);
        url += '' + (url.indexOf('?') < 0 ? '?' : '&') + callbackParams + '=' + id;

        //  add other parameter to url excluding callback parameter
        var params = this.options.urlParams || defaultOptions.urlParams;
        var keys = Object.keys(params);
        keys.forEach(function (key) {
          var value = params[key] !== undefined ? params[key] : '';
          url += '&' + key + '=' + euc(value);
        });

        this._request = url;
      }
    }, {
      key: 'insertToElement',
      value: function insertToElement(url) {
        this._target = document.getElementsByTagName('script')[0] || document.body.lastElementChild;

        this._insertScript = document.createElement('script');
        this._insertScript.src = url;

        // activate JSONP
        this._target.parentNode.insertBefore(this._insertScript, this._target);
      }
    }, {
      key: 'cleanScript',
      value: function cleanScript() {
        if (this._insertScript.parentNode) {
          this._target.parentNode.removeChild(this._insertScript);
          this._insertScript = null;
        }

        window[this._jsonpCallback] = noop;

        if (this._timer) clearTimeout(this._timer);
      }
    }]);
    return Jsonp;
  }();

  // facade in facade pattern
  // same as axios, zepto
  function createInstance(options) {
    var jsonp = new Jsonp();

    jsonp.checkOptions(options);

    jsonp.initState(options);

    jsonp.encodeURL(jsonp.options.url);

    jsonp.insertToElement(jsonp._request);

    return jsonp._globalCallback; // from initState(options)
  }

  return createInstance;

})));
