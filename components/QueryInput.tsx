import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';

interface QueryInputProps {
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
    label: "Stuffy air on Sept 11?", 
    question: "On 20250911, during 12 to 20, did CO2 or PM2.5 spike? List the specific hours and show snippet evidence. And analysis the reasons." 
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
    question: "Compare afternoon periods (post-noon to early evening) on 2025-06-09 vs 2025-09-12: which day has more stable IEQ?" 
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
  onSearch, 
  isLoading, 
  hideSuggestions = false,
  onReset,
  hasResults = false
}) => {
  const [value, setValue] = useState('');
  const [randomSuggestions, setRandomSuggestions] = useState<Suggestion[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);

  // Extract shuffle logic so it can be called manually
  const refreshSuggestions = () => {
    setIsSpinning(true);
    // Shuffle and pick 2
    const shuffled = [...SUGGESTIONS].sort(() => 0.5 - Math.random());
    setRandomSuggestions(shuffled.slice(0, 2));
    
    // Reset animation state after duration
    setTimeout(() => setIsSpinning(false), 500);
  };

  useEffect(() => {
    // Only refresh suggestions when we are in (or returning to) the "home" state
    // i.e., when suggestions are visible (hideSuggestions is false).
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
    setValue('');
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="w-full relative z-30">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-polimi-600 to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        
        {/* Main Input Container - Dark Pill Shape */}
        <div className="relative flex items-center bg-slate-800 rounded-full shadow-2xl overflow-hidden p-2 transition-all border border-slate-700 focus-within:ring-2 focus-within:ring-polimi-500/50">
          
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Just ask, unlock insights instantly"
            className="flex-grow bg-transparent text-white placeholder-slate-400 px-6 py-4 text-base sm:text-lg focus:outline-none"
            disabled={isLoading}
          />
          
          {/* Clear / Back Button - Only shows when there are results or text to clear while in result mode */}
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
          
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className={`
              flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ml-2
              ${isLoading || !value.trim() 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-polimi-500 text-white hover:bg-polimi-400 shadow-lg transform hover:scale-105'}
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
      
      {/* Suggestions - Conditionally Rendered */}
      {!hideSuggestions && (
        <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2 text-sm pl-4 transition-all duration-500">
          <button 
            type="button"
            onClick={refreshSuggestions}
            className="text-slate-500 flex items-center gap-1.5 font-medium hover:text-polimi-600 transition-colors cursor-pointer group select-none focus:outline-none"
            title="Click to get fresh suggestions"
          >
            <Sparkles className={`w-3.5 h-3.5 transition-transform duration-500 ${isSpinning ? 'rotate-180' : 'group-hover:rotate-12'}`} /> 
            <span>Try asking:</span>
          </button>
          
          {randomSuggestions.map((item, idx) => (
             <button 
               key={idx}
               onClick={() => setValue(item.question)} 
               className="px-3 py-1 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-full text-slate-700 hover:border-polimi-500 hover:text-polimi-700 transition-colors text-left max-w-full truncate animate-fade-in"
               title={item.question}
               style={{ animationDelay: `${idx * 100}ms` }}
             >
               {item.label}
             </button>
          ))}
        </div>
      )}
    </div>
  );
};