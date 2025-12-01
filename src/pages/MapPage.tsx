import { useEffect, useState } from 'react';
import { MapView } from '../components/MapView';
import { CardListing } from '../components/CardListing';
import { Listing } from '../types';
import { mockListings } from '../data/mockListings';

export const MapPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    setListings(mockListings);
  }, []);

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Mapa interactivo</p>
        <h2 className="text-2xl font-bold text-slate-900">Visualiza las opciones disponibles</h2>
        <p className="text-sm text-slate-600">Explora las ubicaciones de los avisos publicados y revisa los detalles rápidos.</p>
      </div>

      <MapView listings={listings} />

      <div className="grid gap-4 md:grid-cols-2">
        {listings.map((listing) => (
          <CardListing key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
};
