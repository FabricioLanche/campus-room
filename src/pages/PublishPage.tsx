import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useAuth } from '../context/AuthContext';

export const PublishPage = () => {
  const navigate = useNavigate();
  const { addListing } = useListings();
  const { user, becomeLandlord } = useAuth();

  // Estados del formulario
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  // Coordenadas simuladas (en una app real usarías Google Places API)
  const defaultLat = -12.1354;
  const defaultLng = -77.0225;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Debes iniciar sesión para publicar');
      navigate('/login');
      return;
    }

    const newListing = {
      id: Date.now().toString(), // ID único basado en la hora actual
      title,
      address,
      description,
      price: Number(price),
      // Añadimos una variación aleatoria pequeña para que no caigan todos en el mismo punto exacto
      latitude: defaultLat + (Math.random() * 0.002),
      longitude: defaultLng + (Math.random() * 0.002),
      image: 'https://images.unsplash.com/photo-1522771753035-4a50c9a91d44?auto=format&fit=crop&w=800&q=80', // Imagen por defecto
      specs: { bedrooms: 1, bathrooms: 1, area: 20 },
      isUserCreated: true, // Marcamos que este aviso es tuyo
      landlordId: user.id || 'me',
    };

    // 1. Guardamos el aviso en el contexto
    addListing(newListing);
    
    // 2. Te convertimos en arrendatario (si no lo eras)
    becomeLandlord();
    
    // 3. Redirigimos al perfil
    navigate('/perfil');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Publicar nuevo alojamiento</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Título del aviso</label>
            <input
              required
              type="text"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ej: Habitación iluminada cerca a UTEC"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Dirección exacta</label>
            <input
              required
              type="text"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ej: Av. Grau 123, Barranco"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Precio mensual (S/)</label>
            <input
              required
              type="number"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ej: 800"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

           {/* Descripción */}
           <div>
            <label className="block text-sm font-medium text-slate-700">Descripción</label>
            <textarea
              required
              rows={3}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Detalles sobre el alojamiento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Simulación de Subida de Foto */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Fotos</label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-slate-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-sm text-slate-600">
                  <span className="font-medium text-primary hover:text-blue-500">Sube un archivo</span>
                  <span className="pl-1">o arrastra y suelta</span>
                </div>
                <p className="text-xs text-slate-500">PNG, JPG hasta 10MB (Simulado)</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 font-bold text-white transition-colors hover:bg-blue-600"
          >
            Publicar Aviso
          </button>
        </form>
      </div>
    </div>
  );
};