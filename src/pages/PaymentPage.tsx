import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';

export const PaymentPage = () => {
  const navigate = useNavigate();
  // CORRECCIÓN: Usamos getDealByPaymentCode en lugar de getOfferByCode
  const { getDealByPaymentCode } = useChat();
  
  // Estados
  const [step, setStep] = useState<'code' | 'checkout'>('code');
  const [code, setCode] = useState('');
  const [months, setMonths] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [dealData, setDealData] = useState<any>(null); // Cambiamos nombre a dealData
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Validar Código
  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    // CORRECCIÓN: Buscamos el trato usando el código de PAGO (ej: PAY-xxxx)
    const deal = getDealByPaymentCode(code.trim());
    
    if (deal && deal.isSigned) {
        setDealData(deal);
        setStep('checkout');
    } else {
        alert("Código de pago no encontrado o contrato no firmado. Asegúrate de haber firmado primero en la sección 'Contrato'.");
    }
  };

  // --- LÓGICA FINANCIERA ---
  let basePrice = 0;
  let commission = 0;
  let monthlyTotal = 0;
  let grandTotal = 0;
  let paymentSchedule: any[] = [];

  if (step === 'checkout' && dealData) {
      basePrice = dealData.price;
      
      // Comisión del 5% sobre el precio mensual
      commission = basePrice * 0.05; 
      
      // Total Mensual (Alquiler + Comisión)
      monthlyTotal = basePrice + commission;
      
      // Total del Contrato (Total Mensual * Meses)
      grandTotal = monthlyTotal * months;

      // Generar Cronograma de Pagos (Rutina)
      paymentSchedule = Array.from({ length: months }).map((_, index) => {
          const date = new Date();
          date.setMonth(date.getMonth() + index); // Sumar meses a la fecha actual
          
          return {
              date: index === 0 ? "Hoy" : date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }),
              amount: monthlyTotal,
              isFirst: index === 0
          };
      });
  }

  // RENDERIZADO DEL CHECKOUT
  if (step === 'checkout' && dealData) {
      return (
        <div className="min-h-screen bg-white pb-20 font-sans">
          
          {/* Header Simple */}
          <div className="border-b py-4 px-6 mb-6 flex items-center gap-4">
             <button onClick={() => setStep('code')} className="text-slate-500 hover:text-slate-900">←</button>
             <h1 className="text-xl font-bold text-slate-900">Confirmar y pagar</h1>
          </div>

          <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-12">
            
            {/* COLUMNA IZQUIERDA: Configuración */}
            <div className="space-y-8">
                
                <section>
                    <h2 className="text-xl font-semibold mb-4">Tu estancia</h2>
                    <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <div>
                            <p className="font-medium text-slate-900">Duración del contrato</p>
                            <select 
                                value={months}
                                onChange={(e) => setMonths(Number(e.target.value))}
                                className="mt-1 block w-full pl-0 pr-8 py-1 text-base border-none focus:ring-0 font-medium text-slate-600 cursor-pointer underline bg-transparent"
                            >
                                {[1,2,3,4,5,6,9,12].map(m => (
                                    <option key={m} value={m}>{m} mes{m>1?'es':''}</option>
                                ))}
                            </select>
                        </div>
                        <div className="text-right">
                            <p className="font-medium text-slate-900">Huéspedes</p>
                            <p className="text-slate-500">1 estudiante</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Pagar con</h2>
                    <div className="border border-gray-300 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-gray-300 relative">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Número de tarjeta</label>
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full outline-none text-slate-900 placeholder:text-slate-400" />
                            <div className="absolute right-4 top-4 flex gap-1">
                                <div className="h-6 w-9 bg-slate-200 rounded"></div>
                                <div className="h-6 w-9 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex-1 p-4 border-r border-gray-300">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Caducidad</label>
                                <input type="text" placeholder="MM/AA" className="w-full outline-none text-slate-900 placeholder:text-slate-400" />
                            </div>
                            <div className="flex-1 p-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVV</label>
                                <input type="text" placeholder="123" className="w-full outline-none text-slate-900 placeholder:text-slate-400" />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-4">
                    <button 
                        onClick={() => {
                            setIsProcessing(true);
                            setTimeout(() => {
                                alert("¡Pago procesado! Se ha iniciado la rutina de cobro mensual.");
                                navigate('/perfil');
                            }, 2000);
                        }}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-3.5 rounded-lg text-lg hover:brightness-95 transition-all shadow-md disabled:opacity-70"
                    >
                        {isProcessing ? 'Procesando...' : `Confirmar y pagar S/ ${monthlyTotal.toFixed(2)}`}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-3">No se hará ningún cargo hasta que confirmes.</p>
                </div>
            </div>

            {/* COLUMNA DERECHA: Resumen Financiero */}
            <div className="lg:pl-10">
                <div className="border border-gray-200 rounded-2xl p-6 shadow-xl sticky top-24 bg-white">
                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                        {/* Usamos una imagen genérica si no hay una específica en dealData */}
                        <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" className="w-28 h-24 object-cover rounded-xl" alt="Propiedad" />
                        <div className="flex flex-col justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Alojamiento entero</p>
                                <h3 className="font-medium text-slate-900 text-sm leading-tight mt-1">{dealData.listingTitle}</h3>
                            </div>
                            <p className="text-xs text-slate-500">{dealData.listingAddress}</p>
                            <div className="flex items-center gap-1 text-xs">
                                <span className="font-bold text-slate-900">★ 4.85</span>
                                <span className="text-slate-400">(Verificado)</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-4">Detalle del precio</h3>
                    
                    <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Alquiler mensual</span>
                            <span className="font-medium">S/ {basePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span className="underline decoration-dotted cursor-help" title="5% Comisión de servicio">Comisión CampusRoom (5%)</span>
                            <span className="font-medium">S/ {commission.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900 pt-3 border-t border-dashed mt-2">
                            <span>Pago mensual total</span>
                            <span>S/ {monthlyTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-4 pt-4 flex justify-between font-bold text-slate-900 text-lg">
                        <span>Total contrato ({months} meses)</span>
                        <span>S/ {grandTotal.toFixed(2)}</span>
                    </div>

                    {/* Rutina de Pagos */}
                    <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-slate-900 text-sm">Cronograma de pagos</span>
                            <button onClick={() => setShowDetailsModal(true)} className="text-xs font-bold underline text-slate-900">Ver todo</button>
                        </div>
                        
                        <div className="space-y-3 relative pl-4">
                            <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                            {paymentSchedule.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm relative">
                                    <div className={`absolute -left-4 w-2.5 h-2.5 rounded-full border-2 border-white ${item.isFirst ? 'bg-slate-900' : 'bg-slate-300'}`}></div>
                                    <span className={item.isFirst ? 'font-bold text-slate-900' : 'text-slate-500'}>
                                        {item.isFirst ? 'Pagar hoy' : item.date}
                                    </span>
                                    <span className={item.isFirst ? 'font-bold text-slate-900' : 'text-slate-500'}>
                                        S/ {item.amount.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                            {months > 3 && <p className="text-xs text-slate-400 pl-2 mt-1">... {months - 3} cuotas más</p>}
                        </div>
                    </div>

                </div>
            </div>

          </div>

          {/* MODAL DETALLES */}
          {showDetailsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
                    <div className="flex justify-between items-center p-4 border-b">
                        <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-100 rounded-full">✕</button>
                        <h3 className="font-bold">Plan de pagos completo</h3>
                        <div className="w-8"></div>
                    </div>
                    
                    <div className="p-6 text-center border-b border-gray-100 bg-slate-50">
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Monto Mensual Fijo</p>
                        <p className="text-3xl font-bold text-slate-900">S/ {monthlyTotal.toFixed(2)}</p>
                        <p className="text-xs text-slate-400 mt-1">Incluye alquiler y tarifas</p>
                    </div>

                    <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
                        {paymentSchedule.map((item, idx) => (
                            <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${item.isFirst ? 'bg-green-50 border border-green-100' : 'border border-slate-100'}`}>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{item.isFirst ? 'Pago inicial (Hoy)' : `Cuota ${idx + 1}`}</p>
                                    <p className="text-xs text-slate-500">{item.date}</p>
                                </div>
                                <p className="font-mono font-medium text-sm">S/ {item.amount.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="p-4 border-t">
                        <button onClick={() => setShowDetailsModal(false)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl">Entendido</button>
                    </div>
                </div>
            </div>
          )}

        </div>
      );
  }

  // PANTALLA 1: Ingreso de Código (Estado inicial)
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
            </div>
            
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Pago de Alquiler</h1>
                <p className="text-slate-500 mt-2 text-sm">Ingresa el <strong>CÓDIGO DE PAGO</strong> que obtuviste al finalizar la firma de tu contrato digital.</p>
            </div>

            <form onSubmit={handleValidateCode} className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Ej: PAY-1234" 
                    className="w-full text-center text-2xl font-mono tracking-widest uppercase border-2 border-slate-200 rounded-xl py-3 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                    Continuar
                </button>
            </form>
        </div>
    </div>
  );
};