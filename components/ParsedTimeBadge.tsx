import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

// --- 1. Core Metrics Vocabulary ---
const KNOWN_METRICS = [
    "Temperature", "Temp", "Humidity", "RH",
    "CO2", "CO₂", "PM2.5", "PM10", "IEQ", 
    "Illuminance", "Occupancy", "Spikes", "Noise", "VOC", 
    "Door events", "Notable hours", "Particles", "Ventilation"
];

interface ParsedTimeBadgeProps {
  answer?: string;
}

export const ParsedTimeBadge: React.FC<ParsedTimeBadgeProps> = ({ answer }) => {
  
  // --- 2. Extraction Logic (Extract "0) Direct Answer") ---
  const directAnswerContent = useMemo(() => {
    if (!answer) return null;
    // Regex to capture text after "0) Direct Answer" until the next numbered section or end of string
    const regex = /(?:^|\n)0\)\s*Direct\s*Answer:?\s*([\s\S]*?)(?=(?:\n\d+\))|$)/i;
    const match = answer.match(regex);
    return match ? match[1].trim() : null;
  }, [answer]);

  if (!directAnswerContent) return null;

  return (
    // --- UI Container: Apple Style High-Contrast Card ---
    <div className="group relative mb-8 overflow-hidden rounded-2xl bg-white/95 p-6 
                    shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] 
                    ring-1 ring-black/5 
                    backdrop-blur-xl 
                    transition-all duration-500 ease-out 
                    hover:scale-[1.02] 
                    hover:shadow-[0_30px_60px_-15px_rgba(124,58,237,0.3)]
                    hover:ring-violet-500/30">
      
      {/* Glow Layer */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
        style={{
            background: `radial-gradient(
                800px circle at 50% -20%,
                rgba(167, 139, 250, 0.25),
                transparent 60%
            )`
        }}
      />

      <div className="relative flex items-start gap-5">
        {/* Icon */}
        <div className="flex-shrink-0 pt-0.5 transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30 text-white transition-shadow group-hover:shadow-violet-500/60">
            <Sparkles className="h-5 w-5" fill="currentColor" fillOpacity={0.2} />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <h3 className="mb-2.5 text-lg font-bold tracking-tight text-violet-900 transition-colors group-hover:text-violet-700">
            Key Insights
          </h3>
          
          <div className="text-[15px] leading-relaxed text-slate-700 font-medium">
             {formatDirectAnswer(directAnswerContent)}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. Rich Text Formatting Logic ---
const formatDirectAnswer = (text: string) => {
    const metricsPattern = KNOWN_METRICS.join('|').replace(/\./g, '\\.'); 

    const regex = new RegExp(
        `(\\*\\*.*?\\*\\*)|` +                         
        `\\b(${metricsPattern})(?:\\b|(?=[^a-zA-Z0-9]))|` + 
        `(CO₂)|` +
        // Values Regex (numbers, ranges, units)
        `((?:≈|~|>=?|<=?|approx\\s)?\\d+(?:[\\-–]\\d+)?(?:\\.\\d+)?\\s?(?:ppm|µg\\/m³|lux|%|°C|C)?)|` +
        // Citations
        `(\\[[\\d- :]+(?:]|.*\\]))`, 
        'gi'
    );

    const parts = text.split(regex).filter(p => p !== undefined && p !== "");

    return parts.map((part, i) => {
        // A. Bold text
        if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</span>;
        }

        // B. Metrics (IEQ, CO2, etc.) -> NOW STYLED AS PILLS/CARDS
        // ✅ Change: Applied the "Pill" style here
        if (KNOWN_METRICS.some(m => m.toLowerCase() === part.toLowerCase()) || part === 'CO₂') {
            const display = part === 'CO2' ? <span>CO<sub>2</sub></span> : part;
            return (
                <span key={i} className="inline-flex items-center px-2 py-0.5 mx-0.5 rounded-md bg-slate-100 text-slate-900 font-bold text-[13px] ring-1 ring-inset ring-slate-200 align-baseline transition-all group-hover:ring-violet-200/50 group-hover:bg-white">
                    {display}
                </span>
            );
        }
        
        // C. Values (400 ppm, 3.8, etc.) -> NOW JUST BOLD TEXT
        // ✅ Change: Removed "Pill" style, reverted to bold text
        const isValue = /\d/.test(part) && (
            part.includes('ppm') || part.includes('µg') || part.includes('%') || part.includes('°C') || part.includes('lux') ||
            part.includes('≈') || part.includes('~') || 
            /^\d/.test(part) 
        );
        if (isValue) {
             return <span key={i} className="font-bold text-slate-900">{part}</span>;
        }

        // D. Citations -> Hide
        if (part.startsWith('[') && part.includes(']')) {
             return null;
        }

        // E. Normal text
        return <span key={i}>{part}</span>;
    });
};