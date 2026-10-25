import React, { useState, useEffect } from 'react';
import {
  Shield, Layers, CheckCircle2, AlertTriangle, MessageSquare, FileText,
  Globe, Plus, RefreshCw, ExternalLink, Sparkles, Send, Check, XCircle,
  Clock, Server, Database, HardDrive, GitBranch, ArrowUpRight, Users,
  MapPin, DollarSign, Crown, Eye, Terminal, Activity, Lock, QrCode, Crosshair
} from 'lucide-react';
import { DynamicQrManager } from './DynamicQrManager';
import { CentralCompetitors } from './CentralCompetitors';

interface CentralDashboardProps {
  onNavigateToTenant: (tenantSlug: string, openAdmin?: boolean) => void;
  onNavigateToSaaSLanding: () => void;
}

export const CentralDashboard: React.FC<CentralDashboardProps> = ({
  onNavigateToTenant,
  onNavigateToSaaSLanding,
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'incidents' | 'mailbox' | 'tasks_roadmap' | 'tenants' | 'docs' | 'qr' | 'competitors'>('sessions');
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-amber-500/20 selection:text-amber-900 overflow-x-hidden">
      {/* TOP COMMAND HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-xl shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-[1px] shadow-sm shrink-0">
                <div className="w-full h-full bg-[#0F172A] rounded-[11px] flex items-center justify-center">
                  <span className="font-serif font-black text-lg sm:text-xl text-amber-300">
                    V
                  </span>
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-amber-800 font-bold">
                    VANESEV · CENTRAL
                  </span>
                  <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    ● LIVE DB
                  </span>
                </div>
                <h1 className="text-sm sm:text-xl font-bold tracking-tight text-[#0F172A] truncate">
                  Centro de Mando &amp; Gobernanza de karc0
                </h1>
              </div>
            </div>
            <button
              onClick={fetchCentralState}
              disabled={syncing}
              className="sm:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 shrink-0"
              title="Sincronizar con Neon DB"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-amber-600' : ''}`} />
            </button>
          </div>

          {/* Quick Jump Switcher to Live Environments (Swipeable on Mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap pb-0.5 sm:pb-0">
            <button
              onClick={() => onNavigateToTenant('capra-studio', false)}
              className="px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold bg-[#FDF2F4] hover:bg-[#FBE4E9] text-[#7A4953] border border-[#F3C5CE] flex items-center gap-1.5 transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Ver Capra Studio
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateToTenant('capra-studio', true)}
              className="px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-all shrink-0"
            >
              Admin Capra V2
            </button>
            <button
              onClick={() => onNavigateToTenant('andrea-nails', false)}
              className="px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition-all shrink-0"
            >
              Ver Andrea Nails V2
            </button>
            <button
              onClick={onNavigateToSaaSLanding}
              className="px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold bg-[#0F172A] hover:bg-slate-800 text-white flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              Web Comercial vanesev.com
            </button>
            <button
              onClick={fetchCentralState}
              disabled={syncing}
              className="hidden sm:inline-flex p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 shrink-0"
              title="Sincronizar con Neon DB"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-amber-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* NAVIGATION PILLS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar border-t border-[#E2E8F0]">
          {[
            { id: 'sessions', label: '1. Revisión de Sesiones & Aprobación', icon: CheckCircle2, badge: pendingSessionsCount },
            { id: 'incidents', label: '2. Buzón de Emergencia (Bugs)', icon: AlertTriangle, badge: openIncidentsCount, alert: true },
            { id: 'mailbox', label: '3. Buzón Directo karc0 ↔ Agente', icon: MessageSquare, badge: (data.mailbox || []).length },
            { id: 'tasks_roadmap', label: '4. Tareas, Cronograma & Arquitectura', icon: Layers, badge: pendingTasksCount },
            { id: 'tenants', label: '5. Salones (Tenants) & Dominios', icon: Crown, badge: (data.tenants || []).length },
            { id: 'docs', label: '6. Documentación Compartida', icon: FileText, badge: (data.docs || []).length },
            { id: 'qr', label: '7. Motor QR Dinámico & Analítica', icon: QrCode, badge: 0 },
            { id: 'competitors', label: '8. Radar de Competidores & Inteligencia', icon: Crosshair, badge: 4 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                  active
                    ? 'border-amber-600 text-amber-950 bg-amber-50/70 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.alert && tab.badge > 0 ? 'text-rose-600' : active ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                      tab.alert
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : active
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
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
            { label: 'GitHub Cloud CI', value: 'vanessas07 (7GB VM)', icon: GitBranch, color: 'text-emerald-600' },
            { label: 'Vercel Edge', value: 'vanesevapp-4342 (iad1)', icon: Server, color: 'text-sky-600' },
            { label: 'Neon Postgres 18', value: 'production + staging', icon: Database, color: 'text-amber-600' },
            { label: 'Neon Live SQL', value: 'Realtime Activo', icon: Activity, color: 'text-purple-600' },
            { label: 'Vercel Blob CDN', value: 'vanesev-media-blob', icon: HardDrive, color: 'text-pink-600' },
            { label: 'Proyecto Aislado', value: 'VAKSAR (Reservado)', icon: Lock, color: 'text-slate-500' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 truncate">{item.label}</p>
                  <p className="text-xs font-semibold text-[#0F172A] truncate">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {loading ? (
          <div className="p-16 text-center rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
            <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-600">Cargando cerebro compartido de VANESEV desde Neon Postgres 18...</p>
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

            {/* TAB 5: SALONES (TENANTS) & SUBDOMINIOS MODIFICABLES */}
            {activeTab === 'tenants' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#0F172A]">Gobernador Multi-Tenant de Salones & Subdominios (*.vanesev.com)</h2>
                    <p className="text-sm text-slate-600">
                      Cada negocio tiene su URL limpia modificable (`[subdominio].vanesev.com` y `vanesev.com/?salon=[id]`), su paleta de autor y su propio Admin Pro V2.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTenantModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer"
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
                      <div key={ten.id} className="rounded-2xl bg-white border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col justify-between">
                        <div className="p-6 space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center font-serif font-bold text-lg text-white shadow-md"
                                style={{ backgroundColor: ten.primary_color, border: `2px solid ${ten.accent_color}` }}
                              >
                                {ten.business_name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-bold text-[#0F172A]">{ten.business_name}</h3>
                                  {ten.is_lifetime_free && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200">
                                      ★ VITALICIO GRATIS
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500">{ten.owner_name} · {ten.instagram_handle} · +{ten.whatsapp_phone}</p>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {ten.subscription_status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 italic">"{ten.slogan}"</p>

                          {/* Editable Subdomain URL Box */}
                          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 block font-bold">
                              URL Oficial Modificable (Wildcard DNS Activo en Vercel):
                            </span>
                            <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#0F172A]">
                              <span>https://{ten.custom_subdomain}.vanesev.com</span>
                              <span className="text-slate-400">|</span>
                              <span>vanesev.com/?salon={ten.id}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                              <p className="text-[10px] text-slate-500 uppercase font-mono">Especialistas</p>
                              <p className="text-sm font-bold text-[#0F172A]">{tenantStaff.length}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                              <p className="text-[10px] text-slate-500 uppercase font-mono">Zonas Local</p>
                              <p className="text-sm font-bold text-[#0F172A]">{tenantZones.length}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                              <p className="text-[10px] text-slate-500 uppercase font-mono">Fidelización</p>
                              <p className="text-sm font-bold text-amber-800">{ten.loyalty_stamps_target} Sellos VIP</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
                          <button
                            onClick={() => onNavigateToTenant(ten.id, false)}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-600" />
                            Abrir PWA del Salón
                          </button>
                          <button
                            onClick={() => onNavigateToTenant(ten.id, true)}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5"
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
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border border-[#CBD5E1] rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-bold">
                          WIZARD 1-CLICK MULTI-TENANT · NEON DB
                        </span>
                        <h3 className="text-lg font-bold text-[#0F172A]">Dar de Alta Nuevo Salón + Zonas + Equipo</h3>
                      </div>
                      <form onSubmit={handleSaveTenant} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-slate-600 block mb-1">Nombre del Salón</label>
                            <input
                              type="text"
                              required
                              value={tenantForm.businessName}
                              onChange={(e) => {
                                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                                setTenantForm({ ...tenantForm, businessName: e.target.value, id: slug, customSubdomain: slug.replace(/-/g, '') });
                              }}
                              placeholder="Ej: Lumina Spa"
                              className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A] focus:border-amber-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-600 block mb-1">Subdominio (.vanesev.com)</label>
                            <input
                              type="text"
                              required
                              value={tenantForm.customSubdomain}
                              onChange={(e) => setTenantForm({ ...tenantForm, customSubdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                              placeholder="luminaspa"
                              className="w-full px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-sm text-amber-800 font-mono"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-slate-600 block mb-1">Dueño/a</label>
                            <input
                              type="text"
                              value={tenantForm.ownerName}
                              onChange={(e) => setTenantForm({ ...tenantForm, ownerName: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A]"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-600 block mb-1">WhatsApp (con 58)</label>
                            <input
                              type="text"
                              value={tenantForm.whatsappPhone}
                              onChange={(e) => setTenantForm({ ...tenantForm, whatsappPhone: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-slate-600 block mb-1">Slogan de Autor</label>
                          <input
                            type="text"
                            value={tenantForm.slogan}
                            onChange={(e) => setTenantForm({ ...tenantForm, slogan: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-amber-900 font-bold block mb-1">
                            Áreas / Cabinas Iniciales (separadas por coma → se crean en `studio_zones`)
                          </label>
                          <input
                            type="text"
                            value={tenantForm.initialZonesCsv}
                            onChange={(e) => setTenantForm({ ...tenantForm, initialZonesCsv: e.target.value })}
                            placeholder="Cejas & Pestañas, Peluquería, Manicure & Spa"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-amber-900 font-bold block mb-1">
                            Especialistas Iniciales (separadas por coma → se crean en `staff_members`)
                          </label>
                          <input
                            type="text"
                            value={tenantForm.initialStaffCsv}
                            onChange={(e) => setTenantForm({ ...tenantForm, initialStaffCsv: e.target.value })}
                            placeholder="Directora Principal, Especialista 1, Especialista 2"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#0F172A]"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => setShowTenantModal(false)}
                            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold uppercase shadow-xs"
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
