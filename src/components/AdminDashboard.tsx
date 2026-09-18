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
  
  const [calendarDate, setCalendarDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });

  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [newPromoTitle, setNewPromoTitle] = useState('');
  const [newPromoSubtitle, setNewPromoSubtitle] = useState('');
  const [newPromoPrice, setNewPromoPrice] = useState('');
  const [newPromoRegularPrice, setNewPromoRegularPrice] = useState('');
  const [newPromoBadge, setNewPromoBadge] = useState('PROMO ESPECIAL');
  const [currentRate, setCurrentRate] = useState(exchangeRate.toString());
  const [rateSavedMessage, setRateSavedMessage] = useState(false);
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');

  const totalBookingsCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pendiente').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmada' || b.status === 'completada').length;
  const totalRevenueUSD = bookings
    .filter(b => b.status === 'completada' || b.status === 'confirmada')
    .reduce((acc, curr) => acc + curr.totalPriceUSD, 0);

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = bookingFilterStatus === 'all' || b.status === bookingFilterStatus;
    const matchesSearch =
      b.clientName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.clientPhone.includes(bookingSearch) ||
      b.serviceName.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleToggleSlot = (timeSlot: string) => {
    AppStore.toggleBlockSlot(calendarDate, timeSlot);
    onRefreshData();
  };

  const handleSaveEditingService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    AppStore.updateService(editingService);
    setEditingService(null);
    onRefreshData();
  };

  const handleUpdateStatus = (bookingId: string, status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada') => {
    AppStore.updateBookingStatus(bookingId, status);
    onRefreshData();
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (window.confirm('¿Deseas eliminar este registro de cita?')) {
      AppStore.deleteBooking(bookingId);
      onRefreshData();
    }
  };

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

  // ─── Shared input class ───────────────────────────────────────────────────
  const inputCls = 'w-full p-2.5 rounded-xl bg-warm-50 border border-sage-200 text-warm-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-400 placeholder:text-warm-400';
  const sectionHeadCls = 'border-b border-sage-200 pb-4 mb-2';

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-warm-900 font-sans flex flex-col">

      {/* ── Top Navigation ── matches main site Navbar */}
      <header className="sticky top-0 z-40 bg-[#FBF9F6] border-b border-sage-200 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#16291F] text-amber-200 flex items-center justify-center font-bold font-serif text-sm shrink-0">
            AL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-warm-900 tracking-wide text-base sm:text-lg leading-tight">
                ANDREA LABRADOR
              </span>
              <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-sage-100 border border-sage-300 text-[10px] font-bold text-sage-800 uppercase tracking-wider">
                Panel de Gestión
              </span>
            </div>
            <p className="text-[11px] text-warm-500 leading-tight">
              Catálogo &amp; Citas · Venezuela
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sage-50 border border-sage-200 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-warm-600">Tasa:</span>
            <span className="font-bold text-warm-900">${exchangeRate.toFixed(2)} Bs/USD</span>
          </div>

          <button
            onClick={onRefreshData}
            className="p-2 rounded-xl bg-sage-100 hover:bg-sage-200 text-sage-700 hover:text-sage-900 transition-colors border border-sage-200"
            title="Sincronizar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onExitToCatalog}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#16291F] hover:bg-sage-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <span>Ver Catálogo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-5">

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-60 flex-shrink-0 space-y-4">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-sage-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-warm-500 block">
                Citas Totales
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif text-3xl font-black text-warm-900">{totalBookingsCount}</span>
                {pendingCount > 0 && (
                  <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-1.5 rounded-full border border-amber-200">
                    {pendingCount} pendientes
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-sage-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-warm-500 block">
                Ingresos Confirmados
              </span>
              <div className="mt-1">
                <span className="font-serif text-xl font-black text-emerald-700">${totalRevenueUSD.toFixed(2)} USD</span>
                <span className="block text-[11px] text-warm-500">≈ {(totalRevenueUSD * exchangeRate).toFixed(0)} Bs</span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="p-2 rounded-2xl bg-white border border-sage-200 shadow-sm space-y-0.5">
            {([
              { key: 'bookings', label: 'Citas & Reservas', icon: LayoutDashboard, badge: pendingCount },
              { key: 'calendar', label: 'Bloqueo de Horarios', icon: Calendar },
              { key: 'services', label: 'Catálogo & Precios', icon: Sparkles },
              { key: 'promos',   label: 'Combos & Promos',   icon: Tag },
              { key: 'settings', label: 'Tasa & Respaldos',  icon: DollarSign },
            ] as const).map(({ key, label, icon: Icon, badge }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === key
                    ? 'bg-[#16291F] text-white shadow-sm'
                    : 'text-warm-700 hover:bg-sage-50 hover:text-warm-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{label}</span>
                </div>
                {badge != null && badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Content Panel ── */}
        <main className="flex-1 bg-white rounded-3xl border border-sage-200 shadow-sm p-5 sm:p-7 overflow-y-auto min-h-[500px]">

          {/* TAB 1 — CITAS */}
          {activeTab === 'bookings' && (
            <div className="space-y-5">
              <div className={sectionHeadCls}>
                <h3 className="text-xl font-bold font-serif text-warm-900">Historial de Citas</h3>
                <p className="text-xs text-warm-500 mt-0.5">Las reservas de tus clientas aparecen aquí conectadas directo a WhatsApp.</p>
              </div>

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

              {filteredBookings.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-sage-100 text-sage-500 flex items-center justify-center mx-auto">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-warm-700">No hay citas en este estado.</p>
                  <p className="text-xs text-warm-400">Cuando una clienta agende desde el catálogo, aparecerá aquí.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((b) => (
                    <div key={b.id} className="p-4 sm:p-5 rounded-2xl bg-warm-50 border border-sage-200 space-y-3 hover:border-sage-300 transition-colors">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sage-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-warm-900 text-sm">{b.clientName}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.status === 'pendiente'  ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                              b.status === 'confirmada' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              b.status === 'completada' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              {b.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-warm-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {b.clientPhone}
                            </span>
                            {b.clientInstagram && (
                              <span className="flex items-center gap-1 text-pink-600">
                                <InstagramIcon className="w-3 h-3" />
                                @{b.clientInstagram.replace('@', '')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-serif text-lg font-bold text-emerald-700">${b.totalPriceUSD.toFixed(2)} USD</span>
                          <span className="block text-[11px] text-warm-500">≈ {(b.totalPriceUSD * exchangeRate).toFixed(0)} Bs · {b.paymentMethod}</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-sage-100">
                          <span className="text-warm-400 block text-[10px] uppercase font-bold mb-0.5">Servicio</span>
                          <span className="font-bold text-warm-900">{b.serviceName}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-sage-100">
                          <span className="text-warm-400 block text-[10px] uppercase font-bold mb-0.5">Fecha &amp; Hora</span>
                          <span className="font-bold text-warm-900">{b.date} · {b.timeSlot}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-sage-100">
                          <span className="text-warm-400 block text-[10px] uppercase font-bold mb-0.5">Forma de Pago</span>
                          <span className="font-bold text-warm-900 capitalize">{b.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </div>

                      {b.notes && (
                        <p className="text-xs text-warm-600 italic bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                          &ldquo;{b.notes}&rdquo;
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <a
                          href={`https://wa.me/${b.clientPhone.replace(/\D/g, '')}?text=¡Hola%20${encodeURIComponent(b.clientName)}%20bella!%20💕%20Te%20escribo%20para%20confirmar%20tu%20cita%20de%20${encodeURIComponent(b.serviceName)}%20para%20el%20día%20${b.date}%20a%20las%20${b.timeSlot}.%20¡Te%20espero!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-sm transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Responder por WhatsApp</span>
                        </a>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'confirmada')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'completada')}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold"
                          >
                            Completada
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
                            title="Eliminar"
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

          {/* TAB 2 — HORARIOS */}
          {activeTab === 'calendar' && (
            <div className="space-y-5">
              <div className={sectionHeadCls}>
                <h3 className="text-xl font-bold font-serif text-warm-900">Bloqueo de Horarios</h3>
                <p className="text-xs text-warm-500 mt-0.5">Selecciona una fecha y toca los turnos para bloquearlos. No estarán disponibles para reservas.</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-warm-700">Fecha a gestionar:</label>
                <input
                  type="date"
                  value={calendarDate}
                  onChange={(e) => setCalendarDate(e.target.value)}
                  className="px-4 py-2 bg-warm-50 border border-sage-200 rounded-xl text-xs font-bold text-warm-900 focus:outline-none focus:ring-2 focus:ring-sage-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {AVAILABLE_TIME_SLOTS.map((slot) => {
                  const isBlocked = AppStore.isSlotOccupied(calendarDate, slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => handleToggleSlot(slot)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isBlocked
                          ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
                          : 'bg-white border-sage-200 text-warm-900 hover:border-sage-400'
                      }`}
                    >
                      <div>
                        <span className="font-serif font-bold text-base block">{slot}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                          {isBlocked ? 'Bloqueado' : 'Disponible'}
                        </span>
                      </div>
                      <div className={`p-2 rounded-xl ${isBlocked ? 'bg-rose-100 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                        {isBlocked ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3 — SERVICIOS */}
          {activeTab === 'services' && (
            <div className="space-y-5">
              <div className={sectionHeadCls}>
                <h3 className="text-xl font-bold font-serif text-warm-900">Catálogo Oficial &amp; Precios</h3>
                <p className="text-xs text-warm-500 mt-0.5">Ajusta precios, duración y etiquetas. Los cambios se reflejan al instante en el catálogo.</p>
              </div>

              {editingService && (
                <form onSubmit={handleSaveEditingService} className="p-5 rounded-2xl bg-sage-50 border border-sage-300 space-y-4">
                  <div className="flex items-center justify-between border-b border-sage-200 pb-2">
                    <span className="text-sm font-bold text-warm-900">Editando: {editingService.name}</span>
                    <button type="button" onClick={() => setEditingService(null)} className="text-xs text-warm-500 hover:text-warm-900 font-semibold">
                      Cancelar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-warm-700 block mb-1">Precio en USD ($)</label>
                      <input
                        type="number" step="0.50"
                        value={editingService.priceUSD}
                        onChange={(e) => setEditingService({ ...editingService, priceUSD: parseFloat(e.target.value) || 0 })}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-warm-700 block mb-1">Duración (minutos)</label>
                      <input
                        type="number" step="5"
                        value={editingService.durationMinutes}
                        onChange={(e) => setEditingService({ ...editingService, durationMinutes: parseInt(e.target.value) || 60 })}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-warm-700 block mb-1">Etiqueta Psicológica (Badge)</label>
                    <input
                      type="text"
                      value={editingService.badgeText || ''}
                      placeholder="Ej: Más Solicitado, Clásico Infalible…"
                      onChange={(e) => setEditingService({ ...editingService, badgeText: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-warm-700 block mb-1">Descripción Breve</label>
                    <input
                      type="text"
                      value={editingService.shortDescription}
                      onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-[#16291F] hover:bg-sage-900 text-white text-xs font-bold transition-all">
                    Guardar Cambios
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div key={s.id} className="p-4 rounded-2xl bg-warm-50 border border-sage-200 space-y-3 flex flex-col justify-between hover:border-sage-300 transition-colors">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-serif font-bold text-base text-warm-900">{s.name}</span>
                          <span className="block text-xs text-warm-500 mt-0.5">{s.shortDescription}</span>
                        </div>
                        <span className="font-serif text-lg font-bold text-emerald-700 whitespace-nowrap">
                          ${s.priceUSD.toFixed(2)}
                        </span>
                      </div>
                      {s.badgeText && (
                        <div className="pt-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase text-white ${s.badgeColor || 'bg-sage-700'}`}>
                            {s.badgeText}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t border-sage-100 flex items-center justify-between">
                      <span className="text-[11px] text-warm-400">{s.durationMinutes} min</span>
                      <button
                        onClick={() => setEditingService(s)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-sage-50 border border-sage-200 text-warm-800 text-xs font-bold transition-colors"
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

          {/* TAB 4 — PROMOS */}
          {activeTab === 'promos' && (
            <div className="space-y-5">
              <div className={sectionHeadCls}>
                <h3 className="text-xl font-bold font-serif text-warm-900">Combos &amp; Promociones</h3>
                <p className="text-xs text-warm-500 mt-0.5">Crea paquetes para incentivar servicios dobles (Manos + Pies).</p>
              </div>

              <form onSubmit={handleCreatePromo} className="p-4 sm:p-5 rounded-2xl bg-sage-50 border border-sage-200 space-y-3">
                <span className="text-xs font-bold text-warm-900 block uppercase tracking-wider">Crear Nuevo Combo</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Título (Ej: Dúo Relajación)" value={newPromoTitle} onChange={(e) => setNewPromoTitle(e.target.value)} className={inputCls} />
                  <input type="text" placeholder="Subtítulo" value={newPromoSubtitle} onChange={(e) => setNewPromoSubtitle(e.target.value)} className={inputCls} />
                  <input type="number" step="0.5" placeholder="Precio Promocional ($ USD)" value={newPromoPrice} onChange={(e) => setNewPromoPrice(e.target.value)} className={inputCls} />
                  <input type="text" placeholder="Etiqueta (Ej: MÁS PEDIDO)" value={newPromoBadge} onChange={(e) => setNewPromoBadge(e.target.value)} className={inputCls} />
                </div>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#16291F] hover:bg-sage-900 text-white text-xs font-bold transition-all">
                  Agregar Combo
                </button>
              </form>

              <div className="space-y-3">
                {promos.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-white border border-sage-200 flex items-center justify-between hover:border-sage-300 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-warm-900 text-sm">{p.title}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-xs text-warm-500 mt-0.5">{p.subtitle}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="font-serif text-base font-bold text-emerald-700">${p.promoPriceUSD.toFixed(2)} USD</span>
                      <span className="block text-[11px] line-through text-warm-400">${p.regularPriceUSD.toFixed(2)} USD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5 — CONFIGURACIÓN */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div className={sectionHeadCls}>
                <h3 className="text-xl font-bold font-serif text-warm-900">Tasa de Cambio &amp; Respaldos</h3>
                <p className="text-xs text-warm-500 mt-0.5">Actualiza la tasa del dólar y gestiona tus copias de seguridad.</p>
              </div>

              <form onSubmit={handleSaveRate} className="p-5 rounded-2xl bg-sage-50 border border-sage-200 space-y-3">
                <span className="text-xs font-bold text-warm-900 block uppercase tracking-wider">Tasa del Dólar en Bolívares (VES)</span>
                <p className="text-xs text-warm-500 leading-relaxed">
                  Esta tasa se usa automáticamente para calcular el equivalente en Bs de cada servicio y en el mensaje de WhatsApp.
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative w-48">
                    <input
                      type="number" step="0.01"
                      value={currentRate}
                      onChange={(e) => setCurrentRate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-sage-200 text-warm-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
                    />
                    <span className="absolute right-3 top-2 text-xs text-warm-400">Bs</span>
                  </div>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#16291F] hover:bg-sage-900 text-white font-bold text-xs transition-all">
                    Actualizar Tasa
                  </button>
                  {rateSavedMessage && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> ¡Guardado!
                    </span>
                  )}
                </div>
              </form>

              <div className="p-5 rounded-2xl bg-white border border-sage-200 space-y-4">
                <span className="text-xs font-bold text-warm-900 block uppercase tracking-wider">Copia de Seguridad</span>
                <p className="text-xs text-warm-500 leading-relaxed">
                  Descarga una copia completa de tus citas, servicios y configuraciones en formato JSON para guardar en tu teléfono o computadora.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    onClick={handleExportJSON}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-warm-900 text-xs font-bold border border-sage-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Respaldo JSON</span>
                  </button>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-warm-900 text-xs font-bold border border-sage-200 transition-colors cursor-pointer">
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
