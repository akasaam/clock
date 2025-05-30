import React from 'react';
import { Clock, Timer, Hourglass } from 'lucide-react';
import { useTimerApp, TimerMode } from '../contexts/TimerAppContext';

interface ModeButtonProps {
  mode: TimerMode;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const ModeButton: React.FC<ModeButtonProps> = ({ mode, icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-6 rounded-2xl transition-all 
        ${isActive 
          ? 'bg-white/20 scale-105 shadow-lg' 
          : 'bg-white/10 hover:bg-white/15 hover:scale-102'}
      `}
    >
      <div className="mb-3">{icon}</div>
      <span className="text-lg font-medium">{label}</span>
    </button>
  );
};

const ModeSwitcher: React.FC = () => {
  const { activeMode, setActiveMode, setIsExpanded } = useTimerApp();
  
  const handleModeChange = (mode: TimerMode) => {
    setActiveMode(mode);
    if (mode !== 'clock') {
      setIsExpanded(true);
    }
  };
  
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Select Mode</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ModeButton
          mode="clock"
          icon={<Clock size={32} />}
          label="Clock"
          isActive={activeMode === 'clock'}
          onClick={() => handleModeChange('clock')}
        />
        <ModeButton
          mode="stopwatch"
          icon={<Timer size={32} />}
          label="Stopwatch"
          isActive={activeMode === 'stopwatch'}
          onClick={() => handleModeChange('stopwatch')}
        />
        <ModeButton
          mode="countdown"
          icon={<Hourglass size={32} />}
          label="Countdown"
          isActive={activeMode === 'countdown'}
          onClick={() => handleModeChange('countdown')}
        />
      </div>
    </div>
  );
};

export default ModeSwitcher;