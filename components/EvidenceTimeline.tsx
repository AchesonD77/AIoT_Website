import React from 'react';
import { EvidenceChunk } from '../types';
import { FileText, AlertTriangle, Wind } from 'lucide-react';

interface EvidenceTimelineProps {
  evidence: EvidenceChunk[];
}

export const EvidenceTimeline: React.FC<EvidenceTimelineProps> = ({ evidence }) => {
  if (evidence.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-polimi-600" />
          Hourly Evidence Timeline
        </h3>
        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">{evidence.length} chunks</span>
      </div>
      
      <div className="overflow-y-auto p-4 space-y-4 timeline-scroll max-h-[600px]">
        {evidence.map((chunk, idx) => (
          <div key={chunk.id} className="relative pl-6 pb-2 border-l-2 border-slate-200 last:border-0">
            {/* Timeline Dot */}
            <div className={`
              absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 
              ${chunk.isAnomaly ? 'bg-red-50 border-red-500' : 'bg-white border-polimi-500'}
            `}></div>
            
            {/* Content Card */}
            <div className={`
              rounded-lg border p-3 text-sm transition-all hover:shadow-md
              ${chunk.isAnomaly ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-100'}
            `}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {chunk.date} @ {chunk.hour.toString().padStart(2, '0')}:00
                </span>
                {chunk.isAnomaly && (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" /> Anomaly
                  </span>
                )}
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-3">
                {chunk.snippet}
              </p>

              {/* Mini Metrics Badge */}
              {chunk.metrics && (
                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-100/50">
                  {Object.entries(chunk.metrics).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      <Wind className="w-3 h-3 text-slate-400" />
                      <span className="uppercase font-semibold">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-2 text-[10px] text-slate-400 font-mono truncate">
                src: {chunk.source}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};