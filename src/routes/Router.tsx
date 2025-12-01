import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Listings } from '../pages/Listings';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { MapPage } from '../pages/MapPage';
import { ListingDetail } from '../pages/ListingDetail';
import { Profile } from '../pages/Profile';
import { PublishPage } from '../pages/PublishPage';
import { Navbar } from '../components/Navbar';
import { LandlordProfile } from '../pages/LandlordProfile';
import { ChatsPage } from '../pages/ChatsPage';
import { FloatingChat } from '../components/FloatingChat';
import { PaymentPage } from '../pages/PaymentPage';
import { ContractPage } from '../pages/ContractPage';

// IMPORTS DE CONTEXTO
import { ListingsProvider } from '../context/ListingsContext';
import { ChatProvider } from '../context/ChatContext';
import { AuthProvider } from '../context/AuthContext'; 

export const Router = () => (
  <AuthProvider> {/* <--- 1. ENVOLVER CON AUTH PROVIDER AL NIVEL MÁS ALTO */}
    <ListingsProvider>
      <ChatProvider>
        <div className="min-h-screen bg-page text-slate-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/avisos" element={<Listings />} />
              <Route path="/mapa" element={<MapPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/publicar" element={<PublishPage />} />
              <Route path="/chats" element={<ChatsPage />} />
              <Route path="/perfil-arrendatario/:id" element={<LandlordProfile />} />
              <Route path="/pago" element={<PaymentPage />} />
              <Route path="/contrato" element={<ContractPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <FloatingChat />
          
        </div>
      </ChatProvider>
    </ListingsProvider>
  </AuthProvider>
);