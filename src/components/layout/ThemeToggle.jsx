import { MoonIcon, SunIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { COOKIE_NAMES } from '../../utils/constants'

const ThemeToggle = () => {
  const [cookies, setCookie] = useCookies([COOKIE_NAMES.THEME])
  const [isDark, setIsDark] = useState(() => {
    if (cookies.panodle_theme) {
      return cookies.panodle_theme
    }
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    setCookie(COOKIE_NAMES.THEME, isDark, {
      path: '/',
      sameSite: true,
    })
  }, [isDark, setCookie])

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  )
}

export default ThemeToggle
