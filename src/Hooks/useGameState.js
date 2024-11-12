import { useState, useEffect } from 'react'
import { loadRunData } from '../Utils/dataLoader'
import { decompressGameData } from '../Utils/gameState'
import { getComparison } from '../Utils/gameLogic'
import { saveGameState, saveAttempts } from '../Utils/gameState'
import dailyData from '../daily.json'

export const useGameState = (
  cookies,
  setCookie,
  MAX_GUESSES,
  setShowWinModal,
  setShowLossModal
) => {
  const [runs, setRuns] = useState([])
  const [targetRun, setTargetRun] = useState(null)
  const [guesses, setGuesses] = useState([])
  const [gameWon, setGameWon] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const handleGuess = (guess, setGuess) => {
    const guessedRun = runs.find((run) => run.Name === guess)
    if (!guessedRun) return

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    const guessResult = {
      run: guessedRun,
      comparison: getComparison(guessedRun, targetRun),
    }

    const newGuesses = [guessResult, ...guesses]
    setGuesses(newGuesses)
    setGuess('')

    if (guessedRun.Name === targetRun.Name) {
      setGameWon(true)
      setShowWinModal(true)
      saveGameState(setCookie, targetRun, newGuesses, true)
      saveAttempts(setCookie, cookies, newAttempts)
    } else if (newAttempts >= MAX_GUESSES) {
      setGameWon(true)
      setShowLossModal(true)
      saveGameState(setCookie, targetRun, newGuesses, false, true)
    } else {
      saveGameState(setCookie, targetRun, newGuesses, false)
    }
  }

  const setupGame = () => {
    ;(async () => {
      const rows = await loadRunData()
      setRuns(rows)

      const today = new Date().toISOString().split('T')[0]
      const savedState = cookies.panodle_state

      if (dailyData[today]) {
        setTargetRun(rows.find((run) => run.Name === dailyData[today]))
      } else {
        if (!targetRun) {
          const randomRun = rows[Math.floor(Math.random() * rows.length)]
          setTargetRun(randomRun)
        }
      }

      if (savedState && savedState.d === today) {
        const decompressedGuesses = decompressGameData(savedState.g)
        setGuesses(decompressedGuesses)
        setGameWon(savedState.w || savedState.l)
        setAttempts(savedState.g.length)
        if (savedState.w) {
          setShowWinModal((prev) => (prev === null ? true : prev))
        } else if (savedState.l) {
          setShowLossModal((prev) => (prev === null ? true : prev))
        }
      } else {
        setCookie('panodle_state', '', { path: '/', sameSite: true, expires: new Date(0) })
      }
    })()
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(setupGame, [])

  return {
    runs,
    targetRun,
    guesses,
    gameWon,
    attempts,
    handleGuess,
  }
}
