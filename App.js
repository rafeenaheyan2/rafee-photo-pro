
import React, { useState, useRef, useEffect } from 'react';
import htm from 'htm';
import { LOADING_IMAGE_URL, CLOTHING_OPTIONS } from './constants.js';
import { GlossyButton } from './components/GlossyButton.js';
import { editImageWithGemini } from './services/geminiService.js';

const html = htm.bind(React.createElement);

const App = () => {
  const [hasKey, setHasKey] = useState(true);
  const [state, setState] = useState({
    original: null,
    edited: null,
    isProcessing: false,
    error: null,
  });
  
  const [isProModeActive, setIsProModeActive] = useState(false);
  const [isGalaxyTransitioning, setIsGalaxyTransitioning] = useState(false);
  const [activeGenderTab, setActiveGenderTab] = useState('male');
  const [customPrompt, setCustomPrompt] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        try {
          const keySelected = await window.aistudio.hasSelectedApiKey();
          setHasKey(keySelected);
        } catch (e) {
          console.error("Error checking key:", e);
        }
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setHasKey(true); 
        setState(prev => ({ ...prev, error: null }));
      } catch (e) {
        console.error("Error opening key selector:", e);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        setState({ original: result, edited: result, isProcessing: false, error: null });
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleReselectClick = () => fileInputRef.current?.click();
  const handleReset = () => state.original && setState(prev => ({ ...prev, edited: prev.original, error: null }));

  const handleAction = async (prompt) => {
    if (!state.original) return;
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    try {
      const result = await editImageWithGemini(state.edited || state.original, prompt);
      setState(prev => ({ ...prev, edited: result, isProcessing: false, error: null }));
    } catch (err) {
      console.error("Editing error details:", err);
      const errMsg = err.message || "An unexpected error occurred.";
      
      const errLower = errMsg.toLowerCase();
      if (errLower.includes("check your api key") || errLower.includes("not found")) {
        setHasKey(false);
      } else {
        setState(prev => ({ ...prev, isProcessing: false, error: errMsg }));
      }
    }
  };

  const startProModeTransition = () => {
    setIsGalaxyTransitioning(true);
    setTimeout(() => {
      setIsProModeActive(true);
      setIsGalaxyTransitioning(false);
    }, 2800);
  };

  const handleSupportClick = () => {
    window.open('https://692e8fbe34310.site123.me/', '_blank');
  };

  const Loader = ({ label = "Processing" }) => html`
    <div className="flex-1 flex flex-col items-center justify-center animate-fade p-10 text-center relative z-20">
      <div className="relative w-44 h-44 mb-12 flex items-center justify-center">
        <div className="absolute inset-0 processing-ring rounded-full scale-110 opacity-30"></div>
        <div className="absolute inset-0 processing-ring rounded-full"></div>
        <img src=${LOADING_IMAGE_URL} className="w-32 h-32 rounded-full object-cover relative z-10 rf-glow shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
      </div>
      <h3 className="text-2xl font-black text-white uppercase tracking-[0.4em] mb-2">${label}</h3>
      <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-6">Neural networks are synthesizing your request...</p>
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
      </div>
    </div>
  `;

  if (!hasKey) {
    return html`
      <div className="min-h-screen flex items-center justify-center p-6 text-center animate-fade relative z-10">
        <div className="glass-panel p-12 rounded-[50px] max-w-md border-white/10 shadow-2xl">
          <div className="w-20 h-20 glossy-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(59,130,246,0.6)]">
            <i className="fa-solid fa-key text-white text-3xl"></i>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Activation Required</h2>
          <p className="text-slate-400 text-xs mb-8 leading-relaxed">
            To use the full potential of Rafee AI Studio, please connect an API key.
            <br/><br/>
            <span className="text-blue-400 font-bold uppercase tracking-widest text-[9px]">Note: High-quality models require a paid Google Cloud project. If yours is free, we will automatically use high-performance Lite models.</span>
          </p>
          <${GlossyButton} onClick=${handleSelectKey} className="w-full py-5">
            Connect Engine Key
          <//>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block mt-6 text-[10px] text-blue-500/50 uppercase font-black hover:text-blue-500 transition-all">
            Billing & Documentation
          </a>
        </div>
      </div>
    `;
  }

  if (isGalaxyTransitioning) {
    return html`
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
         <${Loader} label="Pro Studio" />
      </div>
    `;
  }

  if (isProModeActive) {
    return html`
      <div className="min-h-screen text-white p-4 lg:p-10 flex flex-col animate-fade relative z-10">
         <input type="file" ref=${fileInputRef} className="hidden" onChange=${handleFileUpload} accept="image/*" />
         
         <nav className="flex flex-wrap justify-between items-center mb-10 glass-panel p-6 rounded-[35px] gap-4">
            <div className="flex items-center gap-6">
              <button onClick=${() => setIsProModeActive(false)} className="w-12 h-12 rounded-2xl glossy-secondary flex items-center justify-center hover:text-red-400 group">
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              </button>
              <div>
                <h2 className="text-xl font-black tracking-tighter uppercase leading-none">PRO <span className="text-blue-500">STUDIO</span></h2>
                <span className="text-[8px] font-black text-blue-500/50 uppercase tracking-[0.4em]">Neural Engine V3.1</span>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap items-center">
              <button onClick=${handleSupportClick} className="w-12 h-12 rounded-2xl glossy-secondary flex items-center justify-center text-blue-400 hover:text-blue-300">
                <i className="fa-solid fa-headset"></i>
              </button>
              <${GlossyButton} onClick=${handleReselectClick} variant="secondary" className="px-6 py-3 normal-case font-medium">Reselect Photo<//>
              ${state.original && html`
                <${GlossyButton} onClick=${() => {
                  const link = document.createElement('a');
                  link.href = state.edited || ''; link.download = `rafee-pro-${Date.now()}.png`; link.click();
                }} className="px-10 py-3">Download HD<//>
              `}
            </div>
         </nav>

         <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <aside className="lg:col-span-3 space-y-8">
               <div className="glass-panel p-8 rounded-[45px] space-y-8 border-white/5 shadow-2xl">
                  ${state.error && html`
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-tight mb-2 animate-pulse">
                       <i className="fa-solid fa-triangle-exclamation mr-2"></i> ${state.error}
                    </div>
                  `}
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 px-1">Neural Terminal</p>
                    <textarea 
                      value=${customPrompt}
                      onChange=${(e) => setCustomPrompt(e.target.value)}
                      placeholder="Type neural command..."
                      className="w-full h-32 p-5 rounded-3xl command-input text-[11px] text-slate-300 resize-none mb-4 font-medium"
                    />
                    <${GlossyButton} 
                      onClick=${() => customPrompt && handleAction(customPrompt)} 
                      isLoading=${state.isProcessing}
                      disabled=${!customPrompt || !state.original}
                      className="w-full py-4 text-xs"
                    >
                      Run Command
                    <//>
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Pro Core Actions</p>
                    <button onClick=${() => handleAction("Professional Passport photo with light blue background, formal clothing, high quality")} className="w-full p-5 rounded-3xl glossy-secondary flex items-center gap-4 group disabled:opacity-50" disabled=${state.isProcessing}>
                      <i className="fa-solid fa-id-card text-xl text-blue-400"></i>
                      <span className="text-[10px] font-black uppercase">AI Passport</span>
                    </button>
                    <button onClick=${() => handleAction("Enhance quality, sharp 4k details, realistic texture")} className="w-full p-5 rounded-3xl glossy-secondary flex items-center gap-4 group disabled:opacity-50" disabled=${state.isProcessing}>
                      <i className="fa-solid fa-wand-magic-sparkles text-xl text-indigo-400"></i>
                      <span className="text-[10px] font-black uppercase">Ultra Enhance</span>
                    </button>
                    <button onClick=${() => handleAction("Significantly increase color saturation, make colors punchy and vibrant while maintaining realistic skin tones")} className="w-full p-5 rounded-3xl glossy-secondary flex items-center gap-4 group disabled:opacity-50" disabled=${state.isProcessing}>
                      <i className="fa-solid fa-palette text-xl text-orange-400"></i>
                      <span className="text-[10px] font-black uppercase">Color Boost</span>
                    </button>
                  </div>

                  <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                    <button onClick=${handleReset} className="py-4 rounded-2xl bg-white/5 text-[9px] font-black uppercase hover:bg-white/10 transition-all">Reset</button>
                    <button onClick=${handleReselectClick} className="py-4 rounded-2xl bg-blue-600/10 text-[9px] font-black uppercase text-blue-500 hover:bg-blue-600/20 transition-all">New</button>
                  </div>
               </div>
            </aside>

            <main className="lg:col-span-9 glass-panel rounded-[70px] p-2 flex flex-col min-h-[600px] border-white/10 relative overflow-hidden shadow-2xl">
               ${state.isProcessing ? html`
                 <${Loader} label="Synthesizing" />
               ` : !state.original ? html`
                 <div className="flex-1 flex flex-col items-center justify-center cursor-pointer group" onClick=${handleReselectClick}>
                    <div className="w-28 h-28 rounded-[40px] glossy-secondary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-blue-500/50">
                      <i className="fa-solid fa-plus text-4xl text-blue-500"></i>
                    </div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Load Frame for Processing</p>
                 </div>
               ` : html`
                 <div className="flex-1 flex flex-col p-12 animate-fade">
                    <div className="flex-1 flex justify-center items-center">
                      <img src=${state.edited || ''} className="max-w-full max-h-[65vh] rounded-[50px] shadow-2xl image-glow border border-white/10" />
                    </div>
                 </div>
               `}
            </main>
         </div>
      </div>
    `;
  }

  return html`
    <div className="min-h-screen p-6 md:p-16 flex flex-col items-center max-w-7xl mx-auto transition-all relative z-10">
      <input type="file" ref=${fileInputRef} className="hidden" onChange=${handleFileUpload} accept="image/*" />
      
      <header className="w-full flex flex-col md:flex-row justify-between items-center mb-16 gap-10 glass-panel p-12 rounded-[55px] animate-fade">
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 glossy-primary rounded-[24px] flex items-center justify-center shadow-2xl">
            <i className="fa-solid fa-bolt-lightning text-2xl text-white"></i>
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">RAFEE <span className="text-blue-500">PHOTO</span> AI</h1>
            <p className="text-slate-500 text-[10px] font-black tracking-[0.6em] uppercase">Visual Processing Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick=${handleSupportClick} className="flex items-center gap-3 px-8 py-6 rounded-3xl font-black text-[11px] uppercase transition-all bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-600/10 group">
             <i className="fa-solid fa-headset text-blue-500"></i> Support
          </button>
          <button onClick=${startProModeTransition} className="flex items-center gap-6 px-12 py-6 rounded-3xl font-black text-[11px] uppercase transition-all bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-600/10 group">
            <i className="fa-solid fa-shuttle-space group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-blue-500"></i> Open Pro Studio
          </button>
        </div>
      </header>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          ${state.error && html`
            <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center animate-fade">
              ${state.error}
            </div>
          `}
          ${!state.original ? html`
            <div className="glass-panel p-28 rounded-[65px] border-dashed border-2 border-white/10 flex flex-col items-center justify-center hover:border-blue-500 transition-all cursor-pointer group" onClick=${handleReselectClick}>
                <div className="w-24 h-24 glossy-secondary rounded-[35px] flex items-center justify-center mb-12 group-hover:scale-110">
                  <i className="fa-solid fa-cloud-arrow-up text-blue-500 text-4xl"></i>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Upload Photo</h2>
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">JPG, PNG OR WEBP</p>
            </div>
          ` : html`
            <div className="glass-panel p-10 rounded-[55px] space-y-10 shadow-2xl animate-fade">
                <div>
                  <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-6 px-1">Quick Actions</p>
                  <div className="grid grid-cols-1 gap-4">
                    <${GlossyButton