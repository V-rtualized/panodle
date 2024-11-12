import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import Header from './Components/Header'
import RunInput from './Components/RunInput'
import SubmitButton from './Components/SubmitButton'
import StatsModal from './Components/StatsModal'
import GuessHistory from './Components/GuessHistory'
import { useGameState } from './Hooks/useGameState'
import { useGuessInput } from './Hooks/useGuessInput'
import LossModal from './Components/LossModal'

const MAX_GUESSES = 20

const App = () => {
  const [cookies, setCookie] = useCookies(['panodle_attempts', 'panodle_state'])
  const [showStats, setShowWinModal] = useState(null)
  const [showLossModal, setShowLossModal] = useState(null)

  const {
    runs,
    targetRun,
    guesses,
    gameWon,
    attempts,
    handleGuess
  } = useGameState(cookies, setCookie, MAX_GUESSES, setShowWinModal, setShowLossModal)

  const {
    guess,
    setGuess,
    suggestions,
    handleInputChange,
    handleSuggestionClick,
  } = useGuessInput(runs)


  return (
    <div className="max-w-4xl mt-12 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Header />

      <div className="mb-4 text-center">
        {MAX_GUESSES - attempts <= 5 && (
          <p className="text-sm text-red-950">
            Guesses remaining: {MAX_GUESSES - attempts}
          </p>
        )}
      </div>

      <RunInput
        guess={guess}
        onGuessChange={handleInputChange}
        onSuggestionClick={handleSuggestionClick}
        suggestions={suggestions}
        disabled={gameWon}
      />

      <SubmitButton onClick={() => handleGuess(guess, setGuess)} disabled={!guess || gameWon} />

      <GuessHistory guesses={guesses} />

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowWinModal(false)}
        attempts={attempts}
      />

      <LossModal
        isOpen={showLossModal}
        onClose={() => setShowLossModal(false)}
        targetRun={targetRun}
      />
    </div>
  )
}

export default App
