import { useState } from 'react'

export const useGuessInput = (runs) => {
  const [guess, setGuess] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const handleInputChange = (e) => {
    const input = e.target.value
    setGuess(input)

    if (input.length > 0) {
      const filtered = runs
        .filter((run) => run.Name.toLowerCase().includes(input.toLowerCase()))
        .map((run) => run.Name)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setGuess(suggestion)
    setSuggestions([])
  }

  return {
    guess,
    setGuess,
    suggestions,
    setSuggestions,
    handleInputChange,
    handleSuggestionClick,
  }
}
