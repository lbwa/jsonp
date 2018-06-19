# Better JSONP [![npm](https://img.shields.io/npm/v/better-jsonp.svg)](https://www.npmjs.com/package/better-jsonp) [![Build Status](https://travis-ci.org/lbwa/jsonp.svg?branch=master)](https://travis-ci.org/lbwa/jsonp)

A minimal JSONP implementation which is used to be a kind of cross domain solution.

## Features

- Implement JSONP request from the browser

- Support the [Promise] API

[Promise]:https://promisesaplus.com/

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
jsonp({
  url: 'http://localhost',
  // global function named `${jsonpCallback}` will invoked when JSONP response
  jsonpCallback: 'jsonp',
  timeout: 5000,
  // eg. ?customCallbackParams=...
  callbackParams: 'customCallbackParams',
  urlParams: {
    // eg. ?key0=0&key1=1...
    key0: 0,
    key1: 1
  }
})
  .then(res => console.log(res))
  .catch(err => console.error(err))
```

| options parameter | type | required | description |
| ----------------- | ---- | -------- | ----------- |
|   `url`  | `String` |           true           | JSONP request address |
| `timeout` | `Number` | false, default : `6000` | how long after timeout error is emitted. `0` to disable |
| `jsonpCallback`  | `String` | false, default : `'callback'+'Date.now()'` | global callback function name which is used to handle JSONP response. |
| `callbackParams` | `String` | false, default: `jsonpCallback` | name of query parameter to specify the callback name |
| `urlParams` |  `Object`  | false, default: `{}` | other parameters in query string parameters |
