import React, { useState, useEffect } from 'react';
import {
  Shield, Layers, CheckCircle2, AlertTriangle, MessageSquare, FileText,
  Globe, Plus, RefreshCw, ExternalLink, Sparkles, Send, Check, XCircle,
  Clock, Server, Database, HardDrive, GitBranch, ArrowUpRight, Users,
  MapPin, DollarSign, Crown, Eye, Terminal, Activity, Lock, QrCode, Crosshair,
  Palette, Sliders, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DynamicQrManager } from './DynamicQrManager';
import { CentralCompetitors } from './CentralCompetitors';
import { SalonThemeStudio } from './SalonThemeStudio';
import {
  SALON_PALETTES,
  SALON_TYPOGRAPHIES,
  SALON_LAYOUTS,
  getSalonThemeConfig,
  saveSalonThemeConfig,
  getPaletteById,
  SalonPaletteId,
  SalonTypographyId,
  SalonCardLayoutId,
} from '../utils/salonThemeEngine';

interface CentralDashboardProps {
  onNavigateToTenant: (tenantSlug: string, openAdmin?: boolean) => void;
  onNavigateToSaaSLanding: () => void;
}

export const CentralDashboard: React.FC<CentralDashboardProps> = ({
  onNavigateToTenant,
  onNavigateToSaaSLanding,
}) => {
  const [activeTab, setActiveTab] = useState<'tenants' | 'sessions' | 'incidents' | 'mailbox' | 'tasks_roadmap' | 'docs' | 'qr' | 'competitors'>('tenants');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editingTenantThemeSlug, setEditingTenantThemeSlug] = useState<string | null>(null);

  const [data, setData] = useState<any>({
    tenants: [],
    sessions: [],
    tasks: [],
    incidents: [],
    mailbox: [],
    roadmap: [],
    docs: [],
    staff: [],
    zones: [],
    bookingStats: [],
    infrastructure: {},
  });

  // Session feedback state
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});

  // New Incident Form
  const [incTitle, setIncTitle] = useState('');
  const [incDesc, setIncDesc] = useState('');
  const [incSeverity, setIncSeverity] = useState<'critical' | 'high' | 'medium'>('critical');
  const [incZone, setIncZone] = useState('ZONA 2 · CENTRAL');
  const [incTenant, setIncTenant] = useState('all');

  // New Mailbox Message Form
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgPriority, setMsgPriority] = useState<'high' | 'normal'>('high');

  // New Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskZone, setTaskZone] = useState('ZONA 2 · CENTRAL');
  const [taskPriority, setTaskPriority] = useState('critical');

  // New / Edit Tenant 1-Click Wizard Form
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [tenantForm, setTenantForm] = useState({
    id: '',
    customSubdomain: '',
    businessName: '',
    niche: 'multi_studio',
    slogan: 'Excelencia, armonía y atención personalizada',
    ownerName: '',
    ownerEmail: '',
    whatsappPhone: '58424',
    instagramHandle: '@',
    city: 'San Cristóbal, Táchira',
    paletteId: 'rose-cashmere' as SalonPaletteId,
    typographyId: 'haute-couture' as SalonTypographyId,
    layoutId: 'editorial-magazine' as SalonCardLayoutId,
    primaryColor: '#9E475B',
    accentColor: '#C89B7B',
    loyaltyStampsTarget: 5,
    loyaltyRewardTitle: 'Ritual VIP de Cortesía 100% Gratis',
    monthlyFeeUsd: 29,
    initialZonesCsv: 'Cejas & Pestañas, Estilismo & Colorimetría, Cabina Facial & Spa',
    initialStaffCsv: 'Directora Principal, Especialista Senior',
  });

  // Selected Document Viewer
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const fetchCentralState = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/central');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.docs?.length > 0 && !selectedDoc) {
          setSelectedDoc(json.docs[0]);
        }
      }
    } catch (e) {
      console.error('Error loading Central:', e);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchCentralState();
  }, []);

  const postAction = async (action: string, payload: any) => {
    setSyncing(true);
    try {
      const res = await fetch('/api/central', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
      if (res.ok) {
        await fetchCentralState();
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleReviewSession = async (id: string, reviewStatus: 'approved' | 'changes_requested') => {
    const karc0Feedback = feedbackMap[id] || (reviewStatus === 'approved' ? 'Aprobado por karc0 en Central.' : 'Solicito ajustes.');
    await postAction('review_session', { id, reviewStatus, karc0Feedback });
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle.trim()) return;
    await postAction('create_incident', {
      severity: incSeverity,
      affectedZone: incZone,
      affectedTenant: incTenant,
      title: incTitle,
      description: incDesc,
    });
    setIncTitle('');
    setIncDesc('');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgSubject.trim() || !msgBody.trim()) return;
    await postAction('send_mailbox_message', {
      sender: 'karc0',
      recipient: 'antigravity',
      subject: msgSubject,
      body: msgBody,
      category: 'order',
      priority: msgPriority,
    });
    setMsgSubject('');
    setMsgBody('');
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    await postAction('upsert_task', {
      title: taskTitle,
      description: taskDesc,
      zone: taskZone,
      priority: taskPriority,
      status: 'pending',
      assignedTo: 'antigravity',
      dueLabel: 'Asignado desde Central',
    });
    setTaskTitle('');
    setTaskDesc('');
  };

  const handleSaveTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantForm.businessName.trim() || !tenantForm.customSubdomain.trim()) return;
    const chosenPalette = getPaletteById(tenantForm.paletteId);
    const slug = tenantForm.id || tenantForm.businessName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    // Save Author Theme Config immediately for this new salon
    saveSalonThemeConfig(slug, {
      tenantSlug: slug,
      salonName: tenantForm.businessName.trim(),
      tagline: `${tenantForm.niche === 'spa' ? 'Spa & Wellness' : 'Beauty Atelier'} · ${tenantForm.city}`,
      heroHeadline: tenantForm.businessName.trim(),
      heroSubheadline: tenantForm.slogan,
      paletteId: tenantForm.paletteId,
      typographyId: tenantForm.typographyId,
      layoutId: tenantForm.layoutId,
      whatsappPhone: tenantForm.whatsappPhone,
      instagramHandle: tenantForm.instagramHandle,
      addressLine: tenantForm.city,
      loyaltyStampsGoal: tenantForm.loyaltyStampsTarget,
      loyaltyRewardTitle: tenantForm.loyaltyRewardTitle,
      showVipPassport: true,
      showCurrencyDual: true,
    });

    const initialZones = tenantForm.initialZonesCsv
      .split(',')
      .map((z) => z.trim())
      .filter(Boolean)
      .map((name) => ({ name, description: `Área especializada de ${name}`, capacity: 2 }));
    const initialStaff = tenantForm.initialStaffCsv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((fullName, idx) => ({
        fullName,
        roleTitle: idx === 0 ? 'Directora & Master Artist' : 'Especialista Certificada',
        commissionPct: idx === 0 ? 100 : 50,
      }));
    await postAction('create_tenant_wizard', {
      ...tenantForm,
      id: slug,
      primaryColor: chosenPalette.primary,
      accentColor: chosenPalette.secondary,
      initialZones,
      initialStaff,
    });
    setShowTenantModal(false);
  };

  const openIncidentsCount = (data.incidents || []).filter((i: any) => i.status !== 'resolved').length;
  const pendingSessionsCount = (data.sessions || []).filter((s: any) => s.review_status === 'pending_review').length;
  const pendingTasksCount = (data.tasks || []).filter((t: any) => t.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#1E181A] font-sans selection:bg-[#9E475B]/15 selection:text-[#9E475B] overflow-x-hidden">
      {/* VERTIX-STYLE LUMINOUS FLOATING CAPSULE TOP HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#1E181A]/8 bg-[#F6F5F2]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm shrink-0 text-white font-display font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, #B85D6F 0%, #D48C70 52%, #E6B89C 100%)' }}
              >
                V
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9E475B]">
                    VANESEV &bull; SUPER ADMIN CENTRAL
                  </span>
                  <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    ● NEON DB LIVE
                  </span>
                </div>
                <h1 className="font-display text-base sm:text-xl font-bold tracking-tight text-[#1E181A] truncate">
                  Dirección General de Clientes, Cartas &amp; Gobernanza (karc0)
                </h1>
              </div>
            </div>
            <button
              onClick={fetchCentralState}
              disabled={syncing}
              className="lg:hidden p-2.5 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#1E181A]/10 text-[#1E181A] shrink-0"
              title="Sincronizar con Neon DB"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-[#9E475B]' : ''}`} />
            </button>
          </div>

          {/* Quick Jump Capsule Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap pb-0.5 lg:pb-0">
            <button
              onClick={() => {
                setActiveTab('tenants');
                setShowTenantModal(true);
              }}
              className="px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 100%)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo Cliente / Salón
            </button>
            <button
              onClick={() => onNavigateToTenant('capra-studio', false)}
              className="px-3.5 py-2 rounded-full text-xs font-bold bg-white hover:bg-[#FAF0F2] text-[#9E475B] border border-[#9E475B]/25 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Carta Capra Studio
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateToTenant('capra-studio', true)}
              className="px-3.5 py-2 rounded-full text-xs font-bold bg-white hover:bg-[#FAF7F2] text-[#1E181A] border border-[#1E181A]/10 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              Admin Capra Studio
            </button>
            <button
              onClick={onNavigateToSaaSLanding}
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#1E181A] hover:bg-[#33292C] text-white flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#E6B89C]" />
              Web Comercial vanesev.com
            </button>
            <button
              onClick={fetchCentralState}
              disabled={syncing}
              className="hidden lg:inline-flex p-2.5 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#1E181A]/10 text-[#1E181A] shrink-0 cursor-pointer shadow-2xs"
              title="Sincronizar con Neon DB"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-[#9E475B]' : ''}`} />
            </button>
          </div>
        </div>

        {/* FLOATING CAPSULE NAVIGATION PILL BAR */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 flex overflow-x-auto no-scrollbar gap-1.5">
          {[
            { id: 'tenants', label: 'Salones & Fichas de Clientes', icon: Crown, badge: (data.tenants || []).length },
            { id: 'qr', label: 'Motor QR & Escaneos', icon: QrCode, badge: 0 },
            { id: 'competitors', label: 'Radar Competidores', icon: Crosshair, badge: 4 },
            { id: 'sessions', label: 'Auditoría Sesiones', icon: CheckCircle2, badge: pendingSessionsCount },
            { id: 'tasks_roadmap', label: 'Tareas & Arquitectura', icon: Layers, badge: pendingTasksCount },
            { id: 'mailbox', label: 'Buzón karc0 ↔ Agente', icon: MessageSquare, badge: (data.mailbox || []).length },
            { id: 'incidents', label: 'Incidencias', icon: AlertTriangle, badge: openIncidentsCount, alert: true },
            { id: 'docs', label: 'Documentación', icon: FileText, badge: (data.docs || []).length },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-[#1E181A] text-white shadow-xs'
                    : 'bg-white text-[#6E6266] hover:text-[#1E181A] border border-[#1E181A]/8'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.alert && tab.badge > 0 ? 'text-rose-500' : active ? 'text-[#E6B89C]' : 'text-[#9A8C90]'}`} />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                      tab.alert
                        ? 'bg-rose-100 text-rose-800'
                        : active
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FAF7F2] text-[#6E6266]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7 space-y-7">
        {/* VERTIX EXECUTIVE HERO SUMMARY BENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <motion.div
            whileHover={{ y: -3 }}
            className="lg:col-span-7 rounded-[32px] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[210px]"
            style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 52%, #E2A889 100%)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em]">
                  <Crown className="w-3.5 h-3.5" /> Super-Admin Multi-Sede VANESEV
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold mt-3 tracking-tight">
                  Control Total de Clientes, Diseño &amp; QR
                </h2>
                <p className="text-xs sm:text-sm text-white/90 mt-1.5 max-w-xl leading-relaxed">
                  Crea nuevos salones en segundos, personaliza su paleta de colores y tipografía en vivo, o entra directamente a su panel administrativo para asistirles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('tenants');
                  setShowTenantModal(true);
                }}
                className="px-4 py-2.5 rounded-full bg-white text-[#1E181A] text-xs font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-1.5 shrink-0 self-start cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#9E475B]" />
                <span>Alta de Nuevo Salón</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-5 mt-5 border-t border-white/20 relative z-10">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/75 block">Salones Activos</span>
                <span className="font-display text-2xl font-bold">{(data.tenants || []).length} Sedes</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/75 block">Especialistas Red</span>
                <span className="font-display text-2xl font-bold">{(data.staff || []).length} Pros</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/75 block">Cabinas &amp; Áreas</span>
                <span className="font-display text-2xl font-bold">{(data.zones || []).length} Zonas</span>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => {
                setActiveTab('tenants');
                setEditingTenantThemeSlug('capra-studio');
              }}
              className="bg-white rounded-[28px] p-5 border border-[#1E181A]/8 shadow-xs flex flex-col justify-between cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#FAF0F2] text-[#9E475B]">
                <Palette className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A8C90] block">
                  Diseño &amp; Identidad
                </span>
                <p className="font-display text-lg font-bold text-[#1E181A] mt-0.5">
                  Studio de Temas
                </p>
                <span className="text-xs font-semibold text-[#9E475B] mt-1 inline-block">
                  Editar paletas de clientes &rarr;
                </span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => setActiveTab('qr')}
              className="bg-white rounded-[28px] p-5 border border-[#1E181A]/8 shadow-xs flex flex-col justify-between cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#FBF6EE] text-[#A67B5B]">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A8C90] block">
                  Enrutamiento `/m/`
                </span>
                <p className="font-display text-lg font-bold text-[#1E181A] mt-0.5">
                  Generador QR
                </p>
                <span className="text-xs font-semibold text-[#A67B5B] mt-1 inline-block">
                  Gestionar códigos QR &rarr;
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center rounded-[32px] bg-white border border-[#1E181A]/8 shadow-xs">
            <RefreshCw className="w-8 h-8 text-[#9E475B] animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#6E6266]">Sincronizando ecosistema de salones desde Neon Postgres 18...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: REVISIÓN DE SESIONES & APROBACIÓN DE KARC0 */}
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-amber-200 shadow-xs">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-bold">
                      AUDITORÍA PAUSADA & APROBACIÓN EJECUTIVA
                    </span>
                    <h2 className="text-xl font-bold text-[#0F172A] mt-1">
                      Bitácora de Sesiones de Antigravity (Persistida en Neon DB)
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Aquí te dejo cargado cada elemento construido, decisiones tomadas y archivos modificados en cada sesión. Puedes revisarlo con calma, dejarme tus instrucciones y pulsar <b>Aprobar</b> o <b>Pedir Cambios</b>.
                    </p>
                  </div>
                </div>

                {(data.sessions || []).map((ses: any) => {
                  const elements = Array.isArray(ses.elements_built) ? ses.elements_built : [];
                  const decisions = Array.isArray(ses.decisions_logged) ? ses.decisions_logged : [];
                  const isApproved = ses.review_status === 'approved';
                  const isChanges = ses.review_status === 'changes_requested';

                  return (
                    <div key={ses.id} className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden shadow-xs">
                      <div className="p-6 border-b border-[#E2E8F0] flex flex-wrap items-start justify-between gap-4 bg-[#F8FAFC]">
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5 mb-2">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200">
                              ID: {ses.id}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200">
                              Agente: {ses.agent_name}
                            </span>
                            <span
                              className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                isApproved
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : isChanges
                                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {isApproved ? '✓ APROBADA POR KARC0' : isChanges ? '⚠ CAMBIOS SOLICITADOS' : '⏳ PENDIENTE DE TU REVISIÓN'}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">{ses.title}</h3>
                          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{ses.summary}</p>
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Elements Built */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-800 font-bold">
                            Elementos Construidos y Entregados en esta Sesión
                          </h4>
                          <div className="space-y-2">
                            {elements.map((el: any, i: number) => (
                              <div key={i} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
                                <span className="text-sm text-slate-800 font-medium">{el.item}</span>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                                  {el.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Decisions Logged */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-800 font-bold">
                            Decisiones Arquitectónicas Registradas
                          </h4>
                          <div className="space-y-2">
                            {decisions.map((dec: any, i: number) => (
                              <div key={i} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                                <p className="text-sm font-bold text-[#0F172A]">{dec.decision}</p>
                                <p className="text-xs text-slate-600 mt-1">{dec.rationale}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Karc0 Review & Response Box */}
                      <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs font-mono uppercase tracking-wider text-amber-900 font-bold">
                            Tu Respuesta / Instrucciones sobre esta Sesión (Se guarda en Neon DB para el Agente):
                          </label>
                          {ses.karc0_feedback && (
                            <span className="text-xs text-emerald-700 font-mono">
                              Última nota guardada: "{ses.karc0_feedback}"
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            value={feedbackMap[ses.id] ?? ses.karc0_feedback ?? ''}
                            onChange={(e) => setFeedbackMap({ ...feedbackMap, [ses.id]: e.target.value })}
                            placeholder="Escribe aquí tus observaciones, qué aprobar o qué ajustar en la siguiente sesión..."
                            className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReviewSession(ses.id, 'approved')}
                              className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
                            >
                              <Check className="w-4 h-4" />
                              Aprobar Sesión
                            </button>
                            <button
                              onClick={() => handleReviewSession(ses.id, 'changes_requested')}
                              className="px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                              Pedir Cambios
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: BUZÓN DE EMERGENCIA (REPORTE INMEDIATO DE FALLOS EN VIVO) */}
            {activeTab === 'incidents' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-4 h-fit">
                  <div className="flex items-center gap-2 text-rose-700">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <h3 className="text-base font-bold uppercase tracking-wider text-[#0F172A]">Reportar Fallo o Emergencia</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Si mientras pruebas desde tu móvil o PC ves cualquier detalle que falle o quieras corregir al instante, anótalo aquí. Queda grabado en Neon DB como prioridad máxima.
                  </p>
                  <form onSubmit={handleCreateIncident} className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Severidad</label>
                      <select
                        value={incSeverity}
                        onChange={(e) => setIncSeverity(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-sm text-[#0F172A] focus:bg-white"
                      >
                        <option value="critical">🔥 Crítica (Atacar de inmediato)</option>
                        <option value="high">⚡ Alta (Corregir en la sesión actual)</option>
                        <option value="medium">🔧 Media (Ajuste visual o funcional)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Zona Afectada</label>
                      <select
                        value={incZone}
                        onChange={(e) => setIncZone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-sm text-[#0F172A] focus:bg-white"
                      >
                        <option value="ZONA 1 · LANDING VANESEV">ZONA 1 · Web Comercial vanesev.com</option>
                        <option value="ZONA 2 · CENTRAL">ZONA 2 · Panel Central de karc0</option>
                        <option value="ZONA 3 · ADMIN PRO V2">ZONA 3 · Admin Pro V2 del Salón</option>
                        <option value="ZONA 4 · CATÁLOGO & FICHA VIP">ZONA 4 · Catálogo & Ficha VIP Cliente</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Negocio / Salón</label>
                      <select
                        value={incTenant}
                        onChange={(e) => setIncTenant(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-sm text-[#0F172A] focus:bg-white"
                      >
                        <option value="all">Todos / Plataforma General</option>
                        <option value="capra-studio">Capra Studio (@caprastudio_)</option>
                        <option value="andrea-nails">Andrea Labrador Nails</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Título corto del fallo</label>
                      <input
                        type="text"
                        required
                        value={incTitle}
                        onChange={(e) => setIncTitle(e.target.value)}
                        placeholder="Ej: Botón de reserva en móvil no abre..."
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Detalle de lo que viste</label>
                      <textarea
                        rows={3}
                        value={incDesc}
                        onChange={(e) => setIncDesc(e.target.value)}
                        placeholder="Describe qué hiciste y qué debería pasar..."
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
                    >
                      Registrar en Buzón de Emergencia
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-[#0F172A]">Historial de Incidencias & Errores Solucionados</h3>
                  {(data.incidents || []).map((inc: any) => (
                    <div
                      key={inc.id}
                      className={`p-5 rounded-2xl border ${
                        inc.status === 'resolved'
                          ? 'bg-white border-[#E2E8F0]'
                          : 'bg-rose-50/60 border-rose-300'
                      } space-y-3 shadow-xs`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase font-bold ${
                              inc.status === 'resolved'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {inc.status === 'resolved' ? '✓ SOLUCIONADO' : '🔥 ABIERTO · ' + inc.severity}
                          </span>
                          <span className="text-xs font-mono text-slate-500">{inc.affected_zone}</span>
                          <span className="text-xs font-mono text-amber-800">({inc.affected_tenant})</span>
                        </div>
                        {inc.status !== 'resolved' && (
                          <button
                            onClick={() => postAction('update_incident', { id: inc.id, status: 'resolved', resolutionNote: 'Marcado como resuelto desde Central.' })}
                            className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                          >
                            Marcar Resuelto
                          </button>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-[#0F172A]">{inc.title}</h4>
                      <p className="text-sm text-slate-600">{inc.description}</p>
                      {inc.agent_resolution_note && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                          <b>Solución aplicada por Agente:</b> {inc.agent_resolution_note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: BUZÓN INTERACTIVO KARC0 <-> AGENTE */}
            {activeTab === 'mailbox' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-4 h-fit">
                  <div className="flex items-center gap-2 text-amber-800">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                    <h3 className="text-base font-bold uppercase tracking-wider text-[#0F172A]">Dejar Orden o Nota al Agente</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Escribe aquí cualquier idea, requerimiento, cambio de precios o instrucción mientras navegas. Cuando abras sesión conmigo y me digas <i>"lee el buzón de Central"</i>, lo tendré todo cargado al instante.
                  </p>
                  <form onSubmit={handleSendMessage} className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Asunto / Tema</label>
                      <input
                        type="text"
                        required
                        value={msgSubject}
                        onChange={(e) => setMsgSubject(e.target.value)}
                        placeholder="Ej: Nuevos servicios para Capra Studio..."
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Prioridad</label>
                      <select
                        value={msgPriority}
                        onChange={(e) => setMsgPriority(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-sm text-[#0F172A]"
                      >
                        <option value="high">Alta Prioridad</option>
                        <option value="normal">Normal / Idea futura</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Mensaje detallado para Antigravity</label>
                      <textarea
                        rows={4}
                        required
                        value={msgBody}
                        onChange={(e) => setMsgBody(e.target.value)}
                        placeholder="Escribe aquí todo lo que quieras que ejecute..."
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <Send className="w-4 h-4" />
                      Guardar en Buzón de Neon DB
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-[#0F172A]">Bandeja de Comunicaciones (karc0 ↔ Antigravity)</h3>
                  {(data.mailbox || []).map((m: any) => {
                    const fromKarc0 = m.sender === 'karc0';
                    return (
                      <div
                        key={m.id}
                        className={`p-5 rounded-2xl border ${
                          fromKarc0
                            ? 'bg-amber-50/70 border-amber-300'
                            : 'bg-white border-[#E2E8F0]'
                        } space-y-2 shadow-xs`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase ${
                                fromKarc0 ? 'bg-amber-500 text-white' : 'bg-purple-50 text-purple-800 border border-purple-200'
                              }`}
                            >
                              {fromKarc0 ? '👑 DE: KARC0 (DIRECTOR)' : '🤖 DE: ANTIGRAVITY'}
                            </span>
                            <span className="text-xs font-mono text-slate-500">→ PARA: {m.recipient.toUpperCase()}</span>
                          </div>
                          <span className="text-xs font-mono text-slate-400">
                            {new Date(m.created_at).toLocaleString('es-VE')}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-[#0F172A]">{m.subject}</h4>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{m.body}</p>
                        {m.related_doc_path && (
                          <p className="text-xs font-mono text-amber-800 pt-1">
                            📄 Doc vinculado: {m.related_doc_path}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: TAREAS PENDIENTES, CRONOGRAMA DE LANZAMIENTO & ARQUITECTURA */}
            {activeTab === 'tasks_roadmap' && (
              <div className="space-y-8">
                {/* ARCHITECTURE COMPARISON: ACTUAL VS PROYECTADA */}
                <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold">
                        MAPA DE INGENIERÍA EN VIVO
                      </span>
                      <h3 className="text-xl font-bold text-[#0F172A]">Estructura Actual vs. Proyectada de las 4 Zonas</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      {
                        zone: 'ZONA 1 · COMERCIAL',
                        title: 'Web de Venta vanesev.com',
                        status: 'OPERATIVA EN STAGING',
                        desc: 'Landing SaaS de autor para captar salones, barberías y clínicas estéticas en Venezuela con acceso directo a demos.',
                      },
                      {
                        zone: 'ZONA 2 · CENTRAL',
                        title: 'Super-Admin de karc0 (/central)',
                        status: '100% OPERATIVA EN NEON',
                        desc: 'Revisión de sesiones, buzón de emergencia, buzón interactivo, tareas, documentación y creador de salones con subdominio.',
                      },
                      {
                        zone: 'ZONA 3 · ADMIN PRO V2',
                        title: 'ERP del Salón (/admin)',
                        status: '100% OPERATIVA EN NEON',
                        desc: 'Agenda, Finanzas USD/Bs BCV, Personal y Comisiones (staff_members), Zonas (studio_zones) y Fidelización de 5 sellos.',
                      },
                      {
                        zone: 'ZONA 4 · PWA & FICHA VIP',
                        title: 'Catálogo + App de Clienta',
                        status: '100% OPERATIVA EN NEON',
                        desc: 'Perfiles de Andrea Labrador V2 y Capra Studio (6 áreas + Cursos) con Ficha VIP conectada a citas reales y guía visual.',
                      },
                    ].map((z, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold">{z.zone}</span>
                          <h4 className="text-base font-bold text-[#0F172A] mt-1">{z.title}</h4>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{z.desc}</p>
                        </div>
                        <span className="inline-block w-fit px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ● {z.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TASKS BACKLOG + ADD TASK */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4 h-fit">
                    <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-wider">Agregar Tarea Pendiente</h3>
                    <form onSubmit={handleCreateTask} className="space-y-3">
                      <input
                        type="text"
                        required
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Título de la tarea..."
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] focus:border-amber-500"
                      />
                      <select
                        value={taskZone}
                        onChange={(e) => setTaskZone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-sm text-[#0F172A]"
                      >
                        <option value="ZONA 2 · CENTRAL">ZONA 2 · CENTRAL</option>
                        <option value="ZONA 4 · CAPRA STUDIO">ZONA 4 · CAPRA STUDIO</option>
                        <option value="ZONA 3 · ANDREA V2">ZONA 3 · ANDREA V2</option>
                        <option value="ZONA 1 · WEB COMERCIAL">ZONA 1 · WEB COMERCIAL</option>
                        <option value="INFRAESTRUCTURA CLOUD">INFRAESTRUCTURA CLOUD</option>
                      </select>
                      <select
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-sm text-[#0F172A]"
                      >
                        <option value="critical">Prioridad Crítica</option>
                        <option value="high">Prioridad Alta</option>
                        <option value="medium">Prioridad Media</option>
                      </select>
                      <textarea
                        rows={3}
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                        placeholder="Especificaciones para el agente..."
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-xs"
                      >
                        Guardar Tarea en Neon DB
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-[#0F172A]">Tablero de Tareas Pendientes & Cronograma</h3>
                    {(data.tasks || []).map((t: any) => (
                      <div key={t.id} className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200">{t.zone}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-700">
                              Resp: {t.assigned_to}
                            </span>
                            <span className="text-xs font-mono text-emerald-700">{t.due_label}</span>
                          </div>
                          <h4 className="text-sm font-bold text-[#0F172A]">{t.title}</h4>
                          <p className="text-xs text-slate-600">{t.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={t.status}
                            onChange={(e) => postAction('upsert_task', { ...t, assignedTo: t.assigned_to, dueLabel: t.due_label, karc0Notes: t.karc0_notes, status: e.target.value })}
                            className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#0F172A]"
                          >
                            <option value="pending">⏳ Pendiente</option>
                            <option value="in_progress">⚡ En Curso</option>
                            <option value="completed">✓ Completada</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SALONES (TENANTS), FICHAS DE CLIENTES & PERSONALIZADOR DE TEMAS */}
            {activeTab === 'tenants' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-[28px] border border-[#1E181A]/8 shadow-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E475B] block mb-1">
                      GOBERNADOR MULTI-SEDE &bull; LIBERTAD ABSOLUTA DE EDICIÓN
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1E181A]">
                      Salones Activos, Fichas de Clientes &amp; Diseño de Cartas
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6E6266] mt-1">
                      Crea nuevos clientes, edita su paleta de colores y tipografía en vivo, o entra directamente a su Admin para gestionar sus servicios, citas y equipo.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTenantModal(true)}
                    className="px-5 py-3 rounded-full text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer hover:opacity-95"
                    style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 100%)' }}
                  >
                    <Plus className="w-4 h-4" />
                    Crear Nuevo Salón / Cliente
                  </button>
                </div>

                {/* EMBEDDED SALON THEME STUDIO WHEN EDITING A CLIENT'S DESIGN */}
                {editingTenantThemeSlug && (
                  <div className="bg-white rounded-[32px] border-2 border-[#9E475B]/25 shadow-xl p-6 sm:p-8 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1E181A]/10">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 rounded-full bg-[#FAF0F2] text-[#9E475B] text-[10px] font-bold uppercase tracking-widest">
                          Modo Super-Admin &bull; Edición en Vivo
                        </span>
                        <span className="text-xs font-mono text-[#6E6266]">
                          Sede: <strong>{editingTenantThemeSlug}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onNavigateToTenant(editingTenantThemeSlug, true)}
                          className="px-4 py-2 rounded-full bg-[#1E181A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Ir al Admin Completo de esta Sede</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTenantThemeSlug(null)}
                          className="p-2 rounded-full bg-[#FAF7F2] hover:bg-rose-50 text-[#1E181A] hover:text-rose-700 border border-[#1E181A]/10 cursor-pointer"
                          title="Cerrar editor de diseño"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <SalonThemeStudio
                      tenantSlug={editingTenantThemeSlug}
                      onOpenPublicCatalog={() => onNavigateToTenant(editingTenantThemeSlug, false)}
                      onSaved={() => fetchCentralState()}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(data.tenants || []).map((ten: any) => {
                    const tenantStaff = (data.staff || []).filter((s: any) => s.tenant_id === ten.id);
                    const tenantZones = (data.zones || []).filter((z: any) => z.tenant_id === ten.id);
                    const liveTheme = getSalonThemeConfig(ten.id);
                    const livePalette = getPaletteById(liveTheme.paletteId);
                    const isLegacyAndrea = ten.id === 'andrea-nails';

                    return (
                      <motion.div
                        key={ten.id}
                        whileHover={{ y: -3 }}
                        className="rounded-[28px] bg-white border border-[#1E181A]/8 shadow-xs overflow-hidden flex flex-col justify-between"
                      >
                        <div className="p-6 space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3.5">
                              <div
                                className="w-13 h-13 rounded-2xl flex items-center justify-center font-display font-bold text-lg text-white shadow-md shrink-0"
                                style={{ background: isLegacyAndrea ? '#16291F' : livePalette.heroGradient }}
                              >
                                {(liveTheme.salonName || ten.business_name).slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-display text-lg font-bold text-[#1E181A]">
                                    {liveTheme.salonName || ten.business_name}
                                  </h3>
                                  {isLegacyAndrea ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                                      Cliente Externo Aislado
                                    </span>
                                  ) : (
                                    <span
                                      className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                                      style={{ backgroundColor: livePalette.badgeBg, color: livePalette.badgeText }}
                                    >
                                      Paleta: {livePalette.name}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#6E6266] mt-0.5">
                                  {ten.owner_name} &bull; {liveTheme.instagramHandle || ten.instagram_handle} &bull; +{liveTheme.whatsappPhone || ten.whatsapp_phone}
                                </p>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {ten.subscription_status}
                            </span>
                          </div>

                          <p className="text-xs text-[#6E6266] italic">
                            &ldquo;{liveTheme.heroSubheadline || ten.slogan}&rdquo;
                          </p>

                          {/* Clean QR Route & Subdomain */}
                          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#1E181A]/8 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E475B] block">
                              Rutas Activas (Generador QR `/m/` &amp; Subdominio):
                            </span>
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#1E181A]">
                              <span className="font-bold">vanesev.com/m/{ten.id}</span>
                              <span className="text-[#9A8C90]">|</span>
                              <span>{ten.custom_subdomain}.vanesev.com</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2.5 text-center">
                            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#1E181A]/6">
                              <p className="text-[10px] text-[#9A8C90] uppercase font-bold">Equipo</p>
                              <p className="text-sm font-bold text-[#1E181A] mt-0.5">{tenantStaff.length} Pros</p>
                            </div>
                            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#1E181A]/6">
                              <p className="text-[10px] text-[#9A8C90] uppercase font-bold">Cabinas</p>
                              <p className="text-sm font-bold text-[#1E181A] mt-0.5">{tenantZones.length} Áreas</p>
                            </div>
                            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#1E181A]/6">
                              <p className="text-[10px] text-[#9A8C90] uppercase font-bold">Pasaporte VIP</p>
                              <p className="text-sm font-bold text-[#9E475B] mt-0.5">
                                {liveTheme.loyaltyStampsGoal || ten.loyalty_stamps_target} Visitas
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#FAF7F2] border-t border-[#1E181A]/8 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingTenantThemeSlug(ten.id)}
                            className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#FAF0F2] border border-[#9E475B]/30 text-[#9E475B] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                          >
                            <Palette className="w-3.5 h-3.5" />
                            <span>Diseño &amp; Ficha</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigateToTenant(ten.id, true)}
                            className="py-2.5 px-3 rounded-xl bg-[#1E181A] hover:bg-[#33292C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                          >
                            <Sliders className="w-3.5 h-3.5 text-[#E6B89C]" />
                            <span>Entrar al Admin</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigateToTenant(ten.id, false)}
                            className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#1E181A]/12 text-[#1E181A] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#9E475B]" />
                            <span>Carta Pública</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {showTenantModal && (
                  <div className="fixed inset-0 z-50 bg-[#1E181A]/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border border-[#1E181A]/10 rounded-[32px] max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E475B] block">
                            ALTA DE CLIENTE MULTI-TENANT &bull; SIN PLANTILLAS HEREDADAS
                          </span>
                          <h3 className="font-display text-xl font-bold text-[#1E181A] mt-1">
                            Crear Nuevo Salón con Identidad de Autor Propia
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowTenantModal(false)}
                          className="p-2 rounded-full bg-[#FAF7F2] text-[#6E6266] hover:text-[#1E181A] cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveTenant} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-xs font-bold text-[#1E181A] block mb-1">Nombre del Salón / Clínica</label>
                            <input
                              type="text"
                              required
                              value={tenantForm.businessName}
                              onChange={(e) => {
                                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                                setTenantForm({ ...tenantForm, businessName: e.target.value, id: slug, customSubdomain: slug.replace(/-/g, '') });
                              }}
                              placeholder="Ej: Lumière Hair & Spa"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#1E181A]/12 text-sm text-[#1E181A] font-medium"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-[#1E181A] block mb-1">Ruta QR (`/m/slug`) y Subdominio</label>
                            <input
                              type="text"
                              required
                              value={tenantForm.customSubdomain}
                              onChange={(e) => setTenantForm({ ...tenantForm, customSubdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                              placeholder="lumierespa"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#1E181A]/12 text-sm text-[#9E475B] font-mono font-bold"
                            />
                          </div>
                        </div>

                        {/* Selector de Paleta de Autor */}
                        <div>
                          <label className="text-xs font-bold text-[#1E181A] block mb-2">
                            Selecciona la Paleta de Color del Salón (Modificable luego por la clienta):
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {SALON_PALETTES.map((pal) => {
                              const selected = tenantForm.paletteId === pal.id;
                              return (
                                <button
                                  key={pal.id}
                                  type="button"
                                  onClick={() =>
                                    setTenantForm({
                                      ...tenantForm,
                                      paletteId: pal.id,
                                      primaryColor: pal.primary,
                                      accentColor: pal.secondary,
                                    })
                                  }
                                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                    selected
                                      ? 'border-[#1E181A] bg-[#FAF7F2] shadow-xs ring-2 ring-[#1E181A]/10'
                                      : 'border-[#1E181A]/10 bg-white hover:border-[#1E181A]/30'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: pal.bgPrimary }} />
                                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: pal.primary }} />
                                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: pal.secondary }} />
                                  </div>
                                  <p className="text-xs font-bold text-[#1E181A]">{pal.name}</p>
                                  <p className="text-[10px] text-[#6E6266] truncate">{pal.subtitle}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Selector de Tipografía y Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-xs font-bold text-[#1E181A] block mb-1">Tipografía Editorial</label>
                            <select
                              value={tenantForm.typographyId}
                              onChange={(e) => setTenantForm({ ...tenantForm, typographyId: e.target.value as SalonTypographyId })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#1E181A]/12 text-xs font-bold text-[#1E181A]"
                            >
                              {SALON_TYPOGRAPHIES.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-[#1E181A] block mb-1">Disposición de Tarjetas</label>
                            <select
                              value={tenantForm.layoutId}
                              onChange={(e) => setTenantForm({ ...tenantForm, layoutId: e.target.value as SalonCardLayoutId })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#1E181A]/12 text-xs font-bold text-[#1E181A]"
                            >
                              {SALON_LAYOUTS.map((l) => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-xs font-bold text-[#1E181A] block mb-1">Directora / Propietaria</label>
                            <input
                              type="text"
                              value={tenantForm.ownerName}
                              onChange={(e) => setTenantForm({ ...tenantForm, ownerName: e.target.value })}
                              placeholder="Nombre y Apellido"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#1E181A]/12 text-sm text-[#1E181A]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-[#1E181A] block mb-1">WhatsApp de Recepción (con código país)</label>
                            <input
                              type="text"
                              value={tenantForm.whatsappPhone}
                              onChange={(e) => setTenantForm({ ...tenantForm, whatsappPhone: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#1E181A]/12 text-sm text-[#1E181A]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-[#1E181A] block mb-1">Propuesta de Valor / Slogan de Portada</label>
                          <input
                            type="text"
                            value={tenantForm.slogan}
                            onChange={(e) => setTenantForm({ ...tenantForm, slogan: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#1E181A]/12 text-sm text-[#1E181A]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-xs font-bold text-[#1E181A] block mb-1">
                              Áreas / Cabinas Iniciales (separadas por coma)
                            </label>
                            <input
                              type="text"
                              value={tenantForm.initialZonesCsv}
                              onChange={(e) => setTenantForm({ ...tenantForm, initialZonesCsv: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#1E181A]/12 text-xs text-[#1E181A]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-[#1E181A] block mb-1">
                              Especialistas Iniciales (separadas por coma)
                            </label>
                            <input
                              type="text"
                              value={tenantForm.initialStaffCsv}
                              onChange={(e) => setTenantForm({ ...tenantForm, initialStaffCsv: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#1E181A]/12 text-xs text-[#1E181A]"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#1E181A]/10">
                          <button
                            type="button"
                            onClick={() => setShowTenantModal(false)}
                            className="px-5 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F0EBE3] text-[#1E181A] text-xs font-bold cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 100%)' }}
                          >
                            Crear Salón + Diseño + Equipo en 1 Clic
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: DOCUMENTACIÓN COMPARTIDA SINCRONIZADA CON ESCRITORIO */}
            {activeTab === 'docs' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-wider">
                    Documentos en `Desktop\vanesev app`
                  </h3>
                  {(data.docs || []).map((doc: any) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedDoc?.id === doc.id
                          ? 'bg-amber-50/80 border-amber-500 text-[#0F172A] ring-1 ring-amber-500/20'
                          : 'bg-white border-[#E2E8F0] text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase text-amber-800 font-bold">{doc.category} · {doc.version}</span>
                      <h4 className="text-sm font-bold mt-1 text-[#0F172A]">{doc.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{doc.summary}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-2 truncate">{doc.local_path}</p>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  {selectedDoc ? (
                    <div className="space-y-4">
                      <div className="border-b border-[#E2E8F0] pb-4">
                        <span className="text-xs font-mono text-amber-800 font-semibold">{selectedDoc.local_path}</span>
                        <h3 className="text-xl font-bold text-[#0F172A] mt-1">{selectedDoc.title}</h3>
                      </div>
                      <pre className="text-xs sm:text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0] max-h-[600px] overflow-y-auto">
                        {selectedDoc.content_markdown}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Selecciona un documento a la izquierda para inspeccionarlo.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 7: MOTOR QR DINÁMICO & ANALÍTICA DE ESCANEOS */}
            {activeTab === 'qr' && (
              <DynamicQrManager
                tenantSlug="all"
                tenantName="VANESEV Central (Todos los Salones)"
              />
            )}

            {/* TAB 8: RADAR DE COMPETIDORES & GUERRA COMERCIAL */}
            {activeTab === 'competitors' && (
              <CentralCompetitors />
            )}
          </>
        )}
      </main>
    </div>
  );
};
