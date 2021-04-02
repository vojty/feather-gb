import { createContext, useCallback, useState } from 'react'
import { JSKeys } from '../../gb-web/pkg'

export const InputContext = createContext<{
  input: JSKeys[]
  onKeyDown: (key: JSKeys) => void
  onKeyUp: (key: JSKeys) => void
}>({
  input: [],
  onKeyDown: () => {},
  onKeyUp: () => {}
})

export function InputContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [input, setInput] = useState<JSKeys[]>([])

  const onKeyUp = useCallback((key: JSKeys) => {
    setInput((prevInput) => prevInput.filter((k) => key !== k))
  }, [])

  const onKeyDown = useCallback((key: JSKeys) => {
    setInput((prevInput) => {
      if (prevInput.includes(key)) {
        return prevInput
      }
      return [...prevInput, key]
    })
  }, [])

  return (
    <InputContext.Provider value={{ input, onKeyUp, onKeyDown }}>
      {children}
    </InputContext.Provider>
  )
}
