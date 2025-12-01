import { useParams, useNavigate } from 'react-router-dom'; // Usamos useNavigate
import { useListings } from '../context/ListingsContext';
import { useChat } from '../context/ChatContext';
import { Link } from 'react-router-dom';

export const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook para navegación fluida
  const { listings } = useListings();
  const { openChatWith } = useChat();
  
  // 1. Buscamos el aviso
  const listing = listings.find((item) => item.id === id);

  if (!listing) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-slate-800">Aviso no encontrado</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary hover:underline">Volver al inicio</button>
      </div>
    );
  }

  // 2. Datos del Arrendatario
  const landlordName = "Carlos Mendoza";
  const landlordId = listing.landlordId || "landlord-1";

  // 3. Cálculos de Reseñas
  const reviews = listing.reviews || [];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "Nuevo";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      
      {/* BOTÓN VOLVER MEJORADO */}
      <button 
        onClick={() => navigate(-1)} // Regresa a la página anterior (mapa o perfil)
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Volver
      </button>
      
      <div className="overflow-hidden rounded-xl bg-white shadow-lg border border-slate-100">
        
        {/* IMAGEN */}
        <div className="relative h-64 w-full bg-slate-200 sm:h-96">
            <img 
            src={listing.image} 
            alt={listing.title} 
            className="h-full w-full object-cover"
            onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1522771753035-4a50c9a91d44?auto=format&fit=crop&w=800&q=80';
            }}
            />
        </div>

        <div className="p-6 md:p-8">
          
          {/* HEADER */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{listing.title}</h1>
              <p className="mt-1 text-slate-500 flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {listing.address}
              </p>
            </div>
            <div className="flex flex-col items-end">
                <span className="rounded-lg bg-slate-900 px-4 py-2 text-2xl font-bold text-white shadow-sm">
                S/ {listing.price}
                </span>
                <span className="text-sm text-slate-500 mt-1">/ mes</span>
            </div>
          </div>
          
          <hr className="my-8 border-slate-200" />
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            
            {/* COLUMNA IZQUIERDA (Info y Reseñas) */}
            <div className="md:col-span-2 space-y-8">
                
                {/* Descripción */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Sobre este lugar</h2>
                  <p className="leading-relaxed text-slate-600">{listing.description}</p>
                </div>

                {/* Características */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Características</h3>
                  <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
                          <span className="block text-xl font-bold text-primary">{listing.specs.bedrooms}</span> 
                          <span className="text-xs text-slate-500 uppercase tracking-wide">Habitaciones</span>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
                          <span className="block text-xl font-bold text-primary">{listing.specs.bathrooms}</span> 
                          <span className="text-xs text-slate-500 uppercase tracking-wide">Baños</span>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
                          <span className="block text-xl font-bold text-primary">{listing.specs.area} m²</span> 
                          <span className="text-xs text-slate-500 uppercase tracking-wide">Área total</span>
                      </div>
                  </div>
                </div>

                {/* --- SECCIÓN DE RESEÑAS (MANTENIDA) --- */}
                <div className="pt-6 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        {averageRating} · {reviews.length} evaluaciones
                    </h3>
                    
                    <div className="space-y-6">
                        {reviews.length > 0 ? reviews.map(review => (
                            <div key={review.id} className="bg-slate-50 p-4 rounded-xl">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                                            {review.userName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{review.userName}</p>
                                            <p className="text-xs text-slate-400">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400 text-xs">
                                        {'★'.repeat(review.rating)}
                                        <span className="text-slate-300">{'★'.repeat(5 - review.rating)}</span>
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        )) : (
                            <p className="text-slate-500 italic">Aún no hay reseñas para este alojamiento.</p>
                        )}
                    </div>
                </div>

            </div>

            {/* COLUMNA DERECHA (Contacto y Chat) */}
            <div>
                {!listing.isUserCreated ? (
                    <div className="rounded-2xl border border-slate-200 p-6 h-fit sticky top-24 bg-white shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Información del contacto</h3>
                        <Link to={`/perfil-arrendatario/${landlordId}`} className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors text-lg border border-slate-200">
                                {landlordName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 group-hover:underline">{landlordName}</p>
                                <div className="flex items-center gap-1">
                                   <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Verificado</span>
                                   <span className="text-xs text-yellow-500 font-bold">★ 4.8</span>
                                </div>
                            </div>
                        </Link>
                        
                        <div className="mt-6 space-y-3">
                          {/* BOTÓN QUE ABRE EL CHAT */}
                          <button 
                            onClick={() => openChatWith(landlordId, landlordName)} 
                            className="w-full rounded-xl bg-primary py-3.5 font-bold text-white hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30 active:scale-95"
                          >
                              Contactar ahora
                          </button>
                          <p className="text-xs text-center text-slate-400 px-4">
                            Normalmente responde en menos de 1 hora.
                          </p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-6 h-fit sticky top-24">
                        <div className="flex items-center gap-2 mb-2 text-green-800">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <h3 className="font-bold">Este es tu aviso</h3>
                        </div>
                        <p className="text-sm text-green-700 leading-relaxed">
                            Actualmente estás viendo la vista pública de tu alojamiento. No puedes contactarte a ti mismo.
                        </p>
                    </div>
                )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};