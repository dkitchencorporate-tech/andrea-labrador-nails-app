import React, { useState, useEffect } from 'react';
import { AppStore } from '../services/store';
import { ClientAccount, AppointmentBooking } from '../types';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Gift, 
  LogOut, 
  Search, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ClientAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNewAppointment: () => void;
}

export const ClientAccountModal: React.FC<ClientAccountModalProps> = ({
  isOpen,
  onClose,
  onBookNewAppointment,
}) => {
  const [activeAccount, setActiveAccount] = useState<ClientAccount | null>(null);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [clientBookings, setClientBookings] = useState<AppointmentBooking[]>([]);

  useEffect(() => {
    if (isOpen) {
      const current = AppStore.getActiveClient();
      setActiveAccount(current);
      if (current) {
        loadClientBookings(current.phone);
      }
    }
  }, [isOpen]);

  const loadClientBookings = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const all = AppStore.getBookings();
    const mine = all.filter(b => (b.clientPhone || '').replace(/\D/g, '') === cleanPhone);
    setClientBookings(mine);
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginIdentifier.trim()) {
      setLoginError('Por favor ingresa tu número de teléfono o correo.');
      return;
    }

    const cleanInput = loginIdentifier.trim();
    const account = AppStore.findClientAccount(cleanInput);

    if (account) {
      // Si la cuenta tiene PIN configurado y el usuario ingresó algo
      if (account.pin && loginPin && account.pin !== loginPin) {
        setLoginError('El PIN o contraseña ingresada no coincide.');
        return;
      }

      AppStore.setActiveClient(account);
      setActiveAccount(account);
      loadClientBookings(account.phone);
    } else {
      // Intentar buscar remotamente en Neon
      const cleanPhone = cleanInput.replace(/\D/g, '');
      if (cleanPhone.length >= 7) {
        AppStore.checkClientProfileRemote(cleanPhone).then(remote => {
          if (remote.found) {
            const newAcc = AppStore.registerOrUpdateClientAccount({
              name: remote.clientName || 'Clienta',
              phone: cleanPhone,
              pin: loginPin || undefined,
            });
            setActiveAccount(newAcc);
            loadClientBookings(newAcc.phone);
          } else {
            setLoginError('No encontramos una ficha registrada con este teléfono. ¡Al agendar tu primera cita se creará automáticamente!');
          }
        });
      } else {
        setLoginError('No encontramos una ficha con estos datos.');
      }
    }
  };

  const handleLogout = () => {
    AppStore.logoutClient();
    setActiveAccount(null);
    setClientBookings([]);
  };

  const stampsTotal = 6;
  const currentStamps = activeAccount ? activeAccount.stampsCount : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-luxury border border-sage-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-warm-100 border-b border-sage-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sage-800 text-white flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage-700 block">
                Área de Clientas
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-sage-900">
                {activeAccount ? `Ficha VIP: ${activeAccount.name}` : 'Mi Ficha & Fidelización'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-warm-200/60 text-warm-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeAccount ? (
            /* ══════ VISTA DE CLIENTA LOGUEADA ══════ */
            <div className="space-y-6">
              {/* Profile Card Header */}
              <div className="p-4 bg-sage-50/80 rounded-2xl border border-sage-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-xl font-bold text-warm-900">{activeAccount.name}</span>
                    <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                      Clienta Activa
                    </span>
                  </div>
                  <div className="text-xs text-warm-600 space-y-0.5">
                    <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-sage-600" />{activeAccount.phone}</p>
                    {activeAccount.email && <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-sage-600" />{activeAccount.email}</p>}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 self-start sm:self-center font-semibold px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir de mi Ficha</span>
                </button>
              </div>

              {/* Digital Loyalty Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-sage-900 to-warm-900 text-white shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold block">Tarjeta Digital VIP</span>
                    <h4 className="font-serif text-lg font-bold">Programa 6+1 de Fidelización</h4>
                  </div>
                  <span className="text-xs font-bold text-gold-300 bg-white/10 px-3 py-1 rounded-full border border-gold-400/30">
                    {currentStamps} de {stampsTotal} Sellos
                  </span>
                </div>

                {/* 6 Stamps Grid */}
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: stampsTotal }).map((_, i) => {
                    const isStamped = i < currentStamps;
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-1 transition-all ${
                          isStamped
                            ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-sm'
                            : 'bg-white/5 border-white/20 text-white/40 border-dashed'
                        }`}
                      >
                        {isStamped ? (
                          <CheckCircle2 className="w-5 h-5 text-gold-400" />
                        ) : i === 5 ? (
                          <Gift className="w-5 h-5 text-gold-400/80 animate-pulse" />
                        ) : (
                          <span className="text-xs font-bold">#{i + 1}</span>
                        )}
                        <span className="text-[8px] font-bold mt-0.5">
                          {i === 5 ? '¡GRATIS!' : `Sello ${i + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-white/10 text-xs text-white/80 flex items-center justify-between">
                  <span>{currentStamps >= 6 ? '🎉 ¡Felicidades! Tienes tu 7º servicio 100% GRATIS.' : `Te faltan ${stampsTotal - currentStamps} visitas para tu servicio gratis.`}</span>
                </div>
              </div>

              {/* Action Button: Book next appointment */}
              <button
                onClick={() => {
                  onClose();
                  onBookNewAppointment();
                }}
                className="w-full py-3.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-soft hover:shadow-luxury transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Nueva Cita con mis Datos Guardados</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* History of Bookings */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sage-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sage-600" />
                  <span>Tus Citas Registradas ({clientBookings.length})</span>
                </h4>

                {clientBookings.length === 0 ? (
                  <p className="text-xs text-warm-500 p-4 bg-warm-50 rounded-2xl border border-sage-200 text-center">
                    No tienes citas registradas aún. ¡Agenda tu cita para comenzar a sumar sellos!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {clientBookings.map((b) => (
                      <div key={b.id} className="p-3 bg-white border border-sage-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-warm-900">{b.serviceName}</p>
                          <p className="text-warm-500 text-[11px]">{b.date} &bull; {b.timeSlot}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.status === 'completada' ? 'bg-blue-100 text-blue-800' :
                            b.status === 'confirmada' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {b.status}
                          </span>
                          <span className="block font-bold text-warm-800 mt-0.5">${b.totalPriceUSD.toFixed(2)} USD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ══════ VISTA DE LOGIN / ACCESO A FICHA ══════ */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-center space-y-1 pb-2">
                <span className="text-xs font-bold text-sage-700 uppercase tracking-wider">Acceso a tu Perfil</span>
                <p className="text-xs text-warm-600">
                  Ingresa tu teléfono o correo para consultar tus sellos acumulados y tu historial de citas.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
                  {loginError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-sage-800 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-sage-600" />
                  <span>Número de Teléfono o Correo *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 0414-1234567 o micorreo@gmail.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full p-3 bg-warm-50 border border-sage-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sage-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-sage-800 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-sage-600" />
                  <span>PIN o Contraseña (Si la configuraste en tu primera cita)</span>
                </label>
                <input
                  type="password"
                  placeholder="PIN de 4 dígitos (Opcional)"
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  className="w-full p-3 bg-warm-50 border border-sage-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sage-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 bg-sage-800 hover:bg-sage-900 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-soft hover:shadow-luxury transition-all"
              >
                <span>Acceder a Mi Ficha & Sellos</span>
              </button>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <b>¿Primera vez en el estudio?</b> Tu ficha se creará automáticamente cuando hagas tu primera reserva en el catálogo.
                </span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
