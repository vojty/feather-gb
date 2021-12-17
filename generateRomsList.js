/* eslint-disable import/no-extraneous-dependencies */
const fg = require('fast-glob')
const fs = require('fs')
const prettier = require('prettier')
const config = require('./.prettierrc')

const entries = fg.sync(['roms/**/*.{gb,gbc}'])

const roms = entries.map((e) => e.replace('roms/', '')).sort()

const PATH = '../roms'

function generateOutput(items) {
  const imports = items.map((item, i) => {
    const key = `rom${i}`
    return {
      import: `import ${key} from '${PATH}/${item}'`,
      key,
      name: item
    }
  })
  const importStatements = imports.map((item) => item.import).join('\n')
  const exportObj = imports
    .map((item) => `{ name: '${item.name}', url: ${item.key} }`)
    .join(',')
  const exportStatement = `export const roms = [${exportObj}]`

  return `// AUTOGENERATED\n${importStatements}\n\n${exportStatement}`
}

const out = prettier.format(generateOutput(roms), {
  ...config,
  parser: 'typescript'
})

fs.writeFileSync(`${__dirname}/browser/romsList.ts`, out)
