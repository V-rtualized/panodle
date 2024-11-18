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

  const guessSet = new Set(guessFeatures)
  const targetSet = new Set(targetFeatures)

  const intersection = [...guessSet].filter((x) => targetSet.has(x))

  if (
    intersection.length === guessSet.size &&
    intersection.length === targetSet.size
  ) {
    return 'correct'
  }

  if (intersection.length > 0) {
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
    name: guessedRun.name,
    lift: guessedRun.lift === targetRun.lift ? 'correct' : 'incorrect',
    zone: guessedRun.zone === targetRun.zone ? 'correct' : 'incorrect',
    difficulty: getHigherOrLowerDifficulty(
      guessedRun.difficulty,
      targetRun.difficulty
    ),
    features: compareFeatures(guessedRun.features, targetRun.features),
    length: getRelativeComparisonHelper(guessedRun.length, targetRun.length),
    starting_elevation: getRelativeComparisonHelper(
      guessedRun.starting_elevation - 1000,
      targetRun.starting_elevation - 1000
    ),
    ending_elevation: getRelativeComparisonHelper(
      guessedRun.ending_elevation - 1000,
      targetRun.ending_elevation - 1000
    ),
  }
}

export const getDateInMST = () => {
  const today = new Date()
  today.setHours(today.getHours() - 7)
  return today
}
