
import React, { useState, useEffect, useCallback } from 'react';
import { AnalysisState } from './types';
import { analyzeRisks } from './services/geminiService';
import RiskTable from './components/RiskTable';

const App: React.FC = () => {
  const [risks, setRisks] = useState('');
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    results: []
  });

  const performAnalysis = useCallback(async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const results = await analyzeRisks(textToAnalyze);
      setState({
        isLoading: false,
        error: null,
        results: results
      });
    } catch (err: any) {
      console.error(err);
      setState({
        isLoading: false,
        error: `Failed to analyze risks: ${err.message || 'Unknown error'}`,
        results: []
      });
    }
  }, []);

  const handleAnalyzeClick = () => {
    performAnalysis(risks);
  };

  const handleClear = () => {
    setRisks('');
    setState({ isLoading: false, error: null, results: [] });
    // Clear URL params without refreshing
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('risks', risks);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Support for pre-filling the input and auto-analyzing via URL parameter 'risks'
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const risksParam = params.get('risks');
    if (risksParam && risksParam.trim() !== '') {
      setRisks(risksParam);
      performAnalysis(risksParam);
    }
  }, [performAnalysis]);

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-md shadow-indigo-100">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Sentinel Risk</h1>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-[0.2em]">IT Project Analyzer</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Gemini 3 Powered
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Input Section */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <label htmlFor="risk-input" className="block text-sm font-bold text-slate-800">
                Enter your project risks
              </label>
              <div className="flex gap-2">
                {risks && (
                  <button 
                    onClick={handleClear}
                    className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-2 py-1"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            
            <div className="relative group">
              <textarea
                id="risk-input"
                className="w-full min-h-[180px] p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 text-base leading-relaxed resize-y"
                placeholder="Example: &#10;• Server may crash during peak load&#10;• Team lacks Kubernetes skills&#10;• Budget approval delayed"
                value={risks}
                onChange={(e) => setRisks(e.target.value)}
              />
              <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 font-mono pointer-events-none group-focus-within:opacity-0 transition-opacity">
                Markdown & Lists Supported
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  disabled={!risks.trim()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 disabled:opacity-30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" />
                  </svg>
                  {copied ? 'Link Copied!' : 'Share Analysis Link'}
                </button>
              </div>

              <button
                onClick={handleAnalyzeClick}
                disabled={state.isLoading || !risks.trim()}
                className={`
                  w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white transition-all shadow-lg
                  ${state.isLoading || !risks.trim() 
                    ? 'bg-slate-200 cursor-not-allowed shadow-none text-slate-400' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98]'}
                `}
              >
                {state.isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Intelligence...
                  </>
                ) : (
                  <>
                    Perform Risk Analysis
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Error Message */}
          {state.error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-4 text-red-800 animate-in fade-in zoom-in duration-300">
              <div className="bg-red-100 p-2 rounded-lg text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold uppercase tracking-wider mb-1">Analysis Failed</h4>
                <p className="text-sm opacity-90 leading-relaxed">{state.error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {state.results.length > 0 && (
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Risk Matrix</h2>
                </div>
                <div className="bg-white border border-slate-200 text-slate-600 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                  {state.results.length} VECTORS IDENTIFIED
                </div>
              </div>
              <RiskTable risks={state.results} />
            </section>
          )}

          {/* Empty State / Welcome */}
          {!state.isLoading && state.results.length === 0 && !state.error && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center animate-in fade-in duration-1000">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-100 rounded-full blur-2xl opacity-50 scale-150 animate-pulse"></div>
                <div className="relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
                  <svg className="w-16 h-16 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-slate-800 text-lg font-bold mb-2">Awaiting Intelligence Vector</h3>
              <p className="max-w-md mx-auto text-slate-500 text-sm leading-relaxed px-4">
                Paste your project concerns, meeting notes, or raw technical challenges above. 
                Our system will automatically categorize, prioritize, and suggest mitigations.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 border-t border-slate-200 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
             <span className="text-lg font-black text-slate-900 tracking-tighter">SENTINEL</span>
             <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
          </div>
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-bold text-center">
            &copy; 2025 HIGH RELIABILITY RISK MANAGEMENT SYSTEMS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
