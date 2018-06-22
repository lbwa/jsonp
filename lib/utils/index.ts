export function noop () {}

export function defineEnumerable (target: object, key: string, value: any) {
  Reflect.defineProperty(target, key, {
    enumerable: false,
    writable: true,
    value
  })
}

export function euc (value: string): string {
  return encodeURIComponent(value)
}
