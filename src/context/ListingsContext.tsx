import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Listing } from '../types';
import { mockListings as initialSeedData } from '../data/mockListings';

interface ListingsContextValue {
  listings: Listing[];
  addListing: (listing: Listing) => void;
  deleteListing: (id: string) => void;
  myListings: Listing[];
  resetData: () => void;
  
  // NUEVOS ESTADOS PARA LA BÚSQUEDA
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  hasSearched: boolean;
  setHasSearched: (status: boolean) => void;
}

const ListingsContext = createContext<ListingsContextValue | undefined>(undefined);

export const ListingsProvider = ({ children }: { children: ReactNode }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  
  // Mover los estados de búsqueda AQUÍ para que sean globales
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const storedListings = localStorage.getItem('campusRoomListings');
    if (storedListings) {
      setListings(JSON.parse(storedListings));
    } else {
      setListings(initialSeedData);
      localStorage.setItem('campusRoomListings', JSON.stringify(initialSeedData));
    }
  }, []);

  const addListing = (newListing: Listing) => {
    setListings((prev) => {
      const updatedListings = [newListing, ...prev];
      localStorage.setItem('campusRoomListings', JSON.stringify(updatedListings));
      return updatedListings;
    });
  };

  const deleteListing = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este aviso?')) {
      setListings((prev) => {
        const updatedListings = prev.filter((item) => item.id !== id);
        localStorage.setItem('campusRoomListings', JSON.stringify(updatedListings));
        return updatedListings;
      });
    }
  };

  const myListings = listings.filter(item => item.isUserCreated);

  const resetData = () => {
    localStorage.removeItem('campusRoomListings');
    setListings(initialSeedData);
    setSearchTerm(''); // También reseteamos la búsqueda
    setHasSearched(false);
    window.location.reload();
  };

  return (
    <ListingsContext.Provider value={{ 
      listings, addListing, deleteListing, myListings, resetData,
      // Exportamos los estados de búsqueda
      searchTerm, setSearchTerm, hasSearched, setHasSearched
    }}>
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (!context) throw new Error('useListings debe usarse dentro de ListingsProvider');
  return context;
};