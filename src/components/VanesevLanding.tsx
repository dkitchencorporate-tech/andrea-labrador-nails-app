import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Globe,
  Calendar,
  Users,
  DollarSign,
  Award,
  ArrowRight,
  CheckCircle2,
  Layers,
  Smartphone,
  ExternalLink,
  Clock,
  Star,
  Heart,
  Zap,
  TrendingUp,
  MessageCircle,
  Check,
  ChevronRight,
  Phone,
  Lock,
  Flame,
  Sliders,
  Send,
  Eye,
  ArrowUpRight
} from 'lucide-react';

interface VanesevLandingProps {
  onOpenCentral?: () => void;
  onSelectTenant: (slug: 'andrea-nails' | 'capra-studio') => void;
}

export const VanesevLanding: React.FC<VanesevLandingProps> = ({
  onSelectTenant,
}) => {
  // Interactive Live Product Simulator state
  const [activeFeatureTab, setActiveFeatureTab] = useState<'pwa' | 'agenda' | 'loyalty' | 'finances'>('pwa');
  const [simulatorStamps, setSimulatorStamps] = useState<number>(3);
  const [selectedSimService, setSelectedSimService] = useState<'cejas' | 'alisado' | 'unas'>('cejas');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const whatsappCommercialLink =
    'https://wa.me/584247429530?text=' +
    encodeURIComponent('¡Hola VANESEV! ✨ Deseo solicitar una demostración personalizada de la plataforma para mi salón.');

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F3EFE6] font-sans selection:bg-[#C5A059] selection:text-[#0A0B0E] overflow-x-hidden">
      {/* ══ TOP LUXURY ANNOUNCEMENT BAR ══ */}
      <div className="bg-gradient-to-r from-[#181216] via-[#2A1820] to-[#181216] border-b border-white/10 px-4 py-2 text-center text-[11px] sm:text-xs text-[#E5C158] font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#E5C158] shrink-0 animate-pulse" />
        <span>
          <strong>Lanzamiento 2026:</strong> Tu salón digital en 24 horas · Cero comisiones por reserva · PWA instalable sin tiendas
        </span>
      </div>

      {/* ══ STICKY NAVIGATION HEADER ══ */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0B0E]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E5C158] via-[#C5A059] to-[#8C6D2F] flex items-center justify-center text-[#0A0B0E] font-serif font-black text-xl shadow-lg shadow-[#C5A059]/20 shrink-0">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg sm:text-xl tracking-wider text-white">
                  VANESEV
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#C5A059]/20 text-[#E5C158] border border-[#C5A059]/40">
                  Haute Studio Suite
                </span>
              </div>
              <p className="text-[10px] text-white/50 hidden sm:block">
                Plataforma de Autor para Salones de Belleza, Nails, Barberías &amp; Academias
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-white/75">
            <a href="#por-que" className="hover:text-[#E5C158] transition-colors">¿Por qué VANESEV?</a>
            <a href="#superpoderes" className="hover:text-[#E5C158] transition-colors">Superpoderes</a>
            <a href="#casos" className="hover:text-[#E5C158] transition-colors">Casos Reales</a>
            <a href="#planes" className="hover:text-[#E5C158] transition-colors">Planes &amp; Precios</a>
            <a href="#preguntas" className="hover:text-[#E5C158] transition-colors">Preguntas</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={whatsappCommercialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C158] via-[#C5A059] to-[#D4AF37] hover:brightness-110 text-[#0A0B0E] text-xs font-black flex items-center gap-1.5 shadow-lg shadow-[#C5A059]/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Pedir Demo por WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ══ HERO SECTION (ESTILO EDITORIAL DKITCHEN) ══ */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-20 sm:pb-28 px-4 sm:px-8 border-b border-white/10">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-b from-[#C5A059]/15 via-[#8E5B66]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#C5A059]/40 text-[#E5C158] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PLATAFORMA INTEGRAL DE AUTOR · SIN COMISIONES POR CITA</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-white max-w-4xl mx-auto">
            El talento y el salón ya son tuyos.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#E5C158] to-[#C5A059]">
              Tu marca digital y tus clientas también deberían serlo.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-3xl mx-auto">
            Tu propia web app con tu marca para vender sin intermediarios, sincronizar cabinas y especialistas sin solapamientos,
            cobrar en cualquier moneda y multiplicar las visitas repetidas con tu Club VIP de 5 sellos.
            <strong className="text-white"> Una agenda la tiene cualquiera: nosotros te damos una marca que llena tu local.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <a
              href="#planes"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-[#E5C158] via-[#C5A059] to-[#D4AF37] text-[#0A0B0E] font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#C5A059]/25 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Quiero la plataforma para mi salón</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#superpoderes"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Ver cómo funciona en vivo ↓</span>
            </a>
          </div>

          <p className="text-xs text-white/50 pt-2">
            ¿Solo quieres probar?{' '}
            <a href={whatsappCommercialLink} target="_blank" rel="noopener noreferrer" className="text-[#E5C158] underline underline-offset-4 font-semibold hover:text-white">
              Pide una demo con tu lista de servicios por WhatsApp
            </a>{' '}
            · Te la montamos en 24h sin que tengas que teclear nada.
          </p>

          {/* Social Proof & Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/10 text-left">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="font-serif text-3xl font-bold text-[#E5C158] block">0%</span>
              <span className="text-xs font-semibold text-white block mt-0.5">Cero Comisiones</span>
              <span className="text-[11px] text-white/50">El 100% de cada cita es para tu negocio.</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="font-serif text-3xl font-bold text-[#E5C158] block">+42%</span>
              <span className="text-xs font-semibold text-white block mt-0.5">Retención de Clientas</span>
              <span className="text-[11px] text-white/50">Vuelven cada 3 semanas con el Club de 5 sellos.</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="font-serif text-3xl font-bold text-[#E5C158] block">1 Toque</span>
              <span className="text-xs font-semibold text-white block mt-0.5">PWA Sin Descargas</span>
              <span className="text-[11px] text-white/50">Se instala en iPhone y Android sin App Store.</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="font-serif text-3xl font-bold text-[#E5C158] block">24h</span>
              <span className="text-xs font-semibold text-white block mt-0.5">Llave en Mano</span>
              <span className="text-[11px] text-white/50">Nos envías tus fotos y la dejamos operando.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECCIÓN DOLORES REALES: "¿TE SUENA? LO QUE LE CUESTA DINERO A TU LOCAL" ══ */}
      <section id="por-que" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-white/10 bg-[#0E1015]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#E5C158]">
              ¿Te resulta familiar?
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Lo que le está costando clientas y dinero a tu salón cada semana.
            </h2>
            <p className="text-sm text-white/60">
              La mayoría de dueñas de salones y barberías pierden hasta el 30% de sus ingresos potenciales por depender de libretas o de chats desbordados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1C1215] to-[#120D0F] border border-red-500/25 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Citas perdidas en WhatsApp e Instagram a deshoras
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Tus clientas quieren agendar a las 11 de la noche o en domingo. Cuando estás atendiendo o descansando no puedes responder de inmediato,
                y para cuando abres el chat, <strong className="text-white">ya agendaron en otro salón que sí tenía reserva digital en 1 clic.</strong>
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1C1215] to-[#120D0F] border border-red-500/25 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Apps intermediarias que cobran comisión y te roban la clienta
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Las plataformas de directorios te cobran entre el 15% y el 25% de comisión por cada cita y, lo que es peor:
                <strong className="text-white"> ponen el banner de tu competencia justo al lado de tu perfil</strong>. El cliente es de ellos, no tuyo.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1C1215] to-[#120D0F] border border-red-500/25 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Solapamiento de cabinas y caos de comisiones del equipo
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Dos especialistas agendan al mismo tiempo en la misma cabina o estación, los tiempos se retrasan y al final de la semana
                tienes que pasar horas con la calculadora <strong className="text-white">revisando boletas manuales para calcular las comisiones de cada quien.</strong>
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1C1215] to-[#120D0F] border border-red-500/25 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Cero fidelización: prueban una vez y no vuelven
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Sin un motivo emocional y tangible para regresar, tus clientas rotan constantemente.
                Una tarjeta de papel se pierde en la cartera. <strong className="text-white">Una tarjeta digital VIP con 5 sellos en su teléfono garantiza que vuelvan a completar su ciclo.</strong>
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <a
              href="#superpoderes"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#E5C158] hover:text-white transition-colors"
            >
              <span>Descubre cómo lo resuelve VANESEV en tu negocio</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ══ DEMOSTRACIÓN INTERACTIVA: "UNA SUITE, CUATRO SUPERPODERES" ══ */}
      <section id="superpoderes" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#E5C158]">
              Por dentro
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Una plataforma. Cuatro superpoderes.
            </h2>
            <p className="text-sm text-white/60">
              Así experimentan tu salón tus clientas y tu equipo de trabajo en tiempo real:
            </p>
          </div>

          {/* Feature Tabs Selector */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { id: 'pwa', label: '1. PWA de Autor (Clienta)', icon: Smartphone },
              { id: 'agenda', label: '2. Agenda Multi-Cabina', icon: Calendar },
              { id: 'loyalty', label: '3. Club VIP (5 Sellos)', icon: Award },
              { id: 'finances', label: '4. Finanzas & Comisiones', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id as any)}
                className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeFeatureTab === tab.id
                    ? 'bg-gradient-to-r from-[#E5C158] via-[#C5A059] to-[#D4AF37] text-[#0A0B0E] shadow-lg shadow-[#C5A059]/20 font-black'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Interactive Simulator Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#12141A] to-[#0A0B0E] border border-white/15 shadow-2xl">
            {activeFeatureTab === 'pwa' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#C5A059]/20 text-[#E5C158] border border-[#C5A059]/40">
                    Experiencia Móvil de Alta Costura
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                    Catálogo Interactivo con Reserva en 1 Toque
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Tus clientas abren tu enlace en Instagram o WhatsApp y acceden a una aplicación ultrarrápida con tus fotos en alta definición,
                    precios transparentes, duración estimada y selector de su especialista favorito.
                  </p>
                  <ul className="space-y-2.5 text-xs text-white/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#E5C158] shrink-0" />
                      <span>Sin necesidad de registrarse con contraseñas complejas: acceso rápido con WhatsApp.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#E5C158] shrink-0" />
                      <span>Cálculo automático de bimoneda: moneda local, Dólares o métodos digitales según tu preferencia.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#E5C158] shrink-0" />
                      <span>Se instala como app en el escritorio del teléfono con tu propio logo e icono.</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-6 flex justify-center">
                  {/* Phone Simulator Frame */}
                  <div className="w-full max-w-[320px] rounded-[36px] bg-[#1A181C] border-4 border-white/20 p-4 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#B5838D] text-white font-serif font-bold text-xs flex items-center justify-center">
                          CS
                        </div>
                        <div>
                          <span className="font-serif font-bold text-xs text-white block">Capra Studio</span>
                          <span className="text-[9px] text-white/50">caprastudio.vanesev.com</span>
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                        Abierto
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-[#E5C158] uppercase tracking-wider block">
                        Selecciona tu Servicio:
                      </span>
                      {[
                        { id: 'cejas', name: 'Laminado de Cejas HD + Pigmento', price: '$18', duration: '45 min' },
                        { id: 'alisado', name: 'Cirugía Capilar & Alisado Seda', price: '$45', duration: '120 min' },
                        { id: 'unas', name: 'Sistema Jellytips Rojo Autor', price: '$22', duration: '90 min' },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedSimService(item.id as any)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            selectedSimService === item.id
                              ? 'bg-[#B5838D]/20 border-[#B5838D] text-white'
                              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          <div>
                            <span className="font-bold block text-white">{item.name}</span>
                            <span className="text-[10px] text-white/50">{item.duration}</span>
                          </div>
                          <span className="font-bold text-[#E5C158]">{item.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/70 space-y-1">
                      <span className="font-bold text-white block">Especialista Asignada:</span>
                      <span>María Giovanna Capra &bull; Cabina 1 (Cejas &amp; Visagismo)</span>
                    </div>

                    <button
                      onClick={() => onSelectTenant('capra-studio')}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#B5838D] to-[#8E5B66] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>Reservar Cita en 1 Toque</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'agenda' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Cero Colisiones de Horario
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                    Agenda Inteligente por Cabina &amp; Especialista
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Visualiza en un solo panel todas las áreas de tu salón: cabina de pestañas, estaciones de estilismo, mesas de uñas y cabinas privadas.
                    El sistema bloquea huecos automáticamente y no permite solapar clientas en la misma hora.
                  </p>
                  <ul className="space-y-2.5 text-xs text-white/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Bloqueo de días festivos o descansos del personal con un toque.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Confirmación de cita directa por WhatsApp pre-redactada.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Historial completo de clientas para saber qué se hicieron en visitas previas.</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-6 space-y-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-white border-b border-white/10 pb-2">
                      <span>Vista de Cabinas Hoy · 6 Estaciones</span>
                      <span className="text-[#E5C158]">Sábado, 10:30 AM</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                        <span className="font-bold text-emerald-300 block">Cabina 1 · Cejas</span>
                        <span className="text-[10px] text-white/70">10:30 · Valeria M. (Laminado)</span>
                        <span className="text-[9px] text-emerald-400 font-mono mt-1 block">Ocupada</span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                        <span className="font-bold text-emerald-300 block">Estación 2 · Alisados</span>
                        <span className="text-[10px] text-white/70">10:00–12:00 · Sofía G. (Cirugía)</span>
                        <span className="text-[9px] text-emerald-400 font-mono mt-1 block">Ocupada</span>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30">
                        <span className="font-bold text-amber-300 block">Mesa 3 · Manicure</span>
                        <span className="text-[10px] text-white/70">Libre hasta 11:30 AM</span>
                        <span className="text-[9px] text-amber-300 font-mono mt-1 block">Disponible</span>
                      </div>
                      <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30">
                        <span className="font-bold text-purple-300 block">Cabina 4 · Depilación</span>
                        <span className="text-[10px] text-white/70">11:00 · Reserva en WhatsApp</span>
                        <span className="text-[9px] text-purple-300 font-mono mt-1 block">Pendiente</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'loyalty' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    El Motor de Retención Secreto
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                    Tarjeta Digital VIP de 5 Sellos Antifraude
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Las clientas no acumulan sellos por agendar: el sello solo se acredita en la base de datos cuando el administrador
                    marca la cita como <strong>«completada»</strong> en el local. Al llegar al 5to sello, desbloquean el premio de autor que definas.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setSimulatorStamps(prev => (prev < 5 ? prev + 1 : 1))}
                      className="px-4 py-2 rounded-xl bg-[#E5C158] hover:bg-[#F3E5AB] text-[#0A0B0E] font-black text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Simular Cita Completada (+1 Sello)</span>
                    </button>
                    <span className="text-xs text-white/50">Haz clic para probar</span>
                  </div>
                </div>

                <div className="lg:col-span-6 flex justify-center">
                  <div className="w-full max-w-md p-6 rounded-3xl bg-gradient-to-br from-[#2D1E22] via-[#3B262C] to-[#1F1417] text-white border-2 border-[#C5A059]/60 shadow-2xl space-y-5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#E5C158] tracking-widest block">
                          Club de Fidelidad de Autor
                        </span>
                        <h4 className="font-serif text-xl font-bold text-white">Tarjeta VIP 5 Sellos</h4>
                      </div>
                      <Award className="w-8 h-8 text-[#E5C158]" />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {[1, 2, 3, 4, 5].map((stampNum) => (
                        <div
                          key={stampNum}
                          className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                            stampNum <= simulatorStamps
                              ? 'bg-gradient-to-br from-[#E5C158] to-[#C5A059] border-[#F3E5AB] text-[#0A0B0E] font-black shadow-lg scale-105'
                              : 'bg-white/5 border-white/15 text-white/30'
                          }`}
                        >
                          {stampNum <= simulatorStamps ? (
                            <Star className="w-5 h-5 fill-current" />
                          ) : (
                            <span className="text-xs font-bold">{stampNum}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                      {simulatorStamps >= 5 ? (
                        <span className="text-[#E5C158] font-bold block animate-bounce">
                          🎉 ¡Recompensa Desbloqueada! Depilación de Cejas o Hidratación Capilar 100% GRATIS.
                        </span>
                      ) : (
                        <span className="text-white/80">
                          Llevas <strong>{simulatorStamps} de 5 sellos</strong>. Te faltan {5 - simulatorStamps} visita(s) para tu premio VIP.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'finances' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    Control Financiero Transparente
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                    Caja del Día, Comisiones &amp; Reporte Contable PDF
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    Se acabaron las dudas de fin de mes. VANESEV calcula automáticamente la recaudación diaria,
                    las comisiones de cada especialista (40%, 45% o a medida) y te permite exportar un informe contable en PDF A4 listo para imprimir.
                  </p>
                  <ul className="space-y-2.5 text-xs text-white/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Soporte multimoneda: tasa del día configurable para cobros en Bolívares, Dólares o Cripto.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Desglose por método de pago: Pago Móvil, Efectivo, Binance Pay, Tarjeta o Zelle.</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-6 space-y-3">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-white">Resumen de Caja de la Semana</span>
                      <span className="text-xs font-mono text-[#E5C158]">$1,280.00 USD</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                        <span className="text-white/80">María Giovanna (Titular 100%)</span>
                        <span className="font-bold text-white">$640.00</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                        <span className="text-white/80">Valeria M. (Especialista Cejas 45%)</span>
                        <span className="font-bold text-white">$315.00</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                        <span className="text-white/80">Camila R. (Alisados &amp; Color 40%)</span>
                        <span className="font-bold text-white">$325.00</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-300 flex items-center justify-between">
                      <span>Reporte Contable A4 generado en vivo</span>
                      <span className="font-bold underline cursor-pointer">Exportar PDF</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ CASOS REALES DE AUTOR (SHOWCASE DE ÉXITO) ══ */}
      <section id="casos" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-white/10 bg-[#0E1015]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#E5C158]">
              Casos Reales en Producción
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Salones que ya tienen su plataforma de autor.
            </h2>
            <p className="text-sm text-white/60">
              Cada negocio recibe su propio subdominio, su paleta de autor y sus departamentos operativos:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Caso 1: Capra Studio */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#23171B] via-[#1B1115] to-[#120B0E] border border-[#B5838D]/40 space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#B5838D]/25 text-[#F5D8DF] border border-[#B5838D]/50">
                  Salón Integral &amp; Academia
                </span>
                <span className="text-xs font-mono text-[#E5C158]">caprastudio.vanesev.com</span>
              </div>

              <div>
                <h3 className="font-serif text-3xl font-bold text-white">
                  Capra Studio · By María Capra
                </h3>
                <p className="text-xs text-[#E5C158] font-serif italic mt-1">
                  «Nos complace ser parte de tu embellecimiento y armonía perfecta en tu vida»
                </p>
              </div>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                De 200 mensajes dispersos en WhatsApp a <strong>6 departamentos sincronizados</strong>: Cejas y Pestañas, Estilismo y Alisados,
                Maquillaje Profesional, Manicure Jellytips, Depilación y el aula certificada <strong>Capra Academy</strong>.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                <div className="p-2.5 rounded-xl bg-white/5">
                  <span className="font-bold text-white text-sm block">6 Áreas</span>
                  <span className="text-[10px] text-white/50">Multi-Cabina</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5">
                  <span className="font-bold text-white text-sm block">5 Sellos</span>
                  <span className="text-[10px] text-white/50">Fidelidad VIP</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5">
                  <span className="font-bold text-white text-sm block">Mauve &amp; Gold</span>
                  <span className="text-[10px] text-white/50">Estilo de Autor</span>
                </div>
              </div>

              <button
                onClick={() => onSelectTenant('capra-studio')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#B5838D] to-[#8E5B66] hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
              >
                <span>Explorar App de Capra Studio en Vivo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Caso 2: Andrea Labrador Nails */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#121E18] via-[#0E1713] to-[#0A100D] border border-emerald-500/40 space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
                  Estudio de Uñas de Autor · Flagship
                </span>
                <span className="text-xs font-mono text-emerald-300">andrealabrador.vanesev.com</span>
              </div>

              <div>
                <h3 className="font-serif text-3xl font-bold text-white">
                  Andrea Labrador Nails Studio
                </h3>
                <p className="text-xs text-emerald-300 font-serif italic mt-1">
                  «Arte, precisión clínica y elegancia en cada detalle de tus manos»
                </p>
              </div>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                El salón insignia de autor: catálogo de manicura rusa, Polygel y esmaltado semipermanente con 
                <strong> Ficha VIP conectada en vivo</strong>, tarjeta de 5 sellos para depilación de cejas gratis y agenda llena con semanas de antelación.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                <div className="p-2.5 rounded-xl bg-white/5">
                  <span className="font-bold text-white text-sm block">3 Zonas</span>
                  <span className="text-[10px] text-white/50">Manos &amp; Pies</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5">
                  <span className="font-bold text-white text-sm block">5 Sellos</span>
                  <span className="text-[10px] text-white/50">Cortesía Cejas</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5">
                  <span className="font-bold text-white text-sm block">Sage &amp; Gold</span>
                  <span className="text-[10px] text-white/50">Lujo Silencioso</span>
                </div>
              </div>

              <button
                onClick={() => onSelectTenant('andrea-nails')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
              >
                <span>Explorar App de Andrea Labrador en Vivo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ONBOARDING SIN ESFUERZO: "TE LA MONTAMOS DESDE TU LISTA DE PRECIOS" ══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/10 bg-gradient-to-b from-[#0A0B0E] via-[#151216] to-[#0A0B0E]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-[#C5A059]/20 text-[#E5C158] border border-[#C5A059]/40 inline-block">
            Onboarding Llave en Mano
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Nos mandas tu lista de precios por WhatsApp y te la dejamos lista en 24 horas.
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            No tienes que teclear nada, ni saber de programación, ni pasar días configurando menús.
            Nosotros cargamos tus servicios, tus especialistas, tus fotos y tus precios. Tú solo compartes tu nuevo enlace.
          </p>
          <div className="pt-2">
            <a
              href={whatsappCommercialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E5C158] via-[#C5A059] to-[#D4AF37] text-[#0A0B0E] font-black text-sm shadow-xl shadow-[#C5A059]/20 hover:scale-105 transition-all"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>Enviar mi lista de servicios por WhatsApp →</span>
            </a>
          </div>
        </div>
      </section>

      {/* ══ PLANES & PRECIOS TRANSPARENTES ══ */}
      <section id="planes" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#E5C158]">
              Inversión Clara &amp; Sin Sorpresas
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Planes que se pagan solos con 2 citas al mes.
            </h2>
            <p className="text-sm text-white/60">
              Cero comisiones por reserva. Lo que cobras es 100% tuyo:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-white/60 block">
                  Studio Pro
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">Boutique &amp; Nails</h3>
                <p className="text-xs text-white/60">
                  Ideal para estudios de uñas, cejas o especialistas independientes con 1 a 2 puestos de atención.
                </p>
                <div className="pt-2">
                  <span className="font-serif text-4xl font-bold text-white">$25</span>
                  <span className="text-xs text-white/50"> / mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>PWA con tu logo y subdominio propio</span></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Catálogo ilimitado de servicios</span></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Hasta 2 especialistas en agenda</span></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Tarjeta digital VIP de 5 sellos</span></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Cero comisiones por cita</span></li>
                </ul>
              </div>
              <a
                href={whatsappCommercialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center block transition-all"
              >
                Elegir Studio Pro
              </a>
            </div>

            {/* Plan 2: Destacado */}
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-[#241820] to-[#140D12] border-2 border-[#C5A059] space-y-6 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#E5C158] to-[#C5A059] text-[#0A0B0E] font-black text-[10px] uppercase tracking-widest">
                Más Elegido por Salones
              </div>
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#E5C158] block">
                  Salon Elite
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">Multi-Área &amp; Equipo</h3>
                <p className="text-xs text-white/70">
                  Para salones integrales con múltiples cabinas, especialistas, comisiones y alto volumen de citas.
                </p>
                <div className="pt-2">
                  <span className="font-serif text-4xl font-bold text-[#E5C158]">$45</span>
                  <span className="text-xs text-white/50"> / mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-white/85 border-t border-white/10 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Todo lo de Studio Pro</span></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Hasta 6 áreas/cabinas operativas en BD</span></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Especialistas ilimitados con comisiones</span></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Gestión de caja del día bimoneda</span></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Exportación de reporte contable en PDF A4</span></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Soporte prioritario por WhatsApp</span></li>
                </ul>
              </div>
              <a
                href={whatsappCommercialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#C5A059] text-[#0A0B0E] font-black text-xs text-center block shadow-lg shadow-[#C5A059]/25 hover:brightness-110 transition-all"
              >
                Elegir Salon Elite
              </a>
            </div>

            {/* Plan 3 */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-white/60 block">
                  Enterprise
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">Franquicia &amp; Academia</h3>
                <p className="text-xs text-white/60">
                  Para cadenas con múltiples sedes o salones que imparten cursos profesionales y certificaciones.
                </p>
                <div className="pt-2">
                  <span className="font-serif text-4xl font-bold text-white">A Medida</span>
                </div>
                <ul className="space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Múltiples sedes con base de datos unificada</span></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Módulo de Academia (Cursos &amp; Certificados)</span></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Dominio propio personalizado (tusalon.com)</span></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#E5C158]" /> <span>Asesor técnico dedicado</span></li>
                </ul>
              </div>
              <a
                href={whatsappCommercialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center block transition-all"
              >
                Consultar Plan a Medida
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PREGUNTAS FRECUENTES (FAQ) ══ */}
      <section id="preguntas" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-white/10 bg-[#0E1015]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#E5C158]">
              Dudas Resueltas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: '¿Mis clientas tienen que descargar una aplicación de la App Store o Google Play?',
                a: 'No. VANESEV funciona como una PWA (Progressive Web App). Tus clientas solo tocan el enlace de tu perfil y la app abre al instante sin ocupar espacio de memoria. Si lo desean, pueden añadirla a la pantalla de inicio con un solo toque.',
              },
              {
                q: '¿Cómo cobro a mis clientas en mi país?',
                a: 'Tú mantienes el 100% del control. La plataforma admite cualquier método de cobro: efectivo en el local, transferencias bancarias, Pago Móvil, tarjetas internacionales, Zelle o Binance USDT. VANESEV no retiene tu dinero ni cobra comisión sobre tus servicios.',
              },
              {
                q: '¿Puedo personalizar los colores, el logo y las fotos de mi salón?',
                a: 'Sí, absolutamente. Cada salón recibe una identidad de autor propia (como la paleta Mauve & Gold de Capra Studio o la Sage & Gold de Andrea Nails). Ningún salón es una plantilla genérica.',
              },
              {
                q: '¿Cuánto tiempo tardan en dejarme la plataforma lista?',
                a: 'En 24 horas hábiles tras enviarnos tu lista de servicios y precios por WhatsApp, tu plataforma está en vivo y lista para recibir citas.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer transition-all"
                onClick={() => toggleFaq(index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                    {item.q}
                  </h4>
                  <ChevronRight
                    className={`w-4 h-4 text-[#E5C158] shrink-0 transition-transform ${
                      faqOpen === index ? 'rotate-90' : ''
                    }`}
                  />
                </div>
                {faqOpen === index && (
                  <p className="text-xs sm:text-sm text-white/70 pt-3 leading-relaxed border-t border-white/10 mt-3">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER COMERCIAL DE ALTA GAMA (SIN ENLACES TÉCNICOS INTERNOS) ══ */}
      <footer className="py-12 px-4 sm:px-8 border-t border-white/10 bg-[#07080A] text-white/60 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E5C158] to-[#8C6D2F] flex items-center justify-center text-[#0A0B0E] font-serif font-bold text-sm">
              V
            </div>
            <div>
              <span className="font-serif font-bold text-white text-sm block">VANESEV</span>
              <span className="text-[10px] text-white/40">Plataforma Cloud de Autor para la Industria de la Belleza</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-white/60">
            <a href="#por-que" className="hover:text-white transition-colors">¿Por qué VANESEV?</a>
            <a href="#superpoderes" className="hover:text-white transition-colors">Superpoderes</a>
            <a href="#casos" className="hover:text-white transition-colors">Casos Reales</a>
            <a href="#planes" className="hover:text-white transition-colors">Planes</a>
            <a href={whatsappCommercialLink} target="_blank" rel="noopener noreferrer" className="text-[#E5C158] hover:text-white font-bold transition-colors">
              Contacto WhatsApp
            </a>
          </div>

          <div className="text-[10px] text-white/40 text-center md:text-right">
            <span>&copy; {new Date().getFullYear()} VANESEV Suite. Todos los derechos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
