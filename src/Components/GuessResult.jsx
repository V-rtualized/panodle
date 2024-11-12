import React from 'react'
import ComparisonIcon from './ComparisonIcon'

const GuessResult = ({ guessResult }) => {
  return (
    <div className="border dark:border-stone-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
      <div className="font-bold mb-2">{guessResult.run.Name}</div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(guessResult.comparison)
          .filter(([key]) => key !== 'Name')
          .map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="font-medium">{key}:</span>
              <ComparisonIcon comparison={value} />
            </div>
          ))}
      </div>
    </div>
  )
}

export default GuessResult
