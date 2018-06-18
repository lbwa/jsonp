/*!
 * better-jsonp v0.2.15
 * Copyrights (c) 2018-2018 Bowen (lbwa)
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.JSONP = factory());
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

  var JSONP = function () {
    function JSONP(options) {
      classCallCheck(this, JSONP);

      this.checkOptions(options);

      this.initState(options);

      this.encodeURL(this._options.url);

      this.insertToElement(this._url);

      // Once invoked window[this._id], it will clean script which is used to
      // JSONP from HTML
    }

    createClass(JSONP, [{
      key: 'checkOptions',
      value: function checkOptions(options) {
        if (!options.url) throw new Error('Please check your request url.');
        if (!options.callback) throw new Error('Please check your callback parameter.');

        this._options = options;
      }
    }, {
      key: 'initState',
      value: function initState(options) {
        var _this = this;

        defineEnumerable(this, '_timer', null);
        defineEnumerable(this, '_url', null);
        defineEnumerable(this, '_id', null);
        defineEnumerable(this, '_insertScript', null);
        defineEnumerable(this, '_target', null);

        // period of request without timeout error
        var timeout = options.timeout || 6000;

        if (options.callbackName) {
          this._id = options.callbackName;
          defineEnumerable(this, '_callbackName', this._id);
        } else {
          // prefix for callback name in global env
          var prefix = options.prefix || 'callback';

          // unique global callback name in global env
          this._id = prefix + Date.now();
        }

        /**
         * 1. Once invoked window[this._id], it will clean timer for limiting
         *    request period and script element which is used to JSONP.
         * 2. use arrow function to define `this` object value.
         */
        window[this._id] = function (data) {
          _this.cleanScript();
          _this._options.callback(data);
        };

        // timer is used to limit request period.
        // use arrow function to define `this` object value.
        if (timeout) {
          this._timer = setTimeout(function () {
            window[_this._id] = noop;
            _this._timer = null;
            _this.cleanScript();
            throw new Error('JSONP request unsuccessfully (eg.timeout or wrong url).');
          }, timeout);
        }
      }
    }, {
      key: 'encodeURL',
      value: function encodeURL(url) {
        // name of query parameter to specify the callback name
        // eg. ?callback=...
        var callbackParams = this._options.callbackParams || 'jsonpCallback';
        var id = euc(this._id);
        url += '' + (url.indexOf('?') < 0 ? '?' : '&') + callbackParams + '=' + id;

        //  add other parameter to url excluding callback parameter
        var params = this._options.urlParams || {};
        var keys = Object.keys(params);
        keys.forEach(function (key) {
          var value = params[key] !== undefined ? params[key] : '';
          url += '&' + key + '=' + euc(value);
        });

        this._url = url;
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

        window[this._id] = noop;

        if (this._timer) clearTimeout(this._timer);
      }
    }]);
    return JSONP;
  }();

  return JSONP;

})));
