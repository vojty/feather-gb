import './assets/styles/main.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import { Root } from './components/Root'

// @ts-ignore
window.global ||= window

const root = document.getElementById('root')

// HashRouter is needed for gitlab pages, there is no way to use custom paths :/
const RouterComponent = USE_HASH_ROUTER ? HashRouter : BrowserRouter

ReactDOM.render(
  <RouterComponent>
    <Root />
  </RouterComponent>,
  root
)
