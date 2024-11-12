import React from 'react'

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
        className="bg-white dark:bg-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pano"
        disabled={disabled}
      />
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white dark:bg-black border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RunInput
