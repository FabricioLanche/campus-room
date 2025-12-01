import { Message } from '../types';

interface ContractMessageProps {
  msg: Message;
  isMe: boolean;
}

export const ContractMessage = ({ msg, isMe }: ContractMessageProps) => {
  // Función para copiar el código al portapapeles
  const handleCopy = () => {
    if (msg.contractCode) {
      navigator.clipboard.writeText(msg.contractCode);
      alert("Código copiado: " + msg.contractCode);
    }
  };

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] rounded-xl overflow-hidden border ${isMe ? 'border-primary/20 bg-blue-50' : 'border-slate-200 bg-white shadow-sm'}`}>
        
        {/* Encabezado de la Tarjeta */}
        <div className={`p-3 flex items-center gap-3 border-b ${isMe ? 'border-primary/10 bg-primary/5' : 'border-slate-100 bg-slate-50'}`}>
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
              <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contrato Digital</p>
            <p className="text-sm font-semibold text-slate-900 truncate max-w-[150px]">{msg.contractTitle || "Alquiler"}</p>
          </div>
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div className="p-4 space-y-4">
          <p className="text-xs text-slate-600">
            Se ha generado una propuesta de arrendamiento. Por favor revisa el documento y usa el código para activar el pago.
          </p>

          {/* Botón Ver PDF */}
          <a 
            href={msg.contractLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Ver documento PDF
          </a>

          {/* Área del Código */}
          <div className="bg-slate-100 rounded-lg p-3 flex justify-between items-center group relative border border-slate-200">
            <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Código de activación</p>
                <p className="text-lg font-mono font-bold text-slate-800 tracking-wider select-all">{msg.contractCode}</p>
            </div>
            <button 
                onClick={handleCopy}
                className="p-2 text-slate-400 hover:text-primary transition-colors"
                title="Copiar código"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
                </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};