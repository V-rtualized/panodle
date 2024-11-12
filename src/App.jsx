import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import Header from './Components/Header'
import RunInput from './Components/RunInput'
import SubmitButton from './Components/SubmitButton'
import WinModal from './Components/WinModal'
import GuessHistory from './Components/GuessHistory'
import { useGameState } from './Hooks/useGameState'
import { useGuessInput } from './Hooks/useGuessInput'
import LossModal from './Components/LossModal'
import ThemeToggle from './Components/ThemeToggle'

const MAX_GUESSES = 15

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    'panodle_attempts',
    'panodle_state',
  ])
  const [showWinModal, setShowWinModal] = useState(null)
  const [showLossModal, setShowLossModal] = useState(null)

  const { runs, targetRun, guesses, gameEnded, attempts, handleGuess } =
    useGameState(
      cookies,
      setCookie,
      removeCookie,
      MAX_GUESSES,
      setShowWinModal,
      setShowLossModal
    )

  const {
    guess,
    setGuess,
    suggestions,
    handleInputChange,
    handleSuggestionClick,
  } = useGuessInput(runs)

  return (
    <div className="min-h-screen h-full w-full bg-white dark:bg-slate-900 text-black dark:text-white py-12 cursor-default">
      <div className="max-w-4xl mx-auto p-6 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-lg">
        <ThemeToggle />
        <Header />

        <div className="mb-4 text-center">
          {MAX_GUESSES - attempts <= 5 && (
            <p className="text-sm text-red-950 dark:text-red-500">
              Guesses remaining: {MAX_GUESSES - attempts}
            </p>
          )}
        </div>

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
        />

        <LossModal
          isOpen={showLossModal}
          onClose={() => setShowLossModal(false)}
          targetRun={targetRun}
        />
      </div>
    </div>
  )
}

export default App
