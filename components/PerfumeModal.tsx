
import React from 'react';
import { Perfume } from '../types';

interface PerfumeModalProps {
  perfume: Perfume;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const PerfumeModal: React.FC<PerfumeModalProps> = ({ perfume, isOpen, onClose, isFavorite, onToggleFavorite }) => {
  if (!isOpen) return null;

  const getFamilyIcon = (family: string) => {
    switch (family) {
      case 'Floral': return '🌸';
      case 'Woody': return '🪵';
      case 'Oriental': return '🕌';
      case 'Fresh': return '🌊';
      case 'Citrus': return '🍋';
      case 'Spicy': return '🌶️';
      case 'Leather': return '💼';
      case 'Gourmand': return '🍰';
      default: return '✨';
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden animate-slideUp flex flex-col md:flex-row max-h-[90vh] border border-white">

        {/* Visual Strip */}
        <div className="md:w-1/3 bg-slate-50 relative flex flex-col items-center justify-center p-12 border-r border-slate-100 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50" />

          <div className="relative z-10 text-[10rem] filter drop-shadow-2xl animate-pulse cursor-default">
            {getFamilyIcon(perfume.scentFamily)}
          </div>

          <div className="mt-12 text-center relative z-10">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.4em] block mb-2">Category</span>
            <span className="text-2xl font-playfair font-black text-slate-900 uppercase italic tracking-tighter">{perfume.scentFamily}</span>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-2/3 p-14 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-5xl font-playfair font-black text-slate-900 tracking-tight leading-none uppercase mb-2">{perfume.name}</h2>
              <p className="text-emerald-600 text-sm font-bold uppercase tracking-[0.2em]">{perfume.brand} — {perfume.concentration}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => onToggleFavorite(perfume.id)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm transition-all active:scale-90 border ${isFavorite ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-white border-slate-100 text-slate-300 hover:text-rose-500'
                  }`}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
              <button
                onClick={onClose}
                className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all border border-slate-100 shadow-sm"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-8">
              <section>
                <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-4 border-b border-slate-50 pb-2">Olfactory Pyramid</h3>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Top Notes</span>
                    <p className="text-sm font-medium text-slate-700">{perfume.topNotes.join(', ')}</p>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Heart Notes</span>
                    <p className="text-sm font-medium text-slate-700">{perfume.middleNotes.join(', ')}</p>
                  </div>
                  <div className="bg-slate-50/30 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Base Notes</span>
                    <p className="text-sm font-medium text-slate-700">{perfume.baseNotes.join(', ')}</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-4 border-b border-slate-50 pb-2">Olfactive DNA</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Longevity</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(v => <div key={v} className={`h-1.5 flex-1 rounded-full ${perfume.longevity >= v ? 'bg-emerald-500' : 'bg-slate-100'}`} />)}
                    </div>
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Sillage</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(v => <div key={v} className={`h-1.5 flex-1 rounded-full ${perfume.sillage >= v ? 'bg-emerald-500' : 'bg-slate-100'}`} />)}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-4 border-b border-slate-50 pb-2">Occurrence</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">{perfume.occasion}</div>
                  {perfume.season.map(s => (
                    <div key={s} className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[10px] font-bold uppercase tracking-widest">{s}</div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="mt-auto pt-10 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Market Estimation</span>
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{perfume.price} ₴</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] block mb-2">Internal ID</span>
              <span className="text-[10px] font-black text-slate-400 font-mono tracking-widest">PF-REG-{perfume.id.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfumeModal;
