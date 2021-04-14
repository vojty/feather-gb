import { useContext } from 'react'

import { InputContext } from '../context/InputContext'

export function useInput() {
  return useContext(InputContext)
}
