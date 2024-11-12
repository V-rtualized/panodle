export const compressGameData = (guesses) => {
  return guesses.map((guess) => ({
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
  }))
}

export const decompressGameData = (compressedGuesses) => {
  return compressedGuesses.map((guess) => ({
    run: {
      Name: guess.n,
      Lift: guess.l,
      Zone: guess.z,
      Difficulty: guess.d,
      Features: guess.f,
      Length: parseInt(guess.ln),
      StartingElevation: parseInt(guess.s),
      EndingElevation: parseInt(guess.e),
    },
    comparison: {
      Name: guess.n,
      Lift: guess.c.l === 'c' ? 'correct' : 'incorrect',
      Zone: guess.c.z === 'c' ? 'correct' : 'incorrect',
      Difficulty:
        guess.c.d === 'c' ? 'correct' : guess.c.d === 'h' ? 'higher' : 'lower',
      Features:
        guess.c.f === 'c'
          ? 'correct'
          : guess.c.f === 'p'
            ? 'partial'
            : 'incorrect',
      Length:
        guess.c.ln === 'c'
          ? 'correct'
          : guess.c.ln === 'h'
            ? 'higher'
            : 'lower',
      StartingElevation:
        guess.c.s === 'c' ? 'correct' : guess.c.s === 'h' ? 'higher' : 'lower',
      EndingElevation:
        guess.c.e === 'c' ? 'correct' : guess.c.e === 'h' ? 'higher' : 'lower',
    },
  }))
}

export const saveGameState = (
  setCookie,
  targetRun,
  newGuesses,
  won = false,
  lost = false
) => {
  const today = new Date().toISOString().split('T')[0]
  setCookie(
    'panodle_state',
    {
      d: today,
      g: compressGameData(newGuesses),
      w: won,
      l: lost,
      t: targetRun.Name,
    },
    {
      path: '/',
      sameSite: true,
      maxAge: 60 * 60 * 24 * 7,
    }
  )
}

export const saveAttempts = (setCookie, cookies, newAttempts) => {
  const today = new Date().toISOString().split('T')[0]
  const existingAttempts = cookies.panodle_attempts || {}
  setCookie(
    'panodle_attempts',
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
