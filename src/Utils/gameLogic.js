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
