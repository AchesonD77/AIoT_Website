import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code } from 'lucide-react';
import { LlmResponse } from '../types';

interface DebugPanelProps {
  data: LlmResponse;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-slate-200 bg-slate-50 mt-12">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-sm text-slate-500 hover:text-polimi-900 transition-colors"
      >
        <div className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            <span>Developer / Debug View</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isOpen && (
        <div className="p-4 overflow-x-auto bg-slate-900 text-slate-200 text-xs font-mono">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};