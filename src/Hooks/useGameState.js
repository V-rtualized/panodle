import { useState, useEffect } from 'react'
import { getComparison, getDateInMST } from '../Utils/gameLogic'
import { useSupabase } from '../Contexts/SupabaseContext'
import {
  saveGameState,
  loadGameState,
  clearOldGameState,
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
  const supabase = useSupabase()
  const [targetRun, setTargetRun] = useState(null)
  const [guesses, setGuesses] = useState([])
  const [gameEnded, setGameEnded] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const fetchDailyRun = async () => {
    const date = getDateInMST().toISOString().split('T')[0]

    try {
      const { data, error } = await supabase
        .from('daily_games')
        .select('target_run_name')
        .eq('date', date)
        .single()

      if (error || !data) return null

      const { data: run } = await supabase
        .from('runs')
        .select(
          `
          name,
          lift,
          zone,
          difficulty,
          features,
          length,
          starting_elevation,
          ending_elevation
        `
        )
        .eq('name', data.target_run_name)
        .single()

      return run
    } catch (error) {
      console.error('Error fetching daily run:', error)
      return null
    }
  }

  const handleGuess = async (guess, setGuess) => {
    const { data: guessedRun, error } = await supabase
      .from('runs')
      .select(
        `
        name,
        lift,
        zone,
        difficulty,
        features,
        length,
        starting_elevation,
        ending_elevation
      `
      )
      .eq('name', guess)
      .single()

    if (error || !guessedRun) {
      console.error('Failed to fetch guessed run:', error)
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    const guessResult = {
      run: guessedRun,
      comparison: getComparison(guessedRun, targetRun),
    }

    const newGuesses = [guessResult, ...guesses]
    setGuesses(newGuesses)
    setGuess('')

    if (daily) {
      const guessedRunNames = newGuesses.map((g) => g.run.name).reverse()
      const won = guessedRun.name === targetRun.name
      const lost = newAttempts >= MAX_GUESSES
      saveGameState(setCookie, guessedRunNames, won, lost)
    }

    if (guessedRun.name === targetRun.name) {
      setGameEnded(true)
      setShowWinModal(true)
    } else if (newAttempts >= MAX_GUESSES) {
      setGameEnded(true)
      setShowLossModal(true)
    }
  }

  const setupGame = async () => {
    clearOldGameState(cookies, removeCookie)

    let run
    if (daily) {
      run = await fetchDailyRun()
    } else {
      const { data: runs } = await supabase.from('runs').select('name')
      const randomRun = runs[Math.floor(Math.random() * runs.length)]
      const { data } = await supabase
        .from('runs')
        .select(
          `
          name,
          lift,
          zone,
          difficulty,
          features,
          length,
          starting_elevation,
          ending_elevation
        `
        )
        .eq('name', randomRun.name)
        .single()
      run = data
    }

    if (!run) {
      console.error('Failed to fetch target run')
      return
    }

    setTargetRun(run)

    const {
      guesses: savedGuesses,
      gameEnded: savedGameEnded,
      attempts: savedAttempts,
    } = await loadGameState(cookies, supabase, run)

    setGuesses(savedGuesses)
    setGameEnded(savedGameEnded)
    setAttempts(savedAttempts)

    if (savedGameEnded) {
      const won = savedGuesses[0]?.run.name === run.name
      if (won) {
        setShowWinModal((prev) => (prev === null ? true : prev))
      } else {
        setShowLossModal((prev) => (prev === null ? true : prev))
      }
    }
  }

  useEffect(() => {
    setupGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const doRandomRun = async () => {
    const { data: runs } = await supabase.from('runs').select('name')
    const randomRun = runs[Math.floor(Math.random() * runs.length)]
    const { data } = await supabase
      .from('runs')
      .select(
        `
        name,
        lift,
        zone,
        difficulty,
        features,
        length,
        starting_elevation,
        ending_elevation
      `
      )
      .eq('name', randomRun.name)
      .single()

    setTargetRun(data)
    setGuesses([])
    setGameEnded(false)
    setAttempts(0)
  }

  return {
    targetRun,
    guesses,
    gameEnded,
    attempts,
    handleGuess,
    doRandomRun,
  }
}
