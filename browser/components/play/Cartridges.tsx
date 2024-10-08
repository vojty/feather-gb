import { useCallback, useEffect } from 'react'

import { roms } from '../../romsList'
import type { Rom } from '../../types'
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
  [
    'demos/cgb-acid2.gbc',
    'demos/dmg-acid2.gb',
    'demos/gejmboj.gb',
    'demos/oh.gb',
    'demos/opus5.gb',
    'demos/pocket.gb',
  ].includes(rom.name),
)

const initial = options.find((rom) => rom.name === 'demos/oh.gb') || null

export function Cartridges({ onCartridgeLoad, selectedName }: Props) {
  const onChange = useCallback(
    (newSelected: Option | null) => {
      if (!newSelected) {
        return
      }
      fetchBytes(newSelected.url).then((bytes) =>
        onCartridgeLoad({ name: newSelected.name, bytes }),
      )
    },
    [onCartridgeLoad],
  )

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
              selectedName === option.name ? 'font-medium underline' : ''
            }
            key={option.url}
          >
            <td className="px-1">{option.name}</td>
            <td className="px-1">
              <button type="button" onClick={() => onChange(option)}>
                Load
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
