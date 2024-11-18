import React from 'react'
import { useAuth } from '../Contexts/AuthContext'
import GoogleSignInButton from './GoogleSignInButton'

const AuthButton = () => {
  const { user, signOut } = useAuth()

  if (user) {
    return (
      <div className="text-center">
        <span>
          Signed in as {user.user_metadata.full_name}.{' '}
          <button onClick={signOut} className="text-pano underline">
            Sign Out
          </button>
        </span>
      </div>
    )
  }
  return <GoogleSignInButton />
}

export default AuthButton
