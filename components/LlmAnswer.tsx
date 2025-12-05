import React, { useMemo } from 'react';
import { Bot, Lightbulb, Activity, Stethoscope, FileText, AlertTriangle } from 'lucide-react';

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

  // --- 解析逻辑 (保持不变) ---
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
    // --- 主容器：Apple 风格玻璃拟态卡片 + 高级悬浮交互 ---
    // group: 用于控制内部元素的 hover 状态
    // transition-all duration-500 ease-out: 丝滑过渡
    // hover:scale-[1.02]: 悬浮轻微放大
    // hover:shadow-[...purple...]: 悬浮出现深邃紫光阴影
    // hover:ring-violet-500/30: 悬浮边框变紫
    <div className="group relative overflow-hidden rounded-2xl bg-white/95 p-6 
                    shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] 
                    ring-1 ring-black/5 
                    backdrop-blur-xl 
                    transition-all duration-500 ease-out
                    hover:scale-[1.02]
                    hover:shadow-[0_30px_60px_-15px_rgba(124,58,237,0.3)]
                    hover:ring-violet-500/30">
      
      {/* 顶部装饰光晕 (增强紫光氛围) */}
      <div className="absolute top-0 right-0 -z-10 h-64 w-64 translate-x-1/3 translate-y-[-50%] rounded-full bg-violet-400/10 blur-3xl transition-all group-hover:bg-violet-400/20" />
      <div className="absolute bottom-0 left-0 -z-10 h-32 w-32 translate-x-[-50%] translate-y-[50%] rounded-full bg-blue-400/5 blur-3xl transition-all group-hover:bg-blue-400/15" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-slate-100/80 pb-6">
        {/* 主图标容器：增加 hover 时的旋转和放大动画 */}
        <div className="flex-shrink-0 transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg text-white">
            <Bot className="h-6 w-6" />
            </div>
        </div>
        <div>
           {/* 更新后的标题 */}
           <h2 className="text-xl font-bold tracking-tight text-slate-900">Environmental Insights and Intelligence Summary</h2>
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
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${section.gradient} ${section.shadow} shadow-md`}>
                            {section.icon}
                        </div>
                        <h3 className={`text-base font-bold tracking-tight ${section.titleColor}`}>
                            {section.title}
                        </h3>
                    </div>

                    {/* Section Body */}
                    <div className="pl-3 sm:pl-11">
                        {formatText(content, section.style as any)}
                    </div>
                </div>
            )
        })}
        
        {/* Quick Answer / Fallback View */}
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
      
      {/* Footer (更新后的文案) */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[11px] font-medium text-slate-400">
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

    // 2. 日期标题检测
    const rawCheck = cleanLine.replace(/[*_:]/g, '').trim();
    const isDateHeader = /^\d{4}-\d{2}-\d{2}/.test(rawCheck) && rawCheck.length < 15;

    // --- A. 提取行尾引用 ---
    let rightCitations: string[] = [];
    let contentPart = cleanLine;
    const trailingPattern = /((?:\[[\d- :]+\](?:-[\[\d- :]+\])?(?:,\s*|\s+)*)+)[.\s]*$/;
    const tailMatch = cleanLine.match(trailingPattern);

    if (tailMatch) {
        const rawTail = tailMatch[1];
        const individualCitations = rawTail.match(/\[[\d- :]+\](?:-[\[\d- :]+\])?/g);
        if (individualCitations) rightCitations = individualCitations;
        contentPart = cleanLine.substring(0, tailMatch.index).trim();
        if (contentPart.endsWith('.') || contentPart.endsWith(',')) contentPart = contentPart.slice(0, -1).trim();
    }

    // --- B. 提取行首 Key (Timestamp Capsule) ---
    let keyPart = null;
    let isTimestampKey = false;
    const timestampKeyPattern = /^(\d{4}-\d{2}-\d{2}.*?\d{2}:\d{2})\**:/;
    const timestampMatch = contentPart.match(timestampKeyPattern);

    if (timestampMatch) {
        keyPart = timestampMatch[1].replace(/\*\*/g, '');
        contentPart = contentPart.substring(timestampMatch[0].length).trim();
        isTimestampKey = true;
    } else {
        const generalKeyMatch = contentPart.match(/^([A-Za-z0-9 \(\)\.\-\/&,]+?):/);
        if (generalKeyMatch && generalKeyMatch[1].length < 60) {
            keyPart = generalKeyMatch[1];
            contentPart = contentPart.substring(generalKeyMatch[0].length).trim();
        }
    }

    // --- 渲染内容 ---
    const formattedBody = processInlineStyles(contentPart);

    const renderInnerContent = () => (
        <span className="text-slate-600 leading-7 text-[15px]">
            {/* Key 渲染 (保持不变，行首时间戳依然是胶囊) */}
            {keyPart && (
                isTimestampKey 
                ? <span className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-md border border-slate-200 mr-2 align-middle mb-0.5 shadow-sm whitespace-nowrap">{keyPart}</span>
                : <span className="font-bold text-slate-800 mr-1.5">{keyPart}:</span>
            )}
            {formattedBody}
            {/* 引用堆叠在右侧 */}
            {rightCitations.length > 0 && (
                <span className="float-right ml-2 flex flex-col items-end gap-1 mt-0.5">
                    {rightCitations.map((citation, cIdx) => (
                        <span key={cIdx} className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 select-none whitespace-nowrap">
                            {citation}
                        </span>
                    ))}
                </span>
            )}
        </span>
    );

    // Case A: 纯日期标题
    if (isDateHeader) {
        return (
            <div key={idx} className="mt-6 mb-3 inline-block">
                <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md border border-slate-200 shadow-sm">
                    {rawCheck}
                </span>
            </div>
        );
    }

    // Case B: 诊断卡片模式 (Glass Style)
    if (style === 'card') {
        return (
            <div key={idx} className="mb-3 p-4 bg-violet-50/50 rounded-xl border border-violet-100/60 hover:bg-violet-50 hover:border-violet-200 transition-all flex items-start gap-3 group/card">
                 <div className="mt-1.5 w-1 h-4 bg-violet-400 rounded-full flex-shrink-0" />
                 <div className="w-full">
                    {renderInnerContent()}
                 </div>
            </div>
        );
    }

    // Case C: 数字列表模式
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

    // Case D: 普通圆点列表
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

// --- 行内样式处理器 (Critical Update: Revert pills to bold text) ---
const processInlineStyles = (text: string) => {
    const metricsPattern = KNOWN_METRICS.join('|').replace(/\./g, '\\.'); 

    const regex = new RegExp(
        `(\\*\\*.*?\\*\\*)|` +                         
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

        // Metrics: 深色加粗
        if (KNOWN_METRICS.some(m => m.toLowerCase() === part.toLowerCase()) || part === 'CO₂') {
            const display = part === 'CO2' ? <span>CO<sub>2</sub></span> : part;
            return <span key={i} className="font-bold text-slate-800">{display}</span>;
        }
        
        // Values Highlighting (核心修改：从胶囊样式回归到单纯的加粗文本)
        const isValue = /\d/.test(part) && (
            part.includes('ppm') || part.includes('µg') || part.includes('%') || part.includes('°C') || part.includes('lux') ||
            part.includes('≈') || part.includes('~') || 
            /^\d/.test(part) 
        );

        if (isValue) {
             // ✅ 回归 Screenshot 1 的风格：仅加粗，无背景，无边框
             return <span key={i} className="font-bold text-slate-900">{part}</span>;
        }
        
        // Stats phrases
        if (/^(median|mean|peak|min|max|score|val)\s+\d+/.test(part.toLowerCase())) {
            const [stat, val] = part.split(/\s+/);
            return <span key={i}>{stat} <span className="font-bold text-slate-900">{val}</span></span>;
        }

        return <span key={i}>{part}</span>;
    });
};

export default LlmAnswer;