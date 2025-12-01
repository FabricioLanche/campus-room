import { useMemo, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView, OverlayViewF, InfoWindowF, MarkerF } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import { Listing } from '../types';

interface MapViewProps {
  listings: Listing[];
  forcedCenter?: { lat: number; lng: number; label: string } | null; // <--- TIPO ACTUALIZADO
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [];

export const MapView = ({ listings, forcedCenter }: MapViewProps) => {
  const defaultCenter = useMemo(() => ({ lat: -12.1354, lng: -77.0225 }), []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "",
    libraries: libraries,
  });

  const selectedListing = useMemo(
    () => listings.find((item) => item.id === selectedId),
    [selectedId, listings]
  );

  useEffect(() => {
    if (map) {
      if (forcedCenter) {
        map.panTo(forcedCenter);
        map.setZoom(16);
      } else if (listings.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        listings.forEach((listing) => {
          bounds.extend({ lat: listing.latitude, lng: listing.longitude });
        });
        if (forcedCenter) bounds.extend(forcedCenter);
        map.fitBounds(bounds);
      }
    }
  }, [map, listings, forcedCenter]);

  const containerStyle = { width: '100%', height: '100%', borderRadius: '0' };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: true,
  };

  if (loadError) return <div>Error cargando mapa</div>;

  return (
    <div className="h-full w-full relative bg-slate-100">
      {!isLoaded ? (
        <div className="flex h-full w-full items-center justify-center text-slate-500">Cargando mapa...</div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={15}
          options={mapOptions}
          onLoad={(mapInstance) => setMap(mapInstance)}
          onClick={() => setSelectedId(null)}
        >
          {/* 1. MARCADOR DINÁMICO (Distrito o Universidad) */}
          {forcedCenter && (
             <MarkerF 
                position={forcedCenter}
                zIndex={9999}
                animation={window.google.maps.Animation.DROP}
                label={{
                    text: `📍 ${forcedCenter.label}`, // <--- AQUÍ SE USA LA ETIQUETA
                    color: "#0F172A",
                    fontWeight: "bold",
                    fontSize: "14px",
                    className: "bg-white px-2 py-1 rounded shadow-md mt-10"
                }}
                icon={{
                    path: "M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z",
                    fillColor: "#2563EB",
                    fillOpacity: 1,
                    scale: 2.5,
                    strokeColor: "white",
                    strokeWeight: 2,
                    anchor: new window.google.maps.Point(12, 24),
                }}
             />
          )}

          {/* 2. MARCADORES DE PRECIO */}
          {listings.map((listing) => (
            <OverlayViewF
              key={listing.id}
              position={{ lat: listing.latitude, lng: listing.longitude }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedId(listing.id); }}
                className={`relative -translate-x-1/2 -translate-y-1/2 transform transition-all duration-200 hover:scale-110 hover:z-50 ${selectedId === listing.id ? 'z-50 scale-110' : 'z-10'}`}
              >
                <div className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold shadow-md transition-colors border border-gray-200 ${selectedId === listing.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 hover:bg-slate-50'}`}>
                  <span>S/ {listing.price}</span>
                </div>
                <div className={`absolute left-1/2 top-full -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 transform border-r border-b border-gray-200 ${selectedId === listing.id ? 'bg-slate-900 border-none' : 'bg-white'}`} />
              </button>
            </OverlayViewF>
          ))}

          {/* 3. VENTANA DE DETALLE */}
          {selectedListing && (
            <InfoWindowF
              position={{ lat: selectedListing.latitude, lng: selectedListing.longitude }}
              onCloseClick={() => setSelectedId(null)}
              options={{ pixelOffset: new window.google.maps.Size(0, -30), maxWidth: 300 }}
            >
              <div className="w-60 p-1">
                <div className="relative h-32 w-full overflow-hidden rounded-lg">
                  <img src={selectedListing.image} alt={selectedListing.title} className="h-full w-full object-cover" />
                </div>
                <div className="mt-2 space-y-1">
                  <h3 className="font-bold text-slate-900 line-clamp-1">{selectedListing.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span>{selectedListing.specs.bedrooms} hab</span>•<span>{selectedListing.specs.area} m²</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-sm font-semibold text-slate-900">S/ {selectedListing.price} <span className="text-xs font-normal text-slate-500">/mes</span></p>
                    <Link to={`/listing/${selectedListing.id}`} className="text-xs font-medium text-primary hover:underline">Ver detalles</Link>
                  </div>
                </div>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      )}
    </div>
  );
};