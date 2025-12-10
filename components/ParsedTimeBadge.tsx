import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

// --- 1. 核心指标词汇库 ---
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
  
  // --- 2. 提取逻辑 ---
  const directAnswerContent = useMemo(() => {
    if (!answer) return null;
    const regex = /(?:^|\n)0\)\s*Direct\s*Answer:?\s*([\s\S]*?)(?=(?:\n\d+\))|$)/i;
    const match = answer.match(regex);
    return match ? match[1].trim() : null;
  }, [answer]);

  if (!directAnswerContent) return null;

  return (
    // --- UI 容器 ---
    // 保持紧凑优化：p-4, mb-4
    <div className="group relative mb-4 overflow-hidden rounded-2xl bg-white/95 p-6
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
                1200px circle at 50% -10%,
                rgba(167, 139, 250, 0.25),
                transparent 60%
            )`
        }}
      />

      {/* 保持紧凑优化：gap-3 */}
      <div className="relative flex items-start gap-5">
        {/* Icon */}
        <div className="flex-shrink-0 pt-0.5 transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110">
          {/* 恢复原版大小：h-11 w-11 */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30 text-white transition-shadow group-hover:shadow-violet-500/60">
            {/* 恢复原版大小：h-5 w-5 */}
            <Sparkles className="h-5 w-5" fill="currentColor" fillOpacity={0.2} />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* 恢复原版字号：text-lg */}
          {/* 保持紧凑间距：mb-1 */}
          <h3 className="mb-2.5 text-xl font-bold tracking-tight text-violet-900 transition-colors group-hover:text-violet-700">
            Key Insights
          </h3>
          
          {/* 保持紧凑行高：leading-snug */}
          <div className="text-[14px] leading-snug text-slate-700 font-medium">
             {formatDirectAnswer(directAnswerContent)}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. 富文本渲染逻辑 ---
const formatDirectAnswer = (text: string) => {
    const cleanedText = text.replace(/([ \t]*\[[\d- :;,]+\](?:-[\[\d- :;,]+\])?)[ \t]*[.,;]?/g, '');
    const metricsPattern = KNOWN_METRICS.join('|').replace(/\./g, '\\.'); 

    const regex = new RegExp(
        // A. Section Headers (通用小标题识别)
        // 关键修复：添加 (?!\\d) 
        // 含义：匹配冒号，但冒号后面【不能】紧跟着数字。
        // 这避免了将 "at 01:00" 中的 "at 01:" 误判为标题。
        `((?:^|\\n)\\s*-\\s*[a-zA-Z0-9\\s\\-]+:(?!\\d))` + `|` +

        // B. Markdown Bold
        `(\\*\\*.*?\\*\\*)|` +                         
        
        // C. Metrics
        `\\b(${metricsPattern})(?:\\b|(?=[^a-zA-Z0-9]))|` + 
        `(CO₂)|` +
        
        // D. Values
        `((?:≈|~|>=?|<=?|approx\\s)?\\d+(?:[\\-–]\\d+)?(?:\\.\\d+)?\\s?(?:ppm|µg\\/m³|lux|%|°C|C)?)|` +
        `\\b((?:median|mean|peak|min|max|score|val)\\s+\\d+(?:\\.\\d+)?)`, 
        'gi'
    );

    const parts = cleanedText.split(regex).filter(p => p !== undefined && p !== "");

    return parts.map((part, i) => {
        // A. Section Header Logic
        // 同步更新判断：只有符合正则且不以数字结尾（其实已经在split中过滤了，这里双重保险）的才算标题
        if (/^\s*(\n)?\s*-\s*[a-zA-Z0-9\s\-]+:(?!\d)$/.test(part)) {
            const label = part.replace(/^\n/, '').trim();
            // 保持紧凑优化：mt-2 mb-0.5
            return (
                <span key={i} className="block mt-3 mb-1 font-bold text-violet-600">
                    {label}
                </span>
            );
        }

        // B. Bold text
        if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</span>;
        }

        // C. Metrics
        if (KNOWN_METRICS.some(m => m.toLowerCase() === part.toLowerCase()) || part === 'CO₂') {
            const display = part === 'CO2' ? <span>CO<sub>2</sub></span> : part;
            return (
                <span key={i} className="inline-flex items-center px-1.5 py-0 mx-0.5 rounded bg-slate-100 text-slate-900 font-bold text-[12px] ring-1 ring-inset ring-slate-200 align-baseline transition-all group-hover:ring-violet-200/50 group-hover:bg-white">
                    {display}
                </span>
            );
        }
        
        // D. Values
        const isValue = /\d/.test(part) && (
            part.includes('ppm') || part.includes('µg') || part.includes('%') || part.includes('°C') || part.includes('lux') ||
            part.includes('≈') || part.includes('~') || 
            /^\d/.test(part) 
        );
        if (isValue) {
             return <span key={i} className="font-bold text-slate-900">{part}</span>;
        }

        return <span key={i}>{part}</span>;
    });
};