import React from 'react';
import Navbar from '../components/Navbar';
import ClockDisplay from '../components/ClockDisplay';
import StopwatchDisplay from '../components/StopwatchDisplay';
import CountdownDisplay from '../components/CountdownDisplay';
import ModeSwitcher from '../components/ModeSwitcher';
import Footer from '../components/Footer';
import StickyNote from '../components/StickyNote';
import { useTimerApp } from '../contexts/TimerAppContext';

const TimerView: React.FC = () => {
  const { activeMode, isExpanded } = useTimerApp();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Sticky Note (top right corner) */}
      <div style={{ position: 'fixed', top: 24, right: 24 }}>
        <StickyNote />
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Main Content Area */}
        <div className={`
          flex-1 flex items-center justify-center transition-all duration-500 ease-in-out
          ${isExpanded ? 'scale-100' : 'scale-100'}
          ${activeMode !== 'clock' && isExpanded ? 'md:w-full' : 'md:w-1/2'}
        `}>
          {activeMode === 'clock' && <ClockDisplay />}
          {activeMode === 'stopwatch' && <StopwatchDisplay />}
          {activeMode === 'countdown' && <CountdownDisplay />}
        </div>
        
        {/* Mode Switcher Area (only visible when not expanded) */}
        {!isExpanded && (
          <div className="flex-1 flex items-center justify-center md:w-1/2">
            <ModeSwitcher />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TimerView;