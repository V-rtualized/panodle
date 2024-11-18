import { DIFFICULTY_LEVELS, COMPARISON_RESULTS } from '../constants'

export const difficultyToNum = (difficulty) => {
  switch (difficulty) {
    case DIFFICULTY_LEVELS.GREEN:
      return 0
    case DIFFICULTY_LEVELS.BLUE:
      return 1
    case DIFFICULTY_LEVELS.BLACK:
      return 2
    case DIFFICULTY_LEVELS.DOUBLE_BLACK:
      return 3
    default:
      return 0
  }
}

export const getHigherOrLowerDifficulty = (guessed, target) => {
  const guessedNum = difficultyToNum(guessed)
  const targetNum = difficultyToNum(target)
  return guessedNum === targetNum
    ? COMPARISON_RESULTS.CORRECT
    : guessedNum < targetNum
      ? COMPARISON_RESULTS.HIGHER
      : COMPARISON_RESULTS.LOWER
}
