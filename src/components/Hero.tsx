import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ArrowRight,
  Palette,
  Heart
} from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onSelectServiceById?: (serviceId: string) => void;
}

interface ShowcaseSlide {
  id: string;
  category: string;
  title: string;
  highlight: string;
  description: string;
  imageUrl: string;
  badge: string;
  badgeColor: string;
  priceUSD: number;
  duration: string;
  serviceId?: string;
}

const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: 'andrea-profile',
    category: 'Manicurista Master',
    title: 'Andrea Labrador',
    highlight: '7 Años de Trayectoria',
    description: 'Técnico especialista en cuidado anatómico y estética ungueal de alta gama en Venezuela.',
    imageUrl: '/images/andrea-labrador-hero.png',
    badge: 'Firma de Autor',
    badgeColor: 'bg-amber-600',
    priceUSD: 10,
    duration: 'Atención 1 a 1',
  },
  {
    id: 'semipermanente',
    category: 'Esmaltado en Gel',
    title: 'Semipermanente Rosa Glaseado',
    highlight: 'Brillo Espejo & Cutícula Rusa',
    description: 'Color vibrante curado con luz LED UV de alta intensidad. Impecable hasta por 3 semanas.',
    imageUrl: '/images/esmaltado-semipermanente.png',
    badge: 'Favorito Diario',
    badgeColor: 'bg-pink-600',
    priceUSD: 10,
    duration: '60 min',
    serviceId: 'semipermanente',
  },
  {
    id: 'base-rubber',
    category: 'Nivelación Anatómica',
    title: 'Rubber Base Cherry Deep',
    highlight: 'Ápice Perfecto & Anti-Quiebre',
    description: 'Estructura flexible que absorbe impactos diarios y devuelve la fuerza a uñas delgadas o frágiles.',
    imageUrl: '/images/base-rubber.png',
    badge: 'Tratamiento Estrella',
    badgeColor: 'bg-rose-700',
    priceUSD: 15,
    duration: '90 min',
    serviceId: 'base-rubber',
  },
  {
    id: 'jelly-tips',
    category: 'Extensiones Gel',
    title: 'Jelly Tips Red Waves',
    highlight: 'Longitud Express & Peso Pluma',
    description: 'Tips 100% de gel pre-moldeados con simetría milimétrica. Cero peso y máxima ligereza.',
    imageUrl: '/images/jelly-tips.jpg',
    badge: 'Tendencia 2025',
    badgeColor: 'bg-emerald-700',
    priceUSD: 15,
    duration: '90 min',
    serviceId: 'jelly-tips',
  },
  {
    id: 'polygel-extensions',
    category: 'Esculpido Artesanal',
    title: 'Polygel Nude & Glitter Flakes',
    highlight: 'Fuerza Híbrida Diamante',
    description: 'Esculpido a mano milímetro a milímetro. Lo mejor del acrílico y gel sin olores molestos.',
    imageUrl: '/images/polygel-extensions.png',
    badge: 'Alta Costura',
    badgeColor: 'bg-purple-700',
    priceUSD: 18,
    duration: '120 min',
    serviceId: 'polygel-extensions',
  },
  {
    id: 'polygel-capping',
    category: 'Blindaje Ungueal',
    title: 'Capping Polygel Milky Soft',
    highlight: 'Armadura sobre tu Uña Natural',
    description: 'Refuerzo invisible ultra-resistente que permite que tu uña natural crezca sin fracturarse.',
    imageUrl: '/images/polygel-capping.png',
    badge: 'Cero Fracturas',
    badgeColor: 'bg-sage-700',
    priceUSD: 16,
    duration: '90 min',
    serviceId: 'polygel-capping',
  },
  {
    id: 'pedicure',
    category: 'Bienestar Spa',
    title: 'Pedicure Spa Integral',
    highlight: 'Exfoliación Marina & Masaje',
    description: 'Cuidado clínico y estético de pies: sales minerales, limado anatómico y esmaltado impecable.',
    imageUrl: '/images/pedicure-spa.jpg',
    badge: 'Relax Total',
    badgeColor: 'bg-teal-700',
    priceUSD: 11.5,
    duration: '75 min',
    serviceId: 'pedicure',
  },
];

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onSelectServiceById }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = SHOWCASE_SLIDES[currentSlideIndex];

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
  };

  const handleSlideAction = () => {
    if (currentSlide.serviceId && onSelectServiceById) {
      onSelectServiceById(currentSlide.serviceId);
    } else {
      onOpenBooking();
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 sm:pt-10 pb-16 lg:py-20">
      {/* Dynamic atmospheric lighting blobs */}
      <div className="absolute top-0 right-0 -mr-28 -mt-24 w-[480px] h-[480px] rounded-full bg-sage-200/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-28 -mb-28 w-[420px] h-[420px] rounded-full bg-amber-100/60 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-rose-100/30 blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Presentation */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Super Header Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-100/90 border border-sage-300 text-xs font-bold tracking-wider text-sage-900 uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Estudio de Uñas & Cuidado de Autor &bull; Venezuela</span>
            </div>

            {/* Main Title with Rich Contrast */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-warm-900 font-bold leading-[1.12] tracking-tight">
              Belleza, Estilo & <br />
              <span className="italic font-normal text-sage-700 underline decoration-amber-400/60 decoration-wavy decoration-1 underline-offset-8">
                Manos que hablan
              </span>
            </h1>

            {/* Author Intro */}
            <p className="text-base sm:text-lg text-warm-900 leading-relaxed font-normal max-w-xl">
              ¡Hola! Soy <strong className="text-sage-900 font-bold text-lg">Andrea Labrador</strong>, técnico especialista en el cuidado, nivelación y embellecimiento de tus uñas con <span className="font-bold text-sage-800 bg-sage-100 px-2 py-0.5 rounded-md">7 años de experiencia</span> profesional.
            </p>

            {/* Andrea's Philosophy Quote Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/95 border-l-4 border-sage-600 border-y border-r border-sage-200/90 shadow-soft backdrop-blur-md space-y-2">
              <p className="text-base sm:text-lg text-sage-900 font-serif italic font-medium leading-snug">
                &ldquo;Mi pasión es resaltar la belleza de tus manos y pies, priorizando siempre la salud, higiene y durabilidad de tu uña natural.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-warm-800 font-medium">
                Técnicas avanzadas: Nivelación anatómica con <strong className="text-sage-800">Rubber Base</strong>, extensiones ultraligeras en <strong className="text-sage-800">Jelly Tips</strong> y esculpido en <strong className="text-sage-800">Polygel</strong>.
              </p>
            </div>

            {/* Core Values / Bullet Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/60 border border-sage-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-warm-900">Salud uña natural</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/60 border border-sage-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-warm-900">Brillo 3+ semanas</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/60 border border-sage-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-warm-900">Bioseguridad total</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-sage-800 hover:bg-sage-900 text-white text-sm font-bold rounded-full shadow-luxury hover:shadow-soft transition-all transform active:scale-95 focus:ring-4 focus:ring-sage-300"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Reservar Cita en Línea</span>
              </button>

              <a
                href="#catalogo"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-sage-50 text-sage-900 text-sm font-bold rounded-full border border-sage-300 shadow-sm transition-all hover:border-sage-400"
              >
                <Palette className="w-4 h-4 text-sage-600" />
                <span>Ver Servicios & Precios</span>
              </a>
            </div>

            {/* Quick trust strip */}
            <div className="flex items-center gap-4 pt-1 text-xs text-warm-800 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sage-600" />
                Garantía en cada servicio
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-sage-300" />
              <span>Agenda privada 1 a 1</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sage-300" />
              <span>Pagos en USD o Bs</span>
            </div>

          </div>

          {/* Right Column: INTERACTIVE NAIL ART SHOWCASE CAROUSEL */}
          <div className="lg:col-span-5">
            <div 
              className="relative mx-auto max-w-md select-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {/* Outer decorative glow frame */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sage-300 to-amber-200 rounded-3xl transform rotate-2 scale-102 filter blur-md opacity-70 transition-all duration-700"></div>

              <div className="relative bg-white p-4 rounded-3xl shadow-luxury border border-sage-200/90 overflow-hidden">
                
                {/* Carousel Card Container */}
                <div className="overflow-hidden rounded-2xl aspect-[4/5] relative bg-sage-900 group">
                  
                  {/* Real Image of Current Slide */}
                  <img
                    key={currentSlide.id}
                    src={currentSlide.imageUrl}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-all duration-700 animate-fadeIn"
                    loading="eager"
                  />

                  {/* Gradient Overlay for Top Badges & Bottom Card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

                  {/* Top Header Tags */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                    <span className={`px-3 py-1 text-white text-[11px] font-bold tracking-wider uppercase rounded-full shadow-md flex items-center gap-1.5 ${currentSlide.badgeColor}`}>
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{currentSlide.badge}</span>
                    </span>

                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold rounded-full border border-white/20 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-300" />
                      <span>{currentSlide.duration}</span>
                    </span>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-sage-900 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-95 z-20"
                    title="Diseño anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-sage-900 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-95 z-20"
                    title="Siguiente diseño"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Bottom Info Card inside Image */}
                  <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-sage-100 shadow-luxury z-10">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600 block">
                          {currentSlide.category}
                        </span>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-warm-900 leading-tight">
                          {currentSlide.title}
                        </h3>
                        <p className="text-xs text-sage-700 font-semibold italic line-clamp-1">
                          {currentSlide.highlight}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-[10px] text-sage-600 font-bold block uppercase">Desde</span>
                        <span className="text-base sm:text-lg font-serif font-black text-sage-900">
                          ${currentSlide.priceUSD.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Interactive CTA button inside slide */}
                    <button
                      onClick={handleSlideAction}
                      className="mt-2.5 w-full py-2 bg-sage-800 hover:bg-sage-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-sm"
                    >
                      <span>{currentSlide.serviceId ? 'Agendar esta Técnica' : 'Reservar Cita con Andrea'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  </div>

                </div>

                {/* Interactive Thumbnail Carousel Strip */}
                <div className="mt-3 pt-2 border-t border-sage-100">
                  <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {SHOWCASE_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`flex-1 min-w-[42px] py-1.5 px-1 rounded-lg text-center transition-all ${
                          currentSlideIndex === idx
                            ? 'bg-sage-800 text-white shadow-sm ring-2 ring-sage-500 scale-105'
                            : 'bg-sage-50 hover:bg-sage-100 text-warm-800'
                        }`}
                        title={slide.title}
                      >
                        <span className="block text-[10px] font-bold truncate">
                          {idx === 0 ? 'Andrea' : slide.title.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Dots Progress Indicator */}
                  <div className="flex items-center justify-center gap-1.5 pt-2">
                    {SHOWCASE_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          currentSlideIndex === idx
                            ? 'w-6 bg-sage-700'
                            : 'w-2 bg-sage-200 hover:bg-sage-400'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Sub-banner Trust Stats */}
                <div className="mt-3 pt-2.5 border-t border-sage-100 flex items-center justify-around text-center">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-sage-600 font-bold">Experiencia</span>
                    <span className="text-xs sm:text-sm font-bold text-warm-900">7 Años</span>
                  </div>
                  <div className="w-px h-6 bg-sage-200"></div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-sage-600 font-bold">Retención</span>
                    <span className="text-xs sm:text-sm font-bold text-warm-900">3 Semanas</span>
                  </div>
                  <div className="w-px h-6 bg-sage-200"></div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-sage-600 font-bold">Técnica</span>
                    <span className="text-xs sm:text-sm font-bold text-warm-900">Rusa / Rígida</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
