import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import Header from './Components/Header';
import RunInput from './Components/RunInput';
import SubmitButton from './Components/SubmitButton';
import StatsModal from './Components/StatsModal';
import GuessHistory from "./Components/GuessHistory";
import { getHigherOrLowerDifficulty, compareFeatures } from "./Utils/gameLogic";
import { saveGameState, saveAttempts } from './Utils/gameState';
import { useGameState } from './Hooks/useGameState';
import { useGuessInput } from './Hooks/useGuessInput';

const App = () => {
  const [cookies, setCookie] = useCookies(['panodle_attempts', 'panodle_state']);
  const [showStats, setShowStats] = useState(null);
  
  const {
    runs,
    targetRun,
    guesses,
    setGuesses,
    gameWon,
    setGameWon,
    attempts,
    setAttempts
  } = useGameState(cookies, setCookie, setShowStats);

  const {
    guess,
    setGuess,
    suggestions,
    handleInputChange,
    handleSuggestionClick
  } = useGuessInput(runs);

  const handleGuess = () => {
    const guessedRun = runs.find(run => run.Name === guess);
    if (!guessedRun) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const guessResult = {
      run: guessedRun,
      comparison: {
        Name: guessedRun.Name,
        Lift: guessedRun.Lift === targetRun.Lift ? 'correct' : 'incorrect',
        Zone: guessedRun.Zone === targetRun.Zone ? 'correct' : 'incorrect',
        Difficulty: getHigherOrLowerDifficulty(guessedRun.Difficulty, targetRun.Difficulty),
        Features: compareFeatures(guessedRun.Features, targetRun.Features),
        Length: guessedRun.Length === targetRun.Length ? 'correct' :
                guessedRun.Length < targetRun.Length ? 'higher' : 'lower',
        StartingElevation: guessedRun.StartingElevation === targetRun.StartingElevation ? 'correct' :
                          guessedRun.StartingElevation < targetRun.StartingElevation ? 'higher' : 'lower',
        EndingElevation: guessedRun.EndingElevation === targetRun.EndingElevation ? 'correct' :
                        guessedRun.EndingElevation < targetRun.EndingElevation ? 'higher' : 'lower'
      }
    };

    const newGuesses = [guessResult, ...guesses];
    setGuesses(newGuesses);
    setGuess('');
    
    if (guessedRun.Name === targetRun.Name) {
      setGameWon(true);
      setShowStats(true);
      saveGameState(setCookie, targetRun, newGuesses, true);
      saveAttempts(setCookie, cookies, newAttempts);
    } else {
      saveGameState(setCookie, targetRun, newGuesses, false);
    }
  };

  return (
    <div className="max-w-4xl mt-12 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Header />

      <RunInput
        guess={guess}
        onGuessChange={handleInputChange}
        onSuggestionClick={handleSuggestionClick}
        suggestions={suggestions}
        disabled={gameWon}
      />
      
      <SubmitButton 
        onClick={handleGuess}
        disabled={!guess || gameWon}
      />

      <GuessHistory guesses={guesses} />

      <StatsModal 
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        attempts={attempts}
      />
    </div>
  );
};

export default App;