import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { useTimerApp } from '../contexts/TimerAppContext';
import { formatTime } from '../utils/timeUtils';
import { CACHE_KEYS, saveToCache, loadFromCache } from '../utils/cacheUtils';

interface StopwatchState {
  elapsedTime: number;
  laps: number[];
  isRunning: boolean;
}

const StopwatchDisplay: React.FC = () => {
  const [state, setState] = useState<StopwatchState>(() => 
    loadFromCache(CACHE_KEYS.STOPWATCH_STATE, {
      elapsedTime: 0,
      laps: [],
      isRunning: false
    })
  );
  const { isExpanded, setIsExpanded } = useTimerApp();
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Save state to cache
  useEffect(() => {
    saveToCache(CACHE_KEYS.STOPWATCH_STATE, state);
  }, [state]);

  // Robust timer logic using timestamps
  useEffect(() => {
    if (state.isRunning) {
      // If starting, set startTimeRef based on elapsedTime
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now() - state.elapsedTime;
      }
      intervalRef.current = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          elapsedTime: Date.now() - (startTimeRef.current || Date.now())
        }));
      }, 10);
    } else {
      // When stopped, clear interval and reset startTimeRef
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      startTimeRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning]);

  // Handle tab visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && state.isRunning && startTimeRef.current) {
        setState(prev => ({
          ...prev,
          elapsedTime: Date.now() - (startTimeRef.current || Date.now())
        }));
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [state.isRunning]);

  const startStopwatch = () => {
    setState(prev => ({
      ...prev,
      isRunning: !prev.isRunning
    }));
  };

  const resetStopwatch = () => {
    setState({
      elapsedTime: 0,
      laps: [],
      isRunning: false
    });
  };

  const addLap = () => {
    if (state.isRunning) {
      setState(prev => ({
        ...prev,
        laps: [prev.elapsedTime, ...prev.laps]
      }));
    }
  };

  const handleStopwatchClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const { hours, minutes, seconds, milliseconds } = formatTime(state.elapsedTime);

  return (
    <div 
      className={`
        flex flex-col items-center w-full max-w-4xl mx-auto p-4 md:p-8
        transition-all duration-500 ease-in-out
        ${isExpanded ? 'scale-100' : 'scale-90 hover:scale-95 cursor-pointer'}
      `}
      onClick={!isExpanded ? handleStopwatchClick : undefined}
    >
      <div 
        className={`
          rounded-3xl bg-white/10 backdrop-blur-sm shadow-2xl overflow-hidden
          transition-all duration-500 ease-in-out w-full
          ${isExpanded ? 'p-8 md:p-12' : 'p-6'}
        `}
      >
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">Stopwatch</h2>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-center mb-6 md:mb-10">
            <div className="flex items-baseline justify-center">
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-shadow">
                {hours > 0 ? `${hours}:` : ''}
                {String(minutes).padStart(2, '0')}
              </span>
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mx-2">:</span>
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-shadow">
                {String(seconds).padStart(2, '0')}
              </span>
              <span className="text-3xl md:text-4xl font-medium text-white ml-2 opacity-80">
                .{String(milliseconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          
          <div className="flex gap-4 mb-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startStopwatch();
              }}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
            >
              {state.isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetStopwatch();
              }}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
            >
              <RefreshCw size={24} />
            </button>
            
            {isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addLap();
                }}
                className={`
                  flex items-center justify-center w-16 h-16 rounded-full 
                  transition-all ${state.isRunning ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 cursor-not-allowed'}
                `}
                disabled={!state.isRunning}
              >
                <span className="font-medium">Lap</span>
              </button>
            )}
          </div>
          
          {isExpanded && state.laps.length > 0 && (
            <div className="w-full max-h-60 overflow-y-auto rounded-xl bg-black/10 backdrop-blur-sm p-4">
              <h3 className="text-lg font-medium mb-2">Laps</h3>
              <ul className="space-y-2">
                {state.laps.map((lapTime, index) => {
                  const { hours: lapHours, minutes: lapMinutes, seconds: lapSeconds, milliseconds: lapMilliseconds } = formatTime(lapTime);
                  return (
                    <li key={index} className="flex justify-between p-2 border-b border-white/10">
                      <span>Lap {state.laps.length - index}</span>
                      <span>
                        {lapHours > 0 ? `${lapHours}:` : ''}
                        {String(lapMinutes).padStart(2, '0')}:
                        {String(lapSeconds).padStart(2, '0')}.
                        {String(lapMilliseconds).padStart(2, '0')}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StopwatchDisplay;