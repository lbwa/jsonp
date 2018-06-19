export function noop () {}

export function defineEnumerable (target, key, value) {
  Reflect.defineProperty(target, key, {
    enumerable: false,
    writable: true,
    value
  })
}

export function euc (value) {
  return encodeURIComponent(value)
}
