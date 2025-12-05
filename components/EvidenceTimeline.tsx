import React, { useMemo, useState } from 'react';
import { CalendarClock, ArrowRight, Plus, Minus } from 'lucide-react';

interface EvidenceTimelineProps {
  answer?: string;
}

// 辅助函数：计算时间段字符串
const calculateTimeRange = (times: string[]) => {
  if (times.length === 0) return '';
  const start = times[0];
  const endItem = times[times.length - 1];
  
  const [endHourStr, endMinStr] = endItem.split(':');
  const endHour = (parseInt(endHourStr, 10) + 1) % 24;
  const formattedEndHour = endHour.toString().padStart(2, '0');
  
  return `${start}–${formattedEndHour}:${endMinStr}`;
};

// 单个时间卡片组件
const TimelineCard = ({
  date,
  displayTime,
  isFirst,
  isLast,
  toggleIcon,
  onToggle,
  isSummary = false,
}: {
  date: string;
  displayTime: string;
  isFirst: boolean;
  isLast: boolean;
  toggleIcon?: 'plus' | 'minus';
  onToggle?: () => void;
  isSummary?: boolean;
}) => {
  return (
    <div className="relative pl-8 group/item pb-4 last:pb-0">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-[-6px] w-[2px] bg-slate-100 group-hover:bg-violet-100 transition-colors duration-500" />
      )}
      
      {/* Timeline Node (The Dot or The Button) */}
      <div className="absolute left-0 top-3 z-20 flex w-6 justify-center">
        {toggleIcon ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
            className={`
              flex h-6 w-6 items-center justify-center rounded-full 
              shadow-md ring-2 ring-white cursor-pointer
              transition-all duration-300 ease-out
              hover:scale-110 active:scale-95
              ${toggleIcon === 'plus' 
                ? 'bg-violet-600 text-white shadow-violet-200' 
                : 'bg-white text-violet-600 border border-violet-100'}
            `}
          >
            {toggleIcon === 'plus' ? (
              <Plus size={14} strokeWidth={3} />
            ) : (
              <Minus size={14} strokeWidth={3} />
            )}
          </button>
        ) : (
          <div className="mt-1.5 h-3 w-3 rounded-full border-[2px] border-white bg-slate-200 shadow-sm 
                          group-hover/item:border-violet-100 group-hover/item:bg-violet-400 transition-all duration-300" />
        )}
      </div>

      {/* Content Card */}
      <div 
        onClick={toggleIcon ? onToggle : undefined}
        className={`relative flex flex-col justify-center rounded-2xl border px-5 py-4 text-sm transition-all duration-500 ease-out 
        ${toggleIcon ? 'cursor-pointer' : ''}
        ${isSummary 
            // Summary Card: 
            ? 'bg-[#F5F3FF] border-transparent shadow-sm ring-1 ring-violet-100/50 hover:bg-[#EDE9FE] hover:shadow-[0_15px_30px_-5px_rgba(124,58,237,0.2)] hover:scale-[1.02] hover:ring-violet-200' 
            
            // Regular Card: 
            : 'bg-white border-slate-100 shadow-sm hover:border-violet-200 hover:shadow-[0_15px_30px_-10px_rgba(139,92,246,0.15)] hover:bg-violet-50/60 hover:scale-[1.02]'}
        
        hover:-translate-y-1`}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300
              ${isSummary ? 'text-violet-500' : 'text-slate-400 group-hover/item:text-violet-400'}`}>
              {isSummary ? 'Daily Summary' : 'Analyzed Timestamp'}
            </span>
            <div className="flex items-baseline gap-3">
                <span className={`font-bold text-[15px] tracking-tight transition-colors duration-300 ${isSummary ? 'text-slate-900' : 'text-slate-700 group-hover/item:text-slate-900'}`}>
                    {date}
                </span>
                
                <span className={`text-sm transition-colors duration-300 ${isSummary ? 'text-violet-300' : 'text-slate-200 group-hover/item:text-violet-200'}`}>/</span>
                
                <span className={`font-mono font-bold text-[15px] transition-colors duration-300 ${isSummary ? 'text-violet-600' : 'text-slate-600 group-hover/item:text-violet-600'}`}>
                  {displayTime}
                </span>
            </div>
          </div>
          
          <ArrowRight className={`w-4 h-4 text-violet-400 transition-all duration-300 
            ${isSummary 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0'}`} 
          />
        </div>
      </div>
    </div>
  );
};

export const EvidenceTimeline: React.FC<EvidenceTimelineProps> = ({ answer }) => {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  const toggleDay = (date: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const groupedData = useMemo(() => {
    if (!answer) return [];
    const regex = /\[(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2})\]/g;
    const matches = Array.from(answer.matchAll(regex));
    const tempMap = new Map<string, Set<string>>();

    matches.forEach(m => {
      const date = m[1];
      const time = m[2];
      if (!tempMap.has(date)) tempMap.set(date, new Set());
      tempMap.get(date)?.add(time);
    });

    return Array.from(tempMap.keys()).sort().map(date => ({
      date,
      times: Array.from(tempMap.get(date)!).sort()
    }));
  }, [answer]);

  if (groupedData.length === 0) return null;
  const totalChunks = groupedData.reduce((acc, curr) => acc + curr.times.length, 0);

  return (
    <div className="group relative h-full flex flex-col overflow-hidden rounded-3xl bg-white 
                    shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] 
                    ring-1 ring-black/5 
                    transition-all duration-500 ease-out
                    hover:scale-[1.02] 
                    hover:shadow-[0_30px_80px_-12px_rgba(124,58,237,0.25)]
                    hover:ring-1 hover:ring-violet-500/20">
      
      {/* 顶部装饰光 - 增强氛围 (Hover 时增强) */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background: `radial-gradient(
            800px circle at 50% -20%,
            rgba(139, 92, 246, 0.15),
            transparent 70%
          )`
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-5 border-b border-slate-100 p-6 bg-white/80 backdrop-blur-xl sticky top-0 z-20 rounded-t-3xl">
        <div className="flex-shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-200 text-white transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6">
                <CalendarClock className="h-6 w-6" strokeWidth={2} />
            </div>
        </div>

        <div className="flex-1">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-[17px] font-bold tracking-tight text-slate-900">
                    Timeline
                    </h3>
                    <p className="text-[13px] text-slate-500 font-medium mt-0.5">
                    Hourly Updates
                    </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold group-hover:bg-violet-50 group-hover:text-violet-700 transition-colors">
                    {totalChunks} Chunks
                </span>
            </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2 timeline-scroll bg-gradient-to-b from-white/50 to-white">
        {groupedData.map((dayGroup, groupIdx) => {
          const { date, times } = dayGroup;
          const isLastGroup = groupIdx === groupedData.length - 1;
          
          const shouldCollapse = times.length >= 4;
          const isExpanded = expandedDays[date] || false;

          // 1. Summary View
          if (shouldCollapse && !isExpanded) {
            const timeRange = calculateTimeRange(times);
            return (
              <TimelineCard
                key={date}
                date={date}
                displayTime={timeRange}
                isFirst={groupIdx === 0}
                isLast={isLastGroup}
                toggleIcon="plus"
                onToggle={() => toggleDay(date)}
                isSummary={true}
              />
            );
          }

          // 2. Detailed View
          return (
            <div key={date} className="relative">
              {times.map((time, timeIdx) => {
                const [hourStr, minStr] = time.split(':');
                const startHour = parseInt(hourStr, 10);
                const endHour = (startHour + 1) % 24;
                const singleRange = `${time}–${endHour.toString().padStart(2, '0')}:${minStr}`;
                
                const isItemLast = isLastGroup && timeIdx === times.length - 1;
                const showMinus = shouldCollapse && isExpanded && timeIdx === 0;

                return (
                  <TimelineCard
                    key={`${date}-${time}`}
                    date={date}
                    displayTime={singleRange}
                    isFirst={groupIdx === 0 && timeIdx === 0}
                    isLast={isItemLast}
                    toggleIcon={showMinus ? 'minus' : undefined}
                    onToggle={showMinus ? () => toggleDay(date) : undefined}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};