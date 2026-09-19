import React, { useState, useRef } from 'react';
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
  Trash2, 
  MessageCircle, 
  RefreshCw,
  ExternalLink,
  Phone,
  Edit2,
  CheckCircle2,
  XCircle,
  Tag,
  Menu,
  X,
  ImagePlus,
  Image as ImageIcon,
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

type TabKey = 'bookings' | 'calendar' | 'services' | 'promos' | 'settings';

const NAV_ITEMS: { key: TabKey; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { key: 'bookings', label: 'Citas & Reservas',    Icon: LayoutDashboard },
  { key: 'calendar', label: 'Bloqueo de Horarios', Icon: Calendar },
  { key: 'services', label: 'Catálogo & Precios',  Icon: Sparkles },
  { key: 'promos',   label: 'Combos & Promos',     Icon: Tag },
  { key: 'settings', label: 'Tasa & Respaldos',    Icon: DollarSign },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  services,
  promos,
  bookings,
  blockedSlots,
  exchangeRate,
  onRefreshData,
  onExitToCatalog,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('bookings');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [calendarDate, setCalendarDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });

  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceImagePreview, setServiceImagePreview] = useState<string | null>(null);
  const serviceImageRef = useRef<HTMLInputElement>(null);

  const [newPromoTitle, setNewPromoTitle]         = useState('');
  const [newPromoSubtitle, setNewPromoSubtitle]   = useState('');
  const [newPromoPrice, setNewPromoPrice]         = useState('');
  const [newPromoRegularPrice, setNewPromoRegularPrice] = useState('');
  const [newPromoBadge, setNewPromoBadge]         = useState('PROMO ESPECIAL');

  const [currentRate, setCurrentRate]           = useState(exchangeRate.toString());
  const [rateSavedMessage, setRateSavedMessage] = useState(false);

  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');

  // ─── Derived stats ────────────────────────────────────────────────────────
  const totalBookingsCount = bookings.length;
  const pendingCount   = bookings.filter(b => b.status === 'pendiente').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmada' || b.status === 'completada').length;
  const totalRevenueUSD = bookings
    .filter(b => b.status === 'completada' || b.status === 'confirmada')
    .reduce((acc, b) => acc + b.totalPriceUSD, 0);

  const filteredBookings = bookings.filter(b =>
    bookingFilterStatus === 'all' || b.status === bookingFilterStatus
  );

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const navigate = (tab: TabKey) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleToggleSlot = (slot: string) => { AppStore.toggleBlockSlot(calendarDate, slot); onRefreshData(); };
  const handleUpdateStatus = (id: string, status: AppointmentBooking['status']) => { AppStore.updateBookingStatus(id, status); onRefreshData(); };
  const handleDeleteBooking = (id: string) => { if (window.confirm('¿Eliminar este registro?')) { AppStore.deleteBooking(id); onRefreshData(); } };

  const handleSaveEditingService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const updated = serviceImagePreview ? { ...editingService, imageUrl: serviceImagePreview } : editingService;
    AppStore.updateService(updated);
    setEditingService(null);
    setServiceImagePreview(null);
    onRefreshData();
  };

  const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setServiceImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
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
      imageUrl: '/images/esmaltado-semipermanente.png',
    };
    AppStore.savePromos([...promos, promo]);
    setNewPromoTitle(''); setNewPromoSubtitle(''); setNewPromoPrice(''); setNewPromoRegularPrice('');
    onRefreshData();
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(currentRate);
    if (!isNaN(rate) && rate > 0) { AppStore.saveExchangeRate(rate); onRefreshData(); setRateSavedMessage(true); setTimeout(() => setRateSavedMessage(false), 2500); }
  };

  const handleExportJSON = () => {
    const blob = new Blob([AppStore.exportDataJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `andrea-respaldo-${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      if (content && AppStore.importDataJSON(content)) { alert('¡Datos restaurados!'); onRefreshData(); }
      else alert('Error al leer el archivo.');
    };
    reader.readAsText(file);
  };

  // ─── Shared classes ────────────────────────────────────────────────────────
  const inputCls = 'w-full p-2.5 rounded-xl bg-[#FBF9F6] border border-sage-200 text-warm-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-400 placeholder:text-warm-400';
  const tabBtnCls = (key: TabKey) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      activeTab === key
        ? 'bg-[#16291F] text-white shadow-sm'
        : 'text-warm-700 hover:bg-sage-50 hover:text-warm-900'
    }`;
  const sectionHead = (title: string, sub: string) => (
    <div className="border-b border-sage-100 pb-4 mb-5">
      <h3 className="text-lg font-bold font-serif text-warm-900">{title}</h3>
      <p className="text-xs text-warm-500 mt-0.5">{sub}</p>
    </div>
  );

  // ─── Sidebar Content ──────────────────────────────────────────────────────
  const SidebarBody = () => (
    <div className="flex flex-col h-full">
      {/* Stats */}
      <div className="p-4 space-y-2 border-b border-sage-100">
        <div className="p-3 rounded-xl bg-[#FBF9F6] border border-sage-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-warm-400 block">Citas Totales</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-serif text-2xl font-black text-warm-900">{totalBookingsCount}</span>
            {pendingCount > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 font-bold px-1.5 rounded-full">{pendingCount} pendientes</span>
            )}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#FBF9F6] border border-sage-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-warm-400 block">Ingresos</span>
          <span className="font-serif text-lg font-black text-emerald-700">${totalRevenueUSD.toFixed(2)} USD</span>
          <span className="block text-[10px] text-warm-400">≈ {(totalRevenueUSD * exchangeRate).toFixed(0)} Bs</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => navigate(key)} className={tabBtnCls(key)}>
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            {key === 'bookings' && pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">{pendingCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sage-100">
        <button
          onClick={onExitToCatalog}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#16291F] hover:bg-sage-900 text-white rounded-xl text-xs font-bold transition-all"
        >
          <span>Ver Catálogo Público</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F1ED] text-warm-900 font-sans flex flex-col">

      {/* ── TOP HEADER ── */}
      <header className="sticky top-0 z-50 bg-[#FBF9F6] border-b border-sage-200 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Left: hamburger + brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-sage-100 hover:bg-sage-200 text-sage-800 transition-colors border border-sage-200 lg:hidden"
            aria-label="Menú"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#16291F] text-amber-200 flex items-center justify-center font-bold font-serif text-xs shrink-0">
              AL
            </div>
            <div className="hidden sm:block">
              <p className="font-serif font-bold text-warm-900 text-sm leading-tight">ANDREA LABRADOR</p>
              <p className="text-[10px] text-warm-400 leading-tight">Panel de Gestión · Citas &amp; Catálogo</p>
            </div>
          </div>
        </div>

        {/* Right: rate pill + refresh */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sage-50 border border-sage-200 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-warm-600">Tasa:</span>
            <span className="font-bold text-warm-900">${exchangeRate.toFixed(2)} Bs/USD</span>
          </div>
          <button
            onClick={onRefreshData}
            className="p-2 rounded-xl bg-sage-100 hover:bg-sage-200 text-sage-700 border border-sage-200 transition-colors"
            title="Sincronizar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR DRAWER (mobile overlay) ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            fixed lg:relative top-0 left-0 h-full z-40
            w-72 bg-white border-r border-sage-200 shadow-xl lg:shadow-none
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            flex flex-col pt-[60px] lg:pt-0
          `}
          style={{ minHeight: '100vh' }}
        >
          <SidebarBody />
        </aside>

        {/* ── CONTENT AREA ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-sage-200 shadow-sm p-5 sm:p-7 min-h-[500px]">

            {/* TAB 1 — CITAS */}
            {activeTab === 'bookings' && (
              <div className="space-y-5">
                {sectionHead('Historial de Citas', 'Las reservas de tus clientas aparecen aquí, conectadas directo a WhatsApp.')}
                <select
                  value={bookingFilterStatus}
                  onChange={e => setBookingFilterStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#FBF9F6] border border-sage-200 text-xs text-warm-900 focus:outline-none focus:ring-2 focus:ring-sage-400"
                >
                  <option value="all">Todas ({bookings.length})</option>
                  <option value="pendiente">Pendientes ({pendingCount})</option>
                  <option value="confirmada">Confirmadas ({confirmedCount})</option>
                  <option value="completada">Completadas</option>
                  <option value="cancelada">Canceladas</option>
                </select>

                {filteredBookings.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-sage-100 text-sage-500 flex items-center justify-center mx-auto"><Calendar className="w-6 h-6" /></div>
                    <p className="text-sm font-semibold text-warm-700">Sin citas en este estado.</p>
                    <p className="text-xs text-warm-400">Cuando una clienta agende, aparecerá aquí al instante.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBookings.map(b => (
                      <div key={b.id} className="p-4 rounded-2xl bg-[#FBF9F6] border border-sage-200 space-y-3 hover:border-sage-300 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-sage-100">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-warm-900">{b.clientName}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                b.status === 'pendiente'  ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                b.status === 'confirmada' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                b.status === 'completada' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}>{b.status}</span>
                              {b.isFirstVisit && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                                  1ª Cita (-$2 OFF)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-warm-400 mt-1">
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{b.clientPhone}</span>
                              {b.clientInstagram && <span className="flex items-center gap-1 text-pink-600"><InstagramIcon className="w-3 h-3" />@{b.clientInstagram.replace('@','')}</span>}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-serif font-bold text-emerald-700">${b.totalPriceUSD.toFixed(2)} USD</span>
                            <span className="block text-[11px] text-warm-400">≈ {(b.totalPriceUSD * exchangeRate).toFixed(0)} Bs</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {[
                            ['Servicio', b.serviceName],
                            ['Fecha & Hora', `${b.date} · ${b.timeSlot}`],
                            ['Pago', b.paymentMethod.replace('_',' ')],
                          ].map(([label, val]) => (
                            <div key={label} className="p-2 rounded-xl bg-white border border-sage-100">
                              <span className="text-warm-400 block text-[10px] uppercase font-bold mb-0.5">{label}</span>
                              <span className="font-semibold text-warm-900 capitalize">{val}</span>
                            </div>
                          ))}
                        </div>

                        {b.notes && <p className="text-xs text-warm-600 italic bg-amber-50 p-2.5 rounded-xl border border-amber-100">&ldquo;{b.notes}&rdquo;</p>}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <a
                            href={`https://wa.me/${b.clientPhone.replace(/\D/g,'')}?text=¡Hola%20${encodeURIComponent(b.clientName)}%20bella!%20💕%20Confirmo%20tu%20cita%20de%20${encodeURIComponent(b.serviceName)}%20para%20el%20${b.date}%20a%20las%20${b.timeSlot}.%20¡Te%20espero!`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /><span>Responder por WhatsApp</span>
                          </a>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleUpdateStatus(b.id, 'confirmada')} className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold">Confirmar</button>
                            <button onClick={() => handleUpdateStatus(b.id, 'completada')} className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold">Completada</button>
                            <button onClick={() => handleDeleteBooking(b.id)} className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                {sectionHead('Bloqueo de Horarios', 'Toca un turno para bloquearlo. Las clientas no podrán reservar ese horario.')}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-warm-700">Fecha:</label>
                  <input type="date" value={calendarDate} onChange={e => setCalendarDate(e.target.value)}
                    className="px-4 py-2 bg-[#FBF9F6] border border-sage-200 rounded-xl text-xs font-bold text-warm-900 focus:outline-none focus:ring-2 focus:ring-sage-400" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_TIME_SLOTS.map(slot => {
                    const blocked = AppStore.isSlotOccupied(calendarDate, slot);
                    return (
                      <button key={slot} onClick={() => handleToggleSlot(slot)}
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${blocked ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100' : 'bg-white border-sage-200 text-warm-900 hover:border-sage-400'}`}>
                        <div>
                          <span className="font-serif font-bold text-base block">{slot}</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">{blocked ? 'Bloqueado' : 'Disponible'}</span>
                        </div>
                        <div className={`p-2 rounded-xl ${blocked ? 'bg-rose-100 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                          {blocked ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
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
                {sectionHead('Catálogo Oficial & Precios', 'Ajusta precios, duración y foto de cada servicio. Los cambios aparecen al instante.')}

                {/* Edit form */}
                {editingService && (
                  <form onSubmit={handleSaveEditingService} className="p-5 rounded-2xl bg-sage-50 border border-sage-300 space-y-4">
                    <div className="flex items-center justify-between border-b border-sage-200 pb-3">
                      <span className="text-sm font-bold text-warm-900 font-serif">✏️ Editando: {editingService.name}</span>
                      <button type="button" onClick={() => { setEditingService(null); setServiceImagePreview(null); }} className="text-xs text-warm-500 hover:text-warm-900 font-semibold">Cancelar</button>
                    </div>

                    {/* ── IMAGE UPLOAD ── */}
                    <div>
                      <label className="text-xs font-bold text-warm-700 block mb-2">Foto del Servicio</label>
                      <div className="flex items-start gap-4">
                        {/* Preview */}
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-sage-200 bg-sage-50 shrink-0 flex items-center justify-center">
                          {serviceImagePreview ? (
                            <img src={serviceImagePreview} alt="preview" className="w-full h-full object-cover" />
                          ) : editingService.imageUrl ? (
                            <img src={editingService.imageUrl} alt={editingService.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-sage-300" />
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => serviceImageRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-sage-300 hover:bg-sage-100 text-warm-800 text-xs font-bold transition-colors"
                          >
                            <ImagePlus className="w-3.5 h-3.5" />
                            <span>Subir nueva foto</span>
                          </button>
                          {(serviceImagePreview || editingService.imageUrl) && (
                            <button
                              type="button"
                              onClick={() => { setServiceImagePreview(null); setEditingService({ ...editingService, imageUrl: '' }); }}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Quitar foto</span>
                            </button>
                          )}
                          <p className="text-[10px] text-warm-400 leading-relaxed">
                            Formatos: JPG, PNG, WebP.<br />Máx 5 MB. Se guardará con la base de datos.
                          </p>
                          <input ref={serviceImageRef} type="file" accept="image/*" onChange={handleServiceImageChange} className="hidden" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-warm-700 block mb-1">Precio en USD ($)</label>
                        <input type="number" step="0.50" value={editingService.priceUSD}
                          onChange={e => setEditingService({ ...editingService, priceUSD: parseFloat(e.target.value) || 0 })}
                          className={inputCls} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-warm-700 block mb-1">Duración (min)</label>
                        <input type="number" step="5" value={editingService.durationMinutes}
                          onChange={e => setEditingService({ ...editingService, durationMinutes: parseInt(e.target.value) || 60 })}
                          className={inputCls} />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-warm-700 block mb-1">Etiqueta Badge</label>
                      <input type="text" value={editingService.badgeText || ''} placeholder="Ej: Más Solicitado"
                        onChange={e => setEditingService({ ...editingService, badgeText: e.target.value })}
                        className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-warm-700 block mb-1">Descripción Breve</label>
                      <input type="text" value={editingService.shortDescription}
                        onChange={e => setEditingService({ ...editingService, shortDescription: e.target.value })}
                        className={inputCls} />
                    </div>

                    <button type="submit" className="w-full py-2.5 rounded-xl bg-[#16291F] hover:bg-sage-900 text-white text-xs font-bold transition-all">
                      Guardar Cambios
                    </button>
                  </form>
                )}

                {/* Services list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(s => (
                    <div key={s.id} className="rounded-2xl bg-[#FBF9F6] border border-sage-200 overflow-hidden hover:border-sage-300 transition-colors flex flex-col">
                      {s.imageUrl && (
                        <div className="h-28 overflow-hidden">
                          <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-serif font-bold text-warm-900">{s.name}</span>
                              <span className="block text-xs text-warm-500 mt-0.5">{s.shortDescription}</span>
                            </div>
                            <span className="font-serif text-base font-bold text-emerald-700 whitespace-nowrap">${s.priceUSD.toFixed(2)}</span>
                          </div>
                          {s.badgeText && (
                            <span className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase text-white ${s.badgeColor || 'bg-sage-700'}`}>
                              {s.badgeText}
                            </span>
                          )}
                        </div>
                        <div className="pt-2 border-t border-sage-100 flex items-center justify-between">
                          <span className="text-[11px] text-warm-400">{s.durationMinutes} min</span>
                          <button onClick={() => { setEditingService(s); setServiceImagePreview(null); }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-sage-50 border border-sage-200 text-warm-800 text-xs font-bold transition-colors">
                            <Edit2 className="w-3 h-3" /><span>Editar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4 — PROMOS */}
            {activeTab === 'promos' && (
              <div className="space-y-5">
                {sectionHead('Combos & Promociones', 'Crea paquetes para incentivar servicios dobles (Manos + Pies).')}
                <form onSubmit={handleCreatePromo} className="p-4 sm:p-5 rounded-2xl bg-sage-50 border border-sage-200 space-y-3">
                  <span className="text-xs font-bold text-warm-900 uppercase tracking-wider block">Crear Nuevo Combo</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Título (Ej: Dúo Relajación)" value={newPromoTitle} onChange={e => setNewPromoTitle(e.target.value)} className={inputCls} />
                    <input type="text" placeholder="Subtítulo" value={newPromoSubtitle} onChange={e => setNewPromoSubtitle(e.target.value)} className={inputCls} />
                    <input type="number" step="0.5" placeholder="Precio Promo ($ USD)" value={newPromoPrice} onChange={e => setNewPromoPrice(e.target.value)} className={inputCls} />
                    <input type="text" placeholder="Etiqueta (Ej: MÁS PEDIDO)" value={newPromoBadge} onChange={e => setNewPromoBadge(e.target.value)} className={inputCls} />
                  </div>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#16291F] hover:bg-sage-900 text-white text-xs font-bold transition-all">Agregar Combo</button>
                </form>

                <div className="space-y-3">
                  {promos.map(p => (
                    <div key={p.id} className="p-4 rounded-2xl bg-white border border-sage-200 flex items-center justify-between hover:border-sage-300 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-warm-900 text-sm">{p.title}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">{p.badge}</span>
                        </div>
                        <p className="text-xs text-warm-500 mt-0.5">{p.subtitle}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="font-serif font-bold text-emerald-700">${p.promoPriceUSD.toFixed(2)} USD</span>
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
                {sectionHead('Tasa de Cambio & Respaldos', 'Actualiza la tasa del dólar y gestiona tus copias de seguridad.')}

                <form onSubmit={handleSaveRate} className="p-5 rounded-2xl bg-sage-50 border border-sage-200 space-y-3">
                  <span className="text-xs font-bold text-warm-900 uppercase tracking-wider block">Tasa del Dólar (VES)</span>
                  <p className="text-xs text-warm-500">Se usa para calcular el equivalente en Bs de cada servicio y en el mensaje de WhatsApp.</p>
                  <div className="flex items-center gap-3">
                    <div className="relative w-44">
                      <input type="number" step="0.01" value={currentRate} onChange={e => setCurrentRate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-sage-200 text-warm-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 pr-10" />
                      <span className="absolute right-3 top-2 text-xs text-warm-400">Bs</span>
                    </div>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-[#16291F] hover:bg-sage-900 text-white font-bold text-xs transition-all">Actualizar</button>
                    {rateSavedMessage && <span className="text-xs text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Guardado</span>}
                  </div>
                </form>

                <div className="p-5 rounded-2xl bg-white border border-sage-200 space-y-4">
                  <span className="text-xs font-bold text-warm-900 uppercase tracking-wider block">Copia de Seguridad</span>
                  <p className="text-xs text-warm-500 leading-relaxed">Descarga una copia completa de tus citas, servicios y configuraciones en formato JSON.</p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={handleExportJSON}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-warm-900 text-xs font-bold border border-sage-200 transition-colors">
                      <Download className="w-4 h-4" /><span>Descargar Respaldo JSON</span>
                    </button>
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-warm-900 text-xs font-bold border border-sage-200 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" /><span>Restaurar desde JSON</span>
                      <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
