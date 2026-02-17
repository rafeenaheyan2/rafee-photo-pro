
import React, { useState, useRef } from 'react';
import htm from 'htm';
import { LOADING_IMAGE_URL, CLOTHING_OPTIONS } from './constants.js';
import { GlossyButton } from './components/GlossyButton.js';
import { editImageWithGemini } from './services/geminiService.js';

const html = htm.bind(React.createElement);

const App = () => {
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
  const handleReset = () => state.original && setState(prev => ({ ...prev, edited: prev.original }));

  const handleAction = async (prompt) => {
    if (!state.original) return;
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    try {
      const result = await editImageWithGemini(state.edited || state.original, prompt);
      setState(prev => ({ ...prev, edited: result, isProcessing: false }));
    } catch (err) {
      setState(prev => ({ ...prev, isProcessing: false, error: err.message }));
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
    <div className="flex-1 flex flex-col items-center justify-center animate-fade">
      <div className="relative w-44 h-44 mb-12 flex items-center justify-center">
        <div className="absolute inset-0 processing-ring rounded-full scale-110 opacity-30"></div>
        <div className="absolute inset-0 processing-ring rounded-full"></div>
        <img src=${LOADING_IMAGE_URL} className="w-32 h-32 rounded-full object-cover relative z-10 rf-glow shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
      </div>
      <h3 className="text-2xl font-black text-white uppercase tracking-[0.4em] mb-2">${label}</h3>
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
      </div>
    </div>
  `;

  if (isGalaxyTransitioning) {
    return html`
      <div className="galaxy-container">
        <div className="starfield"></div>
        <div className="relative z-[10000] scale-125">
           <${Loader} label="Pro Studio" />
        </div>
      </div>
    `;
  }

  if (isProModeActive) {
    return html`
      <div className="min-h-screen bg-[#020202] text-white p-4 lg:p-10 flex flex-col animate-fade">
         <input type="file" ref=${fileInputRef} className="hidden" onChange=${handleFileUpload} accept="image/*" />
         
         <nav className="flex flex-wrap justify-between items-center mb-10 glass-panel p-6 rounded-[35px] gap-4">
            <div className="flex items-center gap-6">
              <button onClick=${() => setIsProModeActive(false)} className="w-12 h-12 rounded-2xl glossy-secondary flex items-center justify-center hover:text-red-400 group">
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              </button>
              <div>
                <h2 className="text-xl font-black tracking-tighter uppercase leading-none">PRO <span className="text-blue-500">STUDIO</span></h2>
                <span className="text-[8px] font-black text-blue-500/50 uppercase tracking-[0.4em]">Neural Static V2.5</span>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap items-center">
              <button 
                onClick=${handleSupportClick} 
                className="w-12 h-12 rounded-2xl glossy-secondary flex items-center justify-center text-blue-400 hover:text-blue-300 transition-colors"
                title="Support"
              >
                <i className="fa-solid fa-headset text-lg"></i>
              </button>
              <${GlossyButton} onClick=${handleReselectClick} variant="secondary" className="px-6 py-3 lowercase tracking-normal font-medium normal-case">Reselect Photo<//>
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
                    <button onClick=${() => handleAction("Professional Passport photo with light blue background, formal clothing, high quality")} className="w-full p-5 rounded-3xl glossy-secondary flex items-center gap-4 group">
                      <i className="fa-solid fa-id-card text-xl text-blue-400"></i>
                      <span className="text-[10px] font-black uppercase">AI Passport</span>
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
    <div className="min-h-screen p-6 md:p-16 flex flex-col items-center max-w-7xl mx-auto transition-all">
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
            <i className="fa-solid fa-headset text-blue-500 group-hover:scale-110 transition-transform"></i> Support
          </button>
          <button onClick=${startProModeTransition} className="flex items-center gap-6 px-12 py-6 rounded-3xl font-black text-[11px] uppercase transition-all bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-600/10 group">
            <i className="fa-solid fa-shuttle-space group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-blue-500"></i> Open Pro Studio
          </button>
        </div>
      </header>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          ${!state.original ? html`
            <div className="glass-panel p-28 rounded-[65px] border-dashed border-2 border-white/10 flex flex-col items-center justify-center hover:border-blue-500 transition-all cursor-pointer group" onClick=${handleReselectClick}>
                <div className="w-24 h-24 glossy-secondary rounded-[35px] flex items-center justify-center mb-12 group-hover:scale-110">
                  <i className="fa-solid fa-cloud-arrow-up text-blue-500 text-4xl"></i>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Upload Photo</h2>
            </div>
          ` : html`
            <div className="glass-panel p-10 rounded-[55px] space-y-10 shadow-2xl animate-fade">
                <div>
                  <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-6 px-1">Quick Actions</p>
                  <div className="grid grid-cols-1 gap-4">
                    <${GlossyButton} onClick=${() => handleAction("Remove background perfectly and replace with clean white")} isLoading=${state.isProcessing} variant="secondary" className="w-full py-5">Clean Background<//>
                    <${GlossyButton} onClick=${() => handleAction("Professional Passport photo, light blue background, formal attire")} isLoading=${state.isProcessing} className="w-full py-5">Auto Passport<//>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-6 px-1">
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Wardrobe</p>
                    <div className="flex glossy-secondary rounded-xl p-1.5">
                      <button onClick=${() => setActiveGenderTab('male')} className=${`px-4 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${activeGenderTab === 'male' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500'}`}>Male</button>
                      <button onClick=${() => setActiveGenderTab('female')} className=${`px-4 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${activeGenderTab === 'female' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500'}`}>Female</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                    ${CLOTHING_OPTIONS.filter(opt => opt.gender === activeGenderTab).map((opt) => html`
                      <button key=${opt.id} onClick=${() => handleAction(opt.prompt)} className="group relative aspect-square rounded-[22px] overflow-hidden border border-white/5 hover:border-blue-500 transition-all">
                        <img src=${opt.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex items-end p-3">
                          <span className="text-[8px] font-black text-white uppercase truncate">${opt.name}</span>
                        </div>
                      </button>
                    `)}
                  </div>
                </div>

                <div className="flex gap-4 pt-10 border-t border-white/5">
                   <button onClick=${handleReset} className="flex-1 py-5 rounded-3xl bg-white/5 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Reset</button>
                   <button onClick=${handleReselectClick} className="flex-1 py-5 rounded-3xl bg-blue-600/10 text-[10px] font-black uppercase text-blue-500 hover:bg-blue-600/20 transition-all">Reselect</button>
                </div>
            </div>
          `}
        </div>

        <div className="lg:col-span-8">
          ${state.original && html`
            <div className="glass-panel rounded-[80px] p-2 overflow-hidden min-h-[550px] flex flex-col shadow-2xl relative">
              ${state.isProcessing ? html`
                <${Loader} label="Rendering" />
              ` : html`
                <div className="flex-1 flex flex-col p-12 md:p-16 animate-fade">
                  <div className="flex justify-between items-center mb-12">
                     <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full border border-white/10 shadow-inner">
                       <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Engine Live</span>
                     </div>
                     <${GlossyButton} onClick=${() => {
                        const link = document.createElement('a');
                        link.href = state.edited || ''; link.download = `rafee-ai-${Date.now()}.png`; link.click();
                     }} className="px-16 py-4 rounded-[20px]">Save Photo<//>
                  </div>
                  <div className="flex-1 flex justify-center items-center">
                    <img src=${state.edited || ''} className="max-w-full max-h-[60vh] rounded-[55px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] image-glow border border-white/10" alt="Result" />
                  </div>
                </div>
              `}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
};

export default App;
