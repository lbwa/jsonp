export function noop () {}

export function euc (value: string): string {
  return encodeURIComponent(value)
}
