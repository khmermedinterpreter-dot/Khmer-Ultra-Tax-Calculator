import React, { useState, useMemo } from 'react';
import { database, flatVillageList, boreyDeveloperMap, addOrUpdateBorey, deleteBorey } from '../data/index';
import { FlatVillage, Borey, ZoneData, ZoneType } from '../types';
import { MapPin, Home, Map, Search, ChevronRight, X, Globe, Info, Plus, Edit, Trash2, Settings } from 'lucide-react';
import { MapView } from './MapView';
import { BoreyForm } from './BoreyForm';

interface LookupProps {
    onSelectPrice: (market: number, base: number) => void;
}

type TabMode = 'borey' | 'zone' | 'village' | 'map';

// FIX: Moved SelectWrapper outside of the LookupSection component to prevent it from being re-created on every render.
// FIX: Make children optional in type definition to satisfy TypeScript strict checks.
const SelectWrapper = ({ children }: { children?: React.ReactNode }) => (
    <div className="relative">
        {children}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    </div>
);

export const LookupSection: React.FC<LookupProps> = ({ onSelectPrice }) => {
    const [activeTab, setActiveTab] = useState<TabMode>('village');
    
    // --- State for SELECTED values ---
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [commune, setCommune] = useState('');
    const [village, setVillage] = useState('');
    const [boreyDeveloper, setBoreyDeveloper] = useState('');
    const [selectedZone, setSelectedZone] = useState('');
    const [selectedZoneType, setSelectedZoneType] = useState('');
    const [selectedBoreyProject, setSelectedBoreyProject] = useState('');
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    // Modal state for Borey add/edit
    const [isBoreyModalOpen, setIsBoreyModalOpen] = useState(false);
    const [boreyFormMode, setBoreyFormMode] = useState<'add' | 'edit'>('add');
    const [editBoreyData, setEditBoreyData] = useState<Borey | undefined>(undefined);
    const [showBoreyActions, setShowBoreyActions] = useState(false);
    
    // --- UI State ---
    const [villageSearchQuery, setVillageSearchQuery] = useState('');
    const [villageSearchResults, setVillageSearchResults] = useState<FlatVillage[]>([]);
    
    const [mapQuery, setMapQuery] = useState('');

    // --- DERIVED DATA for dropdowns ---
    // This is more efficient and avoids useEffect-related race conditions.
    const availableDistricts: string[] = province && database[province] 
        ? Object.keys(database[province].villages[province] || {}) 
        : [];
    const availableCommunes: string[] = province && district && database[province]?.villages[province]?.[district] 
        ? Object.keys(database[province].villages[province][district] || {}) 
        : [];
    const availableVillages: string[] = province && district && commune && database[province]?.villages[province]?.[district]?.[commune] 
        ? Object.keys(database[province].villages[province][district][commune] || {}) 
        : [];

    // Filter developers based on selected province to avoid a cluttered dropdown.
    const availableDevelopers: string[] = province
        ? [
            ...new Set(
                (database[province]?.boreys || []).map(b => b.developer)
            )
          ].sort()
        : Object.keys(boreyDeveloperMap).sort();

    const availableBoreyProjects: Borey[] = boreyDeveloper
    ? (boreyDeveloperMap[boreyDeveloper] || []).filter(p => !province || p.province === province)
    : [];

    const availableZones: ZoneData[] = useMemo(() => province ? database[province]?.zones || [] : [], [province]);
    const availableZoneTypes: ZoneType[] = useMemo(() => availableZones.find(z => z.name === selectedZone)?.types || [], [availableZones, selectedZone]);

    
    // --- DERIVED PRICE OPTIONS ---
    const priceOptions = useMemo(() => {
        if (activeTab === 'village' && province && district && commune && village) {
            const prices = database[province]?.villages[province]?.[district]?.[commune]?.[village];
            if (prices) {
                return [
                    { label: "ជាប់ផ្លូវមេ (Main Road)", desc: "ផ្លូវកៅស៊ូ/ធំក្នុងតំបន់", market: prices[0], base: prices[0] },
                    { label: "ជាប់ផ្លូវរណប (Sub Road)", desc: "ផ្លូវបេតុង/តូចជាង ១០ម", market: prices[1], base: prices[1] },
                    { label: "មិនជាប់ផ្លូវ (No Road)", desc: "ដីឡូត៍/ផ្លូវលំ", market: prices[2], base: prices[2] },
                ];
            }
        } else if (activeTab === 'borey' && selectedBoreyProject) {
            const data = availableBoreyProjects.find(p => p.project === selectedBoreyProject);
            if (data) {
                return [{
                    label: data.project,
                    desc: `${data.district} - ${data.locationNote}`,
                    market: data.marketValue,
                    base: data.baseValue
                }];
            }
        } else if (activeTab === 'zone' && selectedZone && selectedZoneType) {
            const typeData = availableZoneTypes.find(t => t.id === selectedZoneType);
            if (typeData) {
                return [{
                    label: typeData.label,
                    desc: typeData.desc,
                    market: typeData.price,
                    base: typeData.price
                }];
            }
        }
        return null;
    }, [activeTab, province, district, commune, village, selectedBoreyProject, selectedZone, selectedZoneType, availableBoreyProjects, availableZoneTypes]);


    // --- Event Handlers ---

    const handleTabChange = (tab: TabMode) => {
        if (tab === 'map') {
            if (village && commune && district && province) {
                const query = `${village}, ${commune}, ${district}, ${province}`;
                setMapQuery(query);
            } else {
                setMapQuery('');
            }
        }
        setActiveTab(tab);
         // Reset prices when changing tabs
    }

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProvince = e.target.value;
        setProvince(newProvince);
        setDistrict('');
        setCommune('');
        setVillage('');
        setBoreyDeveloper('');
        setSelectedZone('');
            };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDistrict(e.target.value);
        setCommune('');
        setVillage('');
            };

    const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCommune(e.target.value);
        setVillage('');
            };

    const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setVillage(e.target.value);
    };
    
    const handleBoreyDeveloperChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setBoreyDeveloper(e.target.value);
            };

    const handleBoreyProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBoreyProject(e.target.value);
    };

    const handleSelectedZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedZone(e.target.value);
        setSelectedZoneType('');
    };

    const handleZoneTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedZoneType(e.target.value);
    };

    // --- Borey Add/Edit Handlers ---
    const handleAddBorey = () => {
        setBoreyFormMode('add');
        setEditBoreyData(undefined);
        setIsBoreyModalOpen(true);
    };
    const handleEditBorey = () => {
        if (!selectedBoreyProject) return;
        const borey = availableBoreyProjects.find(p => p.project === selectedBoreyProject);
        if (borey) {
            setEditBoreyData(borey);
            setBoreyFormMode('edit');
            setIsBoreyModalOpen(true);
        }
    };

    const handleDeleteBorey = () => {
        if (!selectedBoreyProject) return;
        const borey = availableBoreyProjects.find(p => p.project === selectedBoreyProject);
        if (borey && confirm(`Are you sure you want to delete "${borey.project}" by ${borey.developer}? This cannot be undone.`)) {
            deleteBorey(borey);
            setSelectedBoreyProject('');
            // If no more projects for this developer, reset developer too
            const remaining = (boreyDeveloperMap[borey.developer] || []).filter(p => !province || p.province === province);
            if (remaining.length === 0) {
                setBoreyDeveloper('');
            }
        }
    };
    
    const handleVillageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setVillageSearchQuery(query);
        if (query.trim().length > 1) {
            const results = flatVillageList.filter(item => 
                item.village.includes(query)
            ).slice(0, 15);
            setVillageSearchResults(results);
        } else {
            setVillageSearchResults([]);
        }
    };

    const handleClearSearch = () => {
        setVillageSearchQuery('');
        setVillageSearchResults([]);
    };
    
    const handleSearchResultClick = (result: FlatVillage) => {
        // Set all location states in one go. The derived data will update automatically.
        setProvince(result.province);
        setDistrict(result.district);
        setCommune(result.commune);
        setVillage(result.village);
        
        setVillageSearchQuery(`${result.village} (${result.commune}, ${result.district})`);
        setVillageSearchResults([]);
    };

    // --- UI Components & Classes ---
    const tabBaseClass = "flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold transition-all duration-200 border-b-2";
    const tabActiveClass = "border-blue-600 text-blue-600 bg-blue-50/50";
    const tabInactiveClass = "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50";
    const selectClass = "w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm disabled:bg-slate-100 disabled:text-slate-400 font-medium appearance-none";

    return (<>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-100 bg-white">
                <h3 className="text-xl font-bold text-slate-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-sm text-sm font-bold">1</div>
                        ស្វែងរកតម្លៃដី (Land Value Lookup)
                    </div>
                    <button onClick={() => setIsInfoModalOpen(true)} className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Info size={20} />
                    </button>
                </h3>
            </div>
            <div className="flex border-b border-slate-200 bg-white">
                <button onClick={() => handleTabChange('village')} className={`${tabBaseClass} ${activeTab === 'village' ? tabActiveClass : tabInactiveClass}`}><MapPin size={18} /> តាមភូមិ (Village)</button>
                <button onClick={() => handleTabChange('borey')} className={`${tabBaseClass} ${activeTab === 'borey' ? tabActiveClass : tabInactiveClass}`}><Home size={18} /> តាមបុរី (Borey)</button>
                <button onClick={() => handleTabChange('zone')} className={`${tabBaseClass} ${activeTab === 'zone' ? tabActiveClass : tabInactiveClass}`}><Map size={18} /> តំបន់/ផ្លូវធំ (Zone)</button>
                <button onClick={() => handleTabChange('map')} className={`${tabBaseClass} ${activeTab === 'map' ? tabActiveClass : tabInactiveClass}`}><Globe size={18} /> ផែនទី (Map View)</button>
            </div>
            <div className="p-6 bg-slate-50/50">
                {activeTab === 'map' && <MapView key={mapQuery} initialQuery={mapQuery} />}
                
                {(activeTab === 'village' || activeTab === 'borey' || activeTab === 'zone') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {(activeTab === 'borey' || activeTab === 'zone') && (
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">រាជធានី/ខេត្ត</label>
                                <SelectWrapper>
                                    <select className={selectClass} onChange={handleProvinceChange} value={province}>
                                        <option value="">-- គ្រប់ខេត្ត/ក្រុង --</option>
                                        {Object.entries(database).map(([p, d]) => {
  const hasData = Object.keys(d.villages || {}).length > 0;
  return (
    <option key={p} value={p} style={{ color: hasData ? undefined : 'red' }}>
      {p}{hasData ? '' : ' (No data)'}
    </option>
  );
})}
                                    </select>
                                </SelectWrapper>
                            </div>
                        )}

                        {activeTab === 'borey' && (<>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">ឈ្មោះបុរី (Developer)</label>
                                <SelectWrapper>
                                    <select className={selectClass} onChange={handleBoreyDeveloperChange} value={boreyDeveloper} >
                                        <option value="">-- សូមជ្រើសរើស --</option>
                                        {availableDevelopers.map(name => <option key={name} value={name}>{name}</option>)}
                                    </select>
                                </SelectWrapper>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">គម្រោង/ទីតាំង (Project)</label>
                                <SelectWrapper>
                                    <select className={selectClass} disabled={!boreyDeveloper} onChange={handleBoreyProjectSelect} value={selectedBoreyProject}>
                                        <option value="">-- សូមជ្រើសរើស --</option>
                                        {availableBoreyProjects.map((p, idx) => <option key={`${p.project}-${idx}`} value={p.project}>{p.project}</option>)}
                                    </select>
                                </SelectWrapper>
                            </div>
                        </>)}
                        {/* Manage Borey Toggle */}
                        {activeTab === 'borey' && (
                          <div className="col-span-1 md:col-span-2 mt-1">
                            <button
                              onClick={() => setShowBoreyActions(!showBoreyActions)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                showBoreyActions
                                  ? 'bg-slate-800 text-white shadow-md'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                            >
                              <Settings size={16} className={`transition-transform duration-300 ${showBoreyActions ? 'rotate-90' : ''}`} />
                              Manage Borey
                            </button>
                            {showBoreyActions && (
                              <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
                                <button onClick={handleAddBorey} className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95">
                                  <Plus size={16} /> Add Borey
                                </button>
                                {selectedBoreyProject && (
                                  <button onClick={handleEditBorey} className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95">
                                    <Edit size={16} /> Edit Borey
                                  </button>
                                )}
                                {selectedBoreyProject && (
                                  <button onClick={handleDeleteBorey} className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95">
                                    <Trash2 size={16} /> Delete Borey
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab === 'village' && (<>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">ស្វែងរកតាមឈ្មោះភូមិ (Search by Village Name)</label>
                                <div className="relative">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <input type="text" placeholder="វាយឈ្មោះភូមិ..." className="w-full pl-10 pr-10 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" value={villageSearchQuery} onChange={handleVillageSearch}/>
                                    {villageSearchQuery && (
                                        <button 
                                            onClick={handleClearSearch} 
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                                            aria-label="Clear search"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {villageSearchResults.length > 0 && (
                                <div className="col-span-1 md:col-span-2 -mt-3"><ul className="bg-white border border-slate-300 rounded-xl shadow-lg max-h-64 overflow-y-auto z-10 relative">{villageSearchResults.map((result, index) => (<li key={`${result.village}-${index}`}><button onClick={() => handleSearchResultClick(result)} className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0"><span className="font-bold text-slate-800">{result.village}</span><span className="block text-xs text-slate-500">{result.province} › {result.district} › {result.commune}</span></button></li>))}</ul></div>
                            )}
                            <div className="col-span-1 md:col-span-2 flex items-center gap-4 my-2"><div className="flex-grow h-px bg-slate-200"></div><span className="text-slate-400 text-xs font-semibold uppercase">Or Select Manually</span><div className="flex-grow h-px bg-slate-200"></div></div>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-slate-700 mb-2">រាជធានី/ខេត្ត</label>
                                <SelectWrapper>
                                    <select className={selectClass} onChange={handleProvinceChange} value={province}>
                                        <option value="">-- ជ្រើសរើស --</option>
                                         {Object.entries(database).map(([p, d]) => {
                                           const hasData = Object.keys(d.villages || {}).length > 0;
                                           return (
                                             <option key={p} value={p} style={{ color: hasData ? undefined : 'red' }}>
                                               {p}{hasData ? '' : ' (No data)'}
                                             </option>
                                           );
                                         })}
                                    </select>
                                </SelectWrapper>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-slate-700 mb-2">ខណ្ឌ/ស្រុក</label>
                                <SelectWrapper>
                                    <select className={selectClass} disabled={!province} onChange={handleDistrictChange} value={district}>
                                        <option value="">-- ជ្រើសរើស --</option>
                                        {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </SelectWrapper>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-slate-700 mb-2">សង្កាត់/ឃុំ</label>
                                <SelectWrapper>
                                    <select className={selectClass} disabled={!district} onChange={handleCommuneChange} value={commune}>
                                        <option value="">-- ជ្រើសរើស --</option>
                                        {availableCommunes.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </SelectWrapper>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-slate-700 mb-2">ភូមិ</label>
                                <SelectWrapper>
                                    <select className={selectClass} disabled={!commune} onChange={handleVillageChange} value={village}>
                                        <option value="">-- ជ្រើសរើស --</option>
                                        {availableVillages.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </SelectWrapper>
                            </div>
                        </>)}

                        {activeTab === 'zone' && (<>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">តំបន់ (Zone)</label>
                                <SelectWrapper>
                                    <select className={selectClass} disabled={!province} onChange={handleSelectedZoneChange} value={selectedZone}>
                                        <option value="">-- ជ្រើសរើស --</option>
                                        {availableZones.map(z => <option key={z.name} value={z.name}>{z.name}</option>)}
                                    </select>
                                </SelectWrapper>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">ប្រភេទផ្លូវ</label>
                                <SelectWrapper>
                                    <select className={selectClass} disabled={!selectedZone} onChange={handleZoneTypeSelect} value={selectedZoneType}>
                                        <option value="">-- ជ្រើសរើស --</option>
                                        {availableZoneTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                    </select>
                                </SelectWrapper>
                            </div>
                        </>)}
                    </div>
                )}
                {priceOptions && (
                    <div className="mt-6 space-y-3 animate-fade-in">
                        <div className="flex items-center gap-2 mb-2"><Search size={16} className="text-blue-600"/><h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide">លទ្ធផលតម្លៃ (Results)</h4></div>
                        <div className="grid grid-cols-1 gap-4">{priceOptions.map((opt, i) => (<div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white rounded-xl shadow-md border border-slate-200 hover:border-blue-300 transition-all gap-4"><div className="flex-1"><div className="font-bold text-slate-900 text-lg mb-1">{opt.label}</div><div className="text-sm text-slate-500 font-medium">{opt.desc}</div></div><div className="flex flex-col items-end gap-2 w-full md:w-auto"><div className="text-right">{opt.market !== opt.base && (<div className="text-slate-500 text-sm font-medium">ទីផ្សារ: <span className="text-slate-900">${opt.market}/m²</span></div>)}<div className="text-red-600 font-bold text-xl">ពន្ធ: ${opt.base}/m²</div></div><button onClick={() => onSelectPrice(opt.market, opt.base)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95">ប្រើតម្លៃនេះ <ChevronRight size={16} /></button></div></div>))}</div>
                    </div>
                )}
            </div>
        </div>
{isBoreyModalOpen && (
  <BoreyForm
    mode={boreyFormMode}
    initialData={editBoreyData}
    onSubmit={(borey) => {
      addOrUpdateBorey(borey);
      setIsBoreyModalOpen(false);
      setEditBoreyData(undefined);
    }}
    onCancel={() => {
      setIsBoreyModalOpen(false);
      setEditBoreyData(undefined);
    }}
  />
)}
</>);
};