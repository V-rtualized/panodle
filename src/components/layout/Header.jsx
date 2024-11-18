import React from 'react'
import ThemeToggle from './ThemeToggle'
import AuthButton from '../auth/AuthButton'
import { Map, Eye, EyeOff } from 'lucide-react'
import { useCookies } from 'react-cookie'
import { MAX_GUESSES, COOKIE_NAMES } from '../../utils/constants'

const FeatureTag = ({ feature, children, color }) => (
  <span className="inline-block text-primary px-3 py-1 text-sm font-semibold mr-2 mb-2">
    <span
      style={{ backgroundColor: color }}
      className={`text-white rounded-full px-3 py-1`}
    >
      {feature}
    </span>{' '}
    - {children}
  </span>
)

const Header = ({ daily, attempts }) => {
  const [cookies, setCookie] = useCookies([COOKIE_NAMES.FEATURES])
  const showFeatures = cookies.panodle_show_features ?? true

  const toggleFeatures = () => {
    setCookie(COOKIE_NAMES.FEATURES, !showFeatures, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  const openZoneMap = () => {
    window.open(
      'https://github.com/V-rtualized/panodle/blob/main/zone_map.png',
      '_blank'
    )
  }

  return (
    <div className="mb-6">
      <div className="w-full flex justify-between mb-6">
        <ThemeToggle />
        <AuthButton />
      </div>

      <h1 className="text-2xl font-bold text-center mb-4">
        <span className="text-pano">Pano</span>dle
      </h1>
      <h2 className="text-xl text-center">
        {daily ? 'Daily Run' : 'Random Run'}
      </h2>

      {!daily && (
        <div className="my-2 text-center">
          <p className="text-sm italic">
            This run's progress will not be saved between sessions or to your
            run history
          </p>
        </div>
      )}

      <div className="my-4 text-center">
        {MAX_GUESSES - attempts <= 5 && (
          <p className="text-sm text-red-950 dark:text-red-500">
            Guesses remaining: {MAX_GUESSES - attempts}
          </p>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={openZoneMap}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <Map className="w-4 h-4" />
          Open Zone Map
        </button>
        <button
          onClick={toggleFeatures}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          {showFeatures ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Features
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Features
            </>
          )}
        </button>
      </div>

      {showFeatures && (
        <div className="mt-4 text-center">
          <FeatureTag feature="Moguls" color="blue">
            At least some part of the run usually has moguls on it
          </FeatureTag>
          <FeatureTag feature="Trees" color="green">
            The run requires you to avoid trees
          </FeatureTag>
          <FeatureTag feature="Cliffs" color="red">
            The run requires you to avoid cliffs
          </FeatureTag>
          <FeatureTag feature="Cat Track" color="purple">
            At least some part of the run is a cat track
          </FeatureTag>
          <FeatureTag feature="Terrain Park" color="orange">
            At least some part of the run is a terrain park or has been a
            terrain park in past seasons
          </FeatureTag>
          <FeatureTag feature="X" color="black">
            The run has none of the above features
          </FeatureTag>
        </div>
      )}
    </div>
  )
}

export default Header
