import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingView: React.FC = () => {
  const slogans = [
    "Unlocking IoT Intelligence...",
    "Revealing the Invisible...",
    "Seeing Data Differently..."
  ];

  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 2000); // Change slogan every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in w-full">
      {/* Central Visual Element */}
      <div className="relative mb-12">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 bg-polimi-500 rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Inner spinning circle */}
        <div className="relative bg-white p-6 rounded-full shadow-xl border border-slate-100 flex items-center justify-center z-10">
           <div className="relative">
              {/* Decorative spinning ring */}
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-polimi-500 opacity-20 animate-spin" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-indigo-500 opacity-20 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
              
              <Loader2 className="w-10 h-10 text-polimi-600 animate-spin" />
           </div>
        </div>
        
        {/* Floating particles (Sparkles) */}
        <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-indigo-400 opacity-60 animate-bounce" style={{ animationDuration: '3s' }} />
        <Sparkles className="absolute -bottom-2 -left-4 w-4 h-4 text-polimi-400 opacity-60 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
      </div>

      {/* Cycling Text Container */}
      <div className="h-12 flex items-center justify-center overflow-hidden relative w-full">
        {slogans.map((slogan, index) => (
          <div
            key={index}
            className={`absolute transition-all duration-700 ease-in-out transform flex flex-col items-center ${
              index === currentSloganIndex
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <h3 className="text-2xl font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-polimi-700 to-slate-700 animate-text-shimmer">
              {slogan}
            </h3>
          </div>
        ))}
      </div>
      
      {/* Subtext */}
      <p className="text-sm text-slate-400 mt-2 font-medium tracking-widest uppercase opacity-80">
        Processing Query
      </p>
    </div>
  );
};