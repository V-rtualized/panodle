import { getHigherOrLowerDifficulty } from './difficultyUtils'
import { compareFeatures, getRelativeComparisonHelper } from './comparisonUtils'
import { COMPARISON_RESULTS } from '../constants'

export const getComparison = (guessedRun, targetRun) => {
  return {
    name: guessedRun.name,
    lift:
      guessedRun.lift === targetRun.lift
        ? COMPARISON_RESULTS.CORRECT
        : COMPARISON_RESULTS.INCORRECT,
    zone:
      guessedRun.zone === targetRun.zone
        ? COMPARISON_RESULTS.CORRECT
        : COMPARISON_RESULTS.INCORRECT,
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
