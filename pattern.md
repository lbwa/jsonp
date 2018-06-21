# Design pattern

[![JavaScript Style Guide - Standard Style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

本应用借鉴 `Vue.js` 的部分架构模式（`prototype pattern` + `constructor pattern`），以原型对象为基础创建多个实例。每个实例均有自己独有的属性表示自己独有的数据（如 `this._options`、`this._id`）。同时这些实例属性可用于原型方法之间的传值，避免了调用原型对象直接传参。

  - `prototype pattern` 用于多个实例共享原型方法。

  - `constructor pattern` 用于向实例添加 `自有属性`，以保持自己的独特性，使得各个实例之间互不影响。同时这些 `自有属性` 可在原型方法之间传值，而不用在调用原型方法时显式传参。

注：`Vue.js` 还有 `publish/subscribe pattern` （我的[博客][js-design-pattern]）等等设计模式。另外亦可向 `Vue.js` 那样将所有参数整合为 1 个 ***对象参数***，这样就不用考虑传参的位置问题。

[js-design-pattern]:https://lbwa.github.io/2018/06/12/180612-js-design-pattern/#发布-订阅模式


## 具体实现

1. 借鉴了 `axios`, `zepto` 等开源库的实例化方式，并不真正地对外暴露构造函数。

    - 以 `facade pattern`（我的[博客][facade-pattern]）来使得内部实例化 `Jsonp` 的操作得以抽象化，并将 `Jsonp` 构造函数与外部使用者解耦。

    - `facade pattern` 另一个显著特点就是可以在抽象化内部模块的基础上可以实现自定义对外接口。

    - 另外 `facade pattern` 仅仅是对内部模块实现一层包裹，那么仍保留了内部模块的拓展性（本应用依据 `prototype pattern` 和 `constructor pattern` 来实现内部模块拓展性）。

2. 在实例化 `Axios` 时通过一个 `facade` 抽象化内部实现（[more details][axios-instance]）。`better-jsonp` 的 `Promise` API 实现的一部分灵感来自于此。

```js
// lib/axios.js
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig)

  // 指定 Axios 原型方法 request 执行时的 this 指向为 Axios 实例
  // request 方法返回一个 Promise，那么在执行 axios.request 即可得到一个 Promise
  var instance = bind(Axios.prototype.request, context)

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context)

  // Copy context to instance
  utils.extend(instance, context)

  return instance
}

// lib/helpers/bind.js
// 执行 bind 将得到一个 wrap 函数
// wrap 函数等同于 fn.bind(thisArg)，这里并不清楚为什么作者没有直接使用 bind 方式实现
function bind (fn, thisArg) {
  return function wrap () {
    // 将 wrap 的 arguments 类数组对象转为真正的数组
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    return fn.apply(thisArg, args)
  }
}
```

如同 `axios` 中一样，以 `facade pattern` 中的 `facade` 对 `Jsonp` 实例进行一次包裹，并据此实现了自定义一个对外接口。不同于 `axios` 直接向外传递 `Axios` 实例，`better-jsonp` 是私有化了真正的 `Jsonp` 的实例。对外接口是 `Jsonp` 实例的一个自有属性（即 `this._globalCallback`），它即是与 `JSONP` 相关的全局回调函数。该接口本身返回一个 `Promise` 对象，那么在全局回调因 `JSONP` 响应后被调用时，就可依据该接口返回的 `Promise` 设置对应的 `Promise API` 回调函数。

[facade-pattern]:https://lbwa.github.io/2018/06/12/180612-js-design-pattern/#外观模式

[axios-instance]:https://github.com/axios/axios/blob/master/lib/axios.js#L15-L26
