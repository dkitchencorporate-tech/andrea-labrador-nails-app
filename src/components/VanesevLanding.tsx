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
  ArrowUpRight,
  CreditCard,
  Building2,
  QrCode,
  SlidersHorizontal,
  X,
  Play
} from 'lucide-react';

interface VanesevLandingProps {
  onOpenCentral?: () => void;
  onSelectTenant: (slug: 'andrea-nails' | 'capra-studio') => void;
}

export const VanesevLanding: React.FC<VanesevLandingProps> = ({
  onSelectTenant,
}) => {
  // Billing cycle toggle
  const [billingCycle, setBillingCycle] = useState<'quarterly' | 'monthly'>('quarterly');

  // Interactive ROI Calculator State
  const [monthlyClients, setMonthlyClients] = useState<number>(120);
  const [averageTicket, setAverageTicket] = useState<number>(25);

  // Interactive Product Simulator
  const [activeFeatureTab, setActiveFeatureTab] = useState<'pwa' | 'agenda' | 'loyalty' | 'finances'>('pwa');
  const [simulatorStamps, setSimulatorStamps] = useState<number>(4);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Checkout / Subscription Modal State
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{
    name: string;
    price: number;
    period: string;
    features: string[];
  } | null>(null);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'card' | 'transfer' | 'binance'>('card');
  const [checkoutSalonName, setCheckoutSalonName] = useState('');
  const [checkoutOwnerPhone, setCheckoutOwnerPhone] = useState('');

  // Calculations
  const platformCommissionLoss = Math.round(monthlyClients * averageTicket * 0.20); // 20% lost to third-party marketplaces
  const retentionExtraRevenue = Math.round(monthlyClients * 0.35 * averageTicket); // 35% extra from 5-stamps club

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const whatsappCommercialLink =
    'https://wa.me/584247429530?text=' +
    encodeURIComponent('¡Hola VANESEV! ✨ Deseo solicitar una demostración personalizada de la plataforma para mi salón.');

  const handleOpenCheckout = (planName: string, price: number) => {
    const period = billingCycle === 'quarterly' ? 'facturación trimestral' : 'facturación mensual';
    setSelectedPlanForCheckout({
      name: planName,
      price: billingCycle === 'quarterly' ? Math.round(price * 0.75) : price,
      period,
      features: [
        'Catálogo interactivo con QR Dinámico (cero re-impresiones)',
        'Club VIP de Fidelización con 5 Sellos digitales',
        'Cero comisiones por reserva (100% de tus ingresos para ti)',
        'PWA instalable en iOS y Android sin pasar por App Store',
        'Soporte directo de puesta en marcha en 24h'
      ]
    });
  };

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForCheckout) return;
    const msg = `¡Hola VANESEV! ✨ Deseo dar de alta mi salón en el plan *${selectedPlanForCheckout.name}* ($${selectedPlanForCheckout.price}/mes, ${selectedPlanForCheckout.period}).\n\n📌 Salón: ${checkoutSalonName || 'Por definir'}\n📱 Contacto: ${checkoutOwnerPhone || 'Por definir'}\n💳 Método de pago preferido: ${checkoutPaymentMethod.toUpperCase()}`;
    window.open('https://wa.me/584247429530?text=' + encodeURIComponent(msg), '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#121316] font-sans selection:bg-[#C5A059]/30 selection:text-[#121316] overflow-x-hidden">
      {/* ══ TOP ANNOUNCEMENT BAR (LUMINOUS GOLD AURA) ══ */}
      <div className="bg-gradient-to-r from-[#FAF3E0] via-[#F4E3BA] to-[#FAF3E0] border-b border-[#E2CE9B]/50 px-4 py-2.5 text-center text-xs font-semibold text-[#664D15] flex items-center justify-center gap-2 shadow-2xs">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B88A36] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B88A36]"></span>
        </span>
        <span>
          <strong>Lanzamiento 2026:</strong> Tu salón digital en 24 horas · Cero comisiones por cita · Pasarelas de pago y tarjeta VIP listas
        </span>
      </div>

      {/* ══ STICKY NAVIGATION HEADER (LUMINOUS FROSTED GLASS) ══ */}
      <header className="sticky top-0 z-40 border-b border-[#EBE5DA] bg-[#FDFBF7]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E5C158] via-[#C5A059] to-[#8C6D2F] flex items-center justify-center text-white font-serif font-black text-xl shadow-md shadow-[#C5A059]/25 shrink-0">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl tracking-wider text-[#121316]">
                  VANESEV
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#C5A059]/15 text-[#8C6D2F] border border-[#C5A059]/30">
                  Haute Studio Suite
                </span>
              </div>
              <p className="text-[11px] text-[#6E7380] hidden sm:block font-medium">
                Plataforma de Autor para Salones de Belleza, Nails, Barberías &amp; Academias
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-[#4B505E]">
            <a href="#por-que" className="hover:text-[#B88A36] transition-colors">¿Por qué VANESEV?</a>
            <a href="#superpoderes" className="hover:text-[#B88A36] transition-colors">Superpoderes</a>
            <a href="#calculadora" className="hover:text-[#B88A36] transition-colors">Calculadora de Ahorro</a>
            <a href="#casos" className="hover:text-[#B88A36] transition-colors">Casos Reales</a>
            <a href="#planes" className="hover:text-[#B88A36] transition-colors">Planes &amp; Precios</a>
            <a href="#preguntas" className="hover:text-[#B88A36] transition-colors">Preguntas</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#planes"
              className="hidden sm:inline-flex px-4 py-2.5 rounded-xl border border-[#DCD5C9] bg-white hover:bg-[#F7F4EE] text-xs font-bold text-[#121316] transition-all shadow-2xs"
            >
              Ver Planes
            </a>
            <a
              href={whatsappCommercialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#B88A36] hover:brightness-105 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#C5A059]/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Pedir Demo VIP</span>
            </a>
          </div>
        </div>
      </header>

      {/* ══ HERO SECTION (LUMINOUS, EDITORIAL, HIGH CONTRAST) ══ */}
      <section className="relative overflow-hidden pt-14 sm:pt-20 pb-20 sm:pb-28 px-4 sm:px-8 border-b border-[#EBE5DA] bg-gradient-to-b from-[#FAF8F5] via-[#FFFFFF] to-[#FDFBF7]">
        {/* Soft luminous ambient aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[450px] bg-gradient-to-b from-[#F9E8BA]/35 via-[#F1D1D8]/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C5A059]/35 text-[#8C6D2F] text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B88A36]" />
            <span>PLATAFORMA INTEGRAL DE AUTOR · CERO COMISIONES POR CITA</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-[#121316] max-w-4xl mx-auto">
            El talento y el salón ya son tuyos.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B88A36] via-[#C5A059] to-[#996D19]">
              Tu marca digital y tus clientas también deben serlo.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#4A4F5E] leading-relaxed max-w-3xl mx-auto">
            Tu propia web app con tu marca para vender sin intermediarios, sincronizar cabinas y especialistas sin solapamientos,
            cobrar con pasarelas automáticas o transferencias y multiplicar visitas repetidas con tu Club VIP de 5 sellos.
            <strong className="text-[#121316]"> Una agenda la tiene cualquiera: nosotros te damos una marca que llena tu local.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <a
              href="#planes"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#B88A36] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/35 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Quiero la plataforma para mi salón</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#calculadora"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-[#F7F4EE] text-[#121316] border border-[#D9D3C7] font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#8C6D2F]" />
              <span>Calcular cuánto dinero me ahorro ↓</span>
            </a>
          </div>

          <p className="text-xs text-[#717786] pt-1">
            ¿Solo quieres probar?{' '}
            <a href={whatsappCommercialLink} target="_blank" rel="noopener noreferrer" className="text-[#8C6D2F] underline underline-offset-4 font-bold hover:text-[#121316]">
              Pide una demo con tu lista de servicios por WhatsApp
            </a>{' '}
            · Te la montamos en 24h sin que tengas que teclear nada.
          </p>

          {/* Key Metrics Strip (Clean White Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-[#EBE5DA] text-left">
            <div className="p-5 rounded-2xl bg-white border border-[#EBE5DA] shadow-xs">
              <span className="font-serif text-3xl font-bold text-[#8C6D2F] block">0%</span>
              <span className="text-xs font-bold text-[#121316] block mt-0.5">Cero Comisiones</span>
              <span className="text-[11px] text-[#6E7380]">El 100% de cada cita cobrada es para tu negocio.</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#EBE5DA] shadow-xs">
              <span className="font-serif text-3xl font-bold text-[#8C6D2F] block">+42%</span>
              <span className="text-xs font-bold text-[#121316] block mt-0.5">Retención de Clientas</span>
              <span className="text-[11px] text-[#6E7380]">Vuelven cada 3 semanas con el Club de 5 sellos.</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#EBE5DA] shadow-xs">
              <span className="font-serif text-3xl font-bold text-[#8C6D2F] block">1 Toque</span>
              <span className="text-xs font-bold text-[#121316] block mt-0.5">PWA Sin Descargas</span>
              <span className="text-[11px] text-[#6E7380]">Se instala en iPhone y Android sin pasar por App Store.</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#EBE5DA] shadow-xs">
              <span className="font-serif text-3xl font-bold text-[#8C6D2F] block">24h</span>
              <span className="text-xs font-bold text-[#121316] block mt-0.5">Llave en Mano</span>
              <span className="text-[11px] text-[#6E7380]">Nos envías tus servicios y la dejamos operando.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECCIÓN DOLORES REALES (HIGH-CONTRAST LIGHT CARDS) ══ */}
      <section id="por-que" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-[#EBE5DA] bg-[#F7F4EE]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#8C6D2F]">
              ¿Te resulta familiar?
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#121316] tracking-tight">
              Lo que le está costando clientas y dinero a tu salón cada semana.
            </h2>
            <p className="text-sm text-[#555A67]">
              La mayoría de dueñas de salones y barberías pierden hasta el 30% de sus ingresos potenciales por depender de libretas o de chats desbordados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#121316]">
                Citas perdidas en WhatsApp e Instagram a deshoras
              </h3>
              <p className="text-xs sm:text-sm text-[#555A67] leading-relaxed">
                Tus clientas quieren agendar a las 11 de la noche o en domingo. Cuando estás atendiendo o descansando no puedes responder de inmediato,
                y para cuando abres el chat, <strong className="text-[#121316]">ya agendaron en otro salón que sí tenía reserva digital en 1 clic.</strong>
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#121316]">
                Apps intermediarias que cobran comisión y te roban la clienta
              </h3>
              <p className="text-xs sm:text-sm text-[#555A67] leading-relaxed">
                Las plataformas de directorios te cobran entre el 15% y el 25% de comisión por cada cita y, lo que es peor:
                <strong className="text-[#121316]"> ponen el banner de tu competencia justo al lado de tu perfil</strong>. El cliente es de ellos, no tuyo.
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#121316]">
                Solapamiento de cabinas y caos de comisiones del equipo
              </h3>
              <p className="text-xs sm:text-sm text-[#555A67] leading-relaxed">
                Dos especialistas agendan al mismo tiempo en la misma cabina o estación, los tiempos se retrasan y al final de la semana
                tienes que pasar horas con la calculadora <strong className="text-[#121316]">revisando boletas manuales para calcular las comisiones de cada quien.</strong>
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#121316]">
                Cero fidelización: prueban una vez y no vuelven
              </h3>
              <p className="text-xs sm:text-sm text-[#555A67] leading-relaxed">
                Sin un motivo emocional y tangible para regresar, tus clientas rotan constantemente.
                Una tarjeta de papel se pierde en la cartera. <strong className="text-[#121316]">Una tarjeta digital VIP con 5 sellos en su teléfono garantiza que vuelvan a completar su ciclo.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CALCULADORA INTERACTIVA DE AHORRO & ROI ══ */}
      <section id="calculadora" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-[#EBE5DA] bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#8C6D2F]">
              Calculadora en tiempo real
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#121316] tracking-tight">
              Mira cuánto dinero estás dejando sobre la mesa.
            </h2>
            <p className="text-sm text-[#555A67]">
              Ajusta los números promedio de tu salón y comprueba el impacto financiero de operar con tu propia plataforma VANESEV:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF8F5] p-6 sm:p-10 rounded-3xl border border-[#EAE3D6] shadow-sm">
            {/* Interactive Sliders */}
            <div className="lg:col-span-7 space-y-7">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#121316]">
                    Clientas atendidas al mes
                  </label>
                  <span className="text-base font-black text-[#8C6D2F] bg-white px-3 py-1 rounded-xl border border-[#E0D8CB]">
                    {monthlyClients} citas
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="600"
                  step="10"
                  value={monthlyClients}
                  onChange={(e) => setMonthlyClients(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#E2DBD0] rounded-lg appearance-none cursor-pointer accent-[#B88A36]"
                />
                <div className="flex justify-between text-[11px] text-[#787E8E] mt-1 font-medium">
                  <span>30 citas</span>
                  <span>300 citas</span>
                  <span>600 citas</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#121316]">
                    Ticket promedio por servicio
                  </label>
                  <span className="text-base font-black text-[#8C6D2F] bg-white px-3 py-1 rounded-xl border border-[#E0D8CB]">
                    ${averageTicket} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={averageTicket}
                  onChange={(e) => setAverageTicket(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#E2DBD0] rounded-lg appearance-none cursor-pointer accent-[#B88A36]"
                />
                <div className="flex justify-between text-[11px] text-[#787E8E] mt-1 font-medium">
                  <span>$10 USD</span>
                  <span>$60 USD</span>
                  <span>$120 USD</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EAE3D6] text-xs text-[#555A67] leading-relaxed">
                💡 <strong>¿Por qué el 0% de comisiones importa tanto?</strong> Si una app externa te quita el 20%, en un salón de {monthlyClients} citas estás regalando <strong>${platformCommissionLoss} USD todos los meses</strong>. Con VANESEV ese dinero se queda en tu bolsillo.
              </div>
            </div>

            {/* Live Results Panel */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#1A1C22] to-[#0E1015] text-white p-7 sm:p-8 rounded-3xl shadow-xl space-y-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#C5A059]/25 text-[#E5C158] border border-[#C5A059]/40">
                Impacto Financiero Mensual
              </span>

              <div className="space-y-4">
                <div className="border-b border-white/10 pb-4">
                  <span className="text-xs text-white/60 block">Ahorro en Comisiones Perdidas</span>
                  <span className="text-3xl font-serif font-black text-[#E5C158] block mt-0.5">
                    +${platformCommissionLoss.toLocaleString()} USD
                  </span>
                  <span className="text-[11px] text-white/40">Dinero que antes se quedaba un intermediario.</span>
                </div>

                <div>
                  <span className="text-xs text-white/60 block">Ingreso Adicional por Club VIP</span>
                  <span className="text-3xl font-serif font-black text-emerald-400 block mt-0.5">
                    +${retentionExtraRevenue.toLocaleString()} USD
                  </span>
                  <span className="text-[11px] text-white/40">Clientas recurrentes que vuelven cada 3 semanas.</span>
                </div>
              </div>

              <a
                href="#planes"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5C158] via-[#C5A059] to-[#D4AF37] text-[#0A0B0E] font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#C5A059]/20 hover:brightness-110 transition-all cursor-pointer"
              >
                <span>Empezar a Ahorrar con VANESEV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DEMOSTRACIÓN INTERACTIVA: "UNA SUITE, CUATRO SUPERPODERES" ══ */}
      <section id="superpoderes" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-[#EBE5DA] bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#8C6D2F]">
              Por dentro
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#121316] tracking-tight">
              Una plataforma. Cuatro superpoderes.
            </h2>
            <p className="text-sm text-[#555A67]">
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
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeFeatureTab === tab.id
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#B88A36] text-white shadow-md shadow-[#C5A059]/30 font-black'
                    : 'bg-white hover:bg-[#F2ECE1] text-[#4B505E] border border-[#DDD6C8]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Interactive Feature Content Card */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E1D3] shadow-md max-w-5xl mx-auto">
            {activeFeatureTab === 'pwa' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#C5A059]/15 text-[#8C6D2F] border border-[#C5A059]/30">
                    Experiencia Móvil Sin Fricción
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#121316]">
                    Catálogo de Autor en el bolsillo de tu clienta
                  </h3>
                  <p className="text-sm text-[#555A67] leading-relaxed">
                    Tus clientas abren tu enlace o escanean tu QR físico en mesa y acceden de inmediato a tus servicios con fotos reales,
                    precios transparentes y disponibilidad en vivo. Se instala con un toque en la pantalla de inicio de su iPhone o Android sin descargas pesadas.
                  </p>
                  <ul className="space-y-2.5 text-xs text-[#2A2E38] font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8C6D2F]" />
                      <span>Fotos HD, tiempo estimado y descripción del servicio</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8C6D2F]" />
                      <span>Cálculo automático de tasa de cambio (USD y moneda local)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8C6D2F]" />
                      <span>QR Dinámico que se edita en la nube sin volver a imprimir</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8E1D3] text-center space-y-4 shadow-inner">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-[#C5A059]/30 mx-auto flex items-center justify-center text-[#8C6D2F] shadow-xs">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#121316]">Tecnología QR Dinámico</h4>
                  <p className="text-xs text-[#6E7380] max-w-xs mx-auto">
                    Imprime tu QR una sola vez en espejos, tarjetas o acrílicos. Cambia los precios o el destino desde tu panel y el QR se actualiza al instante.
                  </p>
                </div>
              </div>
            )}

            {activeFeatureTab === 'agenda' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#C5A059]/15 text-[#8C6D2F] border border-[#C5A059]/30">
                    Sincronización Inteligente
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#121316]">
                    Selector de Especialista y Cabinas Sin Solapamiento
                  </h3>
                  <p className="text-sm text-[#555A67] leading-relaxed">
                    Tu clienta elige exactamente quién la atiende y en qué cabina o estación. El sistema bloquea automáticamente los horarios ocupados
                    para que nunca más dos especialistas se crucen en el mismo espacio.
                  </p>
                  <ul className="space-y-2.5 text-xs text-[#2A2E38] font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8C6D2F]" />
                      <span>Bloqueo instantáneo de franjas horarias ocupadas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8C6D2F]" />
                      <span>Confirmación directa por WhatsApp con mensaje pre-armado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8C6D2F]" />
                      <span>Gestión de pausas y días no laborables por especialista</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E1D3] space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#121316] border-b border-[#E8E1D3] pb-2">
                    <span>Cabina Principal · Hoy</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">3 Citas Agendadas</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-[#E2DBD0] flex justify-between items-center">
                      <div>
                        <strong className="block text-[#121316]">10:00 AM · Nivelación Rubber</strong>
                        <span className="text-[#6E7380] text-[11px]">Especialista: Andrea</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">Confirmada</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#E2DBD0] flex justify-between items-center">
                      <div>
                        <strong className="block text-[#121316]">02:30 PM · Jelly Tips + Spa</strong>
                        <span className="text-[#6E7380] text-[11px]">Especialista: María</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">En Cabina</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'loyalty' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#C5A059]/15 text-[#8C6D2F] border border-[#C5A059]/30">
                    Fidelización Comprobada
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#121316]">
                    Tarjeta Digital VIP de 5 Sellos
                  </h3>
                  <p className="text-sm text-[#555A67] leading-relaxed">
                    Las tarjetas de cartón se botan. Tu tarjeta VIP vive en el móvil de tu clienta con su número de teléfono.
                    Por cada visita que realiza, acumula un sello digital. Al 5to sello, desbloquea su beneficio exclusivo (descuento o servicio de regalo).
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs font-bold text-[#121316]">Simular sellos de visita:</span>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setSimulatorStamps(num)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          simulatorStamps >= num
                            ? 'bg-[#B88A36] text-white shadow-xs'
                            : 'bg-[#EAE3D6] text-[#717786]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#1E2028] to-[#121318] text-white p-6 rounded-2xl shadow-lg space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] tracking-widest text-[#E5C158] uppercase font-bold block">Tarjeta VIP Oficial</span>
                      <strong className="text-base text-white">Clienta Fiel · Mariana R.</strong>
                    </div>
                    <span className="text-xs font-black text-[#E5C158] bg-white/10 px-2.5 py-1 rounded-full">
                      {simulatorStamps}/5 Sellos
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        className={`h-12 rounded-xl flex items-center justify-center border transition-all ${
                          simulatorStamps >= s
                            ? 'bg-gradient-to-br from-[#E5C158] to-[#C5A059] text-[#121316] border-[#E5C158] shadow-sm'
                            : 'bg-white/5 border-white/10 text-white/30'
                        }`}
                      >
                        {simulatorStamps >= s ? <Sparkles className="w-5 h-5 fill-current" /> : <span className="text-xs font-bold">{s}</span>}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/60 text-center">
                    {simulatorStamps === 5
                      ? '🎉 ¡Felicidades! Beneficio VIP listo para canjear en caja.'
                      : `Faltan ${5 - simulatorStamps} visitas para desbloquear el regalo VIP.`}
                  </p>
                </div>
              </div>
            )}

            {activeFeatureTab === 'finances' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#C5A059]/15 text-[#8C6D2F] border border-[#C5A059]/30">
                    Control Financiero Transparente
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#121316]">
                    Comisiones de especialistas calculadas al centavo
                  </h3>
                  <p className="text-sm text-[#555A67] leading-relaxed">
                    Adiós a los domingos perdidos sacando cuentas en libretas. Cada especialista tiene su porcentaje asignado
                    y el sistema reporta exactamente cuánto facturó el salón y cuánto le corresponde a cada miembro del equipo.
                  </p>
                  <ul className="space-y-2.5 text-xs text-[#2A2E38] font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8C6D2F]" />
                      <span>Liquidación semanal o mensual con 1 clic</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8C6D2F]" />
                      <span>Métricas de servicios más rentables y horas pico</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#8C6D2F]" />
                      <span>Preparado para conectar pasarelas de suscripción y cobros</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E1D3] space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-[#121316] border-b border-[#E8E1D3] pb-2">
                    <span>Resumen de Equipo (Semana Actual)</span>
                    <span className="text-[#8C6D2F]">$1,240 USD Facturados</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-[#E2DBD0] flex justify-between items-center">
                      <div>
                        <strong className="block text-[#121316]">Andrea (Nails Specialist)</strong>
                        <span className="text-[#6E7380] text-[11px]">24 servicios · 60%</span>
                      </div>
                      <span className="font-bold text-[#121316]">$420 USD Comis.</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-[#E2DBD0] flex justify-between items-center">
                      <div>
                        <strong className="block text-[#121316]">María (Estilismo &amp; Alisados)</strong>
                        <span className="text-[#6E7380] text-[11px]">18 servicios · 55%</span>
                      </div>
                      <span className="font-bold text-[#121316]">$385 USD Comis.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ CASOS DE ÉXITO REALES (ANDREA NAILS & CAPRA STUDIO) ══ */}
      <section id="casos" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-[#EBE5DA] bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#8C6D2F]">
              Casos Reales en Marcha
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#121316] tracking-tight">
              Salones que ya tienen su propia marca de culto.
            </h2>
            <p className="text-sm text-[#555A67]">
              Cada salón tiene su propia identidad estética de autor, tipografía y catálogo independiente:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Andrea Labrador Card */}
            <div className="p-7 sm:p-8 rounded-3xl bg-[#F6F8F5] border border-[#D5DFD8] shadow-sm space-y-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#203A2B] text-[#E8EFEA]">
                  Estudio Nails &amp; Pedi Spa
                </span>
                <span className="text-xs text-[#203A2B] font-bold">Cordero &amp; San Cristóbal</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1D3326]">
                Andrea Labrador Nails Studio
              </h3>
              <p className="text-xs sm:text-sm text-[#3E5246] leading-relaxed">
                Especialista en salud de uña natural, nivelación Rubber, Jelly Tips y Pedicure Spa.
                Opera con su catálogo digital PWA, agenda directa y tarjeta VIP 6+1.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onSelectTenant('andrea-nails')}
                  className="px-5 py-2.5 rounded-xl bg-[#203A2B] text-white hover:bg-[#16291E] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Ver Salón de Andrea Labrador</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Capra Studio Card */}
            <div className="p-7 sm:p-8 rounded-3xl bg-[#FAF5F6] border border-[#E8D4D8] shadow-sm space-y-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#B5838D] text-white">
                  Estudio Integral &amp; Academia
                </span>
                <span className="text-xs text-[#8A5661] font-bold">By María Capra</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2D1E22]">
                Capra Studio · Alta Peluquería &amp; Academy
              </h3>
              <p className="text-xs sm:text-sm text-[#664950] leading-relaxed">
                6 departamentos especializados (Cejas, Pestañas, Alisados Orgánicos, Maquillaje Pro y Uñas)
                junto a la destacada <strong>Capra Academy</strong> con formación certificada.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onSelectTenant('capra-studio')}
                  className="px-5 py-2.5 rounded-xl bg-[#B5838D] text-white hover:bg-[#A06C77] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Ver Experiencia Capra Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PLANES & PRECIOS (PREPARADOS PARA PASARELAS DE SUSCRIPCIÓN) ══ */}
      <section id="planes" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-[#EBE5DA] bg-[#F7F4EE]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#8C6D2F]">
              Inversión Clara Sin Letra Pequeña
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#121316] tracking-tight">
              Elige el plan ideal para escalar tu salón.
            </h2>
            <p className="text-sm text-[#555A67]">
              Cero comisiones por reserva. Paga en moneda local, transferencia, tarjeta internacional o Binance Pay:
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 p-1.5 bg-white rounded-2xl border border-[#DCD5C9] shadow-xs mt-4">
              <button
                onClick={() => setBillingCycle('quarterly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'quarterly'
                    ? 'bg-[#B88A36] text-white shadow-xs font-black'
                    : 'text-[#6E7380] hover:text-[#121316]'
                }`}
              >
                Trimestral · Ahorra 25% 🔥
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#B88A36] text-white shadow-xs font-black'
                    : 'text-[#6E7380] hover:text-[#121316]'
                }`}
              >
                Mensual
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan 1: Estudio Independiente */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0D8CB] shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-[#717786]">
                  Para Especialistas
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#121316]">Estudio Independiente</h3>
                <p className="text-xs text-[#555A67]">
                  Ideal para manicuristas, estilistas o lashistas que operan en su propio local o cabina privada.
                </p>
                <div className="pt-2">
                  <span className="text-4xl font-serif font-black text-[#121316]">
                    ${billingCycle === 'quarterly' ? '22' : '29'}
                  </span>
                  <span className="text-xs text-[#717786]"> USD / mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#373A43] pt-4 border-t border-[#EAE3D6]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>1 Especialista / 1 Cabina</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>Catálogo interactivo con QR Dinámico</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>Tarjeta VIP con 5 Sellos digitales</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>Citas directas por WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>0% de comisiones por reserva</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenCheckout('Estudio Independiente', 29)}
                className="w-full py-3.5 rounded-xl border border-[#C5A059] bg-[#FAF6EE] hover:bg-[#F2ECE1] text-[#8C6D2F] font-black text-xs transition-colors cursor-pointer"
              >
                Elegir Plan Independiente
              </button>
            </div>

            {/* Plan 2: Salón Pro (Más Popular) */}
            <div className="p-7 rounded-3xl bg-white border-2 border-[#C5A059] shadow-lg space-y-6 flex flex-col justify-between relative transform md:-translate-y-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B88A36] text-white text-[10px] font-black uppercase tracking-widest shadow-xs">
                Más Elegido por Salones
              </div>
              <div className="space-y-4 pt-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#8C6D2F]">
                  Para Equipos &amp; Salones
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#121316]">Salón Pro</h3>
                <p className="text-xs text-[#555A67]">
                  Para salones de belleza y barberías con varios puestos de trabajo y colaboradoras.
                </p>
                <div className="pt-2">
                  <span className="text-4xl font-serif font-black text-[#8C6D2F]">
                    ${billingCycle === 'quarterly' ? '44' : '59'}
                  </span>
                  <span className="text-xs text-[#717786]"> USD / mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#373A43] pt-4 border-t border-[#EAE3D6]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <strong>Hasta 5 Especialistas y Cabinas</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>Selector inteligente sin cruces de horario</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>Cálculo automático de comisiones del equipo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>QR Vectorial para imprimir en mesa y espejo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>Puesta en marcha asistida en 24 horas</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenCheckout('Salón Pro', 59)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#B88A36] text-white font-black text-xs shadow-md shadow-[#C5A059]/30 hover:brightness-105 transition-all cursor-pointer"
              >
                Activar Plan Salón Pro
              </button>
            </div>

            {/* Plan 3: Haute Studio & Academia */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0D8CB] shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-[#717786]">
                  Grandes Marcas &amp; Cursos
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#121316]">Haute Studio &amp; Academia</h3>
                <p className="text-xs text-[#555A67]">
                  Para centros integrales de belleza que combinan servicios estéticos con cursos y capacitaciones.
                </p>
                <div className="pt-2">
                  <span className="text-4xl font-serif font-black text-[#121316]">
                    ${billingCycle === 'quarterly' ? '74' : '99'}
                  </span>
                  <span className="text-xs text-[#717786]"> USD / mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#373A43] pt-4 border-t border-[#EAE3D6]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <strong>Especialistas y Cabinas Ilimitadas</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>Módulo de Cursos &amp; Capra Academy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>Dominio propio o slug prioritario</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>Pasarelas integradas (Tarjetas / Zelle / Binance)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8C6D2F]" />
                    <span>Soporte prioritario y concierge de diseño</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenCheckout('Haute Studio & Academia', 99)}
                className="w-full py-3.5 rounded-xl border border-[#C5A059] bg-[#FAF6EE] hover:bg-[#F2ECE1] text-[#8C6D2F] font-black text-xs transition-colors cursor-pointer"
              >
                Elegir Plan Academia
              </button>
            </div>
          </div>

          {/* Payment Methods Banner */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8E1D3] text-center space-y-3 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E7380] block">
              Métodos de Pago Soportados para tu Suscripción
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-[#121316]">
              <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-[#8C6D2F]" /> Tarjetas Débito / Crédito Internacionales</span>
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-[#8C6D2F]" /> Transferencia Bancaria &amp; Pago Móvil</span>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-[#8C6D2F]" /> Zelle Directo</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#8C6D2F]" /> Binance Pay &amp; USDT Cripto</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ SECTION ══ */}
      <section id="preguntas" className="py-20 sm:py-28 px-4 sm:px-8 border-b border-[#EBE5DA] bg-white">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#8C6D2F]">
              Preguntas Frecuentes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#121316] tracking-tight">
              Todo lo que necesitas saber antes de empezar.
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: '¿Cómo funciona la puesta en marcha en 24 horas?',
                a: 'Nos envías tu lista de servicios, fotos de tu trabajo y precios (incluso en una foto de cuaderno o por notas de audio de WhatsApp). Nuestro equipo técnico carga tu catálogo, configura tus especialistas y te entrega tu enlace y QR listo para usar en 24 horas hábiles.'
              },
              {
                q: '¿Tengo que pagar comisiones por cada cliente que agende?',
                a: 'Cero. Ni un solo centavo. A diferencia de otras apps que te quitan el 15% o 20% de cada corte o manicure, en VANESEV solo pagas tu suscripción fija mensual y el 100% de lo que cobras es tuyo.'
              },
              {
                q: '¿Mis clientas tienen que descargar una app de la App Store o Play Store?',
                a: 'No. Al abrir tu enlace en su navegador, pueden instalar tu PWA directamente en su pantalla de inicio con 1 toque. Es ultra liviana (menos de 2 MB), no ocupa espacio en su teléfono y no les pide contraseñas complicadas.'
              },
              {
                q: '¿Qué pasa si ya tengo un código QR impreso?',
                a: 'Con nuestra tecnología de QR Dinámico, generas un código maestro que puedes imprimir en acrílicos o tarjetas. Si mañana cambias de local, de teléfono o de servicios, solo actualizas el destino en tu panel y el código impreso sigue funcionando a la perfección.'
              },
              {
                q: '¿Cómo puedo pagar la suscripción de mi salón?',
                a: 'Aceptamos transferencias bancarias locales, Pago Móvil, tarjetas de débito/crédito internacionales, Zelle y Binance Pay (USDT). La activación es inmediata una vez confirmado el pago.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#E8E1D3] bg-[#FAF8F5] overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-serif text-base font-bold text-[#121316] flex justify-between items-center cursor-pointer hover:bg-[#F2ECE1] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg text-[#8C6D2F] font-mono">{faqOpen === idx ? '−' : '+'}</span>
                </button>
                {faqOpen === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#555A67] leading-relaxed border-t border-[#E8E1D3]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL HIGH-CONVERSION CTA ══ */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 bg-gradient-to-br from-[#1A1C22] via-[#121318] to-[#0A0B0E] text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C5A059]/20 blur-3xl pointer-events-none rounded-full" />
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#C5A059]/25 text-[#E5C158] border border-[#C5A059]/40">
            Paso al Siguiente Nivel
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Tu salón merece una plataforma a la altura de tu talento.
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
            Deja atrás el desorden de chats, libretas y comisiones abusivas. Habla hoy mismo con un consultor y estrena tu propia Suite en 24 horas.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={whatsappCommercialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E5C158] via-[#C5A059] to-[#D4AF37] text-[#0A0B0E] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/30 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Solicitar Demostración por WhatsApp</span>
            </a>
            <a
              href="#planes"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Ver Planes y Precios</span>
            </a>
          </div>
        </div>
      </section>

      {/* ══ CLEAN LUXURY FOOTER ══ */}
      <footer className="border-t border-[#EBE5DA] bg-white py-12 px-4 sm:px-8 text-xs text-[#6E7380]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C5A059] text-white flex items-center justify-center font-serif font-black text-sm">
              V
            </div>
            <div>
              <strong className="text-sm text-[#121316] font-serif block">VANESEV PLATFORM</strong>
              <span className="text-[11px] text-[#8A8F9E]">Haute Studio Suite · Tecnología de Autor para Salones</span>
            </div>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <a href="#por-que" className="hover:text-[#121316]">Beneficios</a>
            <a href="#superpoderes" className="hover:text-[#121316]">Superpoderes</a>
            <a href="#planes" className="hover:text-[#121316]">Planes</a>
            <a href="/central" className="hover:text-[#121316] text-[#8C6D2F]">Acceso Central</a>
          </div>
          <div className="text-center sm:text-right">
            <span>© 2026 VANESEV. Todos los derechos reservados.</span>
          </div>
        </div>
      </footer>

      {/* ══ CHECKOUT / SUBSCRIPTION MODAL ══ */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 bg-[#121316]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E8E1D3] shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-[#EAE3D6] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8C6D2F] block">
                  Alta de Salón · {selectedPlanForCheckout.period}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#121316]">
                  Activar Plan {selectedPlanForCheckout.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlanForCheckout(null)}
                className="p-1.5 rounded-xl hover:bg-[#F2ECE1] text-[#717786] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D3] flex justify-between items-center">
              <div>
                <span className="text-xs text-[#555A67] block">Inversión mensual</span>
                <strong className="text-2xl font-serif text-[#121316]">${selectedPlanForCheckout.price} USD / mes</strong>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                0% Comisiones
              </span>
            </div>

            <form onSubmit={handleConfirmCheckout} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#121316] block mb-1">
                  Nombre de tu Salón / Estudio:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Glam Studio Hair & Nails"
                  value={checkoutSalonName}
                  onChange={(e) => setCheckoutSalonName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5CDC0] bg-white text-xs font-medium focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#121316] block mb-1">
                  Tu WhatsApp de contacto:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: +58 424 1234567"
                  value={checkoutOwnerPhone}
                  onChange={(e) => setCheckoutOwnerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5CDC0] bg-white text-xs font-medium focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#121316] block mb-1.5">
                  Método de Pago Preferido:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'card', label: 'Tarjeta', icon: CreditCard },
                    { id: 'transfer', label: 'Transfer / Zelle', icon: Building2 },
                    { id: 'binance', label: 'Binance / USDT', icon: Zap },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setCheckoutPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        checkoutPaymentMethod === m.id
                          ? 'border-[#C5A059] bg-[#FAF6EE] text-[#8C6D2F]'
                          : 'border-[#E0D8CB] bg-white text-[#6E7380] hover:bg-[#F9F6F0]'
                      }`}
                    >
                      <m.icon className="w-4 h-4" />
                      <span className="text-[11px]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#B88A36] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/30 hover:brightness-105 transition-all cursor-pointer"
                >
                  <span>Continuar con mi Alta por WhatsApp VIP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-[#717786] text-center mt-2">
                  Activación asistida por un asesor en menos de 10 minutos. Sin cobros sorpresa.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
