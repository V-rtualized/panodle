import React, { useState, useEffect } from 'react';
import Papa from "papaparse";
import RunsData from "./runs.csv";
import { getHigherOrLowerDifficulty, compareFeatures } from './Utils/gameLogic';
import RunInput from './Components/RunInput';
import GuessHistory from './Components/GuessHistory';

const App = () => {
  const [runs, setRuns] = useState([]);
  const [targetRun, setTargetRun] = useState(null);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch(RunsData);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      const results = Papa.parse(csv, { header: true });
      const rows = results.data.map(v => ({
        ...v,
        Length: parseInt(v["Length"]),
        StartingElevation: parseInt(v["Starting Elevation"]),
        EndingElevation: parseInt(v["Ending Elevation"])
      }));
      setRuns(rows);
      const randomRun = rows[Math.floor(Math.random() * rows.length)];
      setTargetRun(randomRun);
    })();
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setGuess(input);
    
    if (input.length > 0) {
      const filtered = runs
        .filter(run => run.Name.toLowerCase().includes(input.toLowerCase()))
        .map(run => run.Name);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setGuess(suggestion);
    setSuggestions([]);
  };

  const handleGuess = () => {
    const guessedRun = runs.find(run => run.Name === guess);
    if (!guessedRun) return;

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

    setGuesses([guessResult, ...guesses]);
    setGuess('');
    
    if (guessedRun.Name === targetRun.Name) {
      setGameWon(true);
    }
  };

  return (
    <div className="max-w-4xl mt-12 mx-auto p-6 bg-white rounded-lg shadow-lg cursor-default">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          <span className="text-blue-400">Pano</span>dle
        </h1>
      </div>

      <div className="space-y-4">
        <RunInput
          guess={guess}
          onGuessChange={handleInputChange}
          onSuggestionClick={handleSuggestionClick}
          suggestions={suggestions}
          disabled={gameWon}
        />
        
        <button 
          onClick={handleGuess} 
          disabled={!guess || gameWon}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Submit Guess
        </button>

        {gameWon && (
          <div className="text-center text-green-500 font-bold py-2">
            Congratulations! You found the correct run!
          </div>
        )}

        <GuessHistory guesses={guesses} />
      </div>
    </div>
  );
};

export default App;