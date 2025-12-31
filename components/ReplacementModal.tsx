
import React from 'react';
import { Perfume, Recommendation } from '../types';

interface ReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalItem: Perfume;
  alternatives: Recommendation[];
  allItems: Perfume[];
  onSelect: (perfumeId: string) => void;
  onAutoSelect: () => void;
}

const ReplacementModal: React.FC<ReplacementModalProps> = ({
  isOpen, onClose, originalItem, alternatives, allItems, onSelect, onAutoSelect
}) => {
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/5 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] flex flex-col border border-white">
        <div className="p-12 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-3xl font-playfair font-black text-slate-900 uppercase italic tracking-tighter">Match Optimization</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Replacing: <span className="text-emerald-600 border-b border-emerald-100">{originalItem.name}</span></p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-slate-900 border border-slate-100 shadow-sm transition-all active:scale-90"
          >
            ✕
          </button>
        </div>

        <div className="p-12 overflow-y-auto custom-scrollbar space-y-12 flex-grow">
          <button
            onClick={onAutoSelect}
            className="w-full bg-slate-900 text-white p-10 rounded-[3rem] flex items-center justify-between group hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
          >
            <div className="text-left">
              <span className="block text-[9px] font-bold uppercase tracking-[0.4em] text-white/50 mb-3">Scent Analysis AI</span>
              <span className="text-2xl font-playfair font-bold italic tracking-tight uppercase leading-none">Automated Olfactive Harmony</span>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-4xl group-hover:rotate-180 transition-transform duration-[2s]">🔄</div>
          </button>

          <div className="grid grid-cols-1 gap-6">
            <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] ps-4">Alternative Curations</h3>
            {alternatives.map((rec) => {
              const item = allItems.find(i => i.id === rec.perfumeId);
              if (!item) return null;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className="w-full bg-white border border-slate-100 p-8 rounded-[3rem] flex items-center justify-between text-left hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all group active:scale-[0.99] shadow-sm"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-5xl filter grayscale group-hover:grayscale-0 transition-all duration-700">{getFamilyIcon(item.scentFamily)}</div>
                    <div>
                      <h4 className="font-playfair font-black text-2xl text-slate-900 tracking-tighter leading-tight uppercase italic">{item.name}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{item.brand}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.price} ₴</span>
                      </div>
                      <p className="text-[14px] text-slate-500 mt-5 line-clamp-2 italic font-medium leading-relaxed max-w-lg">"{rec.explanation}"</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-bold text-slate-900 bg-emerald-50 px-4 py-2 rounded-full mb-6 tracking-widest border border-emerald-100 uppercase">MATCH: {rec.score}%</div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-emerald-600 transition-all">Select Excellence →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100 text-center shrink-0">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">Atelier X Engine — Optimization Module v3.2</p>
        </div>
      </div>
    </div>
  );
};

export default ReplacementModal;
