import { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ContractMessage } from '../components/ContractMessage'; 

export const FloatingChat = () => {
  const { isOpen, isMinimized, activeChat, sendMessage, toggleMinimize, closeChat, sendContractInfo } = useChat();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isOpen]);

  if (!isOpen || !activeChat) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleCreateOffer = () => {
    const mockListingData = {
        title: "Minidepa Estudiantil en Surco",
        price: 850,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
        address: "Av. Principal 656, Surco"
    };
    if (window.confirm(`¿Generar contrato para "${mockListingData.title}"?`)) {
        sendContractInfo(mockListingData);
    }
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/chats');
  };

  return (
    <div className={`fixed right-4 bottom-0 z-50 w-80 rounded-t-xl bg-white shadow-2xl transition-all duration-300 border border-slate-200 ${isMinimized ? 'h-14' : 'h-96'}`}>
      
      {/* Header */}
      <div className="flex h-14 cursor-pointer items-center justify-between rounded-t-xl bg-primary px-4 text-white shadow-md hover:bg-blue-600" onClick={toggleMinimize}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="relative shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">
              {activeChat.participantName.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-primary"></span>
          </div>
          <span className="font-semibold truncate">{activeChat.participantName}</span>
        </div>
        
        <div className="flex items-center gap-2">
           <button onClick={handleExpand} className="text-white/80 hover:text-white" title="Pantalla completa">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
           </button>
           <button onClick={(e) => { e.stopPropagation(); toggleMinimize(); }} className="text-white/80 hover:text-white">{isMinimized ? '▲' : '−'}</button>
           <button onClick={(e) => { e.stopPropagation(); closeChat(); }} className="text-white/80 hover:text-white">✕</button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex h-[calc(100%-7rem)] flex-col gap-3 overflow-y-auto bg-slate-50 p-4">
            {activeChat.messages.length === 0 && <p className="text-center text-xs text-slate-400 mt-4">Comienza la conversación...</p>}
            
            {activeChat.messages.map((msg) => {
              const isMe = msg.senderId === 'me';
              
              // --- RENDERIZAR TARJETA SI ES CONTRATO ---
              if (msg.type === 'contract_offer') {
                  return <ContractMessage key={msg.id} msg={msg} isMe={isMe} />;
              }

              // --- RENDERIZAR TEXTO NORMAL ---
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
                    {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                        part.match(/https?:\/\//) ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold text-inherit hover:opacity-80 break-all">{part}</a> : part
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="h-14 border-t bg-white p-2 flex items-center gap-2">
            {user?.role === 'landlord' && (
                <button onClick={handleCreateOffer} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors shrink-0" title="Enviar contrato">+</button>
            )}
            <form onSubmit={handleSend} className="flex-1 flex gap-2">
              <input type="text" className="flex-1 rounded-full bg-slate-100 px-4 text-sm focus:outline-none" placeholder="Escribe..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
              <button type="submit" className="font-bold text-primary disabled:opacity-50 text-sm" disabled={!inputText.trim()}>Enviar</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};