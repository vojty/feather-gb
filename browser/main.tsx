import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from './components/AppRouter'

import 'modern-normalize/modern-normalize.css'
import './assets/styles/main.css'

const root = document.getElementById('root')

ReactDOM.render(
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>,
  root
)
