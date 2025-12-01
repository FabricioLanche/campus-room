import { ReactNode, createContext, useContext, useMemo, useState, useEffect } from 'react';
import { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  becomeLandlord: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Cargar usuario guardado al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('campusRoomUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const saveUser = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('campusRoomUser', JSON.stringify(userData));
  };

  // --- LÓGICA DE USUARIOS MOCKEADOS ---
  const login = (email: string, password: string) => {
    
    // 1. ARRENDATARIO (El dueño de los avisos)
    if (email === 'carlos@campusroom.com') {
      saveUser({
        id: 'landlord-1',
        name: 'Carlos Mendoza',
        email,
        role: 'landlord' // Rol de Arrendatario
      });
      return;
    }

    // 2. ESTUDIANTE PRINCIPAL (Josue)
    if (email === 'josue@gmail.com') {
      saveUser({
        id: 'student-josue',
        name: 'Josue Hernández',
        email,
        role: 'student' // Rol de Estudiante
      });
      return;
    }

    // 3. ESTUDIANTE DE PRUEBA 2 (Ana)
    if (email === 'ana@gmail.com') {
      saveUser({
        id: 'student-ana',
        name: 'Ana García',
        email,
        role: 'student'
      });
      return;
    }

    // 4. ESTUDIANTE DE PRUEBA 3 (Luis)
    if (email === 'luis@gmail.com') {
      saveUser({
        id: 'student-luis',
        name: 'Luis Pérez',
        email,
        role: 'student'
      });
      return;
    }

    // 5. CUALQUIER OTRO CORREO (Registro genérico)
    saveUser({
      id: `student-${Date.now()}`,
      name: 'Estudiante Nuevo',
      email,
      role: 'student'
    });
  };

  const register = (name: string, email: string, password: string) => {
    // Al registrarse manualmente, siempre eres estudiante
    saveUser({
      id: Date.now().toString(),
      name,
      email,
      role: 'student'
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusRoomUser');
  };

  const becomeLandlord = () => {
    if (user) {
      saveUser({
        ...user,
        role: 'landlord',
        name: user.name // Mantenemos el nombre original (ej: Josue)
      });
    }
  };

  const value = useMemo(() => ({
    user,
    login,
    register,
    logout,
    becomeLandlord,
    isLoading
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};