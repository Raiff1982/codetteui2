import { useState, useEffect } from 'react';

export function useFirstTimeUser() {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showBeginnerTips, setShowBeginnerTips] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('codette-has-visited');
    const beginnerMode = localStorage.getItem('codette-beginner-mode');
    const tourComplete = localStorage.getItem('codette-tour-completed');
    
    if (!hasVisited) {
      setIsFirstTime(true);
      setShowBeginnerTips(true);
      localStorage.setItem('codette-has-visited', 'true');
    } else if (beginnerMode === 'true') {
      setShowBeginnerTips(true);
    }
    
    if (tourComplete === 'true') {
      setTourCompleted(true);
    }
  }, []);

  const completeTour = () => {
    setTourCompleted(true);
    localStorage.setItem('codette-tour-completed', 'true');
  };

  const enableBeginnerMode = () => {
    setShowBeginnerTips(true);
    localStorage.setItem('codette-beginner-mode', 'true');
  };

  const disableBeginnerMode = () => {
    setShowBeginnerTips(false);
    localStorage.setItem('codette-beginner-mode', 'false');
  };

  const resetFirstTimeExperience = () => {
    localStorage.removeItem('codette-has-visited');
    localStorage.removeItem('codette-beginner-mode');
    localStorage.removeItem('codette-tour-completed');
    setIsFirstTime(true);
    setShowBeginnerTips(true);
    setTourCompleted(false);
  };

  return {
    isFirstTime,
    showBeginnerTips,
    tourCompleted,
    completeTour,
    enableBeginnerMode,
    disableBeginnerMode,
    resetFirstTimeExperience
  };
}