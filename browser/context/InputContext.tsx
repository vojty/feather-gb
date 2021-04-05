import { createContext, useCallback, useState } from 'react'
import { JsKeys } from '../../gb-web/pkg'

export const InputContext = createContext<{
  input: JsKeys[]
  onKeyDown: (key: JsKeys) => void
  onKeyUp: (key: JsKeys) => void
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
  const [input, setInput] = useState<JsKeys[]>([])

  const onKeyUp = useCallback((key: JsKeys) => {
    setInput((prevInput) => prevInput.filter((k) => key !== k))
  }, [])

  const onKeyDown = useCallback((key: JsKeys) => {
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
