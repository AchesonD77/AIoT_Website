import React from 'react';
import { Network, Search, Menu } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          
        {/* Logo Section - Modified to be clickable 上方部分*/}
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={onReset}
            title="Return to Home"
          >
            <div className="text-polimi-900 flex flex-col group-hover:opacity-80 transition-opacity">
              <span className="text-2xl font-bold leading-none tracking-tight">POLITECNICO</span>
              <span className="text-sm font-medium tracking-widest text-slate-600">MILANO 1863</span>
            </div>
            <div className="h-8 w-px bg-slate-300 mx-2 hidden sm:block"></div>
            <div className="hidden sm:flex flex-col justify-center group-hover:opacity-80 transition-opacity">
               <span className="text-polimi-900 font-bold text-sm tracking-wide">IoTLab</span>
               <span className="text-xs text-slate-500">AI and Data Analysis</span>
            </div>
          </div>
          

          {/* Nav Icons */}
          <div className="flex items-center gap-6 text-slate-600">
            <button className="hover:text-polimi-900 transition-colors p-2 rounded-full hover:bg-slate-100/50">
                <Search className="w-5 h-5" />
            </button>
            <button className="hover:text-polimi-900 transition-colors p-2 rounded-full hover:bg-slate-100/50">
                <Network className="w-5 h-5" />
            </button>
             <button className="hover:text-polimi-900 transition-colors p-2 rounded-full hover:bg-slate-100/50">
                <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};