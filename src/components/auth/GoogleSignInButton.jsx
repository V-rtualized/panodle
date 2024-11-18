import React, { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID

const GoogleSignInButton = () => {
  const { signIn } = useAuth()

  const handleSignInWithGoogle = async (response) => {
    const { error } = await signIn(response)
    if (error) {
      console.error('Sign in error:', error)
    }
  }

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }

    loadGoogleScript()

    const initializeGoogleSignIn = async () => {
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleSignInWithGoogle,
        auto_select: true,
        itp_support: true,
      })

      window.google?.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          type: 'standard',
          shape: 'pill',
          theme: 'outline',
          text: 'signin_with',
          size: 'large',
          logo_alignment: 'left',
        }
      )
    }

    const checkGoogleScript = setInterval(() => {
      if (window.google?.accounts) {
        clearInterval(checkGoogleScript)
        initializeGoogleSignIn()
      }
    }, 100)

    return () => {
      clearInterval(checkGoogleScript)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div id="google-signin-button"></div>
}

export default GoogleSignInButton
