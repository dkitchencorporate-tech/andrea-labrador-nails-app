import React, { useState, useEffect } from 'react';
import {
  Shield, Layers, CheckCircle2, AlertTriangle, MessageSquare, FileText,
  Globe, Plus, RefreshCw, ExternalLink, Sparkles, Send, Check, XCircle,
  Clock, Server, Database, HardDrive, GitBranch, ArrowUpRight, Users,
  MapPin, DollarSign, Crown, Eye, Terminal, Activity, Lock
} from 'lucide-react';

interface CentralDashboardProps {
  onNavigateToTenant: (tenantSlug: string, openAdmin?: boolean) => void;
  onNavigateToSaaSLanding: () => void;
}

export const CentralDashboard: React.FC<CentralDashboardProps> = ({
  onNavigateToTenant,
  onNavigateToSaaSLanding,
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'incidents' | 'mailbox' | 'tasks_roadmap' | 'tenants' | 'docs'>('sessions');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
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
    primaryColor: '#B5838D',
    accentColor: '#C5A059',
    loyaltyStampsTarget: 5,
    loyaltyRewardTitle: 'Servicio VIP 100% GRATIS',
    monthlyFeeUsd: 29,
    initialZonesCsv: 'Cejas & Pestañas, Estilismo & Peluquería, Manicure & Spa',
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
      initialZones,
      initialStaff,
    });
    setShowTenantModal(false);
  };

  const openIncidentsCount = (data.incidents || []).filter((i: any) => i.status !== 'resolved').length;
  const pendingSessionsCount = (data.sessions || []).filter((s: any) => s.review_status === 'pending_review').length;
  const pendingTasksCount = (data.tasks || []).filter((t: any) => t.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* TOP COMMAND HEADER */}
      <header className="sticky top-0 z-40 border-b border-amber-500/20 bg-[#09090D]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-lg shadow-amber-500/15">
              <div className="w-full h-full bg-[#09090D] rounded-[11px] flex items-center justify-center">
                <span className="font-serif font-black text-xl bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                  V
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-bold">
                  VANESEV · CENTRAL
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ● LIVE DB (POSTGRES 18)
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Centro de Mando & Gobernanza de karc0
              </h1>
            </div>
          </div>

          {/* Quick Jump Switcher to Live Environments */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateToTenant('capra-studio', false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#B5838D]/20 hover:bg-[#B5838D]/35 text-[#F4E1E6] border border-[#C5A059]/40 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Ver Capra Studio
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateToTenant('capra-studio', true)}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all"
            >
              Admin Capra V2
            </button>
            <button
              onClick={() => onNavigateToTenant('andrea-nails', false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-200 border border-emerald-500/30 flex items-center gap-1.5 transition-all"
            >
              Ver Andrea Nails V2
            </button>
            <button
              onClick={onNavigateToSaaSLanding}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
            >
              <Globe className="w-3.5 h-3.5" />
              Web Comercial vanesev.com
            </button>
            <button
              onClick={fetchCentralState}
              disabled={syncing}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
              title="Sincronizar con Neon DB"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* NAVIGATION PILLS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar border-t border-zinc-900/80">
          {[
            { id: 'sessions', label: '1. Revisión de Sesiones & Aprobación', icon: CheckCircle2, badge: pendingSessionsCount },
            { id: 'incidents', label: '2. Buzón de Emergencia (Bugs)', icon: AlertTriangle, badge: openIncidentsCount, alert: true },
            { id: 'mailbox', label: '3. Buzón Directo karc0 ↔ Agente', icon: MessageSquare, badge: (data.mailbox || []).length },
            { id: 'tasks_roadmap', label: '4. Tareas, Cronograma & Arquitectura', icon: Layers, badge: pendingTasksCount },
            { id: 'tenants', label: '5. Salones (Tenants) & Subdominios', icon: Crown, badge: (data.tenants || []).length },
            { id: 'docs', label: '6. Documentación Compartida', icon: FileText, badge: (data.docs || []).length },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                  active
                    ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.alert && tab.badge > 0 ? 'text-rose-400' : active ? 'text-amber-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                      tab.alert
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : active
                        ? 'bg-amber-400 text-black'
                        : 'bg-zinc-800 text-zinc-300'
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* INFRASTRUCTURE TELEMETRY STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'GitHub Cloud CI', value: 'vanessas07 (7GB VM)', icon: GitBranch, color: 'text-emerald-400' },
            { label: 'Vercel Edge', value: 'vanesevapp-4342 (iad1)', icon: Server, color: 'text-sky-400' },
            { label: 'Neon Postgres 18', value: 'production + staging', icon: Database, color: 'text-amber-400' },
            { label: 'Neon Live SQL', value: 'Realtime Activo', icon: Activity, color: 'text-purple-400' },
            { label: 'Vercel Blob CDN', value: 'vanesev-media-blob', icon: HardDrive, color: 'text-pink-400' },
            { label: 'Proyecto Aislado', value: 'VAKSAR (Reservado)', icon: Lock, color: 'text-zinc-300' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-[#0E0E14] border border-zinc-800/80 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 truncate">{item.label}</p>
                  <p className="text-xs font-semibold text-zinc-200 truncate">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {loading ? (
          <div className="p-16 text-center rounded-2xl bg-[#0E0E14] border border-zinc-800">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-zinc-400">Cargando cerebro compartido de VANESEV desde Neon Postgres 18...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: REVISIÓN DE SESIONES & APROBACIÓN DE KARC0 */}
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#12121A] to-[#0E0E14] border border-amber-500/25">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                      AUDITORÍA PAUSADA & APROBACIÓN EJECUTIVA
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1">
                      Bitácora de Sesiones de Antigravity (Persistida en Neon DB)
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">
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
                    <div key={ses.id} className="rounded-2xl bg-[#0E0E14] border border-zinc-800 overflow-hidden shadow-xl">
                      <div className="p-6 border-b border-zinc-800/80 flex flex-wrap items-start justify-between gap-4 bg-[#12121A]">
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5 mb-2">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              ID: {ses.id}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-zinc-800 text-zinc-300">
                              Agente: {ses.agent_name}
                            </span>
                            <span
                              className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                isApproved
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : isChanges
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {isApproved ? '✓ APROBADA POR KARC0' : isChanges ? '⚠ CAMBIOS SOLICITADOS' : '⏳ PENDIENTE DE TU REVISIÓN'}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-white">{ses.title}</h3>
                          <p className="text-sm text-zinc-300 mt-2 leading-relaxed">{ses.summary}</p>
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Elements Built */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                            Elementos Construidos y Entregados en esta Sesión
                          </h4>
                          <div className="space-y-2">
                            {elements.map((el: any, i: number) => (
                              <div key={i} className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between gap-3">
                                <span className="text-sm text-zinc-200 font-medium">{el.item}</span>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                                  {el.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Decisions Logged */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                            Decisiones Arquitectónicas Registradas
                          </h4>
                          <div className="space-y-2">
                            {decisions.map((dec: any, i: number) => (
                              <div key={i} className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
                                <p className="text-sm font-bold text-white">{dec.decision}</p>
                                <p className="text-xs text-zinc-400 mt-1">{dec.rationale}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Karc0 Review & Response Box */}
                      <div className="p-6 bg-[#0A0A0F] border-t border-zinc-800/80 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                            Tu Respuesta / Instrucciones sobre esta Sesión (Se guarda en Neon DB para el Agente):
                          </label>
                          {ses.karc0_feedback && (
                            <span className="text-xs text-emerald-400 font-mono">
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
                            className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReviewSession(ses.id, 'approved')}
                              className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                            >
                              <Check className="w-4 h-4" />
                              Aprobar Sesión
                            </button>
                            <button
                              onClick={() => handleReviewSession(ses.id, 'changes_requested')}
                              className="px-4 py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
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
                <div className="lg:col-span-1 p-6 rounded-2xl bg-[#0E0E14] border border-rose-500/30 space-y-4 h-fit">
                  <div className="flex items-center gap-2 text-rose-400">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="text-base font-bold uppercase tracking-wider">Reportar Fallo o Emergencia</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Si mientras pruebas desde tu móvil o PC ves cualquier detalle que falle o quieras corregir al instante, anótalo aquí. Queda grabado en Neon DB como prioridad máxima.
                  </p>
                  <form onSubmit={handleCreateIncident} className="space-y-3">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Severidad</label>
                      <select
                        value={incSeverity}
                        onChange={(e) => setIncSeverity(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
                      >
                        <option value="critical">🔥 Crítica (Atacar de inmediato)</option>
                        <option value="high">⚡ Alta (Corregir en la sesión actual)</option>
                        <option value="medium">🔧 Media (Ajuste visual o funcional)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Zona Afectada</label>
                      <select
                        value={incZone}
                        onChange={(e) => setIncZone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
                      >
                        <option value="ZONA 1 · LANDING VANESEV">ZONA 1 · Web Comercial vanesev.com</option>
                        <option value="ZONA 2 · CENTRAL">ZONA 2 · Panel Central de karc0</option>
                        <option value="ZONA 3 · ADMIN PRO V2">ZONA 3 · Admin Pro V2 del Salón</option>
                        <option value="ZONA 4 · CATÁLOGO & FICHA VIP">ZONA 4 · Catálogo & Ficha VIP Cliente</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Negocio / Salón</label>
                      <select
                        value={incTenant}
                        onChange={(e) => setIncTenant(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
                      >
                        <option value="all">Todos / Plataforma General</option>
                        <option value="capra-studio">Capra Studio (@caprastudio_)</option>
                        <option value="andrea-nails">Andrea Labrador Nails</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Título corto del fallo</label>
                      <input
                        type="text"
                        required
                        value={incTitle}
                        onChange={(e) => setIncTitle(e.target.value)}
                        placeholder="Ej: Botón de reserva en móvil no abre..."
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Detalle de lo que viste</label>
                      <textarea
                        rows={3}
                        value={incDesc}
                        onChange={(e) => setIncDesc(e.target.value)}
                        placeholder="Describe qué hiciste y qué debería pasar..."
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Registrar en Buzón de Emergencia
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-white">Historial de Incidencias & Errores Solucionados</h3>
                  {(data.incidents || []).map((inc: any) => (
                    <div
                      key={inc.id}
                      className={`p-5 rounded-2xl border ${
                        inc.status === 'resolved'
                          ? 'bg-[#0E0E14] border-zinc-800'
                          : 'bg-rose-950/15 border-rose-500/40'
                      } space-y-3`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase font-bold ${
                              inc.status === 'resolved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500 text-white'
                            }`}
                          >
                            {inc.status === 'resolved' ? '✓ SOLUCIONADO' : '🔥 ABIERTO · ' + inc.severity}
                          </span>
                          <span className="text-xs font-mono text-zinc-400">{inc.affected_zone}</span>
                          <span className="text-xs font-mono text-amber-400">({inc.affected_tenant})</span>
                        </div>
                        {inc.status !== 'resolved' && (
                          <button
                            onClick={() => postAction('update_incident', { id: inc.id, status: 'resolved', resolutionNote: 'Marcado como resuelto desde Central.' })}
                            className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold"
                          >
                            Marcar Resuelto
                          </button>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white">{inc.title}</h4>
                      <p className="text-sm text-zinc-300">{inc.description}</p>
                      {inc.agent_resolution_note && (
                        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200">
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
                <div className="lg:col-span-1 p-6 rounded-2xl bg-[#0E0E14] border border-amber-500/30 space-y-4 h-fit">
                  <div className="flex items-center gap-2 text-amber-400">
                    <MessageSquare className="w-5 h-5" />
                    <h3 className="text-base font-bold uppercase tracking-wider">Dejar Orden o Nota al Agente</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Escribe aquí cualquier idea, requerimiento, cambio de precios o instrucción mientras navegas. Cuando abras sesión conmigo y me digas <i>"lee el buzón de Central"</i>, lo tendré todo cargado al instante.
                  </p>
                  <form onSubmit={handleSendMessage} className="space-y-3">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Asunto / Tema</label>
                      <input
                        type="text"
                        required
                        value={msgSubject}
                        onChange={(e) => setMsgSubject(e.target.value)}
                        placeholder="Ej: Nuevos servicios para Capra Studio..."
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Prioridad</label>
                      <select
                        value={msgPriority}
                        onChange={(e) => setMsgPriority(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
                      >
                        <option value="high">Alta Prioridad</option>
                        <option value="normal">Normal / Idea futura</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Mensaje detallado para Antigravity</label>
                      <textarea
                        rows={4}
                        required
                        value={msgBody}
                        onChange={(e) => setMsgBody(e.target.value)}
                        placeholder="Escribe aquí todo lo que quieras que ejecute..."
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      Guardar en Buzón de Neon DB
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-white">Bandeja de Comunicaciones (karc0 ↔ Antigravity)</h3>
                  {(data.mailbox || []).map((m: any) => {
                    const fromKarc0 = m.sender === 'karc0';
                    return (
                      <div
                        key={m.id}
                        className={`p-5 rounded-2xl border ${
                          fromKarc0
                            ? 'bg-amber-500/10 border-amber-500/40'
                            : 'bg-[#0E0E14] border-zinc-800'
                        } space-y-2`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase ${
                                fromKarc0 ? 'bg-amber-400 text-black' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              }`}
                            >
                              {fromKarc0 ? '👑 DE: KARC0 (DIRECTOR)' : '🤖 DE: ANTIGRAVITY'}
                            </span>
                            <span className="text-xs font-mono text-zinc-400">→ PARA: {m.recipient.toUpperCase()}</span>
                          </div>
                          <span className="text-xs font-mono text-zinc-500">
                            {new Date(m.created_at).toLocaleString('es-VE')}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{m.subject}</h4>
                        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{m.body}</p>
                        {m.related_doc_path && (
                          <p className="text-xs font-mono text-amber-400 pt-1">
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
                <div className="p-6 rounded-2xl bg-[#0E0E14] border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                        MAPA DE INGENIERÍA EN VIVO
                      </span>
                      <h3 className="text-xl font-bold text-white">Estructura Actual vs. Proyectada de las 4 Zonas</h3>
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
                      <div key={i} className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">{z.zone}</span>
                          <h4 className="text-base font-bold text-white mt-1">{z.title}</h4>
                          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{z.desc}</p>
                        </div>
                        <span className="inline-block w-fit px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          ● {z.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TASKS BACKLOG + ADD TASK */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 p-6 rounded-2xl bg-[#0E0E14] border border-zinc-800 space-y-4 h-fit">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Agregar Tarea Pendiente</h3>
                    <form onSubmit={handleCreateTask} className="space-y-3">
                      <input
                        type="text"
                        required
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Título de la tarea..."
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
                      />
                      <select
                        value={taskZone}
                        onChange={(e) => setTaskZone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
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
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
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
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider"
                      >
                        Guardar Tarea en Neon DB
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-white">Tablero de Tareas Pendientes & Cronograma</h3>
                    {(data.tasks || []).map((t: any) => (
                      <div key={t.id} className="p-4 rounded-xl bg-[#0E0E14] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-amber-300">{t.zone}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-900 text-zinc-400">
                              Resp: {t.assigned_to}
                            </span>
                            <span className="text-xs font-mono text-emerald-400">{t.due_label}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{t.title}</h4>
                          <p className="text-xs text-zinc-400">{t.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={t.status}
                            onChange={(e) => postAction('upsert_task', { ...t, assignedTo: t.assigned_to, dueLabel: t.due_label, karc0Notes: t.karc0_notes, status: e.target.value })}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
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

            {/* TAB 5: SALONES (TENANTS) & SUBDOMINIOS MODIFICABLES */}
            {activeTab === 'tenants' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Gobernador Multi-Tenant de Salones & Subdominios (*.vanesev.com)</h2>
                    <p className="text-sm text-zinc-400">
                      Cada negocio tiene su URL limpia modificable (`[subdominio].vanesev.com` y `vanesev.com/?salon=[id]`), su paleta de autor y su propio Admin Pro V2.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTenantModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Crear Nuevo Salón / Cliente
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(data.tenants || []).map((ten: any) => {
                    const tenantStaff = (data.staff || []).filter((s: any) => s.tenant_id === ten.id);
                    const tenantZones = (data.zones || []).filter((z: any) => z.tenant_id === ten.id);
                    return (
                      <div key={ten.id} className="rounded-2xl bg-[#0E0E14] border border-zinc-800 overflow-hidden flex flex-col justify-between">
                        <div className="p-6 space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center font-serif font-bold text-lg text-white shadow-lg"
                                style={{ backgroundColor: ten.primary_color, border: `2px solid ${ten.accent_color}` }}
                              >
                                {ten.business_name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-bold text-white">{ten.business_name}</h3>
                                  {ten.is_lifetime_free && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                      ★ VITALICIO GRATIS
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-zinc-400">{ten.owner_name} · {ten.instagram_handle} · +{ten.whatsapp_phone}</p>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              {ten.subscription_status}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-300 italic">"{ten.slogan}"</p>

                          {/* Editable Subdomain URL Box */}
                          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
                              URL Oficial Modificable (Wildcard DNS Activo en Vercel):
                            </span>
                            <div className="flex items-center justify-between gap-2 text-xs font-mono text-white">
                              <span>https://{ten.custom_subdomain}.vanesev.com</span>
                              <span className="text-zinc-500">|</span>
                              <span>vanesev.com/?salon={ten.id}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                              <p className="text-[10px] text-zinc-500 uppercase font-mono">Especialistas</p>
                              <p className="text-sm font-bold text-white">{tenantStaff.length}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                              <p className="text-[10px] text-zinc-500 uppercase font-mono">Zonas Local</p>
                              <p className="text-sm font-bold text-white">{tenantZones.length}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                              <p className="text-[10px] text-zinc-500 uppercase font-mono">Fidelización</p>
                              <p className="text-sm font-bold text-amber-400">{ten.loyalty_stamps_target} Sellos VIP</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#0A0A0F] border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
                          <button
                            onClick={() => onNavigateToTenant(ten.id, false)}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            Abrir PWA del Salón
                          </button>
                          <button
                            onClick={() => onNavigateToTenant(ten.id, true)}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5"
                          >
                            Abrir Admin Pro V2
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {showTenantModal && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0E0E14] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                          WIZARD 1-CLICK MULTI-TENANT · NEON DB
                        </span>
                        <h3 className="text-lg font-bold text-white">Dar de Alta Nuevo Salón + Zonas + Equipo</h3>
                      </div>
                      <form onSubmit={handleSaveTenant} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-zinc-400 block mb-1">Nombre del Salón</label>
                            <input
                              type="text"
                              required
                              value={tenantForm.businessName}
                              onChange={(e) => {
                                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                                setTenantForm({ ...tenantForm, businessName: e.target.value, id: slug, customSubdomain: slug.replace(/-/g, '') });
                              }}
                              placeholder="Ej: Lumina Spa"
                              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-zinc-400 block mb-1">Subdominio (.vanesev.com)</label>
                            <input
                              type="text"
                              required
                              value={tenantForm.customSubdomain}
                              onChange={(e) => setTenantForm({ ...tenantForm, customSubdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                              placeholder="luminaspa"
                              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-amber-300 font-mono"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-zinc-400 block mb-1">Dueño/a</label>
                            <input
                              type="text"
                              value={tenantForm.ownerName}
                              onChange={(e) => setTenantForm({ ...tenantForm, ownerName: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-zinc-400 block mb-1">WhatsApp (con 58)</label>
                            <input
                              type="text"
                              value={tenantForm.whatsappPhone}
                              onChange={(e) => setTenantForm({ ...tenantForm, whatsappPhone: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-zinc-400 block mb-1">Slogan de Autor</label>
                          <input
                            type="text"
                            value={tenantForm.slogan}
                            onChange={(e) => setTenantForm({ ...tenantForm, slogan: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-amber-300 block mb-1">
                            Áreas / Cabinas Iniciales (separadas por coma → se crean en `studio_zones`)
                          </label>
                          <input
                            type="text"
                            value={tenantForm.initialZonesCsv}
                            onChange={(e) => setTenantForm({ ...tenantForm, initialZonesCsv: e.target.value })}
                            placeholder="Cejas & Pestañas, Peluquería, Manicure & Spa"
                            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-amber-300 block mb-1">
                            Especialistas Iniciales (separadas por coma → se crean en `staff_members`)
                          </label>
                          <input
                            type="text"
                            value={tenantForm.initialStaffCsv}
                            onChange={(e) => setTenantForm({ ...tenantForm, initialStaffCsv: e.target.value })}
                            placeholder="Directora Principal, Especialista 1, Especialista 2"
                            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => setShowTenantModal(false)}
                            className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-amber-500 text-black text-xs font-bold uppercase"
                          >
                            Crear Salón + Zonas + Equipo en 1 Clic
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
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">
                    Documentos en `Desktop\vanesev app`
                  </h3>
                  {(data.docs || []).map((doc: any) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedDoc?.id === doc.id
                          ? 'bg-amber-500/15 border-amber-400 text-white'
                          : 'bg-[#0E0E14] border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase text-amber-400">{doc.category} · {doc.version}</span>
                      <h4 className="text-sm font-bold mt-1">{doc.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{doc.summary}</p>
                      <p className="text-[10px] font-mono text-zinc-500 mt-2 truncate">{doc.local_path}</p>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0E0E14] border border-zinc-800">
                  {selectedDoc ? (
                    <div className="space-y-4">
                      <div className="border-b border-zinc-800 pb-4">
                        <span className="text-xs font-mono text-amber-400">{selectedDoc.local_path}</span>
                        <h3 className="text-xl font-bold text-white mt-1">{selectedDoc.title}</h3>
                      </div>
                      <pre className="text-xs sm:text-sm text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed bg-[#09090D] p-5 rounded-xl border border-zinc-800/80 max-h-[600px] overflow-y-auto">
                        {selectedDoc.content_markdown}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">Selecciona un documento a la izquierda para inspeccionarlo.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
