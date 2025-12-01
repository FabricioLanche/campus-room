import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Message, ChatSession, DealData } from '../types';
import { mockListings } from '../data/mockListings';

interface OfferData {
  code: string;
  listingTitle: string;
  price: number;
  listingImage: string;
  listingAddress: string;
}

interface ChatContextValue {
  isOpen: boolean;
  isMinimized: boolean;
  activeChat: ChatSession | null;
  allChats: ChatSession[];
  openChatWith: (participantId: string, name: string) => void;
  sendMessage: (text: string) => void;
  toggleMinimize: () => void;
  closeChat: () => void;
  generateContractOffer: (listing: any) => void;
  getDealByContractCode: (code: string) => DealData | undefined;
  getDealByPaymentCode: (code: string) => DealData | undefined;
  signContract: (contractCode: string) => string; 
  deals: DealData[];
  sendContractInfo: (listing: any) => void; 
  getOfferByCode: (code: string) => any;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [allChats, setAllChats] = useState<ChatSession[]>([]);
  const [activeOffers, setActiveOffers] = useState<OfferData[]>([]);
  
  // Almacén de tratos
  const [deals, setDeals] = useState<DealData[]>([]);

  // Inicialización de datos mock
  useEffect(() => {
    const preloadedDeals: DealData[] = mockListings.map(listing => ({
        contractCode: listing.contractCode || `CTR-${listing.id}`,
        paymentCode: `PAY-${listing.id}${Math.floor(Math.random() * 100)}`,
        listingTitle: listing.title,
        listingAddress: listing.address,
        price: listing.price,
        studentName: "Estudiante",
        landlordName: "Carlos Mendoza",
        isSigned: false,
        isPaid: false,
        listingId: listing.id
    }));
    setDeals(preloadedDeals);
  }, []);

  const toggleMinimize = () => setIsMinimized(!isMinimized);
  const closeChat = () => setIsOpen(false);

  const openChatWith = (participantId: string, name: string) => {
      setIsOpen(true);
      setIsMinimized(false);
      const existingChat = allChats.find(c => c.participantId === participantId);
      if (existingChat) {
        setActiveChat(existingChat);
      } else {
        const newChat: ChatSession = {
          id: Date.now().toString(),
          participantId,
          participantName: name,
          messages: [],
          unread: 0
        };
        setAllChats(prev => [...prev, newChat]);
        setActiveChat(newChat);
      }
  };

  // RESPUESTA AUTOMÁTICA (Corregida: Sin Link en texto)
  const triggerAutoResponse = (chatId: string) => {
    setTimeout(() => {
        const mockListing = {
            title: "Minidepa Estudiantil en Surco",
            price: 850,
            address: "Av. Principal 656, Surco"
        };
        
        const contractCode = `CTR-${Math.floor(1000 + Math.random() * 9000)}`;
        const paymentCode = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const newDeal: DealData = {
            contractCode,
            paymentCode,
            listingTitle: mockListing.title,
            listingAddress: mockListing.address,
            price: mockListing.price,
            studentName: "Estudiante",
            landlordName: "Carlos Mendoza",
            isSigned: false,
            isPaid: false,
            listingId: 'mock-listing-1'
        };
        setDeals(prev => [...prev, newDeal]);

        const driveLink = "https://drive.google.com/drive/folders/1b-EJyGPfXqQmcVqpkKcAsSLb7laQjErQ?usp=sharing";
        
        // CORRECCIÓN AQUÍ: Quitamos el link del texto
        const responseMsg: Message = {
            id: Date.now().toString(),
            text: `Hola, he generado la propuesta de contrato para "${mockListing.title}".
            
Si estás de acuerdo, ve a la sección "Contrato" e ingresa este código para firmar:

🔑 CÓDIGO: ${contractCode}`,
            senderId: 'landlord-1',
            timestamp: Date.now(),
            type: 'contract_offer',
            contractCode: contractCode,
            contractLink: driveLink, // El link va oculto aquí para el botón
            contractTitle: mockListing.title
        };

        setAllChats(prev => prev.map(chat => {
            if (chat.id === chatId) {
                const updatedChat = { ...chat, messages: [...chat.messages, responseMsg] };
                setActiveChat(current => current?.id === chatId ? updatedChat : current);
                return updatedChat;
            }
            return chat;
        }));

    }, 1500);
  };

  const sendMessage = (text: string) => {
    if (!activeChat) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId: 'me',
      timestamp: Date.now(),
      type: 'text'
    };
    const updatedChat = { ...activeChat, messages: [...activeChat.messages, newMessage] };
    setActiveChat(updatedChat);
    setAllChats(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));

    if (activeChat.participantId === 'landlord-1') {
        triggerAutoResponse(activeChat.id);
    }
  };

  // GENERAR CONTRATO MANUAL (Corregida: Sin Link en texto)
  const generateContractOffer = (listing: any) => {
    if (!activeChat) return;

    const contractCode = `CTR-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentCode = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Verificamos si ya existe el trato
    if (!deals.find(d => d.contractCode === contractCode)) {
        const newDeal: DealData = {
            contractCode,
            paymentCode,
            listingTitle: listing.title,
            listingAddress: listing.address,
            price: listing.price,
            studentName: "Estudiante",
            landlordName: "Carlos Mendoza",
            isSigned: false,
            isPaid: false,
            listingId: listing.id
        };
        setDeals(prev => [...prev, newDeal]);
    }

    const driveLink = "https://drive.google.com/drive/folders/1b-EJyGPfXqQmcVqpkKcAsSLb7laQjErQ?usp=sharing";
    
    // CORRECCIÓN AQUÍ: Quitamos el link del texto
    const messageText = `He generado el contrato digital para "${listing.title}".
    
Por favor, ve a la sección "Contrato" e ingresa este código para leer y firmar el documento:

🔑 CÓDIGO DE CONTRATO: ${contractCode}`;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      senderId: 'me',
      timestamp: Date.now(),
      type: 'contract_offer',
      contractCode: contractCode,
      contractLink: driveLink,
      contractTitle: listing.title
    };

    const updatedChat = { ...activeChat, messages: [...activeChat.messages, newMessage] };
    setActiveChat(updatedChat);
    setAllChats(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));
  };

  const sendContractInfo = generateContractOffer;

  const getDealByContractCode = (code: string) => deals.find(d => d.contractCode === code.trim());
  const getDealByPaymentCode = (code: string) => deals.find(d => d.paymentCode === code.trim());
  const getOfferByCode = (code: string) => undefined;

  const signContract = (contractCode: string) => {
      const deal = deals.find(d => d.contractCode === contractCode);
      if (deal) {
          deal.isSigned = true;
          setDeals([...deals]);
          return deal.paymentCode;
      }
      return '';
  };

  return (
    <ChatContext.Provider value={{ 
      isOpen, isMinimized, activeChat, allChats, 
      openChatWith, sendMessage, toggleMinimize, closeChat,
      generateContractOffer, sendContractInfo,
      getDealByContractCode, getDealByPaymentCode, signContract, getOfferByCode,
      deals
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
