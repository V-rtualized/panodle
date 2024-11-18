// components/GuessResult.js
import React from 'react'
import { ArrowUpIcon, ArrowDownIcon, CheckIcon } from 'lucide-react'
import ComparisonIcon from './ComparisonIcon'
import DifficultyIcon from './DifficultyIcon'

const LocationCell = ({ label, value, isCorrect }) => (
  <div className="flex-1">
    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
    <div
      className={`
      border rounded-md px-3 py-1 text-sm font-medium
      ${
        isCorrect
          ? 'border-green-500 text-green-700 dark:text-green-400'
          : 'border-red-500 text-red-700 dark:text-red-400'
      }
    `}
    >
      {value}
    </div>
  </div>
)

const DifficultyCell = ({ difficulty, comparison }) => (
  <div>
    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
      Difficulty
    </div>
    <div className="flex items-center gap-2">
      <DifficultyIcon difficulty={difficulty} />
      {comparison === 'correct' ? (
        <CheckIcon className="text-green-500" size={16} />
      ) : comparison === 'higher' ? (
        <ArrowUpIcon className="text-yellow-500" size={16} />
      ) : (
        <ArrowDownIcon className="text-yellow-500" size={16} />
      )}
    </div>
  </div>
)

const FeatureTag = ({ feature, status }) => (
  <span
    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium
    ${
      status === 'correct'
        ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-500'
        : status === 'partial'
          ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-500'
          : 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-500'
    }
  `}
  >
    {feature}
  </span>
)

const FeaturesCell = ({ features, comparison }) => {
  const featuresList = features.length > 0? features : ['X']

  return (
    <div className="flex-1">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        Features
      </div>
      <div className="flex flex-wrap gap-1">
        {featuresList.map((feature, index) => (
          <FeatureTag key={index} feature={feature} status={comparison} />
        ))}
      </div>
    </div>
  )
}

const MetricCell = ({ label, value, comparison }) => (
  <div>
    <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    <div className="flex items-center gap-1">
      <span className="font-medium dark:text-white">{value} m</span>
      <ComparisonIcon comparison={comparison} />
    </div>
  </div>
)

const GuessResult = ({ guessResult }) => {
  return (
    <div className="border dark:border-stone-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
      <div className="mb-4">
        <div className="font-bold dark:text-white">{guessResult.run.name}</div>
      </div>

      <div className="space-y-4">
        {/* Lift and Zone row */}
        <div className="flex gap-4">
          <LocationCell
            label="Lift"
            value={guessResult.run.lift}
            isCorrect={guessResult.comparison.lift === 'correct'}
          />
          <LocationCell
            label="Zone"
            value={guessResult.run.zone}
            isCorrect={guessResult.comparison.zone === 'correct'}
          />
        </div>

        {/* Difficulty and Features row */}
        <div className="flex gap-4">
          <div className="w-1/3">
            <DifficultyCell
              difficulty={guessResult.run.difficulty}
              comparison={guessResult.comparison.difficulty}
            />
          </div>
          <div className="w-2/3">
            <FeaturesCell
              features={guessResult.run.features}
              comparison={guessResult.comparison.features}
            />
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCell
            label="Length"
            value={guessResult.run.length}
            comparison={guessResult.comparison.length}
          />
          <MetricCell
            label="Starting Elevation"
            value={guessResult.run.starting_elevation}
            comparison={guessResult.comparison.starting_elevation}
          />
          <MetricCell
            label="Ending Elevation"
            value={guessResult.run.ending_elevation}
            comparison={guessResult.comparison.ending_elevation}
          />
        </div>
      </div>
    </div>
  )
}

export default GuessResult
