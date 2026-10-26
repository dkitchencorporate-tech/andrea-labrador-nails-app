import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Calendar,
  QrCode,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Star,
  Users,
  Palette,
  Sliders,
  Smartphone,
  Award,
  TrendingUp,
  MessageCircle,
  Layers,
  Eye,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  MapPin,
  Crown,
  Lock,
  BookOpen,
  Building2,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  SALON_PALETTES,
  SALON_TYPOGRAPHIES,
  SALON_LAYOUTS,
  SalonPaletteId,
  SalonTypographyId,
  SalonCardLayoutId,
  getPaletteById,
  getTypographyById,
} from '../utils/salonThemeEngine';

interface VanesevLandingProps {
  onOpenCapraDemo: () => void;
  onOpenAndreaDemo: () => void;
  onClientLoginSuccess: (slug: string) => void;
}

const SECTORS = [
  {
    id: 'brows-lashes',
    tag: 'Brows, Lashes & MakeUp',
    title: 'Estudios de Mirada & Maquillaje de Autor',
    subtitle: 'Laminado, Lifting, Extensiones Seda y Piel Blindada',
    image: '/capra/brow-lamination.jpg',
    problemSolved:
      'Elimina las 40 preguntas diarias de "¿qué diferencia hay entre lifting y extensiones?" con fichas editoriales fotográficas y reserva por especialista.',
    metrics: '+42% conversión en paquetes combinados de cejas + pestañas',
    servicesPreview: [
      { name: 'Brow Lamination + Botox Nutritivo', duration: '50 min', price: '$20' },
      { name: 'Lifting de Pestañas + Keratina', duration: '60 min', price: '$22' },
      { name: 'Maquillaje Social Piel Blindada HD', duration: '75 min', price: '$35' },
    ],
  },
  {
    id: 'hair-atelier',
    tag: 'Hair Color & Styling',
    title: 'Salones de Alta Peluquería & Colorimetría',
    subtitle: 'Balayage, Alisados Orgánicos, Hidratación Profunda & Ondas',
    image: '/vanesev/sector-hair-color.jpg',
    problemSolved:
      'Bloquea automáticamente sillones de lavado y estilistas durante 3 o 4 horas sin cruces de agenda ni esperas incómodas en recepción.',
    metrics: '0 sobrecupos en sesiones largas de colorimetría y alisados',
    servicesPreview: [
      { name: 'Alisado Orgánico Brillo Espejo', duration: '150 min', price: '$45' },
      { name: 'Diseño Balayage & Matiz Gloss', duration: '180 min', price: '$85' },
      { name: 'Peinado de Gala & Ondas Hollywood', duration: '60 min', price: '$25' },
    ],
  },
  {
    id: 'medspa-clinic',
    tag: 'Aesthetic & MedSpa',
    title: 'Clínicas Estéticas, Cabinas Faciales & Spa',
    subtitle: 'Armonización, Hidrafacial, Depilación Láser & Rituales Detox',
    image: '/vanesev/sector-medspa.jpg',
    problemSolved:
      'Asigna cabinas médicas y aparatología por separado, registrando el historial de sesiones y premiando la constancia del paciente.',
    metrics: '78% de pacientes completan su protocolo de 5 sesiones',
    servicesPreview: [
      { name: 'Protocolo Glow Hidrafacial & LED', duration: '60 min', price: '$55' },
      { name: 'Depilación Corporal Piel de Seda', duration: '45 min', price: '$25' },
      { name: 'Ritual Corporal Botánico Detox', duration: '90 min', price: '$65' },
    ],
  },
  {
    id: 'nails-spa',
    tag: 'Nail Bar & Foot Spa',
    title: 'Nail Bars Boutique & Spa de Manos y Pies',
    subtitle: 'Sistemas Estructurales, Manicura Rusa & Pedicure Botánico',
    image: '/capra/nails-french.jpg',
    problemSolved:
      'Permite que la clienta elija su nivel de diseño, largo y extras antes de llegar al salón, calculando tiempo exacto de mesa y costo en USD/Bs.',
    metrics: '+31% ticket promedio gracias a extras sugeridos en reserva',
    servicesPreview: [
      { name: 'Sistema Estructural Micro-French', duration: '90 min', price: '$25' },
      { name: 'Pedicure Spa Detox con Pétalos', duration: '60 min', price: '$20' },
      { name: 'Nivelación Gel Calcio + Brillo Seda', duration: '60 min', price: '$18' },
    ],
  },
  {
    id: 'barber-lounge',
    tag: 'Gentlemen Grooming',
    title: 'Barberías de Autor & Grooming Lounges',
    subtitle: 'Corte Esculpido, Ritual de Barba con Toalla Caliente & Facial',
    image: '/vanesev/sector-barber-lounge.jpg',
    problemSolved:
      'El cliente escanea el QR en el sillón o entra desde Instagram, elige a su barbero de confianza y agenda en 12 segundos sin llamar.',
    metrics: 'Fidelización automática cada 5 cortes con ritual de barba gratis',
    servicesPreview: [
      { name: 'Corte de Autor + Ritual Toalla Caliente', duration: '60 min', price: '$25' },
      { name: 'Perfilado de Barba & Vapor Ozono', duration: '35 min', price: '$15' },
      { name: 'Black Mask Detox & Cuidado Capilar', duration: '45 min', price: '$20' },
    ],
  },
];

const EDITORIAL_ARTICLES = [
  {
    id: 'whatsapp-loss',
    category: 'Rentabilidad & Recepción',
    readTime: '4 min lectura',
    title: 'Por qué el 38% de las clientas de Instagram no terminan agendando cuando tardas más de 20 minutos en responder',
    excerpt:
      'Analizamos el comportamiento real de reserva en salones de cejas, peluquerías y spas: la clienta decide en un impulso visual y necesita ver precios y turnos al instante.',
    image: '/capra/makeup-blindada.jpg',
    content: [
      'En el sector de la belleza y el bienestar, más del 65% de las consultas por WhatsApp ocurren mientras las especialistas están atendiendo con las manos ocupadas o fuera del horario comercial (entre las 8:00 PM y las 11:00 PM).',
      'Cuando una clienta ve un reel de un laminado de cejas o un alisado orgánico en Instagram y hace clic en el enlace de tu biografía, su intención de compra está en el punto máximo. Si se encuentra con un chat donde debe esperar dos horas para saber cuánto cuesta y qué día hay turno libre, el 38% abandona la intención o escribe a otro estudio.',
      'Con una Carta Interactiva QR y Reserva Conectada (/m/tu-salon), la clienta explora fotografías reales, verifica precios transparentes en USD y Bolívares (BCV), elige su especialista y envía su solicitud de turno ya estructurada a tu WhatsApp en 15 segundos.',
    ],
  },
  {
    id: 'vip-passport-psychology',
    category: 'Fidelización & Psicología',
    readTime: '5 min lectura',
    title: 'El efecto de la tarjeta sellada: cómo un Pasaporte VIP digital duplica la frecuencia de visita sin regalar tu trabajo',
    excerpt:
      'Las tarjetas de cartón se pierden en la cartera. Descubre cómo la meta visual de 5 visitas vinculada al número de teléfono convierte clientas ocasionales en embajadoras.',
    image: '/capra/lash-extensions.jpg',
    content: [
      'En psicología del consumidor existe el principio de "meta dotada": cuando una clienta visualiza su progreso hacia un premio concreto (por ejemplo, 5 visitas verificadas = Ritual Hidratante o Diseño de Cejas de Cortesía), acelera su ciclo de recompra un 34%.',
      'El problema tradicional de los salones eran las tarjetas impresas en cartulina: las clientas las olvidaban al cambiar de bolso o se deterioraban.',
      'Con el Pasaporte VIP Digital de VANESEV, tu clienta solo ingresa su número de teléfono desde tu catálogo QR para ver sus sellos iluminados en pantalla. Cada vez que culminas su cita en tu panel ejecutivo Vertix, el sistema acredita el sello automáticamente.',
    ],
  },
  {
    id: 'author-brand-vs-directories',
    category: 'Marca Propia vs. Directorios',
    readTime: '4 min lectura',
    title: 'Por qué los salones de alto nivel están abandonando los directorios con comisiones para lanzar su propio sistema de marca',
    excerpt:
      'Pagar hasta un 25% de comisión por cita y aparecer junto a la competencia erosiona tu margen y tu identidad. Tu salón merece su propia arquitectura digital.',
    image: '/vanesev/hero-atelier.jpg',
    content: [
      'Las plataformas de directorio nacieron con la promesa de traer clientes nuevos, pero en la práctica terminan cobrando comisiones sobre tus propias clientas habituales de Instagram y mostrando anuncios de salones competidores justo debajo de tu perfil.',
      'Además, en un directorio todos los salones lucen exactamente iguales: la misma plantilla fría, la misma tipografía genérica y cero personalidad.',
      'VANESEV parte de la filosofía opuesta: tu salón es una firma de autor. Por eso cada sede elige su propia paleta cromática, su par tipográfico editorial y su estilo de tarjetas, manteniendo el 100% de sus ingresos y la propiedad absoluta de su base de datos.',
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: '¿Mis clientas tienen que descargar alguna aplicación o registrarse con contraseña?',
    a: 'No. Tus clientas entran directamente desde el enlace de tu biografía de Instagram o escaneando el código QR en tu recepción (/m/tu-salon). Ven tu catálogo fotográfico, eligen tratamiento, especialista y hora en 15 segundos sin descargar nada.',
  },
  {
    q: '¿Cobran alguna comisión por cada cita reservada o por cada servicio?',
    a: 'Cero comisiones (0%). A diferencia de los directorios que se quedan entre el 15% y el 25% de tu trabajo, en VANESEV solo pagas tu suscripción mensual fija y el 100% de lo que facturas en tu salón es íntegro para ti.',
  },
  {
    q: '¿Puedo cambiar los colores, letras, fotos y precios cuando yo quiera?',
    a: 'Sí, en tiempo real. Desde tu Panel Ejecutivo Vertix tienes acceso al Studio de Diseño de Autor (6 paletas de lujo, 3 combinaciones tipográficas y 3 formatos de carta) y al editor de servicios. Cualquier cambio de precio o tasa BCV se actualiza al instante en todos los teléfonos.',
  },
  {
    q: '¿Necesito comprar un dominio web aparte para mi salón?',
    a: 'No es necesario. Al activar tu salón recibes inmediatamente tu ruta oficial limpia (por ejemplo, vanesev.com/m/capra-studio) y tu kit QR de alta resolución listo para imprimir. Si tienes el plan Maison Multi-Sede y deseas conectar tu propio dominio, también lo configuramos por ti.',
  },
  {
    q: '¿Cómo funciona la confirmación de citas con WhatsApp?',
    a: 'Cuando la clienta selecciona su servicio, fecha y hora en tu carta digital, el sistema registra la reserva en tu agenda y abre automáticamente tu WhatsApp con todos los datos listos. Desde tu panel puedes confirmar, reprogramar o culminar la cita con 1 toque.',
  },
  {
    q: '¿En cuánto tiempo queda listo mi salón si empiezo hoy?',
    a: 'En menos de 24 horas. Nos envías tu lista actual de servicios (en foto, PDF o texto de WhatsApp) y tu logo, y nuestro equipo te entrega tu catálogo fotográfico, tu Pasaporte VIP y tu Panel Ejecutivo listos para publicar.',
  },
];

export const VanesevLanding: React.FC<VanesevLandingProps> = ({
  onOpenCapraDemo,
  onOpenAndreaDemo,
  onClientLoginSuccess,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Phone Simulator State in Hero
  const [phoneStep, setPhoneStep] = useState<'catalog' | 'passport' | 'whatsapp'>('catalog');
  const [phonePaletteId, setPhonePaletteId] = useState<SalonPaletteId>('rose-cashmere');
  const [selectedDemoService, setSelectedDemoService] = useState(0);
  const [selectedDemoTime, setSelectedDemoTime] = useState('10:30 AM');
  const [simulatedStamps, setSimulatedStamps] = useState(4);

  // Interactive Live Theme Studio on Landing Page
  const [studioPaletteId, setStudioPaletteId] = useState<SalonPaletteId>('rose-cashmere');
  const [studioTypographyId, setStudioTypographyId] = useState<SalonTypographyId>('haute-couture');
  const [studioLayoutId, setStudioLayoutId] = useState<SalonCardLayoutId>('editorial-magazine');

  // Active Sector Showcase
  const [activeSectorIdx, setActiveSectorIdx] = useState(0);

  // Real-time Birthday Party Burst state for Vanessa
  const [partyBurstId, setPartyBurstId] = useState(1);

  // Financial Recovery Calculator
  const [avgTicket, setAvgTicket] = useState(28);
  const [missedWeekly, setMissedWeekly] = useState(6);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Active Blog Article Modal
  const [activeArticle, setActiveArticle] = useState<(typeof EDITORIAL_ARTICLES)[0] | null>(null);

  // Commercial Onboarding / Checkout Modal ("Crear mi Salón / Solicitar Alta")
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState('Salon Couture Pro ($29/mes)');
  const [leadSalonName, setLeadSalonName] = useState('');
  const [leadOwnerName, setLeadOwnerName] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');
  const [leadSpecialty, setLeadSpecialty] = useState('Cejas, Pestañas & Maquillaje');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Client Login Modal ("Zona Cliente / Acceso Salón")
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginSalonSlug, setLoginSalonSlug] = useState('capra-studio');
  const [loginAccessPin, setLoginAccessPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Legal Modal State
  const [legalModalTitle, setLegalModalTitle] = useState<string | null>(null);

  // 3D Scroll Perspective Ref
  const showcaseRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: showcaseRef,
    offset: ['start end', 'end start'],
  });
  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], [12, 0, -4]);
  const scale3d = useTransform(scrollYProgress, [0, 0.45, 1], [0.95, 1, 0.98]);

  const phonePalette = getPaletteById(phonePaletteId);
  const studioPalette = getPaletteById(studioPaletteId);
  const studioTypography = getTypographyById(studioTypographyId);
  const activeSector = SECTORS[activeSectorIdx] || SECTORS[0];

  const monthlyRecoveredUSD = avgTicket * missedWeekly * 4;
  const yearlyRecoveredUSD = monthlyRecoveredUSD * 12;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const openCheckoutWithPlan = (planLabel: string) => {
    setSelectedPlanName(planLabel);
    setLeadSubmitted(false);
    setOnboardingModalOpen(true);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitted(true);
    const msg = `Hola equipo VANESEV, quiero activar mi salón en el plan *${selectedPlanName}*.\n\n• Salón: ${leadSalonName || 'Mi Salón'}\n• Responsable: ${leadOwnerName || 'Directora'}\n• Especialidad: ${leadSpecialty}\n• WhatsApp: ${leadWhatsapp}`;
    window.open(`https://wa.me/584223794800?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const handleClientLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const cleanSlug = loginSalonSlug.trim().toLowerCase().replace(/^\/m\//, '').replace(/\/$/, '') || 'capra-studio';
    if (loginAccessPin.trim().length < 3) {
      setLoginError('Introduce tu clave o PIN de acceso del salón (ej: 2026).');
      return;
    }
    setLoginModalOpen(false);
    onClientLoginSuccess(cleanSlug);
  };

  const FLOATING_BIRTHDAY_ITEMS = [
    { emoji: '🩷', left: '4%', delay: 0, duration: 6.5, size: 'text-2xl sm:text-3xl' },
    { emoji: '🌹', left: '11%', delay: 1.1, duration: 7.2, size: 'text-2xl sm:text-4xl' },
    { emoji: '🎂', left: '19%', delay: 0.4, duration: 8.0, size: 'text-2xl sm:text-4xl' },
    { emoji: '💋', left: '27%', delay: 1.8, duration: 6.8, size: 'text-xl sm:text-3xl' },
    { emoji: '🩷', left: '35%', delay: 0.7, duration: 7.5, size: 'text-2xl sm:text-4xl' },
    { emoji: '🎉', left: '44%', delay: 2.1, duration: 6.9, size: 'text-xl sm:text-3xl' },
    { emoji: '🌹', left: '53%', delay: 0.2, duration: 7.4, size: 'text-2xl sm:text-4xl' },
    { emoji: '💖', left: '62%', delay: 1.5, duration: 6.6, size: 'text-2xl sm:text-3xl' },
    { emoji: '💋', left: '71%', delay: 0.9, duration: 7.8, size: 'text-xl sm:text-3xl' },
    { emoji: '🎂', left: '79%', delay: 2.4, duration: 7.1, size: 'text-2xl sm:text-4xl' },
    { emoji: '🩷', left: '87%', delay: 0.5, duration: 6.4, size: 'text-2xl sm:text-4xl' },
    { emoji: '🌹', left: '94%', delay: 1.3, duration: 7.6, size: 'text-2xl sm:text-3xl' },
  ];

  const BURST_PARTICLES = [
    { emoji: '🩷', x: -140, y: -120 },
    { emoji: '🌹', x: 145, y: -115 },
    { emoji: '🎂', x: 0, y: -155 },
    { emoji: '💋', x: -165, y: -25 },
    { emoji: '💖', x: 170, y: -20 },
    { emoji: '🎉', x: -110, y: 110 },
    { emoji: '🌹', x: 115, y: 105 },
    { emoji: '🩷', x: -55, y: -140 },
    { emoji: '💋', x: 65, y: -135 },
    { emoji: '👑', x: 0, y: 130 },
    { emoji: '🌸', x: -130, y: 55 },
    { emoji: '✨', x: 135, y: 60 },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#161214] font-sans selection:bg-[#EC4899]/20 selection:text-[#9D174D] overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════════════
          1. FLOATING CAPSULE COMMERCIAL NAVBAR (100% MOBILE RESPONSIVE, ZERO ADMIN/LOGIN LEAKS)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-2.5 sm:px-6 pt-3 sm:pt-4">
        <nav
          aria-label="Principal"
          className="flex w-full max-w-6xl min-w-0 items-center justify-between gap-2 rounded-full border border-[#EC4899]/25 bg-white/95 text-[#161214] shadow-[0_14px_40px_rgba(219,39,119,0.12)] backdrop-blur-xl py-2 pl-3 sm:pl-5 pr-2 sm:pr-2.5"
        >
          {/* Brand Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 min-w-0 shrink-0"
          >
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-display font-bold text-xs sm:text-sm shadow-xs shrink-0"
              style={{ background: 'linear-gradient(135deg, #EC4899 0%, #E11D74 55%, #9E3B52 100%)' }}
            >
              V
            </div>
            <div className="leading-none truncate">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-[#161214]">
                VANE<span className="text-[#E11D74]">SEV</span>
              </span>
              <span className="block text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.18em] text-[#9D174D] mt-0.5">
                🩷 Edición Vanessa
              </span>
            </div>
          </a>

          {/* Center Commercial Funnel Links (Desktop) */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {[
              { id: 'inicio', label: '🎂 Cumpleaños Vanessa' },
              { id: 'carta-qr', label: 'Carta QR' },
              { id: 'signature', label: 'Atelier Signature' },
              { id: 'personalizador', label: 'Diseño de Autor' },
              { id: 'sectores', label: 'Especialidades' },
              { id: 'precios', label: 'Precios' },
              { id: 'casos', label: 'Casos de Éxito' },
            ].map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold text-[#574B4F] hover:text-[#161214] hover:bg-[#FFF0F5] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right Actions: Responsive CTA + Properly Contained Mobile Menu Button (Zero Login/Admin buttons) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setPartyBurstId((n) => n + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #EC4899 0%, #E11D74 100%)' }}
            >
              <span>🎂</span>
              <span className="hidden xs:inline sm:inline">¡Ir a Dedicatoria de Vanessa!</span>
              <span className="xs:hidden sm:hidden">🩷 Vanessa</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#831843] bg-[#FFF0F5] border border-[#EC4899]/30 lg:hidden shrink-0 cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer — Clean Public Sections Only (Zero Login / Admin Buttons) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed inset-x-3 top-18 z-50 rounded-3xl bg-white border border-[#EC4899]/25 shadow-2xl p-4 sm:p-5 space-y-3 lg:hidden"
            >
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'inicio', label: '🎂 Cumpleaños Vanessa' },
                  { id: 'carta-qr', label: 'Carta QR' },
                  { id: 'signature', label: 'Atelier Signature' },
                  { id: 'personalizador', label: 'Diseño de Autor' },
                  { id: 'sectores', label: 'Especialidades' },
                  { id: 'precios', label: 'Precios & Planes' },
                  { id: 'casos', label: 'Casos de Éxito' },
                  { id: 'faq', label: 'Preguntas Frecuentes' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === 'inicio') {
                        setMobileMenuOpen(false);
                        setPartyBurstId((n) => n + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        scrollToSection(item.id);
                      }
                    }}
                    className="p-3 rounded-2xl bg-[#FFF5F8] text-left text-xs font-bold text-[#831843] border border-[#F472B6]/20"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-[#EC4899]/15 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setPartyBurstId((n) => n + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #EC4899 0%, #E11D74 100%)' }}
                >
                  <span>🎂🩷🌹 Ir Arriba a la Dedicatoria de Vanessa</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════════
          2. HERO ESPECIAL DE CUMPLEAÑOS PARA VANESSA (REAL-TIME PARTY, CAKE, ROSES, HEARTS & DEDICATION)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="inicio"
        className="relative overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24 px-3.5 sm:px-6"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, #FFD6E8 0%, #FFEAF3 42%, #FFF7FA 78%, #FAF7F2 100%)',
        }}
      >
        {/* Continuous Real-Time Floating Hearts 🩷, Roses 🌹, Cakes 🎂 & Kisses 💋 */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
          {FLOATING_BIRTHDAY_ITEMS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ y: '110%', opacity: 0, rotate: -12 }}
              animate={{
                y: ['-10%', '110%'],
                opacity: [0, 0.9, 0.9, 0],
                rotate: [-15, 15, -10],
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                delay: item.delay,
                ease: 'easeInOut',
              }}
              style={{ left: item.left }}
              className={`absolute top-0 select-none ${item.size}`}
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center space-y-6 sm:space-y-8">
          {/* Top Royal Birthday Pill */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border-2 border-[#F472B6] bg-white/95 px-4 sm:px-6 py-2 text-xs sm:text-sm font-extrabold text-[#be185d] shadow-[0_10px_30px_rgba(236,72,153,0.22)]"
          >
            <span>🎂</span>
            <span>¡FELICES 7 AÑOS, MI PRINCESA HERMOSA!</span>
            <span>🩷🌹💋</span>
          </motion.div>

          {/* Giant Birthday Title for Vanessa */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3 sm:space-y-4"
          >
            <h1 className="font-display text-[38px] sm:text-6xl md:text-7xl font-bold leading-[1.04] tracking-tight text-[#831843] drop-shadow-xs">
              ¡Feliz Cumpleaños #7,{' '}
              <span
                className="block sm:inline bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #EC4899 0%, #E11D74 50%, #9D174D 100%)',
                }}
              >
                Vanessa!
              </span>{' '}
              <span className="inline-block animate-bounce">🎂🩷🌹</span>
            </h1>

            <p className="text-base sm:text-2xl font-bold text-[#be185d] max-w-2xl mx-auto leading-snug">
              💋 Te amo con todo mi corazón, mi princesa hermosa 💋
            </p>
          </motion.div>

          {/* Interactive Real-Time Cake, Roses, Hearts & Party Explosion Centerpiece */}
          <div className="relative mx-auto max-w-md py-3">
            {/* Explosion Burst Particles Triggered in Real Time */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={partyBurstId}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
              >
                {BURST_PARTICLES.map((bp, i) => (
                  <motion.span
                    key={i}
                    initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
                    animate={{ x: bp.x, y: bp.y, scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute text-3xl sm:text-4xl select-none"
                  >
                    {bp.emoji}
                  </motion.span>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Glowing Cake & Roses Medallion */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => setPartyBurstId((n) => n + 1)}
              className="mx-auto rounded-[32px] border-2 border-[#F472B6]/60 bg-white/95 p-5 sm:p-6 shadow-[0_20px_60px_rgba(236,72,153,0.25)] cursor-pointer select-none space-y-3"
            >
              <div className="flex items-center justify-center gap-3 sm:gap-5 text-4xl sm:text-6xl">
                <span className="animate-pulse">🌹</span>
                <span className="animate-bounce">🩷</span>
                <span className="text-5xl sm:text-7xl drop-shadow-md">🎂</span>
                <span className="animate-bounce">💋</span>
                <span className="animate-pulse">🌹</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#be185d]">
                ✨ Toca la tarta para lanzar más corazones, besos y rosas ✨
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-full bg-[#FFF0F6] border border-[#F472B6]/40 text-xs font-bold text-[#9D174D]">
                  🎂 Cumpleaños Número 7
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FFF0F6] border border-[#F472B6]/40 text-xs font-bold text-[#9D174D]">
                  🩷 VANESEV = 100% de Vanessa
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FFF0F6] border border-[#F472B6]/40 text-xs font-bold text-[#9D174D]">
                  🌹 Regalo de Papá
                </span>
              </div>
            </motion.div>
          </div>

          {/* FATHER'S WARM, CLOSE DEDICATION CARD (OPTIMIZED FOR PHONE & TABLET READING WITH MOM) */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto max-w-3xl rounded-[32px] sm:rounded-[40px] border-2 border-[#F472B6]/50 bg-white p-6 sm:p-10 md:p-12 text-left shadow-[0_28px_80px_rgba(190,24,93,0.16)] space-y-5 sm:space-y-6 relative overflow-hidden"
          >
            {/* Decorative Corner Roses & Hearts */}
            <div className="flex items-center justify-between border-b border-[#F472B6]/25 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl sm:text-3xl">💌</span>
                <div>
                  <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#E11D74]">
                    Para mi princesa hermosa en sus 7 añitos
                  </p>
                  <p className="font-display text-lg sm:text-2xl font-bold text-[#831843]">
                    De tu papá, con todo mi amor 🩷🌹
                  </p>
                </div>
              </div>
              <span className="text-2xl sm:text-4xl">🎂💋</span>
            </div>

            <div className="space-y-4 sm:space-y-5 text-base sm:text-xl leading-relaxed text-[#4A0E2E] font-medium">
              <p>
                Hola, <strong className="text-[#E11D74] font-extrabold">mi princesa hermosa</strong>: 🩷🌹
              </p>

              <p>
                Hoy cumples <strong className="text-[#9D174D]">7 años</strong>, y el <strong>7 es un gran número</strong>. Por eso hoy es tan especial: porque entras en una etapa nueva de crecimiento, y quiero que la empieces de la manera más grande posible y con todo mi amor.
              </p>

              <div className="rounded-3xl bg-[#FFF0F6] border-2 border-[#F472B6]/40 p-5 sm:p-6 space-y-2.5">
                <p className="font-display text-xl sm:text-2xl font-bold text-[#9D174D]">
                  🎁 Mira cómo se llama este proyecto: <span className="underline decoration-[#EC4899]">VANESEV</span>
                </p>
                <p className="text-base sm:text-xl text-[#831843] leading-relaxed">
                  Lleva tu nombre porque <strong>este proyecto es uno de mis primeros regalos para tu cumpleaños número 7</strong>. Lo creé pensando en ti y <strong>este negocio será tuyo al 100%</strong>, para que siempre tengas algo grande hecho por tu papá con todo el corazón.
                </p>
              </div>

              <p>
                Te mando millones de besos 💋, muchísimas rosas 🌹, tu tarta de cumpleaños 🎂 y el abrazo más fuerte de todos. Disfruta muchísimo hoy, pasa un cumpleaños increíble y recuerda siempre lo mucho que te ama tu papá.
              </p>

              <p className="font-extrabold text-lg sm:text-2xl text-[#9D174D]">
                ¡Feliz cumpleaños número 7, mi princesa hermosa! Te amo con todo mi corazón. 🩷🌹💋
              </p>
            </div>

            {/* GIANT "TE AMO" BANNER FOR PHONE & TABLET */}
            <div
              className="rounded-3xl p-6 sm:p-8 text-center text-white shadow-xl space-y-2"
              style={{
                background: 'linear-gradient(135deg, #EC4899 0%, #E11D74 50%, #9D174D 100%)',
              }}
            >
              <div className="text-3xl sm:text-5xl">🩷 🌹 🎂 💋 🩷</div>
              <p className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
                ¡TE AMO CON TODO MI CORAZÓN, MI PRINCESA HERMOSA!
              </p>
              <p className="text-sm sm:text-xl font-bold text-[#FFE4EE] pt-1">
                Felices 7 años, Vanessa &bull; Con todo mi amor, Tu Papá ❤️🌹💋
              </p>
            </div>

            {/* Interactive Celebration Trigger Button at the bottom of the Dedication Card */}
            <div className="relative pt-2 flex flex-col items-center justify-center gap-3">
              {/* Local Explosion Burst right over the button */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`btn-burst-${partyBurstId}`}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center z-30"
                >
                  {BURST_PARTICLES.map((bp, i) => (
                    <motion.span
                      key={i}
                      initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
                      animate={{ x: bp.x * 1.15, y: bp.y * 1.05, scale: 1.6, opacity: 0 }}
                      transition={{ duration: 1.4, ease: 'easeOut' }}
                      className="absolute text-3xl sm:text-4xl select-none"
                    >
                      {bp.emoji}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setPartyBurstId((n) => n + 1)}
                  className="w-full sm:w-auto px-8 py-4 rounded-full text-sm sm:text-base font-extrabold text-white shadow-[0_14px_35px_rgba(225,29,116,0.38)] transition-transform cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #FF2E93 0%, #E11D74 100%)' }}
                >
                  🎉 ¡Lanzar más Besos 💋, Corazones 🩷 y Tarta 🎂 para Vanessa!
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={async () => {
                    const shareUrl = 'https://vanesev.com/';
                    const shareTitle = '🎂 ¡Feliz Cumpleaños #7, mi princesa hermosa Vanessa! 🩷🌹';
                    const shareText =
                      '🎂🩷 ¡Feliz Cumpleaños #7, mi princesa hermosa Vanessa! Te amo con todo mi corazón. Este proyecto (VANESEV) lleva tu nombre porque es mi regalo para tus 7 años — Tu Papá 🌹💋';
                    if (typeof navigator !== 'undefined' && navigator.share) {
                      try {
                        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
                        return;
                      } catch {
                        // Si cancela o falla el share nativo, abrir WhatsApp directo
                      }
                    }
                    window.open(
                      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                  className="w-full sm:w-auto px-6 py-4 rounded-full text-xs sm:text-sm font-extrabold text-[#be185d] bg-[#FFF0F6] hover:bg-[#FCE7F3] border-2 border-[#F472B6] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>📲 Compartir Regalo por WhatsApp</span>
                </motion.button>
              </div>

              {partyBurstId > 1 && (
                <motion.div
                  key={`msg-${partyBurstId}`}
                  initial={{ scale: 0.85, opacity: 0, y: 8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className="rounded-2xl bg-[#FFF0F6] border-2 border-[#EC4899] px-5 py-2.5 text-center shadow-md"
                >
                  <p className="text-xs sm:text-sm font-extrabold text-[#be185d]">
                    {partyBurstId % 3 === 0
                      ? `🎂🩷 ¡Lluvia de tarta, rosas y besos #${partyBurstId - 1} para tus 7 años, mi princesa hermosa!`
                      : partyBurstId % 2 === 0
                      ? `💋🌹 ¡Te amo con todo mi corazón, mi princesa hermosa Vanessa! (Fiesta #${partyBurstId - 1})`
                      : `🩷🎉 ¡Mil corazones y abrazos de papá para tus 7 añitos, Vanessa! (Fiesta #${partyBurstId - 1})`}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Below the Birthday Dedication: The Interactive Phone Preview of Her Platform VANESEV */}
        <div className="relative z-10 mx-auto max-w-6xl mt-16 sm:mt-20 pt-12 border-t border-[#F472B6]/30 grid items-center gap-12 lg:gap-16 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#EC4899]/30 bg-white px-4 py-1.5 text-xs font-bold text-[#be185d] shadow-2xs">
              <span>👑</span>
              <span>El Ecosistema Digital que lleva el nombre de Vanessa</span>
            </p>
            <h2 className="font-display mt-4 text-3xl sm:text-5xl font-semibold leading-[1.04] tracking-tight text-[#161214]">
              Así funciona <span className="italic font-normal text-[#E11D74]">VANESEV</span> en vivo.
            </h2>
            <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-[#3F373A] font-medium">
              La plataforma tecnológica de belleza, salones, clínicas estéticas y spas creada en honor a Vanessa: con cartas digitales QR, agenda en tiempo real y Pasaporte VIP de fidelidad.
            </p>
          </div>

          {/* Right: 3D Interactive Phone Showcase + 4 Floating Live Salon Badges */}
          <div className="relative mx-auto w-full max-w-[350px]" style={{ perspective: '1600px' }}>
            {/* Floating Badge 1 (Top-Left) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="absolute z-20 -left-12 top-10 hidden sm:flex items-center gap-3 rounded-2xl border border-[#161214]/10 bg-white/95 px-3.5 py-2.5 text-[#161214] shadow-xl backdrop-blur-md"
              style={{ transform: 'rotate(-3deg)' }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#10B981] opacity-75" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-[#10B981]" />
              </span>
              <div>
                <span className="block whitespace-nowrap text-xs font-bold">Cita 16:30 Confirmada</span>
                <span className="block whitespace-nowrap text-[10px] text-[#574B4F]">Lifting + Keratina &bull; $22 USD</span>
              </div>
            </motion.div>

            {/* Floating Badge 2 (Top-Right) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="absolute z-20 -right-10 top-28 hidden sm:flex items-center gap-3 rounded-2xl border border-[#161214]/10 bg-white/95 px-3.5 py-2.5 text-[#161214] shadow-xl backdrop-blur-md"
              style={{ transform: 'rotate(3deg)' }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#D95F43]" />
              <div>
                <span className="block whitespace-nowrap text-xs font-bold">Precio actualizado</span>
                <span className="block whitespace-nowrap text-[10px] text-[#574B4F]">Alisado Espejo &bull; Tasa BCV al día</span>
              </div>
            </motion.div>

            {/* Floating Badge 3 (Bottom-Left) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="absolute z-20 -left-10 bottom-24 hidden sm:flex items-center gap-3 rounded-2xl border border-[#161214]/10 bg-white/95 px-3.5 py-2.5 text-[#161214] shadow-xl backdrop-blur-md"
              style={{ transform: 'rotate(2deg)' }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#9E3B52]" />
              <div>
                <span className="block whitespace-nowrap text-xs font-bold">Sello VIP #5 acreditado</span>
                <span className="block whitespace-nowrap text-[10px] text-[#574B4F]">Valeria M. &bull; Premio desbloqueado</span>
              </div>
            </motion.div>

            {/* Palette Switcher Pill Above Phone */}
            <div className="mb-3 mx-auto w-fit px-3.5 py-1.5 rounded-full bg-white border border-[#161214]/10 shadow-xs flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#574B4F]">
                Prueba paletas:
              </span>
              <div className="flex items-center gap-1.5">
                {SALON_PALETTES.slice(0, 5).map((pal) => (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => setPhonePaletteId(pal.id)}
                    className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                      phonePaletteId === pal.id ? 'scale-125 ring-2 ring-[#161214] ring-offset-1' : 'opacity-75 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: pal.primary }}
                    title={pal.name}
                  />
                ))}
              </div>
            </div>

            {/* Phone Bezel */}
            <div className="rounded-[46px] p-3 bg-gradient-to-b from-[#E8DFD5] via-[#DCD0C2] to-[#CBBBA8] shadow-[0_40px_90px_-20px_rgba(22,18,20,0.28)] border border-white">
              <div
                className="rounded-[36px] overflow-hidden border border-black/5 flex flex-col min-h-[560px] transition-colors duration-500"
                style={{ backgroundColor: phonePalette.bgPrimary, color: phonePalette.textPrimary }}
              >
                {/* Phone Top Bar */}
                <div className="px-4 pt-4 pb-3 bg-white/90 backdrop-blur-md border-b border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white font-display font-bold text-xs"
                      style={{ background: phonePalette.heroGradient }}
                    >
                      CS
                    </div>
                    <div>
                      <p className="font-display font-bold text-xs leading-none">Capra Studio</p>
                      <p className="text-[9px] text-[#574B4F] mt-0.5">vanesev.com/m/capra-studio</p>
                    </div>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: phonePalette.badgeBg, color: phonePalette.badgeText }}
                  >
                    En Vivo
                  </span>
                </div>

                {/* 3 Interactive Tabs Inside Phone */}
                <div className="p-2 bg-white/70 border-b border-black/5 grid grid-cols-3 gap-1">
                  {[
                    { id: 'catalog', label: '01. Carta QR' },
                    { id: 'passport', label: '02. Sellos VIP' },
                    { id: 'whatsapp', label: '03. Agenda' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPhoneStep(tab.id as any)}
                      className={`py-1.5 px-2 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        phoneStep === tab.id ? 'text-white shadow-2xs' : 'bg-white text-[#574B4F]'
                      }`}
                      style={phoneStep === tab.id ? { backgroundColor: phonePalette.primary } : undefined}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Dynamic Screen Inside Phone */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    {phoneStep === 'catalog' && (
                      <motion.div
                        key="catalog"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="space-y-3"
                      >
                        <div className="relative h-32 rounded-2xl overflow-hidden shadow-xs">
                          <img
                            src="/capra/lash-lifting.jpg"
                            alt="Lifting de Pestañas"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent flex flex-col justify-end p-3 text-white">
                            <span className="text-[9px] uppercase tracking-widest font-bold opacity-90">
                              Mirada de Autor &bull; 60 Min
                            </span>
                            <p className="font-display text-sm font-semibold leading-tight">
                              Lifting de Pestañas + Keratina
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          {[
                            { name: 'Brow Lamination + Botox', price: '$20', time: '50 min', img: '/capra/brow-lamination.jpg' },
                            { name: 'Lifting de Pestañas + Tinte', price: '$22', time: '60 min', img: '/capra/lash-lifting.jpg' },
                            { name: 'Alisado Orgánico Espejo', price: '$45', time: '120 min', img: '/capra/hair-straightening.jpg' },
                          ].map((srv, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedDemoService(idx)}
                              className={`w-full p-2 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer bg-white ${
                                selectedDemoService === idx ? 'ring-2 shadow-xs' : 'border-black/8 opacity-85'
                              }`}
                              style={selectedDemoService === idx ? { borderColor: phonePalette.primary } : undefined}
                            >
                              <img src={srv.img} alt={srv.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold truncate">{srv.name}</p>
                                <p className="text-[9px] text-[#574B4F]">{srv.time} &bull; Especialista</p>
                              </div>
                              <span className="font-display font-bold text-xs shrink-0" style={{ color: phonePalette.primary }}>
                                {srv.price}
                              </span>
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                          {['10:30 AM', '02:00 PM', '04:30 PM'].map((hr) => (
                            <button
                              key={hr}
                              type="button"
                              onClick={() => setSelectedDemoTime(hr)}
                              className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                                selectedDemoTime === hr ? 'text-white' : 'bg-white text-[#161214] border-black/10'
                              }`}
                              style={selectedDemoTime === hr ? { backgroundColor: phonePalette.primary, borderColor: phonePalette.primary } : undefined}
                            >
                              {hr}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {phoneStep === 'passport' && (
                      <motion.div
                        key="passport"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="space-y-3"
                      >
                        <div
                          className="p-4 rounded-2xl text-white shadow-md space-y-2.5"
                          style={{ background: phonePalette.heroGradient }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase tracking-widest font-bold opacity-90">
                              Pasaporte VIP
                            </span>
                            <Crown className="w-4 h-4" />
                          </div>
                          <p className="font-display text-lg font-semibold leading-tight">
                            {simulatedStamps} de 5 Visitas Selladas
                          </p>
                          <div className="grid grid-cols-5 gap-1.5 pt-1">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setSimulatedStamps(num)}
                                className={`h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                                  num <= simulatedStamps
                                    ? 'bg-white text-[#161214] shadow-xs scale-105'
                                    : 'bg-white/20 text-white/80'
                                }`}
                              >
                                {num <= simulatedStamps ? <Check className="w-3.5 h-3.5" /> : num}
                              </button>
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-[#574B4F] text-center">
                          Toca cualquier casilla del 1 al 5 para simular el sellado digital de una clienta.
                        </p>
                      </motion.div>
                    )}

                    {phoneStep === 'whatsapp' && (
                      <motion.div
                        key="whatsapp"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="space-y-3"
                      >
                        <div className="p-3.5 rounded-2xl bg-white border border-black/10 space-y-2">
                          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Turno Registrado en Agenda</span>
                          </div>
                          <p className="text-[11px] text-[#574B4F] leading-relaxed">
                            La solicitud llega estructurada al WhatsApp del salón y bloquea el turno en el panel Vertix.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={onOpenCapraDemo}
                    className="w-full py-3 rounded-full text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 mt-3 cursor-pointer"
                    style={{ background: phonePalette.heroGradient }}
                  >
                    <span>Abrir Carta Real (/m/capra-studio)</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          3. INFINITE EDITORIAL MARQUEE STRIP (MARQUESINA COMERCIAL)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-y border-[#9E3B52]/20 bg-[#23191C] py-4 text-[#FAF7F2]">
        <div className="flex w-max animate-[marquee_34s_linear_infinite] gap-10 whitespace-nowrap text-lg sm:text-2xl font-display font-semibold">
          {[
            'Tu marca, tus clientas',
            'Sin comisiones por cita',
            'Pasaporte VIP de 5 sellos',
            'Agenda por especialista y cabina',
            'Un QR para siempre en recepción',
            'Diseño 100% de autor',
            'Tasa BCV sincronizada al día',
            'Tu marca, tus clientas',
            'Sin comisiones por cita',
            'Pasaporte VIP de 5 sellos',
            'Agenda por especialista y cabina',
            'Un QR para siempre en recepción',
          ].map((item, idx) => (
            <span key={idx} className="flex items-center gap-10">
              <span>{item}</span>
              <span className="h-2 w-2 rounded-full bg-[#D95F43]" />
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          4. FULL-BLEED ARCHITECTURAL MANIFESTO BANNER (70SVH)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[64svh] min-h-[400px] overflow-hidden">
        <img
          src="/vanesev/hero-atelier.jpg"
          alt="Interior arquitectónico de salón de belleza de lujo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1417]/90 via-[#1E1417]/35 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-12 sm:pb-16 text-white">
          <h2 className="font-display max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.04]">
            El talento y las manos ya son tuyos.{' '}
            <span className="italic font-normal text-[#F3C6B6]">
              Tus clientas y tu agenda también deberían serlo.
            </span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#F3C6B6]">
            Sin directorios intermediarios entre tu sillón y tu clienta
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          5. "¿TE SUENA?" — 4 NUMBERED PAIN POINTS COSTING SALONS MONEY EVERY WEEK
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#F4EFE6] py-20 sm:py-28 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9E3B52]">¿Te suena?</p>
          <h2 className="font-display mt-3 max-w-3xl text-3xl sm:text-5xl font-semibold leading-[1.04] text-[#161214]">
            Lo que le está costando dinero a tu salón cada semana.
          </h2>

          <div className="mt-12 grid md:grid-cols-2 md:gap-x-14">
            {[
              {
                num: '1',
                title: 'Respondes 40 mensajes de "¿qué precio tiene y qué hora tienes libre?" mientras atiendes.',
                desc: 'Cuando terminas un servicio, te quitas los guantes y miras el WhatsApp, la clienta ya reservó en otro estudio.',
              },
              {
                num: '2',
                title: 'Las apps de directorios se quedan hasta un 25% de comisión y muestran tu competencia al lado.',
                desc: 'Y además se quedan con los datos de tus propias clientas y te obligan a usar una plantilla idéntica a la de todos.',
              },
              {
                num: '3',
                title: 'Rehaces historias destacadas o PDFs cada vez que ajustas un precio o cambia la tasa BCV.',
                desc: 'Tus clientas ven precios desactualizados o listas borrosas que nadie logra leer bien desde el móvil.',
              },
              {
                num: '4',
                title: 'Las tarjetas de fidelidad en cartulina se pierden cuando tu clienta cambia de cartera.',
                desc: 'Sin un Pasaporte VIP digital vinculado a su teléfono, pierdes la oportunidad de duplicar sus visitas al mes.',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="grid grid-cols-[48px_1fr] gap-4 border-t border-[#161214]/15 py-7"
              >
                <span className="font-display italic text-4xl leading-none text-[#9E3B52]">
                  {item.num}
                </span>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-[#161214] leading-snug">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-[#574B4F] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
            <button
              type="button"
              onClick={() => openCheckoutWithPlan('Salon Couture Pro ($29/mes)')}
              className="inline-flex justify-center rounded-full bg-[#161214] hover:bg-[#2E2528] px-7 py-4 text-sm font-bold text-white transition-colors cursor-pointer"
            >
              Arreglarlo con mi propio sistema &rarr;
            </button>
            <a
              href="https://wa.me/584223794800?text=Hola%2C%20quiero%20resolver%20las%20reservas%20y%20la%20carta%20QR%20de%20mi%20sal%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full border border-[#161214] px-7 py-4 text-sm font-bold text-[#161214] hover:bg-white transition-colors"
            >
              Contarlo por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          6. "QUÉ HACEMOS" — 3 NUMBERED PRODUCT TIERS (01, 02, 03)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="signature" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF7F2]">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9E3B52]">Qué hacemos</p>
          <h2 className="font-display mt-3 max-w-3xl text-3xl sm:text-5xl font-semibold leading-[1.04] text-[#161214]">
            Carta QR, Pasaporte VIP y Dirección Ejecutiva.{' '}
            <span className="italic font-normal text-[#9E3B52]">Todo hecho para tu salón.</span>
          </h2>

          <div className="mt-12 space-y-4">
            {/* 01: VANESEV Atelier Signature */}
            <div
              onClick={() => openCheckoutWithPlan('Salon Couture Pro ($29/mes)')}
              className="group relative grid items-center gap-6 overflow-hidden rounded-[28px] border border-[#9E3B52]/25 p-7 sm:p-9 transition duration-300 md:grid-cols-[70px_1fr_auto] text-white shadow-lg cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #8F3247 0%, #B85249 55%, #D47A57 100%)' }}
            >
              <span className="font-display text-2xl font-bold text-white/80">01</span>
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold flex flex-wrap items-center gap-3">
                  <span>VANESEV Atelier Signature</span>
                  <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                    Tu marca propia
                  </span>
                </h3>
                <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/90 leading-relaxed">
                  Tu propio sistema de reservas, catálogo interactivo, Pasaporte VIP de 5 sellos y Panel Ejecutivo Vertix (agenda, especialistas, comisiones y tasa BCV). Sin comisiones por cita.
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-xs sm:text-sm text-white/85 font-semibold">Desde $29 USD / mes</p>
                <p className="mt-1.5 font-bold text-white flex md:justify-end items-center gap-1">
                  <span>Activar Signature</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </div>

            {/* 02: Carta & Recepción QR */}
            <div
              onClick={() => scrollToSection('carta-qr')}
              className="group relative grid items-center gap-6 overflow-hidden rounded-[28px] border border-[#161214]/10 bg-white p-7 sm:p-9 transition duration-300 md:grid-cols-[70px_1fr_auto] hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            >
              <span className="font-display text-2xl font-bold text-[#9E3B52]">02</span>
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#161214]">
                  Carta Digital &amp; Recepción QR (/m/tu-salon)
                </h3>
                <p className="mt-2 max-w-2xl text-sm sm:text-base text-[#574B4F] leading-relaxed">
                  La puerta de entrada ideal: tu catálogo fotográfico de tratamientos en el móvil de cada clienta al escanear el QR en recepción o entrar desde tu bio de Instagram.
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-xs sm:text-sm text-[#574B4F] font-semibold">Desde $19 USD / mes</p>
                <p className="mt-1.5 font-bold text-[#9E3B52] flex md:justify-end items-center gap-1">
                  <span>Ver Carta QR</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </div>

            {/* 03: Maison & Academy */}
            <div
              onClick={() => openCheckoutWithPlan('Maison Multi-Sede ($59/mes)')}
              className="group relative grid items-center gap-6 overflow-hidden rounded-[28px] border border-[#161214]/10 bg-white p-7 sm:p-9 transition duration-300 md:grid-cols-[70px_1fr_auto] hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            >
              <span className="font-display text-2xl font-bold text-[#9E3B52]">03</span>
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#161214]">
                  Maison Multi-Cabina &amp; Academy
                </h3>
                <p className="mt-2 max-w-2xl text-sm sm:text-base text-[#574B4F] leading-relaxed">
                  Para clínicas estéticas, spas y academias de belleza que requieren múltiples cabinas simultáneas, paquetes nupciales y venta de cursos presenciales con cupos.
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-xs sm:text-sm text-[#574B4F] font-semibold">$59 USD / mes &bull; o a medida</p>
                <p className="mt-1.5 font-bold text-[#161214] flex md:justify-end items-center gap-1">
                  <span>Solicitar Maison</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          7. "LA PUERTA DE ENTRADA · CARTA QR" + 6 SUPERPOWERS
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="carta-qr" className="scroll-mt-20 bg-[#F4EFE6] py-20 sm:py-28 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9E3B52]">
            La puerta de entrada &bull; Carta QR
          </p>
          <h2 className="font-display mt-3 max-w-4xl text-3xl sm:text-5xl font-semibold leading-[1.04] text-[#161214]">
            Empieza por tu catálogo interactivo.{' '}
            <span className="italic font-normal text-[#9E3B52]">Listo en menos de 24 horas.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-[#574B4F] leading-relaxed">
            Nos envías una foto o PDF de tu lista de precios actual y te entregamos tu carta digital con fotografía editorial, tus colores de marca y tu código QR permanente para recepción e Instagram.
          </p>

          {/* 6 Superpowers Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: '01',
                title: 'Te la montamos desde tu lista actual',
                desc: 'Nos mandas una foto o mensaje con tus servicios y precios y nuestro equipo la deja configurada sin que tengas que teclear nada.',
              },
              {
                num: '02',
                title: 'Precios al día en USD y Bolívares (BCV)',
                desc: 'Cambias la tasa o un precio desde tu móvil en 5 segundos y se actualiza automáticamente en todos los teléfonos.',
              },
              {
                num: '03',
                title: 'Un código QR para siempre',
                desc: 'Lo imprimes una sola vez en acrílico para tu recepción o espejos. Tus servicios y promociones cambian, el QR nunca caduca.',
              },
              {
                num: '04',
                title: 'Fotografía editorial de alta conversión',
                desc: 'Cada tratamiento muestra su fotografía, duración en sillón, descripción detallada y recomendación de la directora.',
              },
              {
                num: '05',
                title: 'Reserva en 15 segundos sin cruces',
                desc: 'La clienta selecciona servicio, fecha y hora disponible y envía la confirmación directa al WhatsApp de tu salón.',
              },
              {
                num: '06',
                title: 'Puente directo a tu Pasaporte VIP',
                desc: 'Desde la misma carta QR, tus clientas consultan sus sellos acumulados con su número de teléfono sin instalar nada.',
              },
            ].map((sp) => (
              <div
                key={sp.num}
                className="rounded-[24px] bg-white border border-[#161214]/8 p-6 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-display italic text-2xl font-bold text-[#9E3B52]">
                    {sp.num}
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#161214] mt-2">
                    {sp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#574B4F] mt-2 leading-relaxed">
                    {sp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          8. INTERACTIVE AUTHOR DESIGN STUDIO ("NINGÚN SALÓN SE PARECE A OTRO")
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section ref={showcaseRef} id="personalizador" className="scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF7F2]">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#9E3B52]">
              Identidad de Autor &bull; Cero Plantillas Clonadas
            </span>
            <h2 className="font-display mt-3 text-3xl sm:text-5xl font-semibold text-[#161214] leading-[1.04]">
              Ningún salón se parece a otro.{' '}
              <span className="italic font-normal text-[#9E3B52]">Pruébalo aquí en vivo.</span>
            </h2>
            <p className="mt-4 text-base text-[#574B4F] leading-relaxed">
              Un estudio de cejas rosado empolvado no debe verse igual que una clínica médico-estética minimalista ni que una barbería de autor. Cambia la paleta, la tipografía y el diseño de tarjetas ahora mismo:
            </p>
          </div>

          <motion.div
            style={{ rotateX, scale: scale3d, transformPerspective: 1200 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-[32px] p-5 sm:p-8 border border-[#161214]/10 shadow-xl"
          >
            {/* Left Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#161214] flex items-center gap-2 mb-2.5">
                  <Palette className="w-4 h-4 text-[#9E3B52]" />
                  <span>1. Elige la Paleta de Color de tu Salón</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SALON_PALETTES.map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setStudioPaletteId(pal.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        studioPaletteId === pal.id
                          ? 'border-[#161214] bg-[#FAF7F2] shadow-2xs ring-1 ring-[#161214]'
                          : 'border-black/10 hover:bg-[#FAF7F2]/60'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full shrink-0 border border-black/10"
                        style={{ background: pal.heroGradient }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#161214] truncate">{pal.name}</p>
                        <p className="text-[10px] text-[#574B4F] truncate">{pal.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#161214] flex items-center gap-2 mb-2">
                  <Sliders className="w-4 h-4 text-[#9E3B52]" />
                  <span>2. Par Tipográfico Editorial</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SALON_TYPOGRAPHIES.map((typo) => (
                    <button
                      key={typo.id}
                      type="button"
                      onClick={() => setStudioTypographyId(typo.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        studioTypographyId === typo.id
                          ? 'bg-[#161214] text-white border-[#161214]'
                          : 'bg-[#FAF7F2] text-[#161214] border-black/10'
                      }`}
                    >
                      <p className="text-xs font-bold truncate">{typo.name}</p>
                      <p className="text-[9px] opacity-75 truncate">{typo.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#161214] flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-[#9E3B52]" />
                  <span>3. Arquitectura de Tarjetas</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SALON_LAYOUTS.map((lay) => (
                    <button
                      key={lay.id}
                      type="button"
                      onClick={() => setStudioLayoutId(lay.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        studioLayoutId === lay.id
                          ? 'bg-[#9E3B52] text-white border-[#9E3B52]'
                          : 'bg-[#FAF7F2] text-[#161214] border-black/10'
                      }`}
                    >
                      <p className="text-xs font-bold truncate">{lay.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Live Preview Canvas (7 cols) */}
            <div
              className="lg:col-span-7 rounded-[24px] p-5 sm:p-7 border transition-colors duration-500 flex flex-col justify-between"
              style={{
                backgroundColor: studioPalette.bgPrimary,
                color: studioPalette.textPrimary,
                borderColor: 'rgba(0,0,0,0.08)',
              }}
            >
              <div>
                <div
                  className="rounded-2xl p-5 text-white shadow-md mb-5"
                  style={{ background: studioPalette.heroGradient }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">
                    VISTA PREVIA EN TIEMPO REAL &bull; {studioPalette.name.toUpperCase()}
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-bold mt-1"
                    style={{ fontFamily: studioTypography.headingFont }}
                  >
                    Maison Lumière &bull; Beauty Studio
                  </h3>
                  <p className="text-xs opacity-90 mt-1">
                    Catálogo QR interactivo con reserva directa y Pasaporte VIP de 5 visitas.
                  </p>
                </div>

                <div
                  className={
                    studioLayoutId === 'minimal-menu'
                      ? 'space-y-2.5'
                      : 'grid grid-cols-1 sm:grid-cols-2 gap-3.5'
                  }
                >
                  {[
                    {
                      name: 'Brow Lamination & Botox Nutritivo',
                      price: '$20 USD',
                      time: '50 min',
                      img: '/capra/brow-lamination.jpg',
                    },
                    {
                      name: 'Maquillaje Social Piel Blindada HD',
                      price: '$35 USD',
                      time: '75 min',
                      img: '/capra/makeup-blindada.jpg',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white p-3.5 border border-black/5 shadow-xs flex items-center gap-3.5"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-bold leading-snug"
                          style={{ fontFamily: studioTypography.headingFont, color: studioPalette.textPrimary }}
                        >
                          {item.name}
                        </p>
                        <p className="text-[11px] opacity-75 mt-0.5">{item.time} &bull; Especialista</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-xs" style={{ color: studioPalette.primary }}>
                            {item.price}
                          </span>
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                            style={{ backgroundColor: studioPalette.primary }}
                          >
                            Reservar
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-semibold opacity-80">
                  Tipografía activa: <strong>{studioTypography.name}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => openCheckoutWithPlan(`Configuración con paleta ${studioPalette.name}`)}
                  className="font-bold underline cursor-pointer"
                  style={{ color: studioPalette.primary }}
                >
                  Solicitar mi carta con este estilo &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          9. COMPARISON TABLE: CARTA QR vs ATELIER SIGNATURE + 5 SECTORS
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="sectores" className="scroll-mt-20 bg-[#F4EFE6] py-20 sm:py-28 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-20">
          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9E3B52]">
              El siguiente nivel
            </p>
            <h2 className="font-display mt-3 text-3xl sm:text-5xl font-semibold text-[#161214]">
              De carta QR a tu propio sistema Signature.
            </h2>
            <p className="mt-3 text-base text-[#574B4F]">
              La carta QR digitaliza tu recepción. <strong className="text-[#161214]">Atelier Signature es tu negocio completo:</strong> fidelización VIP, equipo, comisiones y control total.
            </p>

            <div className="mt-8 overflow-hidden rounded-[28px] border border-[#161214]/10 bg-white shadow-sm">
              <div className="grid grid-cols-[1fr_90px_110px] sm:grid-cols-[1fr_140px_160px] items-end border-b border-[#161214]/10 text-xs sm:text-sm font-bold">
                <p className="p-4 sm:p-5 text-[#574B4F]">Capacidad incluida</p>
                <p className="p-4 sm:p-5 text-center text-[#574B4F]">
                  Atelier QR
                  <span className="block text-[10px] font-normal">$19/mes</span>
                </p>
                <p
                  className="p-4 sm:p-5 text-center text-white"
                  style={{ background: 'linear-gradient(135deg, #9E3B52 0%, #D95F43 100%)' }}
                >
                  Couture Pro
                  <span className="block text-[10px] font-normal text-white/90">$29/mes</span>
                </p>
              </div>
              {[
                { label: 'Catálogo interactivo con paleta y tipografía de autor', qr: true, sig: true },
                { label: 'Código QR permanente (/m/tu-salon) y conversión Bs. BCV', qr: true, sig: true },
                { label: 'Cero comisiones por reserva (0% frente a directorios)', qr: true, sig: true },
                { label: 'Pasaporte VIP Digital con sellos por número de teléfono', qr: false, sig: true },
                { label: 'Gestión de Equipo, Especialistas, Cabinas y Comisiones', qr: false, sig: true },
                { label: 'Reportes Financieros y Base de Datos VIP propia', qr: false, sig: true },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_90px_110px] sm:grid-cols-[1fr_140px_160px] items-center border-t border-[#161214]/8 text-xs sm:text-sm"
                >
                  <p className="p-4 sm:px-5 font-semibold text-[#161214]">{row.label}</p>
                  <p className="p-4 text-center font-bold text-[#574B4F]">
                    {row.qr ? '✓' : '—'}
                  </p>
                  <p className="p-4 text-center font-bold bg-[#FFF6F4] text-[#9E3B52] self-stretch flex items-center justify-center">
                    <span className="w-6 h-6 rounded-full bg-[#9E3B52] text-white inline-flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Verticales del Sector Belleza */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#9E3B52]">
                  ESPECIALIDADES DEL SECTOR BELLEZA &amp; WELLNESS
                </span>
                <h2 className="font-display mt-2 text-3xl sm:text-4xl font-semibold text-[#161214]">
                  Adaptado al flujo real de tu especialidad.
                </h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SECTORS.map((sec, idx) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSectorIdx(idx)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeSectorIdx === idx
                        ? 'bg-[#161214] text-white shadow-xs'
                        : 'bg-white text-[#574B4F] hover:text-[#161214] border border-[#161214]/10'
                    }`}
                  >
                    {sec.tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-[32px] p-5 sm:p-8 border border-[#161214]/10 shadow-sm items-center">
              <div className="lg:col-span-5 h-64 sm:h-80 rounded-2xl overflow-hidden">
                <img
                  src={activeSector.image}
                  alt={activeSector.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:col-span-7 space-y-4">
                <span className="px-3 py-1 rounded-full bg-[#FAF0F2] text-[#9E3B52] text-xs font-bold">
                  {activeSector.metrics}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#161214]">
                  {activeSector.title}
                </h3>
                <p className="text-sm sm:text-base text-[#574B4F] leading-relaxed">
                  {activeSector.problemSolved}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  {activeSector.servicesPreview.map((sp, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#161214]/8">
                      <p className="text-xs font-bold text-[#161214]">{sp.name}</p>
                      <div className="flex items-center justify-between mt-1.5 text-[11px] text-[#574B4F]">
                        <span>{sp.duration}</span>
                        <span className="font-bold text-[#9E3B52]">{sp.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          10. PRICING PLANS + PLAN FUNDADOR BANNER + ROI CALCULATOR
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="precios" className="scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF7F2]">
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9E3B52]">
              Inversión clara &bull; Sin comisiones por cita
            </p>
            <h2 className="font-display mt-3 text-3xl sm:text-5xl font-semibold text-[#161214]">
              Tres planes claros. Sin módulos sueltos.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Atelier QR',
                price: '$19',
                period: '/mes',
                subtitle: 'La puerta de entrada para digitalizar tu recepción y bio de Instagram.',
                features: [
                  'Carta Interactiva con Paleta y Tipografía Editable',
                  'Ruta QR Limpia (/m/tu-salon) + Kit Imprimible',
                  'Agenda Conectada a WhatsApp & Tasa BCV',
                  'Hasta 2 Especialistas en Agenda',
                  'Montaje inicial desde foto de tu lista actual',
                ],
                highlighted: false,
              },
              {
                name: 'Salon Couture Pro',
                price: '$29',
                period: '/mes',
                subtitle: 'El sistema completo para salones de belleza, peluquerías y estudios.',
                features: [
                  'Todo lo incluido en Atelier QR',
                  'Pasaporte Digital de Fidelidad VIP (5 Sellos)',
                  'Panel Ejecutivo Vertix con Gestión de Equipo y Comisiones',
                  'Hasta 6 Especialistas y 4 Cabinas o Áreas',
                  'Reportes Financieros & Base de Datos de Clientas VIP',
                ],
                highlighted: true,
              },
              {
                name: 'Maison Multi-Sede',
                price: '$59',
                period: '/mes',
                subtitle: 'Para clínicas estéticas, spas y academias con alto volumen.',
                features: [
                  'Especialistas, Sillones y Cabinas Ilimitadas',
                  'Módulo de Academia, Cursos & Paquetes de Novia',
                  'Configuración Asistida + Dominio Personalizado Opcional',
                  'Soporte Prioritario Directo por WhatsApp',
                  'Múltiples Sedes bajo una misma Dirección',
                ],
                highlighted: false,
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-[30px] p-7 flex flex-col justify-between border transition-transform hover:-translate-y-1 ${
                  plan.highlighted
                    ? 'bg-[#23191C] text-white border-[#9E3B52] shadow-2xl relative'
                    : 'bg-white text-[#161214] border-[#161214]/12 shadow-xs'
                }`}
              >
                {plan.highlighted && (
                  <span
                    className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white w-fit mb-4"
                    style={{ background: 'linear-gradient(135deg, #9E3B52 0%, #D95F43 100%)' }}
                  >
                    Más elegido por salones
                  </span>
                )}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
                    <p className={`text-xs mt-1 ${plan.highlighted ? 'text-white/75' : 'text-[#574B4F]'}`}>
                      {plan.subtitle}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl sm:text-5xl font-bold">{plan.price}</span>
                    <span className={`text-xs font-semibold ${plan.highlighted ? 'text-white/75' : 'text-[#574B4F]'}`}>
                      USD {plan.period}
                    </span>
                  </div>
                  <ul className={`space-y-2.5 pt-4 border-t ${plan.highlighted ? 'border-white/15' : 'border-[#161214]/10'}`}>
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                        <Check className="w-4 h-4 text-[#D95F43] shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => openCheckoutWithPlan(`${plan.name} (${plan.price}${plan.period})`)}
                  className={`w-full mt-7 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    plan.highlighted
                      ? 'text-white shadow-lg'
                      : 'bg-[#FAF7F2] hover:bg-[#161214] hover:text-white text-[#161214] border border-[#161214]/15'
                  }`}
                  style={plan.highlighted ? { background: 'linear-gradient(135deg, #9E3B52 0%, #D95F43 100%)' } : undefined}
                >
                  Elegir {plan.name}
                </button>
              </div>
            ))}
          </div>

          {/* Plan Fundador Launch Offer Banner (DKitchen Funnel Pattern) */}
          <div
            className="rounded-[32px] overflow-hidden grid md:grid-cols-[1.15fr_1fr] text-white shadow-xl"
            style={{ background: 'linear-gradient(135deg, #7A283B 0%, #9E3B52 50%, #C85A42 100%)' }}
          >
            <div className="p-8 sm:p-11 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F5D0A9] text-[#23191C] px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Oferta Fundador &bull; Plazas Limitadas</span>
                </span>
                <h3 className="font-display text-4xl sm:text-5xl font-bold mt-4">
                  Plan Fundador Beauty
                </h3>
                <p className="font-display text-xl sm:text-2xl mt-2 text-[#F5D0A9]">
                  Todo el plan Salon Couture Pro por $22/mes de por vida + Montaje Fotográfico Gratis.
                </p>
                <p className="text-xs sm:text-sm text-white/85 mt-2 leading-relaxed">
                  En vez de $29/mes. Te entregamos tu catálogo configurado con tus tratamientos, tu paleta de autor y el diseño de tu código QR listo para recepción.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openCheckoutWithPlan('Plan Fundador Beauty ($22/mes de por vida)')}
                  className="px-7 py-3.5 rounded-full bg-white text-[#161214] text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Solicitar Plaza Fundador &rarr;
                </button>
                <button
                  type="button"
                  onClick={onOpenCapraDemo}
                  className="px-6 py-3.5 rounded-full border border-white/30 text-white text-xs sm:text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Ver salón de muestra en vivo
                </button>
              </div>
            </div>
            <div className="relative min-h-[240px]">
              <img
                src="/vanesev/sector-hair-color.jpg"
                alt="Salón de belleza en servicio"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-5 right-5 rounded-2xl bg-[#F5D0A9] text-[#23191C] px-5 py-3 shadow-xl">
                <p className="font-display text-3xl font-bold leading-none">-24%</p>
                <p className="text-[10px] font-bold uppercase tracking-wider mt-1">De por vida</p>
              </div>
            </div>
          </div>

          {/* Interactive ROI Calculator */}
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-[#161214]/10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9E3B52]">
                Calculadora de Retorno Inmediato
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#161214]">
                ¿Cuánto dinero deja de percibir tu salón por mensajes respondidos tarde?
              </h3>
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Ticket promedio por clienta en tu salón:</span>
                    <span className="text-[#9E3B52]">${avgTicket} USD</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={90}
                    value={avgTicket}
                    onChange={(e) => setAvgTicket(Number(e.target.value))}
                    className="w-full accent-[#9E3B52] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Citas por semana que se enfrían esperando respuesta en WhatsApp:</span>
                    <span className="text-[#9E3B52]">{missedWeekly} citas / semana</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={20}
                    value={missedWeekly}
                    onChange={(e) => setMissedWeekly(Number(e.target.value))}
                    className="w-full accent-[#9E3B52] cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div
              className="lg:col-span-5 rounded-3xl p-7 text-white shadow-lg space-y-3"
              style={{ background: 'linear-gradient(135deg, #9E3B52 0%, #D95F43 100%)' }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 block">
                Facturación Recuperable Estimada
              </span>
              <p className="font-display text-4xl sm:text-5xl font-bold">
                +${monthlyRecoveredUSD.toLocaleString()} <span className="text-lg font-normal">USD / mes</span>
              </p>
              <p className="text-xs text-white/90">
                Equivalente a <strong>+${yearlyRecoveredUSD.toLocaleString()} USD al año</strong> en citas que hoy se pierden cuando estás atendiendo. Con recuperar 1 sola cita al mes ya pagas tu suscripción.
              </p>
              <button
                type="button"
                onClick={() => openCheckoutWithPlan('Salon Couture Pro ($29/mes)')}
                className="w-full mt-2 py-3 rounded-full bg-white text-[#161214] text-xs font-bold shadow-xs cursor-pointer"
              >
                Recuperar estas citas con mi Carta QR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          11. CASOS DE ÉXITO REALES & DEMOS EN VIVO (CAPRA STUDIO & ANDREA LABRADOR)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="casos" className="scroll-mt-20 bg-[#23191C] text-white py-20 sm:py-28 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#F3C6B6]">
                Caso real en producción
              </p>
              <h2 className="font-display mt-3 text-3xl sm:text-5xl font-semibold leading-[1.04]">
                Capra Studio agenda y fideliza con su propia marca, no con la de otros.
              </h2>
              <p className="mt-4 text-base text-white/80 leading-relaxed">
                Catálogo fotográfico de 12 servicios (Cejas, Pestañas, Alisados, Maquillaje, Uñas y Capra Academy), Pasaporte VIP de 5 visitas y recepción QR activa en San Cristóbal.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-white/15 pt-6">
                <div>
                  <dt className="font-display text-3xl sm:text-4xl font-bold text-[#F3C6B6]">0%</dt>
                  <dd className="mt-1 text-xs text-white/70">comisión por cita</dd>
                </div>
                <div>
                  <dt className="font-display text-3xl sm:text-4xl font-bold text-white">100%</dt>
                  <dd className="mt-1 text-xs text-white/70">clientas propias</dd>
                </div>
                <div>
                  <dt className="font-display text-3xl sm:text-4xl font-bold text-[#F3C6B6]">12</dt>
                  <dd className="mt-1 text-xs text-white/70">servicios &amp; cursos</dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onOpenCapraDemo}
                  className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg flex items-center gap-2 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #9E3B52 0%, #D95F43 100%)' }}
                >
                  <span>Abrir Demo Capra Studio (/m/capra-studio)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onOpenAndreaDemo}
                  className="px-6 py-3.5 rounded-full border border-white/25 hover:border-white/60 text-xs sm:text-sm font-bold text-white cursor-pointer"
                >
                  Ver Demo Nail Bar Boutique
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[24px] overflow-hidden ring-1 ring-white/15 shadow-2xl">
                <img
                  src="/capra/brow-lamination.jpg"
                  alt="Capra Studio Cejas y Pestañas"
                  className="w-full h-72 object-cover"
                />
                <div className="p-4 bg-white/10 backdrop-blur-md">
                  <p className="font-display font-bold text-sm">Capra Studio</p>
                  <p className="text-[11px] text-white/70">Paleta Rose Cashmere &amp; Silk</p>
                </div>
              </div>
              <div className="rounded-[24px] overflow-hidden ring-1 ring-white/15 shadow-2xl mt-8">
                <img
                  src="/capra/nails-french.jpg"
                  alt="Nail Studio Boutique"
                  className="w-full h-72 object-cover"
                />
                <div className="p-4 bg-white/10 backdrop-blur-md">
                  <p className="font-display font-bold text-sm">Nail Bar &amp; Spa</p>
                  <p className="text-[11px] text-white/70">Catálogo Estructural</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          12. BLOG EDITORIAL DE GESTIÓN BEAUTY + PREGUNTAS FRECUENTES (FAQ)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="blog" className="scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF7F2]">
        <div className="mx-auto max-w-6xl space-y-20">
          {/* Blog Editorial */}
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9E3B52]">
                Editorial &amp; Estrategia para Dueñas de Salón
              </p>
              <h2 className="font-display mt-2 text-3xl sm:text-4xl font-semibold text-[#161214]">
                Aprende a multiplicar la rentabilidad de tus sillones.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {EDITORIAL_ARTICLES.map((art) => (
                <article
                  key={art.id}
                  onClick={() => setActiveArticle(art)}
                  className="group rounded-[28px] bg-white border border-[#161214]/10 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="h-48 overflow-hidden">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#9E3B52] mb-2">
                        <span>{art.category}</span>
                        <span className="text-[#574B4F]">{art.readTime}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#161214] leading-snug group-hover:text-[#9E3B52] transition-colors">
                        {art.title}
                      </h3>
                      <p className="text-xs text-[#574B4F] mt-2 leading-relaxed line-clamp-3">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-5 pt-2 flex items-center gap-1 text-xs font-bold text-[#161214]">
                    <span>Leer artículo completo</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#9E3B52]" />
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div id="faq" className="scroll-mt-20 max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9E3B52]">
                Preguntas Frecuentes
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#161214]">
                Todo claro antes de empezar.
              </h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const open = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-[#161214]/10 overflow-hidden shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(open ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-bold text-sm sm:text-base text-[#161214]">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#9E3B52] shrink-0 transition-transform ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {open && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-[#574B4F] leading-relaxed border-t border-[#161214]/6 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          13. FINAL CLOSING COMMERCIAL CTA BANNER
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 sm:py-28 px-4 sm:px-6 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #23191C 0%, #4A202C 50%, #7A2E3E 100%)' }}
      >
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold leading-none">
            Tu salón. Tu marca.{' '}
            <span className="italic font-normal text-[#F5D0A9]">Hoy.</span>
          </h2>
          <p className="mx-auto max-w-xl text-base sm:text-lg text-white/80">
            Te enseñamos cómo luce tu carta interactiva con tus propios servicios antes de pagar nada. Sin permanencia y con soporte directo.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => openCheckoutWithPlan('Salon Couture Pro ($29/mes)')}
              className="px-9 py-4 rounded-full text-sm sm:text-base font-bold text-white shadow-xl cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #9E3B52 0%, #D95F43 100%)' }}
            >
              Crear el Sistema de mi Salón &rarr;
            </button>
            <a
              href="https://wa.me/584223794800?text=Hola%2C%20quiero%20ver%20una%20demo%20de%20VANESEV%20para%20mi%20sal%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full border border-white/25 hover:border-white/60 text-sm sm:text-base font-bold text-white"
            >
              Pedir mi demo por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          14. COMPLETE 5-COLUMN CORPORATE SAAS FOOTER (ZERO DEBUG/CENTRAL LINKS)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#181214] text-white border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
            {/* Column 1: Brand & Partner CTA */}
            <div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-display font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #9E3B52 0%, #D95F43 100%)' }}
                >
                  V
                </div>
                <span className="font-display text-xl font-bold">
                  VANE<span className="text-[#D95F43]">SEV</span>
                </span>
              </div>
              <p className="mt-4 max-w-xs text-xs sm:text-sm leading-relaxed text-white/60">
                Tecnología de autor para salones de belleza, peluquerías, clínicas estéticas y spas sin comisiones. Tus clientas y tus datos, siempre en tu casa.
              </p>
              <button
                type="button"
                onClick={() => openCheckoutWithPlan('Consulta General VANESEV')}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-bold hover:border-white/50 cursor-pointer"
              >
                <span>Solicitar Demo Personalizada</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Column 2: Productos */}
            <nav aria-label="Productos">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Productos</p>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-white/75">
                <li>
                  <button type="button" onClick={() => scrollToSection('carta-qr')} className="hover:text-white cursor-pointer">
                    Carta Digital QR
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('signature')} className="hover:text-white cursor-pointer">
                    VANESEV Signature
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('personalizador')} className="hover:text-white cursor-pointer">
                    Studio de Diseño
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('precios')} className="hover:text-white cursor-pointer">
                    Planes y Precios
                  </button>
                </li>
              </ul>
            </nav>

            {/* Column 3: Especialidades */}
            <nav aria-label="Especialidades">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Sectores</p>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-white/75">
                <li>
                  <button type="button" onClick={() => { setActiveSectorIdx(0); scrollToSection('sectores'); }} className="hover:text-white cursor-pointer">
                    Cejas, Pestañas &amp; MakeUp
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => { setActiveSectorIdx(1); scrollToSection('sectores'); }} className="hover:text-white cursor-pointer">
                    Peluquerías &amp; Color
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => { setActiveSectorIdx(2); scrollToSection('sectores'); }} className="hover:text-white cursor-pointer">
                    Clínicas &amp; MedSpa
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => { setActiveSectorIdx(3); scrollToSection('sectores'); }} className="hover:text-white cursor-pointer">
                    Nail Bars &amp; Barberías
                  </button>
                </li>
              </ul>
            </nav>

            {/* Column 4: Recursos & Demos */}
            <nav aria-label="Recursos">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Recursos &amp; Demos</p>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-white/75">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('inicio')}
                    className="hover:text-white font-semibold text-[#F472B6] cursor-pointer"
                  >
                    🎂 Dedicatoria Cumpleaños Vanessa
                  </button>
                </li>
                <li>
                  <button type="button" onClick={onOpenCapraDemo} className="hover:text-white cursor-pointer">
                    Demo en Vivo Capra Studio
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('blog')} className="hover:text-white cursor-pointer">
                    Blog de Gestión Beauty
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('faq')} className="hover:text-white cursor-pointer">
                    Preguntas Frecuentes
                  </button>
                </li>
              </ul>
            </nav>

            {/* Column 5: Legal */}
            <nav aria-label="Legal">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Legal</p>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-white/75">
                <li>
                  <button type="button" onClick={() => setLegalModalTitle('Política de Privacidad y Protección de Datos')} className="hover:text-white cursor-pointer">
                    Privacidad
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setLegalModalTitle('Términos y Condiciones de Uso SaaS')} className="hover:text-white cursor-pointer">
                    Términos de Servicio
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setLegalModalTitle('Política de Cookies y Almacenamiento Seguro')} className="hover:text-white cursor-pointer">
                    Política de Cookies
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
            <p>© 2026 VANESEV Beauty &amp; Wellness Cloud &bull; Todos los derechos reservados &bull; Cero comisiones por reserva.</p>
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/584223794800"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp Comercial
              </a>
              <span>&bull;</span>
              <button
                type="button"
                onClick={onOpenCapraDemo}
                className="hover:text-white cursor-pointer"
              >
                Demo Oficial (/m/capra-studio)
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── FLOATING WHATSAPP COMMERCIAL BUTTON (BOTTOM-LEFT LIKE DKITCHEN) ─── */}
      <a
        href="https://wa.me/584223794800?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20VANESEV%20para%20mi%20sal%C3%B3n%20de%20belleza."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hablar con ventas por WhatsApp"
        className="fixed bottom-5 left-5 z-40 w-13 h-13 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>

      {/* ─── FLOATING BIRTHDAY FOUNTAIN BUTTON FOR VANESSA (CONTINUOUS HEARTS & CAKE) ─── */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-50 flex flex-col items-center">
        {/* Continuous Fountain of Mini Hearts 🩷, Roses 🌹, Cakes 🎂 & Kisses 💋 */}
        <div className="pointer-events-none relative w-20 h-28 -mb-4 overflow-visible">
          {[
            { emoji: '🩷', x: -22, delay: 0, dur: 2.2 },
            { emoji: '🎂', x: 6, delay: 0.4, dur: 2.5 },
            { emoji: '🌹', x: 24, delay: 0.8, dur: 2.3 },
            { emoji: '💋', x: -12, delay: 1.2, dur: 2.4 },
            { emoji: '💖', x: 16, delay: 1.6, dur: 2.1 },
            { emoji: '🎉', x: 0, delay: 1.9, dur: 2.3 },
          ].map((item, i) => (
            <motion.span
              key={i}
              initial={{ y: 85, x: 0, opacity: 0, scale: 0.5 }}
              animate={{
                y: [85, 10, -25],
                x: [0, item.x, item.x * 1.3],
                opacity: [0, 1, 0],
                scale: [0.6, 1.15, 0.8],
              }}
              transition={{
                duration: item.dur,
                repeat: Infinity,
                delay: item.delay,
                ease: 'easeOut',
              }}
              className="absolute left-1/2 -translate-x-1/2 text-lg sm:text-xl select-none drop-shadow-xs"
            >
              {item.emoji}
            </motion.span>
          ))}
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setPartyBurstId((n) => n + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Celebrar el cumpleaños #7 de Vanessa"
          className="relative px-4 py-3 rounded-full text-white font-extrabold text-xs sm:text-sm shadow-[0_14px_35px_rgba(225,29,116,0.48)] border-2 border-white flex items-center gap-2 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #FF2E93 0%, #E11D74 55%, #9D174D 100%)',
          }}
        >
          <span className="text-xl sm:text-2xl animate-bounce">🎂</span>
          <span className="leading-tight text-left">
            <span className="block text-[10px] uppercase tracking-wider text-[#FFE4EE]">7 Añitos</span>
            <span className="block font-extrabold">🩷 Vanessa</span>
          </span>
        </motion.button>
      </div>

      {/* ─── FULL-SCREEN VIEWPORT PARTY EXPLOSION OVERLAY ON ANY BUTTON TAP ─── */}
      <AnimatePresence mode="popLayout">
        {partyBurstId > 1 && (
          <motion.div
            key={`fullscreen-party-${partyBurstId}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.9, ease: 'easeOut' }}
            className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center overflow-hidden"
          >
            {BURST_PARTICLES.map((bp, idx) => (
              <motion.span
                key={idx}
                initial={{ x: 0, y: 0, scale: 0.3, opacity: 1 }}
                animate={{ x: bp.x * 1.65, y: bp.y * 1.65, scale: 1.9, opacity: 0 }}
                transition={{ duration: 1.6, ease: 'easeOut' }}
                className="absolute text-4xl sm:text-6xl select-none drop-shadow-md"
              >
                {bp.emoji}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODAL 1: SOLICITUD DE ALTA / CHECKOUT COMERCIAL DE SALÓN
      ═══════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {onboardingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setOnboardingModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-[32px] bg-white p-6 sm:p-8 shadow-2xl border border-[#161214]/10 relative"
            >
              <button
                type="button"
                onClick={() => setOnboardingModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#161214] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E3B52] block">
                PASO 1 DE 2 &bull; REGISTRO COMERCIAL DE SEDE
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#161214] mt-1">
                Activar mi Salón en VANESEV
              </h3>
              <p className="text-xs text-[#574B4F] mt-1">
                Plan seleccionado: <strong className="text-[#9E3B52]">{selectedPlanName}</strong>. Configuramos tu carta fotográfica antes de activar el cobro.
              </p>

              <form onSubmit={handleLeadSubmit} className="space-y-3.5 mt-5">
                <div>
                  <label className="text-xs font-bold text-[#161214] block mb-1">
                    Nombre de tu Salón, Estudio o Clínica:
                  </label>
                  <input
                    type="text"
                    required
                    value={leadSalonName}
                    onChange={(e) => setLeadSalonName(e.target.value)}
                    placeholder="Ej: Lumière Beauty Atelier"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#161214]/12 text-xs font-semibold focus:outline-none focus:border-[#9E3B52]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#161214] block mb-1">
                      Tu Nombre y Apellido:
                    </label>
                    <input
                      type="text"
                      required
                      value={leadOwnerName}
                      onChange={(e) => setLeadOwnerName(e.target.value)}
                      placeholder="Ej: Valentina Gómez"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#161214]/12 text-xs font-semibold focus:outline-none focus:border-[#9E3B52]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#161214] block mb-1">
                      WhatsApp de Contacto:
                    </label>
                    <input
                      type="tel"
                      required
                      value={leadWhatsapp}
                      onChange={(e) => setLeadWhatsapp(e.target.value)}
                      placeholder="Ej: +58 424-0000000"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#161214]/12 text-xs font-semibold focus:outline-none focus:border-[#9E3B52]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#161214] block mb-1">
                    Especialidad Principal:
                  </label>
                  <select
                    value={leadSpecialty}
                    onChange={(e) => setLeadSpecialty(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#161214]/12 text-xs font-semibold focus:outline-none focus:border-[#9E3B52]"
                  >
                    <option value="Cejas, Pestañas & Maquillaje">Cejas, Pestañas &amp; Maquillaje</option>
                    <option value="Peluquería, Colorimetría & Alisados">Peluquería, Colorimetría &amp; Alisados</option>
                    <option value="Clínica Estética, Facial & Spa">Clínica Estética, Facial &amp; Spa</option>
                    <option value="Nail Bar & Spa de Manos y Pies">Nail Bar &amp; Spa de Manos y Pies</option>
                    <option value="Barbería de Autor">Barbería de Autor</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full text-white text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #9E3B52 0%, #D95F43 100%)' }}
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Solicitud de Alta y Recibir Demo</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODAL 2: ZONA CLIENTE / PORTAL DE ACCESO PARA SALONES REGISTRADOS
      ═══════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {loginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setLoginModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[32px] bg-white p-6 sm:p-8 shadow-2xl border border-[#161214]/10 relative"
            >
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#161214] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-11 h-11 rounded-2xl bg-[#FAF0F2] text-[#9E3B52] flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E3B52] block">
                PORTAL EJECUTIVO VERTIX &bull; ZONA CLIENTE
              </span>
              <h3 className="font-display text-2xl font-bold text-[#161214] mt-1">
                Iniciar Sesión en mi Salón
              </h3>
              <p className="text-xs text-[#574B4F] mt-1">
                Ingresa el identificador de tu sede y tu clave ejecutiva para acceder a tu panel de agenda, precios y diseño.
              </p>

              {loginError && (
                <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleClientLoginSubmit} className="space-y-3.5 mt-4">
                <div>
                  <label className="text-xs font-bold text-[#161214] block mb-1">
                    Sede / Identificador del Salón:
                  </label>
                  <input
                    type="text"
                    required
                    value={loginSalonSlug}
                    onChange={(e) => setLoginSalonSlug(e.target.value)}
                    placeholder="Ej: capra-studio"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#161214]/12 text-xs font-semibold focus:outline-none focus:border-[#9E3B52]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#161214] block mb-1">
                    PIN / Clave Ejecutiva de Sede:
                  </label>
                  <input
                    type="password"
                    required
                    value={loginAccessPin}
                    onChange={(e) => setLoginAccessPin(e.target.value)}
                    placeholder="Introduce tu clave (demo: 2026)"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#161214]/12 text-xs font-semibold focus:outline-none focus:border-[#9E3B52]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#161214] hover:bg-[#2E2528] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Entrar al Panel de mi Salón &rarr;
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODAL 3: LECTURA COMPLETA DE ARTÍCULO DEL BLOG
      ═══════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActiveArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-[32px] bg-white overflow-hidden shadow-2xl border border-[#161214]/10 max-h-[88vh] flex flex-col"
            >
              <div className="relative h-56 shrink-0">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-[#161214] flex items-center justify-center shadow-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9E3B52]">
                  {activeArticle.category} &bull; {activeArticle.readTime}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#161214]">
                  {activeArticle.title}
                </h3>
                {activeArticle.content.map((p, i) => (
                  <p key={i} className="text-sm text-[#3F373A] leading-relaxed">
                    {p}
                  </p>
                ))}
                <div className="pt-4 border-t border-[#161214]/10 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveArticle(null);
                      openCheckoutWithPlan('Salon Couture Pro ($29/mes)');
                    }}
                    className="px-6 py-3 rounded-full text-white text-xs font-bold cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #9E3B52 0%, #D95F43 100%)' }}
                  >
                    Aplicar esta estrategia en mi salón &rarr;
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODAL 4: TEXTOS LEGALES CORPORATIVOS
      ═══════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {legalModalTitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setLegalModalTitle(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl rounded-[28px] bg-white p-6 sm:p-8 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-[#161214]">{legalModalTitle}</h3>
                <button
                  type="button"
                  onClick={() => setLegalModalTitle(null)}
                  className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-[#574B4F] leading-relaxed">
                VANESEV Beauty &amp; Wellness Cloud garantiza que cada salón afiliado conserva el 100% de la titularidad sobre su catálogo de servicios, fotografías, tarifas y registros de clientas VIP, operando bajo aislamiento multi-tenant estricto en bases de datos cifradas y sin cobro de comisiones por intermediación.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
