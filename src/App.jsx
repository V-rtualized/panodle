import React, { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon, CheckIcon, XIcon } from 'lucide-react';
import Papa from "papaparse";
import RunsData from "./runs.csv"

const difficultyToNum = (difficulty) => {
  switch (difficulty) {
    case "Green":
      return 0
    case "Blue":
      return 1
    case "Black":
      return 2
    case "Double Black":
      return 3
    default:
      return 0
  }
}

const getHigherOrLowerDifficulty = (guessed, target) => {
  const guessed_num = difficultyToNum(guessed)
  const target_num = difficultyToNum(target)
  return guessed_num === target_num ? 'correct' : guessed_num < target_num ? 'higher' : 'lower'
}

const SkiRunWordle = () => { 
  const [runs, setRuns] = useState([]);
  const [targetRun, setTargetRun] = useState(null);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch(RunsData)
      const reader = response.body.getReader()
      const result = await reader.read()
      const decoder = new TextDecoder('utf-8')
      const csv = decoder.decode(result.value)
      const results = Papa.parse(csv, { header: true })
      const rows = results.data.map(v => {
        return ({
        ...v,
        Length: parseInt(v["Length"]),
        StartingElevation: parseInt(v["Starting Elevation"]),
        EndingElevation: parseInt(v["Ending Elevation"])
      })});
      setRuns(rows)
      const randomRun = rows[Math.floor(Math.random() * rows.length)];
      setTargetRun(randomRun);
    })()
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

  const compareFeatures = (guessFeatures, targetFeatures) => {
    if (!guessFeatures && !targetFeatures) return 'correct';
    if (!guessFeatures || !targetFeatures) return 'incorrect';
    
    const guessSet = new Set(guessFeatures.split(', '));
    const targetSet = new Set(targetFeatures.split(', '));
    
    const intersection = [...guessSet].filter(x => targetSet.has(x));
    
    if (intersection.length === guessSet.size && intersection.length === targetSet.size) {
      return 'correct';
    } else if (intersection.length > 0) {
      return 'partial';
    }
    return 'incorrect';
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

  const getComparisonIcon = (comparison) => {
    switch (comparison) {
      case 'correct':
        return <CheckIcon className="text-green-500" size={16} />;
      case 'incorrect':
        return <XIcon className="text-red-500" size={16} />;
      case 'higher':
        return <ArrowUpIcon className="text-yellow-500" size={16} />;
      case 'lower':
        return <ArrowDownIcon className="text-yellow-500" size={16} />;
      case 'partial':
        return <div className="text-yellow-500">≈</div>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mt-12 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-4"><span class="text-blue-400">Pano</span>dle</h1>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={guess}
            onChange={handleInputChange}
            placeholder="Enter a run name..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Submit Guess
        </button>

        {gameWon && (
          <div className="text-center text-green-500 font-bold py-2">
            Congratulations! You found the correct run!
          </div>
        )}

        <div className="space-y-4">
          {guesses.map((guessResult, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="font-bold mb-2">{guessResult.run.Name}</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Lift:</span>
                  {getComparisonIcon(guessResult.comparison.Lift)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Zone:</span>
                  {getComparisonIcon(guessResult.comparison.Zone)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Difficulty:</span>
                  {getComparisonIcon(guessResult.comparison.Difficulty)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Features:</span>
                  {getComparisonIcon(guessResult.comparison.Features)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Length:</span>
                  {getComparisonIcon(guessResult.comparison.Length)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Starting Elevation:</span>
                  {getComparisonIcon(guessResult.comparison.StartingElevation)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Ending Elevation:</span>
                  {getComparisonIcon(guessResult.comparison.EndingElevation)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkiRunWordle;