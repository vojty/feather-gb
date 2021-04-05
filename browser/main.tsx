import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import { Root } from './components/Root'

import './assets/styles/main.css'

const root = document.getElementById('root')

const Router = ({ children }: { children: React.ReactNode }) => {
  // needed for gitlab pages, there is no way to use custom paths :/
  if (USE_HASH_ROUTER) {
    return <HashRouter>{children}</HashRouter>
  }
  return <BrowserRouter>{children}</BrowserRouter>
}

ReactDOM.render(
  <Router>
    <Root />
  </Router>,
  root
)