declare function defineContentScript<T>(config: T): T

declare function defineBackground<T>(handler: T): T

declare module '*.css?inline' {
  const cssText: string
  export default cssText
}
