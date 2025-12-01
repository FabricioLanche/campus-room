import { FormEvent, useState } from 'react';
import { Listing } from '../types';

interface PostAdFormProps {
  onAdd: (listing: Listing) => void;
}

export const PostAdForm = ({ onAdd }: PostAdFormProps) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const newListing: Listing = {
      id: crypto.randomUUID(),
      title,
      price: Number(price),
      address,
      description,
      image:
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      latitude: -12.0635 + Math.random() * 0.01,
      longitude: -77.077 + Math.random() * 0.01,
      specs: {
        bedrooms: 1,
        bathrooms: 1,
        area: 20,
      },
    };

    onAdd(newListing);
    setTitle('');
    setPrice('');
    setAddress('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-lg">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Título del aviso</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none"
            placeholder="Cuarto con vista al campus"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Precio mensual (S/)</label>
          <input
            type="number"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none"
            placeholder="950"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Dirección</label>
        <input
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none"
          placeholder="Av. Universitaria 123"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Descripción</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:bg-white focus:outline-none"
          rows={3}
          placeholder="Incluye servicios, internet y acceso rápido al campus"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
        >
          Publicar aviso
        </button>
      </div>
    </form>
  );
};
