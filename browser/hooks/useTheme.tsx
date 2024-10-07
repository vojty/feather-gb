import { useTheme as useStyledTheme } from 'styled-components'

import type { Theme } from '../types'

export function useTheme() {
  const theme = useStyledTheme()

  return theme as Theme
}
