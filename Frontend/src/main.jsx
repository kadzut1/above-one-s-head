import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './web-jsx/App.jsx'
import './web-scss/App.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
