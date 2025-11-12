export type Theme = {
  zoom: number
}

export type Rom = {
  bytes: Uint8Array
  name: string
  custom?: boolean
}

// https://styled-components.com/docs/api#create-a-declarations-file
// import original module declarations
import 'styled-components'

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    zoom: number
  }
}
