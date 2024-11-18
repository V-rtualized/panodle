export const difficultyToNum = (difficulty) => {
  switch (difficulty) {
    case 'Green':
      return 0
    case 'Blue':
      return 1
    case 'Black':
      return 2
    case 'Double Black':
      return 3
    default:
      return 0
  }
}

export const getHigherOrLowerDifficulty = (guessed, target) => {
  const guessed_num = difficultyToNum(guessed)
  const target_num = difficultyToNum(target)
  return guessed_num === target_num
    ? 'correct'
    : guessed_num < target_num
      ? 'higher'
      : 'lower'
}

export const compareFeatures = (guessFeatures, targetFeatures) => {
  if (!guessFeatures && !targetFeatures) return 'correct'
  if (!guessFeatures || !targetFeatures) return 'incorrect'

  const guessSet = new Set(guessFeatures.split(', '))
  const targetSet = new Set(targetFeatures.split(', '))

  const intersection = [...guessSet].filter((x) => targetSet.has(x))

  if (
    intersection.length === guessSet.size &&
    intersection.length === targetSet.size
  ) {
    return 'correct'
  } else if (intersection.length > 0) {
    return 'partial'
  }
  return 'incorrect'
}

const getRelativeComparisonHelper = (value, target) => {
  if (value === target) {
    return 'correct'
  }
  if (value < target) {
    if (value < target * 0.75) {
      return 'mhigher'
    }
    return 'higher'
  }
  if (value > target * 1.5) {
    return 'mlower'
  }
  return 'lower'
}

export const getComparison = (guessedRun, targetRun) => {
  return {
    Name: guessedRun.Name,
    Lift: guessedRun.Lift === targetRun.Lift ? 'correct' : 'incorrect',
    Zone: guessedRun.Zone === targetRun.Zone ? 'correct' : 'incorrect',
    Difficulty: getHigherOrLowerDifficulty(
      guessedRun.Difficulty,
      targetRun.Difficulty
    ),
    Features: compareFeatures(guessedRun.Features, targetRun.Features),
    Length: getRelativeComparisonHelper(guessedRun.Length, targetRun.Length),
    StartingElevation: getRelativeComparisonHelper(
      guessedRun.StartingElevation - 1000,
      targetRun.StartingElevation - 1000
    ),
    EndingElevation: getRelativeComparisonHelper(
      guessedRun.EndingElevation - 1000,
      targetRun.EndingElevation - 1000
    ),
  }
}

export const getDateInMST = () => {
  const today = new Date()
  today.setHours(today.getHours() - 7)
  return today
}