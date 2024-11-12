export const compressGuess = (guess) => ({
  n: guess.run.Name,
  l: guess.run.Lift,
  z: guess.run.Zone,
  d: guess.run.Difficulty,
  f: guess.run.Features,
  ln: guess.run.Length,
  s: guess.run.StartingElevation,
  e: guess.run.EndingElevation,
  c: {
    l: guess.comparison.Lift === 'correct' ? 'c' : 'i',
    z: guess.comparison.Zone === 'correct' ? 'c' : 'i',
    d: guess.comparison.Difficulty.charAt(0),
    f: guess.comparison.Features.charAt(0),
    ln: guess.comparison.Length.charAt(0),
    s: guess.comparison.StartingElevation.charAt(0),
    e: guess.comparison.EndingElevation.charAt(0),
  },
})

export const decompressGuess = (compressedGuess) => ({
  run: {
    Name: compressedGuess.n,
    Lift: compressedGuess.l,
    Zone: compressedGuess.z,
    Difficulty: compressedGuess.d,
    Features: compressedGuess.f,
    Length: parseInt(compressedGuess.ln),
    StartingElevation: parseInt(compressedGuess.s),
    EndingElevation: parseInt(compressedGuess.e),
  },
  comparison: {
    Name: compressedGuess.n,
    Lift: compressedGuess.c.l === 'c' ? 'correct' : 'incorrect',
    Zone: compressedGuess.c.z === 'c' ? 'correct' : 'incorrect',
    Difficulty:
      compressedGuess.c.d === 'c'
        ? 'correct'
        : compressedGuess.c.d === 'h'
          ? 'higher'
          : 'lower',
    Features:
      compressedGuess.c.f === 'c'
        ? 'correct'
        : compressedGuess.c.f === 'p'
          ? 'partial'
          : 'incorrect',
    Length:
      compressedGuess.c.ln === 'c'
        ? 'correct'
        : compressedGuess.c.ln === 'h'
          ? 'higher'
          : 'lower',
    StartingElevation:
      compressedGuess.c.s === 'c'
        ? 'correct'
        : compressedGuess.c.s === 'h'
          ? 'higher'
          : 'lower',
    EndingElevation:
      compressedGuess.c.e === 'c'
        ? 'correct'
        : compressedGuess.c.e === 'h'
          ? 'higher'
          : 'lower',
  },
})

export const GAME_STATE_PREFIX = 'panodle_game'
export const GUESS_PREFIX = 'panodle_guess'
const ATTEMPTS_KEY = 'panodle_attempts'

export const saveAttempts = (setCookie, cookies, newAttempts) => {
  const today = new Date().toISOString().split('T')[0]
  const existingAttempts = cookies[ATTEMPTS_KEY] || {}
  setCookie(
    ATTEMPTS_KEY,
    {
      ...existingAttempts,
      [today]: newAttempts,
    },
    {
      path: '/',
      sameSite: true,
      maxAge: 60 * 60 * 24 * 7,
    }
  )
}

export const saveGameState = (setCookie, won = false, lost = false) => {
  const today = new Date().toISOString().split('T')[0]
  setCookie(
    `${GAME_STATE_PREFIX}_${today}`,
    {
      d: today,
      w: won,
      l: lost,
    },
    {
      path: '/',
      sameSite: true,
      maxAge: 60 * 60 * 24 * 7,
    }
  )
}

export const saveGuess = (setCookie, guess, index) => {
  const today = new Date().toISOString().split('T')[0]
  setCookie(
    `${GUESS_PREFIX}_${today}_${index}`,
    {
      n: guess.run.Name,
      l: guess.run.Lift,
      z: guess.run.Zone,
      d: guess.run.Difficulty,
      f: guess.run.Features,
      ln: guess.run.Length,
      s: guess.run.StartingElevation,
      e: guess.run.EndingElevation,
      c: guess.comparison,
    },
    {
      path: '/',
      sameSite: true,
      maxAge: 60 * 60 * 24 * 7,
    }
  )
}

export const loadGameState = (cookies, today) => {
  const gameStateKey = `${GAME_STATE_PREFIX}_${today}`
  return cookies[gameStateKey]
}

export const loadGuesses = (cookies, today) => {
  const guesses = []
  let index = 0

  while (true) {
    const guessKey = `${GUESS_PREFIX}_${today}_${index}`
    const guess = cookies[guessKey]
    if (!guess) break

    guesses.push({
      run: {
        Name: guess.n,
        Lift: guess.l,
        Zone: guess.z,
        Difficulty: guess.d,
        Features: guess.f,
        Length: guess.ln,
        StartingElevation: guess.s,
        EndingElevation: guess.e,
      },
      comparison: guess.c,
    })
    index++
  }

  return guesses.reverse()
}

export const clearOldGameState = (cookies, removeCookie) => {
  const today = new Date().toISOString().split('T')[0]

  Object.keys(cookies).forEach((key) => {
    if (
      (key.startsWith(GAME_STATE_PREFIX) || key.startsWith(GUESS_PREFIX)) &&
      !key.includes(today)
    ) {
      removeCookie(key, { path: '/' })
    }
  })
}
