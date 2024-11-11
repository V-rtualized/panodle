import React from "react"
import GuessResult from "./GuessResult"

const GuessHistory = ({ guesses }) => {
  return (
    <div className="space-y-4">
      {guesses.map((guessResult, index) => (
        <GuessResult key={index} guessResult={guessResult} />
      ))}
    </div>
  );
};

export default GuessHistory