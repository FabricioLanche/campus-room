import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* LOGO: Clic lleva al Inicio */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
          </div>
          <div className="leading-none">
            <span className="block text-lg font-bold text-slate-900">CampusRoom</span>
            <span className="text-[10px] text-slate-500">Vive cerca, vive conectado</span>
          </div>
        </Link>

        {/* MENÚ DERECHO */}
        <div className="flex items-center gap-4">
          
          {/* OPCIONES DE USUARIO LOGUEADO */}
          {user && (
             <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
                <Link to="/chats" className="hover:text-primary transition-colors">
                  Mensajes
                </Link>
                {/* --- AQUÍ AGREGAMOS EL ENLACE FALTANTE --- */}
                <Link to="/contrato" className="hover:text-primary transition-colors">
                  Contrato
                </Link>
                <Link to="/pago" className="hover:text-primary transition-colors">
                  Pagos
                </Link>
             </div>
          )}

          {/* BOTÓN ARRENDATARIO (Solo si NO eres landlord) */}
          {user?.role !== 'landlord' && (
            <>
              {/* Separador vertical si hay links antes */}
              {user && <div className="hidden md:block h-4 w-px bg-slate-200"></div>}
              
              <Link 
                to="/publicar" 
                className="hidden md:block rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Conviértete en arrendatario
              </Link>
            </>
          )}

          {/* PERFIL / LOGIN */}
          {user ? (
            <div className="flex items-center gap-4 pl-2">
              <Link 
                to="/perfil"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3 transition-colors hover:bg-slate-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate hidden sm:block">
                  {user.role === 'landlord' ? 'Arrendatario' : user.name}
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/registro"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Regístrate
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};