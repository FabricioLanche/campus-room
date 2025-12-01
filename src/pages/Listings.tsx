import { useEffect, useState } from 'react';
import { PostAdForm } from '../components/PostAdForm';
import { CardListing } from '../components/CardListing';
import { MapView } from '../components/MapView';
import { Listing } from '../types';
import { mockListings } from '../data/mockListings';

export const Listings = () => {
  // ESTA LÍNEA ES LA QUE FALTABA: Definimos el estado 'listings'
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    setListings(mockListings);
  }, []);

  const handleAddListing = (listing: Listing) => {
    setListings((prev) => [listing, ...prev]);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Encabezado */}
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Avisos</p>
        <h2 className="text-2xl font-bold text-slate-900">Publica y descubre nuevas opciones</h2>
        <p className="text-sm text-slate-600">
          Usa el formulario para publicar un aviso rápido y revisa la lista de habitaciones disponibles cerca del campus.
        </p>
      </div>

      {/* Formulario */}
      <PostAdForm onAdd={handleAddListing} />

      {/* Grid: Lista a la izquierda, Mapa a la derecha */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Columna de Lista (Izquierda) - Ocupa 7 de 12 espacios */}
        <div className="lg:col-span-7 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">
                {listings.length} alojamientos cerca de UTEC
              </h3>
           </div>
           
           <div className="grid gap-6 sm:grid-cols-2">
            {listings.map((listing) => (
              <CardListing key={listing.id} listing={listing} />
            ))}
            {listings.length === 0 && (
                <p className="col-span-2 text-center text-slate-500 py-10">
                    No hay avisos cargados aún.
                </p>
            )}
          </div>
        </div>

        {/* Columna del Mapa (Derecha) - Ocupa 5 de 12 espacios */}
        <div className="hidden lg:block lg:col-span-5">
          {/* Sticky hace que el mapa te siga mientras bajas viendo la lista */}
          <div className="sticky top-24 h-[calc(100vh-150px)]">
             <MapView listings={listings} />
          </div>
        </div>
      </div>
    </section>
  );
};