import { useState, useMemo } from 'react';
import { MapView } from '../components/MapView';
import { CardListing } from '../components/CardListing';
import { useListings } from '../context/ListingsContext';
import { KNOWN_LOCATIONS, getDistanceFromLatLonInKm } from '../utils/geoUtils';

// Opciones para los filtros
const PRICE_RANGES = [
  { label: 'Cualquier precio', min: 0, max: 10000 },
  { label: 'Hasta S/ 800', min: 0, max: 800 },
  { label: 'S/ 800 - S/ 1200', min: 800, max: 1200 },
  { label: 'S/ 1200 - S/ 1600', min: 1200, max: 1600 },
  { label: 'Más de S/ 1600', min: 1600, max: 10000 },
];

const PROPERTY_TYPES = [
  'Todos',
  'Habitación',
  'Minidepa',
  'Loft',
  'Departamento'
];

// Opciones Rápidas (Deben coincidir con las claves en geoUtils.ts o ser texto buscable)
const QUICK_OPTIONS = [
  { label: '📍 UTEC', value: 'utec' },
  { label: '📍 U. de Lima', value: 'universidad de lima' },
  { label: '📍 PUCP', value: 'pucp' },
  { label: '📍 Pacífico', value: 'pacifico' },
  { label: '🏡 Barranco', value: 'barranco' },
  { label: '🏡 Miraflores', value: 'miraflores' },
  { label: '🏡 San Isidro', value: 'san isidro' },
  { label: '🏡 Surco', value: 'surco' },
  { label: '🏡 Jesús María', value: 'jesus maria' },
];

export const Home = () => {
  const { listings, searchTerm, setSearchTerm, hasSearched, setHasSearched } = useListings(); 
  
  // Estados para filtros
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number, label: string} | null>(null);
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [selectedType, setSelectedType] = useState('Todos');
  
  // Estado para controlar qué menú desplegable está abierto
  const [activeDropdown, setActiveDropdown] = useState<'price' | 'type' | null>(null);

  // --- LÓGICA DE FILTRADO MAESTRA ---
  const filteredListings = useMemo(() => {
    let result = listings;

    // 1. Filtro de Texto / Geográfico
    if (searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (KNOWN_LOCATIONS[term]) {
            // Si es lugar conocido, filtro por distancia (3km)
            const center = KNOWN_LOCATIONS[term];
            result = result.filter(listing => {
                const distance = getDistanceFromLatLonInKm(
                    center.lat, center.lng,
                    listing.latitude, listing.longitude
                );
                return distance <= 3;
            });
        } else {
            // Si es texto normal, filtro por coincidencia
            result = result.filter(listing => 
              listing.address.toLowerCase().includes(term) ||
              listing.title.toLowerCase().includes(term)
            );
        }
    }

    // 2. Filtro de Precio
    result = result.filter(item => item.price >= priceRange.min && item.price <= priceRange.max);

    // 3. Filtro de Tipo
    if (selectedType !== 'Todos') {
        result = result.filter(item => item.title.toLowerCase().includes(selectedType.toLowerCase()));
    }

    return result;
  }, [searchTerm, listings, priceRange, selectedType]);

  // --- MANEJADORES ---

  const executeSearch = (term: string) => {
    const cleanTerm = term.toLowerCase().trim();
    setSearchTerm(cleanTerm); // Guardamos en contexto
    setHasSearched(true); // Cambiamos vista

    // Lógica del Mapa
    if (KNOWN_LOCATIONS[cleanTerm]) {
        setMapCenter(KNOWN_LOCATIONS[cleanTerm]);
    } else {
        setMapCenter(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch(searchTerm);
    }
  };

  const toggleDropdown = (name: 'price' | 'type') => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- VISTA 1: BUSCADOR CENTRADO (HERO) --- */}
      {!hasSearched ? (
        <div className="flex h-[80vh] flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-slate-50">
          <div className="w-full max-w-3xl text-center space-y-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Encuentra tu sitio ideal <br />
              <span className="text-primary">cerca de tu universidad</span>
            </h1>
            
            <div className="relative mx-auto max-w-2xl transform transition-all hover:scale-105 z-20">
              <input
                type="text"
                placeholder="¿Dónde quieres vivir? (Ej: UTEC, Miraflores...)"
                className="w-full rounded-full border-2 border-slate-200 bg-white py-5 pl-14 pr-32 text-lg shadow-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              <button 
                onClick={() => executeSearch(searchTerm)}
                className="absolute right-2 top-2 bottom-2 rounded-full bg-primary px-6 font-bold text-white transition-colors hover:bg-blue-600"
              >
                Buscar
              </button>
            </div>

            {/* BOTONES RÁPIDOS EN HERO */}
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                {QUICK_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => executeSearch(opt.value)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all shadow-sm"
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            
          </div>
        </div>
      ) : (
        
        /* --- VISTA 2: RESULTADOS + FILTROS --- */
        <div className="flex flex-col h-[calc(100vh-64px)]">
          
          {/* HEADER DE FILTROS */}
          <div className="border-b bg-white px-4 py-3 shadow-sm z-30">
            <div className="mx-auto flex flex-col gap-4 max-w-[1920px]">
                
                {/* Fila Superior: Buscador y Filtros */}
                <div className="flex items-center gap-4">
                    {/* Buscador pequeño */}
                    <div className="relative flex-1 max-w-md">
                        <input
                        type="text"
                        className="w-full rounded-full border border-slate-300 py-2 pl-10 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Editar búsqueda..."
                        />
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Botones de Filtro */}
                    <div className="relative">
                        <button 
                            onClick={() => toggleDropdown('price')}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${priceRange.max < 10000 ? 'bg-primary text-white border-primary' : 'hover:bg-slate-50 border-slate-300'}`}
                        >
                            {priceRange.max < 10000 ? priceRange.label : 'Precio'}
                        </button>
                        {/* Dropdown Precio */}
                        {activeDropdown === 'price' && (
                            <div className="absolute top-12 left-0 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                                {PRICE_RANGES.map((range, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { setPriceRange(range); setActiveDropdown(null); }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button 
                            onClick={() => toggleDropdown('type')}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selectedType !== 'Todos' ? 'bg-primary text-white border-primary' : 'hover:bg-slate-50 border-slate-300'}`}
                        >
                            {selectedType !== 'Todos' ? selectedType : 'Tipo de lugar'}
                        </button>
                        {/* Dropdown Tipo */}
                        {activeDropdown === 'type' && (
                            <div className="absolute top-12 left-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                                {PROPERTY_TYPES.map((type, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { setSelectedType(type); setActiveDropdown(null); }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Botón Reset */}
                    {(priceRange.max < 10000 || selectedType !== 'Todos') && (
                        <button 
                            onClick={() => { setPriceRange(PRICE_RANGES[0]); setSelectedType('Todos'); }}
                            className="text-xs text-slate-500 hover:text-red-500 underline"
                        >
                            Borrar filtros
                        </button>
                    )}
                </div>

                {/* Fila Inferior: Chips de Universidades/Distritos */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {QUICK_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => executeSearch(opt.value)}
                            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                searchTerm.toLowerCase() === opt.value 
                                ? 'bg-slate-800 text-white border-slate-800' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

            </div>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="flex-1 overflow-hidden">
            <div className="grid h-full grid-cols-1 lg:grid-cols-12">
              {/* Lista */}
              <div className="h-full overflow-y-auto p-4 lg:col-span-7 xl:col-span-8 bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                    {filteredListings.length} alojamientos encontrados
                    </h2>
                    {filteredListings.length > 0 && mapCenter && mapCenter.label === "UNIVERSIDAD" && (
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Cerca de {searchTerm.toUpperCase()}
                        </span>
                    )}
                </div>
                
                {filteredListings.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredListings.map((listing) => (
                      <CardListing key={listing.id} listing={listing} />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <p className="text-lg text-slate-500 font-medium">No encontramos resultados.</p>
                    <p className="text-sm text-slate-400 mb-4">Prueba ajustando los filtros o buscando en otra zona.</p>
                    <button 
                        onClick={() => { setSearchTerm(''); setPriceRange(PRICE_RANGES[0]); setSelectedType('Todos'); setHasSearched(false); }} 
                        className="text-primary font-bold hover:underline"
                    >
                        Ver todos los alojamientos
                    </button>
                  </div>
                )}
                <div className="mt-8 text-center text-xs text-slate-400 pb-10">CampusRoom © 2024</div>
              </div>

              {/* Mapa */}
              <div className="hidden h-full lg:block lg:col-span-5 xl:col-span-4 border-l border-slate-200 bg-slate-100 relative z-0">
                <div className="h-full w-full">
                  <MapView listings={filteredListings} forcedCenter={mapCenter} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};