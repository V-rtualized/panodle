import {
  getComparison,
  getSecondsUntilMidnight,
  getTodayString,
} from './gameLogic'

const GAME_STATE_KEY = 'panodle_game_state'

export const saveGameState = (
  setCookie,
  guessedRunNames,
  won = false,
  lost = false
) => {
  const state = {
    date: getTodayString(),
    guesses: [...guessedRunNames],
    won,
    lost,
  }

  setCookie(GAME_STATE_KEY, state, {
    path: '/',
    maxAge: getSecondsUntilMidnight(),
    sameSite: 'lax',
  })
}

export const loadGameState = async (cookies, supabase, targetRun) => {
  const savedState = cookies[GAME_STATE_KEY]

  if (!savedState) {
    return {
      guesses: [],
      gameEnded: false,
      attempts: 0,
    }
  }

  if (savedState.date !== getTodayString()) {
    return {
      guesses: [],
      gameEnded: false,
      attempts: 0,
    }
  }

  try {
    const guesses = await Promise.all(
      savedState.guesses.map(async (runName) => {
        const { data: run, error } = await supabase
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
          .eq('name', runName)
          .single()

        if (error || !run) {
          console.error('Failed to fetch run:', runName, error)
          return null
        }

        return {
          run,
          comparison: getComparison(run, targetRun),
        }
      })
    )

    const validGuesses = guesses.filter(Boolean).reverse()

    return {
      guesses: validGuesses,
      gameEnded: savedState.won || savedState.lost,
      attempts: validGuesses.length,
    }
  } catch (e) {
    console.error('Failed to reconstruct game state:', e)
    return {
      guesses: [],
      gameEnded: false,
      attempts: 0,
    }
  }
}

export const clearOldGameState = (cookies, removeCookie) => {
  const savedState = cookies[GAME_STATE_KEY]
  if (!savedState) return

  if (savedState.date !== getTodayString()) {
    removeCookie(GAME_STATE_KEY, { path: '/' })
  }
}
