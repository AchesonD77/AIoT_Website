import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';

interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
  hideSuggestions?: boolean;
  onReset?: () => void;
  hasResults?: boolean;
}

interface Suggestion {
  label: string;
  question: string;
}

const SUGGESTIONS: Suggestion[] = [
  { 
    label: "Stuffy air on Sept 5?", 
    question: "On 20250905, during 12 to 20, did CO2 or PM2.5 spike? List the specific hours and show snippet evidence. And analysis the reasons." 
  },
  { 
    label: "IEQ Minimum Drivers July 11", 
    question: "On 2025-07-11, when did IEQ hit the minimum and what drove it (temp/humidity/CO2/illuminance/door events)?" 
  },
  { 
    label: "IEQ Min Night Sept 8-9", 
    question: "Between 0908 23:00 and the 9th of sep 03:00 in 2025, when was the IEQ minimum?" 
  },
  { 
    label: "IEQ Min Overnight Sept 8", 
    question: "Between september 08, 11pm to the 9th of sep 03:00, when was the IEQ minimum?" 
  },
  { 
    label: "Noon PM2.5 Table Sept 1-7", 
    question: "From 2025-09-01 to 2025-09-07, what are the noon-window (12:00-14:00) PM2.5 means and peaks per day? Return a daily table." 
  },
  { 
    label: "IEQ Trends July 1-7", 
    question: "From 2025-07-01 to 2025-07-07, summarize daily mean/peaks of IEQ, CO2, PM2.5; provide trend diagnosis & action plan." 
  },
  { 
    label: "Weekday vs Weekend IEQ", 
    question: "Between 2025-07-01 and 2025-07-14, are IEQ and illuminance distributions significantly different on weekdays vs weekends?" 
  },
  { 
    label: "Occupancy Night July 7?", 
    question: "Was the office occupied between 21:00 and 03:00 on 20250707?" 
  },
  { 
    label: "Occupancy Overnight July 2?", 
    question: "Was the office occupied between 21:00 and 10am on 20250702?" 
  },
  { 
    label: "Stuffy Air Signs Sept 1?", 
    question: "On 20250901, any signs of \"stuffy air\" from midnight to daybreak? Explain which sensors/thresholds operationalize \"stuffy.\"" 
  },
  { 
    label: "CO2 Jump Morning June-July?", 
    question: "Did CO2 \"jump up\" around 8-9 a.m. from 20250628-20250702? and why?" 
  },
  { 
    label: "IEQ Stability Comparison", 
    question: "Compare afternoon periods (post-noon to early evening) on 2025-06-09 vs 2025-08-04: which day has more stable IEQ?" 
  },
  { 
    label: "Temp Noon vs Afternoon July 4", 
    question: "Compare the temperature from noon to afternoon on 2025 7 4." 
  },
  { 
    label: "Verify Poor Lighting Aug 24", 
    question: "If I claim \"poor lighting but heavy occupancy,\" which sensor evidence would you use to verify this on 20250824?" 
  },
  { 
    label: "Air Quality Dusk July 1", 
    question: "How was the air quality at dusk on 2025-07-01?" 
  },
  { 
    label: "Temp at 3PM Aug 11", 
    question: "On 20250811, what was the temperature around 3 PM?" 
  },
  { 
    label: "Avg CO2 Evening July 10", 
    question: "What was the average CO2 in the two hours leading up to 8pm on 2025-07-10? And what happened?" 
  },
  { 
    label: "Midnight Anomalies July 22?", 
    question: "Did the sensors show any activity a bit after midnight on 2025-07-22? Is there any anomaly detected?" 
  }
];

export const QueryInput: React.FC<QueryInputProps> = ({ 
  value,
  onChange,
  onSearch, 
  isLoading, 
  hideSuggestions = false,
  onReset,
  hasResults = false
}) => {
  const [randomSuggestions, setRandomSuggestions] = useState<Suggestion[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  const refreshSuggestions = () => {
    setIsSpinning(true);
    const shuffled = [...SUGGESTIONS].sort(() => 0.5 - Math.random());
    setRandomSuggestions(shuffled.slice(0, 2));
    setTimeout(() => setIsSpinning(false), 500);
  };

  useEffect(() => {
    if (!hideSuggestions) {
      refreshSuggestions();
    }
  }, [hideSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange('');
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="w-full relative z-30">
      {/* 注入 CSS 动画 */}
      <style>{`
        /* 定义统一的呼吸节奏变量 
           时间统一为 3s，曲线统一为 ease-in-out
        */
        
        /* 定义截图中的亮蓝色变量: Tech Blue / Azure 
           #3B82F6 是 Tailwind 的 blue-500，接近截图按钮颜色
        */
        
        /* 1. Try Asking 文字呼吸：灰色 -> 亮蓝色 -> 灰色 */
        @keyframes breathe-text {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.9; 
            color: #64748b; /* slate-500 (灰色) */
          }
          50% { 
            transform: scale(1.1); /* 放大 */
            opacity: 1; 
            color: #3B82F6; /* Tech Blue (高光时刻) */
          }
        }
        
        /* 2. 搜索框容器呼吸：边框/阴影同步变蓝 */
        @keyframes breathe-input {
          0%, 100% {
            transform: scale(1);
            border-color: #334155; /* slate-700 */
            box-shadow: 0 0 0 0 transparent;
          }
          50% {
            transform: scale(1.02); 
            border-color: rgba(59, 130, 246, 0.5); /* blue-500 with opacity */
            box-shadow: 0 15px 40px -10px rgba(37, 99, 235, 0.3); /* blue shadow */
          }
        }

        /* 3. 输入框内部文字呼吸：白色 -> 亮蓝色 -> 白色 (反转回来) */
        /* 平时白色，呼吸最强时变成蓝色，与外框光晕和TryAsking呼应 */
        @keyframes breathe-input-text {
          0%, 100% {
            color: #ffffff; /* 纯白 (常态) */
            transform: scale(1);
          }
          50% {
            color: #3B82F6; /* Tech Blue (高光时刻) */
            transform: scale(1.005);
          }
        }

        /* 应用动画类：同频共振 (3s, ease-in-out) */
        .animate-sync-text {
          animation: breathe-text 3s infinite ease-in-out;
        }
        
        .animate-sync-text svg {
          color: currentColor; 
        }
        
        .animate-sync-input {
          animation: breathe-input 3s infinite ease-in-out;
        }

        .animate-sync-input-text {
          animation: breathe-input-text 3s infinite ease-in-out;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="relative group">
        
        {/* Glow effect (Background) - Updated to Blue/Indigo gradient */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-700 group-hover:scale-[1.02]"></div>
        
        {/* Main Input Container */}
        <div className="relative flex items-center bg-slate-800 rounded-full overflow-hidden p-2 border border-slate-700 
                        shadow-2xl
                        transition-all duration-500 ease-out
                        animate-sync-input
                        focus-within:ring-2 focus-within:ring-blue-500/50">
          
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Just ask, unlock insights instantly"
            className="flex-grow bg-transparent placeholder-slate-400 px-6 py-4 text-base sm:text-lg focus:outline-none animate-sync-input-text"
            disabled={isLoading}
          />
          
          {/* Input Clear Button (Shows when typing, BEFORE searching) */}
          {value && !hasResults && !isLoading && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors mr-1"
              title="Clear input"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Result Clear Button (Shows when has results) */}
          {hasResults && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors mr-1"
              title="Clear results and return to home"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
            className={`
              flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ml-2
              ${isLoading || !value.trim() 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-400 shadow-lg transform hover:scale-110 active:scale-95'}
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Input Text Tooltip (Apple Glass Style) */}
        {value && (
          <div className={`
                absolute top-full left-0 mt-4 w-full p-4 
                bg-white/70 backdrop-blur-xl border border-white/40
                text-slate-800 text-sm rounded-xl shadow-2xl
                opacity-0 invisible 
                transition-all duration-200 delay-100 z-50 pointer-events-none origin-top
                ${!isHoveringButton ? 'group-hover:opacity-100 group-hover:visible' : ''} 
          `}>
             <div className="absolute bottom-full left-10 -mb-px border-8 border-transparent border-b-white/50 blur-[0.5px]"></div>
             <div className="leading-relaxed font-medium break-words">
               {value}
             </div>
          </div>
        )}
      </form>
      
      {/* Suggestions Section */}
      {!hideSuggestions && (
        <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2 text-sm pl-4 transition-all duration-500">
          
          {/* Try Asking Button */}
          <button 
            type="button"
            onClick={refreshSuggestions}
            className="flex items-center gap-1.5 font-medium 
                       transition-colors cursor-pointer select-none focus:outline-none
                       animate-sync-text hover:text-blue-500"
            title="Click to get fresh suggestions"
          >
            <Sparkles 
              className={`w-3.5 h-3.5 transition-transform duration-500 
                ${isSpinning ? 'rotate-180' : ''}
              `} 
            /> 
            <span>Try asking:</span>
          </button>
          
          {/* Suggestion Chips */}
          {randomSuggestions.map((item, idx) => (
             <div key={idx} className="relative group">
               <button 
                 onClick={() => onChange(item.question)} 
                 className="px-3 py-1 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-full text-slate-700 
                            hover:border-blue-500 hover:text-blue-600 hover:bg-white/80
                            transition-all duration-300 
                            text-left max-w-full truncate animate-fade-in 
                            hover:scale-[1.02] active:scale-95 transform"
                 style={{ animationDelay: `${idx * 100}ms` }}
               >
                 {item.label}
               </button>
               
               {/* Custom Fast Tooltip */}
               <div className="absolute top-full left-0 mt-2 w-72 p-4 
                               bg-white/70 backdrop-blur-xl border border-white/40
                               text-slate-800 text-xs rounded-xl shadow-2xl
                               opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                               transition-all duration-200 delay-100 z-50 pointer-events-none origin-top">
                  <div className="absolute bottom-full left-4 -mb-px border-8 border-transparent border-b-white/50 blur-[0.5px]"></div>
                  <div className="leading-relaxed font-medium">
                    {item.question}
                  </div>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};