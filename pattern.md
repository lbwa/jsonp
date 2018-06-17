# Summary

本应用借鉴 `Vue.js` 的部分架构模式（`prototype pattern` + `constructor pattern`），以原型对象为基础创建多个实例。每个实例均有自己独有的属性表示自己独有的数据（如 `this._options`、`this._id`）。同时这些实例属性可用于原型方法之间的传值，避免了调用原型对象直接传参。

  - `prototype pattern` 用于多个实例共享原型方法。

  - `constructor pattern` 用于向实例添加 `自有属性`，以保持自己的独特性，使得各个实例之间互不影响。同时这些 `自有属性` 可在原型方法之间传值，而不用在调用原型方法时显式传参。

注：`Vue.js` 还有 `publish/subscribe pattern` （我的[博客][js-design-pattern]）等等设计模式。另外亦可向 `Vue.js` 那样将所有参数整合为 1 个 ***对象参数***，这样就不用考虑传参的位置问题。

[js-design-pattern]:https://lbwa.github.io/2018/06/12/180612-js-design-pattern/#发布-订阅模式