import { useState, useEffect } from 'react'
import { loadRunData } from '../Utils/dataLoader'
import { decompressGameData } from '../Utils/gameState'

export const useGameState = (cookies, setCookie, setShowStats) => {
  const [runs, setRuns] = useState([]);
  const [targetRun, setTargetRun] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    (async () => {
      const rows = await loadRunData();
      setRuns(rows);

      const today = new Date().toISOString().split('T')[0];
      const savedState = cookies.panodle_state;

      if (savedState && savedState.d === today) {
        const decompressedGuesses = decompressGameData(savedState.g);
        setGuesses(decompressedGuesses);
        setGameWon(savedState.w);
        setTargetRun(rows.find(run => run.Name === savedState.t));
        setAttempts(savedState.g.length);
        if (savedState.w) {
          setShowStats(prev => prev === null? true : prev);
        }
      } else {
        if (!targetRun) {
          const randomRun = rows[Math.floor(Math.random() * rows.length)];
          setTargetRun(randomRun);
        }
        setCookie('panodle_state', '', { path: '/', expires: new Date(0) });
      }
    })();
  }, [setCookie, cookies.panodle_state, setShowStats, targetRun]);

  return {
    runs,
    targetRun,
    guesses,
    setGuesses,
    gameWon,
    setGameWon,
    attempts,
    setAttempts
  };
};