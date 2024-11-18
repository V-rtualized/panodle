import { useState, useEffect } from 'react'
import { getDateInMST } from '../../utils/date/dateHelpers'
import { getComparison } from '../../utils/game/gameLogic'
import { useSupabase } from '../../contexts/SupabaseContext'
import {
  saveGameState,
  loadGameState,
  clearOldGameState,
} from '../../utils/game/gameState'
import { MAX_GUESSES, COOKIE_NAMES } from '../../utils/constants'
import { useCookies } from 'react-cookie'

const RUN_FIELDS = `
  name,
  lift,
  zone,
  difficulty,
  features,
  length,
  starting_elevation,
  ending_elevation
`

const fetchRunByName = async (supabase, name) => {
  const { data, error } = await supabase
    .from('runs')
    .select(RUN_FIELDS)
    .eq('name', name)
    .single()

  if (error) {
    console.error('Failed to fetch run:', error)
    return null
  }

  return data
}

export const useGameState = (setShowWinModal, setShowLossModal, daily) => {
  const supabase = useSupabase()
  const [targetRun, setTargetRun] = useState(null)
  const [guesses, setGuesses] = useState([])
  const [gameEnded, setGameEnded] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [cookies, setCookie, removeCookie] = useCookies([
    COOKIE_NAMES.GAME_STATE,
  ])

  const fetchDailyRun = async () => {
    const date = getDateInMST().toISOString().split('T')[0]

    try {
      const { data, error } = await supabase
        .from('daily_games')
        .select('target_run_name')
        .eq('date', date)
        .single()

      if (error || !data) return null

      return await fetchRunByName(supabase, data.target_run_name)
    } catch (error) {
      console.error('Error fetching daily run:', error)
      return null
    }
  }

  const fetchRandomRun = async () => {
    const { data: runs } = await supabase.from('runs').select('name')
    const randomRun = runs[Math.floor(Math.random() * runs.length)]
    return await fetchRunByName(supabase, randomRun.name)
  }

  const handleGuess = async (guess, setGuess) => {
    const guessedRun = await fetchRunByName(supabase, guess)

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

    const run = daily ? await fetchDailyRun() : await fetchRandomRun()

    if (!run) {
      console.error('Failed to fetch target run')
      return
    }

    setTargetRun(run)

    if (daily) {
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
  }

  useEffect(() => {
    setupGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const doRandomRun = async () => {
    const run = await fetchRandomRun()
    if (run) {
      setTargetRun(run)
      setGuesses([])
      setGameEnded(false)
      setAttempts(0)
    }
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
