import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export const ChatsPage = () => {
  const { allChats, activeChat, openChatWith, sendMessage, sendContractInfo } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll cuando llega un mensaje nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

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

  // FORMATO DE TIEMPO
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-white flex overflow-hidden">
      
      {/* --- SIDEBAR (Lista de Chats) --- */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-white ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Chats</h1>
          <div className="flex gap-2">
             <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
             </button>
          </div>
        </div>
        
        <div className="p-3">
           <input type="text" placeholder="Buscar en Messenger" className="w-full bg-slate-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {allChats.length === 0 ? (
             <div className="p-8 text-center text-slate-500">
                <p>No tienes mensajes aún.</p>
             </div>
          ) : (
             allChats.map(chat => (
               <div 
                 key={chat.id} 
                 onClick={() => openChatWith(chat.participantId, chat.participantName)}
                 className={`flex items-center gap-3 p-3 mx-2 rounded-xl cursor-pointer transition-colors ${activeChat?.id === chat.id ? 'bg-blue-50' : 'hover:bg-slate-100'}`}
               >
                 <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600">
                      {chat.participantName.charAt(0)}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                       <h3 className="font-semibold text-slate-900 truncate">{chat.participantName}</h3>
                       <span className="text-xs text-slate-400">{chat.messages.length > 0 && formatTime(chat.messages[chat.messages.length-1].timestamp)}</span>
                    </div>
                    <p className={`text-sm truncate ${activeChat?.id === chat.id ? 'text-primary font-medium' : 'text-slate-500'}`}>
                       {chat.messages.length > 0 ? chat.messages[chat.messages.length-1].text : 'Nueva conversación'}
                    </p>
                 </div>
               </div>
             ))
          )}
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className={`flex-1 flex flex-col bg-white ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        
        {activeChat ? (
          <>
            {/* Header del Chat */}
            <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between shadow-sm bg-white z-10">
               <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/chats')} className="md:hidden p-2 -ml-2 text-slate-500">←</button>
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                      {activeChat.participantName.charAt(0)}
                  </div>
                  <div>
                     <h2 className="font-bold text-slate-900">{activeChat.participantName}</h2>
                     <p className="text-xs text-green-600 font-medium">Activo(a) ahora</p>
                  </div>
               </div>
               <div className="flex gap-4 text-primary">
                  <button><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></button>
                  <button><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                  <button><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
               </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 bg-white">
               <div className="text-center my-6">
                  <div className="h-24 w-24 rounded-full bg-slate-200 mx-auto flex items-center justify-center text-4xl font-bold text-slate-500 mb-2">
                     {activeChat.participantName.charAt(0)}
                  </div>
                  <h3 className="font-bold text-xl">{activeChat.participantName}</h3>
                  <p className="text-slate-500 text-sm">Empezaste una conversación con {activeChat.participantName}</p>
               </div>

               {activeChat.messages.map((msg) => {
                 const isMe = msg.senderId === 'me';
                 return (
                   <div key={msg.id} className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
                     {!isMe && (
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold mr-2 self-end mb-1">
                           {activeChat.participantName.charAt(0)}
                        </div>
                     )}
                     
                     <div className={`max-w-[70%] lg:max-w-[50%] px-4 py-3 rounded-2xl break-words whitespace-pre-wrap shadow-sm text-sm lg:text-base ${
                        isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-slate-100 text-slate-900 rounded-bl-sm'
                     }`}>
                        {/* Renderizar Links */}
                        {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                            part.match(/https?:\/\//) ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold text-inherit break-all">{part}</a> : part
                        )}
                        
                        {/* Hora del mensaje */}
                        <p className={`text-[10px] text-right mt-1 opacity-70 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                           {formatTime(msg.timestamp)}
                        </p>
                     </div>
                   </div>
                 );
               })}
               <div ref={messagesEndRef} />
            </div>

            {/* Footer Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
               <div className="flex items-center gap-3">
                  {user?.role === 'landlord' && (
                     <button onClick={handleCreateOffer} className="p-2 text-primary hover:bg-slate-100 rounded-full transition-colors" title="Crear Contrato">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                     </button>
                  )}
                  <div className="flex-1 bg-slate-100 rounded-full px-4 py-2 flex items-center">
                     <form onSubmit={handleSend} className="w-full flex">
                        <input 
                           type="text" 
                           className="w-full bg-transparent focus:outline-none text-slate-900" 
                           placeholder="Escribe un mensaje..."
                           value={inputText}
                           onChange={(e) => setInputText(e.target.value)}
                        />
                     </form>
                  </div>
                  <button onClick={handleSend} disabled={!inputText.trim()} className="p-2 text-primary hover:bg-slate-100 rounded-full disabled:opacity-50">
                     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                  </button>
               </div>
            </div>
          </>
        ) : (
          /* Estado Vacío (Derecha cuando no hay chat seleccionado) */
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
             <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
             </div>
             <h2 className="text-xl font-bold text-slate-600">Tus mensajes</h2>
             <p>Selecciona una conversación para empezar a chatear</p>
          </div>
        )}
      </div>
    </div>
  );
};