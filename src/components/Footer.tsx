import React from 'react';
import { Heart } from 'lucide-react';
import { useTimerApp } from '../contexts/TimerAppContext';

const Footer: React.FC = () => {
  const { activeMode } = useTimerApp();
  if (activeMode !== 'clock') return null;
  return (
    <footer className="w-full bg-black/20 backdrop-blur-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <a className="text-sm opacity-90"
             href="https://thebrandcounter-tawny.vercel.app/"
             target="_blank"
             rel="noopener noreferrer">
            Developed with <Heart className="inline-block w-4 h-4 text-red-500 mx-1" /> by The Brand Counter
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="ko-fi.com/thebrandcounter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            <span className="mr-2">☕</span>
            Buy me a coffee
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;