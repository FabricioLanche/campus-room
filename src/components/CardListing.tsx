import { Link } from 'react-router-dom';
import { Listing } from '../types';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

interface CardListingProps {
  listing: Listing;
  onDelete?: () => void;
}

export const CardListing = ({ listing, onDelete }: CardListingProps) => {
  const { user } = useAuth();
  const { deals } = useChat();

  const activeDeal = deals.find(d => d.listingId === listing.id);
  
  // CORRECCIÓN: Verifica si es mío por ID o por flag manual
  const isMine = listing.isUserCreated || (user && listing.landlordId === user.id);

  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200 transition-all hover:shadow-md hover:border-primary/30 flex flex-col h-full">
      
      <div className="relative h-48 w-full overflow-hidden bg-slate-200 shrink-0">
        <img
          src={listing.image}
          alt={listing.title}
          className="h-full w-full object-cover text-transparent transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
             const target = e.currentTarget;
             const fallbackImage = 'https://images.unsplash.com/photo-1522771753035-4a50c9a91d44?auto=format&fit=crop&w=800&q=80';
             if (target.src !== fallbackImage) {
                 target.src = fallbackImage;
             } else {
                 target.style.display = 'none';
             }
          }}
        />
        
        <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm">
           S/ {listing.price}
        </div>
        
        {/* ETIQUETA 'MÍO' */}
        {isMine && (
            <div className="absolute left-2 top-2 rounded-full bg-primary/90 px-2 py-1 text-xs font-bold text-white shadow-sm">
                Mío
            </div>
        )}
        
        {/* BOTÓN ELIMINAR */}
        {onDelete && (
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete();
                }}
                className="absolute right-2 bottom-2 rounded-full bg-red-500 p-2 text-white shadow-md hover:bg-red-600 transition-colors z-10 opacity-0 group-hover:opacity-100"
                title="Eliminar aviso"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="mb-1 text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
        </h3>
        <p className="mb-3 text-sm text-slate-500 line-clamp-1 flex items-center gap-1">
           <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
           {listing.address}
        </p>
        
        {/* MOSTRAR CÓDIGO SI ES ARRENDATARIO Y EXISTE */}
        {user?.role === 'landlord' && listing.contractCode && (
            <div className="mb-3 bg-yellow-50 border border-yellow-200 p-2 rounded-lg flex justify-between items-center">
                <div>
                    <p className="text-[10px] text-yellow-800 font-bold uppercase">Código Contrato</p>
                    <p className="text-lg font-mono font-bold text-slate-800">{listing.contractCode}</p>
                </div>
                <button onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(listing.contractCode || ''); alert('Copiado'); }} className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-100 rounded">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
            </div>
        )}

        <div className="mt-auto pt-4">
            <Link
            to={`/listing/${listing.id}`}
            className="block w-full rounded-lg bg-cyan-500 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
            >
            Ver detalles
            </Link>
        </div>
      </div>
    </div>
  );
};