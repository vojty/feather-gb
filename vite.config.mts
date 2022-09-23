import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import rehypeParse from 'rehype-parse'
import rehypeRewrite from 'rehype-rewrite'
import rehypeStringify from 'rehype-stringify'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { unified } from 'unified'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import wasm from 'vite-plugin-wasm'
import wasmPack from 'vite-plugin-wasm-pack'

const fileToBase64 = (filepath: string) => {
  const bitmap = fs.readFileSync(filepath)
  return Buffer.from(bitmap).toString('base64')
}

const mdToHtml = (filepath: string) => {
  const content = fs.readFileSync(filepath, 'utf8')
  const processor = remark().use(remarkGfm).use(remarkHtml)
  return processor.processSync(content).toString()
}

const inlineImages = (html: string, baseDir: string) => {
  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRewrite, {
      rewrite: (node) => {
        if (node.type === 'element' && node.tagName === 'img' && node.properties?.src) {
          const src = String(node.properties.src)
          const absolutePath = path.join(baseDir, src)

          // eslint-disable-next-line no-param-reassign
          node.properties.src = `data:image/png;base64,${fileToBase64(absolutePath)}`
        }
      }
    })
    .use(rehypeStringify)

  return processor.processSync(html).toString()
}

const markdownLoader = () => {
  const mdRegex = /\.md$/
  return {
    name: 'vite-markdown-to-html-with-images',

    async load(filepath: string) {
      if (!filepath.match(mdRegex)) {
        return null
      }

      const html = mdToHtml(filepath)
      const inlinedHtml = inlineImages(html, path.dirname(filepath))

      return `export default \`${inlinedHtml}\``
    }
  }
}

export default defineConfig({
  // pass your local crate path to the plugin
  plugins: [
    wasm(), // adds wasm support
    wasmPack('./gb-web'), // loads wasm module
    wasmPack('./debugger-web'), // loads wasm module
    svgr(), // adds support for SVG -> React components
    react(), // adds react support
    markdownLoader() // adds support for markdown -> html
  ],
  build: {
    outDir: 'public',
    assetsDir: 'feather-gb/assets',
    target: 'esnext'
  },
  assetsInclude: ['**/*.gb', '**/*.gbc', '**/*.png'],
  define: {
    USE_HASH_ROUTER: process.env.USE_HASH_ROUTER
  }
})
