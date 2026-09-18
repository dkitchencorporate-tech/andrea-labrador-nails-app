import React, { useState, useEffect } from 'react';
import { 
  ServiceItem, 
  ServiceAddon, 
  PaymentMethodType, 
  AppointmentBooking, 
  PromoOffer 
} from '../types';
import { INITIAL_ADDONS, AVAILABLE_TIME_SLOTS } from '../data/initialData';
import { AppStore } from '../services/store';
import confetti from 'canvas-confetti';
import { 
  X, 
  Calendar, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Send, 
  ChevronRight, 
  User, 
  Phone, 
  CreditCard 
} from 'lucide-react';
import { InstagramIcon } from './Icons';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: ServiceItem | null;
  preSelectedPromo?: PromoOffer | null;
  services: ServiceItem[];
  exchangeRate: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedService,
  preSelectedPromo,
  services,
  exchangeRate,
}) => {
  // Wizard steps: 1: Service & Addons, 2: Date & Time, 3: Client Info & Confirm
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Selection state
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  // Client details
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientInstagram, setClientInstagram] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('pago_movil');
  const [notes, setNotes] = useState('');

  // Confirmation state
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastCreatedBooking, setLastCreatedBooking] = useState<AppointmentBooking | null>(null);

  // Initialize dates: generate next 14 days excluding Sundays
  const availableDates = React.useMemo(() => {
    const dates: { dateString: string; dayName: string; dayNumber: number; monthName: string }[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);
      
      // Sunday is 0: Skip Sundays as studio is closed
      if (nextDate.getDay() === 0) continue;

      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;

      const dayName = nextDate.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
      const dayNumber = nextDate.getDate();
      const monthName = nextDate.toLocaleDateString('es-ES', { month: 'short' });

      dates.push({ dateString, dayName, dayNumber, monthName });
    }
    return dates;
  }, []);

  // Update selection when modal opens with pre-selected item
  useEffect(() => {
    if (preSelectedService) {
      setSelectedServiceId(preSelectedService.id);
    } else if (preSelectedPromo) {
      // Find service matching promo
      setSelectedServiceId('semipermanente');
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }

    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0].dateString);
    }
  }, [isOpen, preSelectedService, preSelectedPromo, services, availableDates]);

  if (!isOpen) return null;

  const currentService = services.find(s => s.id === selectedServiceId) || services[0];
  const selectedAddons = INITIAL_ADDONS.filter(a => selectedAddonIds.includes(a.id));

  // Calculate pricing
  const basePriceUSD = preSelectedPromo ? preSelectedPromo.promoPriceUSD : (currentService ? currentService.priceUSD : 10);
  const addonsTotalUSD = selectedAddons.reduce((acc, curr) => acc + curr.priceUSD, 0);
  const totalPriceUSD = basePriceUSD + addonsTotalUSD;
  const totalPriceVES = totalPriceUSD * exchangeRate;

  // Toggle addon
  const toggleAddon = (id: string) => {
    setSelectedAddonIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Submit and open WhatsApp
  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor indica tu nombre y teléfono para confirmar la cita.');
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      alert('Por favor selecciona una fecha y hora disponibles.');
      setStep(2);
      return;
    }

    // Check availability once more before finalizing
    if (AppStore.isSlotOccupied(selectedDate, selectedTimeSlot)) {
      alert('Lo sentimos, este horario acaba de ser reservado. Por favor elige otro horario.');
      return;
    }

    const booking: AppointmentBooking = {
      id: 'cita_' + Date.now(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientInstagram: clientInstagram.trim() || undefined,
      serviceId: currentService.id,
      serviceName: preSelectedPromo ? preSelectedPromo.title : currentService.name,
      servicePriceUSD: basePriceUSD,
      selectedAddons,
      totalPriceUSD,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      paymentMethod,
      notes: notes.trim() || undefined,
      status: 'pendiente',
      createdAt: new Date().toISOString()
    };

    // Save internally
    AppStore.addBooking(booking);
    setLastCreatedBooking(booking);

    // Launch confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsSuccess(true);

    // Generate WhatsApp link
    const waUrl = AppStore.generateWhatsAppBookingUrl({
      serviceName: booking.serviceName,
      totalPriceUSD: booking.totalPriceUSD,
      date: booking.date,
      timeSlot: booking.timeSlot,
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      clientInstagram: booking.clientInstagram,
      addons: booking.selectedAddons,
      paymentMethod: booking.paymentMethod,
      notes: booking.notes,
    });

    // Open WhatsApp directly
    setTimeout(() => {
      window.location.href = waUrl;
    }, 500);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-luxury border border-sage-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-warm-100 border-b border-sage-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage-700 block">
              Agenda tu Cita
            </span>
            <h3 className="font-serif text-2xl font-bold text-sage-900">
              {isSuccess ? '¡Cita Lista para Confirmar!' : 'Agendar Cita con Andrea'}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full text-warm-500 hover:text-warm-900 hover:bg-white/80 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isSuccess && lastCreatedBooking ? (
            /* Success Confirmation Screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-soft">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-2xl font-bold text-warm-900">
                  ¡Casi listo, {lastCreatedBooking.clientName}!
                </h4>
                <p className="text-sm text-warm-900 max-w-md mx-auto font-medium">
                  Tu cita está lista en el sistema. Toca el botón verde para enviar los datos a Andrea por WhatsApp (0424-1360937) para que te confirme en un momento.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-5 bg-sage-50 rounded-2xl border border-sage-200/80 text-left max-w-md mx-auto space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-sage-200/60 pb-2">
                  <span className="text-sage-800 font-bold">Servicio:</span>
                  <span className="font-bold text-warm-900">{lastCreatedBooking.serviceName}</span>
                </div>
                <div className="flex justify-between border-b border-sage-200/60 pb-2">
                  <span className="text-sage-800 font-bold">Fecha y Hora:</span>
                  <span className="font-bold text-warm-900">{lastCreatedBooking.date} a las {lastCreatedBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between border-b border-sage-200/60 pb-2">
                  <span className="text-sage-800 font-bold">Total a Pagar:</span>
                  <span className="font-bold text-sage-900 font-serif text-base">${lastCreatedBooking.totalPriceUSD.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-xs text-sage-700 font-semibold">
                  <span>En Bolívares:</span>
                  <span>≈ {(lastCreatedBooking.totalPriceUSD * exchangeRate).toFixed(0)} Bs</span>
                </div>
              </div>

              {/* Action button to re-trigger WhatsApp */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={AppStore.generateWhatsAppBookingUrl({
                    serviceName: lastCreatedBooking.serviceName,
                    totalPriceUSD: lastCreatedBooking.totalPriceUSD,
                    date: lastCreatedBooking.date,
                    timeSlot: lastCreatedBooking.timeSlot,
                    clientName: lastCreatedBooking.clientName,
                    clientPhone: lastCreatedBooking.clientPhone,
                    clientInstagram: lastCreatedBooking.clientInstagram,
                    addons: lastCreatedBooking.selectedAddons,
                    paymentMethod: lastCreatedBooking.paymentMethod,
                    notes: lastCreatedBooking.notes,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-soft transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar a WhatsApp (0424-1360937)</span>
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-3 border border-sage-300 text-sage-800 rounded-2xl text-xs sm:text-sm font-semibold hover:bg-sage-50 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            /* Wizard Steps */
            <div>
              {/* Step indicator breadcrumbs */}
              <div className="flex items-center justify-between pb-6 border-b border-sage-100 mb-6">
                <div 
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-2 cursor-pointer ${step === 1 ? 'text-sage-800 font-bold' : 'text-warm-400'}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-sage-800 text-white' : 'bg-warm-200'}`}>1</div>
                  <span className="text-xs sm:text-sm">Servicio</span>
                </div>
                <div className="w-8 h-px bg-sage-200"></div>
                <div 
                  onClick={() => setStep(2)}
                  className={`flex items-center gap-2 cursor-pointer ${step === 2 ? 'text-sage-800 font-bold' : 'text-warm-400'}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-sage-800 text-white' : 'bg-warm-200'}`}>2</div>
                  <span className="text-xs sm:text-sm">Fecha y Hora</span>
                </div>
                <div className="w-8 h-px bg-sage-200"></div>
                <div 
                  onClick={() => setStep(3)}
                  className={`flex items-center gap-2 cursor-pointer ${step === 3 ? 'text-sage-800 font-bold' : 'text-warm-400'}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-sage-800 text-white' : 'bg-warm-200'}`}>3</div>
                  <span className="text-xs sm:text-sm">Tus Datos</span>
                </div>
              </div>

              {/* STEP 1: SERVICE & ADDONS */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-sage-800">
                      Servicio Principal Seleccionado
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full p-3.5 bg-warm-50 border border-sage-200 rounded-2xl text-xs sm:text-sm font-semibold text-warm-900 focus:ring-2 focus:ring-sage-400/40 focus:outline-none"
                    >
                      {services.filter(s => s.isAvailable).map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {srv.name} — ${srv.priceUSD.toFixed(2)} ({srv.durationMinutes} min)
                        </option>
                      ))}
                    </select>
                  </div>

                  {currentService && (
                    <div className="p-4 bg-sage-50/60 rounded-2xl border border-sage-200/60 flex items-center gap-4">
                      <img 
                        src={currentService.imageUrl} 
                        alt={currentService.name} 
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-warm-900">{currentService.name}</p>
                        <p className="text-xs text-sage-700 italic">{currentService.shortDescription}</p>
                        <p className="text-xs font-bold text-sage-900 font-serif">
                          ${currentService.priceUSD.toFixed(2)} USD &bull; {currentService.durationMinutes} min
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Add-ons Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-sage-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                        <span>Adicionales & Personalización (Opcional)</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      {INITIAL_ADDONS.map((addon) => {
                        const isChecked = selectedAddonIds.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddon(addon.id)}
                            className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                              isChecked
                                ? 'bg-sage-100 border-sage-400 text-sage-900 font-semibold'
                                : 'bg-white border-sage-200/80 text-warm-800 hover:bg-warm-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                isChecked ? 'bg-sage-800 border-sage-800 text-white' : 'border-sage-300'
                              }`}>
                                {isChecked && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <span className="text-xs sm:text-sm">{addon.name}</span>
                            </div>
                            <span className="text-xs font-bold text-sage-800">
                              +${addon.priceUSD.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 1 Footer */}
                  <div className="pt-4 flex items-center justify-between border-t border-sage-100">
                    <div>
                      <span className="text-[10px] text-sage-600 block uppercase">Subtotal</span>
                      <span className="font-serif text-2xl font-bold text-warm-900">
                        ${totalPriceUSD.toFixed(2)} USD
                      </span>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-sage-800 hover:bg-sage-900 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-soft"
                    >
                      <span>Elegir Fecha & Hora</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DATE & TIME SELECTION */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Date Picker Carousel / Grid */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-sage-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sage-600" />
                      <span>1. Selecciona el Día de tu Cita</span>
                    </label>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {availableDates.map((item) => {
                        const isSelected = selectedDate === item.dateString;
                        return (
                          <button
                            key={item.dateString}
                            type="button"
                            onClick={() => {
                              setSelectedDate(item.dateString);
                              setSelectedTimeSlot(''); // reset slot when day changes
                            }}
                            className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                              isSelected
                                ? 'bg-sage-800 border-sage-800 text-white shadow-soft'
                                : 'bg-white border-sage-200 text-warm-800 hover:bg-sage-50'
                            }`}
                          >
                            <span className="text-[10px] font-semibold opacity-75">{item.dayName}</span>
                            <span className="text-base font-bold font-serif my-0.5">{item.dayNumber}</span>
                            <span className="text-[9px] uppercase tracking-wider opacity-60">{item.monthName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-sage-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sage-600" />
                      <span>2. Horarios Disponibles ({selectedDate || 'Elige fecha primero'})</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {AVAILABLE_TIME_SLOTS.map((slot) => {
                        const isOccupied = AppStore.isSlotOccupied(selectedDate, slot);
                        const isSelected = selectedTimeSlot === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isOccupied}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`p-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                              isOccupied
                                ? 'bg-warm-100 border-sage-100 text-warm-400 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-sage-800 border-sage-800 text-white shadow-soft'
                                : 'bg-white border-sage-200 text-sage-900 hover:border-sage-400 hover:bg-sage-50'
                            }`}
                          >
                            <span>{slot}</span>
                            {isOccupied ? (
                              <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                                Ocupado
                              </span>
                            ) : isSelected ? (
                              <Check className="w-4 h-4 text-gold-400" />
                            ) : (
                              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                Libre
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2 Footer */}
                  <div className="pt-4 flex items-center justify-between border-t border-sage-100">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 text-xs text-warm-600 hover:text-warm-900 font-semibold"
                    >
                      &larr; Volver
                    </button>
                    <button
                      disabled={!selectedDate || !selectedTimeSlot}
                      onClick={() => setStep(3)}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                        selectedDate && selectedTimeSlot
                          ? 'bg-sage-800 hover:bg-sage-900 text-white shadow-soft'
                          : 'bg-warm-200 text-warm-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Ingresar Datos</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CLIENT DETAILS & WHATSAPP CONFIRMATION */}
              {step === 3 && (
                <form onSubmit={handleConfirmReservation} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-sage-800 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-sage-600" />
                        <span>Nombre y Apellido *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Sofía Ramírez"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full p-3 bg-warm-50 border border-sage-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sage-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-sage-800 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-sage-600" />
                        <span>Número de WhatsApp *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej: 0414-1234567"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full p-3 bg-warm-50 border border-sage-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sage-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-sage-800 flex items-center gap-1">
                        <InstagramIcon className="w-3.5 h-3.5 text-sage-600" />
                        <span>Usuario de Instagram (Opcional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="@tu_usuario"
                        value={clientInstagram}
                        onChange={(e) => setClientInstagram(e.target.value)}
                        className="w-full p-3 bg-warm-50 border border-sage-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sage-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-sage-800 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-sage-600" />
                        <span>Método de Pago Preferido</span>
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                        className="w-full p-3 bg-warm-50 border border-sage-200 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-sage-400 focus:outline-none"
                      >
                        <option value="pago_movil">Pago Móvil (Bolívares)</option>
                        <option value="efectivo">Efectivo en Dólares ($)</option>
                        <option value="binance">Binance Pay (USDT)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-sage-800">
                      Notas especiales o diseño de referencia (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej: Deseo tono nude clásico o retirar sistema previo..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 bg-warm-50 border border-sage-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sage-400 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Resumen Final de Reserva */}
                  <div className="p-4 bg-sage-50/80 rounded-2xl border border-sage-200/80 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-sage-700 uppercase tracking-wider">
                        Resumen de Cita
                      </span>
                      <p className="text-xs font-bold text-warm-900">
                        {currentService.name} &bull; {selectedDate} ({selectedTimeSlot})
                      </p>
                      <p className="text-[11px] text-sage-600">
                        Tasa estimada: ≈ {totalPriceVES.toFixed(0)} Bs
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-sage-600 block uppercase">Total a Pagar</span>
                      <span className="font-serif text-2xl font-bold text-sage-900">
                        ${totalPriceUSD.toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-between border-t border-sage-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 text-xs text-warm-600 hover:text-warm-900 font-semibold"
                    >
                      &larr; Cambiar Fecha
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-soft hover:shadow-luxury transition-all transform active:scale-98"
                    >
                      <Send className="w-4 h-4" />
                      <span>Confirmar & Reservar vía WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
