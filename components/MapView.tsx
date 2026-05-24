import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Search, Loader, AlertCircle, MapPin, Globe, ExternalLink } from 'lucide-react';

interface GroundingLink {
  title: string;
  uri: string;
}

interface MapViewProps {
    initialQuery: string;
}

export const MapView: React.FC<MapViewProps> = ({ initialQuery }) => {
    const [query, setQuery] = useState(initialQuery);
    const [mapQuery, setMapQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultText, setResultText] = useState<string | null>(null);
    const [groundingLinks, setGroundingLinks] = useState<GroundingLink[]>([]);

    const triggerSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setResultText(null);
        setGroundingLinks([]);
        setMapQuery('');

        try {
            // Default location fallback: Phnom Penh, Cambodia (lat: 11.5564, lng: 104.9282)
            let currentUserLocation = { lat: 11.5564, lng: 104.9282 };

            if (typeof window !== 'undefined' && navigator.geolocation) {
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 3000, // Fail fast to use fallback
                            maximumAge: 0,
                        });
                    });
                    currentUserLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                } catch (geoError) {
                    console.warn("Geolocation failed or denied. Using Phnom Penh fallback:", geoError);
                }
            } else {
                console.warn("Geolocation not supported or restricted (non-HTTPS context). Using Phnom Penh fallback.");
            }
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `${searchQuery}. Please provide the latitude and longitude coordinates for this location if possible.`,
                config: {
                    tools: [{ googleMaps: {} }],
                    toolConfig: {
                        retrievalConfig: {
                            latLng: {
                                latitude: currentUserLocation.lat,
                                longitude: currentUserLocation.lng
                            }
                        }
                    }
                },
            });

            const text = response.text;
            const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            
            const links: GroundingLink[] = chunks
                .filter(chunk => chunk.maps?.uri && chunk.maps?.title)
                .map(chunk => ({
                    title: chunk.maps.title,
                    uri: chunk.maps.uri
                }));

            setResultText(text || "No information found.");
            setGroundingLinks(links);

            let determinedMapQuery = '';
            if (links.length > 0) {
                determinedMapQuery = links[0].title;
            } else if (text) {
                const coordRegex = /(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)/;
                const match = text.match(coordRegex);
                if (match && match.length >= 3) {
                    const lat = parseFloat(match[1]);
                    const lng = parseFloat(match[2]);
                    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                        determinedMapQuery = `${lat},${lng}`;
                    } else {
                        determinedMapQuery = searchQuery;
                    }
                } else {
                    determinedMapQuery = searchQuery;
                }
            } else {
                determinedMapQuery = searchQuery;
            }
            setMapQuery(determinedMapQuery);

        } catch (e: unknown) {
            console.error("Map search error:", e);
            setError("An error occurred while searching. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (initialQuery) {
            triggerSearch(initialQuery);
        }
    }, [initialQuery]);

    const handleSearchClick = () => {
        if (!query.trim()) {
            setError("Please enter a location to search.");
            return;
        }
        triggerSearch(query);
    };

    const handleDataLinkClick = (linkTitle: string) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(linkTitle)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
    
    return (
        <div className="space-y-6">
            {/* Non-secure context / HTTP Geolocation notice */}
            {typeof window !== 'undefined' && window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-600 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                    <div>
                        <p className="font-bold text-slate-800">ចំណាំ៖ ការតភ្ជាប់ HTTP មិនមានសុវត្ថិភាព (Non-Secure Context)</p>
                        <p className="mt-0.5 text-slate-600">
                            ដោយសារតែប្រព័ន្ធកំពុងដំណើរការលើការតភ្ជាប់ HTTP មុខងារចាប់យកទីតាំងបច្ចុប្បន្នត្រូវបានកម្រិតដោយកម្មវិធីរុករក (Browser)។ ប្រព័ន្ធនឹងប្រើប្រាស់ទីតាំងលំនាំដើម (រាជធានីភ្នំពេញ) ជំនួសវិញ។
                        </p>
                        <p className="mt-1 text-xs text-amber-500 font-medium font-sans">
                            Note: Over HTTP, current location detection is restricted by your browser. Default location (Phnom Penh) will be used for search results.
                        </p>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">ស្វែងរកទីតាំង (Location Search)</label>
                <div className="flex gap-3">
                    <div className="relative flex-grow">
                         <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input 
                            type="text" 
                            placeholder="e.g., 'good restaurants nearby' or a village name" 
                            className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSearchClick()}
                        />
                    </div>
                    <button
                        onClick={handleSearchClick}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed active:scale-95"
                    >
                        {isLoading ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
                        <span>Search</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
                    <AlertCircle size={20} />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {isLoading && (
                 <div className="flex justify-center items-center gap-3 text-slate-500 font-medium py-10 animate-fade-in">
                    <Loader size={20} className="animate-spin" />
                    <span>Fetching location data... (Please allow location access)</span>
                </div>
            )}
            
            {resultText && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 animate-fade-in">
                   <h4 className="text-lg font-bold text-slate-800">Results for "{query}"</h4>
                   <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{resultText}</p>
                   
                   {mapQuery && (
                       <div className="pt-2">
                           <a 
                                href={externalMapUrl}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 px-5 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
                           >
                              <MapPin size={16} /> 
                              <span>View on Google Maps</span>
                              <ExternalLink size={16} />
                          </a>
                      </div>
                   )}

                   {groundingLinks.length > 0 && (
                       <div className="pt-4 border-t border-slate-100">
                           <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Data Sources from Google Maps</h5>
                           <ul className="space-y-2">
                               {groundingLinks.map((link, index) => (
                                   <li key={index} className="flex items-start gap-2">
                                       <MapPin size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                                       <button 
                                           onClick={() => handleDataLinkClick(link.title)}
                                           className="text-blue-600 hover:underline text-sm font-medium text-left"
                                        >
                                           {link.title}
                                       </button>
                                   </li>
                               ))}
                           </ul>
                       </div>
                   )}
                </div>
            )}
        </div>
    );
};