/// <reference types="vite-plugin-svgr/client" />

// returns URL with file-loader
declare module '*.gb' {
  const _: string
  export = _
}

declare module '*.gbc' {
  const _: string
  export = _
}

declare module '*.md' {
  const _: string
  export = _
}

declare let USE_HASH_ROUTER: boolean
