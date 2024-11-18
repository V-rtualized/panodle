import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { CookiesProvider } from 'react-cookie'
import { AuthProvider } from './contexts/AuthContext'
import { SupabaseProvider } from './contexts/SupabaseContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <SupabaseProvider>
      <AuthProvider>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </AuthProvider>
    </SupabaseProvider>
  </React.StrictMode>
)
