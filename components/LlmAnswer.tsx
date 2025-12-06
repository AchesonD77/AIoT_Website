import React, { useMemo } from 'react';
import { Bot, Lightbulb, Activity, Stethoscope, FileText, AlertTriangle, Clock } from 'lucide-react';

// --- 1. 核心指标词汇库 ---
const KNOWN_METRICS = [
    "Temperature", "Temp", "Humidity", "RH",
    "CO2", "CO₂", "PM2.5", "PM10", "IEQ", 
    "Illuminance", "Occupancy", "Spikes", "Noise", "VOC", 
    "Door events", "Notable hours", "Particles", "Ventilation"
];

// --- 2. 板块配置 ---
const SECTIONS_CONFIG = [
  { 
    id: 'findings', 
    title: 'Findings & Observations', 
    icon: <Activity className="w-5 h-5 text-white" />, 
    gradient: 'from-blue-500 to-cyan-500', 
    shadow: 'shadow-blue-500/30',
    titleColor: 'text-blue-900',
    regexKeywords: /findings|observations/i,
    style: 'bullet'
  },
  { 
    id: 'alarms', 
    title: 'Alarms & Anomalies', 
    icon: <AlertTriangle className="w-5 h-5 text-white" />,
    gradient: 'from-rose-500 to-red-600', 
    shadow: 'shadow-rose-500/30',
    titleColor: 'text-rose-900',
    regexKeywords: /alarms|anomalies|spike/i,
    style: 'bullet'
  },
  { 
    id: 'diagnostics', 
    title: 'Diagnostics', 
    icon: <Stethoscope className="w-5 h-5 text-white" />, 
    gradient: 'from-violet-500 to-purple-600', 
    shadow: 'shadow-violet-500/30',
    titleColor: 'text-violet-900',
    regexKeywords: /diagnostics|cause/i,
    style: 'card'
  },
  { 
    id: 'recommendations', 
    title: 'Recommendations', 
    icon: <Lightbulb className="w-5 h-5 text-white" />, 
    gradient: 'from-amber-400 to-orange-500', 
    shadow: 'shadow-amber-500/30',
    titleColor: 'text-amber-900',
    regexKeywords: /recommendations|actions/i,
    style: 'numbered'
  },
];

interface LlmAnswerProps {
  answer: string;
}

export const LlmAnswer: React.FC<LlmAnswerProps> = ({ answer }) => {

  // --- 解析逻辑 ---
  const parsedContent = useMemo(() => {
    if (!answer) return {};

    const sectionPattern = /(?:^|\n)(?:#{1,6}|\*\*|\d+[\.\)]|-)?\s*(Findings|Observations|Alarms|Anomalies|Diagnostics|Cause|Recommendations|Actions)(?:.*?)[:\n]/gi;
    const matches = Array.from(answer.matchAll(sectionPattern));
    
    if (matches.length === 0) return { raw: answer };

    const result: Record<string, string> = {};
    matches.forEach((match, index) => {
      const keyword = match[1].toLowerCase();
      const startIndex = match.index! + match[0].length;
      const nextMatch = matches[index + 1];
      const endIndex = nextMatch ? nextMatch.index : answer.length;
      const content = answer.slice(startIndex, endIndex).trim();

      const config = SECTIONS_CONFIG.find(s => s.regexKeywords.test(keyword));
      if (config && content.length > 0) {
        result[config.id] = result[config.id] ? result[config.id] + '\n' + content : content;
      }
    });
    return result;
  }, [answer]);

  const isQuickAnswer = Object.keys(parsedContent).length === 0 || parsedContent.raw;

  return (
    // --- 主容器 ---
    <div className="group relative overflow-hidden rounded-2xl bg-white/95 p-6 
                    shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] 
                    ring-1 ring-black/5 
                    backdrop-blur-xl 
                    transition-all duration-500 ease-out
                    hover:scale-[1.0055]
                    hover:shadow-[0_30px_60px_-15px_rgba(124,58,237,0.3)]
                    hover:ring-violet-500/30">
      
      {/* Background Glow */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
        style={{
            background: `radial-gradient(
                1200px circle at 80% -10%,
                rgba(167, 139, 250, 0.25),
                transparent 60%
            )`
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br from-slate-50/50 via-transparent to-transparent opacity-50" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-slate-100/80 pb-6">
        <div className="flex-shrink-0 transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg text-white">
            <Bot className="h-6 w-6" />
            </div>
        </div>
        <div>
           <h2 className="text-xl font-bold tracking-tight text-slate-900">Environmental Sensing and Intelligence Summary</h2>
           <p className="text-sm text-slate-500 font-medium">Comprehensive breakdown of environmental metrics</p>
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="space-y-10">
        {!isQuickAnswer && SECTIONS_CONFIG.map((section) => {
            const content = parsedContent[section.id];
            if (!content) return null;

            return (
                <div key={section.id} className="relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${section.gradient} ${section.shadow} shadow-md`}>
                            {section.icon}
                        </div>
                        <h3 className={`text-base font-bold tracking-tight ${section.titleColor}`}>
                            {section.title}
                        </h3>
                    </div>
                    <div className="pl-3 sm:pl-11">
                        {formatText(content, section.style as any)}
                    </div>
                </div>
            )
        })}
        
        {isQuickAnswer && (
            <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-500 shadow-md text-white">
                        <FileText className="w-4 h-4" />
                     </div>
                    <h3 className="text-base font-bold tracking-tight text-slate-700">Summary & Insights</h3>
                </div>
                <div className="pl-3 sm:pl-11">
                    {formatText(parsedContent.raw || answer, 'bullet')}
                </div>
            </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
         <span>Private Analysis</span>
         <span>Generated by AIoT Intelligence</span>
      </div>
    </div>
  );
};

// --- 核心格式化引擎 ---

const formatText = (text: string, style: 'bullet' | 'numbered' | 'card' = 'bullet') => {
  if (!text) return null;
  const lines = text.split('\n').filter(line => line.trim() !== '');
  let listCounter = 0;

  return lines.map((line, idx) => {
    let cleanLine = line.trim();
    
    // 1. 清理
    if (/^[*-]\s/.test(cleanLine) || /^\d+[\.\)]\s/.test(cleanLine)) {
        cleanLine = cleanLine.replace(/^(?:[*-]|\d+[\.\)])\s+/, '');
    }
    cleanLine = cleanLine.replace(/^\*\*/, '');

    // 2. 日期标题检测 (针对整行为日期的 header)
    const rawCheck = cleanLine.replace(/[*_:]/g, '').trim();
    const isDateHeader = /^\d{4}-\d{2}-\d{2}/.test(rawCheck) && rawCheck.length < 15;

    // --- A. 提取引用 ---
    let rightCitations: string[] = [];
    const allCitationsPattern = /\[\d{4}-\d{2}-\d{2}.*?\]/g;
    const foundCitations = cleanLine.match(allCitationsPattern);
    
    if (foundCitations) {
        rightCitations = foundCitations;
        cleanLine = cleanLine.replace(allCitationsPattern, '');
        cleanLine = cleanLine.replace(/\s+,\s+/g, ', ').replace(/,\s*$/, '').trim();
    }

    let contentPart = cleanLine;

    // --- B. 提取行首 Key ---
    let keyPart = null;
    let isTimestampKey = false;
    
    // 1. 优先检测：标准日期时间格式出现在行首 (e.g. "2025-07-11 12:00 ...")
    // 不需要后面强制跟冒号，只要符合日期格式即可作为 Key 提取，并自动截断后续分隔符
    const strictDateMatch = contentPart.match(/^(\d{4}-\d{2}-\d{2}\s+\d{1,2}:\d{2})(?:\s*[:：]\s*|\s+|$)/);

    if (strictDateMatch) {
        keyPart = strictDateMatch[1];
        const matchLen = strictDateMatch[0].length;
        contentPart = contentPart.substring(matchLen).trim();
        isTimestampKey = true;
    } else {
        // 2. 回退检测：带冒号的复杂时间戳 Key (e.g. "2025-07-11 09:00 - 10:00:")
        const timestampKeyPattern = /^(\d{4}-\d{2}-\d{2}.*?\d{2}:\d{2})\**:/;
        const timestampMatch = contentPart.match(timestampKeyPattern);

        if (timestampMatch) {
            keyPart = timestampMatch[1].replace(/\*\*/g, '');
            contentPart = contentPart.substring(timestampMatch[0].length).trim();
            isTimestampKey = true;
        } else {
            // 3. 通用文本 Key
            const generalKeyMatch = contentPart.match(/^([A-Za-z0-9 \(\)\.\-\/&,]+?):/);
            if (generalKeyMatch && generalKeyMatch[1].length < 60) {
                keyPart = generalKeyMatch[1];
                contentPart = contentPart.substring(generalKeyMatch[0].length).trim();
            }
        }
    }

    // --- 渲染内容 ---
    const formattedBody = processInlineStyles(contentPart);

    // --- C. 引用渲染逻辑 ---
    const renderCitations = () => {
        if (rightCitations.length === 0) return null;

        // 通用胶囊样式
        const capsuleStyle = "cursor-default flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm transition-all hover:border-violet-300 hover:text-violet-600 hover:shadow-md";

        // 模式 1: 单个引用 -> 直接显示为"单胶囊"
        if (rightCitations.length === 1) {
            const cleanText = rightCitations[0].replace(/[\[\]]/g, '');
            return (
                <span className="float-right ml-3 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <span className={capsuleStyle}>
                        <Clock className="w-3 h-3" />
                        {cleanText}
                    </span>
                </span>
            );
        }

        // 模式 2: 引用数量 >= 2 -> 强制折叠
        const firstText = rightCitations[0].replace(/[\[\]]/g, ''); 
        const dateMatch = firstText.match(/\d{4}-\d{2}-\d{2}/);
        const displayDate = dateMatch ? dateMatch[0] : "Time Records";

        return (
            // hover:z-[100] 确保悬浮时层级最高
            <span className="float-right ml-3 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative group/popover z-20 hover:z-[100]">
                {/* 1. 折叠状态：日期胶囊 */}
                <span className={`${capsuleStyle} cursor-help`}>
                    <Clock className="w-3 h-3" />
                    {displayDate}
                    <span className="flex items-center justify-center bg-slate-100 text-slate-500 text-[9px] h-4 min-w-[16px] px-1 rounded-full ml-0.5">
                        {rightCitations.length}
                    </span>
                </span>

                {/* 2. 展开状态：完整列表 (Pop-up) */}
                <span className="absolute right-0 top-full mt-2 flex flex-col items-end gap-1 min-w-[180px]
                                 opacity-0 translate-y-2 pointer-events-none 
                                 group-hover/popover:opacity-100 group-hover/popover:translate-y-0 group-hover/popover:pointer-events-auto
                                 transition-all duration-200 ease-out z-50"> 
                    
                    <span className="absolute -top-2 right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white drop-shadow-sm" />
                    
                    <span className="bg-white p-2 rounded-xl border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] flex flex-col gap-1 w-full">
                        {rightCitations.map((citation, cIdx) => (
                            <span key={cIdx} className="flex items-center justify-end gap-2 text-[10px] text-slate-500 font-medium px-2 py-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors text-right whitespace-nowrap border border-transparent hover:border-slate-100">
                                {citation.replace(/[\[\]]/g, '')}
                                <Clock className="w-2.5 h-2.5 opacity-50" />
                            </span>
                        ))}
                    </span>
                </span>
            </span>
        );
    };

    const renderInnerContent = () => (
        <span className="text-slate-600 leading-snug text-[15px]">
            {keyPart && (
                isTimestampKey 
                // UPDATED: 使用更醒目的胶囊样式 (符合 Screenshot 2 风格)
                ? <span className="inline-block bg-slate-100 text-slate-800 text-[13px] font-bold px-2.5 py-1 rounded-md border border-slate-200 mr-2 align-middle shadow-sm whitespace-nowrap">{keyPart}</span>
                : <span className="font-bold text-slate-800 mr-1.5">{keyPart}:</span>
            )}
            
            {formattedBody}

            {/* 引用区 */}
            {renderCitations()}
        </span>
    );

    if (isDateHeader) {
        return (
            <div key={idx} className="mt-6 mb-3 inline-block">
                <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md border border-slate-200 shadow-sm">
                    {rawCheck}
                </span>
            </div>
        );
    }

    // Case B: 诊断卡片
    if (style === 'card') {
        return (
            <div key={idx} className="mb-3 p-4 bg-violet-50/50 rounded-xl border border-violet-100/60 hover:bg-violet-50 hover:border-violet-200 transition-all flex items-start gap-3 group">
                 <div className="mt-1.5 w-1 h-4 bg-violet-400 rounded-full flex-shrink-0" />
                 <div className="w-full">
                    {renderInnerContent()}
                 </div>
            </div>
        );
    }

    // Case C: 数字列表
    if (style === 'numbered') {
        listCounter++;
        return (
            <div key={idx} className="mb-3 pl-0 flex items-start gap-3 group">
                <span className="mt-0.5 flex items-center justify-center w-5 h-5 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 text-xs font-bold rounded-md flex-shrink-0 border border-amber-200/60 shadow-sm">
                    {listCounter}
                </span>
                <div className="w-full">
                    {renderInnerContent()}
                </div>
            </div>
        );
    }

    // Case D: 普通圆点
    return (
        <div key={idx} className="mb-3 pl-0 flex items-start gap-3 group">
             <span className="mt-2.5 w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0 opacity-60" />
             <div className="w-full">
                {renderInnerContent()}
             </div>
        </div>
    );
  });
};

// --- 行内样式处理器 ---
const processInlineStyles = (text: string) => {
    const metricsPattern = KNOWN_METRICS.join('|').replace(/\./g, '\\.'); 

    const regex = new RegExp(
        `(\\*\\*.*?\\*\\*)|` + 
        // 优先匹配完整日期格式 "YYYY-MM-DD HH:mm"
        `(\\b\\d{4}-\\d{2}-\\d{2}\\s+\\d{1,2}:\\d{2}\\b)|` +      
        `(\\b\\d{1,2}:\\d{2}\\b)|` +                    
        `\\b(${metricsPattern})(?:\\b|(?=[^a-zA-Z0-9]))|` + 
        `(CO₂)|` +
        `((?:≈|~|>=?|<=?|approx\\s)?\\d+(?:[\\-–]\\d+)?(?:\\.\\d+)?\\s?(?:ppm|µg\\/m³|lux|%|°C|C)?)|` +
        `\\b((?:median|mean|peak|min|max|score|val)\\s+\\d+(?:\\.\\d+)?)`, 
        'gi'
    );

    const parts = text.split(regex).filter(p => p !== undefined && p !== "");

    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</span>;
        }

        // NEW: 完整日期格式渲染为胶囊样式 (类似截图2)
        if (/^\d{4}-\d{2}-\d{2}\s+\d{1,2}:\d{2}$/.test(part)) {
             return (
                 <span key={i} className="inline-block mx-1.5 bg-slate-100 text-slate-800 text-[13px] font-bold px-2.5 py-1 rounded-md border border-slate-200 align-middle shadow-sm">
                     {part}
                 </span>
             );
        }

        // 纯时间 (加粗)
        if (/^\d{1,2}:\\d{2}$/.test(part)) {
             return <span key={i} className="font-bold text-slate-800">{part}</span>;
        }

        if (KNOWN_METRICS.some(m => m.toLowerCase() === part.toLowerCase()) || part === 'CO₂') {
            const display = part === 'CO2' ? <span>CO<sub>2</sub></span> : part;
            return <span key={i} className="font-bold text-slate-800">{display}</span>;
        }
        
        const isValue = /\d/.test(part) && (
            part.includes('ppm') || part.includes('µg') || part.includes('%') || part.includes('°C') || part.includes('lux') ||
            part.includes('≈') || part.includes('~') || 
            /^\d/.test(part) 
        );

        if (isValue) {
             return <span key={i} className="font-bold text-slate-900">{part}</span>;
        }
        
        if (/^(median|mean|peak|min|max|score|val)\s+\d+/.test(part.toLowerCase())) {
            const [stat, val] = part.split(/\s+/);
            return <span key={i}>{stat} <span className="font-bold text-slate-900">{val}</span></span>;
        }

        return <span key={i}>{part}</span>;
    });
};

export default LlmAnswer;