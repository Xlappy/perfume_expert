
import React, { useState } from 'react';
import { Perfume } from '../types';
import { SCENT_FAMILIES, CONCENTRATIONS, GENDER_TYPES } from '../constants';

interface PerfumeTableProps {
  items: Perfume[];
  onUpdate: (updatedItems: Perfume[]) => void;
  title: string;
}

const PerfumeTable: React.FC<PerfumeTableProps> = ({ items, onUpdate, title }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Видалити цей аромат з архіву?')) {
      onUpdate(items.filter(i => i.id !== id));
    }
  };

  const handleEditChange = (id: string, field: keyof Perfume, value: any) => {
    onUpdate(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center justify-between mb-8 px-6">
        <h3 className="text-xl font-playfair font-black text-slate-900 tracking-tight uppercase italic">{title}</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{items.length} Entries Detected</span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 first:rounded-tl-[2rem]">Perfume Name</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Brand</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Olfactive Class</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Price (₴)</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 last:rounded-tr-[2rem] text-right">Registry Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item) => (
              <tr key={item.id} className="group hover:bg-emerald-50/30 transition-colors">
                <td className="px-8 py-6">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleEditChange(item.id, 'name', e.target.value)}
                    className="bg-transparent font-playfair font-bold text-lg text-slate-900 outline-none w-full focus:text-emerald-600 transition-colors"
                  />
                </td>
                <td className="px-8 py-6">
                  <input
                    type="text"
                    value={item.brand}
                    onChange={(e) => handleEditChange(item.id, 'brand', e.target.value)}
                    className="bg-transparent text-[11px] font-bold text-slate-400 uppercase tracking-widest outline-none transition-colors"
                  />
                </td>
                <td className="px-8 py-6">
                  <select
                    value={item.scentFamily}
                    onChange={(e) => handleEditChange(item.id, 'scentFamily', e.target.value)}
                    className="bg-transparent text-[10px] font-black py-1 px-3 rounded-full border border-slate-200 text-slate-600 uppercase tracking-tighter outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {SCENT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-bold">₴</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleEditChange(item.id, 'price', Number(e.target.value))}
                      className="bg-transparent font-black text-slate-800 outline-none w-24"
                    />
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-slate-200 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-90"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && (
        <div className="py-20 text-center text-slate-300 font-bold uppercase tracking-[0.2em] text-xs">
          No registry entries found in this category
        </div>
      )}
    </div>
  );
};

export default PerfumeTable;
