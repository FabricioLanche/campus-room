import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingsContext';
import { useNavigate } from 'react-router-dom';
import { CardListing } from '../components/CardListing';

export const Profile = () => {
  const { user, logout } = useAuth();
  // 1. Traemos 'listings' (todos los avisos) y 'resetData'
  const { listings, deleteListing, resetData } = useListings(); 
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  // 2. CORRECCIÓN DEL FILTRO: Buscamos por el ID del dueño
  // Esto encontrará tanto los avisos manuales como los pre-cargados de Carlos
  const myListings = listings.filter(
    item => item.landlordId === user.id || item.isUserCreated
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        
        {/* Tarjeta de Usuario */}
        <div className="mb-10 overflow-hidden rounded-xl bg-white shadow-lg border border-slate-200">
          <div className="bg-primary px-6 py-10 text-center relative overflow-hidden">
            {/* Adorno de fondo */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-bold text-primary shadow-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="relative z-10 text-3xl font-bold text-white">{user.name}</h1>
            <p className="relative z-10 text-blue-100 mt-1">{user.email}</p>
          </div>
          
          <div className="space-y-6 p-8 text-center">
             <div className="flex justify-center gap-4 text-sm font-medium text-slate-600">
                <span className="px-4 py-1 rounded-full bg-slate-100">
                    {user.role === 'landlord' ? 'Propietario' : 'Estudiante'}
                </span>
                <span className="px-4 py-1 rounded-full bg-slate-100">
                    {user.role === 'landlord' ? 'Cuenta Verificada' : 'Mi Universidad'}
                </span>
             </div>
             
             <hr className="border-slate-100 max-w-xs mx-auto" />
             
             <button 
                onClick={handleLogout} 
                className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
             >
                Cerrar Sesión
             </button>
          </div>
        </div>

        {/* Sección: Mis Avisos Publicados */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-bold text-slate-900">Mis Avisos Publicados ({myListings.length})</h2>
             {user.role === 'landlord' && (
                 <button 
                    onClick={() => navigate('/publicar')} 
                    className="text-sm font-bold text-primary hover:underline"
                 >
                    + Crear nuevo
                 </button>
             )}
          </div>
          
          {myListings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myListings.map(listing => (
                <CardListing 
                    key={listing.id} 
                    listing={listing}
                    onDelete={() => deleteListing(listing.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <p className="text-slate-900 font-medium text-lg">No tienes avisos activos</p>
              <p className="text-slate-500 mb-6">Tus publicaciones aparecerán aquí.</p>
              <button 
                onClick={() => navigate('/publicar')}
                className="px-6 py-2 rounded-full bg-primary text-white font-bold hover:bg-blue-600 transition-colors"
              >
                Publicar ahora
              </button>
            </div>
          )}
        </div>

        {/* Zona de Peligro (Útil para demos) */}
        <div className="mt-20 pt-10 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-400 mb-2">Herramientas de demostración</p>
            <button 
                onClick={resetData}
                className="text-xs text-slate-500 hover:text-red-500 underline"
            >
                Restaurar todos los datos originales
            </button>
        </div>

      </div>
    </div>
  );
};