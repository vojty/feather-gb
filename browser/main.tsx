import './assets/styles/main.css'

import { BrowserRouter, HashRouter } from 'react-router-dom'
import 'unfonts.css' // this is a virtual CSS file created by `unplugin-fonts/vite`
import { createRoot } from 'react-dom/client'

import { Root } from './components/Root'

window.global ||= window

const container = document.getElementById('root')
if (!container) {
  throw new Error('No root element found')
}

// HashRouter is needed for gitlab pages, there is no way to use custom paths :/
const RouterComponent = USE_HASH_ROUTER ? HashRouter : BrowserRouter

const root = createRoot(container)
root.render(
  <RouterComponent>
    <Root />
  </RouterComponent>,
)
