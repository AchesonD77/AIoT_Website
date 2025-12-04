import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ChevronRight, ChevronDown, Database, Server } from 'lucide-react';
import { LlmResponse } from '../types';

interface ResponseInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LlmResponse | null;
}

// --- Recursive JSON Tree Component ---
const JsonNode: React.FC<{ label?: string; value: any; isLast?: boolean; level?: number }> = ({ 
  label, 
  value, 
  isLast = true, 
  level = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const isEmpty = isObject && Object.keys(value).length === 0;

  // Formatting helpers
  const renderValue = (val: any) => {
    if (val === null) return <span className="text-rose-400">null</span>;
    if (typeof val === 'string') return <span className="text-emerald-600">"{val}"</span>;
    if (typeof val === 'number') return <span className="text-blue-600">{val}</span>;
    if (typeof val === 'boolean') return <span className="text-amber-600">{val ? 'true' : 'false'}</span>;
    return <span>{String(val)}</span>;
  };

  if (!isObject) {
    return (
      <div className="font-mono text-sm leading-6 hover:bg-slate-50/50 rounded px-1 -mx-1 transition-colors flex">
        <span className="w-4 inline-block flex-shrink-0"></span> {/* Indent matching arrows */}
        {label && <span className="text-slate-500 mr-2">{label}:</span>}
        <span className="break-all">{renderValue(value)}</span>
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    );
  }

  const keys = Object.keys(value);
  const itemCount = keys.length;

  return (
    <div className="font-mono text-sm leading-6">
      <div 
        className="flex items-center cursor-pointer hover:bg-slate-50/50 rounded px-1 -mx-1 transition-colors group select-none"
        onClick={() => !isEmpty && setIsExpanded(!isExpanded)}
      >
        <span className={`w-4 h-4 flex items-center justify-center mr-0.5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
          {!isEmpty && <ChevronRight className="w-3 h-3" />}
        </span>
        
        {label && <span className="text-slate-800 font-medium mr-2">{label}:</span>}
        
        <span className="text-slate-400">
          {isArray ? '[' : '{'}
        </span>
        
        {!isExpanded && !isEmpty && (
            <span className="text-slate-400 text-xs mx-2 px-1.5 py-0.5 bg-slate-100 rounded-md group-hover:bg-slate-200 transition-colors">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
        )}
        
        {(isEmpty || !isExpanded) && (
           <span className="text-slate-400">
             {isArray ? ']' : '}'}
             {!isLast && ','}
           </span>
        )}
      </div>

      {isExpanded && !isEmpty && (
        <div className="pl-4 border-l border-slate-100 ml-2">
          {keys.map((key, idx) => (
            <JsonNode 
              key={key} 
              label={isArray ? undefined : key} 
              value={value[key]} 
              isLast={idx === itemCount - 1} 
              level={level + 1}
            />
          ))}
          <div className="pl-1">
             <span className="text-slate-400">{isArray ? ']' : '}'}</span>
             {!isLast && <span className="text-slate-400">,</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export const ResponseInspectorModal: React.FC<ResponseInspectorModalProps> = ({ isOpen, onClose, data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle CSS transition states
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden'; // Prevent scrolling bg
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Wait for fade out
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCopy = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className={`
          relative w-full max-w-4xl max-h-[85vh] flex flex-col
          bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl
          transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 bg-white/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
             <div className="bg-polimi-100 p-2 rounded-lg text-polimi-600">
                <Database className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-base font-semibold text-slate-900">Backend Response Data</h3>
                <p className="text-xs text-slate-500 font-medium">Raw JSON structure from API</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 focus:outline-none"
            >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy JSON'}
            </button>
            <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
            >
                <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
            {data ? (
                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                   <JsonNode value={data} isLast={true} />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Server className="w-12 h-12 mb-3 opacity-20" />
                    <p>No data available</p>
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200/50 bg-slate-50/30 rounded-b-2xl flex justify-between items-center text-xs text-slate-400">
           <span>Size: {JSON.stringify(data).length} bytes</span>
           <span>Status: 200 OK</span>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.3);
          border-radius: 20px;
          border: 3px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
};