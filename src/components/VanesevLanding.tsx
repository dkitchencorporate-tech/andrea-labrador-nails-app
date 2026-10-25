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
  Heart,
  Palette,
  Sliders,
  Smartphone,
  Award,
  TrendingUp,
  MessageCircle,
  Layers,
  Eye,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  MapPin,
  Crown,
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
  onOpenCapraAdmin: () => void;
  onOpenAndreaDemo: () => void;
  onOpenCentral: () => void;
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

export const VanesevLanding: React.FC<VanesevLandingProps> = ({
  onOpenCapraDemo,
  onOpenCapraAdmin,
  onOpenCentral,
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

  // Interactive Saturday Comparison Toggle
  const [saturdayMode, setSaturdayMode] = useState<'chaos' | 'vanesev'>('vanesev');

  // Active Sector Showcase
  const [activeSectorIdx, setActiveSectorIdx] = useState(0);

  // Financial Recovery Calculator
  const [avgTicket, setAvgTicket] = useState(28);
  const [missedWeekly, setMissedWeekly] = useState(6);

  // 3D Scroll Perspective Ref
  const showcaseRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: showcaseRef,
    offset: ['start end', 'end start'],
  });
  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], [14, 0, -6]);
  const scale3d = useTransform(scrollYProgress, [0, 0.45, 1], [0.94, 1, 0.98]);
  const yFloat = useTransform(scrollYProgress, [0, 0.5, 1], [35, 0, -25]);

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

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E181A] font-sans selection:bg-[#9E475B]/15 selection:text-[#9E475B] overflow-x-hidden">
      {/* ─── SUBTLE LUMINOUS AMBIENT SILK GLOWS (ZERO DARK / ZERO BLACK) ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-36 -right-36 w-[560px] h-[560px] rounded-full blur-3xl opacity-45"
          style={{ background: 'radial-gradient(circle, #F5E1E6 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-[38%] -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, #F2E4D5 0%, transparent 70%)' }}
        />
      </div>

      {/* ─── FLOATING WHITE GLASS CAPSULE NAVBAR ─── */}
      <header className="sticky top-4 z-50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto rounded-full bg-white/90 backdrop-blur-xl border border-[#1E181A]/8 shadow-[0_14px_40px_-14px_rgba(30,24,26,0.08)] px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* Brand Signature */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold text-base shadow-sm"
              style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 55%, #E2A889 100%)' }}
            >
              V
            </div>
            <div>
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-[#1E181A] block leading-none">
                VANESEV
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#9E475B] block mt-0.5">
                Beauty &amp; Wellness Cloud
              </span>
            </div>
          </div>

          {/* Center Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-full border border-[#1E181A]/6">
            {[
              { id: 'experiencia', label: 'Prueba en Vivo' },
              { id: 'personalizador', label: 'Diseño a Medida' },
              { id: 'sectores', label: 'Especialidades' },
              { id: 'ejecutivo', label: 'Panel & QR' },
              { id: 'inversion', label: 'Planes' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-1.5 rounded-full text-xs font-bold text-[#6E6266] hover:text-[#1E181A] hover:bg-white transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Live Demo CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCapraAdmin}
              className="px-4 py-2 rounded-full text-xs font-bold text-[#1E181A] bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#1E181A]/10 transition-all cursor-pointer"
            >
              Ver Admin de Salón
            </button>
            <button
              type="button"
              onClick={onOpenCapraDemo}
              className="px-4.5 py-2 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-transform hover:scale-[1.02] cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 100%)' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Probar Salón Real</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-[#FAF7F2] border border-[#1E181A]/10 text-[#1E181A] cursor-pointer"
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden mt-2 rounded-3xl bg-white border border-[#1E181A]/10 shadow-xl p-5 space-y-3"
            >
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'experiencia', label: 'Prueba en Vivo' },
                  { id: 'personalizador', label: 'Diseño a Medida' },
                  { id: 'sectores', label: 'Especialidades' },
                  { id: 'ejecutivo', label: 'Panel & QR' },
                  { id: 'inversion', label: 'Planes' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className="p-2.5 rounded-2xl bg-[#FAF7F2] text-left text-xs font-bold text-[#1E181A]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-[#1E181A]/10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCapraDemo();
                  }}
                  className="w-full py-3 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 100%)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Abrir Catálogo Real (/m/capra-studio)</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenCapraAdmin();
                    }}
                    className="py-2.5 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#1E181A] border border-[#1E181A]/12"
                  >
                    Admin de Salón
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenCentral();
                    }}
                    className="py-2.5 rounded-full text-xs font-bold bg-[#FAF0F2] text-[#9E475B] border border-[#9E475B]/25"
                  >
                    Super-Admin Central
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 1: LUMINOUS HAUTE-COUTURE HERO + LIVE INTERACTIVE PHONE SIMULATOR
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="experiencia" className="relative z-10 pt-10 sm:pt-14 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Pitch (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#9E475B]/20 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#9E475B] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9E475B]">
                Arquitectura Digital para Salones de Belleza, Clínicas &amp; Spas
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-semibold text-[#1E181A] leading-[1.06] tracking-tight">
              El arte de dirigir un salón{' '}
              <span className="italic font-normal text-[#9E475B]">lleno, sereno</span> y con identidad propia.
            </h1>

            <p className="text-base sm:text-lg text-[#6E6266] leading-relaxed max-w-2xl">
              Tus clientas no quieren descargar aplicaciones pesadas ni esperar 3 horas una respuesta por WhatsApp para saber qué turno tienes libre. Con <strong>VANESEV</strong>, tu salón estrena una <strong>Experiencia Editorial de Reserva, Pasaporte VIP de Fidelidad y Recepción QR</strong> diseñada con tus propios colores y tipografía.
            </p>

            {/* 3 Psychological Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {[
                {
                  title: 'Diseño 100% Editable',
                  desc: 'Elige tu paleta de color, tipografía editorial y estilo visual sin plantillas clonadas.',
                },
                {
                  title: 'Reserva en 15 Segundos',
                  desc: 'Tus clientas eligen especialista, día y hora real conectada directo a tu WhatsApp.',
                },
                {
                  title: 'Pasaporte VIP Digital',
                  desc: 'Sella visitas con el teléfono de tu clienta y premia su constancia automáticamente.',
                },
              ].map((pillar, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -3 }}
                  className="p-4 rounded-2xl bg-white border border-[#1E181A]/8 shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#FAF0F2] text-[#9E475B] flex items-center justify-center mb-2">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs font-bold text-[#1E181A]">{pillar.title}</p>
                  <p className="text-[11px] text-[#6E6266] mt-1 leading-relaxed">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onOpenCapraDemo}
                className="px-7 py-4 rounded-full text-sm font-bold text-white shadow-lg flex items-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 100%)' }}
              >
                <span>Explorar Salón Real en Vivo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('personalizador')}
                className="px-6 py-4 rounded-full text-sm font-bold bg-white hover:bg-[#FAF0F2] text-[#1E181A] border border-[#1E181A]/12 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Palette className="w-4 h-4 text-[#9E475B]" />
                <span>Personalizar Colores en Vivo</span>
              </button>
            </div>
          </motion.div>

          {/* Right Interactive Live Phone Simulator (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col items-center"
          >
            {/* Interactive Palette Bar Above Phone */}
            <div className="mb-3 px-4 py-2 rounded-full bg-white border border-[#1E181A]/10 shadow-xs flex items-center gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6266]">
                Cambia el tema del teléfono:
              </span>
              <div className="flex items-center gap-1.5">
                {SALON_PALETTES.slice(0, 5).map((pal) => (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => setPhonePaletteId(pal.id)}
                    className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                      phonePaletteId === pal.id ? 'scale-125 ring-2 ring-[#1E181A] ring-offset-2' : 'opacity-75 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: pal.primary }}
                    title={pal.name}
                  />
                ))}
              </div>
            </div>

            {/* Luxury Pearl Phone Frame */}
            <div className="w-full max-w-[390px] rounded-[46px] p-3 bg-gradient-to-b from-[#EBE4DC] via-[#DFD5CA] to-[#CFC2B4] shadow-[0_32px_80px_-20px_rgba(30,24,26,0.22)] border border-white">
              <div
                className="rounded-[36px] overflow-hidden border border-black/5 flex flex-col min-h-[600px] transition-colors duration-500"
                style={{ backgroundColor: phonePalette.bgPrimary, color: phonePalette.textPrimary }}
              >
                {/* Phone Top Bar */}
                <div className="px-5 pt-4 pb-3 bg-white/85 backdrop-blur-md border-b border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white font-display font-bold text-xs"
                      style={{ background: phonePalette.heroGradient }}
                    >
                      CS
                    </div>
                    <div>
                      <p className="font-display font-bold text-xs leading-none">Capra Studio</p>
                      <p className="text-[9px] text-[#6E6266] mt-0.5">vanesev.com/m/capra-studio</p>
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: phonePalette.badgeBg, color: phonePalette.badgeText }}
                  >
                    Interactivo
                  </span>
                </div>

                {/* 3 Flow Switcher Pills Inside Phone */}
                <div className="p-2.5 bg-white/60 border-b border-black/5 grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'catalog', label: '01. Carta & Cita' },
                    { id: 'passport', label: '02. Sellos VIP' },
                    { id: 'whatsapp', label: '03. Recepción' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPhoneStep(tab.id as any)}
                      className={`py-1.5 px-2 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        phoneStep === tab.id ? 'text-white shadow-2xs' : 'bg-white/80 text-[#6E6266]'
                      }`}
                      style={phoneStep === tab.id ? { backgroundColor: phonePalette.primary } : undefined}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Phone Dynamic Screen Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    {phoneStep === 'catalog' && (
                      <motion.div
                        key="catalog"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-3.5"
                      >
                        <div className="relative h-36 rounded-2xl overflow-hidden shadow-xs">
                          <img
                            src="/capra/lash-lifting.jpg"
                            alt="Lifting de Pestañas"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent flex flex-col justify-end p-3.5 text-white">
                            <span className="text-[9px] uppercase tracking-widest font-bold opacity-90">
                              Mirada de Autor &bull; 60 Min
                            </span>
                            <p className="font-display text-base font-semibold leading-tight">
                              Lifting de Pestañas + Keratina
                            </p>
                          </div>
                        </div>

                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6E6266]">
                          Toca un servicio para simular reserva:
                        </p>

                        <div className="space-y-2">
                          {[
                            { name: 'Brow Lamination + Botox', price: '$20 USD', time: '50 min', img: '/capra/brow-lamination.jpg' },
                            { name: 'Lifting de Pestañas + Tinte', price: '$22 USD', time: '60 min', img: '/capra/lash-lifting.jpg' },
                            { name: 'Alisado Orgánico Brillo Espejo', price: '$45 USD', time: '120 min', img: '/capra/hair-straightening.jpg' },
                          ].map((srv, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedDemoService(idx)}
                              className={`w-full p-2.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer bg-white ${
                                selectedDemoService === idx ? 'ring-2 shadow-xs' : 'border-black/8 opacity-85'
                              }`}
                              style={selectedDemoService === idx ? { borderColor: phonePalette.primary } : undefined}
                            >
                              <img src={srv.img} alt={srv.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{srv.name}</p>
                                <p className="text-[10px] text-[#6E6266]">{srv.time} &bull; Especialista Certificada</p>
                              </div>
                              <span className="font-display font-bold text-xs shrink-0" style={{ color: phonePalette.primary }}>
                                {srv.price}
                              </span>
                            </button>
                          ))}
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6E6266] mb-1.5">
                            Turnos Disponibles Hoy:
                          </p>
                          <div className="grid grid-cols-3 gap-1.5">
                            {['10:30 AM', '02:00 PM', '04:30 PM'].map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedDemoTime(slot)}
                                className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                                  selectedDemoTime === slot ? 'text-white' : 'bg-white text-[#1E181A] border-black/10'
                                }`}
                                style={selectedDemoTime === slot ? { backgroundColor: phonePalette.primary, borderColor: phonePalette.primary } : undefined}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setPhoneStep('passport')}
                          className="w-full py-3 rounded-full text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          style={{ background: phonePalette.heroGradient }}
                        >
                          <span>Confirmar Turno ({selectedDemoTime})</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )}

                    {phoneStep === 'passport' && (
                      <motion.div
                        key="passport"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <div
                          className="p-4 rounded-2xl text-white shadow-md space-y-2"
                          style={{ background: phonePalette.heroGradient }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-85">
                              Pasaporte de Fidelidad VIP
                            </span>
                            <Award className="w-4 h-4" />
                          </div>
                          <p className="font-display text-lg font-bold">Valentina Méndez</p>
                          <p className="text-[11px] opacity-90">
                            {simulatedStamps} de 5 visitas completadas
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-black/8 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6266]">
                              Sellos Acumulados
                            </span>
                            <button
                              type="button"
                              onClick={() => setSimulatedStamps((s) => (s >= 5 ? 1 : s + 1))}
                              className="text-[10px] font-bold underline cursor-pointer"
                              style={{ color: phonePalette.primary }}
                            >
                              + Simular Nuevo Sello
                            </button>
                          </div>

                          <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map((num) => {
                              const active = num <= simulatedStamps;
                              return (
                                <div
                                  key={num}
                                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all ${
                                    active ? 'text-white shadow-xs scale-105' : 'bg-[#FAF7F2] text-[#9A8C90] border-black/10'
                                  }`}
                                  style={active ? { background: phonePalette.heroGradient, borderColor: 'transparent' } : undefined}
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span className="text-[9px] font-bold mt-0.5">#{num}</span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="p-3 rounded-xl bg-[#FAF7F2] text-[11px] text-[#1E181A]">
                            {simulatedStamps >= 5 ? (
                              <span className="font-bold text-emerald-700">
                                🎉 ¡5/5 Sellos! Tu Ritual VIP de Cortesía está desbloqueado.
                              </span>
                            ) : (
                              <span>
                                A solo <strong>{5 - simulatedStamps} visita(s)</strong> de desbloquear tu <strong>Ritual VIP 100% Gratis</strong>.
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setPhoneStep('whatsapp')}
                          className="w-full py-3 rounded-full text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          style={{ backgroundColor: phonePalette.primary }}
                        >
                          <span>Ver Cierre en Recepción</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )}

                    {phoneStep === 'whatsapp' && (
                      <motion.div
                        key="whatsapp"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-3.5"
                      >
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                              Sincronización Automática
                            </span>
                          </div>
                          <p className="font-display text-sm font-bold">
                            Cita registrada en Admin + Alerta en WhatsApp
                          </p>
                          <p className="text-[11px] text-emerald-800 leading-relaxed">
                            Tu recepción recibe el turno bloqueado con servicio, especialista, monto en USD y equivalente a tasa BCV del día.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-black/8 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-[#6E6266]">Clienta:</span>
                            <span className="font-bold">Valentina Méndez</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6E6266]">Horario reservado:</span>
                            <span className="font-bold">{selectedDemoTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6E6266]">Sello de Fidelidad:</span>
                            <span className="font-bold text-emerald-700">+1 Sello Acreditado</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={onOpenCapraDemo}
                          className="w-full py-3 rounded-full text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          style={{ background: phonePalette.heroGradient }}
                        >
                          <span>Abrir Experiencia Completa</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-3 mt-3 border-t border-black/6 flex items-center justify-between text-[10px] text-[#6E6266]">
                    <span>Paleta activa: <strong>{phonePalette.name}</strong></span>
                    <button
                      type="button"
                      onClick={onOpenCapraDemo}
                      className="font-bold underline cursor-pointer"
                      style={{ color: phonePalette.primary }}
                    >
                      Pantalla completa &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 2: 3D SCROLL PERSPECTIVE ARCHITECTURAL SHOWCASE
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section ref={showcaseRef} className="relative z-10 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto" style={{ perspective: '1400px' }}>
          <motion.div
            style={{ rotateX, scale: scale3d, y: yFloat }}
            className="rounded-[40px] bg-white border border-[#1E181A]/10 shadow-[0_35px_90px_-25px_rgba(30,24,26,0.16)] overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[440px]">
                <img
                  src="/vanesev/hero-atelier.jpg"
                  alt="Interior de Salón de Belleza de Autor con Recepción QR VANESEV"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E181A]/70 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] w-fit mb-2">
                    Recepción &amp; Mesa con QR de Autor
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold">
                    Tu recepción deja de perseguir mensajes y se dedica a consentir en cabina.
                  </h2>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-9 flex flex-col justify-between bg-[#FAF7F2]">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E475B]">
                    POR QUÉ LOS SALONES DE ALTO NIVEL ELIGEN VANESEV
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-[#1E181A] leading-snug">
                    Ni directorios donde compites por precio, ni plantillas oscuras que dañan tu imagen.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E6266] leading-relaxed">
                    Las plataformas tradicionales meten a tu salón dentro de un directorio junto a tu competencia y te cobran comisiones por tus propias clientas. VANESEV construye tu <strong>propio ecosistema privado de reservas y fidelización</strong>.
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {[
                      '0% comisiones por cita: el 100% de tu facturación va directo a tu salón.',
                      'Enrutamiento limpio `/m/tu-salon` para códigos QR en recepción, espejos y bio de Instagram.',
                      'Conversión bimoneda automática (USD + Tasa BCV en vivo) en cada servicio.',
                    ].map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#1E181A]">
                        <CheckCircle2 className="w-4 h-4 text-[#9E475B] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#1E181A]/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A8C90]">
                      Caso de Estudio en Producción
                    </p>
                    <p className="font-display text-sm font-bold text-[#1E181A]">
                      Capra Studio &bull; Brows, Lashes &amp; Hair
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCapraDemo}
                    className="px-4 py-2.5 rounded-full bg-[#1E181A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#33292C]"
                  >
                    <span>Ver Carta Real</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 3: INTERACTIVE LIVE BRAND & THEME STUDIO ON LANDING PAGE
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="personalizador" className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#9E475B]/25 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E475B]">
              <Palette className="w-3.5 h-3.5" /> Libertad Creativa para Cada Salón
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#1E181A] tracking-tight">
              Cada salón tiene su esencia.{' '}
              <span className="italic font-normal text-[#9E475B]">Pruébalo aquí mismo.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#6E6266]">
              Desde el panel administrativo de tu salón (o con ayuda de nuestro equipo en Central), puedes cambiar tu paleta de colores curada, la tipografía editorial y la disposición de tus servicios con 1 clic.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Controls (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-[32px] p-6 sm:p-7 border border-[#1E181A]/8 shadow-sm space-y-6">
              {/* 1. Palette Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1E181A] block mb-3">
                  1. Elige la Paleta de Color de tu Salón
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {SALON_PALETTES.map((pal) => {
                    const active = studioPaletteId === pal.id;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setStudioPaletteId(pal.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          active
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

              {/* 2. Typography Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1E181A] block mb-2.5">
                  2. Tipografía de Autor
                </label>
                <div className="space-y-2">
                  {SALON_TYPOGRAPHIES.map((typo) => {
                    const active = studioTypographyId === typo.id;
                    return (
                      <button
                        key={typo.id}
                        type="button"
                        onClick={() => setStudioTypographyId(typo.id)}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          active
                            ? 'border-[#1E181A] bg-[#FAF7F2]'
                            : 'border-[#1E181A]/10 bg-white hover:border-[#1E181A]/30'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-[#1E181A]">{typo.name}</p>
                          <p className="text-[10px] text-[#6E6266]">{typo.subtitle}</p>
                        </div>
                        <span className="text-sm font-semibold px-2.5 py-1 rounded-lg bg-white border border-black/8">
                          Aa
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Layout Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1E181A] block mb-2.5">
                  3. Estilo de Tarjetas del Catálogo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SALON_LAYOUTS.map((lay) => {
                    const active = studioLayoutId === lay.id;
                    return (
                      <button
                        key={lay.id}
                        type="button"
                        onClick={() => setStudioLayoutId(lay.id)}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          active
                            ? 'bg-[#1E181A] text-white border-[#1E181A]'
                            : 'bg-white text-[#1E181A] border-[#1E181A]/12'
                        }`}
                      >
                        <p className="text-[11px] font-bold">{lay.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Live Transforming Salon Preview (7 cols) */}
            <motion.div
              layout
              className="lg:col-span-7 rounded-[36px] p-6 sm:p-8 border border-[#1E181A]/10 shadow-xl transition-colors duration-500 space-y-6"
              style={{
                backgroundColor: studioPalette.bgPrimary,
                color: studioPalette.textPrimary,
                fontFamily: studioTypography.bodyFont,
              }}
            >
              {/* Simulated Salon Header */}
              <div
                className="rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ background: studioPalette.heroGradient }}
              >
                <div>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest">
                    Vista Previa en Tiempo Real &bull; {studioPalette.name}
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-semibold mt-2"
                    style={{ fontFamily: studioTypography.headingFont }}
                  >
                    Maison Lumière &amp; Spa
                  </h3>
                  <p className="text-xs text-white/90 mt-1">
                    Alta Peluquería, Diseño de Mirada &amp; Bienestar Integral
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenCapraDemo}
                  className="px-4 py-2.5 rounded-full bg-white text-[#1E181A] text-xs font-bold shadow-sm shrink-0 self-start sm:self-center cursor-pointer"
                >
                  Probar Reserva
                </button>
              </div>

              {/* Simulated Service Cards in Selected Layout */}
              <div
                className={
                  studioLayoutId === 'boutique-grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                    : 'space-y-3.5'
                }
              >
                {[
                  {
                    name: 'Diseño de Cejas Orgánicas + Henna Lab',
                    desc: 'Visagismo geométrico, depilación con hilo hindú y sombreado mineral de larga duración.',
                    price: '$15 USD',
                    duration: '45 min',
                    img: '/capra/brows-henna.jpg',
                    badge: 'Best Seller',
                  },
                  {
                    name: 'Maquillaje Social & Piel Blindada HD',
                    desc: 'Preparación lumínica de la piel, acabado satinado resistente a lágrimas y pestañas de seda.',
                    price: '$35 USD',
                    duration: '75 min',
                    img: '/capra/makeup-blindada.jpg',
                    badge: 'Editorial',
                  },
                  {
                    name: 'Pedicure Spa Botánico con Pétalos & Sales',
                    desc: 'Exfoliación orgánica, hidratación térmica profunda y esmaltado gel de brillo espejo.',
                    price: '$20 USD',
                    duration: '60 min',
                    img: '/capra/pedicure-spa.jpg',
                    badge: 'Relax VIP',
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    className={`rounded-2xl bg-white border p-4 shadow-2xs flex ${
                      studioLayoutId === 'boutique-grid'
                        ? 'flex-col gap-3'
                        : 'flex-col sm:flex-row sm:items-center gap-4'
                    }`}
                    style={{ borderColor: studioPalette.borderSubtle }}
                  >
                    {studioLayoutId !== 'minimal-menu' && (
                      <img
                        src={item.img}
                        alt={item.name}
                        className={
                          studioLayoutId === 'boutique-grid'
                            ? 'w-full h-36 rounded-xl object-cover'
                            : 'w-full sm:w-24 h-32 sm:h-24 rounded-xl object-cover shrink-0'
                        }
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: studioPalette.badgeBg, color: studioPalette.badgeText }}
                        >
                          {item.badge}
                        </span>
                        <span className="text-[11px] text-[#6E6266] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.duration}
                        </span>
                      </div>
                      <h4
                        className="text-base font-bold"
                        style={{ fontFamily: studioTypography.headingFont, color: studioPalette.textPrimary }}
                      >
                        {item.name}
                      </h4>
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: studioPalette.textSecondary }}>
                        {item.desc}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5">
                      <span
                        className="text-base font-bold"
                        style={{ fontFamily: studioTypography.headingFont, color: studioPalette.primary }}
                      >
                        {item.price}
                      </span>
                      <button
                        type="button"
                        onClick={onOpenCapraDemo}
                        className="px-3.5 py-1.5 rounded-full text-white text-[11px] font-bold cursor-pointer"
                        style={{ backgroundColor: studioPalette.primary }}
                      >
                        Agendar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 4: 5 BEAUTY & WELLNESS SECTORS SHOWCASE
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="sectores" className="relative z-10 py-20 px-4 sm:px-6 bg-[#F4EFEA]/70 border-y border-[#1E181A]/6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E475B] block mb-2">
                DISEÑADO PARA CADA ESPECIALIDAD DEL SECTOR BELLEZA
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1E181A]">
                Tu especialidad tiene su propio flujo operativo.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSectorIdx(idx)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeSectorIdx === idx
                      ? 'bg-[#1E181A] text-white shadow-xs'
                      : 'bg-white text-[#6E6266] hover:text-[#1E181A] border border-[#1E181A]/10'
                  }`}
                >
                  {sec.tag}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSector.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-[36px] p-6 sm:p-8 border border-[#1E181A]/8 shadow-sm items-center"
            >
              <div className="lg:col-span-6 relative h-[320px] sm:h-[390px] rounded-[28px] overflow-hidden">
                <img
                  src={activeSector.image}
                  alt={activeSector.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E475B] block">
                      Impacto Comprobado
                    </span>
                    <p className="text-xs font-bold text-[#1E181A] mt-0.5">{activeSector.metrics}</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-[#9E475B] shrink-0" />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <span className="px-3 py-1 rounded-full bg-[#FAF0F2] text-[#9E475B] text-[10px] font-bold uppercase tracking-widest">
                  {activeSector.tag}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E181A]">
                  {activeSector.title}
                </h3>
                <p className="text-sm text-[#6E6266] leading-relaxed">
                  {activeSector.problemSolved}
                </p>

                <div className="space-y-2.5 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A8C90] block">
                    Ejemplo de Servicios en tu Carta Interactiva:
                  </span>
                  {activeSector.servicesPreview.map((srv, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#1E181A]/8 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#1E181A]">{srv.name}</p>
                        <p className="text-[10px] text-[#6E6266]">Duración bloqueada en agenda: {srv.duration}</p>
                      </div>
                      <span className="font-display font-bold text-sm text-[#9E475B]">{srv.price}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onOpenCapraDemo}
                    className="px-6 py-3 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-2 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 100%)' }}
                  >
                    <span>Ver Catálogo en Vivo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onOpenCapraAdmin}
                    className="px-5 py-3 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#1E181A] border border-[#1E181A]/12 cursor-pointer"
                  >
                    Probar Panel de Gestión
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 5: PSYCHOLOGICAL BEFORE VS. AFTER SATURDAY IN YOUR SALON
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E475B]">
              PSICOLOGÍA OPERATIVA DE TU SALÓN
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1E181A]">
              Un sábado a las 11:00 AM en tu salón: ¿Cómo prefieres vivirlo?
            </h2>

            <div className="inline-flex p-1.5 rounded-full bg-white border border-[#1E181A]/10 shadow-xs mt-2">
              <button
                type="button"
                onClick={() => setSaturdayMode('chaos')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  saturdayMode === 'chaos' ? 'bg-rose-700 text-white' : 'text-[#6E6266]'
                }`}
              >
                Sin Sistema (Caos en WhatsApp)
              </button>
              <button
                type="button"
                onClick={() => setSaturdayMode('vanesev')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  saturdayMode === 'vanesev' ? 'bg-[#1E181A] text-white' : 'text-[#6E6266]'
                }`}
              >
                Con VANESEV Beauty Cloud
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {saturdayMode === 'chaos' ? (
              <motion.div
                key="chaos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-[32px] bg-rose-50/70 border border-rose-200 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {[
                  {
                    title: '38 Mensajes Sin Responder',
                    desc: 'Mientras atiendes a una clienta en cabina, 12 nuevas clientas preguntan precios y horarios. Cuando respondes a las 7:00 PM, ya reservaron en otro salón.',
                  },
                  {
                    title: 'Cruces de Turnos & Esperas',
                    desc: 'Anotar citas en cuadernos o chats sueltos genera dos clientas citadas a la misma hora con la misma especialista.',
                  },
                  {
                    title: 'Tarjetas de Cartón Perdidas',
                    desc: 'Las clientas olvidan su tarjeta física de sellos en casa y pierden el incentivo de volver cada mes.',
                  },
                ].map((c, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">
                      Fuga de Ingresos #{i + 1}
                    </span>
                    <h4 className="font-display text-lg font-bold text-[#1E181A]">{c.title}</h4>
                    <p className="text-xs text-[#6E6266] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="vanesev"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-[32px] bg-white border border-[#1E181A]/10 shadow-md p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {[
                  {
                    title: 'Catálogo que Vende 24/7',
                    desc: 'Tu link `/m/tu-salon` en Instagram y tu código QR en recepción muestran precios en USD/Bs, fotos reales y horarios disponibles al instante.',
                  },
                  {
                    title: 'Equipo, Sillones & Cabinas en Orden',
                    desc: 'Cada especialista y cada cabina tiene su capacidad configurada. Si un turno se ocupa, se bloquea automáticamente en tiempo real.',
                  },
                  {
                    title: 'Pasaporte VIP con su Número de Teléfono',
                    desc: 'Al culminar el servicio en Admin, acreditas 1 sello VIP con 1 clic y le envías su felicitación por WhatsApp.',
                  },
                ].map((c, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#1E181A]/8 space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      Paz Operativa #{i + 1}
                    </span>
                    <h4 className="font-display text-lg font-bold text-[#1E181A]">{c.title}</h4>
                    <p className="text-xs text-[#6E6266] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 6: EXECUTIVE DASHBOARDS PREVIEW (ADMIN DE SALÓN & SUPER-ADMIN CENTRAL)
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="ejecutivo" className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E475B]">
              INGENIERÍA EJECUTIVA LUMINOSA
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#1E181A]">
              Paneles de dirección tan elegantes como tu propio salón.
            </h2>
            <p className="text-sm sm:text-base text-[#6E6266]">
              Controla citas, especialistas, cabinas, diseño de tu carta, códigos QR dinámicos y reportes financieros en PDF desde cualquier móvil, tablet o computador.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Salon Admin Dashboard */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-[32px] bg-white border border-[#1E181A]/10 shadow-sm p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div
                  className="rounded-3xl p-6 text-white shadow-md"
                  style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 55%, #E6B89C 100%)' }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                    Panel de la Dueña del Salón (/admin)
                  </span>
                  <h3 className="font-display text-2xl font-semibold mt-3">
                    Dirección de Sede, Diseño &amp; Agenda
                  </h3>
                  <p className="text-xs text-white/90 mt-1">
                    Personaliza la paleta y tipografía de tu carta, agrega o edita servicios con fotos, gestiona a tu equipo de especialistas y acredita sellos VIP.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    'Editor de Paleta, Tipografía y Layout en Vivo',
                    'Creador y Editor de Servicios, Precios y Fotos',
                    'Gestión de Especialistas, Comisiones y Cabinas',
                    'Generador QR `/m/` + Reporte Contable PDF',
                  ].map((feat, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#1E181A]/6 font-medium text-[#1E181A] flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#9E475B] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenCapraAdmin}
                className="w-full py-3.5 rounded-full bg-[#1E181A] hover:bg-[#33292C] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Entrar al Admin Demo (Capra Studio)</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Card 2: Multi-Tenant Central Super-Admin */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-[32px] bg-white border border-[#1E181A]/10 shadow-sm p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div
                  className="rounded-3xl p-6 text-white shadow-md"
                  style={{ background: 'linear-gradient(135deg, #A67B5B 0%, #C89B7B 55%, #E6CBA8 100%)' }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                    Gobernanza Multi-Sede (/central)
                  </span>
                  <h3 className="font-display text-2xl font-semibold mt-3">
                    Super-Admin Central de Clientes &amp; Franquicias
                  </h3>
                  <p className="text-xs text-white/90 mt-1">
                    Da de alta nuevos salones en 1 clic, asigna su identidad visual independiente, supervisa métricas globales y asiste a cada cliente en su ficha.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    'Alta 1-Click de Nuevos Salones sin Herencia',
                    'Edición Directa de la Carta de Cualquier Cliente',
                    'Acceso Directo al Admin y PWA de Cada Sede',
                    'Analítica Global de Escaneos QR y Competidores',
                  ].map((feat, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#1E181A]/6 font-medium text-[#1E181A] flex items-center gap-2">
                      <Crown className="w-3.5 h-3.5 text-[#A67B5B] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenCentral}
                className="w-full py-3.5 rounded-full bg-[#FAF7F2] hover:bg-[#EFE9E0] text-[#1E181A] border border-[#1E181A]/15 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Abrir Super-Admin Central</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 7: FINANCIAL RECOVERY CALCULATOR & TRANSPARENT PLANS
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="inversion" className="relative z-10 py-20 px-4 sm:px-6 bg-[#F4EFEA]/60 border-t border-[#1E181A]/8">
        <div className="max-w-7xl mx-auto space-y-14">
          {/* Interactive ROI Calculator */}
          <div className="rounded-[36px] bg-white border border-[#1E181A]/10 shadow-sm p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E475B]">
                CALCULADORA DE RECUPERACIÓN DE AGENDA
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E181A]">
                ¿Cuánto dinero pierde tu salón por mensajes respondidos tarde o inasistencias?
              </h3>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Ticket Promedio por Servicio en tu Salón:</span>
                    <span className="text-[#9E475B]">${avgTicket} USD</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={90}
                    value={avgTicket}
                    onChange={(e) => setAvgTicket(Number(e.target.value))}
                    className="w-full accent-[#9E475B] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Citas semanales que no concretan por demora en WhatsApp:</span>
                    <span className="text-[#9E475B]">{missedWeekly} citas / semana</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={20}
                    value={missedWeekly}
                    onChange={(e) => setMissedWeekly(Number(e.target.value))}
                    className="w-full accent-[#9E475B] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div
              className="lg:col-span-5 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3"
              style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 100%)' }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-85 block">
                Facturación Recuperable Estimada
              </span>
              <p className="font-display text-4xl sm:text-5xl font-bold">
                +${monthlyRecoveredUSD.toLocaleString()} <span className="text-lg font-normal">USD / mes</span>
              </p>
              <p className="text-xs text-white/90">
                Equivalente a <strong>+${yearlyRecoveredUSD.toLocaleString()} USD al año</strong> en turnos que hoy se escapan cuando tu recepción está ocupada.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onOpenCapraDemo}
                  className="w-full py-3 rounded-full bg-white text-[#1E181A] text-xs font-bold shadow-sm cursor-pointer"
                >
                  Conocer Cómo Recuperarlos Hoy
                </button>
              </div>
            </div>
          </div>

          {/* Transparent Pricing Tiers */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E475B]">
                INVERSIÓN CLARA &bull; CERO COMISIONES POR CITA
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1E181A]">
                Planes pensados para crecer contigo.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Atelier Boutique',
                  price: '$19',
                  period: '/mes',
                  subtitle: 'Ideal para estudios independientes y especialistas de autor.',
                  features: [
                    'Carta Interactiva con Paleta y Tipografía Editable',
                    'Ruta QR Limpia (/m/tu-salon) + Kit Imprimible',
                    'Agenda Conectada a WhatsApp & Tasa BCV',
                    'Hasta 2 Especialistas en Agenda',
                  ],
                  highlighted: false,
                },
                {
                  name: 'Salon Couture Pro',
                  price: '$29',
                  period: '/mes',
                  subtitle: 'El estándar completo para salones, peluquerías y spas en crecimiento.',
                  features: [
                    'Todo lo incluido en Atelier Boutique',
                    'Pasaporte Digital de Fidelidad VIP (Sellos)',
                    'Gestión de Equipo, Comisiones y Cabinas',
                    'Reportes Contables en PDF & CRM VIP',
                  ],
                  highlighted: true,
                },
                {
                  name: 'Maison Multi-Sede',
                  price: '$59',
                  period: '/mes',
                  subtitle: 'Para clínicas estéticas, academias y franquicias con múltiples áreas.',
                  features: [
                    'Especialistas y Cabinas Ilimitadas',
                    'Subdominio Propio + Configuración Asistida',
                    'Módulo de Academia, Cursos & Paquetes Novia',
                    'Soporte Prioritario Directo desde Central',
                  ],
                  highlighted: false,
                },
              ].map((plan, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className={`rounded-[32px] p-7 flex flex-col justify-between border ${
                    plan.highlighted
                      ? 'bg-white border-2 border-[#9E475B] shadow-xl relative'
                      : 'bg-white border-[#1E181A]/10 shadow-xs'
                  }`}
                >
                  {plan.highlighted && (
                    <span
                      className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white w-fit mb-4"
                      style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 100%)' }}
                    >
                      Más Elegido por Salones
                    </span>
                  )}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-[#1E181A]">{plan.name}</h3>
                      <p className="text-xs text-[#6E6266] mt-1">{plan.subtitle}</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold text-[#1E181A]">{plan.price}</span>
                      <span className="text-xs text-[#6E6266] font-semibold">USD {plan.period}</span>
                    </div>
                    <div className="space-y-2.5 pt-2 border-t border-[#1E181A]/8">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#1E181A]">
                          <Check className="w-4 h-4 text-[#9E475B] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenCapraDemo}
                    className={`w-full mt-7 py-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      plan.highlighted
                        ? 'text-white shadow-md'
                        : 'bg-[#FAF7F2] hover:bg-[#EFE9E0] text-[#1E181A] border border-[#1E181A]/12'
                    }`}
                    style={plan.highlighted ? { background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 100%)' } : undefined}
                  >
                    Probar Demo en Vivo
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── LUMINOUS EDITORIAL FOOTER ─── */}
      <footer className="relative z-10 bg-white border-t border-[#1E181A]/8 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #9E475B 0%, #C87D65 100%)' }}
            >
              V
            </div>
            <div>
              <p className="font-display font-bold text-sm text-[#1E181A]">
                VANESEV Beauty &amp; Wellness Cloud
              </p>
              <p className="text-[11px] text-[#6E6266]">
                Tecnología de Autor para Salones de Belleza, Peluquerías, Clínicas Estéticas y Spas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenCapraDemo}
              className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#EFE9E0] text-xs font-bold text-[#1E181A] border border-[#1E181A]/10 cursor-pointer"
            >
              Carta Demo (/m/capra-studio)
            </button>
            <button
              type="button"
              onClick={onOpenCapraAdmin}
              className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#EFE9E0] text-xs font-bold text-[#1E181A] border border-[#1E181A]/10 cursor-pointer"
            >
              Admin Demo (/capra-studio/admin)
            </button>
            <button
              type="button"
              onClick={onOpenCentral}
              className="px-4 py-2 rounded-full bg-[#FAF0F2] hover:bg-[#F5E1E6] text-xs font-bold text-[#9E475B] border border-[#9E475B]/20 cursor-pointer"
            >
              Super-Admin (/central)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
