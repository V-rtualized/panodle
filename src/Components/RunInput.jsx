import React from 'react'
import DifficultyIcon from './DifficultyIcon'

const RunInput = ({
  guess,
  onGuessChange,
  onSuggestionClick,
  suggestions,
  disabled,
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={guess}
        onChange={onGuessChange}
        placeholder="Enter a run name..."
        className="bg-white dark:bg-black w-full px-4 py-2 border dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pano"
        disabled={disabled}
      />
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white dark:bg-black border dark:border-stone-600 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions
            .sort((a, b) => a.Name > b.Name)
            .map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                onClick={() => onSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-2">
                  <DifficultyIcon difficulty={suggestion.Difficulty} />
                  {suggestion.Name}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default RunInput
