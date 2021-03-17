// returns URL with file-loader
declare module '*.gb' {
  const _: string
  export = _
}

declare module '*.svg' {
  import { FunctionComponent, SVGProps } from 'react'

  const _: FunctionComponent<SVGProps<HTMLOrSVGElement>>
  export = _
}

declare let BASENAME: string | undefined
