import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { QueryInput } from './components/QueryInput';
import { ParsedTimeBadge } from './components/ParsedTimeBadge';
import { EvidenceTimeline } from './components/EvidenceTimeline';
import { LlmAnswer } from './components/LlmAnswer';
import { DebugPanel } from './components/DebugPanel';
import { LoadingView } from './components/LoadingView';
import { fetchAnalysis } from './services/apiService';
import { QueryState } from './types';

// Curated list of high-quality forest/nature background images
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2674&auto=format&fit=crop", // Original Forest
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop", // Sunlight through trees
  "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2560&auto=format&fit=crop", // Misty mysterious forest
  "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2560&auto=format&fit=crop", // Deep dark woods
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=2560&auto=format&fit=crop"  // Cold/Clean Nature
];

const App: React.FC = () => {
  const [queryState, setQueryState] = useState<QueryState>({
    isLoading: false,
    error: null,
    data: null,
  });

  // Lifted state for the search input so we can clear it from outside (Header)
  const [searchQuery, setSearchQuery] = useState('');

  // State to track if we are currently animating the close/reset action
  const [isClosing, setIsClosing] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Layout Logic:
  // We want to enter "Results Layout" (compact Hero) if:
  // 1. We have data.
  // 2. OR we are currently loading (so we can show the beautiful loader in the main area).
  // 3. AND we are not in the middle of resetting (isClosing).
  const isResultsLayout = (!!queryState.data || queryState.isLoading) && !isClosing;

  // We only show the actual results content if we have data AND we are not loading.
  const showResultsContent = !!queryState.data && !queryState.isLoading;

  // Initialize background image only once on mount
  const [heroImage] = useState(() => {
    const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    return BACKGROUND_IMAGES[randomIndex];
  });

  useEffect(() => {
    // When switching to results layout, scroll to top
    if (isResultsLayout) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [isResultsLayout]);

  const handleSearch = async (query: string) => {
    // Clear previous data while loading
    setQueryState((prev) => ({ ...prev, isLoading: true, error: null, data: null }));

    try {
      const result = await fetchAnalysis(query);
      setQueryState({
        isLoading: false,
        error: null,
        data: result,
      });
    } catch (err) {
      setQueryState({
        isLoading: false,
        error: 'Failed to fetch analysis. Please check backend connection.',
        data: null,
      });
    }
  };

  const handleReset = () => {
    // Clear the search input
    setSearchQuery('');

    // 1. Start closing animation
    setIsClosing(true);

    // 2. Instant scroll to top.
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });

    // 3. Wait for the CSS transitions (700ms) + buffer to finish before unmounting data.
    setTimeout(() => {
      setQueryState({
        isLoading: false,
        error: null,
        data: null,
      });
      setIsClosing(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 👇 在这里修改，添加外层 div 和 z-[100] */}
      <div className="relative z-[100]">
        <Header onReset={handleReset} />
      </div>

      {/* Added 'relative' to allow absolute positioning of the Results section during exit */}
      <main className="flex-grow flex flex-col relative">
        {/* Hero Section */}
        {/* ✅ 修改点: 移除 overflow-hidden 并添加 z-50，确保 Tooltip 可以显示在容器外部且层级最高 */}
        <div
          className={`
          relative w-full border-b border-slate-200 flex flex-col items-center justify-center z-50
          transition-all duration-700 ease-in-out transform-gpu will-change-[min-height,padding]
          ${isResultsLayout ? 'min-h-[140px] pt-24 pb-6 bg-slate-50 flex-none' : 'min-h-[600px] flex-grow'}
        `}
        >
            {/* Background Image - Fades out in Results Mode */}
            {/* CHANGED: Used state variable heroImage instead of hardcoded URL */}
            <div 
              className={`absolute inset-0 bg-cover bg-[center_top_30%] z-0 transition-opacity duration-1000 ease-in-out will-change-opacity ${isResultsLayout ? 'opacity-0' : 'opacity-100'}`}
              style={{ 
                backgroundImage: `url("${heroImage}")`,
              }}
            ></div>

          {/* Gradient Overlay - Fades out in Results Mode */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent z-10 transition-opacity duration-1000 ${
              isResultsLayout ? 'opacity-0' : 'opacity-100'
            }`}
          ></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex flex-col items-center">
            <div className="max-w-4xl w-full mx-auto text-center flex flex-col items-center">
              {/* Collapsible Content Wrapper (Title, Description) */}
              {/* Using CSS Grid transition for smoother height animation */}
              <div
                className={`
                      grid transition-[grid-template-rows] duration-700 ease-in-out w-full
                      ${isResultsLayout ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
                    `}
              >
                <div className="overflow-hidden flex flex-col items-center">
                  {/* Inner content container with spacing */}
                  <div className="mb-10 pt-4">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-polimi-900 tracking-tight mb-6 leading-[1.1]">
                      Time-Aware <br className="hidden sm:block" />
                      <span className="text-polimi-600">Analytics</span> for IoT Systems
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                      A retrieval-augmented generation architecture transforming raw sensor streams into
                      evidence-based narratives. Bridging the gap between natural language time expressions and
                      precise sensor logs.
                    </p>
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
                  // Hide suggestions when in results mode or loading
                  hideSuggestions={isResultsLayout}
                  onReset={handleReset}
                  // Only show 'X' clear button if we actually have results
                  hasResults={showResultsContent}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading View */}
        {queryState.isLoading && (
          <div className="flex-grow flex items-center justify-center min-h-[400px]">
            <LoadingView />
          </div>
        )}

        {/* Results Section */}
        {/* We keep rendering this section if data exists OR if we are in the closing animation phase */}
        {(showResultsContent || isClosing) && queryState.data && (
          <div
            ref={resultsRef}
            // ✅ 修改点 1: 容器样式调整
            // - 添加 relative 和 overflow-hidden 以包含背景光影
            // - 将背景色从 bg-slate-50/50 改为更透明的 bg-white/30
            // - 添加 backdrop-blur-lg 制造毛玻璃效果，使背景光影更柔和地透出
            className={`relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white/30 backdrop-blur-lg rounded-3xl mt-6 transition-all duration-500 ease-in-out transform-gpu ${
              isClosing
                ? // Fix for layout stutter: Position absolute during closing to remove from flow immediately.
                  'absolute left-0 right-0 top-full opacity-0 translate-y-20 scale-[0.98] pointer-events-none'
                : 'opacity-100 translate-y-0 scale-100 animate-fade-in-up' // Enter/Active State
            }`}
          >
            {/* ✅ 修改点 2: 添加 Apple 风格背景光影 (Blobs) */}
            {/* Blob 1: 右上角 - 修改为紫色调 (Violet/Purple) */}
            <div className="pointer-events-none absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-violet-400/30 via-purple-300/20 to-indigo-200/10 blur-[100px] -z-10 animate-pulse-slow"></div>
            
            {/* Blob 2: 左下角 - 修改为紫色调 (Violet/Purple) - 保持一致 */}
            <div className="pointer-events-none absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-violet-400/30 via-purple-300/20 to-indigo-200/10 blur-[120px] -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

            {/* 1. Time Understanding */}
            <div className="mb-8 relative z-10">
              <ParsedTimeBadge answer={queryState.data?.llm_answer} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              {/* 2. Left Column: Timeline (Evidence) */}
              <div className="lg:col-span-4 lg:sticky lg:top-24">
                <EvidenceTimeline answer={queryState.data?.llm_answer} />
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
          {/* Top tagline */}
          <div className="text-sm text-polimi-900 font-bold tracking-wide">
            Unlock IoT Intelligence <span className="mx-1.5 text-slate-400 font-normal">·</span> Reveal the
            Invisible <span className="mx-1.5 text-slate-400 font-normal">·</span> See Data Differently
          </div>

          {/* Copyright Section */}
          <div className="text-xs leading-relaxed text-slate-500 font-medium">
            Copyright &copy; 2025{' '}
            <a
              href="https://github.com/AchesonD77"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-polimi-700 transition-colors"
            >
              Qixun Dan
            </a>
            <span className="mx-1.5 text-slate-300">·</span>
            <a
              href="https://www.iotlab.polimi.it/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-polimi-700 transition-colors"
            >
              IoT AI Research Group
            </a>
            <span className="mx-1.5 text-slate-300">·</span>
            <a
              href="https://www.polimi.it/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-polimi-700 transition-colors"
            >
              Politecnico di Milano
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;