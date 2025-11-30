import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { QueryInput } from './components/QueryInput';
import { ParsedTimeBadge } from './components/ParsedTimeBadge';
import { EvidenceTimeline } from './components/EvidenceTimeline';
import { LlmAnswer } from './components/LlmAnswer';
import { DebugPanel } from './components/DebugPanel';
import { fetchAnalysis } from './services/apiService';
import { QueryState } from './types';

const App: React.FC = () => {
  const [queryState, setQueryState] = useState<QueryState>({
    isLoading: false,
    error: null,
    data: null
  });
  
  // Lifted state for the search input so we can clear it from outside (Header)
  const [searchQuery, setSearchQuery] = useState('');
  
  // State to track if we are currently animating the close/reset action
  const [isClosing, setIsClosing] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Determine if we are in "Results Mode".
  // logic: We have data, AND we are not currently in the process of closing/resetting.
  // This ensures the Hero expands immediately when 'isClosing' becomes true.
  const hasResults = !!queryState.data && !isClosing;

  useEffect(() => {
    // When data arrives and we are not loading, scroll to top to show the cleaner layout
    if (hasResults && !queryState.isLoading) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [hasResults, queryState.isLoading]);

  const handleSearch = async (query: string) => {
    setQueryState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await fetchAnalysis(query);
      setQueryState({
        isLoading: false,
        error: null,
        data: result
      });
    } catch (err) {
      setQueryState({
        isLoading: false,
        error: "Failed to fetch analysis. Please check backend connection.",
        data: null
      });
    }
  };

  const handleReset = () => {
    // Clear the search input
    setSearchQuery('');

    // 1. Start closing animation (triggers Hero expansion immediately)
    setIsClosing(true);
    
    // 2. Instant scroll to top. 
    // Changing from 'smooth' to 'auto' (instant) prevents layout thrashing stutter
    // that occurs when smooth scrolling competes with the Hero section's height expansion animation.
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });

    // 3. Wait for the CSS transitions (700ms) + buffer to finish before unmounting data.
    setTimeout(() => {
      setQueryState({
        isLoading: false,
        error: null,
        data: null
      });
      setIsClosing(false);
    }, 800); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header onReset={handleReset} />
      
      {/* Added 'relative' to allow absolute positioning of the Results section during exit */}
      <main className="flex-grow flex flex-col relative">
        {/* Hero Section */}
        <div className={`
          relative w-full border-b border-slate-200 overflow-hidden flex flex-col items-center justify-center 
          transition-all duration-700 ease-in-out transform-gpu will-change-[min-height,padding]
          ${hasResults ? 'min-h-[140px] pt-24 pb-6 bg-slate-50 flex-none' : 'min-h-[600px] flex-grow'}
        `}>
            {/* Background Image - Fades out in Results Mode */}
            <div 
              className={`absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-1000 ease-in-out will-change-opacity ${hasResults ? 'opacity-0' : 'opacity-100'}`}
              style={{ 
                backgroundImage: 'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop")',
              }}
            ></div>
            
            {/* Gradient Overlay - Fades out in Results Mode */}
            <div className={`absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent z-10 transition-opacity duration-1000 ${hasResults ? 'opacity-0' : 'opacity-100'}`}></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex flex-col items-center">
                <div className="max-w-4xl w-full mx-auto text-center flex flex-col items-center">
                    
                    {/* Collapsible Content Wrapper (Title, Description, Logo) */}
                    {/* Using CSS Grid transition for smoother height animation than max-height */}
                    <div className={`
                      grid transition-[grid-template-rows] duration-700 ease-in-out w-full
                      ${hasResults ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
                    `}>
                        <div className="overflow-hidden flex flex-col items-center">
                            {/* Inner content container with spacing, 搜索页中心内容 */}
                            <div className="mb-10 pt-4"> 
                              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-polimi-900 tracking-tight mb-6 leading-[1.1]">
                                  Time-Aware <br className="hidden sm:block" />
                                  <span className="text-polimi-600">Analytics</span> for IoT Systems
                              </h1>
                              
                              <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                  A retrieval-augmented generation architecture transforming raw sensor streams into evidence-based narratives. Bridging the gap between natural language time expressions and precise sensor logs.
                              </p>

                              {/* 自定义的图片Logo 
                              <div className="flex justify-center">
                                <img 
                                  src="/universit_lab_log.png" 
                                  alt="University Lab Logo" 
                                  className="h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                              */}
                            </div>
                        </div>
                    </div>
                    
                    {/* Search Input - Always visible, moves smoothly as grid above expands/collapses */}
                    <div className="w-full max-w-2xl transition-all duration-500 transform-gpu">
                        <QueryInput 
                          value={searchQuery}
                          onChange={setSearchQuery}
                          onSearch={handleSearch} 
                          isLoading={queryState.isLoading} 
                          hideSuggestions={hasResults} // Hide suggestions when in results mode
                          onReset={handleReset}
                          hasResults={hasResults}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Results Section */}
        {/* We keep rendering this section if data exists OR if we are in the closing animation phase */}
        {(queryState.data || isClosing) && queryState.data && (
            <div 
              ref={resultsRef}
              className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 bg-slate-50/50 transition-all duration-500 ease-in-out transform-gpu ${
                isClosing 
                  // Fix for layout stutter: Position absolute during closing to remove from flow immediately.
                  // This allows the Hero section (which is flex-grow) to calculate its final size correctly
                  // without being affected by the disappearing Results sibling.
                  ? 'absolute left-0 right-0 top-full opacity-0 translate-y-20 scale-[0.98] pointer-events-none'  
                  : 'opacity-100 translate-y-0 scale-100 animate-fade-in-up' // Enter/Active State
              }`}
            >
                
                {/* 1. Time Understanding */}
                <div className="mb-8">
                    <ParsedTimeBadge data={queryState.data.parsed_data} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* 2. Left Column: Timeline (Evidence) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <EvidenceTimeline evidence={queryState.data.evidence} />
                    </div>

                    {/* 3. Right Column: LLM Report */}
                    <div className="lg:col-span-8">
                        <LlmAnswer answer={queryState.data.llm_answer} />
                        
                        {/* Meta info */}
                        <div className="mt-4 flex gap-4 text-xs text-slate-400 justify-end">
                            <span>Processing time: {queryState.data.processing_time}s</span>
                            <span>Model: GPT-5 (Simulated)</span>
                        </div>
                    </div>
                </div>
                
                <DebugPanel data={queryState.data} />
            </div>
        )}
      </main>
        {/* py-7 控制的是下层component的宽度，越大越宽*/} 
      <footer className="bg-[#f5f5f7] border-t border-slate-200 py-7 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-3">
          
          {/* Top tagline - Matches 'IoTLab' style (Blue) - Changed to text-sm */}
          <div className="text-sm text-polimi-900 font-bold tracking-wide">
            Unlock IoT Intelligence <span className="mx-1.5 text-slate-400 font-normal">·</span> Reveal the Invisible <span className="mx-1.5 text-slate-400 font-normal">·</span> See Data Differently
          </div>

          {/* Merged Copyright Section - Matches 'AI and Data Analysis' style (Grey) - Changed to text-xs */}
          <div className="text-xs leading-relaxed text-slate-500 font-medium">
            Copyright &copy;  2025 <a href="https://github.com/AchesonD77" target="_blank" rel="noopener noreferrer" className="hover:text-polimi-700 transition-colors">Qixun Dan</a>
            <span className="mx-1.5 text-slate-300">·</span>
            <a href="https://www.iotlab.polimi.it/" target="_blank" rel="noopener noreferrer" className="hover:text-polimi-700 transition-colors">IoT AI Research Group</a>
            <span className="mx-1.5 text-slate-300">·</span>
            <a href="https://www.polimi.it/" target="_blank" rel="noopener noreferrer" className="hover:text-polimi-700 transition-colors">Politecnico di Milano</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
