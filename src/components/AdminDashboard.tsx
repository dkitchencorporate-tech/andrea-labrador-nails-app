import React, { useState, useRef, useMemo } from 'react';
import { 
  ServiceItem, 
  AppointmentBooking, 
  BlockedTimeSlot,
  LoyaltyCard 
} from '../types';
import { AppStore, StudioEmailSettings } from '../services/store';
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
  Menu,
  X,
  ImagePlus,
  Image as ImageIcon,
  Users,
  Mail,
  Plus,
  Clock,
  Award,
  Search,
  Send,
  Copy,
  AlertTriangle,
  Globe,
  Settings
} from 'lucide-react';
import { InstagramIcon } from './Icons';

interface AdminDashboardProps {
  services: ServiceItem[];
  promos?: unknown[];
  bookings: AppointmentBooking[];
  blockedSlots: BlockedTimeSlot[];
  exchangeRate: number;
  onRefreshData: () => void;
  onExitToCatalog: () => void;
}

type TabKey = 'bookings' | 'calendar' | 'services' | 'crm' | 'settings';

const NAV_ITEMS: { key: TabKey; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { key: 'bookings', label: 'Citas & Reservas',       Icon: LayoutDashboard },
  { key: 'calendar', label: 'Horarios & Agenda',      Icon: Calendar },
  { key: 'services', label: 'Catálogo de Servicios',  Icon: Sparkles },
  { key: 'crm',      label: 'Clientela & CRM',        Icon: Users },
  { key: 'settings', label: 'Tasa & Respaldos',       Icon: DollarSign },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  services,
  bookings,
  blockedSlots,
  exchangeRate,
  onRefreshData,
  onExitToCatalog,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('bookings');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ─── CALENDAR STATE ───────────────────────────────────────────────────────
  const [calendarDate, setCalendarDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [allTimeSlots, setAllTimeSlots] = useState<string[]>(() => AppStore.getTimeSlots());
  const [newCustomSlot, setNewCustomSlot] = useState('');
  const [openingTime, setOpeningTime] = useState('09:00 AM');
  const [closingTime, setClosingTime] = useState('07:00 PM');

  // ─── SERVICE EDITOR / CREATOR STATE ───────────────────────────────────────
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [serviceImagePreview, setServiceImagePreview] = useState<string | null>(null);
  const serviceImageRef = useRef<HTMLInputElement>(null);

  const [serviceForm, setServiceForm] = useState<Partial<ServiceItem>>({
    name: '',
    category: 'natural',
    priceUSD: 10,
    durationMinutes: 60,
    shortDescription: '',
    fullDescription: '',
    badgeText: 'Clásico',
    badgeColor: 'bg-sage-800',
    imageUrl: '/images/esmaltado-semipermanente.png',
    isAvailable: true,
    tags: ['Uña natural', 'Brillo intacto'],
  });

  // ─── CRM & CLIENTS STATE ──────────────────────────────────────────────────
  const [crmSearch, setCrmSearch] = useState('');
  const [emailModalClient, setEmailModalClient] = useState<{
    name: string;
    phone: string;
    email?: string;
    stamps: number;
    lastBooking?: AppointmentBooking;
  } | null>(null);
  const [emailTemplate, setEmailTemplate] = useState<'confirmation' | 'reminder' | 'loyalty_prize'>('confirmation');
  const [emailCopySuccess, setEmailCopySuccess] = useState(false);

  // ─── ARSYS WEBMAIL CONFIG ─────────────────────────────────────────────────
  const [emailSettings, setEmailSettings] = useState<StudioEmailSettings>(() => AppStore.getEmailSettings());
  const [emailSettingsSaved, setEmailSettingsSaved] = useState(false);

  // ─── SETTINGS & EXCHANGE RATE ─────────────────────────────────────────────
  const [currentRate, setCurrentRate] = useState(exchangeRate.toString());
  const [rateSavedMessage, setRateSavedMessage] = useState(false);
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');

  // ─── DERIVED STATS ────────────────────────────────────────────────────────
  const totalBookingsCount = bookings.length;
  const pendingCount   = bookings.filter(b => b.status === 'pendiente').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmada' || b.status === 'completada').length;
  const totalRevenueUSD = bookings
    .filter(b => b.status === 'completada' || b.status === 'confirmada')
    .reduce((acc, b) => acc + b.totalPriceUSD, 0);

  const filteredBookings = bookings.filter(b =>
    bookingFilterStatus === 'all' || b.status === bookingFilterStatus
  );

  // Consolidated client list derived from bookings and loyalty store
  const loyaltyCards = AppStore.getLoyaltyCards();
  const clientsList = useMemo(() => {
    const map = new Map<string, {
      phone: string;
      name: string;
      instagram?: string;
      bookingsCount: number;
      lastVisit: string;
      stampsCount: number;
      hasFreeService: boolean;
      lastBooking?: AppointmentBooking;
    }>();

    // From loyalty cards
    Object.values(loyaltyCards).forEach(card => {
      map.set(card.phone, {
        phone: card.phone,
        name: card.clientName,
        bookingsCount: 0,
        lastVisit: card.lastVisit || 'Sin fecha',
        stampsCount: card.stampsCount,
        hasFreeService: card.stampsCount >= 6,
      });
    });

    // Merge bookings data
    bookings.forEach(b => {
      const normPhone = b.clientPhone.replace(/\D/g, '');
      const existing = map.get(normPhone);
      if (existing) {
        existing.bookingsCount += 1;
        if (!existing.instagram && b.clientInstagram) existing.instagram = b.clientInstagram;
        if (!existing.lastBooking) existing.lastBooking = b;
      } else {
        map.set(normPhone, {
          phone: normPhone,
          name: b.clientName,
          instagram: b.clientInstagram,
          bookingsCount: 1,
          lastVisit: b.date,
          stampsCount: Math.min(6, 1),
          hasFreeService: false,
          lastBooking: b,
        });
      }
    });

    const list = Array.from(map.values());
    if (!crmSearch.trim()) return list;
    const q = crmSearch.toLowerCase();
    return list.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.instagram && c.instagram.toLowerCase().includes(q)));
  }, [loyaltyCards, bookings, crmSearch]);

  // Day occupancy for calendar view
  const isSelectedDayBlocked = AppStore.isDayEntirelyBlocked(calendarDate);
  const bookingsOnSelectedDate = bookings.filter(b => b.date === calendarDate);

  // ─── HANDLERS ─────────────────────────────────────────────────────────────
  const navigate = (tab: TabKey) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleUpdateStatus = (id: string, status: AppointmentBooking['status']) => { 
    AppStore.updateBookingStatusRemote(id, status); 
    onRefreshData(); 
  };

  const handleDeleteBooking = (id: string) => { 
    if (window.confirm('¿Deseas eliminar este registro de cita?')) { 
      AppStore.deleteBookingRemote(id); 
      onRefreshData(); 
    } 
  };

  // ─── CALENDAR TIME SLOT MANAGEMENT ────────────────────────────────────────
  const handleToggleSlot = (slot: string) => {
    AppStore.toggleBlockSlotRemote(calendarDate, slot);
    onRefreshData();
  };

  const handleToggleBlockEntireDay = () => {
    if (isSelectedDayBlocked) {
      AppStore.unblockEntireDayRemote(calendarDate);
    } else {
      AppStore.blockEntireDayRemote(calendarDate, allTimeSlots, 'Día completo cerrado por el estudio');
    }
    onRefreshData();
  };

  const handleAddCustomSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomSlot.trim()) return;
    AppStore.addTimeSlot(newCustomSlot.trim());
    setAllTimeSlots(AppStore.getTimeSlots());
    setNewCustomSlot('');
    onRefreshData();
  };

  const handleRemoveSlot = (slot: string) => {
    if (window.confirm(`¿Deseas eliminar el turno ${slot}?`)) {
      AppStore.removeTimeSlot(slot);
      setAllTimeSlots(AppStore.getTimeSlots());
      onRefreshData();
    }
  };

  // ─── SERVICE MANAGEMENT ───────────────────────────────────────────────────
  const handleOpenCreateService = () => {
    setIsCreatingService(true);
    setEditingService(null);
    setServiceImagePreview(null);
    setServiceForm({
      id: 'srv_' + Date.now(),
      name: '',
      category: 'natural',
      priceUSD: 10,
      durationMinutes: 60,
      shortDescription: '',
      fullDescription: '',
      badgeText: '',
      badgeColor: 'bg-sage-800',
      imageUrl: '/images/esmaltado-semipermanente.png',
      isAvailable: true,
      tags: ['Uña natural'],
    });
  };

  const handleOpenEditService = (s: ServiceItem) => {
    setIsCreatingService(false);
    setEditingService(s);
    setServiceImagePreview(null);
    setServiceForm({ ...s });
  };

  const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setServiceImagePreview(result);
      setServiceForm(prev => ({ ...prev, imageUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveServiceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name?.trim()) {
      alert('Por favor indica el nombre del servicio.');
      return;
    }

    const item: ServiceItem = {
      id: serviceForm.id || (editingService ? editingService.id : 'srv_' + Date.now()),
      name: serviceForm.name.trim(),
      category: (serviceForm.category as 'natural' | 'extensions' | 'pedicure') || 'natural',
      priceUSD: parseFloat(serviceForm.priceUSD as unknown as string) || 10,
      durationMinutes: parseInt(serviceForm.durationMinutes as unknown as string) || 60,
      shortDescription: serviceForm.shortDescription?.trim() || 'Servicio profesional de autor.',
      fullDescription: serviceForm.fullDescription?.trim() || serviceForm.shortDescription?.trim() || '',
      idealFor: serviceForm.idealFor?.trim() || 'Cuidado y belleza de manos y pies.',
      badgeText: serviceForm.badgeText?.trim() || undefined,
      badgeColor: serviceForm.badgeColor || 'bg-sage-800',
      imageUrl: serviceImagePreview || serviceForm.imageUrl || '/images/esmaltado-semipermanente.png',
      isAvailable: serviceForm.isAvailable ?? true,
      tags: serviceForm.tags || ['Especialidad Andrea Labrador'],
    };

    AppStore.saveServiceRemote(item);
    setEditingService(null);
    setIsCreatingService(false);
    setServiceImagePreview(null);
    onRefreshData();
  };

  const handleDeleteService = (id: string, name: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar el servicio "${name}" del catálogo?`)) {
      AppStore.deleteServiceRemote(id);
      onRefreshData();
    }
  };

  // ─── CRM STAMP ADJUSTMENTS ────────────────────────────────────────────────
  const handleAdjustStamp = (phone: string, clientName: string, delta: number) => {
    const existing = AppStore.getClientLoyalty(phone);
    const current = existing ? existing.stampsCount : 1;
    const next = Math.max(0, Math.min(6, current + delta));
    AppStore.setLoyaltyStampsRemote(phone, clientName, next);
    onRefreshData();
  };

  // ─── EMAIL TEMPLATE GENERATOR ─────────────────────────────────────────────
  const getEmailContent = () => {
    if (!emailModalClient) return { subject: '', body: '' };
    const { name, stamps, lastBooking } = emailModalClient;
    const date = lastBooking?.date || 'Próxima cita';
    const time = lastBooking?.timeSlot || 'Horario acordado';
    const svc = lastBooking?.serviceName || 'Servicio de Manicura';
    const priceUSD = lastBooking ? lastBooking.totalPriceUSD.toFixed(2) : '10.00';
    const priceVES = lastBooking ? (lastBooking.totalPriceUSD * exchangeRate).toFixed(0) : '368';

    if (emailTemplate === 'confirmation') {
      return {
        subject: `Confirmación de Cita — Andrea Labrador Nails Studio`,
        body: `Hola ${name},\n\n¡Tu cita ha sido confirmada con éxito!\n\nDetalles de tu servicio:\n💅 Servicio: ${svc}\n📅 Fecha: ${date}\n⏰ Hora: ${time}\n💰 Total: $${priceUSD} USD (≈ ${priceVES} Bs)\n\n📍 Políticas del estudio:\n- Contamos con 10 minutos de margen de tolerancia.\n- Te sugerimos asistir sola para disfrutar de tu momento de relax y desconexión (si requieres venir acompañada o con niños, avísame con gusto por WhatsApp para coordinarlo).\n\n¡Te esperamos con entusiasmo para consentir tus manos!\n\nAndrea Labrador — Manicurista Profesional\nWhatsApp: +58 424 1360937\nInstagram: @andrealabradorl`
      };
    }

    if (emailTemplate === 'reminder') {
      return {
        subject: `Recordatorio de tu Cita de Mañana — Andrea Labrador Nails`,
        body: `Hola ${name},\n\nTe escribo para recordarte tu cita programada para el día de mañana:\n\n💅 Servicio: ${svc}\n📅 Fecha: ${date}\n⏰ Hora: ${time}\n\nSi necesitas reprogramar o tienes alguna pregunta previa, avísame con anticipación por WhatsApp al 0424-1360937.\n\n¡Nos vemos pronto!\nAndrea Labrador Nails`
      };
    }

    return {
      subject: `🎉 ¡Felicitaciones ${name}! Tu próximo servicio es 100% GRATIS`,
      body: `¡Hola ${name}!\n\n¡Tenemos una excelente noticia para ti! Con tus visitas continuas has completado 6 servicios en el estudio de Andrea Labrador Nails.\n\n⭐ Tu 7º servicio (Esmaltado Semipermanente o Mantenimiento Rubber) es 100% GRATIS por cuenta de la casa.\n\nPara canjear tu servicio de cortesía, responde a este correo o escríbenos directamente a WhatsApp (0424-1360937) para agendar tu cupo especial.\n\n¡Gracias por tu confianza y preferencia!\nAndrea Labrador Studio`
    };
  };

  const handleCopyEmailBody = () => {
    const { body } = getEmailContent();
    navigator.clipboard.writeText(body);
    setEmailCopySuccess(true);
    setTimeout(() => setEmailCopySuccess(false), 2000);
  };

  const handleOpenMailClient = () => {
    const { subject, body } = getEmailContent();
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const handleSaveEmailSettings = (e: React.FormEvent) => {
    e.preventDefault();
    AppStore.saveEmailSettings(emailSettings);
    setEmailSettingsSaved(true);
    setTimeout(() => setEmailSettingsSaved(false), 2500);
  };

  // ─── RATE & BACKUP ────────────────────────────────────────────────────────
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

  // ─── SHARED UI STYLES ──────────────────────────────────────────────────────
  const inputCls = 'w-full p-2.5 rounded-xl bg-[#FBF9F6] border border-sage-200 text-warm-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-400 placeholder:text-warm-400';
  const tabBtnCls = (key: TabKey) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      activeTab === key
        ? 'bg-[#16291F] text-white shadow-sm'
        : 'text-warm-700 hover:bg-sage-50 hover:text-warm-900'
    }`;
  const sectionHead = (title: string, sub: string, action?: React.ReactNode) => (
    <div className="border-b border-sage-100 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-bold font-serif text-warm-900">{title}</h3>
        <p className="text-xs text-warm-500 mt-0.5">{sub}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F1ED] text-warm-900 font-sans flex flex-col">

      {/* ── TOP HEADER ── */}
      <header className="sticky top-0 z-50 bg-[#FBF9F6] border-b border-sage-200 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between">
        
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
            <div>
              <p className="font-serif font-bold text-warm-900 text-sm leading-tight">ANDREA LABRADOR</p>
              <p className="text-[10px] text-warm-500 leading-tight">Panel de Gestión · Citas &amp; Estudio</p>
            </div>
          </div>
        </div>

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

          <button
            onClick={onExitToCatalog}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#16291F] hover:bg-sage-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <span>Ver Catálogo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── MOBILE OVERLAY ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── SIDEBAR DRAWER ── */}
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
          <div className="flex flex-col h-full">
            {/* Quick Metrics */}
            <div className="p-4 space-y-2 border-b border-sage-100">
              <div className="p-3 rounded-xl bg-[#FBF9F6] border border-sage-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-warm-400 block">Citas Registradas</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-serif text-2xl font-black text-warm-900">{totalBookingsCount}</span>
                  {pendingCount > 0 && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 font-bold px-1.5 rounded-full">{pendingCount} pendientes</span>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#FBF9F6] border border-sage-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-warm-400 block">Ingresos Confirmados</span>
                <span className="font-serif text-lg font-black text-emerald-700">${totalRevenueUSD.toFixed(2)} USD</span>
                <span className="block text-[10px] text-warm-400">≈ {(totalRevenueUSD * exchangeRate).toFixed(0)} Bs</span>
              </div>
            </div>

            {/* Navigation items */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map(({ key, label, Icon }) => (
                <button key={key} onClick={() => navigate(key)} className={tabBtnCls(key)}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {key === 'bookings' && pendingCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">{pendingCount}</span>
                  )}
                  {key === 'crm' && clientsList.some(c => c.hasFreeService) && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Clientes con 7º gratis" />
                  )}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-sage-100 text-[11px] text-warm-500 space-y-1">
              <p className="font-bold text-warm-800">Estudio Andrea Labrador</p>
              <p>Seguridad activa &bull; Citas blindadas</p>
            </div>
          </div>
        </aside>

        {/* ── CONTENT PANEL ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-sage-200 shadow-sm p-5 sm:p-7 min-h-[550px]">

            {/* ══════════════════════════════════════════════════════════════════
                TAB 1: CITAS & RESERVAS
            ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'bookings' && (
              <div className="space-y-5">
                {sectionHead(
                  'Historial de Citas & Reservas',
                  'Las solicitudes de tus clientas se reflejan aquí de forma atómica y conectadas directo a WhatsApp.',
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
                )}

                {filteredBookings.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-sage-100 text-sage-500 flex items-center justify-center mx-auto"><Calendar className="w-6 h-6" /></div>
                    <p className="text-sm font-semibold text-warm-700">Sin citas en este estado.</p>
                    <p className="text-xs text-warm-400">Cuando una clienta agende en la web, aparecerá aquí al instante.</p>
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
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300" title="Verificar presencialmente que sea clienta nueva para aplicar el descuento de bienvenida">
                                  1ª Cita (-$2 OFF) &bull; Validar en salón
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

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          {[
                            ['Servicio', b.serviceName],
                            ['Fecha & Hora', `${b.date} · ${b.timeSlot}`],
                            ['Forma de Pago', b.paymentMethod.replace('_',' ')],
                          ].map(([label, val]) => (
                            <div key={label} className="p-2.5 rounded-xl bg-white border border-sage-100">
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
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button onClick={() => handleUpdateStatus(b.id, 'confirmada')} className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold">Confirmar</button>
                            <button onClick={() => handleUpdateStatus(b.id, 'completada')} className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold">Completada</button>
                            {b.status === 'completada' && (
                              <a
                                href={`https://wa.me/${b.clientPhone.replace(/\D/g,'')}?text=¡Hola%20${encodeURIComponent(b.clientName)}%20bella!%20💅✨%20¡Muchas%20gracias%20por%20tu%20visita%20de%20hoy!%20Hemos%20registrado%20tu%20servicio%20y%20se%20ha%20sumado%20tu%20sello%20en%20tu%20Tarjeta%20VIP.%20Recuerda%20que%20al%20completar%206%20visitas,%20¡tu%207º%20servicio%20es%20100%25%20GRATIS!%20Nos%20vemos%20pronto%20💕`}
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs"
                                title="Enviar sello acreditado a la clienta por WhatsApp"
                              >
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>Notificar Sello</span>
                              </a>
                            )}
                            <button onClick={() => handleDeleteBooking(b.id)} className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-colors" title="Eliminar registro"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                TAB 2: HORARIOS & CALENDARIO 100% AUTOGESTIONABLE
            ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'calendar' && (
              <div className="space-y-7">
                {sectionHead(
                  'Gestión Integral de Horarios & Agenda',
                  'Configura tus horas de apertura, turnos personalizados y bloquea turnos o días completos de descanso.'
                )}

                {/* 1. Selector de Día y Bloqueo de Día Completo */}
                <div className="p-5 rounded-2xl bg-[#FBF9F6] border border-sage-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-warm-800">Fecha a gestionar:</label>
                      <input 
                        type="date" 
                        value={calendarDate} 
                        onChange={e => setCalendarDate(e.target.value)}
                        className="px-3.5 py-2 bg-white border border-sage-300 rounded-xl text-xs font-bold text-warm-900 focus:outline-none focus:ring-2 focus:ring-sage-400"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleBlockEntireDay}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        isSelectedDayBlocked
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-rose-700 hover:bg-rose-800 text-white'
                      }`}
                    >
                      {isSelectedDayBlocked ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Desbloquear Día Completo</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>🚫 Bloquear Día Completo (Día Libre / Cerrado)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isSelectedDayBlocked && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Este día se encuentra marcado como <strong>Cerrado</strong>. Las clientas verán el día deshabilitado en el catálogo.</span>
                    </div>
                  )}

                  {/* Turnos de este día */}
                  <div>
                    <span className="text-xs font-bold text-warm-800 block mb-2">Turnos de este día (Toca para alternar bloqueo individual):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {allTimeSlots.map(slot => {
                        const blocked = AppStore.isSlotOccupied(calendarDate, slot);
                        const bookingInSlot = bookingsOnSelectedDate.find(b => b.timeSlot === slot && b.status !== 'cancelada');

                        return (
                          <div
                            key={slot}
                            onClick={() => !bookingInSlot && handleToggleSlot(slot)}
                            className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                              bookingInSlot
                                ? 'bg-blue-50 border-blue-200 text-blue-950'
                                : blocked
                                ? 'bg-rose-50 border-rose-200 text-rose-900 cursor-pointer hover:bg-rose-100'
                                : 'bg-white border-sage-200 text-warm-900 cursor-pointer hover:border-sage-400'
                            }`}
                          >
                            <div>
                              <span className="font-serif font-bold text-sm block">{slot}</span>
                              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                                {bookingInSlot
                                  ? `Cita: ${bookingInSlot.clientName}`
                                  : blocked
                                  ? 'Bloqueado'
                                  : 'Disponible'}
                              </span>
                            </div>
                            <div className={`p-1.5 rounded-lg ${
                              bookingInSlot
                                ? 'bg-blue-100 text-blue-700'
                                : blocked
                                ? 'bg-rose-100 text-rose-600'
                                : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {bookingInSlot ? <Clock className="w-4 h-4" /> : blocked ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Configuración de Turnos Regulares del Estudio */}
                <div className="p-5 rounded-2xl bg-white border border-sage-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-sage-100 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-base text-warm-900">Horario Habitual del Estudio</h4>
                      <p className="text-xs text-warm-500">Agrega o elimina horas predeterminadas disponibles para tus clientas.</p>
                    </div>
                    <span className="text-xs font-bold text-sage-800 bg-sage-50 px-3 py-1 rounded-full border border-sage-200">
                      {allTimeSlots.length} turnos activos
                    </span>
                  </div>

                  {/* Add slot form */}
                  <form onSubmit={handleAddCustomSlot} className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ej: 10:30 AM, 01:00 PM, 05:30 PM..."
                      value={newCustomSlot}
                      onChange={e => setNewCustomSlot(e.target.value)}
                      className="p-2.5 bg-[#FBF9F6] border border-sage-300 rounded-xl text-xs font-semibold text-warm-900 focus:ring-2 focus:ring-sage-400 focus:outline-none w-56"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#16291F] hover:bg-sage-900 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Turno</span>
                    </button>
                  </form>

                  {/* Active Slots list with delete */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {allTimeSlots.map(slot => (
                      <div key={slot} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sage-50 border border-sage-200 text-xs font-bold text-warm-900">
                        <span>{slot}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(slot)}
                          className="text-warm-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Eliminar este turno"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                TAB 3: CATÁLOGO DE SERVICIOS 100% AUTOGESTIONABLE
            ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                {sectionHead(
                  'Catálogo Oficial de Servicios & Precios',
                  'Crea nuevos servicios, edita precios, duración, fotos y distintivos con efecto inmediato en el catálogo público.',
                  <button
                    onClick={handleOpenCreateService}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#16291F] hover:bg-sage-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Añadir Nuevo Servicio</span>
                  </button>
                )}

                {/* Service Create / Edit Modal / Form */}
                {(isCreatingService || editingService) && (
                  <form onSubmit={handleSaveServiceForm} className="p-5 sm:p-6 rounded-3xl bg-sage-50/70 border-2 border-sage-300 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-sage-200 pb-3">
                      <span className="font-serif font-bold text-base text-warm-900">
                        {isCreatingService ? '✨ Crear Nuevo Servicio' : `✏️ Editando: ${editingService?.name}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setIsCreatingService(false); setEditingService(null); setServiceImagePreview(null); }}
                        className="text-xs text-warm-600 hover:text-warm-900 font-bold p-1"
                      >
                        Cancelar
                      </button>
                    </div>

                    {/* Image Selector */}
                    <div>
                      <label className="text-xs font-bold text-warm-800 block mb-2">Foto del Servicio</label>
                      <div className="flex items-start gap-4">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-sage-300 bg-white shrink-0 flex items-center justify-center shadow-xs">
                          {serviceImagePreview ? (
                            <img src={serviceImagePreview} alt="preview" className="w-full h-full object-cover" />
                          ) : serviceForm.imageUrl ? (
                            <img src={serviceForm.imageUrl} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-sage-300" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => serviceImageRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-sage-300 hover:bg-sage-100 text-warm-900 text-xs font-bold rounded-xl transition-all shadow-xs"
                          >
                            <ImagePlus className="w-3.5 h-3.5" />
                            <span>Subir / Cambiar Foto</span>
                          </button>
                          {(serviceImagePreview || serviceForm.imageUrl) && (
                            <button
                              type="button"
                              onClick={() => { setServiceImagePreview(null); setServiceForm(prev => ({ ...prev, imageUrl: '' })); }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-all ml-2"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Quitar</span>
                            </button>
                          )}
                          <p className="text-[10px] text-warm-500">Formatos compatibles: JPG, PNG, WebP. Resolución óptima: 800x800 px.</p>
                          <input ref={serviceImageRef} type="file" accept="image/*" onChange={handleServiceImageChange} className="hidden" />
                        </div>
                      </div>
                    </div>

                    {/* Basic info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-warm-700 block mb-1">Nombre del Servicio *</label>
                        <input
                          type="text"
                          required
                          value={serviceForm.name}
                          onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                          placeholder="Ej: Esmaltado Semipermanente"
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-warm-700 block mb-1">Categoría</label>
                        <select
                          value={serviceForm.category}
                          onChange={e => setServiceForm({ ...serviceForm, category: e.target.value as 'natural' | 'extensions' | 'pedicure' })}
                          className={inputCls}
                        >
                          <option value="natural">Uña Natural (Semipermanente, Rubber, Capping)</option>
                          <option value="extensions">Extensiones (Polygel, Jelly Tips)</option>
                          <option value="pedicure">Pedicure &amp; Spa</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-warm-700 block mb-1">Precio en USD ($) *</label>
                        <input
                          type="number"
                          step="0.50"
                          required
                          value={serviceForm.priceUSD}
                          onChange={e => setServiceForm({ ...serviceForm, priceUSD: parseFloat(e.target.value) || 0 })}
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-warm-700 block mb-1">Duración (minutos) *</label>
                        <input
                          type="number"
                          step="5"
                          required
                          value={serviceForm.durationMinutes}
                          onChange={e => setServiceForm({ ...serviceForm, durationMinutes: parseInt(e.target.value) || 60 })}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* Badge & psychological labels */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-warm-700 block mb-1">Etiqueta Badge (Opcional)</label>
                        <input
                          type="text"
                          value={serviceForm.badgeText || ''}
                          placeholder="Ej: Más Solicitado, Clásico, Nuevo"
                          onChange={e => setServiceForm({ ...serviceForm, badgeText: e.target.value })}
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-warm-700 block mb-1">Color del Badge</label>
                        <select
                          value={serviceForm.badgeColor}
                          onChange={e => setServiceForm({ ...serviceForm, badgeColor: e.target.value })}
                          className={inputCls}
                        >
                          <option value="bg-sage-800">Verde Salvia Elegante</option>
                          <option value="bg-emerald-800">Verde Esmeralda</option>
                          <option value="bg-amber-700">Ámbar / Oro Champagne</option>
                          <option value="bg-rose-700">Rosa Palo</option>
                          <option value="bg-purple-700">Púrpura</option>
                        </select>
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div>
                      <label className="text-xs font-bold text-warm-700 block mb-1">Descripción Breve</label>
                      <input
                        type="text"
                        value={serviceForm.shortDescription || ''}
                        placeholder="Descripción concisa para la tarjeta del catálogo..."
                        onChange={e => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                        className={inputCls}
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="isAvailableCheckbox"
                        checked={serviceForm.isAvailable ?? true}
                        onChange={e => setServiceForm({ ...serviceForm, isAvailable: e.target.checked })}
                        className="rounded border-sage-300 text-sage-800 focus:ring-sage-400 h-4 w-4"
                      />
                      <label htmlFor="isAvailableCheckbox" className="text-xs font-bold text-warm-800 cursor-pointer">
                        Servicio activo y disponible para reservas en la web
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#16291F] hover:bg-sage-900 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      {isCreatingService ? 'Guardar & Publicar en Catálogo' : 'Guardar Cambios del Servicio'}
                    </button>
                  </form>
                )}

                {/* Services List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(s => (
                    <div key={s.id} className="rounded-3xl bg-[#FBF9F6] border border-sage-200 overflow-hidden hover:border-sage-300 transition-all flex flex-col justify-between shadow-xs">
                      {s.imageUrl && (
                        <div className="h-32 overflow-hidden bg-sage-100 relative">
                          <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                          {!s.isAvailable && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                              Oculto en Catálogo
                            </span>
                          )}
                        </div>
                      )}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-serif font-bold text-warm-900 text-base">{s.name}</span>
                              <span className="block text-xs text-warm-500 mt-0.5">{s.shortDescription}</span>
                            </div>
                            <span className="font-serif text-lg font-bold text-emerald-700 whitespace-nowrap">
                              ${s.priceUSD.toFixed(2)}
                            </span>
                          </div>

                          {s.badgeText && (
                            <span className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase text-white ${s.badgeColor || 'bg-sage-800'}`}>
                              {s.badgeText}
                            </span>
                          )}
                        </div>

                        <div className="pt-3 border-t border-sage-100 flex items-center justify-between text-xs">
                          <span className="text-warm-500">{s.durationMinutes} minutos &bull; {s.category}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditService(s)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-sage-50 border border-sage-200 text-warm-800 font-bold text-xs transition-colors"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => handleDeleteService(s.id, s.name)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                              title="Eliminar servicio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                TAB 4: GESTIÓN DE CLIENTELA (CRM VISUAL) & EMAIL
            ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'crm' && (
              <div className="space-y-6">
                {sectionHead(
                  'Gestión Visual de Clientela & CRM',
                  'Monitorea el progreso de sellos de fidelización (6+1 gratis), envía recordatorios por WhatsApp y dispara correos profesionales.'
                )}

                {/* CRM Summary Pill & Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o teléfono..."
                      value={crmSearch}
                      onChange={e => setCrmSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#FBF9F6] border border-sage-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-sage-50 border border-sage-200 text-warm-800 font-bold">
                      {clientsList.length} clientas registradas
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                      {clientsList.filter(c => c.hasFreeService).length} con 7º GRATIS
                    </span>
                  </div>
                </div>

                {/* Clients Table / Cards */}
                {clientsList.length === 0 ? (
                  <div className="text-center py-16 space-y-2">
                    <Users className="w-10 h-10 text-sage-400 mx-auto" />
                    <p className="text-sm font-bold text-warm-800">No se encontraron clientas.</p>
                    <p className="text-xs text-warm-500">A medida que las clientas agenden en el catálogo, se agregarán a este panel CRM.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {clientsList.map(client => (
                      <div key={client.phone} className="p-4 rounded-2xl bg-[#FBF9F6] border border-sage-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-sage-300 transition-all">
                        
                        {/* Client details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-warm-900 text-sm">{client.name}</span>
                            {client.hasFreeService ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                                🏆 ¡7º Servicio GRATIS!
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                {client.stampsCount}/6 sellos
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-warm-500">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>
                            {client.instagram && (
                              <span className="flex items-center gap-1 text-pink-600 font-semibold">
                                <InstagramIcon className="w-3 h-3" />@{client.instagram.replace('@','')}
                              </span>
                            )}
                            <span>&bull; Última visita: {client.lastVisit}</span>
                          </div>

                          {/* 6 Stamps Visual Indicator */}
                          <div className="flex items-center gap-1.5 pt-1">
                            {[1, 2, 3, 4, 5, 6].map(num => (
                              <div
                                key={num}
                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all ${
                                  num <= client.stampsCount
                                    ? 'bg-amber-400 border-amber-300 text-sage-950 font-black'
                                    : 'bg-white border-sage-200 text-warm-400'
                                }`}
                              >
                                {num <= client.stampsCount ? '✓' : num}
                              </div>
                            ))}
                            <span className="text-[10px] text-warm-500 font-medium ml-1">
                              {client.stampsCount >= 6 ? '¡Completó ciclo!' : `Faltan ${6 - client.stampsCount} para gratis`}
                            </span>
                          </div>
                        </div>

                        {/* Actions: Stamp Adjusters, WhatsApp & Email */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {/* Manual stamp buttons */}
                          <div className="flex items-center rounded-xl bg-white border border-sage-200 p-0.5 shadow-xs">
                            <button
                              type="button"
                              onClick={() => handleAdjustStamp(client.phone, client.name, -1)}
                              className="px-2 py-1 text-xs font-bold text-warm-600 hover:text-rose-600"
                              title="Restar 1 sello"
                            >
                              -1
                            </button>
                            <span className="px-1 text-[11px] font-bold text-warm-800">{client.stampsCount}</span>
                            <button
                              type="button"
                              onClick={() => handleAdjustStamp(client.phone, client.name, 1)}
                              className="px-2 py-1 text-xs font-bold text-warm-600 hover:text-emerald-700"
                              title="Sumar 1 sello manual"
                            >
                              +1
                            </button>
                          </div>

                          {/* Direct WhatsApp Message with CRM template */}
                          <a
                            href={`https://wa.me/${client.phone}?text=¡Hola%20${encodeURIComponent(client.name)}%20bella!%20💕%20Te%20saluda%20Andrea%20Labrador.%20${
                              client.hasFreeService
                                ? '¡Queremos%20felicitarte%20porque%20has%20completado%20tus%206%20visitas%20y%20tu%20próximo%20servicio%20es%20100%25%20GRATIS!%20¿Cuándo%20deseas%20agendarlo?'
                                : `Tienes%20${client.stampsCount}%20de%206%20sellos%20en%20tu%20tarjeta%20de%20fidelización.%20¡Te%20esperamos%20para%20consentir%20tus%20uñas!`
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Trigger Email Modal */}
                          <button
                            type="button"
                            onClick={() => setEmailModalClient({
                              name: client.name,
                              phone: client.phone,
                              stamps: client.stampsCount,
                              lastBooking: client.lastBooking,
                            })}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-sage-50 border border-sage-300 text-warm-800 text-xs font-bold shadow-xs"
                          >
                            <Mail className="w-3.5 h-3.5 text-sage-600" />
                            <span>Disparar Email</span>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* ── EMAIL TRIGGER MODAL ── */}
                {emailModalClient && (
                  <div className="p-5 rounded-3xl bg-sage-50 border-2 border-sage-300 space-y-4 shadow-md">
                    <div className="flex items-center justify-between border-b border-sage-200 pb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-sage-800" />
                        <div>
                          <h4 className="font-serif font-bold text-base text-warm-900">
                            Disparador de Correo CRM — {emailModalClient.name}
                          </h4>
                          <p className="text-xs text-warm-500">Preparado para envío con tu cliente de correo o Webmail Arsys.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEmailModalClient(null)}
                        className="text-xs font-bold text-warm-600 hover:text-warm-900"
                      >
                        Cerrar
                      </button>
                    </div>

                    {/* Template Selector */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'confirmation', label: '1. Confirmación de Cita' },
                        { key: 'reminder', label: '2. Recordatorio 24h' },
                        { key: 'loyalty_prize', label: '3. Premio 7º Servicio GRATIS' },
                      ].map(t => (
                        <button
                          key={t.key}
                          onClick={() => setEmailTemplate(t.key as typeof emailTemplate)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            emailTemplate === t.key
                              ? 'bg-[#16291F] text-white shadow-xs'
                              : 'bg-white text-warm-700 border border-sage-200 hover:bg-sage-100'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Email preview */}
                    <div className="space-y-2 bg-white p-4 rounded-2xl border border-sage-200 text-xs">
                      <div>
                        <span className="font-bold text-warm-500 block text-[10px] uppercase">Asunto:</span>
                        <span className="font-bold text-warm-900">{getEmailContent().subject}</span>
                      </div>
                      <div className="pt-2 border-t border-sage-100">
                        <span className="font-bold text-warm-500 block text-[10px] uppercase mb-1">Cuerpo del Mensaje:</span>
                        <pre className="whitespace-pre-wrap font-sans text-xs text-warm-800 leading-relaxed bg-[#FBF9F6] p-3 rounded-xl border border-sage-100">
                          {getEmailContent().body}
                        </pre>
                      </div>
                    </div>

                    {/* Email Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        onClick={handleCopyEmailBody}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-sage-50 text-warm-900 border border-sage-300 rounded-xl text-xs font-bold transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{emailCopySuccess ? '¡Texto Copiado!' : 'Copiar Plantilla de Correo'}</span>
                      </button>

                      <button
                        onClick={handleOpenMailClient}
                        className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#16291F] hover:bg-sage-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Abrir en Gmail / Correo</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── GMAIL PERSONAL & IDENTIDAD DEL ESTUDIO ── */}
                <div className="p-5 rounded-2xl bg-white border border-sage-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sage-800" />
                    <h4 className="font-serif font-bold text-base text-warm-900">Correo Personal de Contacto &amp; Notificaciones (Gmail)</h4>
                  </div>
                  <p className="text-xs text-warm-500">
                    Configura el correo Gmail personal de Andrea para el envío de confirmaciones y fidelización directa.
                  </p>

                  <form onSubmit={handleSaveEmailSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-bold text-warm-700 block mb-1">Correo Gmail de Andrea</label>
                      <input
                        type="email"
                        value={emailSettings.contactEmail}
                        onChange={e => setEmailSettings({ ...emailSettings, contactEmail: e.target.value })}
                        className={inputCls}
                        placeholder="andrealabradornails@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-warm-700 block mb-1">Nombre Comercial Remitente</label>
                      <input
                        type="text"
                        value={emailSettings.senderName}
                        onChange={e => setEmailSettings({ ...emailSettings, senderName: e.target.value })}
                        className={inputCls}
                        placeholder="Andrea Labrador Nails Studio"
                      />
                    </div>
                    <div className="sm:col-span-2 pt-1 flex items-center justify-between">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#16291F] hover:bg-sage-900 text-white font-bold text-xs shadow-xs"
                      >
                        Guardar Configuración Gmail
                      </button>
                      {emailSettingsSaved && (
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" /> Configuración de Gmail guardada con éxito
                        </span>
                      )}
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                TAB 5: TASA & RESPALDOS
            ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {sectionHead(
                  'Tasa de Cambio Oficial & Respaldos',
                  'Actualiza la tasa del dólar en Bolívares y gestiona tus copias de seguridad de datos.'
                )}

                <form onSubmit={handleSaveRate} className="p-5 rounded-2xl bg-sage-50 border border-sage-200 space-y-3">
                  <span className="text-xs font-bold text-warm-900 uppercase tracking-wider block">Tasa del Dólar (VES / USD)</span>
                  <p className="text-xs text-warm-500">
                    Se utiliza para calcular automáticamente el equivalente en Bolívares en el catálogo y en el mensaje de reserva a WhatsApp.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="relative w-44">
                      <input
                        type="number"
                        step="0.01"
                        value={currentRate}
                        onChange={e => setCurrentRate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-sage-200 text-warm-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 pr-10"
                      />
                      <span className="absolute right-3 top-2 text-xs text-warm-400">Bs</span>
                    </div>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-[#16291F] hover:bg-sage-900 text-white font-bold text-xs transition-all">
                      Actualizar
                    </button>
                    {rateSavedMessage && <span className="text-xs text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Guardado</span>}
                  </div>
                </form>

                <div className="p-5 rounded-2xl bg-white border border-sage-200 space-y-4">
                  <span className="text-xs font-bold text-warm-900 uppercase tracking-wider block">Copia de Seguridad de Datos</span>
                  <p className="text-xs text-warm-500 leading-relaxed">
                    Descarga una copia completa de tus citas, servicios, turnos y fidelización en formato JSON.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleExportJSON}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-warm-900 text-xs font-bold border border-sage-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Respaldo JSON</span>
                    </button>
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-warm-900 text-xs font-bold border border-sage-200 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Restaurar desde JSON</span>
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
