import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Papa from "papaparse";
import RunsData from "./runs.csv";
import StatsModal from './Components/StatsModal';
import GuessHistory from "./Components/GuessHistory"
import { getHigherOrLowerDifficulty, compareFeatures } from "./Utils/gameLogic"

const App = () => {
  const [cookies, setCookie] = useCookies(['panodle_attempts', 'panodle_state']);
  const [runs, setRuns] = useState([]);
  const [targetRun, setTargetRun] = useState(null);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const saveGameState = (newGuesses, won = false) => {
    const today = new Date().toISOString().split('T')[0];
    setCookie('panodle_state', {
      date: today,
      guesses: newGuesses,
      won: won,
      targetRun: targetRun
    }, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });
  };

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

      const today = new Date().toISOString().split('T')[0];
      const savedState = cookies.panodle_state;

      if (savedState && savedState.date === today) {
        setGuesses(savedState.guesses);
        setGameWon(savedState.won);
        setTargetRun(savedState.targetRun);
        setAttempts(savedState.guesses.length);
        if (savedState.won) {
          setShowStats(true);
        }
      } else {
        const randomRun = rows[Math.floor(Math.random() * rows.length)];
        setTargetRun(randomRun);
        setCookie('panodle_state', '', { path: '/', expires: new Date(0) });
      }
    })();
  }, [setCookie]);

  const saveAttemptToCookie = (attempts) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const existingData = cookies.panodle_attempts || {};
    
    existingData[todayStr] = attempts;
    
    const sortedDates = Object.keys(existingData).sort().reverse();
    const last7Days = {};
    
    sortedDates.slice(0, 7).forEach(date => {
      last7Days[date] = existingData[date];
    });
    
    setCookie('panodle_attempts', last7Days, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'strict'
    });
  };

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
      saveGameState(newGuesses, true);
      const today = new Date().toISOString().split('T')[0];
      const existingAttempts = cookies.panodle_attempts || {};
      setCookie('panodle_attempts', {
        ...existingAttempts,
        [today]: newAttempts
      }, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
    } else {
      saveGameState(newGuesses, false);
    }
  };

  return (
    <div className="max-w-4xl mt-12 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          <span className="text-blue-400">Pano</span>dle
        </h1>
      </div>

      <div className="relative">
        <input
          type="text"
          value={guess}
          onChange={handleInputChange}
          placeholder="Enter a run name..."
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={gameWon}
        />
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button 
        onClick={handleGuess} 
        disabled={!guess || gameWon}
        className="w-full bg-blue-500 text-white mb-4 py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Submit Guess
      </button>

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