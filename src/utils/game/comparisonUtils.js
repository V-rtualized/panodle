import { COMPARISON_RESULTS } from '../constants'

export const compareFeatures = (guessFeatures, targetFeatures) => {
  if (!guessFeatures && !targetFeatures) return COMPARISON_RESULTS.CORRECT
  if (!guessFeatures || !targetFeatures) return COMPARISON_RESULTS.INCORRECT

  const guessSet = new Set(guessFeatures)
  const targetSet = new Set(targetFeatures)

  const intersection = [...guessSet].filter((x) => targetSet.has(x))

  if (
    intersection.length === guessSet.size &&
    intersection.length === targetSet.size
  ) {
    return COMPARISON_RESULTS.CORRECT
  }

  if (intersection.length > 0) {
    return COMPARISON_RESULTS.PARTIAL
  }

  return COMPARISON_RESULTS.INCORRECT
}

export const getRelativeComparisonHelper = (value, target) => {
  if (value === target) {
    return COMPARISON_RESULTS.CORRECT
  }
  if (value < target) {
    if (value < target * 0.75) {
      return COMPARISON_RESULTS.MUCH_HIGHER
    }
    return COMPARISON_RESULTS.HIGHER
  }
  if (value > target * 1.5) {
    return COMPARISON_RESULTS.MUCH_LOWER
  }
  return COMPARISON_RESULTS.LOWER
}
