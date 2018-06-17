# JSONP

A minimal JSONP implementation which is used to be a kind of cross domain solution.

## Usage

```js
import JSONP from 'jsonp'
const jsonp = new JSONP(url, options, callback)
```

| parameter | type | description |
| --------- |------| ----------- |
| `url` | `String` | request url |
| `options` | `Object` | optional parameter which is used to customize you jsonp instance |
| `callback` | `Function`| This callback which is in global callback function will be invoked when JSONP response |

| options parameter | type | description |
| ----------------- | ---- | ----------- |
| `prefix` | `String` | prefix of global callback function name which is used to handle JSONP response |
| `callbackParams` | `Object` | name of query parameter to specify the callback name |
| `urlParams` | `Object` | other parameters in query string parameters |
