# Better JSONP [![npm](https://img.shields.io/npm/v/better-jsonp.svg)](https://www.npmjs.com/package/better-jsonp) [![Build Status](https://travis-ci.org/lbwa/jsonp.svg?branch=master)](https://travis-ci.org/lbwa/jsonp) [![npm](https://img.shields.io/npm/dt/better-jsonp.svg)](https://github.com/lbwa/jsonp)

A minimal and lightweight JSONP implementation which is used to be a kind of cross domain solutions.

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
<script src="https://unpkg.com/better-jsonp@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/better-jsonp@latest"></script>
```

## Promise polyfill

If your browser doesn't support [ES6 Promise], you should import polyfill to the global environment at the beginning of your application.

```js
require('es6-promise').polyfill()
```

***Notice***: Don't assign the result of `polyfill()` to any variable.

[es6 promise]:http://www.ecma-international.org/ecma-262/#sec-promise-objects

## Usage

JSONP ***only*** support GET methods, same as `better-JSONP`.

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
| `jsonpCallback`  | `String` | false, default : `'callback'+Date.now()` | global callback function name which is used to handle JSONP response. |
| `callbackParams` | `String` | false, default: `jsonpCallback` | name of query parameter to specify the callback name |
| `urlParams` |  `Object`  | false, default: `{}` | other parameters in query string parameters |

## Notice

- `Uncaught SyntaxError: Unexpected token :`error

It mostly doesn't support JSONP request when you are calling a JSON api. The difference between JSON api and JSONP is that  JSON api response with an object like `{ num: 1 }` (It will throw a error when client executed this response as a function. ). On the other hand, JSONP will respond with a function wrapped object like `jsonpCallback({ num: 1 })` and we will get what we need when client executed this response as a function.
