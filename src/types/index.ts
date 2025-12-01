export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  image: string;
  address: string;
  specs: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  isUserCreated?: boolean;
  landlordId?: string;
  contractCode?: string;
  reviews?: Review[]; // <--- NUEVO CAMPO AGREGADO
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'landlord';
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  type: 'text' | 'contract_offer';
  contractCode?: string;
  contractLink?: string;
  contractTitle?: string;
}

export interface ChatSession {
  id: string;
  participantId: string;
  participantName: string;
  messages: Message[];
  unread: number;
}

export interface DealData {
  contractCode: string;
  paymentCode: string;
  listingTitle: string;
  listingAddress: string;
  price: number;
  studentName: string;
  landlordName: string;
  isSigned: boolean;
  isPaid: boolean;
  listingId: string;
}