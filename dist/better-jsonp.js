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
  function euc(value) {
      return encodeURIComponent(value);
  }

  var PREFIX = 'callback';
  var Jsonp = /** @class */function () {
      function Jsonp(_a) {
          var url = _a.url,
              _b = _a.timeout,
              timeout = _b === void 0 ? 6000 : _b,
              _c = _a.jsonpCallback,
              jsonpCallback = _c === void 0 ? "" + PREFIX + Date.now() : _c,
              _d = _a.callbackParams,
              callbackParams = _d === void 0 ? 'jsonpCallback' : _d,
              _e = _a.urlParams,
              urlParams = _e === void 0 ? {} : _e;
          this.checkOptions({
              url: url,
              jsonpCallback: jsonpCallback
          });
          this.initState({
              timeout: timeout,
              jsonpCallback: jsonpCallback
          });
          this.encodeURL({
              url: url,
              callbackParams: callbackParams,
              urlParams: urlParams
          });
          this.insert(this._url);
      }
      Jsonp.prototype.checkOptions = function (_a) {
          var url = _a.url,
              jsonpCallback = _a.jsonpCallback;
          if (!url) throw new Error('Please check your request url.');
          // Every jsonp request will reset global request function named value of
          // jsonpCallback, so this value MUST NOT be `jsonp`.
          // This checking only works in CDN installing, not as a dependency using
          if (jsonpCallback === 'jsonp') throw new Error('Don\'t name jsonpCallback to `jsonp` for unexpected reset. Please use any non-jsonp value');
      };
      Jsonp.prototype.initState = function (_a) {
          var timeout = _a.timeout,
              jsonpCallback = _a.jsonpCallback;
          this.createScript();
          // unique response handler
          this._jsonpCallback = jsonpCallback;
          // keep behind setting this._jsonpCallback
          this.handler = this.createHandler();
          // set timer for limit request time
          this.createTimer(timeout);
      };
      Jsonp.prototype.createScript = function () {
          this._reference = document.getElementsByTagName('script')[0] || document.body.lastElementChild;
          this._script = document.createElement('script');
      };
      /**
       * 1. Request timer will be cleaned when response handler invoked.
       * 2. use arrow function to keep `this` keywords value (Jsonp instance).
       */
      Jsonp.prototype.createHandler = function () {
          var _this = this;
          return new Promise(function (resolve, reject) {
              // handle 404/500 in response
              _this._script.onerror = function () {
                  _this.cleanScript();
                  reject(new Error("Countdown has been clear! JSONP request unsuccessfully due to 404/500"));
              };
              window[_this._jsonpCallback] = function (data) {
                  _this.cleanScript();
                  resolve(data);
              };
          });
      };
      // create a request timer for limiting request period
      Jsonp.prototype.createTimer = function (timeout) {
          var _this = this;
          if (timeout) {
              this._timer = window.setTimeout(function () {
                  window[_this._jsonpCallback] = noop;
                  _this._timer = null;
                  _this.cleanScript();
                  throw new Error('JSONP request unsuccessfully (eg.timeout or wrong url).');
              }, timeout);
          }
      };
      Jsonp.prototype.encodeURL = function (_a) {
          var url = _a.url,
              callbackParams = _a.callbackParams,
              urlParams = _a.urlParams;
          // name of query parameter to specify the callback name
          // eg. ?callback=...
          var id = euc(this._jsonpCallback);
          url += "" + (url.indexOf('?') < 0 ? '?' : '&') + callbackParams + "=" + id;
          // add other parameters to url ending excluding callback name parameter
          var keys = Object.keys(urlParams);
          keys.forEach(function (key) {
              var value = urlParams[key] !== undefined ? urlParams[key] : '';
              url += "&" + key + "=" + euc(value);
          });
          // converted request url
          this._url = url;
      };
      // activate JSONP
      Jsonp.prototype.insert = function (url) {
          this._script.src = url;
          this._reference.parentNode.insertBefore(this._script, this._reference);
      };
      Jsonp.prototype.cleanScript = function () {
          if (this._script.parentNode) {
              this._reference.parentNode.removeChild(this._script);
              this._script = null;
          }
          // reset response handler
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
      return jsonp.handler;
  }

  return createInstance;

})));
