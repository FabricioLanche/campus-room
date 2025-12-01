import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext'; // Importar Auth

export const PaymentPage = () => {
  const navigate = useNavigate();
  const { getDealByPaymentCode } = useChat();
  const { user } = useAuth(); // Obtener usuario actual
  
  // Estados para Estudiante
  const [step, setStep] = useState<'code' | 'checkout'>('code');
  const [code, setCode] = useState('');
  const [months, setMonths] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [dealData, setDealData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- VISTA DE ARRENDATARIO (DASHBOARD FINANCIERO) ---
  if (user?.role === 'landlord') {
    // Datos Mockeados de Ingresos para Carlos
    const incomeStats = {
      totalBalance: 3450.00,
      lastMonth: 1200.00,
      pending: 850.00
    };

    const recentTransactions = [
      { id: 1, tenant: "Ana García", listing: "Minidepa en Surco", date: "15 Oct 2025", amount: 850, status: "Pagado" },
      { id: 2, tenant: "Luis Pérez", listing: "Habitación en Barranco", date: "12 Oct 2025", amount: 600, status: "Pagado" },
      { id: 3, tenant: "Josue Hernández", listing: "Loft cerca a UTEC", date: "01 Oct 2025", amount: 1200, status: "Pagado" },
    ];

    const upcomingPayments = [
      { id: 4, tenant: "Ana García", listing: "Minidepa en Surco", date: "15 Nov 2025", amount: 850, status: "Pendiente" },
      { id: 5, tenant: "Luis Pérez", listing: "Habitación en Barranco", date: "12 Nov 2025", amount: 600, status: "Pendiente" },
    ];

    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Panel Financiero</h1>
              <p className="text-slate-500">Resumen de tus ingresos y cobros pendientes.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm">
              <span className="text-slate-500">Saldo disponible: </span>
              <span className="font-bold text-green-600 text-lg">S/ {incomeStats.totalBalance.toFixed(2)}</span>
            </div>
          </div>

          {/* Tarjetas de Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Ingresos este mes</p>
                  <p className="text-2xl font-bold text-slate-900">S/ {incomeStats.lastMonth.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Por cobrar (Próx. 30 días)</p>
                  <p className="text-2xl font-bold text-slate-900">S/ {incomeStats.pending.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Contratos Activos</p>
                  <p className="text-2xl font-bold text-slate-900">3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Listas Detalladas */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Próximos Cobros */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-900">Próximos Cobros Programados</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {upcomingPayments.map((pay) => (
                  <div key={pay.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                        {pay.tenant.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{pay.tenant}</p>
                        <p className="text-xs text-slate-500">{pay.listing}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-sm">S/ {pay.amount}</p>
                      <p className="text-xs text-orange-500 font-medium">{pay.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historial Reciente */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-900">Últimos Ingresos Recibidos</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{tx.listing}</p>
                        <p className="text-xs text-slate-500">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-sm">+ S/ {tx.amount}</p>
                      <p className="text-xs text-slate-400">Completado</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // --- VISTA DE ESTUDIANTE (FORMULARIO DE PAGO) ---
  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const deal = getDealByPaymentCode(code.trim());
    
    if (deal && deal.isSigned) {
        setDealData(deal);
        setStep('checkout');
    } else {
        alert("Código de pago no encontrado o contrato no firmado.");
    }
  };

  let basePrice = 0;
  let commission = 0;
  let monthlyTotal = 0;
  let grandTotal = 0;
  let paymentSchedule: any[] = [];

  if (step === 'checkout' && dealData) {
      basePrice = dealData.price;
      commission = basePrice * 0.05; 
      monthlyTotal = basePrice + commission;
      grandTotal = monthlyTotal * months;

      paymentSchedule = Array.from({ length: months }).map((_, index) => {
          const date = new Date();
          date.setMonth(date.getMonth() + index);
          return {
              date: index === 0 ? "Hoy" : date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }),
              amount: monthlyTotal,
              isFirst: index === 0
          };
      });
  }

  if (step === 'checkout' && dealData) {
      return (
        <div className="min-h-screen bg-white pb-20 font-sans">
          
          <div className="border-b py-4 px-6 mb-6 flex items-center gap-4">
             <button onClick={() => setStep('code')} className="text-slate-500 hover:text-slate-900">←</button>
             <h1 className="text-xl font-bold text-slate-900">Confirmar y pagar</h1>
          </div>

          <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-12">
            
            {/* IZQUIERDA: Configuración */}
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
                            <input type="text" placeholder="Número de tarjeta" className="w-full outline-none text-slate-900 placeholder:text-slate-400" />
                            <div className="absolute right-4 top-4 flex gap-1">
                                <div className="h-6 w-9 bg-slate-200 rounded"></div>
                                <div className="h-6 w-9 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex-1 p-4 border-r border-gray-300">
                                <input type="text" placeholder="MM/AA" className="w-full outline-none text-slate-900 placeholder:text-slate-400" />
                            </div>
                            <div className="flex-1 p-4">
                                <input type="text" placeholder="CVV" className="w-full outline-none text-slate-900 placeholder:text-slate-400" />
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
                </div>
            </div>

            {/* DERECHA: Resumen */}
            <div className="lg:pl-10">
                <div className="border border-gray-200 rounded-2xl p-6 shadow-xl sticky top-24 bg-white">
                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                        <img src={dealData.listingImage} className="w-28 h-24 object-cover rounded-xl" alt="Propiedad" />
                        <div className="flex flex-col justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Alojamiento entero</p>
                                <h3 className="font-medium text-slate-900 text-sm leading-tight mt-1">{dealData.listingTitle}</h3>
                            </div>
                            <p className="text-xs text-slate-500">{dealData.listingAddress}</p>
                        </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-4">Detalle del precio</h3>
                    
                    <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex justify-between">
                            <span>Alquiler mensual</span>
                            <span>S/ {basePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Comisión (5%)</span>
                            <span>S/ {commission.toFixed(2)}</span>
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
                        </div>
                    </div>

                </div>
            </div>

          </div>

          {showDetailsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
                    <div className="flex justify-between items-center p-4 border-b">
                        <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-100 rounded-full">✕</button>
                        <h3 className="font-bold">Plan de pagos</h3>
                    </div>
                    <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
                        {paymentSchedule.map((item, idx) => (
                            <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${item.isFirst ? 'bg-green-50 border border-green-100' : 'border border-slate-100'}`}>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{item.isFirst ? 'Pago inicial' : `Cuota ${idx + 1}`}</p>
                                    <p className="text-xs text-slate-500">{item.date}</p>
                                </div>
                                <p className="font-mono font-medium text-sm">S/ {item.amount.toFixed(2)}</p>
                            </div>
                        ))}
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
            <h1 className="text-2xl font-bold text-slate-900">Pagar Alquiler</h1>
            <p className="text-slate-500 text-sm">Ingresa el CÓDIGO DE PAGO que obtuviste al finalizar la firma.</p>
            <form onSubmit={handleValidateCode} className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Ej: PAY-xxxx" 
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
