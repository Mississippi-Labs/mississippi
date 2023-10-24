declare  global {
  interface Promise {
    delay: (t: number) => Promise
  }
}