import { ChangeEvent, ReactNode } from 'react'

import { Rom } from '../../types'

type Props = {
  className?: string
  onLoad: (rom: Rom) => void
  children: ReactNode
}

export function OpenButton(props: Props) {
  const { onLoad, className, children } = props
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget
    if (!files) {
      return
    }
    const file = files[0]
    file
      .arrayBuffer()
      .then((data) => new Uint8Array(data))
      .then((bytes) => onLoad({ name: `Custom: ${file.name}`, bytes, custom: true }))
  }

  return (
    <>
      <input
        onChange={onChange}
        accept=".gb,.gbc"
        style={{ display: 'none' }}
        id="file"
        multiple
        type="file"
      />
      <label className={className} htmlFor="file">
        {children}
      </label>
    </>
  )
}
