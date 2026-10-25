import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  Check,
  QrCode,
  Calendar,
  Award,
  Sparkles,
  ExternalLink,
  X,
  Menu,
  ShieldCheck,
  Clock,
  Star,
  MapPin,
  ChevronRight,
  Smartphone,
  CreditCard,
  Building2,
  Zap,
  BookOpen,
} from 'lucide-react';
import { QREncoder } from '../utils/qrEncoder';

interface VanesevLandingProps {
  onOpenCentral: () => void;
  onSelectTenant: (slug: 'andrea-nails' | 'capra-studio') => void;
}

interface NicheSpec {
  id: 'hair' | 'nails' | 'barber' | 'medspa' | 'academy';
  label: string;
  shortLabel: string;
  badge: string;
  headlineAccent: string;
  painTitle: string;
  painDetail: string;
  solutionTitle: string;
  solutionDetail: string;
  heroImage: string;
  demoBrandName: string;
  demoBrandSub: string;
  demoAccent: string;
  demoRecommendation: { name: string; price: string; duration: string };
  demoServices: { name: string; desc: string; price: string; duration: string; image: string }[];
  metrics: { value: string; label: string }[];
}

const NICHES: Record<NicheSpec['id'], NicheSpec> = {
  hair: {
    id: 'hair',
    label: 'Peluquería & Color',
    shortLabel: 'Peluquería',
    badge: 'Especialistas en Balayage, Alisados y Estilismo',
    headlineAccent: 'peluquería de autor',
    painTitle: 'Sillas vacías por cancelaciones de última hora y comisiones confusas',
    painDetail:
      'Los trabajos técnicos de 3 o 4 horas bloquean media jornada. Si una clienta no avisa o dos estilistas reservan el mismo lavacabezas a la vez, el salón pierde cientos de dólares esa semana.',
    solutionTitle: 'Asignación inteligente de tocadores, tiempos de pose y liquidación de equipo',
    solutionDetail:
      'Tu carta QR muestra cada tratamiento capilar con diagnóstico previo, bloquea tocador y estilista automáticamente y calcula la comisión exacta de cada profesional al cerrar la cita.',
    heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=85',
    demoBrandName: 'Atelier Lumière',
    demoBrandSub: 'Alta Peluquería & Colorimetría Orgánica',
    demoAccent: '#8E1B46',
    demoRecommendation: {
      name: 'Alisado Orgánico Efecto Espejo',
      price: '$45',
      duration: '150 min',
    },
    demoServices: [
      {
        name: 'Balayage Contouring + Olaplex',
        desc: 'Diseño de iluminación a mano alzada con protección de enlaces y matiz.',
        price: '$65',
        duration: '180 min',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=500&q=80',
      },
      {
        name: 'Brushing Editorial & Ondas Seda',
        desc: 'Lavado spa detox, termoprotección y estilizado de larga duración.',
        price: '$18',
        duration: '50 min',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80',
      },
    ],
    metrics: [
      { value: '+38%', label: 'Ticket medio con tratamientos adicionales en reserva' },
      { value: '0%', label: 'Comisiones cedidas a directorios externos' },
      { value: '21 días', label: 'Frecuencia de retorno con tarjeta VIP digital' },
    ],
  },
  nails: {
    id: 'nails',
    label: 'Uñas & Nails Bar',
    shortLabel: 'Nails & Spa',
    badge: 'Manicura Rusa, Nivelación Rubber, Polygel y Pedi Spa',
    headlineAccent: 'estudio de uñas',
    painTitle: 'Noches enteras respondiendo precios por WhatsApp y clientas que olvidan el retoque',
    painDetail:
      'Explicar por chat la diferencia entre Rubber, Polygel y Jelly Tips consume horas. Y sin un sistema de fidelización en su móvil, la clienta deja pasar 5 semanas o prueba otro estudio.',
    solutionTitle: 'Catálogo visual con extras (Manos + Pies) y Tarjeta VIP de 5 sellos',
    solutionDetail:
      'La clienta elige sistema, largo y decoración desde su móvil viendo fotos reales y precios tanto en dólares como en moneda local. Al 5.º sello desbloquea su obsequio y nunca abandona tu mesa.',
    heroImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1400&q=85',
    demoBrandName: 'Maison Vernis',
    demoBrandSub: 'Nails Bar & Pedicure Spa Clínico',
    demoAccent: '#9A2B52',
    demoRecommendation: {
      name: 'Nivelación Base Rubber + Manicura Rusa',
      price: '$18',
      duration: '75 min',
    },
    demoServices: [
      {
        name: 'Extensiones Soft Gel / Jelly Tips',
        desc: 'Estructura ultraligera de acabado natural con esmaltado en gel.',
        price: '$22',
        duration: '90 min',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=500&q=80',
      },
      {
        name: 'Pedicure Spa Botánico Integral',
        desc: 'Exfoliación profunda, sales relajantes, retiro de durezas y gel.',
        price: '$16',
        duration: '60 min',
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=500&q=80',
      },
    ],
    metrics: [
      { value: '+46%', label: 'Retención en ciclos exactos de mantenimiento de 21 días' },
      { value: '1 toque', label: 'Selección combinada de Manos + Pies en la misma cita' },
      { value: '100%', label: 'Propiedad total de tu cartera de clientas' },
    ],
  },
  barber: {
    id: 'barber',
    label: 'Barbería & Grooming',
    shortLabel: 'Barbería',
    badge: 'Cortes de Autor, Perfilado a Navaja y Ritual de Barba',
    headlineAccent: 'barbería clásica',
    painTitle: 'Colas sin control los viernes y clientes que se marchan al ver espera',
    painDetail:
      'En barbería la velocidad lo es todo. Si reservar requiere descargar una app con registro obligatorio de correo y contraseña, el cliente desiste o entra a otra barbería de paso.',
    solutionTitle: 'Reserva exprés en 15 segundos por sillón y barbero favorito',
    solutionDetail:
      'Escanean el QR del sillón antes de salir y dejan agendado su corte para dentro de 15 días. El club de 5 cortes premia la constancia con perfilado de barba o bebida de cortesía.',
    heroImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=85',
    demoBrandName: 'Vanguardia Barber Club',
    demoBrandSub: 'Sastrería Capilar & Ritual de Toalla Caliente',
    demoAccent: '#B45309',
    demoRecommendation: {
      name: 'Corte Ejecutivo + Ritual Barba Vapor',
      price: '$24',
      duration: '50 min',
    },
    demoServices: [
      {
        name: 'Skin Fade / Degradado de Precisión',
        desc: 'Corte a tijera y máquina con acabado a navaja y lavado refrescante.',
        price: '$15',
        duration: '35 min',
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=500&q=80',
      },
      {
        name: 'Esculpido de Barba & Toalla Caliente',
        desc: 'Aceites esenciales, vapor de ozono, afeitado tradicional y aftershave.',
        price: '$14',
        duration: '30 min',
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=500&q=80',
      },
    ],
    metrics: [
      { value: '15 seg', label: 'Tiempo medio para reservar sillón desde el móvil' },
      { value: '+52%', label: 'Ocupación en martes y miércoles de menor tráfico' },
      { value: '0%', label: 'Fricción: sin contraseñas ni descargas en tienda' },
    ],
  },
  medspa: {
    id: 'medspa',
    label: 'Clínica Estética & MedSpa',
    shortLabel: 'Estética & Spa',
    badge: 'Armonización Facial, Aparatología, Láser y Cabinas',
    headlineAccent: 'clínica estética',
    painTitle: 'Cruce de aparatología entre cabinas y pacientes que abandonan sus sesiones',
    painDetail:
      'Cuando tienes dos cabinas pero un solo equipo de radiofrecuencia o láser, una agenda convencional provoca solapamientos críticos. Además, los tratamientos por sesiones suelen quedar a medias.',
    solutionTitle: 'Sincronización de cabina + equipo médico y seguimiento de paquetes',
    solutionDetail:
      'Cada protocolo reserva simultáneamente al especialista y la cabina equipada. La ficha digital registra el avance de las 5 sesiones del paciente con privacidad absoluta.',
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=85',
    demoBrandName: 'Clinique Aura',
    demoBrandSub: 'Medicina Estética, Dermo-Cosmética & Láser',
    demoAccent: '#0F766E',
    demoRecommendation: {
      name: 'HydraFacial MD + Bioestimulación LED',
      price: '$55',
      duration: '60 min',
    },
    demoServices: [
      {
        name: 'Higiene Facial Profunda Ultrasónica',
        desc: 'Extracción atraumática, peeling enzimático, alta frecuencia y velo.',
        price: '$35',
        duration: '60 min',
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=500&q=80',
      },
      {
        name: 'Depilación Láser Diodo Cuerpo Completo',
        desc: 'Cabezal frío indoloro en cabina climatizada con evaluación dérmica.',
        price: '$70',
        duration: '75 min',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80',
      },
    ],
    metrics: [
      { value: '0 cruces', label: 'Bloqueo simultáneo de cabina física y aparatología' },
      { value: '+64%', label: 'Finalización completa de bonos de 5 sesiones' },
      { value: '24/7', label: 'Recepción digital activa fuera de horario clínico' },
    ],
  },
  academy: {
    id: 'academy',
    label: 'Academia & Formación',
    shortLabel: 'Academia',
    badge: 'Escuelas de Belleza, Masterclasses y Cursos Certificados',
    headlineAccent: 'academia y estudio',
    painTitle: 'Salón y escuela mezclados sin separar reservas de clientas e inscripciones de alumnas',
    painDetail:
      'Muchos salones líderes dictan formación presencial, pero venden los cupos de forma improvisada por mensajes directos, perdiendo el control de abonos del 50% y plazas restantes.',
    solutionTitle: 'Doble motor integrado: Servicios de Salón + Cartelera de Cursos con cupos',
    solutionDetail:
      'Así como Capra Studio opera sus 6 departamentos junto a Capra Academy, tu plataforma muestra servicios diarios y masterclasses certificadas con reserva de plaza en el mismo ecosistema.',
    heroImage: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=85',
    demoBrandName: 'Capra Studio & Academy',
    demoBrandSub: 'Salón Integral & Escuela de Formación Certificada',
    demoAccent: '#8E4A59',
    demoRecommendation: {
      name: 'Masterclass: Diseño de Cejas & Laminado HD',
      price: '$80',
      duration: '240 min',
    },
    demoServices: [
      {
        name: 'Curso Intensivo: Maquillaje Pro & Piel Blindada',
        desc: 'Práctica con modelo real, guía impresa, materiales en aula y certificado.',
        price: '$95',
        duration: '4 horas',
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80',
      },
      {
        name: 'Laminado de Cejas + Visagismo (Servicio en Salón)',
        desc: 'Diseño geométrico, keratina nutritiva y pigmentación híbrida.',
        price: '$18',
        duration: '45 min',
        image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=500&q=80',
      },
    ],
    metrics: [
      { value: '2 en 1', label: 'Agenda de clientas y matrícula de alumnas en un solo panel' },
      { value: '50%', label: 'Flujo claro de reserva de cupo con anticipo verificado' },
      { value: '+2.4x', label: 'Conversión de clientas habituales en alumnas de cursos' },
    ],
  },
};

const JOURNAL_ARTICLES = [
  {
    id: 'marketplaces-comisiones',
    category: 'Economía de Salón',
    readTime: '4 min de lectura',
    date: 'Octubre 2026',
    author: 'Equipo de Estrategia · VANESEV',
    title: 'La trampa de los directorios: por qué las apps "gratis" le cuestan hasta $4,500 al año a tu salón',
    excerpt:
      'Analizamos la letra pequeña de las plataformas que prometen alta gratuita pero retienen entre el 20% y el 25% por nueva clienta y anuncian a tu competencia en tu propia ficha.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
    content: [
      'Durante años, los grandes directorios de reservas vendieron una promesa atractiva a peluquerías y centros de estética: "software sin cuota mensual". Sin embargo, el coste real aparece en las liquidaciones: comisiones de entre el 20% y el 25% por cada clienta captada, recargos por transacción y penalizaciones.',
      'En un salón con 140 citas mensuales y un ticket medio de $25 USD, ceder el 20% equivale a entregar $700 USD cada mes —más de $8,400 USD al año— a un intermediario.',
      'El segundo problema es de marca: en un directorio, tu salón es una fila más junto a otros veinte locales de tu misma calle que compiten bajando precios. Con VANESEV, el código QR de tu tocador y el enlace de tu Instagram abren exclusivamente tu casa, con tu identidad visual, tus tarifas y cero anuncios de terceros.',
    ],
  },
  {
    id: 'fidelizacion-5-sellos',
    category: 'Retención & Psicología',
    readTime: '5 min de lectura',
    date: 'Octubre 2026',
    author: 'Dirección de Producto · VANESEV',
    title: 'Por qué las tarjetas de cartón acaban en la papelera y el Club Digital de 5 sellos acorta el ciclo a 21 días',
    excerpt:
      'El progreso visible en la pantalla del teléfono activa el efecto de meta alcanzada: cuando una clienta ve 3 de 5 sellos completados, no cambia de salón.',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=80',
    content: [
      'Siete de cada diez tarjetas de fidelización impresas en cartulina se pierden o se olvidan en otro bolso antes de la tercera visita. Cuando la clienta llega a recepción y no la trae consigo, el programa de premios pierde todo su efecto.',
      'Al trasladar la tarjeta VIP directamente al navegador móvil vinculada a su número de teléfono, la clienta consulta sus sellos acumulados en el mismo lugar donde agenda su próxima cita.',
      'Establecer una meta corta y alcanzable de 5 visitas (en lugar de 10) mantiene la recompensa cerca. Nuestros estudios en salones activos muestran que a partir del tercer sello la tasa de retorno supera el 88% y el tiempo entre visitas baja de 34 a 21 días.',
    ],
  },
  {
    id: 'sincronizacion-multicabina',
    category: 'Operaciones & Espacio',
    readTime: '3 min de lectura',
    date: 'Octubre 2026',
    author: 'Arquitectura Operativa · VANESEV',
    title: 'Sincronización multi-cabina: cómo facturar más por metro cuadrado sin cruces en el equipo',
    excerpt:
      'Organizar tocadores, sillones de pedicura y cabinas privadas como recursos vinculados evita esperas en recepción y automatiza el cálculo de comisiones.',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80',
    content: [
      'El cuello de botella de un salón en crecimiento rara vez es la falta de demanda: suele ser el desorden interno en horas punta. Dos especialistas citando a la vez para la misma camilla de pestañas o el mismo sillón de spa genera retrasos en cadena.',
      'En VANESEV cada reserva vincula tres variables: el servicio, la especialista elegida y la zona o cabina física. En cuanto un turno se confirma, ese recurso queda blindado.',
      'Además, al cierre de la jornada o de la semana, el panel calcula al centavo cuánto facturó cada miembro del equipo según su porcentaje asignado, eliminando las horas de cuadre manual en libreta.',
    ],
  },
];

export const VanesevLanding: React.FC<VanesevLandingProps> = ({
  onOpenCentral,
  onSelectTenant,
}) => {
  const [selectedNiche, setSelectedNiche] = useState<NicheSpec['id']>('hair');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Phone Mockup State
  const [phoneTab, setPhoneTab] = useState<'carta' | 'reserva' | 'vip'>('carta');
  const [selectedStaffIdx, setSelectedStaffIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('16:30');
  const [simBookingDone, setSimBookingDone] = useState(false);
  const [simStamps, setSimStamps] = useState(4);

  // Interactive ROI Calculator State
  const [monthlyClients, setMonthlyClients] = useState<number>(140);
  const [averageTicket, setAverageTicket] = useState<number>(25);

  // Pricing & Modals
  const [billingCycle, setBillingCycle] = useState<'quarterly' | 'monthly'>('quarterly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{
    name: string;
    price: string;
    period: string;
  } | null>(null);
  const [checkoutSalonName, setCheckoutSalonName] = useState('');
  const [checkoutOwnerPhone, setCheckoutOwnerPhone] = useState('');
  const [checkoutNiche, setCheckoutNiche] = useState('Peluquería / Salón Integral');
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'card' | 'transfer' | 'binance'>('transfer');
  const [activeArticle, setActiveArticle] = useState<(typeof JOURNAL_ARTICLES)[0] | null>(null);

  const currentNiche = NICHES[selectedNiche];

  // Financial math
  const monthlyGrossRevenue = monthlyClients * averageTicket;
  const platformCommissionLoss = Math.round(monthlyGrossRevenue * 0.2);
  const retentionExtraRevenue = Math.round(monthlyGrossRevenue * 0.32);

  // Live QR SVG for the interactive showcase
  const sampleQrSvg = useMemo(() => {
    try {
      const matrix = QREncoder.generateMatrix('https://vanesev.com/r/capra-menu');
      return QREncoder.toSVG(matrix, {
        fgColor: '#16151A',
        bgColor: '#FFFFFF',
        centerText: 'VN',
      });
    } catch {
      return '';
    }
  }, []);

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForCheckout) return;
    const methodLabel =
      checkoutPaymentMethod === 'card'
        ? 'Tarjeta Internacional'
        : checkoutPaymentMethod === 'binance'
        ? 'Binance Pay / USDT'
        : 'Transferencia / Pago Móvil / Zelle';

    const message =
      `Hola equipo VANESEV, solicito activar mi cuenta en la plataforma:\n\n` +
      `• Plan elegido: *${selectedPlanForCheckout.name}* ($${selectedPlanForCheckout.price} USD/mes - ${selectedPlanForCheckout.period})\n` +
      `• Nombre del Salón: *${checkoutSalonName || 'Por definir'}*\n` +
      `• Especialidad: *${checkoutNiche}*\n` +
      `• WhatsApp de contacto: *${checkoutOwnerPhone || 'Por definir'}*\n` +
      `• Método de pago: *${methodLabel}*\n\n` +
      `Quiero recibir mi enlace /m/ y mi kit de QR dinámico.`;

    window.open(
      `https://wa.me/584247429530?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setSelectedPlanForCheckout(null);
  };

  return (
    <div className="min-h-screen bg-crema text-tinta font-sans antialiased selection:bg-cassis/20 selection:text-tinta">
      {/* ══ FLOATING CAPSULE NAVBAR (DKITCHEN-GRADE ARCHITECTURAL DOCK) ══ */}
      <header className="fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-4 sm:pt-5">
        <nav
          aria-label="Principal"
          className="flex w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-white/12 bg-obsidiana/88 py-2.5 pl-5 pr-2.5 text-white shadow-[0_14px_44px_rgba(12,10,14,0.38)] backdrop-blur-xl"
        >
          <a
            href="#inicio"
            className="font-display shrink-0 text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5"
          >
            <span>
              VANE<span className="text-[#E04D7A]">SEV</span>
            </span>
            <span className="hidden sm:inline-block rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
              Atelier Cloud
            </span>
          </a>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {[
              { href: '#sectores', label: 'Sectores' },
              { href: '#carta-qr', label: 'Carta QR' },
              { href: '#superpoderes', label: 'Por dentro' },
              { href: '#calculadora', label: 'Calculadora' },
              { href: '#planes', label: 'Precios' },
              { href: '#casos', label: 'Casos en vivo' },
              { href: '#journal', label: 'Journal' },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/72 transition-colors hover:bg-white/8 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCentral}
              className="hidden whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/75 transition hover:text-white xl:block cursor-pointer"
            >
              Zona cliente · Central
            </button>
            <a
              href="#planes"
              className="whitespace-nowrap rounded-full bg-cassis px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-[0_6px_24px_rgba(142,27,70,0.45)] transition hover:bg-cassis-hondo"
            >
              Crear mi cuenta
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú de navegación"
              aria-expanded={mobileMenuOpen}
              className="rounded-full p-2 text-white hover:bg-white/10 lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-x-3 top-20 z-[101] rounded-3xl border border-white/15 bg-obsidiana/96 p-5 text-white shadow-2xl backdrop-blur-2xl lg:hidden">
            <div className="grid grid-cols-2 gap-2 pb-4 border-b border-white/10">
              {[
                { href: '#sectores', label: '5 Sectores' },
                { href: '#carta-qr', label: 'Carta QR en Tocador' },
                { href: '#superpoderes', label: 'Por dentro (Suite)' },
                { href: '#calculadora', label: 'Calculadora de Ahorro' },
                { href: '#planes', label: 'Planes y Precios' },
                { href: '#casos', label: 'Salones en Vivo' },
                { href: '#journal', label: 'Revista Editorial' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-white/90 hover:bg-white/10"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="pt-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 px-1">
                Demos reales y acceso directo
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSelectTenant('capra-studio');
                  }}
                  className="rounded-2xl border border-white/15 bg-white/8 px-3 py-2.5 text-left text-xs font-semibold text-white cursor-pointer"
                >
                  <span className="block text-[#F2D5DF] text-[10px]">Salón + Academia</span>
                  Ver Capra Studio →
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSelectTenant('andrea-nails');
                  }}
                  className="rounded-2xl border border-white/15 bg-white/8 px-3 py-2.5 text-left text-xs font-semibold text-white cursor-pointer"
                >
                  <span className="block text-emerald-300 text-[10px]">Nails & Pedi Spa</span>
                  Ver Andrea Nails →
                </button>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCentral();
                }}
                className="w-full rounded-2xl bg-white/10 py-2.5 text-center text-xs font-bold text-white cursor-pointer"
              >
                Entrar a Zona Cliente / Central Super-Admin
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ══ HERO MONUMENTAL (NOCHE + ATMOSPHERIC DEPTH + 3D DEVICE) ══ */}
      <section
        id="inicio"
        className="relative overflow-hidden bg-noche pt-28 pb-20 text-white sm:pt-36 md:pt-40 md:pb-28"
      >
        {/* Persistent Atmospheric Background Layer (house-style.md recipe) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-[15%] bottom-[-35%] h-[65vmax] w-[65vmax] rounded-full opacity-45 blur-[110px] [background:radial-gradient(closest-side,rgba(142,27,70,0.55),transparent)] animate-[deriva1_22s_ease-in-out_infinite_alternate]" />
          <div className="absolute -left-[25%] -top-[30%] h-[75vmax] w-[75vmax] rounded-full opacity-50 blur-[110px] [background:radial-gradient(closest-side,rgba(107,18,51,0.6),transparent)] animate-[deriva2_26s_ease-in-out_infinite_alternate]" />
          <div className="absolute bottom-[-40%] left-[28%] h-[55vmax] w-[55vmax] rounded-full opacity-25 blur-[100px] [background:radial-gradient(closest-side,rgba(200,169,106,0.28),transparent)]" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            {/* Left Editorial Column */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-3.5 py-1.5 text-xs text-white/85 backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span>Marca propia para salones y estética · 0% comisiones</span>
              </div>

              <h1 className="font-display mt-6 text-[42px] font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-[76px]">
                Tu {currentNiche.headlineAccent},{' '}
                <span className="acento-serif font-normal text-[#F4D3DF] block sm:inline">
                  con marca propia.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/72">
                Tu carta digital con QR dinámico en cada tocador, agenda multi-cabina sin solapamientos y tarjeta VIP de 5 sellos en el móvil de tu clienta. Un directorio con comisiones lo tiene cualquiera: nosotros te damos una marca que vende y retiene.
              </p>

              {/* Interactive 5-Niche Selector Pills */}
              <div className="mt-7 space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
                  Elige el giro de tu negocio para adaptar la demostración en vivo:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.values(NICHES) as NicheSpec[]).map((n) => {
                    const active = selectedNiche === n.id;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          setSelectedNiche(n.id);
                          setSimBookingDone(false);
                        }}
                        className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-cassis text-white shadow-[0_6px_20px_rgba(142,27,70,0.45)] border border-[#E04D7A]'
                            : 'bg-white/6 text-white/70 border border-white/12 hover:bg-white/12 hover:text-white'
                        }`}
                      >
                        {n.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#planes"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cassis px-7 py-4 text-[15px] font-semibold text-white shadow-[0_10px_40px_rgba(142,27,70,0.45)] transition hover:bg-cassis-hondo"
                >
                  <span>Quiero mi propio sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => onSelectTenant('capra-studio')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/6 px-7 py-4 text-[15px] font-semibold text-white backdrop-blur transition hover:border-white/45 hover:bg-white/10 cursor-pointer"
                >
                  <span>Ver un salón real en vivo</span>
                  <ExternalLink className="w-4 h-4 text-oro" />
                </button>
              </div>

              <p className="mt-5 text-xs sm:text-sm text-white/60">
                ¿Solo quieres la carta QR de servicios?{' '}
                <a
                  href="#carta-qr"
                  className="font-semibold text-white underline decoration-cassis decoration-2 underline-offset-4"
                >
                  Conoce cómo funciona
                </a>{' '}
                ·{' '}
                <a
                  href="https://wa.me/584247429530?text=Hola%2C%20quiero%20ver%20una%20demo%20de%20VANESEV%20para%20mi%20sal%C3%B3n."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white underline decoration-emerald-400 decoration-2 underline-offset-4"
                >
                  Pedir demostración por WhatsApp
                </a>
              </p>

              {/* 3 Lining Tabular Metric Callouts */}
              <div className="mt-9 grid grid-cols-3 gap-3 border-t border-white/12 pt-6">
                {currentNiche.metrics.map((m, i) => (
                  <div key={i}>
                    <span className="font-display text-2xl sm:text-3xl font-extrabold text-white tabular-nums block">
                      {m.value}
                    </span>
                    <span className="mt-1 block text-[11px] sm:text-xs text-white/60 leading-snug">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: 3D Titanium Smartphone + Floating Live Badges */}
            <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[330px]">
              {/* Interactive Mode Switcher Pill above the Phone */}
              <div className="mb-4 grid grid-cols-3 gap-1 rounded-full border border-white/15 bg-white/8 p-1 backdrop-blur-xl">
                {[
                  { id: 'carta', label: '1. Carta QR' },
                  { id: 'reserva', label: '2. Cabinas' },
                  { id: 'vip', label: '3. Club VIP' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPhoneTab(tab.id as any)}
                    className={`rounded-full py-2 text-[11px] font-bold transition-all cursor-pointer ${
                      phoneTab === tab.id
                        ? 'bg-white text-noche shadow-sm'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Ambient Glow behind Phone */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[-12%] rounded-full bg-[radial-gradient(closest-side,rgba(142,27,70,0.38),transparent)] blur-2xl"
              />

              {/* Titanium Bezel Device Frame */}
              <div className="relative rounded-[48px] p-[3px] shadow-[0_50px_110px_-20px_rgba(0,0,0,0.75)] [background:linear-gradient(145deg,#6b707b,#1b1d22_35%,#0b0c0f_70%,#4a4e57)]">
                <div className="rounded-[45px] bg-obsidiana p-[9px]">
                  <div className="relative overflow-hidden rounded-[36px] bg-[#151319] text-[#F5F2EB]">
                    {/* Dynamic Island */}
                    <div className="absolute left-1/2 top-2.5 z-30 h-[20px] w-[86px] -translate-x-1/2 rounded-full bg-black flex items-center justify-end pr-2.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>

                    {/* Glass Reflection Shimmer */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-20 animate-[reflejo_7s_ease-in-out_infinite] [background:linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.1)_48%,transparent_60%)] [background-size:250%_100%]"
                    />

                    {/* ── PHONE VIEW 1: LIVE AUTHOR QR CATALOG (LIKE EL RINCÓN DEL FLORES) ── */}
                    {phoneTab === 'carta' && (
                      <div className="flex flex-col justify-between">
                        {/* Salon Atmospheric Header */}
                        <div className="relative h-36 overflow-hidden">
                          <img
                            src={currentNiche.heroImage}
                            alt={currentNiche.demoBrandName}
                            className="h-full w-full object-cover opacity-55"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#151319] via-[#151319]/40 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-4">
                            <span className="inline-block rounded-full bg-white/15 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white/90">
                              vanesev.com/m/{selectedNiche}
                            </span>
                            <p className="mt-1 font-display text-xl font-bold text-white leading-tight">
                              {currentNiche.demoBrandName}
                            </p>
                            <p className="text-[11px] text-white/75 truncate">
                              {currentNiche.demoBrandSub}
                            </p>
                          </div>
                        </div>

                        {/* Recommended Today Banner */}
                        <div className="px-3.5 pt-2">
                          <div
                            onClick={() => setPhoneTab('reserva')}
                            className="flex items-center justify-between gap-2 rounded-2xl border border-dashed border-white/30 p-2.5 cursor-pointer transition hover:brightness-110"
                            style={{ backgroundColor: currentNiche.demoAccent }}
                          >
                            <div className="min-w-0">
                              <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">
                                Hoy recomendamos
                              </span>
                              <span className="block text-xs font-bold text-white truncate">
                                {currentNiche.demoRecommendation.name}
                              </span>
                            </div>
                            <span className="shrink-0 rounded-xl bg-black/25 px-2.5 py-1 text-xs font-extrabold text-white tabular-nums">
                              {currentNiche.demoRecommendation.price}
                            </span>
                          </div>
                        </div>

                        {/* Services Grid Inside Phone */}
                        <div className="px-3.5 pt-3 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-white/90">Carta de Servicios</span>
                            <span className="text-white/50 tabular-nums">Precios en vivo</span>
                          </div>

                          <div className="space-y-2">
                            {currentNiche.demoServices.map((srv, idx) => (
                              <div
                                key={idx}
                                onClick={() => setPhoneTab('reserva')}
                                className="flex items-center gap-3 rounded-2xl bg-[#201D26] p-2.5 border border-white/8 hover:border-white/20 transition cursor-pointer"
                              >
                                <img
                                  src={srv.image}
                                  alt={srv.name}
                                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-1">
                                    <p className="text-xs font-bold text-white leading-snug truncate">
                                      {srv.name}
                                    </p>
                                    <span className="shrink-0 rounded-lg bg-white/10 px-2 py-0.5 text-xs font-extrabold text-[#F4D3DF] tabular-nums">
                                      {srv.price}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-[10px] text-white/60 line-clamp-1">
                                    {srv.desc}
                                  </p>
                                  <span className="mt-1 inline-block text-[9px] font-semibold text-emerald-400">
                                    ⏱ {srv.duration} · Toca para agendar →
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Phone Bottom Capsule Bar */}
                        <div className="p-3.5 pt-4">
                          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/80 p-1">
                            <button
                              type="button"
                              onClick={() => setPhoneTab('vip')}
                              className="flex-1 rounded-full py-2 text-[10px] font-semibold text-white/85 hover:text-white cursor-pointer"
                            >
                              Mi Club VIP
                            </button>
                            <button
                              type="button"
                              onClick={() => setPhoneTab('reserva')}
                              className="flex-1 rounded-full py-2 text-[10px] font-bold text-white cursor-pointer"
                              style={{ backgroundColor: currentNiche.demoAccent }}
                            >
                              Reservar Cita
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── PHONE VIEW 2: MULTI-CABIN & SPECIALIST BOOKING ── */}
                    {phoneTab === 'reserva' && (
                      <div className="p-4 pt-10 space-y-3.5">
                        <div className="border-b border-white/10 pb-2.5">
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F4D3DF] block">
                            SINCRONIZACIÓN EN VIVO
                          </span>
                          <p className="font-display text-base font-bold text-white">
                            Reserva Especialista &amp; Cabina
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-semibold text-white/65 block">
                            1. Elige quién te atiende y en qué estación:
                          </span>
                          {[
                            { name: 'María G. · Directora', zone: 'Cabina Principal #1' },
                            { name: 'Valeria M. · Senior', zone: 'Estación VIP #2' },
                          ].map((st, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectedStaffIdx(idx);
                                setSimBookingDone(false);
                              }}
                              className={`w-full rounded-2xl p-2.5 text-left border transition cursor-pointer flex items-center justify-between ${
                                selectedStaffIdx === idx
                                  ? 'bg-white/12 border-[#E04D7A] text-white'
                                  : 'bg-[#201D26] border-white/8 text-white/70'
                              }`}
                            >
                              <div>
                                <span className="text-xs font-bold block">{st.name}</span>
                                <span className="text-[10px] text-emerald-400">{st.zone} · Libre</span>
                              </div>
                              <div
                                className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                  selectedStaffIdx === idx
                                    ? 'border-[#E04D7A] bg-cassis'
                                    : 'border-white/30'
                                }`}
                              >
                                {selectedStaffIdx === idx && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-semibold text-white/65 block">
                            2. Horarios disponibles hoy (bloqueo automático):
                          </span>
                          <div className="grid grid-cols-3 gap-1.5">
                            {['10:30', '14:00', '16:30'].map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => {
                                  setSelectedSlot(slot);
                                  setSimBookingDone(false);
                                }}
                                className={`rounded-xl py-2 text-xs font-bold tabular-nums border transition cursor-pointer ${
                                  selectedSlot === slot
                                    ? 'bg-white text-noche border-white'
                                    : 'bg-[#201D26] text-white/75 border-white/10'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>

                        {simBookingDone ? (
                          <div className="rounded-2xl bg-emerald-500/20 border border-emerald-400/40 p-3 text-center space-y-1">
                            <p className="text-xs font-bold text-emerald-300">
                              ✓ Turno {selectedSlot} Blindado en Agenda
                            </p>
                            <p className="text-[10px] text-white/75">
                              Cabina bloqueada y sello VIP preparado.
                            </p>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSimBookingDone(true)}
                            className="w-full rounded-2xl bg-cassis py-3 text-xs font-bold text-white shadow-lg transition hover:bg-cassis-hondo cursor-pointer"
                          >
                            Confirmar Cita de las {selectedSlot} →
                          </button>
                        )}

                        <div className="pt-1 flex justify-between items-center text-[10px] text-white/50 border-t border-white/10">
                          <span>0% comisión por reserva</span>
                          <button
                            type="button"
                            onClick={() => setPhoneTab('vip')}
                            className="text-[#F4D3DF] font-semibold underline cursor-pointer"
                          >
                            Ver Tarjeta VIP →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ── PHONE VIEW 3: 5-STAMP DIGITAL LOYALTY CARD ── */}
                    {phoneTab === 'vip' && (
                      <div className="p-4 pt-10 space-y-3.5">
                        <div className="border-b border-white/10 pb-2.5 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-oro block">
                              FIDELIZACIÓN SIN CARTÓN
                            </span>
                            <p className="font-display text-base font-bold text-white">
                              Club VIP · 5 Visitas
                            </p>
                          </div>
                          <span className="rounded-full bg-oro/20 border border-oro/40 px-2.5 py-0.5 text-[10px] font-extrabold text-oro tabular-nums">
                            {simStamps}/5 Sellos
                          </span>
                        </div>

                        {/* Interactive 5 Stamps Box */}
                        <div className="rounded-2xl bg-gradient-to-br from-[#231D29] to-[#17141C] p-3.5 border border-white/12 space-y-3">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-white">Clienta: Mariana Rivas</span>
                            <span className="text-white/50 text-[10px]">Toca un sello:</span>
                          </div>

                          <div className="grid grid-cols-5 gap-1.5">
                            {[1, 2, 3, 4, 5].map((num) => {
                              const active = simStamps >= num;
                              return (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => setSimStamps(num)}
                                  className={`h-11 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                                    active
                                      ? 'bg-gradient-to-br from-[#E5C158] to-[#B88A36] border-[#F3D87D] text-noche font-black shadow-sm scale-105'
                                      : 'bg-white/5 border-white/12 text-white/40'
                                  }`}
                                >
                                  <span className="text-xs font-extrabold tabular-nums">{num}</span>
                                  <span className="text-[8px] uppercase font-bold">
                                    {active ? 'Listo' : 'Sello'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="rounded-xl bg-black/35 p-2.5 text-center">
                            <p className="text-[11px] font-semibold text-white">
                              {simStamps === 5
                                ? 'Beneficio Desbloqueado: Hidratación / Diseño Gratis'
                                : `A solo ${5 - simStamps} ${5 - simStamps === 1 ? 'visita' : 'visitas'} de su premio de fidelidad`}
                            </p>
                          </div>
                        </div>

                        {/* Recent Visit History inside Phone so screen is rich and full */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                            Historial de visitas en su móvil
                          </span>
                          <div className="rounded-xl bg-[#201D26] p-2.5 border border-white/8 flex justify-between items-center text-[11px]">
                            <div>
                              <span className="font-bold text-white block">Visita #4 · Culminada</span>
                              <span className="text-white/50 text-[10px]">Sello acreditado desde recepción</span>
                            </div>
                            <span className="text-emerald-400 font-bold text-[10px]">+1 Sello</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setPhoneTab('carta')}
                          className="w-full rounded-2xl bg-white/10 hover:bg-white/15 py-2.5 text-xs font-bold text-white transition cursor-pointer"
                        >
                          ← Volver a la Carta QR
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Live Callout Badges on Desktop/Tablet (Like DKitchen's Hero) */}
              <div
                className="pointer-events-none absolute -left-28 top-[16%] z-30 hidden xl:block"
                style={{ transform: 'rotate(-3deg)' }}
              >
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-carbon/90 px-3.5 py-2.5 text-white shadow-2xl backdrop-blur-xl">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-cassis opacity-75" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-[#E04D7A]" />
                  </span>
                  <div>
                    <span className="block text-xs font-bold whitespace-nowrap">Tocador 2 · QR activo</span>
                    <span className="block text-[11px] text-white/60 whitespace-nowrap">
                      Clienta viendo carta de servicios
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="pointer-events-none absolute -right-28 top-[32%] z-30 hidden xl:block"
                style={{ transform: 'rotate(3deg)' }}
              >
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-carbon/90 px-3.5 py-2.5 text-white shadow-2xl backdrop-blur-xl">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <div>
                    <span className="block text-xs font-bold whitespace-nowrap">Precio actualizado</span>
                    <span className="block text-[11px] text-white/60 whitespace-nowrap tabular-nums">
                      Alisado · $40 → $45 USD al instante
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="pointer-events-none absolute -left-24 bottom-[14%] z-30 hidden xl:block"
                style={{ transform: 'rotate(2deg)' }}
              >
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-carbon/90 px-3.5 py-2.5 text-white shadow-2xl backdrop-blur-xl">
                  <span className="h-2.5 w-2.5 rounded-full bg-oro" />
                  <div>
                    <span className="block text-xs font-bold whitespace-nowrap">Cabina 1 · 16:30</span>
                    <span className="block text-[11px] text-white/60 whitespace-nowrap">
                      Reserva confirmada sin cruces
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ KINETIC MARQUEE STRIP ══ */}
      <div className="relative overflow-hidden border-y border-white/10 bg-noche py-5 text-white">
        <div className="flex w-max animate-[marquesina_36s_linear_infinite] gap-10 whitespace-nowrap">
          {[1, 2].map((loop) => (
            <React.Fragment key={loop}>
              <span className="font-display flex items-center gap-10 text-xl font-semibold md:text-3xl">
                Tu marca, tus clientas
                <span className="h-2 w-2 rounded-full bg-cassis" aria-hidden="true" />
              </span>
              <span className="font-display flex items-center gap-10 text-xl font-semibold md:text-3xl">
                0% comisiones por cita
                <span className="h-2 w-2 rounded-full bg-cassis" aria-hidden="true" />
              </span>
              <span className="font-display flex items-center gap-10 text-xl font-semibold md:text-3xl">
                QR dinámico en cada tocador
                <span className="h-2 w-2 rounded-full bg-cassis" aria-hidden="true" />
              </span>
              <span className="font-display flex items-center gap-10 text-xl font-semibold md:text-3xl">
                Agenda multi-cabina sin cruces
                <span className="h-2 w-2 rounded-full bg-cassis" aria-hidden="true" />
              </span>
              <span className="font-display flex items-center gap-10 text-xl font-semibold md:text-3xl">
                Club VIP de 5 sellos en el móvil
                <span className="h-2 w-2 rounded-full bg-cassis" aria-hidden="true" />
              </span>
              <span className="font-display flex items-center gap-10 text-xl font-semibold md:text-3xl">
                Liquidación exacta de comisiones
                <span className="h-2 w-2 rounded-full bg-cassis" aria-hidden="true" />
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ══ FULL-BLEED EDITORIAL MANIFESTO (ZERO MOBILE COLLISION) ══ */}
      <section className="relative min-h-[460px] md:h-[72svh] overflow-hidden bg-noche text-white flex flex-col justify-end">
        <img
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1800&q=85"
          alt="Interior de salón de alta gama"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-55"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,14,0.25),rgba(12,10,14,0.5)_38%,rgba(12,10,14,0.95))]"
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-28 sm:px-8 md:pb-20">
          <span className="etiqueta-vn text-oro block">
            Sin intermediarios entre tu tocador y tu clienta
          </span>
          <h2 className="font-display mt-3 max-w-4xl text-3xl font-bold leading-[1.03] sm:text-5xl md:text-6xl">
            El talento y el salón ya son tuyos.{' '}
            <span className="acento-serif font-normal text-[#F4D3DF]">
              La clienta también debería serlo.
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/75 leading-relaxed">
            Cuando una clienta escanea el código de tu espejo o abre el enlace de tu biografía, entra en tu casa digital. Sin banners de otros salones, sin descuentos forzados y con una estética que justifica el valor de tu trabajo.
          </p>
        </div>
      </section>

      {/* ══ SECCIÓN DOLORES REALES (ARCHITECTURAL NUMBERED GRID - NO PINK ICONS) ══ */}
      <section id="por-que" className="bg-crema py-20 md:py-28 border-b border-linea">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="etiqueta-vn text-cassis">¿Te suena?</p>
          <h2 className="font-display mt-3 max-w-3xl text-3xl font-bold leading-[1.04] text-tinta sm:text-5xl">
            Lo que le está costando dinero a tu local cada semana.
          </h2>

          <div className="mt-12 grid md:grid-cols-2 md:gap-x-14">
            <div className="grid grid-cols-[48px_1fr] gap-4 border-t border-linea-fuerte py-7 sm:py-8">
              <span className="acento-serif text-4xl leading-none text-cassis">1</span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold leading-snug text-tinta">
                  Pierdes citas de noche y en domingo por no poder contestar al instante.
                </h3>
                <p className="mt-2 text-sm text-niebla leading-relaxed">
                  Tus clientas deciden agendar a las 10:30 de la noche viendo Instagram. Mientras estás descansando o atendiendo en cabina, escriben a tres salones y reservan en el primero que les confirma en un clic.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[48px_1fr] gap-4 border-t border-linea-fuerte py-7 sm:py-8">
              <span className="acento-serif text-4xl leading-none text-cassis">2</span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold leading-snug text-tinta">
                  Las plataformas de directorios se quedan hasta el 25% y exhiben a tu competencia.
                </h3>
                <p className="mt-2 text-sm text-niebla leading-relaxed">
                  Entrar en un marketplace significa regalar una quinta parte de tu trabajo y poner ofertas de otros salones de tu misma zona justo debajo de tu nombre.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[48px_1fr] gap-4 border-t border-linea-fuerte py-7 sm:py-8">
              <span className="acento-serif text-4xl leading-none text-cassis">3</span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold leading-snug text-tinta">
                  Cruces de cabinas en hora punta y domingos perdidos sacando cuentas de comisiones.
                </h3>
                <p className="mt-2 text-sm text-niebla leading-relaxed">
                  Dos especialistas citan a la vez para el mismo sillón de pedicura o camilla facial. Y al cerrar la semana, toca sumar boletas a mano para liquidar el porcentaje de cada profesional.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[48px_1fr] gap-4 border-t border-linea-fuerte py-7 sm:py-8">
              <span className="acento-serif text-4xl leading-none text-cassis">4</span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold leading-snug text-tinta">
                  Las tarjetas de cartulina se pierden y la clienta alarga su regreso a 6 semanas.
                </h3>
                <p className="mt-2 text-sm text-niebla leading-relaxed">
                  Sin un incentivo vivo en su teléfono, la clienta pospone el retoque o prueba otro sitio. El Club VIP digital de 5 sellos hace que siempre vuelva a completar su ciclo contigo.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#planes"
              className="inline-flex justify-center rounded-full bg-tinta px-7 py-4 text-sm font-semibold text-white transition hover:bg-obsidiana"
            >
              Resolverlo con mi propio sistema →
            </a>
            <a
              href="https://wa.me/584247429530?text=Hola%2C%20quiero%20digitalizar%20mi%20sal%C3%B3n%20con%20VANESEV."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full border border-tinta px-7 py-4 text-sm font-semibold text-tinta transition hover:bg-tinta hover:text-white"
            >
              Consultar mi caso por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══ LOS 5 SECTORES: ENFOQUE REAL POR ESPECIALIDAD ══ */}
      <section id="sectores" className="bg-white py-20 md:py-28 border-b border-linea">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="etiqueta-vn text-cassis">Hecho para tu especialidad</p>
          <h2 className="font-display mt-3 max-w-3xl text-3xl font-bold leading-[1.04] text-tinta sm:text-5xl">
            Peluquería, uñas, barbería, clínica o academia.{' '}
            <span className="acento-serif font-normal text-cassis">
              Todo adaptado a tu local.
            </span>
          </h2>

          {/* Sector Selector Bar */}
          <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {(Object.values(NICHES) as NicheSpec[]).map((n) => {
              const active = selectedNiche === n.id;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSelectedNiche(n.id)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
                    active
                      ? 'bg-tinta text-white shadow-sm'
                      : 'bg-crema text-grafito border border-linea hover:border-tinta'
                  }`}
                >
                  {n.label}
                </button>
              );
            })}
          </div>

          {/* Active Sector Detail Showcase */}
          <div className="mt-8 grid gap-8 rounded-[32px] border border-linea bg-crema p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block rounded-full bg-cassis/10 border border-cassis/25 px-3.5 py-1 text-xs font-bold text-cassis">
                {currentNiche.badge}
              </span>

              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-5 border border-linea">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
                    El problema habitual en {currentNiche.shortLabel}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold text-tinta">
                    {currentNiche.painTitle}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-niebla leading-relaxed">
                    {currentNiche.painDetail}
                  </p>
                </div>

                <div className="rounded-2xl bg-obsidiana text-white p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-oro block">
                    Cómo opera con VANESEV
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold text-white">
                    {currentNiche.solutionTitle}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-white/75 leading-relaxed">
                    {currentNiche.solutionDetail}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-linea bg-noche shadow-luxury">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={currentNiche.heroImage}
                    alt={currentNiche.label}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold">{currentNiche.demoBrandName}</span>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      Plantilla de Autor Activa
                    </span>
                  </div>
                  <p className="text-xs text-white/65">{currentNiche.demoBrandSub}</p>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                    {currentNiche.metrics.map((m, idx) => (
                      <div key={idx}>
                        <span className="font-display text-base font-extrabold text-oro tabular-nums block">
                          {m.value}
                        </span>
                        <span className="text-[10px] text-white/55 line-clamp-2">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ LA PUERTA DE ENTRADA: CARTA QR DINÁMICA + 6 SUPERPODERES ══ */}
      <section id="carta-qr" className="bg-crema py-20 md:py-28 border-b border-linea">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="etiqueta-vn text-cassis">La puerta de entrada · Tecnología QR Dinámico</p>
              <h2 className="font-display mt-3 text-3xl font-bold leading-[1.03] text-tinta sm:text-5xl">
                Imprimes el QR una sola vez.{' '}
                <span className="acento-serif font-normal text-cassis">
                  Tus precios y promociones cambian al instante.
                </span>
              </h2>
              <p className="mt-5 text-sm sm:text-base text-niebla leading-relaxed max-w-2xl">
                Cada salón recibe su propia ruta oficial <code className="rounded bg-papel px-2 py-0.5 font-mono text-xs text-tinta">vanesev.com/m/tu-salon</code> y sus códigos cortos <code className="rounded bg-papel px-2 py-0.5 font-mono text-xs text-tinta">vanesev.com/r/tocador-1</code>. Sin subdominios complicados ni esperas de DNS: lo colocas en espejos, acrílicos de recepción o tarjetas y lo gobiernas en tiempo real desde tu móvil.
              </p>

              <div className="mt-8 grid gap-px overflow-hidden rounded-[28px] border border-linea bg-linea sm:grid-cols-3">
                <div className="bg-white p-6">
                  <span className="acento-serif text-3xl leading-none text-cassis">1</span>
                  <p className="mt-3 text-base font-bold text-tinta">Nunca más imprentas</p>
                  <p className="mt-1 text-xs text-niebla leading-relaxed">
                    Actualizas un servicio o la tasa del día en 5 segundos y ya está en todos los espejos.
                  </p>
                </div>
                <div className="bg-white p-6">
                  <span className="acento-serif text-3xl leading-none text-cassis">2</span>
                  <p className="mt-3 text-base font-bold text-tinta">Métrica por ubicación</p>
                  <p className="mt-1 text-xs text-niebla leading-relaxed">
                    Sabes cuántos escaneos vienen del espejo, del escaparate o de tu biografía de Instagram.
                  </p>
                </div>
                <div className="bg-white p-6">
                  <span className="acento-serif text-3xl leading-none text-cassis">3</span>
                  <p className="mt-3 text-base font-bold text-tinta">Redirección en vivo</p>
                  <p className="mt-1 text-xs text-niebla leading-relaxed">
                    En fechas especiales puedes apuntar el mismo QR físico hacia una campaña o promoción.
                  </p>
                </div>
              </div>
            </div>

            {/* QR Physical Acrylic Showcase Card */}
            <div className="lg:col-span-5">
              <div className="rounded-[32px] border border-linea bg-white p-6 sm:p-8 shadow-luxury text-center space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-crema border border-linea px-3 py-1 text-[11px] font-bold text-tinta">
                  <QrCode className="w-3.5 h-3.5 text-cassis" />
                  <span>Kit QR Vectorial SVG incluido</span>
                </div>
                <div className="mx-auto w-44 h-44 rounded-2xl border border-linea bg-crema p-3 flex items-center justify-center shadow-inner">
                  {sampleQrSvg ? (
                    <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: sampleQrSvg }} />
                  ) : null}
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-tinta">
                    QR de Tocador · Redirección 302
                  </p>
                  <p className="mt-1 font-mono text-xs text-cassis bg-cassis/8 rounded-lg py-1 px-3 inline-block">
                    vanesev.com/r/capra-menu → /m/capra-studio
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Superpowers Architectural Cards (Like DKitchen's "Lo que hace distinta tu carta") */}
          <div id="superpoderes" className="mt-20">
            <h3 className="font-display text-2xl sm:text-4xl font-bold text-tinta">
              Lo que hace único a tu sistema VANESEV.
            </h3>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                {
                  num: '01',
                  title: 'Te lo montamos desde una foto de tu lista de precios',
                  desc: 'Nos envías una foto o PDF de tus servicios actuales y te entregamos tu catálogo interactivo publicado con tus precios, tiempos, categorías y colores de marca.',
                },
                {
                  num: '02',
                  title: 'Agenda multi-cabina y multi-especialista sin cruces',
                  desc: 'Cada servicio bloquea automáticamente tanto a la profesional elegida como la cabina, sillón o tocador correspondiente para que jamás se solapen dos citas.',
                },
                {
                  num: '03',
                  title: 'Tarjeta VIP digital de 5 sellos en el móvil',
                  desc: 'Tu clienta acumula sellos con su número de teléfono en cada visita. Al llegar al 5.º sello, el sistema acredita su recompensa y dispara su frecuencia de retorno.',
                },
                {
                  num: '04',
                  title: 'Reseñas en Google Maps y liquidación de comisiones',
                  desc: 'Un botón directo en tu carta invita a cada clienta atendida a dejar 5 estrellas en Google, mientras tu panel calcula al centavo la comisión de cada especialista.',
                },
              ].map((item) => (
                <div
                  key={item.num}
                  className="rounded-[28px] border border-linea bg-white p-7 shadow-card"
                >
                  <span className="acento-serif text-3xl leading-none text-cassis">{item.num}</span>
                  <h4 className="font-display mt-3 text-xl sm:text-2xl font-bold text-tinta">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm text-niebla leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CALCULADORA INTERACTIVA DE AHORRO (LINING TABULAR NUMBERS, NO WRAPPING) ══ */}
      <section id="calculadora" className="bg-white py-20 md:py-28 border-b border-linea">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="etiqueta-vn text-cassis">Calculadora financiera en vivo</p>
            <h2 className="font-display mt-3 text-3xl font-bold leading-[1.04] text-tinta sm:text-5xl">
              Calcula cuánto dinero retienes al eliminar intermediarios.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-niebla">
              Desliza los valores según el volumen mensual de tu salón:
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 rounded-[32px] border border-linea bg-crema p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-7">
              <div>
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-tinta">
                    Citas atendidas al mes
                  </label>
                  <span className="shrink-0 whitespace-nowrap rounded-xl border border-linea-fuerte bg-white px-3.5 py-1.5 font-display text-base font-extrabold text-cassis tabular-nums">
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
                  className="w-full h-2.5 bg-linea-fuerte rounded-lg appearance-none cursor-pointer accent-cassis"
                />
                <div className="flex justify-between text-xs text-niebla mt-1.5 font-medium tabular-nums">
                  <span>30 citas</span>
                  <span>300 citas</span>
                  <span>600 citas</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-tinta">
                    Ticket promedio por servicio
                  </label>
                  <span className="shrink-0 whitespace-nowrap rounded-xl border border-linea-fuerte bg-white px-3.5 py-1.5 font-display text-base font-extrabold text-cassis tabular-nums">
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
                  className="w-full h-2.5 bg-linea-fuerte rounded-lg appearance-none cursor-pointer accent-cassis"
                />
                <div className="flex justify-between text-xs text-niebla mt-1.5 font-medium tabular-nums">
                  <span>$10 USD</span>
                  <span>$60 USD</span>
                  <span>$120 USD</span>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 border border-linea text-xs sm:text-sm text-grafito leading-relaxed">
                <strong className="text-tinta">El impacto del 0% de comisiones:</strong> En un salón con{' '}
                <span className="font-bold tabular-nums">{monthlyClients} citas</span> al mes, ceder el 20% a una app externa supone perder{' '}
                <strong className="text-cassis tabular-nums">${platformCommissionLoss} USD cada mes</strong>. Con tu propia plataforma ese margen es 100% tuyo.
              </div>
            </div>

            {/* Results Card with Crisp Lining Numerals */}
            <div className="lg:col-span-5 rounded-[28px] bg-noche text-white p-7 sm:p-8 shadow-2xl space-y-6">
              <span className="inline-block rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-oro">
                Beneficio Mensual Estimado
              </span>

              <div className="space-y-5">
                <div className="border-b border-white/12 pb-4">
                  <span className="text-xs text-white/65 block">Ahorro directo en comisiones</span>
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-oro tabular-nums block mt-1">
                    +${platformCommissionLoss.toLocaleString('en-US')} USD
                  </span>
                  <span className="text-[11px] text-white/45">
                    Facturación íntegra en la caja de tu salón.
                  </span>
                </div>

                <div>
                  <span className="text-xs text-white/65 block">
                    Facturación adicional por retorno VIP (5 sellos)
                  </span>
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400 tabular-nums block mt-1">
                    +${retentionExtraRevenue.toLocaleString('en-US')} USD
                  </span>
                  <span className="text-[11px] text-white/45">
                    Clientas que acortan su ciclo de visita a 21 días.
                  </span>
                </div>
              </div>

              <a
                href="#planes"
                className="w-full rounded-full bg-cassis hover:bg-cassis-hondo py-3.5 text-center text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition"
              >
                <span>Empezar con mi Salón</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CASOS REALES EN VIVO (/m/capra-studio Y /m/andrea-nails) ══ */}
      <section id="casos" className="bg-crema py-20 md:py-28 border-b border-linea">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="etiqueta-vn text-cassis">Salones operando en vivo</p>
          <h2 className="font-display mt-3 max-w-3xl text-3xl font-bold leading-[1.04] text-tinta sm:text-5xl">
            Cada salón con su propia identidad de autor.{' '}
            <span className="acento-serif font-normal text-cassis">
              Nunca dos cartas iguales.
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-niebla">
            Comprueba en vivo cómo cada cliente tiene su propia paleta, tipografía, estructura de departamentos y códigos QR dinámicos bajo nuestra arquitectura:
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Case 1: Capra Studio */}
            <div className="group overflow-hidden rounded-[32px] border border-linea bg-white shadow-card transition hover:-translate-y-1 hover:shadow-luxury flex flex-col justify-between">
              <div>
                <div className="relative h-52 overflow-hidden bg-[#1E1417]">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80"
                    alt="Capra Studio"
                    className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1417] via-[#1E1417]/30 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="rounded-full bg-[#8E4A59] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                      Salón Integral &amp; Academia
                    </span>
                    <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 font-mono text-[10px] text-white">
                      /m/capra-studio
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <h3 className="font-display text-2xl font-bold">
                      Capra Studio · By María Capra
                    </h3>
                    <p className="text-xs text-white/80">
                      6 Departamentos Especializados + Capra Academy Certificada
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <p className="text-xs sm:text-sm text-niebla leading-relaxed">
                    Composición de autor en tonos malva terciopelo y obsidiana. Integra agenda de cejas, pestañas, alisados orgánicos, maquillaje social y matrícula directa para sus cursos profesionales.
                  </p>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-grafito">
                    <span className="rounded-full bg-crema px-3 py-1 border border-linea">QR: /r/capra-menu</span>
                    <span className="rounded-full bg-crema px-3 py-1 border border-linea">Club VIP 5 Sellos</span>
                    <span className="rounded-full bg-crema px-3 py-1 border border-linea">Capra Academy</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectTenant('capra-studio')}
                  className="w-full rounded-full bg-[#8E4A59] hover:bg-[#743946] py-3.5 text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Abrir Carta y Reserva de Capra Studio</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Case 2: Andrea Labrador Nails */}
            <div className="group overflow-hidden rounded-[32px] border border-linea bg-white shadow-card transition hover:-translate-y-1 hover:shadow-luxury flex flex-col justify-between">
              <div>
                <div className="relative h-52 overflow-hidden bg-[#1D3326]">
                  <img
                    src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=80"
                    alt="Andrea Labrador Nails Studio"
                    className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1D3326] via-[#1D3326]/30 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="rounded-full bg-[#2E4F3B] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                      Nails Bar &amp; Pedi Spa
                    </span>
                    <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 font-mono text-[10px] text-white">
                      /m/andrea-nails
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <h3 className="font-display text-2xl font-bold">
                      Andrea Labrador Nails Studio
                    </h3>
                    <p className="text-xs text-white/80">
                      Salud de Uña Natural, Nivelación Rubber, Polygel y Pedicure Spa
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <p className="text-xs sm:text-sm text-niebla leading-relaxed">
                    Composición botánica en verde salvia y crema editorial. Permite combinar servicios de Manos + Pies en una misma cita, conversión de tasa en vivo y tarjeta digital de fidelidad.
                  </p>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-grafito">
                    <span className="rounded-full bg-crema px-3 py-1 border border-linea">QR: /r/andrea-menu</span>
                    <span className="rounded-full bg-crema px-3 py-1 border border-linea">Combinación Manos + Pies</span>
                    <span className="rounded-full bg-crema px-3 py-1 border border-linea">Tasa BCV en vivo</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectTenant('andrea-nails')}
                  className="w-full rounded-full bg-[#203A2B] hover:bg-[#16291E] py-3.5 text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Abrir Estudio de Andrea Labrador</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PLANES POR CAPACIDAD + OFERTA FUNDADOR ══ */}
      <section id="planes" className="bg-white py-20 md:py-28 border-b border-linea">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="etiqueta-vn text-cassis">Inversión clara · Cero comisiones</p>
              <h2 className="font-display mt-3 text-3xl font-bold leading-[1.04] text-tinta sm:text-5xl">
                Tres planes por capacidad. Sin módulos ocultos.
              </h2>
            </div>

            {/* Billing Cycle Switcher */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-linea bg-crema p-1.5 self-start">
              <button
                type="button"
                onClick={() => setBillingCycle('quarterly')}
                className={`rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  billingCycle === 'quarterly'
                    ? 'bg-tinta text-white shadow-xs'
                    : 'text-niebla hover:text-tinta'
                }`}
              >
                Trimestral · Ahorra 25%
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-tinta text-white shadow-xs'
                    : 'text-niebla hover:text-tinta'
                }`}
              >
                Mensual
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Plan 1: Estudio */}
            <div className="flex flex-col justify-between rounded-[28px] border border-linea bg-crema p-7 text-tinta">
              <div>
                <p className="font-display text-2xl font-bold">Estudio</p>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold tabular-nums">
                    ${billingCycle === 'quarterly' ? '19' : '25'}
                  </span>
                  <span className="text-xs text-niebla">USD / mes</span>
                </p>
                <p className="mt-3 text-xs sm:text-sm text-niebla">
                  Para especialistas independientes que atienden en su propio estudio o cabina privada.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-grafito border-t border-linea-fuerte pt-5">
                  <li className="flex gap-2">
                    <span className="text-cassis font-bold">✓</span>
                    <span><strong>1 especialista</strong> y 1 cabina activa</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cassis font-bold">✓</span>
                    <span>Carta digital <code className="text-xs">/m/tu-salon</code> de autor</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cassis font-bold">✓</span>
                    <span><strong>2 códigos QR dinámicos</strong> vectoriales SVG</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cassis font-bold">✓</span>
                    <span>Tarjeta VIP digital de <strong>5 sellos</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cassis font-bold">✓</span>
                    <span>Hasta <strong>120 citas al mes</strong> sin comisión</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cassis font-bold">✓</span>
                    <span>Montaje inicial desde foto de tu lista de precios</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPlanForCheckout({
                    name: 'Estudio',
                    price: billingCycle === 'quarterly' ? '19' : '25',
                    period: billingCycle === 'quarterly' ? 'Facturación Trimestral' : 'Facturación Mensual',
                  })
                }
                className="mt-8 w-full rounded-full border border-tinta py-3.5 text-center text-sm font-bold text-tinta transition hover:bg-tinta hover:text-white cursor-pointer"
              >
                Elegir Plan Estudio
              </button>
            </div>

            {/* Plan 2: Salón Pro (Recommended Dark Architectural Card) */}
            <div className="relative flex flex-col justify-between rounded-[28px] border border-tinta bg-noche p-7 text-white shadow-[0_30px_80px_-25px_rgba(12,10,14,0.65)]">
              <span className="absolute -top-3.5 left-7 rounded-full bg-cassis px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                Más elegido por salones
              </span>
              <div>
                <p className="font-display text-2xl font-bold">Salón Pro</p>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold text-oro tabular-nums">
                    ${billingCycle === 'quarterly' ? '29' : '39'}
                  </span>
                  <span className="text-xs text-white/60">USD / mes</span>
                </p>
                <p className="mt-3 text-xs sm:text-sm text-white/70">
                  Para peluquerías, salones de uñas, barberías y clínicas con equipo de especialistas.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-white/85 border-t border-white/12 pt-5">
                  <li className="flex gap-2">
                    <span className="text-oro font-bold">✓</span>
                    <span>Hasta <strong>6 especialistas</strong> y <strong>6 cabinas/tocadores</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-oro font-bold">✓</span>
                    <span><strong>6 códigos QR dinámicos</strong> con analítica por espejo</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-oro font-bold">✓</span>
                    <span>Sincronización multi-cabina sin solapamientos</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-oro font-bold">✓</span>
                    <span>Cálculo automático de <strong>comisiones del equipo</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-oro font-bold">✓</span>
                    <span>Hasta <strong>500 citas al mes</strong> con 0% comisión</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-oro font-bold">✓</span>
                    <span>Botón de reseñas en Google Maps y reporte contable PDF</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPlanForCheckout({
                    name: 'Salón Pro',
                    price: billingCycle === 'quarterly' ? '29' : '39',
                    period: billingCycle === 'quarterly' ? 'Facturación Trimestral' : 'Facturación Mensual',
                  })
                }
                className="mt-8 w-full rounded-full bg-cassis hover:bg-cassis-hondo py-3.5 text-center text-sm font-bold text-white shadow-lg transition cursor-pointer"
              >
                Activar Salón Pro →
              </button>
            </div>

            {/* Plan 3: Atelier & Academia */}
            <div className="flex flex-col justify-between rounded-[28px] border border-linea bg-crema p-7 text-tinta">
              <div>
                <p className="font-display text-2xl font-bold">Atelier &amp; Academia</p>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold tabular-nums">
                    ${billingCycle === 'quarterly' ? '49' : '65'}
                  </span>
                  <span className="text-xs text-niebla">USD / mes</span>
                </p>
                <p className="mt-3 text-xs sm:text-sm text-niebla">
                  Para salones integrales de gran formato, franquicias o centros con academia de formación.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-grafito border-t border-linea-fuerte pt-5">
                  <li className="flex gap-2">
                    <span className="text-cassis font-bold">✓</span>
                    <span><strong>Especialistas y cabinas ilimitadas</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cassis font-bold">✓</span>
                    <span>Módulo de <strong>Academia y Cursos Certificados</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cassis font-bold">✓</span>
                    <span><strong>QR dinámicos ilimitados</strong> para campañas y flyers</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cassis font-bold">✓</span>
                    <span>Citas ilimitadas y soporte prioritario directo</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cassis font-bold">✓</span>
                    <span>Diseño de autor a medida con tus fotografías</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPlanForCheckout({
                    name: 'Atelier & Academia',
                    price: billingCycle === 'quarterly' ? '49' : '65',
                    period: billingCycle === 'quarterly' ? 'Facturación Trimestral' : 'Facturación Mensual',
                  })
                }
                className="mt-8 w-full rounded-full border border-tinta py-3.5 text-center text-sm font-bold text-tinta transition hover:bg-tinta hover:text-white cursor-pointer"
              >
                Elegir Atelier &amp; Academia
              </button>
            </div>
          </div>

          {/* Fundador Launch Banner (Like DKitchen's Fundador Card) */}
          <div className="mt-12 overflow-hidden rounded-[32px] bg-noche text-white shadow-luxury grid md:grid-cols-[1.2fr_1fr] items-center">
            <div className="p-7 sm:p-10 space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-oro px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-noche">
                <span className="h-1.5 w-1.5 rounded-full bg-cassis animate-pulse" />
                Plazas de Lanzamiento · Montaje Llave en Mano Incluido
              </span>
              <h3 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
                Plan Fundador
              </h3>
              <p className="text-base sm:text-xl text-white/85">
                Todo el plan <strong>Salón Pro</strong> + montaje completo de tu carta desde una foto por{' '}
                <span className="text-oro font-extrabold tabular-nums">$25 USD/mes</span> blindado.
              </p>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Nos envías tu lista actual de servicios por WhatsApp y en menos de 24 horas tienes tu catálogo publicado, tus códigos QR listos para espejo y tu equipo configurado.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPlanForCheckout({
                      name: 'Fundador (Salón Pro Vitalicio)',
                      price: '25',
                      period: 'Tarifa Fundador Blindada',
                    })
                  }
                  className="rounded-full bg-cassis hover:bg-cassis-hondo px-7 py-3.5 text-sm font-bold text-white shadow-lg transition cursor-pointer"
                >
                  Solicitar Plaza de Fundador →
                </button>
              </div>
            </div>
            <div className="relative h-64 md:h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
                alt="Plan Fundador VANESEV"
                className="h-full w-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-noche via-noche/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ THE BEAUTY FOUNDER JOURNAL (EDITORIAL MAGAZINE) ══ */}
      <section id="journal" className="bg-crema py-20 md:py-28 border-b border-linea">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="etiqueta-vn text-cassis">The Beauty Founder Journal</p>
          <h2 className="font-display mt-3 max-w-3xl text-3xl font-bold leading-[1.04] text-tinta sm:text-5xl">
            Lecturas de gestión, retención y rentabilidad para dueñas de salones.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {JOURNAL_ARTICLES.map((art) => (
              <article
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="group cursor-pointer overflow-hidden rounded-[28px] border border-linea bg-white shadow-card transition hover:-translate-y-1 hover:shadow-luxury flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-noche">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-noche/85 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-oro">
                      {art.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-2.5">
                    <div className="flex justify-between text-[11px] font-semibold text-niebla">
                      <span>{art.date}</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-tinta leading-snug group-hover:text-cassis transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-niebla leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-3 border-t border-linea flex items-center justify-between text-xs font-bold text-cassis">
                  <span>Leer reportaje completo</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ARCHITECTURAL FOOTER ══ */}
      <footer className="bg-noche text-white py-16 px-5 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5 space-y-4">
              <span className="font-display text-2xl font-extrabold tracking-tight text-white block">
                VANE<span className="text-[#E04D7A]">SEV</span>
              </span>
              <p className="text-xs sm:text-sm text-white/60 max-w-sm leading-relaxed">
                Plataforma de autor para salones de belleza, estudios de uñas, barberías, clínicas estéticas y academias. Tu carta QR dinámica, tu agenda multi-cabina y tu Club VIP sin comisiones.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2.5 text-xs">
              <span className="font-bold uppercase tracking-widest text-oro block">
                Plataforma
              </span>
              <ul className="space-y-2 text-white/70">
                <li><a href="#sectores" className="hover:text-white">Los 5 Sectores</a></li>
                <li><a href="#carta-qr" className="hover:text-white">Tecnología QR Dinámico</a></li>
                <li><a href="#calculadora" className="hover:text-white">Calculadora de Retención</a></li>
                <li><a href="#planes" className="hover:text-white">Planes por Capacidad</a></li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-2.5 text-xs">
              <span className="font-bold uppercase tracking-widest text-oro block">
                Ecosistema en Vivo
              </span>
              <ul className="space-y-2 text-white/70">
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectTenant('capra-studio')}
                    className="hover:text-white cursor-pointer"
                  >
                    Capra Studio &amp; Academy (/m/capra-studio)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectTenant('andrea-nails')}
                    className="hover:text-white cursor-pointer"
                  >
                    Andrea Labrador Studio (/m/andrea-nails)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenCentral}
                    className="text-[#F4D3DF] font-semibold hover:underline cursor-pointer"
                  >
                    VANESEV Central · Super-Admin
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
            <span>© {new Date().getFullYear()} VANESEV Cloud · Todos los derechos reservados.</span>
            <span>Arquitectura Single-Domain · QR Dinámico HTTP 302</span>
          </div>
        </div>
      </footer>

      {/* ══ MODAL LECTOR DE ARTÍCULOS DEL JOURNAL ══ */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] bg-noche/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-[28px] max-w-2xl w-full border border-linea shadow-2xl overflow-hidden my-8">
            <div className="relative aspect-video max-h-60 overflow-hidden bg-noche">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noche via-noche/30 to-transparent" />
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="rounded-full bg-cassis px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {activeArticle.category}
                </span>
                <span className="ml-3 text-xs text-white/80">{activeArticle.readTime}</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5 max-h-[65vh] overflow-y-auto">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-tinta leading-tight">
                  {activeArticle.title}
                </h2>
                <p className="mt-2 text-xs text-niebla border-b border-linea pb-4">
                  Por <strong className="text-tinta">{activeArticle.author}</strong> · {activeArticle.date}
                </p>
              </div>

              <div className="space-y-4 text-sm text-grafito leading-relaxed">
                {activeArticle.content.map((p, i) => (
                  <p key={i} className={i === 0 ? 'text-base font-medium text-tinta' : ''}>
                    {p}
                  </p>
                ))}
              </div>

              <div className="pt-4 border-t border-linea flex items-center justify-between gap-4">
                <a
                  href="#planes"
                  onClick={() => setActiveArticle(null)}
                  className="rounded-full bg-cassis px-5 py-2.5 text-xs font-bold text-white"
                >
                  Ver Planes de VANESEV
                </a>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="rounded-full border border-linea-fuerte px-5 py-2.5 text-xs font-bold text-grafito cursor-pointer"
                >
                  Cerrar lectura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL DE SOLICITUD DE ALTA / CHECKOUT ══ */}
      {selectedPlanForCheckout && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] bg-noche/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-[28px] max-w-lg w-full border border-linea shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex justify-between items-start border-b border-linea pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cassis block">
                  Solicitud de Alta · {selectedPlanForCheckout.period}
                </span>
                <h3 className="font-display text-2xl font-bold text-tinta mt-0.5">
                  Plan {selectedPlanForCheckout.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanForCheckout(null)}
                className="p-1.5 rounded-full hover:bg-crema text-niebla cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-crema border border-linea p-4 flex justify-between items-center">
              <div>
                <span className="text-xs text-niebla block">Cuota mensual</span>
                <strong className="font-display text-2xl font-extrabold text-tinta tabular-nums">
                  ${selectedPlanForCheckout.price} USD / mes
                </strong>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
                0% Comisiones
              </span>
            </div>

            <form onSubmit={handleConfirmCheckout} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-tinta block mb-1">
                  Nombre de tu Salón, Barbería o Clínica:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lumière Hair & Spa"
                  value={checkoutSalonName}
                  onChange={(e) => setCheckoutSalonName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-linea-fuerte bg-white text-sm text-tinta focus:outline-none focus:border-cassis"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-tinta block mb-1">
                  Especialidad principal:
                </label>
                <select
                  value={checkoutNiche}
                  onChange={(e) => setCheckoutNiche(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-linea-fuerte bg-white text-sm text-tinta focus:outline-none focus:border-cassis"
                >
                  <option value="Peluquería & Colorimetría">Peluquería &amp; Colorimetría</option>
                  <option value="Estudio de Uñas / Nails Bar">Estudio de Uñas / Nails Bar</option>
                  <option value="Barbería & Grooming">Barbería &amp; Grooming</option>
                  <option value="Clínica Estética / MedSpa">Clínica Estética / MedSpa</option>
                  <option value="Salón Integral + Academia">Salón Integral + Academia</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-tinta block mb-1">
                  Tu WhatsApp directo:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: +58 424 1234567"
                  value={checkoutOwnerPhone}
                  onChange={(e) => setCheckoutOwnerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-linea-fuerte bg-white text-sm text-tinta focus:outline-none focus:border-cassis"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-tinta block mb-1.5">
                  Modalidad de pago preferida:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'transfer', label: 'Pago Móvil / Zelle', icon: Building2 },
                    { id: 'binance', label: 'Binance / USDT', icon: Zap },
                    { id: 'card', label: 'Tarjeta', icon: CreditCard },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setCheckoutPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
                        checkoutPaymentMethod === m.id
                          ? 'border-cassis bg-cassis/8 text-cassis'
                          : 'border-linea bg-white text-niebla hover:border-tinta'
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
                  className="w-full py-4 rounded-full bg-cassis hover:bg-cassis-hondo text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <span>Solicitar Activación y Montaje de mi Carta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-niebla text-center mt-2">
                  Incluye configuración inicial desde foto de tu lista de precios actual.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
