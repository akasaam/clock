import React, { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

const ClockDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const hours = formatInTimeZone(currentTime, 'Asia/Kolkata', 'hh');
  const minutes = formatInTimeZone(currentTime, 'Asia/Kolkata', 'mm');
  const seconds = formatInTimeZone(currentTime, 'Asia/Kolkata', 'ss');
  const ampm = formatInTimeZone(currentTime, 'Asia/Kolkata', 'a');
  
  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-medium opacity-90 mb-2">Current Time in India</h2>
        <p className="text-base md:text-lg opacity-70">
          {formatInTimeZone(currentTime, 'Asia/Kolkata', 'EEEE, MMMM do, yyyy')}
        </p>
      </div>
      
      <div className="flex items-end justify-center">
        <div className="flex items-baseline">
          <span className="text-6xl md:text-8xl lg:text-9xl font-bold text-shadow">{hours}</span>
          <span className="text-4xl md:text-6xl animate-pulse mx-2 md:mx-4">:</span>
          <span className="text-6xl md:text-8xl lg:text-9xl font-bold text-shadow">{minutes}</span>
          <span className="text-4xl md:text-6xl animate-pulse mx-2 md:mx-4">:</span>
          <span className="text-6xl md:text-8xl lg:text-9xl font-bold text-shadow">{seconds}</span>
        </div>
        <div className="ml-4 text-2xl md:text-3xl font-medium self-center">{ampm}</div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-lg md:text-xl font-medium">Indian Standard Time (IST)</p>
        <p className="opacity-70">UTC+5:30</p>
      </div>
    </div>
  );
};

export default ClockDisplay;