import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const startAnalytics = () => import('./firebaseAnalytics.js')
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(startAnalytics, { timeout: 4000 })
} else {
  window.setTimeout(startAnalytics, 2500)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
