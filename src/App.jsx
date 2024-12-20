import React, { useState } from 'react'
import Header from './components/layout/Header'
import RunInput from './components/layout/RunInput'
import SubmitButton from './components/layout/SubmitButton'
import WinModal from './components/game/modals/WinModal'
import GuessHistory from './components/game/GuessHistory/GuessHistory'
import { useGameState, useGuessInput } from './hooks'
import LossModal from './components/game/modals/LossModal'

const App = () => {
  const [showWinModal, setShowWinModal] = useState(null)
  const [showLossModal, setShowLossModal] = useState(null)
  const [daily, setDaily] = useState(true)

  const { targetRun, guesses, gameEnded, attempts, handleGuess, doRandomRun } =
    useGameState(setShowWinModal, setShowLossModal, daily)

  const {
    guess,
    setGuess,
    suggestions,
    handleInputChange,
    handleSuggestionClick,
  } = useGuessInput()

  return (
    <div className="px-2 min-h-screen h-full w-full bg-white dark:bg-slate-900 text-black dark:text-white py-12 cursor-default">
      <div className="max-w-4xl mx-auto p-6 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-lg">
        <Header daily={daily} attempts={attempts} />

        <RunInput
          guess={guess}
          onGuessChange={handleInputChange}
          onSuggestionClick={handleSuggestionClick}
          suggestions={suggestions}
          disabled={gameEnded}
        />

        <SubmitButton
          onClick={() => handleGuess(guess, setGuess)}
          disabled={!guess || gameEnded}
        />

        <GuessHistory guesses={guesses} />

        <WinModal
          isOpen={showWinModal}
          onClose={() => setShowWinModal(false)}
          attempts={attempts}
          targetRun={targetRun}
          daily={daily}
          doRandomRun={() => {
            setDaily(false)
            doRandomRun()
          }}
        />

        <LossModal
          isOpen={showLossModal}
          onClose={() => setShowLossModal(false)}
          targetRun={targetRun}
          daily={daily}
          doRandomRun={() => {
            setDaily(false)
            doRandomRun()
          }}
        />

        <div className="text-slate-500 px-6">
          <p className="py-1">
            * Some newer runs may be missing due to lack of data such as "Wild
            Things", "Evasion", "Yeti", and "Paranormal."
          </p>
          <p className="py-1">
            * The "Lift" property usually means the lowest lift that can be used
            to access a given run, but in cases like "Fritz" or "Picture
            Perfect" the data is opinionated.
          </p>
          <p className="py-1">
            * The "Zone" property usually corrosponds to which zone a majority
            of the run is contained in, see{' '}
            <a
              className="underline text-pano"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/V-rtualized/panodle/blob/main/zone_map.png"
            >
              this map
            </a>{' '}
            for zone coverage.
          </p>
          <p className="py-1">
            * Some runs have multiple difficulties at different points on the
            mountain, their difficulty in this game will always be listed as the
            higher of the two.
          </p>
          <p className="py-1">
            * The "Features" property is very opinionated and a run's features
            can change within a ski season, if you feel they don't represent the
            actual run please{' '}
            <a
              className="underline text-pano"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/V-rtualized/panodle/issues"
            >
              open an issue here.
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
