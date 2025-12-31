
import React, { useState } from 'react';
import { Perfume } from '../types';
import { SCENT_FAMILIES, CONCENTRATIONS, GENDER_TYPES, OCCASIONS } from '../constants';

interface AddPerfumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Perfume) => void;
}

const AddPerfumeModal: React.FC<AddPerfumeModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<Perfume>>({
    scentFamily: 'Floral',
    gender: 'Unisex',
    concentration: 'EDP',
    longevity: 3,
    sillage: 3,
    intensity: 3,
    topNotes: [],
    middleNotes: [],
    baseNotes: [],
    season: ['Spring', 'Autumn'],
    occasion: 'Day'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Perfume = {
      ...formData as Perfume,
      id: `custom-${Date.now()}`,
    };
    onAdd(newItem);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('Notes')) {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(n => n.trim())
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['price', 'longevity', 'sillage', 'intensity'].includes(name)
          ? Number(value)
          : value
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-2xl relative animate-slideUp flex flex-col max-h-[90vh] border border-white">
        <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
          <div>
            <h2 className="text-3xl font-playfair font-black text-slate-900 uppercase italic tracking-tight">New Curation</h2>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.4em] mt-2">Registration in Global Registry</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-12 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] border-l-2 border-emerald-500 pl-4">Core Identity</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest pl-1">Composition Name</label>
                <input required name="name" onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none transition-all" placeholder="e.g. Tobacco Vanille" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest pl-1">Brand</label>
                  <input required name="brand" onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest pl-1">Class</label>
                  <select name="scentFamily" onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none transition-all appearance-none uppercase">
                    {SCENT_FAMILIES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest pl-1">Formula</label>
                  <select name="concentration" onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none transition-all appearance-none uppercase">
                    {CONCENTRATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest pl-1">Portrait</label>
                  <select name="gender" onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none transition-all appearance-none uppercase">
                    {GENDER_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] border-l-2 border-emerald-500 pl-4">Olfactory Integrity</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest pl-1">Price (₴)</label>
                  <input required type="number" name="price" onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest pl-1">Main Season</label>
                  <select name="occasion" onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none transition-all appearance-none">
                    {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                {['longevity', 'sillage', 'intensity'].map(field => (
                  <div key={field}>
                    <label className="block text-[8px] font-bold text-slate-300 uppercase mb-3 tracking-widest">{field}</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button key={v} type="button" onClick={() => setFormData(prev => ({ ...prev, [field]: v }))} className={`w-8 h-8 rounded-lg font-black text-[9px] transition-all ${formData[field as keyof Perfume] === v ? 'bg-slate-900 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}>{v}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Note Pyramid (Comma Separated)</label>
                <input name="topNotes" onChange={handleChange} className="w-full bg-slate-50 border border-transparent focus:border-emerald-500 rounded-xl p-4 text-xs font-bold text-slate-600 outline-none transition-all" placeholder="Top: Lemon, Neroli..." />
                <input name="middleNotes" onChange={handleChange} className="w-full bg-slate-50 border border-transparent focus:border-emerald-500 rounded-xl p-4 text-xs font-bold text-slate-600 outline-none transition-all" placeholder="Heart: Rose, Jasmine..." />
                <input name="baseNotes" onChange={handleChange} className="w-full bg-slate-50 border border-transparent focus:border-emerald-500 rounded-xl p-4 text-xs font-bold text-slate-600 outline-none transition-all" placeholder="Base: Vanilla, Amber..." />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-10 border-t border-slate-50 flex justify-end gap-6">
            <button type="button" onClick={onClose} className="px-8 py-4 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-all">Cancel</button>
            <button type="submit" className="px-14 py-4 bg-slate-900 text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-600 active:scale-95 transition-all">Register Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPerfumeModal;
