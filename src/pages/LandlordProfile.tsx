import { useParams, useNavigate } from 'react-router-dom';
import { CardListing } from '../components/CardListing';
import { mockListings } from '../data/mockListings';
import { useChat } from '../context/ChatContext';

export const LandlordProfile = () => {
  const { openChatWith } = useChat();
  const navigate = useNavigate();
  
  // En este demo, siempre mostramos a Carlos Mendoza
  const landlord = {
    id: 'landlord-1',
    name: 'Carlos Mendoza',
    joinDate: 'Enero 2023',
    rating: 4.8,
    reviewsCount: 124,
    verified: true,
  };

  // Reseñas falsas
  const reviews = [
    { id: 1, user: 'Ana P.', text: 'El departamento es tal cual las fotos. Carlos muy amable.', rating: 5 },
    { id: 2, user: 'Jorge L.', text: 'Buena ubicación, aunque el wifi falló un día. El resto genial.', rating: 4 },
    { id: 3, user: 'Sofia M.', text: 'Súper recomendado para estudiantes de UTEC.', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-slate-500 hover:text-primary">← Volver</button>
        
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Columna Izquierda: Perfil */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 sticky top-24">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                   <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-500">
                     {landlord.name.charAt(0)}
                   </div>
                   {landlord.verified && (
                     <div className="absolute bottom-0 right-0 rounded-full bg-white p-1 shadow-sm">
                       <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                     </div>
                   )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{landlord.name}</h1>
                <p className="text-slate-500">Arrendador</p>
                
                <div className="mt-4 flex w-full justify-around border-t border-b border-slate-100 py-4">
                  <div>
                    <span className="block font-bold text-slate-900">{landlord.reviewsCount}</span>
                    <span className="text-xs text-slate-500">Reseñas</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">★ {landlord.rating}</span>
                    <span className="text-xs text-slate-500">Calificación</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">2 años</span>
                    <span className="text-xs text-slate-500">En la app</span>
                  </div>
                </div>

                <button 
                  onClick={() => openChatWith(landlord.id, landlord.name)}
                  className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 hover:scale-[1.02]"
                >
                  Contactar
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Reseñas y Avisos */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Sección Reseñas */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Lo que dicen los estudiantes</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {reviews.map(review => (
                  <div key={review.id} className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{review.user}</p>
                        <p className="text-xs text-yellow-500">{'★'.repeat(review.rating)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">"{review.text}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección Sus Avisos (Traemos todos los del mock) */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-slate-900">Alojamientos de {landlord.name}</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {mockListings.slice(0, 4).map(listing => (
                  <CardListing key={listing.id} listing={listing} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};