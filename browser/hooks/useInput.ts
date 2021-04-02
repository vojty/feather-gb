import { useContext } from 'react'

import { InputContext } from '../context/InputContext'

export function useInput() {
  const { input } = useContext(InputContext)
  return input
}
