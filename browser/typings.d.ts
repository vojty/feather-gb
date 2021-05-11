// returns URL with file-loader
declare module '*.gb' {
  const _: string
  export = _
}

declare module '*.gbc' {
  const _: string
  export = _
}

// remark
declare module '*.md' {
  const _: string
  export = _
}

// SVGR loader
declare module '*.svg' {
  import { FunctionComponent, SVGProps } from 'react'

  const _: FunctionComponent<SVGProps<HTMLOrSVGElement>>
  export = _
}

declare let USE_HASH_ROUTER: boolean
