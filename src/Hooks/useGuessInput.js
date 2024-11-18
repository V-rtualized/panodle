import { useState } from 'react'
import Runs from '../runs.json'

export const useGuessInput = () => {
  const [guess, setGuess] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const handleInputChange = (e) => {
    const input = e.target.value
    setGuess(input)

    if (input.length > 0) {
      const filtered = Runs.filter((run) =>
        run.name.toLowerCase().includes(input.toLowerCase())
      ).map((run) => run)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setGuess(suggestion.name)
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
