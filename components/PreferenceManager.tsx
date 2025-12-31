
import React from 'react';
import { UserPreferences } from '../types';
import { SCENT_FAMILIES, CONCENTRATIONS, GENDER_TYPES, POPULAR_NOTES } from '../constants';

interface PreferenceManagerProps {
  preferences: UserPreferences;
  onChange: (prefs: UserPreferences) => void;
  compact?: boolean;
}

const PreferenceManager: React.FC<PreferenceManagerProps> = ({ preferences, onChange, compact }) => {
  const toggleFamily = (family: string) => {
    const list = preferences.likedFamilies.includes(family)
      ? preferences.likedFamilies.filter(f => f !== family)
      : [...preferences.likedFamilies, family];
    onChange({ ...preferences, likedFamilies: list });
  };

  const toggleGender = (gender: string) => {
    const list = preferences.preferredGender.includes(gender)
      ? preferences.preferredGender.filter(g => g !== gender)
      : [...preferences.preferredGender, gender];
    onChange({ ...preferences, preferredGender: list });
  };

  const toggleNote = (note: string, type: 'like' | 'dislike') => {
    const field = type === 'like' ? 'favoriteNotes' : 'dislikedNotes';
    const list = preferences[field].includes(note)
      ? preferences[field].filter(n => n !== note)
      : [...preferences[field], note];
    onChange({ ...preferences, [field]: list });
  };

  return (
    <div className={`space-y-16 ${compact ? 'p-12' : 'p-16'}`}>
      {/* Olfactive Families - Bigger Buttons */}
      <div className="space-y-8">
        <label className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] block border-l-4 border-emerald-500 pl-6">
          Scent Families
        </label>
        <div className="flex flex-wrap gap-3">
          {SCENT_FAMILIES.map(family => (
            <button
              key={family}
              onClick={() => toggleFamily(family)}
              className={`px-8 py-4 rounded-2xl text-xs font-bold transition-all border-2 ${preferences.likedFamilies.includes(family)
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105'
                  : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-300 hover:text-emerald-600'
                }`}
            >
              <span className="mr-2 opacity-60">#</span>{family}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Gender Portrait - Bigger and Bold */}
        <div className="space-y-8">
          <label className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] block border-l-4 border-emerald-500 pl-6">
            Intended Audience
          </label>
          <div className="flex flex-wrap gap-3">
            {GENDER_TYPES.map(gender => (
              <button
                key={gender}
                onClick={() => toggleGender(gender)}
                className={`px-10 py-4 rounded-2xl text-xs font-black transition-all border-2 ${preferences.preferredGender.includes(gender)
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl'
                    : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-300'
                  }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider - Thicker and larger numbers */}
        <div className="space-y-8">
          <label className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] block border-l-4 border-emerald-500 pl-6">
            Budget Ceiling (₴)
          </label>
          <div className="space-y-6 px-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400">Min: {preferences.priceRange[0]}</span>
              <span className="text-lg font-black text-emerald-600 tracking-tighter bg-emerald-50 px-6 py-2 rounded-2xl border border-emerald-100">{preferences.priceRange[1]} ₴</span>
            </div>
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={preferences.priceRange[1]}
              onChange={(e) => onChange({ ...preferences, priceRange: [preferences.priceRange[0], Number(e.target.value)] })}
              className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${(preferences.priceRange[1] / 20000) * 100}%, #f1f5f9 ${(preferences.priceRange[1] / 20000) * 100}%, #f1f5f9 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Favorite Notes - More manageable grid, bigger tags */}
      <div className="space-y-8">
        <label className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] block border-l-4 border-emerald-500 pl-6">
          Desired Notes (Core Essence)
        </label>
        <div className="flex flex-wrap gap-3">
          {POPULAR_NOTES.map(note => (
            <button
              key={note}
              onClick={() => toggleNote(note, 'like')}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all border-2 ${preferences.favoriteNotes.includes(note)
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg'
                  : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                }`}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t-2 border-slate-50">
          {/* Technical Specs - Larger controls */}
          <div className="space-y-8">
            <label className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] block">Scent Longevity (1-5)</label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  onClick={() => onChange({ ...preferences, minLongevity: v })}
                  className={`w-14 h-14 rounded-2xl font-black text-base transition-all border-2 ${preferences.minLongevity === v
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-110'
                      : 'bg-white text-slate-300 border-slate-100 hover:border-slate-200'
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <label className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] block">Preferred Concentrations</label>
            <div className="flex flex-wrap gap-3">
              {CONCENTRATIONS.map(c => (
                <button
                  key={c}
                  onClick={() => {
                    const list = preferences.preferredConcentration?.includes(c)
                      ? preferences.preferredConcentration.filter(x => x !== c)
                      : [...(preferences.preferredConcentration || []), c];
                    onChange({ ...preferences, preferredConcentration: list });
                  }}
                  className={`px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all border-2 ${preferences.preferredConcentration?.includes(c)
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                      : 'bg-white text-slate-300 border-slate-100 hover:border-slate-200'
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferenceManager;
