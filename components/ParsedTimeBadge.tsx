import React from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { ParsedTime } from '../types';

interface ParsedTimeBadgeProps {
  data: ParsedTime;
}

export const ParsedTimeBadge: React.FC<ParsedTimeBadgeProps> = ({ data }) => {
  const formatHour = (h: number) => {
    return `${h.toString().padStart(2, '0')}:00`;
  };

  const hourRange = data.hour_window 
    ? `${formatHour(data.hour_window[0])} — ${formatHour(data.hour_window[1])}`
    : 'All 24 Hours';

  return (
    <div className="bg-polimi-50 border border-polimi-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="bg-white p-2 rounded-full text-polimi-600 shadow-sm mt-1 sm:mt-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-polimi-900 uppercase tracking-wider mb-1">Time Understanding</h3>
          <p className="text-slate-600 text-sm">
            System interpreted your query as requesting data for:
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {data.dates.map((date) => (
          <div key={date} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm font-medium text-slate-700 shadow-sm">
            <Calendar className="w-4 h-4 text-polimi-600" />
            {date}
          </div>
        ))}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm font-medium text-slate-700 shadow-sm">
          <Clock className="w-4 h-4 text-polimi-600" />
          {hourRange}
        </div>
      </div>
    </div>
  );
};