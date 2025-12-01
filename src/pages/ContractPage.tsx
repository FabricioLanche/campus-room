import { useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';

export const ContractPage = () => {
  const { getDealByContractCode, signContract } = useChat();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'enter_code' | 'review' | 'success'>('enter_code');
  const [code, setCode] = useState('');
  const [deal, setDeal] = useState<any>(null);
  const [paymentCode, setPaymentCode] = useState('');
  
  // NUEVO: Estado para la notificación de advertencia
  const [showWarning, setShowWarning] = useState(false);
  
  // Lógica del Canvas de Firma
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: any) => {
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentCode);
    alert(`¡Código ${paymentCode} copiado al portapapeles!`);
  };

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    const foundDeal = getDealByContractCode(code.trim());
    if (foundDeal) {
        setDeal(foundDeal);
        setStep('review');
    } else {
        alert("Código de contrato no encontrado.");
    }
  };

  const handleSign = () => {
      const pCode = signContract(deal.contractCode);
      setPaymentCode(pCode);
      setStep('success');
      
      // NUEVO: Activamos la advertencia inmediatamente al firmar
      setShowWarning(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
        
        {/* --- PASO 1: INGRESAR CÓDIGO --- */}
        {step === 'enter_code' && (
            <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center animate-fadeIn">
                <div className="bg-blue-100 p-5 rounded-full mb-6 text-primary shadow-inner">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Firmar Contrato</h1>
                <p className="text-slate-500 mb-8 max-w-sm">
                    Para iniciar, ingresa el <strong>Código de Contrato</strong> que el arrendatario te envió por el chat.
                </p>
                <form onSubmit={handleValidate} className="w-full max-w-sm space-y-4">
                    <input 
                        type="text" 
                        placeholder="Ej: CTR-1234" 
                        className="w-full text-center text-3xl font-mono uppercase border-2 border-slate-200 rounded-xl py-4 focus:border-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        autoFocus
                    />
                    <button className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                        Revisar Documento
                    </button>
                </form>
            </div>
        )}

        {/* --- PASO 2: REVISAR Y FIRMAR (Igual que antes) --- */}
        {step === 'review' && deal && (
            <div className="flex flex-col lg:flex-row h-full animate-fadeIn">
                {/* Lado Izquierdo: Documento */}
                <div className="flex-1 p-8 bg-slate-50 border-r border-slate-200 overflow-y-auto max-h-[800px]">
                    <div className="bg-white p-10 shadow-sm border border-slate-200 text-sm font-serif text-justify leading-relaxed">
                        <div className="text-center mb-8 border-b pb-4">
                            <h2 className="font-bold text-2xl uppercase tracking-widest text-slate-800">Contrato de Arrendamiento</h2>
                            <p className="text-xs text-slate-400 mt-1">Ref: {deal.contractCode}</p>
                        </div>
                        
                        <p className="mb-4">
                            Conste por el presente documento, el contrato de arrendamiento que celebran de una parte <strong>{deal.landlordName}</strong> (EL ARRENDADOR) y de otra parte <strong>{deal.studentName}</strong> (EL ARRENDATARIO).
                        </p>
                        <p className="mb-4">
                            <strong>PRIMERO:</strong> EL ARRENDADOR cede en alquiler el inmueble ubicado en <strong>{deal.listingAddress}</strong>, destinado exclusivamente a vivienda estudiantil.
                        </p>
                        <p className="mb-4">
                            <strong>SEGUNDO:</strong> La renta mensual pactada es de <strong>S/ {deal.price}.00</strong>, pagaderos por adelantado.
                        </p>
                        <p className="mb-4">
                            <strong>TERCERO:</strong> Ambas partes acuerdan someterse a las normas de convivencia y realizar los pagos a través de la plataforma CampusRoom.
                        </p>
                        
                        <div className="mt-16 pt-8 flex justify-between gap-8">
                            <div className="text-center w-1/2">
                                <div className="border-b border-black mb-2 relative">
                                    <span className="absolute -top-6 left-0 right-0 font-cursive text-xl text-blue-800 opacity-70 rotate-[-5deg]">Carlos Mendoza</span>
                                </div>
                                <p className="text-xs font-bold uppercase">EL ARRENDADOR</p>
                            </div>
                            <div className="text-center w-1/2">
                                <div className="border-b border-black mb-2 h-8"></div>
                                <p className="text-xs font-bold uppercase">EL ARRENDATARIO</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lado Derecho: Panel de Firma */}
                <div className="w-full lg:w-96 p-8 flex flex-col bg-white shadow-xl z-10">
                    <h3 className="font-bold text-xl text-slate-900 mb-2">Tu Firma</h3>
                    <p className="text-sm text-slate-500 mb-6">Por favor dibuja tu firma en el recuadro para validar tu identidad.</p>
                    
                    <div className="border-2 border-slate-900 rounded-xl bg-white h-48 mb-3 relative touch-none shadow-inner overflow-hidden">
                        <canvas 
                            ref={canvasRef}
                            width={320}
                            height={190}
                            className="w-full h-full cursor-crosshair"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        <div className="absolute bottom-2 left-2 text-[10px] text-slate-300 pointer-events-none uppercase tracking-widest font-bold">Área de firma</div>
                    </div>

                    <button 
                        onClick={clearCanvas} 
                        className="self-end text-xs text-red-500 font-medium hover:text-red-700 hover:underline mb-6 flex items-center gap-1"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Limpiar firma
                    </button>

                    <div className="mt-auto space-y-4">
                        <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <input type="checkbox" className="mt-1 h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" id="terms" />
                            <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer">
                                Declaro bajo juramento que he leído el contrato y que la firma proporcionada es válida y me representa legalmente.
                            </label>
                        </div>
                        <button 
                            onClick={handleSign} 
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                        >
                            Firmar y Finalizar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* --- PASO 3: ÉXITO + CÓDIGO DE PAGO --- */}
        {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-slate-50 h-full relative">
                
                {/* --- MODAL DE ADVERTENCIA AUTOMÁTICO --- */}
                {showWarning && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center border-t-4 border-yellow-500 animate-slideUp">
                            <div className="mx-auto w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600 animate-pulse">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">¡No cierres esta ventana!</h3>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                El sistema ha generado tu código único. <br/>
                                <strong className="text-slate-900">Debes copiarlo ahora mismo.</strong> Si sales de esta pantalla sin copiarlo, no podrás realizar el pago.
                            </p>
                            <button 
                                onClick={() => setShowWarning(false)}
                                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                            >
                                Entendido, mostrar código
                            </button>
                        </div>
                    </div>
                )}

                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-green-500/30 animate-bounce">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                
                <h2 className="text-4xl font-extrabold text-slate-900 mb-4">¡Firmado con éxito!</h2>
                <p className="text-slate-600 max-w-md mx-auto mb-10 text-lg">
                    El contrato es legalmente vinculante. Para activar el alquiler, debes realizar el pago usando el siguiente código:
                </p>
                
                <div className="bg-white border-2 border-slate-200 p-8 rounded-2xl w-full max-w-md mx-auto shadow-2xl relative overflow-hidden group hover:border-primary transition-colors">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-purple-600"></div>
                    
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tu Código de Pago</p>
                    
                    <div className="flex items-center justify-center gap-4 my-4">
                        <p className="text-5xl font-mono tracking-wider font-bold text-slate-900">{paymentCode}</p>
                    </div>

                    <button 
                        onClick={copyToClipboard}
                        className="flex items-center justify-center gap-2 mx-auto mt-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copiar Código
                    </button>
                </div>

                <button 
                    onClick={() => navigate('/pago')} 
                    className="mt-12 bg-primary text-white font-bold py-4 px-10 rounded-full hover:bg-blue-600 transition-all shadow-lg hover:scale-105 flex items-center gap-2"
                >
                    Ir a Pagar Ahora
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
            </div>
        )}

      </div>
    </div>
  );
};