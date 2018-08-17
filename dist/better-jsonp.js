/*!
 * better-jsonp v1.1.1 Copyrights (c) 2018 Bowen (lbwa)
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.jsonp = factory());
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

  var defaultOptions = {
      timeout: 6000,
      prefix: 'callback',
      callbackParams: 'jsonpCallback',
      urlParams: {}
  };
  var Jsonp = /** @class */function () {
      function Jsonp(options) {
          this.checkOptions(options);
          this.initState(options);
          this.encodeURL(options.url);
          this.insertToElement(this._request);
      }
      Jsonp.prototype.checkOptions = function (options) {
          if (!options || !options.url) throw new Error('Please check your request url.');
          // Every jsonp request will reset global request function named value of
          // jsonpCallback, so this value MUST NOT be `jsonp`.
          // This checking only works in CDN installing, not as a dependency using
          if (options.jsonpCallback === 'jsonp') throw new Error('Don\'t name jsonpCallback to `jsonp` for unexpected reset. Please use any non-jsonp value');
          this.options = options;
      };
      Jsonp.prototype.genJsonpCallback = function (options) {
          if (options.jsonpCallback) {
              this._jsonpCallback = options.jsonpCallback;
          } else {
              // prefix for callback name in global env
              var prefix = defaultOptions.prefix;
              // unique global callback name in global env
              this._jsonpCallback = prefix + Date.now();
          }
      };
      Jsonp.prototype.defineGlobalCallback = function () {
          var _this = this;
          /**
           * 1. Once invoked window[this._jsonpCallback], it will clean timer for limiting
           *    request period and script element which is used to JSONP.
           * 2. use arrow function to define `this` object value (Jsonp instance).
           */
          return new Promise(function (resolve, reject) {
              // handle 404/500 in response
              // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
              _this._insertScript.onerror = function () {
                  _this.cleanScript();
                  reject(new Error("Countdown has been clear! JSONP request unsuccessfully due to 404/500"));
              };
              window[_this._jsonpCallback] = function (data) {
                  _this.cleanScript();
                  resolve(data);
              };
          });
      };
      Jsonp.prototype.genTimer = function (options) {
          var _this = this;
          // limit request period
          var timeout = options.timeout || defaultOptions.timeout;
          // use arrow function to define `this` object value (Jsonp instance).
          if (timeout) {
              this._timer = window.setTimeout(function () {
                  window[_this._jsonpCallback] = noop;
                  _this._timer = 0;
                  _this.cleanScript();
                  throw new Error('JSONP request unsuccessfully (eg.timeout or wrong url).');
              }, timeout);
          }
      };
      Jsonp.prototype.genScript = function () {
          this._target = document.getElementsByTagName('script')[0] || document.body.lastElementChild;
          this._insertScript = document.createElement('script');
      };
      Jsonp.prototype.initState = function (options) {
          defineEnumerable(this, '_timer', null);
          defineEnumerable(this, '_request', null);
          defineEnumerable(this, '_jsonpCallback', null);
          defineEnumerable(this, '_insertScript', null);
          defineEnumerable(this, '_target', null);
          this.genScript();
          // set this._jsonpCallback
          this.genJsonpCallback(options);
          // invoke defineGlobalCallback after setting this._jsonpCallback
          defineEnumerable(this, '_globalCallback', this.defineGlobalCallback());
          // set timer for limit request time
          this.genTimer(options);
      };
      Jsonp.prototype.encodeURL = function (url) {
          // name of query parameter to specify the callback name
          // eg. ?callback=...
          var callbackParams = this.options.callbackParams || defaultOptions.callbackParams;
          var id = euc(this._jsonpCallback);
          url += "" + (url.indexOf('?') < 0 ? '?' : '&') + callbackParams + "=" + id;
          //  add other parameter to url excluding callback parameter
          var params = this.options.urlParams || defaultOptions.urlParams;
          var keys = Object.keys(params);
          keys.forEach(function (key) {
              var value = params[key] !== undefined ? params[key] : '';
              url += "&" + key + "=" + euc(value);
          });
          this._request = url;
      };
      // activate JSONP
      Jsonp.prototype.insertToElement = function (url) {
          this._insertScript.src = url;
          this._target.parentNode.insertBefore(this._insertScript, this._target);
      };
      Jsonp.prototype.cleanScript = function () {
          if (this._insertScript.parentNode) {
              this._target.parentNode.removeChild(this._insertScript);
              this._insertScript = null;
          }
          window[this._jsonpCallback] = noop;
          if (this._timer) window.clearTimeout(this._timer);
      };
      return Jsonp;
  }();

  // facade in facade pattern
  // same as axios, zepto
  function createInstance(options) {
      var jsonp = new Jsonp(options);
      // from initState(options)
      return jsonp._globalCallback;
  }

  return createInstance;

})));
