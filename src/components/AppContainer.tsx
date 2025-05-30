import React, { ReactNode, useEffect } from 'react';
import { useTimerApp } from '../contexts/TimerAppContext';

interface AppContainerProps {
  children: ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  const { activeMode } = useTimerApp();

  useEffect(() => {
    if (activeMode === 'clock') {
      document.body.classList.add('home-mode');
    } else {
      document.body.classList.remove('home-mode');
    }
  }, [activeMode]);

  return (
    <div 
      className={`min-h-screen w-full transition-colors duration-1000 ease-in-out ${
        activeMode === 'stopwatch' 
          ? 'bg-gradient-to-br from-orange-400 to-orange-600' 
          : activeMode === 'countdown' 
            ? 'bg-gradient-to-br from-orange-500 to-orange-700'
            : 'bg-orange-500'
      }`}
    >
      {children}
    </div>
  );
};

export default AppContainer;