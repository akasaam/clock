import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Clock, ArrowLeft } from 'lucide-react';
import { useTimerApp } from '../contexts/TimerAppContext';

const Navbar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { activeMode, isExpanded, setIsExpanded, setActiveMode } = useTimerApp();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const indianTime = formatInTimeZone(currentTime, 'Asia/Kolkata', 'hh:mm:ss a');
  const indianDate = formatInTimeZone(currentTime, 'Asia/Kolkata', 'EEEE, MMMM do, yyyy');
  
  return (
    <nav className={`
      flex items-center p-4 md:p-6 transition-all duration-500
      ${isExpanded ? 'bg-black/20 backdrop-blur-md' : 'bg-transparent'}
      ${activeMode !== 'clock' ? 'justify-between' : 'justify-center md:justify-between'}
    `}>
      {activeMode !== 'clock' && isExpanded ? (
        <button 
          onClick={() => setIsExpanded(false)}
          className="flex items-center text-white hover:text-orange-200 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          <span>Back</span>
        </button>
      ) : (
        <div className="hidden md:flex items-center">
          <Clock className="mr-2" size={20} />
          <span className="font-medium">Timer App</span>
        </div>
      )}
      
      <div className="text-center md:text-right">
        <div className="text-lg md:text-xl font-semibold tracking-tight">{indianTime}</div>
        <div className="text-sm md:text-base opacity-80">{indianDate} (India)</div>
      </div>
    </nav>
  );
};

export default Navbar;