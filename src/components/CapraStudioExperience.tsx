import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Phone,
  Award,
  ShieldCheck,
  CheckCircle2,
  Star,
  MapPin,
  ArrowRight,
  QrCode,
  Copy,
  Check,
  X,
  Search,
  GraduationCap,
} from 'lucide-react';
import { ServiceItem } from '../types';
import { QREncoder } from '../utils/qrEncoder';

interface CapraStudioExperienceProps {
  services: ServiceItem[];
  exchangeRate: number;
  onOpenBooking: (service?: ServiceItem) => void;
  onOpenAccountModal: () => void;
}

const CAPRA_CATEGORIES = [
  { id: 'all', label: 'Carta Completa', code: '00' },
  { id: 'cejas_pestanas', label: 'Cejas & Pestañas', code: '01' },
  { id: 'estilismo', label: 'Estilismo & Alisados', code: '02' },
  { id: 'maquillaje', label: 'Maquillaje HD', code: '03' },
  { id: 'nails', label: 'Nails & Spa Pies', code: '04' },
  { id: 'depilacion', label: 'Cabina Depilación', code: '05' },
  { id: 'cursos', label: 'Capra Academy', code: '06' },
];

const matchesCategoryGroup = (serviceCategory: string, selectedTab: string): boolean => {
  if (selectedTab === 'all') return true;
  const cat = (serviceCategory || '').toLowerCase();
  if (selectedTab === 'estilismo') {
    return cat === 'estilismo' || cat === 'estilismo_alisados';
  }
  if (selectedTab === 'nails') {
    return cat === 'nails' || cat === 'manicure_pedicure' || cat === 'manicure' || cat === 'pedicure';
  }
  return cat === selectedTab;
};

const getDepartmentTitle = (catId: string): { title: string; subtitle: string; code: string } => {
  switch (catId) {
    case 'cejas_pestanas':
      return {
        code: '01',
        title: 'Arquitectura de Miradas · Cejas & Pestañas',
        subtitle: 'Visagismo facial, laminado nutritivo con keratina y extensiones pelo a pelo en fibras de seda.',
      };
    case 'estilismo':
      return {
        code: '02',
        title: 'Hair Couture · Alisados Orgánicos & Brushing',
        subtitle: 'Fórmulas botánicas libres de formol, sellado térmico con brillo espejo y ondas editoriales.',
      };
    case 'maquillaje':
      return {
        code: '03',
        title: 'Maquillaje Profesional & Piel Blindada HD',
        subtitle: 'Preparación dermo-cosmética resistente a clima húmedo, lágrimas y fotografía de alta resolución.',
      };
    case 'nails':
      return {
        code: '04',
        title: 'Nails Atelier & Ritual Spa Botánico',
        subtitle: 'Manicura rusa combinada con instrumental esterilizado en autoclave y nivelación rubber.',
      };
    case 'depilacion':
      return {
        code: '05',
        title: 'Cabina Privada de Depilación Corporal',
        subtitle: 'Protocolo higiénico descartable con cera miel y española + loción calmante post-depilatoria.',
      };
    case 'cursos':
      return {
        code: '06',
        title: 'Capra Academy · Formación Profesional Certificada',
        subtitle: 'Masterclasses teórico-prácticas dirigidas por María Giovanna Capra con materiales y guía incluidos.',
      };
    default:
      return {
        code: '00',
        title: 'Servicios de Autor',
        subtitle: 'Protocolos personalizados en San Cristóbal.',
      };
  }
};

export const CapraStudioExperience: React.FC<CapraStudioExperienceProps> = ({
  services,
  exchangeRate,
  onOpenBooking,
  onOpenAccountModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const qrSvgString = React.useMemo(() => {
    try {
      const matrix = QREncoder.generateMatrix('https://vanesev.com/r/capra-menu');
      return QREncoder.toSVG(matrix, {
        fgColor: '#8E4A59',
        bgColor: '#FFFFFF',
        centerText: 'CAPRA',
      });
    } catch {
      return '';
    }
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesCat = matchesCategoryGroup(s.category, selectedCategory);
    const matchesSearch =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.tags && s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  // Featured recommendation ("Hoy recomendamos en el Atelier")
  const featuredService =
    services.find((s) => s.id === 'capra-alisado-org') ||
    services.find((s) => s.id === 'capra-cejas-lam') ||
    services[0];

  // Academy courses
  const academyCourses = services.filter((s) => s.category === 'cursos');

  // Active category sections to render in structured editorial blocks
  const activeSectionIds =
    selectedCategory === 'all'
      ? ['cejas_pestanas', 'estilismo', 'maquillaje', 'nails', 'depilacion', 'cursos']
      : [selectedCategory];

  return (
    <div className="min-h-screen bg-[#FAF6F3] text-[#191215] font-sans selection:bg-[#8E4A59]/20 selection:text-[#191215] flex flex-col pb-24 sm:pb-12">
      {/* ══ 1. CABECERA ATMOSFÉRICA DE AUTOR (INSPIRADA EN CARTA INTERACTIVA DE ALTA GAMA) ══ */}
      <header className="relative bg-[#191215] text-[#FAF6F3] overflow-hidden border-b border-[#C8A97E]/20">
        {/* Ambient radial lighting */}
        <div
          className="absolute inset-0 pointer-events-none opacity-85"
          style={{
            background:
              'radial-gradient(circle at 18% 20%, rgba(142, 74, 89, 0.38) 0%, transparent 52%), radial-gradient(circle at 85% 75%, rgba(200, 169, 126, 0.22) 0%, transparent 48%)',
          }}
        />

        {/* Top bar */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-4 pb-3 flex items-center justify-between gap-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8E4A59] border border-[#C8A97E]/60 flex items-center justify-center text-[#FAF6F3] font-serif italic text-lg shadow-sm shrink-0">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C8A97E]">
                  CARTA DE SERVICIOS &amp; RESERVAS
                </span>
              </div>
              <p className="text-xs text-[#FAF6F3]/75">
                San Cristóbal, Estado Táchira · Atención con Cita Previa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/15 text-[#FAF6F3] border border-white/15 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Código QR Oficial de Capra Studio"
            >
              <QrCode className="w-3.5 h-3.5 text-[#C8A97E]" />
              <span className="hidden sm:inline">QR Salón</span>
            </button>
            <button
              onClick={onOpenAccountModal}
              className="px-3.5 py-1.5 rounded-full bg-white/8 hover:bg-white/15 text-[#FAF6F3] border border-[#C8A97E]/35 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8A97E]" />
              <span>Capra Privé</span>
            </button>
          </div>
        </div>

        {/* Hero Editorial Identity */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 border border-[#C8A97E]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C8A97E]">
                  BY MARÍA GIOVANNA CAPRA · @CAPRASTUDIO_
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl leading-[1.03] tracking-tight text-[#FAF6F3]">
                Capra Studio{' '}
                <span className="italic font-normal text-[#E5C3CE]">
                  Beauty Atelier &amp; Academy.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#FAF6F3]/80 max-w-xl leading-relaxed">
                Arquitectura de cejas y pestañas, alisados orgánicos con brillo espejo, maquillaje blindado HD, manicura rusa y formación certificada en San Cristóbal.
              </p>

              {/* Action & Rating Bar (Matching Author Digital Menu Pattern) */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onOpenBooking()}
                  className="px-6 py-3 rounded-full bg-[#8E4A59] hover:bg-[#9f5465] text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-[#8E4A59]/30 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#F3D8DF]" />
                  <span>Reservar cita ahora</span>
                </button>

                <a
                  href="https://wa.me/584247429530?text=Hola%20María%20Capra,%20deseo%20consultar%20disponibilidad%20en%20Capra%20Studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-full bg-white/8 hover:bg-white/14 text-[#FAF6F3] border border-white/15 text-xs font-medium flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C8A97E]" />
                  <span>WhatsApp Concierge</span>
                </a>

                <div className="px-3.5 py-2.5 rounded-full bg-white/6 border border-white/10 text-xs text-[#FAF6F3]/90 flex items-center gap-1.5 tabular-nums">
                  <span className="text-[#C8A97E] tracking-tight">★★★★★</span>
                  <span className="font-semibold">4.9</span>
                  <span className="text-[#FAF6F3]/60">· Tasa BCV: Bs. {exchangeRate.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right Editorial Portrait Composition */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#C8A97E]/30 bg-[#23191D] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85"
                  alt="Capra Studio Atelier San Cristóbal"
                  className="w-full h-56 sm:h-64 object-cover object-center opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191215] via-[#191215]/30 to-transparent" />
                <div className="absolute bottom-3 inset-x-3 p-3.5 rounded-xl bg-[#191215]/85 backdrop-blur-md border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#C8A97E] block">
                      PASAPORTE DE FIDELIDAD
                    </span>
                    <p className="text-xs font-semibold text-white">
                      Acumula 5 sellos verificados = Tratamiento VIP de Cortesía
                    </p>
                  </div>
                  <button
                    onClick={onOpenAccountModal}
                    className="px-3 py-1.5 rounded-lg bg-[#C8A97E] text-[#191215] font-bold text-[11px] shrink-0 cursor-pointer"
                  >
                    Ver Sellos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ══ 2. BLOQUE DESTACADO: "HOY RECOMENDAMOS EN EL ATELIER" (PATRÓN CARTA DE AUTOR) ══ */}
      {featuredService && (
        <section className="max-w-6xl mx-auto w-full px-4 sm:px-8 pt-6 pb-2">
          <div className="rounded-2xl border-2 border-dashed border-[#8E4A59]/35 bg-[#FDFBF9] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <img
                src={featuredService.imageUrl}
                alt={featuredService.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#8E4A59]/20 shrink-0"
              />
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-[#8E4A59] font-semibold mb-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>RECOMENDACIÓN DE LA DIRECTORA · HOY EN EL ATELIER</span>
                </div>
                <h2 className="font-serif text-lg sm:text-xl text-[#191215] leading-snug">
                  {featuredService.name}
                </h2>
                <p className="text-xs text-[#6B565C] line-clamp-1 mt-0.5">
                  {featuredService.shortDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#8E4A59]/10">
              <div className="text-left sm:text-right tabular-nums">
                <span className="text-lg font-bold text-[#191215] block leading-none">
                  ${featuredService.priceUSD} USD
                </span>
                <span className="text-[11px] text-[#7A6268] font-mono">
                  Bs. {(featuredService.priceUSD * exchangeRate).toFixed(2)} · {featuredService.durationMinutes} min
                </span>
              </div>
              <button
                onClick={() => onOpenBooking(featuredService)}
                className="px-4 py-2.5 rounded-xl bg-[#191215] hover:bg-[#8E4A59] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <span>Agendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ══ 3. NAVEGACIÓN STICKY DE ESPECIALIDADES + BUSCADOR EN TIEMPO REAL ══ */}
      <div className="sticky top-0 z-30 bg-[#FAF6F3]/95 backdrop-blur-md border-b border-[#8E4A59]/15 py-3 px-4 sm:px-8 mt-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {CAPRA_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#191215] text-[#FAF6F3] shadow-xs'
                      : 'bg-white text-[#5E474D] hover:bg-[#F2E8EC] border border-[#8E4A59]/15'
                  }`}
                >
                  <span className={`font-mono text-[10px] ${active ? 'text-[#C8A97E]' : 'text-[#8E4A59]/70'}`}>
                    {cat.code}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-[#8E4A59] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar servicio o curso..."
              className="w-full pl-9 pr-8 py-2 rounded-full bg-white border border-[#8E4A59]/20 text-xs text-[#191215] placeholder-[#8E757B] focus:outline-none focus:border-[#8E4A59]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E757B] hover:text-[#191215] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══ 4. CARTA ESTRUCTURADA POR DEPARTAMENTOS (DISEÑO EDITORIAL NUMERADO) ══ */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 space-y-12 flex-1">
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-[#8E4A59]/15">
            <p className="font-serif text-xl text-[#191215] mb-1">
              No encontramos servicios con "{searchQuery}"
            </p>
            <p className="text-xs text-[#6B565C] mb-4">
              Prueba con otra palabra clave o explora todas las especialidades del estudio.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full bg-[#191215] text-white text-xs font-semibold cursor-pointer"
            >
              Mostrar toda la carta
            </button>
          </div>
        ) : (
          activeSectionIds.map((secId) => {
            const sectionItems = filteredServices.filter((s) => matchesCategoryGroup(s.category, secId));
            if (sectionItems.length === 0) return null;
            const dept = getDepartmentTitle(secId);

            return (
              <section key={secId} className="space-y-5">
                {/* Department Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#8E4A59]/20">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#8E4A59]">
                        /{dept.code}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7A6268]">
                        DEPARTAMENTO ESPECIALIZADO
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#191215] mt-0.5">
                      {dept.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B565C] max-w-md">
                    {dept.subtitle}
                  </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {sectionItems.map((svc, idx) => {
                    const priceBs = (svc.priceUSD * exchangeRate).toFixed(2);
                    const isCourse = svc.category === 'cursos';

                    return (
                      <article
                        key={svc.id}
                        className="group bg-white rounded-2xl border border-[#8E4A59]/15 hover:border-[#8E4A59]/45 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row"
                      >
                        {/* Thumbnail */}
                        <div className="sm:w-44 h-48 sm:h-auto relative overflow-hidden bg-[#191215] shrink-0">
                          <img
                            src={svc.imageUrl}
                            alt={svc.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#191215]/70 via-transparent to-transparent sm:hidden" />

                          {/* Top badge */}
                          <span
                            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold text-white shadow-xs ${
                              isCourse ? 'bg-[#B8925A]' : 'bg-[#8E4A59]'
                            }`}
                          >
                            {svc.badgeText || (isCourse ? 'Capra Academy' : 'Signature')}
                          </span>

                          {/* Duration pill */}
                          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#191215]/80 backdrop-blur-xs text-white text-[10px] font-mono flex items-center gap-1 tabular-nums">
                            <Clock className="w-3 h-3 text-[#C8A97E]" />
                            {svc.durationMinutes} min
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span className="font-mono text-[10px] text-[#8E4A59] font-semibold">
                                {dept.code}.{String(idx + 1).padStart(2, '0')}
                              </span>
                              <div className="text-right tabular-nums shrink-0">
                                <span className="text-lg font-bold text-[#191215] whitespace-nowrap">
                                  ${svc.priceUSD} USD
                                </span>
                                <span className="block text-[10px] font-mono text-[#7A6268] whitespace-nowrap">
                                  Bs. {priceBs}
                                </span>
                              </div>
                            </div>

                            <h4 className="font-serif text-lg sm:text-xl text-[#191215] leading-snug mb-1.5">
                              {svc.name}
                            </h4>

                            <p className="text-xs text-[#5E474D] leading-relaxed mb-3">
                              {svc.fullDescription || svc.shortDescription}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#FAF6F3] flex items-center justify-between gap-2">
                            <span className="text-[11px] text-[#7A6268] truncate">
                              {svc.idealFor}
                            </span>

                            <button
                              onClick={() => onOpenBooking(svc)}
                              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                                isCourse
                                  ? 'bg-[#B8925A] hover:bg-[#9e7b47] text-white'
                                  : 'bg-[#191215] hover:bg-[#8E4A59] text-white'
                              }`}
                            >
                              <span>{isCourse ? 'Inscribirme' : 'Reservar'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}

        {/* ══ 5. SECCIÓN ESPECIAL: CAPRA ACADEMY (FORMACIÓN PRESENCIAL CERTIFICADA) ══ */}
        {academyCourses.length > 0 && selectedCategory !== 'cursos' && (
          <section className="rounded-3xl bg-[#191215] text-[#FAF6F3] p-6 sm:p-10 border border-[#C8A97E]/30 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                background:
                  'radial-gradient(circle at 85% 20%, rgba(200, 169, 126, 0.25) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(142, 74, 89, 0.35) 0%, transparent 50%)',
              }}
            />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#C8A97E]/40 text-[#C8A97E] text-[10px] font-mono uppercase tracking-[0.2em]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>CAPRA ACADEMY · SAN CRISTÓBAL</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl leading-tight">
                  Formación intensiva para futuras especialistas en belleza.
                </h3>
                <p className="text-xs sm:text-sm text-[#FAF6F3]/80 leading-relaxed">
                  Aprende las técnicas exactas de nuestro estudio con práctica en modelo real, materiales incluidos en mesa, guía impresa y certificado avalado por María Giovanna Capra.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white/6 border border-white/10">
                    <span className="font-mono text-[10px] text-[#C8A97E] uppercase block">MODALIDAD</span>
                    <span className="text-xs font-semibold text-white">Grupos Reducidos VIP (100% Práctico)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/6 border border-white/10">
                    <span className="font-mono text-[10px] text-[#C8A97E] uppercase block">RESERVA DE CUPO</span>
                    <span className="text-xs font-semibold text-white">50% de abono inicial y resto el día del curso</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 gap-3.5">
                {academyCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8A97E] block">
                        CERTIFICACIÓN PRESENCIAL · {course.durationMinutes / 60} HORAS
                      </span>
                      <h4 className="font-serif text-lg text-white mt-0.5">
                        {course.name}
                      </h4>
                      <p className="text-xs text-white/70 mt-0.5">
                        {course.shortDescription}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 tabular-nums">
                      <span className="text-lg font-bold text-[#C8A97E] whitespace-nowrap">
                        ${course.priceUSD} USD
                      </span>
                      <button
                        onClick={() => onOpenBooking(course)}
                        className="px-4 py-2 rounded-xl bg-[#C8A97E] hover:bg-[#d8bc93] text-[#191215] font-bold text-xs cursor-pointer whitespace-nowrap"
                      >
                        Apartar Cupo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ 6. INFORMACIÓN DEL ESTUDIO, POLÍTICAS CLARAS & MÉTODOS DE PAGO ══ */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="bg-white rounded-2xl p-5 border border-[#8E4A59]/15 space-y-2">
            <div className="flex items-center gap-2 text-[#8E4A59] font-mono text-[11px] uppercase tracking-wider font-semibold">
              <MapPin className="w-4 h-4" />
              <span>01 · Ubicación &amp; Horario</span>
            </div>
            <h4 className="font-serif text-lg text-[#191215]">San Cristóbal, Táchira</h4>
            <p className="text-xs text-[#5E474D] leading-relaxed">
              Atención de Lunes a Sábado de 8:30 AM a 6:30 PM bajo cita programada. Ambiente climatizado, Wi-Fi y café de cortesía.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#8E4A59]/15 space-y-2">
            <div className="flex items-center gap-2 text-[#8E4A59] font-mono text-[11px] uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>02 · Garantía &amp; Puntualidad</span>
            </div>
            <h4 className="font-serif text-lg text-[#191215]">Reserva Protegida</h4>
            <p className="text-xs text-[#5E474D] leading-relaxed">
              Tolerancia máxima de 15 minutos por respeto a la agenda de cada clienta. Los cursos de Capra Academy se reservan con el 50%.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#8E4A59]/15 space-y-2">
            <div className="flex items-center gap-2 text-[#8E4A59] font-mono text-[11px] uppercase tracking-wider font-semibold">
              <Award className="w-4 h-4" />
              <span>03 · Métodos de Pago</span>
            </div>
            <h4 className="font-serif text-lg text-[#191215]">Multi-Divisa sin Fricción</h4>
            <p className="text-xs text-[#5E474D] leading-relaxed tabular-nums">
              Efectivo (USD / COP), Zelle, Binance Pay (USDT) y Pago Móvil a tasa oficial BCV del día (Bs. {exchangeRate.toFixed(2)}).
            </p>
          </div>
        </section>
      </main>

      {/* ══ FOOTER DE AUTOR CAPRA STUDIO ══ */}
      <footer className="bg-[#191215] text-[#FAF6F3]/70 border-t border-white/10 py-8 px-4 sm:px-8 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8E4A59] text-white font-serif italic flex items-center justify-center text-sm">
              C
            </div>
            <div>
              <p className="font-semibold text-white">Capra Studio · By María Giovanna Capra</p>
              <p className="text-[11px] text-white/55">San Cristóbal, Estado Táchira · Venezuela</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="/"
              className="text-[#C8A97E] hover:underline font-mono uppercase tracking-wider"
            >
              Tecnología por VANESEV
            </a>
          </div>
        </div>
      </footer>

      {/* ══ BARRA FLOTANTE INFERIOR EN MÓVIL (SAFE-AREA SUPPORT) ══ */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-[#191215]/95 backdrop-blur-md border-t border-white/15 px-4 pt-2.5 pb-[max(12px,env(safe-area-inset-bottom))] flex items-center justify-between gap-2">
        <button
          onClick={onOpenAccountModal}
          className="px-3 py-2.5 rounded-xl bg-white/10 text-[#FAF6F3] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C8A97E]" />
          <span>Capra Privé</span>
        </button>

        <a
          href="https://wa.me/584247429530"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2.5 rounded-xl bg-white/10 text-[#FAF6F3] text-xs font-medium flex items-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-[#C8A97E]" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => onOpenBooking()}
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#8E4A59] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Reservar Cita</span>
        </button>
      </div>

      {/* ══ MODAL QR DINÁMICO DE CAPRA STUDIO ══ */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-[#FAF6F3] border border-[#8E4A59]/30 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#191215]/10 hover:bg-[#191215]/20 flex items-center justify-center text-[#191215] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full bg-[#8E4A59]/15 text-[#8E4A59] text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
              QR Oficial de Recepción
            </span>
            <h3 className="font-serif text-2xl text-[#191215]">
              Capra Studio
            </h3>
            <p className="text-xs text-[#6B565C] mb-4">
              Escanea con la cámara para abrir la carta interactiva y agendar sin esperas
            </p>

            <div className="bg-white p-4 rounded-2xl border border-[#8E4A59]/25 inline-block shadow-inner mb-4">
              {qrSvgString ? (
                <div
                  className="w-48 h-48 mx-auto"
                  dangerouslySetInnerHTML={{ __html: qrSvgString }}
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-gray-400">
                  Generando QR...
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-2.5 border border-[#8E4A59]/20 flex items-center justify-between gap-2 mb-4">
              <span className="text-[11px] font-mono text-[#191215] truncate pl-1">
                https://vanesev.com/m/capra-studio
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://vanesev.com/m/capra-studio');
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#8E4A59] text-white text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#191215] text-white text-xs font-bold cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
