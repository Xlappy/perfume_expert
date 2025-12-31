
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Perfume, UserPreferences, Recommendation, AppView } from './types';
import { INITIAL_PERFUMES } from './constants';
import { PerfumeExpertService } from './services/perfumeExpertService';
import PerfumeTable from './components/PerfumeTable';
import PreferenceManager from './components/PreferenceManager';
import PerfumeModal from './components/PerfumeModal';
import ReplacementModal from './components/ReplacementModal';
import AddPerfumeModal from './components/AddPerfumeModal';

type DatabaseSubView = 'Floral' | 'Woody' | 'Oriental' | 'Fresh' | 'Citrus' | 'Spicy' | 'Leather' | 'Gourmand';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('expert');
  const [dbSubView, setDbSubView] = useState<DatabaseSubView>('Floral');
  const [items, setItems] = useState<Perfume[]>(() => {
    const saved = localStorage.getItem('perfumexpert_db');
    return saved ? JSON.parse(saved) : INITIAL_PERFUMES;
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    likedFamilies: ['Floral', 'Citrus'],
    dislikedFamilies: [],
    priceRange: [1000, 15000],
    preferredGender: ['Female', 'Unisex'],
    favoriteNotes: ['Rose', 'Bergamot'],
    dislikedNotes: [],
    preferredBrands: [],
    minLongevity: 3,
    preferredConcentration: ['EDP'],
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('perfumexpert_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('perfumexpert_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('perfumexpert_db', JSON.stringify(items));
  }, [items]);

  const expert = useMemo(() => new PerfumeExpertService(), []);

  const fetchRecommendations = useCallback(() => {
    setLoading(true);
    if (!hasAnalyzed) {
      setTimeout(() => setHasAnalyzed(true), 200);
    }

    setTimeout(() => {
      const recs = expert.getRecommendations(items, preferences);
      setRecommendations(recs.slice(0, 3));
      setLoading(false);
    }, 1500);
  }, [items, preferences, expert, hasAnalyzed]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addItem = (newItem: Perfume) => {
    setItems(prev => [newItem, ...prev]);
    setIsAddModalOpen(false);
  };

  const resetDatabase = () => {
    if (window.confirm('Ви впевнені, що хочете скинути бібліотеку до початкового стану?')) {
      setItems(INITIAL_PERFUMES);
      localStorage.removeItem('perfumexpert_db');
      window.location.reload();
    }
  };

  const autoReplace = (oldId: string) => {
    const currentIds = recommendations.map(r => r.perfumeId);
    const alternativesRecs = expert.getRecommendations(items, preferences, currentIds);
    if (alternativesRecs.length > 0) {
      setRecommendations(prev => prev.map(r => r.perfumeId === oldId ? alternativesRecs[0] : r));
    }
    setReplacingId(null);
  };

  const manualReplace = (oldId: string, newItemId: string) => {
    const currentIds = recommendations.map(r => r.perfumeId);
    const allCandidates = expert.getRecommendations(items, preferences, currentIds.filter(id => id !== oldId));
    const newRec = allCandidates.find(r => r.perfumeId === newItemId);
    if (newRec) {
      setRecommendations(prev => prev.map(r => r.perfumeId === oldId ? newRec : r));
    }
    setReplacingId(null);
  };

  const updateItemList = (updatedItems: Perfume[]) => {
    setItems(prev => {
      const updatedMap = new Map(prev.map(i => [i.id, i]));
      updatedItems.forEach(i => updatedMap.set(i.id, i));
      return Array.from(updatedMap.values());
    });
  };

  const filteredDatabase = useMemo(() => {
    return items.filter(i => i.scentFamily === dbSubView);
  }, [items, dbSubView]);

  const favoriteItems = useMemo(() => {
    return items.filter(i => favorites.includes(i.id));
  }, [items, favorites]);

  const alternatives = useMemo(() => {
    if (!replacingId) return [];
    const currentIds = recommendations.map(r => r.perfumeId);
    return expert.getRecommendations(items, preferences, currentIds);
  }, [replacingId, items, preferences, recommendations, expert]);

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

  const selectedItem = useMemo(() => items.find(i => i.id === selectedItemId), [items, selectedItemId]);
  const replacingItem = useMemo(() => items.find(i => i.id === replacingId), [items, replacingId]);

  return (
    <div className="min-h-screen selection:bg-emerald-100 pb-32 text-slate-800">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,_#f0fdf4_0%,_#ffffff_50%,_#faf5ff_100%)] -z-10" />

      {/* Decorative botanical circles */}
      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-emerald-100/30 rounded-full blur-[100px] -z-5" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] bg-purple-100/30 rounded-full blur-[80px] -z-5" />

      {/* Header */}
      <nav className="bg-white/60 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[70] px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setView('expert'); setHasAnalyzed(false); setRecommendations([]); }}>
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <span className="text-white font-playfair italic text-2xl">P</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none mb-1">PERFUME·X</h1>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em]">Couture Scent Finder</p>
            </div>
          </div>
          <div className="flex bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
            {[
              { id: 'expert', label: 'Match' },
              { id: 'database', label: 'Archive' },
              { id: 'favorites', label: `Vault (${favorites.length})` },
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setView(btn.id as AppView)}
                className={`px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${view === btn.id
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-16 px-8">
        {view === 'favorites' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-playfair font-black text-slate-900 tracking-tighter uppercase italic">Your Scent Vault</h2>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Curated personal selection of olfactory masterpieces</p>
            </div>
            {favoriteItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {favoriteItems.map(item => (
                  <div key={item.id} onClick={() => setSelectedItemId(item.id)} className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
                    <div className="flex justify-between items-start mb-8">
                      <div className="text-5xl">{getFamilyIcon(item.scentFamily)}</div>
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }} className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-rose-500 shadow-inner">❤️</button>
                    </div>
                    <h3 className="font-playfair font-black text-2xl text-slate-900 mb-2 leading-tight uppercase">{item.name}</h3>
                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-10">{item.brand} — {item.concentration}</p>
                    <div className="flex justify-between items-center border-t border-slate-50 pt-8">
                      <span className="text-2xl font-black text-slate-800 tracking-tighter">{item.price} ₴</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-40 text-center border-2 border-dashed border-slate-100 rounded-[3rem] glass-card">
                <p className="text-slate-300 font-bold uppercase tracking-[0.3em] text-xs">The vault is currently empty</p>
              </div>
            )}
          </div>
        )}

        {view === 'database' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-4xl font-playfair font-black text-slate-900 uppercase italic">Archive Registry</h2>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-2">Professional curation of olfactory compositions</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button onClick={resetDatabase} className="h-12 px-6 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-200 hover:bg-slate-50 transition-all">Reset Library</button>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-slate-900 text-white h-12 px-10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 active:scale-95 transition-all">+ New Entry</button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 p-2 bg-slate-100/50 rounded-full border border-slate-200/50 w-max mx-auto">
              {['Floral', 'Woody', 'Oriental', 'Fresh', 'Citrus', 'Spicy', 'Leather', 'Gourmand'].map(sub => (
                <button key={sub} onClick={() => setDbSubView(sub as DatabaseSubView)} className={`px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${dbSubView === sub ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>{sub}</button>
              ))}
            </div>

            <div className="glass-card rounded-[3rem] p-4 shadow-xl shadow-emerald-900/5">
              <PerfumeTable items={filteredDatabase} onUpdate={updateItemList} title={`${dbSubView} Collection`} />
            </div>
          </div>
        )}

        {view === 'expert' && (
          <div className="relative">
            <div className={`flex flex-col lg:flex-row gap-16 transition-all duration-1000 ${hasAnalyzed ? 'items-start' : 'items-center justify-center'}`}>

              <div className={`transition-all duration-1000 ${hasAnalyzed ? 'lg:w-[450px] w-full shrink-0' : 'max-w-4xl w-full text-center'}`}>
                {!hasAnalyzed && (
                  <div className="mb-20 animate-fadeIn space-y-8">
                    <div className="inline-block bg-white px-6 py-2 rounded-full text-[10px] font-bold text-emerald-600 uppercase tracking-[0.4em] shadow-sm border border-emerald-50">Scent·Intelligence v2</div>
                    <h2 className="text-6xl md:text-8xl font-playfair font-black text-slate-900 tracking-tight leading-[0.85] uppercase italic">The Perfect <br /><span className="text-emerald-600">Essence</span></h2>
                    <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed border-l-4 border-emerald-100 pl-8 text-left mt-10 italic">
                      "Find the fragrance that speaks your unspoken words. Our algorithmic analysis matches your unique chemistry with world-class artistry."
                    </p>
                  </div>
                )}

                <div className="glass-card p-2 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border-emerald-50/50">
                  <PreferenceManager preferences={preferences} onChange={setPreferences} compact={!hasAnalyzed} />
                </div>

                <div className={`mt-12 ${!hasAnalyzed ? 'flex justify-center' : ''}`}>
                  <button
                    onClick={fetchRecommendations}
                    disabled={loading}
                    className={`bg-slate-900 text-white font-bold transition-all shadow-2xl hover:shadow-emerald-200/50 active:scale-95 flex items-center justify-center gap-5 ${hasAnalyzed ? 'w-full py-6 rounded-2xl text-[11px]' : 'px-24 py-8 rounded-full text-xl'
                      } ${loading ? 'opacity-50 cursor-wait' : 'hover:bg-emerald-600 hover:-translate-y-1'}`}
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : null}
                    <span className="uppercase tracking-[0.3em]">{hasAnalyzed ? 'Refine Analysis' : 'Begin Selection'}</span>
                  </button>
                </div>
              </div>

              {/* Results Canvas */}
              <div className={`flex-grow w-full transition-all duration-1000 ${hasAnalyzed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none absolute invisible'}`}>
                <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-playfair font-black text-slate-900 uppercase italic">Curated Matches</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Based on your unique scent profile and olfactive preferences</p>
                  </div>
                  <div className="bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 flex items-center gap-3">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Optimized Harmony</span>
                  </div>
                </div>

                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    {recommendations.map((rec) => {
                      const item = items.find(i => i.id === rec.perfumeId);
                      if (!item) return null;

                      return (
                        <div key={item.id} className="group bg-white rounded-[4rem] border border-slate-100 flex flex-col md:flex-row overflow-hidden transition-all hover:shadow-2xl animate-fadeIn shadow-lg shadow-slate-100/50">
                          {/* Card Image/Icon Area */}
                          <div className="md:w-2/5 p-10 bg-slate-50 flex flex-col items-center justify-center border-r border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/30 rounded-bl-[100px] -z-10" />
                            <div className="text-7xl group-hover:scale-110 transition-transform duration-700 mb-6">{getFamilyIcon(item.scentFamily)}</div>
                            <div className="text-center">
                              <div className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 tracking-widest uppercase mb-2">SCORE: {rec.score}%</div>
                              <div className="text-2xl font-black text-slate-900 tracking-tighter">{item.price} ₴</div>
                            </div>
                          </div>

                          {/* Card Info Area */}
                          <div className="md:w-3/5 p-10 flex flex-col">
                            <div className="mb-6">
                              <h3 className="font-playfair font-black text-2xl text-slate-900 mb-2 leading-[1.1] uppercase tracking-tight">{item.name}</h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                                <span className="text-emerald-600">{item.brand}</span>
                                <span className="opacity-20">/</span>
                                <span>{item.concentration}</span>
                              </div>
                            </div>

                            <p className="text-[14px] text-slate-500 leading-relaxed font-medium italic mb-8 flex-grow">
                              "{rec.explanation}"
                            </p>

                            <div className="space-y-6 pt-6 border-t border-slate-50">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Longevity</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map(b => <div key={b} className={`h-1 w-4 rounded-full ${item.longevity >= b ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>)}
                                </div>
                              </div>

                              <div className="flex gap-3">
                                <button
                                  onClick={() => setSelectedItemId(item.id)}
                                  className="flex-[3] bg-slate-900 text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-emerald-600 active:scale-95 transition-all"
                                >
                                  Exploration
                                </button>
                                <button
                                  onClick={() => setReplacingId(item.id)}
                                  className="flex-1 bg-slate-50 text-slate-400 border border-slate-200 py-4 rounded-2xl font-black text-[10px] uppercase hover:text-slate-900 hover:bg-white transition-all active:scale-95"
                                >
                                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-48 glass-card rounded-[5rem] px-10 text-center border-emerald-50">
                    <div className="text-7xl mb-8 opacity-20 filter grayscale">🧴</div>
                    <h3 className="text-3xl font-playfair font-black text-slate-900 mb-4 uppercase italic">No matches discovered</h3>
                    <p className="text-slate-400 text-sm max-w-sm font-medium leading-relaxed italic">"Try adjusting your profile or vault settings to uncover new olfactive landscapes."</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 py-6 px-12 bg-white/60 backdrop-blur-3xl border-t border-slate-100 z-[60]">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          <div className="flex items-center gap-10">
            <span>ARCHIVE v4.1.0</span>
            <span className="hidden sm:inline opacity-40">All rights reserved by Atelier X</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-600">Premium Artisan Edition</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedItem && (
        <PerfumeModal perfume={selectedItem} isOpen={!!selectedItemId} onClose={() => setSelectedItemId(null)} isFavorite={favorites.includes(selectedItem.id)} onToggleFavorite={toggleFavorite} />
      )}
      {replacingItem && (
        <ReplacementModal isOpen={!!replacingId} onClose={() => setReplacingId(null)} originalItem={replacingItem} alternatives={alternatives} allItems={items} onSelect={(newId) => manualReplace(replacingId!, newId)} onAutoSelect={() => autoReplace(replacingId!)} />
      )}
      <AddPerfumeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addItem} />
    </div>
  );
};

export default App;
