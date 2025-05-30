import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CACHE_KEYS, saveToCache, loadFromCache } from '../utils/cacheUtils';

export type TimerMode = 'clock' | 'stopwatch' | 'countdown';

interface TimerAppContextType {
  activeMode: TimerMode;
  setActiveMode: (mode: TimerMode) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  countdownDuration: number;
  setCountdownDuration: (duration: number) => void;
}

const TimerAppContext = createContext<TimerAppContextType | undefined>(undefined);

interface TimerAppProviderProps {
  children: ReactNode;
}

export const TimerAppProvider: React.FC<TimerAppProviderProps> = ({ children }) => {
  const [activeMode, setActiveMode] = useState<TimerMode>(() => 
    loadFromCache(CACHE_KEYS.LAST_MODE, 'clock')
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [countdownDuration, setCountdownDuration] = useState(() => 
    loadFromCache(CACHE_KEYS.COUNTDOWN_DURATION, 60)
  );

  // Cache updates
  useEffect(() => {
    saveToCache(CACHE_KEYS.LAST_MODE, activeMode);
  }, [activeMode]);

  useEffect(() => {
    saveToCache(CACHE_KEYS.COUNTDOWN_DURATION, countdownDuration);
  }, [countdownDuration]);

  return (
    <TimerAppContext.Provider 
      value={{ 
        activeMode, 
        setActiveMode, 
        isExpanded, 
        setIsExpanded,
        countdownDuration,
        setCountdownDuration
      }}
    >
      {children}
    </TimerAppContext.Provider>
  );
};

export const useTimerApp = (): TimerAppContextType => {
  const context = useContext(TimerAppContext);
  
  if (context === undefined) {
    throw new Error('useTimerApp must be used within a TimerAppProvider');
  }
  
  return context;
};