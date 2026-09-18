import React, { useState } from 'react';
import { 
  ServiceItem, 
  PromoOffer, 
  AppointmentBooking, 
  BlockedTimeSlot 
} from '../types';
import { AVAILABLE_TIME_SLOTS } from '../data/initialData';
import { AppStore } from '../services/store';
import { 
  LayoutDashboard, 
  Calendar, 
  Sparkles, 
  DollarSign, 
  Download, 
  Upload, 
  Check, 
  AlertCircle, 
  Plus, 
  Trash2, 
  MessageCircle, 
  Clock, 
  Eye, 
  EyeOff, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  User,
  Phone,
  ShieldCheck,
  Edit2,
  Save,
  CheckCircle2,
  XCircle,
  Tag
} from 'lucide-react';
import { InstagramIcon } from './Icons';

interface AdminDashboardProps {
  services: ServiceItem[];
  promos: PromoOffer[];
  bookings: AppointmentBooking[];
  blockedSlots: BlockedTimeSlot[];
  exchangeRate: number;
  onRefreshData: () => void;
  onExitToCatalog: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  services,
  promos,
  bookings,
  blockedSlots,
  exchangeRate,
  onRefreshData,
  onExitToCatalog,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'calendar' | 'services' | 'promos' | 'settings'>('bookings');
  
  // Calendar management state
  const [calendarDate, setCalendarDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });

  // Service edition state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  
  // New promo state
  const [newPromoTitle, setNewPromoTitle] = useState('');
  const [newPromoSubtitle, setNewPromoSubtitle] = useState('');
  const [newPromoPrice, setNewPromoPrice] = useState('');
  const [newPromoRegularPrice, setNewPromoRegularPrice] = useState('');
  const [newPromoBadge, setNewPromoBadge] = useState('PROMO ESPECIAL');

  // Rate state
  const [currentRate, setCurrentRate] = useState(exchangeRate.toString());
  const [rateSavedMessage, setRateSavedMessage] = useState(false);

  // Search filter for bookings
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');

  // Stats calculation
  const totalBookingsCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pendiente').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmada' || b.status === 'completada').length;
  const totalRevenueUSD = bookings
    .filter(b => b.status === 'completada' || b.status === 'confirmada')
    .reduce((acc, curr) => acc + curr.totalPriceUSD, 0);

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = bookingFilterStatus === 'all' || b.status === bookingFilterStatus;
    const matchesSearch = 
      b.clientName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.clientPhone.includes(bookingSearch) ||
      b.serviceName.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle slot toggle
  const handleToggleSlot = (timeSlot: string) => {
    AppStore.toggleBlockSlot(calendarDate, timeSlot);
    onRefreshData();
  };

  // Handle service save
  const handleSaveEditingService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    AppStore.updateService(editingService);
    setEditingService(null);
    onRefreshData();
  };

  // Update booking status
  const handleUpdateStatus = (bookingId: string, status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada') => {
    AppStore.updateBookingStatus(bookingId, status);
    onRefreshData();
  };

  // Delete booking
  const handleDeleteBooking = (bookingId: string) => {
    if (window.confirm('¿Deseas eliminar este registro de cita?')) {
      AppStore.deleteBooking(bookingId);
      onRefreshData();
    }
  };

  // Handle exchange rate save
  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(currentRate);
    if (!isNaN(rate) && rate > 0) {
      AppStore.saveExchangeRate(rate);
      onRefreshData();
      setRateSavedMessage(true);
      setTimeout(() => setRateSavedMessage(false), 2500);
    }
  };

  // Create promo
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoTitle.trim() || !newPromoPrice) return;

    const promo: PromoOffer = {
      id: 'promo_' + Date.now(),
      title: newPromoTitle.trim(),
      subtitle: newPromoSubtitle.trim() || 'Edición especial por tiempo limitado.',
      servicesIncluded: ['Servicio Seleccionado'],
      regularPriceUSD: parseFloat(newPromoRegularPrice) || parseFloat(newPromoPrice) * 1.2,
      promoPriceUSD: parseFloat(newPromoPrice),
      badge: newPromoBadge,
      validUntil: 'Válido este mes',
      isActive: true,
      imageUrl: '/images/esmaltado-semipermanente.png'
    };

    AppStore.savePromos([...promos, promo]);
    setNewPromoTitle('');
    setNewPromoSubtitle('');
    setNewPromoPrice('');
    setNewPromoRegularPrice('');
    onRefreshData();
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = AppStore.exportDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `andrea-labrador-respaldo-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && AppStore.importDataJSON(content)) {
        alert('¡Datos restaurados con éxito!');
        onRefreshData();
      } else {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-warm-900 font-sans flex flex-col selection:bg-sage-200 selection:text-sage-900">
      
      {/* SaaS Top Navigation Bar — matches main site Navbar style */}
      <header className="sticky top-0 z-40 bg-[#FBF9F6] border-b border-sage-200/80 shadow-xs px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-800 text-amber-200 flex items-center justify-center font-bold font-serif text-sm">
            AL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sage-900 tracking-wide text-base sm:text-lg">
                ANDREA LABRADOR
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sage-100 border border-sage-300 text-[10px] font-bold text-sage-700 uppercase tracking-wider">
                Panel SaaS
              </span>
            </div>
            <p className="text-[11px] text-warm-600">
              Sistema de Gestión &bull; Catálogo &amp; Citas en Venezuela
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sage-50 border border-sage-200 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-warm-600">Tasa:</span>
            <span className="font-bold text-warm-900">${exchangeRate.toFixed(2)} Bs / USD</span>
          </div>

          <button
            onClick={onRefreshData}
            className="p-2 rounded-xl bg-sage-100 hover:bg-sage-200 text-sage-700 hover:text-sage-900 transition-colors border border-sage-200"
            title="Sincronizar Datos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onExitToCatalog}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sage-800 hover:bg-sage-900 text-white rounded-xl text-xs font-bold transition-all shadow-soft active:scale-95"
          >
            <span>Ver Catálogo Clientes</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-sage-200 shadow-soft">
              <span className="text-[10px] font-bold uppercase tracking-wider text-warm-600 block">
                Citas Totales
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif text-3xl font-black text-warm-900">{totalBookingsCount}</span>
                {pendingCount > 0 && (
                  <span className="text-xs text-amber-700 font-bold">({pendingCount} por confirmar)</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-sage-200 shadow-soft">
              <span className="text-[10px] font-bold uppercase tracking-wider text-warm-600 block">
                Ingresos Confirmados
              </span>
              <div className="mt-1">
                <span className="font-serif text-2xl font-black text-emerald-700">${totalRevenueUSD.toFixed(2)} USD</span>
                <span className="block text-[11px] text-warm-600">≈ {(totalRevenueUSD * exchangeRate).toFixed(0)} Bs</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 rounded-2xl bg-white border border-sage-200 shadow-soft space-y-1">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-sage-800 text-white shadow-md'
                  : 'text-warm-700 hover:bg-sage-50 hover:text-warm-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Citas &amp; Reservas</span>
              </div>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'calendar'
                  ? 'bg-sage-800 text-white shadow-md'
                  : 'text-warm-700 hover:bg-sage-50 hover:text-warm-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Bloqueo de Horarios</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'services'
                  ? 'bg-sage-800 text-white shadow-md'
                  : 'text-warm-700 hover:bg-sage-50 hover:text-warm-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Catálogo &amp; Precios</span>
            </button>

            <button
              onClick={() => setActiveTab('promos')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'promos'
                  ? 'bg-sage-800 text-white shadow-md'
                  : 'text-warm-700 hover:bg-sage-50 hover:text-warm-900'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Combos &amp; Promos</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-sage-800 text-white shadow-md'
                  : 'text-warm-700 hover:bg-sage-50 hover:text-warm-900'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Tasa &amp; Respaldos</span>
            </button>
          </nav>

        </aside>

        {/* Content Panel */}
        <main className="flex-1 bg-white rounded-3xl border border-sage-200 shadow-soft p-5 sm:p-7 overflow-y-auto">
          
          {/* TAB 1: BOOKINGS MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sage-200 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-serif text-warm-900">
                    Historial de Citas Solicitadas
                  </h3>
                  <p className="text-xs text-warm-600">
                    Las reservas enviadas por las clientas se almacenan aquí y se conectan directo a tu WhatsApp.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-warm-50 border border-sage-200 text-xs text-warm-900 focus:outline-none focus:ring-2 focus:ring-sage-400"
                  >
                    <option value="all">Todas ({bookings.length})</option>
                    <option value="pendiente">Pendientes ({pendingCount})</option>
                    <option value="confirmada">Confirmadas ({confirmedCount})</option>
                    <option value="completada">Completadas</option>
                    <option value="cancelada">Canceladas</option>
                  </select>
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-sage-100 text-sage-500 flex items-center justify-center mx-auto">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-warm-700">No hay citas registradas en este estado.</p>
                  <p className="text-xs text-warm-500">Cuando una clienta agende desde el catálogo, aparecerá listada de inmediato.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 sm:p-5 rounded-2xl bg-warm-50 border border-sage-200 space-y-4 hover:border-sage-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sage-200 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-warm-900 text-base">{b.clientName}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.status === 'pendiente' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                              b.status === 'confirmada' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              b.status === 'completada' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              {b.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-500" />
                              {b.clientPhone}
                            </span>
                            {b.clientInstagram && (
                              <span className="flex items-center gap-1 text-pink-400">
                                <InstagramIcon className="w-3 h-3" />
                                @{b.clientInstagram.replace('@', '')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-serif text-xl font-bold text-emerald-400">${b.totalPriceUSD.toFixed(2)} USD</span>
                          <span className="block text-[11px] text-slate-400">≈ {(b.totalPriceUSD * exchangeRate).toFixed(0)} Bs ({b.paymentMethod})</span>
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Servicio Elegido</span>
                          <span className="font-bold text-slate-200">{b.serviceName}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Fecha & Hora</span>
                          <span className="font-bold text-slate-200">{b.date} &bull; {b.timeSlot}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Forma de Pago</span>
                          <span className="font-bold text-slate-200 capitalize">{b.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </div>

                      {b.notes && (
                        <p className="text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                          &ldquo;{b.notes}&rdquo;
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        {/* Direct WhatsApp Response Button */}
                        <a
                          href={`https://wa.me/${b.clientPhone.replace(/\D/g, '')}?text=¡Hola%20${encodeURIComponent(b.clientName)}%20bella!%20💕%20Te%20escribo%20para%20confirmar%20tu%20cita%20de%20${encodeURIComponent(b.serviceName)}%20para%20el%20día%20${b.date}%20a%20las%20${b.timeSlot}.%20¡Te%20espero!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Abrir WhatsApp con Clienta</span>
                        </a>

                        {/* Status Switcher & Delete */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'confirmada')}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'completada')}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold"
                          >
                            Completada
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CALENDAR & BLOCKING */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold font-serif text-white">
                  Bloqueo de Horarios & Días Libres
                </h3>
                <p className="text-xs text-slate-400">
                  Selecciona una fecha y haz clic en los turnos para bloquearlos. Los turnos bloqueados no podrán ser seleccionados por las clientas en la web.
                </p>
              </div>

              {/* Date selector */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-300">Fecha a gestionar:</label>
                <input
                  type="date"
                  value={calendarDate}
                  onChange={(e) => setCalendarDate(e.target.value)}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {AVAILABLE_TIME_SLOTS.map((slot) => {
                  const isBlocked = AppStore.isSlotOccupied(calendarDate, slot);

                  return (
                    <button
                      key={slot}
                      onClick={() => handleToggleSlot(slot)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isBlocked
                          ? 'bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-950/60'
                          : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-emerald-500/60'
                      }`}
                    >
                      <div>
                        <span className="font-serif font-bold text-base block">{slot}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                          {isBlocked ? 'Bloqueado / No disponible' : 'Disponible para citas'}
                        </span>
                      </div>
                      <div className={`p-2 rounded-xl ${isBlocked ? 'bg-rose-900/50 text-rose-300' : 'bg-emerald-950 text-emerald-400'}`}>
                        {isBlocked ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES & PRICING */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold font-serif text-white">
                  Catálogo Oficial & Precios
                </h3>
                <p className="text-xs text-slate-400">
                  Ajusta precios en USD, duración y distintivos de cada técnica. Los cambios se reflejan al instante en la web.
                </p>
              </div>

              {/* Service editor modal/box if editing */}
              {editingService && (
                <form onSubmit={handleSaveEditingService} className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-sm font-bold text-white">Editar: {editingService.name}</span>
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Precio en USD ($)</label>
                      <input
                        type="number"
                        step="0.50"
                        value={editingService.priceUSD}
                        onChange={(e) => setEditingService({ ...editingService, priceUSD: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Duración (minutos)</label>
                      <input
                        type="number"
                        step="5"
                        value={editingService.durationMinutes}
                        onChange={(e) => setEditingService({ ...editingService, durationMinutes: parseInt(e.target.value) || 60 })}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Etiqueta Psicológica (Badge)</label>
                    <input
                      type="text"
                      value={editingService.badgeText || ''}
                      placeholder="Ej: Más Solicitado, Clásico Infalible, etc."
                      onChange={(e) => setEditingService({ ...editingService, badgeText: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Descripción Breve</label>
                    <input
                      type="text"
                      value={editingService.shortDescription}
                      onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Guardar Cambios
                  </button>
                </form>
              )}

              {/* Services List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div key={s.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-serif font-bold text-base text-white">{s.name}</span>
                          <span className="block text-xs text-slate-400 mt-0.5">{s.shortDescription}</span>
                        </div>
                        <span className="font-serif text-lg font-bold text-emerald-400 whitespace-nowrap">
                          ${s.priceUSD.toFixed(2)}
                        </span>
                      </div>

                      {s.badgeText && (
                        <div className="pt-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase text-white ${s.badgeColor || 'bg-slate-800'}`}>
                            {s.badgeText}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{s.durationMinutes} minutos</span>
                      <button
                        onClick={() => setEditingService(s)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROMOTIONS */}
          {activeTab === 'promos' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold font-serif text-white">
                  Combos & Promociones Especiales
                </h3>
                <p className="text-xs text-slate-400">
                  Crea paquetes para incentivar servicios dobles (Manos + Pies).
                </p>
              </div>

              {/* Add promo form */}
              <form onSubmit={handleCreatePromo} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 block uppercase">Crear Nuevo Combo</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Título (Ej: Dúo Relajación)"
                    value={newPromoTitle}
                    onChange={(e) => setNewPromoTitle(e.target.value)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Subtítulo"
                    value={newPromoSubtitle}
                    onChange={(e) => setNewPromoSubtitle(e.target.value)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Precio Promocional ($ USD)"
                    value={newPromoPrice}
                    onChange={(e) => setNewPromoPrice(e.target.value)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Etiqueta (Ej: MÁS PEDIDO)"
                    value={newPromoBadge}
                    onChange={(e) => setNewPromoBadge(e.target.value)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Agregar Combo
                </button>
              </form>

              {/* Promos List */}
              <div className="space-y-3">
                {promos.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{p.title}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold">
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{p.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-lg font-bold text-emerald-400">${p.promoPriceUSD.toFixed(2)} USD</span>
                      <span className="block text-[11px] line-through text-slate-500">${p.regularPriceUSD.toFixed(2)} USD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS & BACKUP */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold font-serif text-white">
                  Tasa de Cambio & Respaldos
                </h3>
                <p className="text-xs text-slate-400">
                  Actualiza la tasa del dólar oficial y exporta tus datos completos.
                </p>
              </div>

              {/* Exchange rate form */}
              <form onSubmit={handleSaveRate} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 block uppercase">Tasa del Dólar en Bolívares (VES)</span>
                <p className="text-xs text-slate-400">
                  Esta tasa se usa automáticamente para calcular el equivalente en Bs de cada servicio y en el mensaje de WhatsApp.
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative w-48">
                    <input
                      type="number"
                      step="0.01"
                      value={currentRate}
                      onChange={(e) => setCurrentRate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-sm"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">Bs</span>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Actualizar Tasa
                  </button>
                  {rateSavedMessage && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> ¡Tasa guardada!
                    </span>
                  )}
                </div>
              </form>

              {/* Backup & Export */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-slate-200 block uppercase">Copia de Seguridad de Datos</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Descarga una copia completa de tus citas, servicios y configuraciones en formato JSON. Puedes guardarlo en tu computadora o enviarlo para conectar bases de datos externas.
                </p>

                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    onClick={handleExportJSON}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Respaldo JSON</span>
                  </button>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Restaurar desde JSON</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>
              </div>

            </div>
          )}

        </main>

      </div>

    </div>
  );
};
