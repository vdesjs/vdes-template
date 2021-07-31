/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
// Global compile-time constatns
declare var __COMMIT__: string

declare module '*?raw' {
  const content: string
  export default content
}

declare module 'file-saver' {
  export function saveAs(blob: any, name: any): void
}
