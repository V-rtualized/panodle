import { useState, useEffect } from 'react'
import { loadRunData } from '../Utils/dataLoader'
import { getComparison } from '../Utils/gameLogic'
import dailyData from '../daily.json'
import {
  GAME_STATE_PREFIX,
  GUESS_PREFIX,
  clearOldGameState,
  loadGameState,
  loadGuesses,
  saveGameState,
  saveGuess,
  saveAttempts,
} from '../Utils/gameState'

export const useGameState = (
  cookies,
  setCookie,
  removeCookie,
  MAX_GUESSES,
  setShowWinModal,
  setShowLossModal,
  daily
) => {
  const [runs, setRuns] = useState([])
  const [targetRun, setTargetRun] = useState(null)
  const [guesses, setGuesses] = useState([])
  const [gameEnded, setGameEnded] = useState(false)
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

    // Save the new guess
    if (daily) saveGuess(setCookie, guessResult, newGuesses.length - 1)

    if (guessedRun.Name === targetRun.Name) {
      setGameEnded(true)
      setShowWinModal(true)
      if (daily) {
        saveGameState(setCookie, true, false)
        saveAttempts(setCookie, cookies, newAttempts)
      }
    } else if (newAttempts >= MAX_GUESSES) {
      setGameEnded(true)
      setShowLossModal(true)
      if (daily) saveGameState(setCookie, false, true)
    } else {
      if (daily) saveGameState(setCookie, false, false)
    }
  }

  const setupGame = () => {
    ;(async () => {
      const rows = await loadRunData()
      setRuns(rows)

      const date = new Date()
      date.setHours(date.getHours() - 7) // UTC to MST
      const today = date.toISOString().split('T')[0]
      clearOldGameState(cookies, removeCookie)

      if (dailyData[today]) {
        setTargetRun(rows.find((run) => run.Name === dailyData[today]))
      } else {
        if (!targetRun) {
          const randomRun = rows[Math.floor(Math.random() * rows.length)]
          setTargetRun(randomRun)
        }
      }

      const savedState = loadGameState(cookies, today)
      if (savedState && savedState.d === today) {
        const loadedGuesses = loadGuesses(cookies, today)
        setGuesses(loadedGuesses)
        setGameEnded(savedState.w || savedState.l)
        setAttempts(loadedGuesses.length)
        if (savedState.w) {
          setShowWinModal((prev) => (prev === null ? true : prev))
        } else if (savedState.l) {
          setShowLossModal((prev) => (prev === null ? true : prev))
        }
      } else {
        Object.keys(cookies)
          .filter(
            (key) =>
              key.startsWith(GAME_STATE_PREFIX) || key.startsWith(GUESS_PREFIX)
          )
          .forEach((key) => removeCookie(key, { path: '/' }))
      }
    })()
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(setupGame, [])

  const doRandomRun = async () => {
    const rows = await loadRunData()
    setRuns(rows)

    const randomRun = rows[Math.floor(Math.random() * rows.length)]
    setTargetRun(randomRun)
    setGuesses([])
    setGameEnded(false)
    setAttempts(0)
  }

  return {
    runs,
    targetRun,
    guesses,
    gameEnded,
    attempts,
    handleGuess,
    doRandomRun,
  }
}
