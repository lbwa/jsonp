# Better JSONP [![npm](https://img.shields.io/npm/v/better-jsonp.svg)](https://www.npmjs.com/package/better-jsonp) [![Build Status](https://travis-ci.org/lbwa/jsonp.svg?branch=master)](https://travis-ci.org/lbwa/jsonp)

A minimal JSONP implementation which is used to be a kind of cross domain solution.

## Install

```bash
# using npm
npm i better-jsonp
```
```bash
# using yarn
yarn add better-jsonp
```
```html
<!-- using CDN -->
<script src="https://cdn.jsdelivr.net/npm/better-jsonp"></script>
```

## Usage

```js
const jsonp = new JSONP({
  url: 'http://localhost',
  prefix: 'customName',
  timeout: 5000,
  // eg. ?customCallbackParams=...
  callbackParams: 'customCallbackParams',
  urlParams: {
    // eg. ?key0=0&key1=1...
    key0: 0,
    key1: 1
    // ...
  },
  callback: data => console.log(data)
})
```

| options parameter | type | required | description |
| ----------------- | ---- | -------- | ----------- |
|   `url`  | `String` |           true           | request url |
| `timeout` | `Number` | false, default : `6000` | how long after timeout error is emitted. `0` to disable |
| `prefix` | `String` | false, default: `callback` | prefix of global callback function name which is used to handle JSONP response |
| `jsonpCallback`  | `String` | false, default : `prefix` + `Date.now()` | global callback function name which is used to handle JSONP response |
| `callbackParams` | `String` | false, default: `jsonpCallback` | name of query parameter to specify the callback name |
| `urlParams` |  `Object`  | false, default: `{}` | other parameters in query string parameters |
|  `callback` | `Function` |          true        | This callback which is in global callback function will be invoked when JSONP response |
