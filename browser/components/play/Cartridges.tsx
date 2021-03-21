import { useCallback, useEffect } from 'react'

import { roms } from '../../romsList'
import { Rom } from '../../types'
import { fetchBytes } from '../../utils/std'

type Props = {
  selectedName?: string
  onCartridgeLoad: (rom: Rom) => void
}

type Option = {
  url: string
  name: string
}

const options: readonly Option[] = roms.filter((rom) =>
  rom.name.startsWith('demos/')
)

const initial = options.find((rom) => rom.name === 'demos/oh.gb') || null

export function Cartridges(props: Props) {
  const onChange = useCallback((newSelected: Option | null) => {
    if (!newSelected) {
      return null
    }
    fetchBytes(newSelected.url).then((bytes) =>
      props.onCartridgeLoad({ name: newSelected.name, bytes })
    )
  }, [])

  // Init load
  useEffect(() => {
    onChange(initial)
  }, [onChange])

  return (
    <table>
      <tbody>
        {options.map((option) => (
          <tr
            className={
              props.selectedName === option.name ? 'font-medium underline' : ''
            }
            key={option.url}>
            <td className="px-1">{option.name}</td>
            <td className="px-1">
              <button onClick={() => onChange(option)}>Load</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
