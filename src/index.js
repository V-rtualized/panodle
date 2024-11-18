import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { CookiesProvider } from 'react-cookie'
import { AuthProvider } from './Contexts/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </AuthProvider>
  </React.StrictMode>
)
