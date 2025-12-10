import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas'; // ✅ 新增
import jsPDF from 'jspdf'; // ✅ 新增
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
  "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2674&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2560&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2560&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=2560&auto=format&fit=crop"  
];

const App: React.FC = () => {
  const [queryState, setQueryState] = useState<QueryState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  
  // ✅ 新增: 截图生成 PDF 时的 loading 状态
  const [isCapturing, setIsCapturing] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const isResultsLayout = (!!queryState.data || queryState.isLoading) && !isClosing;
  const showResultsContent = !!queryState.data && !queryState.isLoading;

  const [heroImage] = useState(() => {
    const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    return BACKGROUND_IMAGES[randomIndex];
  });

  useEffect(() => {
    if (isResultsLayout) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [isResultsLayout]);

  const handleSearch = async (query: string) => {
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
    setSearchQuery('');
    setIsClosing(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
    setTimeout(() => {
      setQueryState({ isLoading: false, error: null, data: null });
      setIsClosing(false);
    }, 800);
  };

  // ✅ 新增: 处理 PDF 下载逻辑
  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return;
    
    setIsCapturing(true);

    try {
      // 1. 使用 html2canvas 捕获 DOM
      // useCORS: true 允许跨域加载图片 (虽然你的 Unsplash 图片可能需要后端代理，但一般配置了 CORS 即可)
      // scale: 2 提高清晰度 (Retina 屏幕适配)
      const canvas = await html2canvas(resultsRef.current, {
        useCORS: true,
        scale: 2, 
        backgroundColor: '#ffffff', // 确保背景是白色的，避免透明背景变黑
        logging: false
      });

      // 2. 转换为图片数据
      const imgData = canvas.toDataURL('image/png');

      // 3. 计算 PDF 尺寸 (A4 纵向)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // 4. 添加图片到 PDF (如果内容过长，这里目前只生成一页，长图会自动缩放)
      // 这里的 0, 0 是 x, y 坐标，pdfWidth, imgHeight 是目标尺寸
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);

      // 5. 保存
      pdf.save(`Analysis_Report_${new Date().toISOString().slice(0, 10)}.pdf`);

    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <div className="relative z-[100]">
        {/* ✅ 修改: 传递新增的 Props 给 Header */}
        <Header 
          onReset={handleReset} 
          onCapture={handleDownloadPDF}
          canCapture={showResultsContent} // 只有显示结果内容时才能下载
          isCapturing={isCapturing}
        />
      </div>

      <main className="flex-grow flex flex-col relative">
        <div
          className={`
          relative w-full border-b border-slate-200 flex flex-col items-center justify-center z-50
          transition-all duration-700 ease-in-out transform-gpu will-change-[min-height,padding]
          ${isResultsLayout ? 'min-h-[140px] pt-24 pb-6 bg-slate-50 flex-none' : 'min-h-[600px] flex-grow'}
        `}
        >
            <div 
              className={`absolute inset-0 bg-cover bg-[center_top_30%] z-0 transition-opacity duration-1000 ease-in-out will-change-opacity ${isResultsLayout ? 'opacity-0' : 'opacity-100'}`}
              style={{ backgroundImage: `url("${heroImage}")` }}
            ></div>

          <div
            className={`absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent z-10 transition-opacity duration-1000 ${
              isResultsLayout ? 'opacity-0' : 'opacity-100'
            }`}
          ></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex flex-col items-center">
            <div className="max-w-4xl w-full mx-auto text-center flex flex-col items-center">
              <div
                className={`
                      grid transition-[grid-template-rows] duration-700 ease-in-out w-full
                      ${isResultsLayout ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}
                    `}
              >
                <div className="overflow-hidden flex flex-col items-center">
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

              <div className="w-full max-w-2xl transition-all duration-500 transform-gpu">
                <QueryInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  isLoading={queryState.isLoading}
                  hideSuggestions={isResultsLayout}
                  onReset={handleReset}
                  hasResults={showResultsContent}
                />
              </div>
            </div>
          </div>
        </div>

        {queryState.isLoading && (
          <div className="flex-grow flex items-center justify-center min-h-[400px]">
            <LoadingView />
          </div>
        )}

        {(showResultsContent || isClosing) && queryState.data && (
          <div
            ref={resultsRef}
            className={`relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white/30 backdrop-blur-lg rounded-3xl mt-6 transition-all duration-500 ease-in-out transform-gpu ${
              isClosing
                ? 'absolute left-0 right-0 top-full opacity-0 translate-y-20 scale-[0.98] pointer-events-none'
                : 'opacity-100 translate-y-0 scale-100 animate-fade-in-up'
            }`}
          >
            {/* 背景光效保持不变 */}
            <div className="pointer-events-none absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-violet-400/30 via-purple-300/20 to-indigo-200/10 blur-[100px] -z-10 animate-pulse-slow"></div>
            
            <div className="pointer-events-none absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-violet-400/30 via-purple-300/20 to-indigo-200/10 blur-[120px] -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

            {/* ✅ 新增部分 Start: 在 PDF 和结果卡片中显示用户的提问 */}
            <div className="mb-8 border-b border-slate-200/60 pb-6 relative z-10">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Analysis Query
              </h2>
              <p className="text-xl sm:text-2xl font-medium text-slate-800 leading-relaxed font-serif italic">
                “{searchQuery}”
              </p>
            </div>
            {/* ✅ 新增部分 End */}

            <div className="mb-8 relative z-10">
              <ParsedTimeBadge answer={queryState.data?.llm_answer} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              {/* ... (后续内容保持不变) */}
              <div className="lg:col-span-4 lg:sticky lg:top-24">
                <EvidenceTimeline answer={queryState.data?.llm_answer} />
              </div>

              <div className="lg:col-span-8">
                <LlmAnswer answer={queryState.data.llm_answer} />
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

      <footer className="bg-[#f5f5f7] border-t border-slate-200 py-7 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-3">
          <div className="text-sm text-polimi-900 font-bold tracking-wide">
            Unlock IoT Intelligence <span className="mx-1.5 text-slate-400 font-normal">·</span> Reveal the
            Invisible <span className="mx-1.5 text-slate-400 font-normal">·</span> See Data Differently
          </div>

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