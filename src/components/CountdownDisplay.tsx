import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Settings } from 'lucide-react';
import { useTimerApp } from '../contexts/TimerAppContext';

const CountdownDisplay: React.FC = () => {
  const { countdownDuration, setCountdownDuration, isExpanded, setIsExpanded } = useTimerApp();
  const [remainingTime, setRemainingTime] = useState(countdownDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);
  
  // Setup timer values on initial load and when countdownDuration changes
  useEffect(() => {
    const totalSeconds = countdownDuration;
    const calculatedHours = Math.floor(totalSeconds / 3600);
    const calculatedMinutes = Math.floor((totalSeconds % 3600) / 60);
    const calculatedSeconds = totalSeconds % 60;
    
    setHours(calculatedHours);
    setMinutes(calculatedMinutes);
    setSeconds(calculatedSeconds);
    setRemainingTime(totalSeconds);
  }, [countdownDuration]);
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const startCountdown = () => {
    if (!isRunning && remainingTime > 0) {
      setIsRunning(true);
      intervalRef.current = window.setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      pauseCountdown();
    }
  };
  
  const pauseCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };
  
  const resetCountdown = () => {
    pauseCountdown();
    setRemainingTime(countdownDuration);
  };
  
  const saveCountdownSettings = () => {
    const newDuration = hours * 3600 + minutes * 60 + seconds;
    setCountdownDuration(newDuration);
    setRemainingTime(newDuration);
    setIsEditing(false);
  };
  
  const handleCountdownClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };
  
  // Format remaining time for display
  const displayHours = Math.floor(remainingTime / 3600);
  const displayMinutes = Math.floor((remainingTime % 3600) / 60);
  const displaySeconds = remainingTime % 60;
  
  // Calculate progress percentage
  const progress = countdownDuration > 0 
    ? ((countdownDuration - remainingTime) / countdownDuration) * 100 
    : 0;
  
  return (
    <div 
      className={`
        flex flex-col items-center w-full max-w-4xl mx-auto p-4 md:p-8
        transition-all duration-500 ease-in-out
        ${isExpanded ? 'scale-100' : 'scale-90 hover:scale-95 cursor-pointer'}
      `}
      onClick={!isExpanded ? handleCountdownClick : undefined}
    >
      <div 
        className={`
          rounded-3xl bg-white/10 backdrop-blur-sm shadow-2xl overflow-hidden
          transition-all duration-500 ease-in-out w-full
          ${isExpanded ? 'p-8 md:p-12' : 'p-6'}
        `}
      >
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">Countdown Timer</h2>
        </div>
        
        {isEditing ? (
          <div className="bg-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-medium mb-4">Set Timer</h3>
            <div className="flex gap-4 justify-center mb-6">
              <div className="flex flex-col items-center">
                <label className="text-sm mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="w-16 p-2 text-center bg-white/20 rounded-lg text-white text-xl"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-sm mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="w-16 p-2 text-center bg-white/20 rounded-lg text-white text-xl"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-sm mb-1">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  className="w-16 p-2 text-center bg-white/20 rounded-lg text-white text-xl"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={saveCountdownSettings}
                className="px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md h-4 bg-white/10 rounded-full mb-8 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-white/30 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="text-center mb-6 md:mb-10">
              <div className="flex items-baseline justify-center">
                {displayHours > 0 && (
                  <>
                    <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-shadow">
                      {String(displayHours).padStart(2, '0')}
                    </span>
                    <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mx-2">:</span>
                  </>
                )}
                <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-shadow">
                  {String(displayMinutes).padStart(2, '0')}
                </span>
                <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mx-2">:</span>
                <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-shadow">
                  {String(displaySeconds).padStart(2, '0')}
                </span>
              </div>
            </div>
            
            <div className="flex gap-4 mb-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startCountdown();
                }}
                className={`
                  flex items-center justify-center w-16 h-16 rounded-full backdrop-blur-sm transition-all
                  ${remainingTime > 0 ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 cursor-not-allowed'}
                `}
                disabled={remainingTime <= 0}
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetCountdown();
                }}
                className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
              >
                <RefreshCw size={24} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  pauseCountdown();
                  setIsEditing(true);
                }}
                className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
              >
                <Settings size={24} />
              </button>
            </div>
          </div>
        )}
        
        {isExpanded && !isEditing && (
          <div className="text-center">
            <p className="opacity-70">
              {remainingTime === 0 
                ? "Time's up!" 
                : `Time remaining until ${new Date(Date.now() + remainingTime * 1000).toLocaleTimeString()}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownDisplay;