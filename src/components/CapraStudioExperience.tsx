import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Phone,
  Award,
  Users,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Star,
  ChevronRight,
  MapPin,
  DollarSign,
  Gift,
  ArrowRight
} from 'lucide-react';
import { ServiceItem } from '../types';

interface CapraStudioExperienceProps {
  services: ServiceItem[];
  exchangeRate: number;
  onOpenBooking: (service?: ServiceItem) => void;
  onOpenAccountModal: () => void;
}

const CAPRA_CATEGORIES = [
  { id: 'all', label: 'Todos los Servicios' },
  { id: 'cejas_pestanas', label: 'Cejas & Pestañas' },
  { id: 'estilismo_alisados', label: 'Estilismo & Alisados' },
  { id: 'maquillaje', label: 'Maquillaje Pro & Quinceañeras' },
  { id: 'manicure_pedicure', label: 'Manicure Jellytips & Pies' },
  { id: 'depilacion', label: 'Depilación Corporal' },
  { id: 'cursos', label: '🎓 Capra Academy' },
];

export const CapraStudioExperience: React.FC<CapraStudioExperienceProps> = ({
  services,
  exchangeRate,
  onOpenBooking,
  onOpenAccountModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.tags && s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#2D1E22] font-sans selection:bg-[#B5838D]/30 selection:text-[#2D1E22] flex flex-col">
      {/* ══ STICKY LUXURY NAVBAR DE CAPRA STUDIO ══ */}
      <header className="sticky top-0 z-40 bg-[#FDFBF9]/95 backdrop-blur-md border-b border-[#B5838D]/25 px-4 sm:px-8 py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#B5838D] via-[#C88A98] to-[#8E5B66] border-2 border-[#C5A059] flex items-center justify-center text-white font-serif font-black text-base sm:text-lg shadow-md shrink-0">
              CS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg tracking-tight text-[#2D1E22]">
                  Capra Studio
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#B5838D]/15 text-[#8E5B66] border border-[#B5838D]/35">
                  By María Capra
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#6E5359]">
                Salón de Belleza Integral &amp; Capra Academy &bull; San Cristóbal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAccountModal}
              className="px-3 sm:px-4 py-2 rounded-full bg-[#F6EEF0] hover:bg-[#EAD8DC] text-[#5C3A42] border border-[#B5838D]/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Mi Ficha VIP</span>
              <span className="hidden sm:inline text-[10px] text-[#8E5B66]">(5 Sellos)</span>
            </button>
            <button
              onClick={() => onOpenBooking()}
              className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#B5838D] to-[#8E5B66] hover:brightness-105 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#B5838D]/25 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#F5E6C8]" />
              <span>Agendar Cita</span>
            </button>
          </div>
        </div>
      </header>

      {/* ══ HERO EDITORIAL CAPRA (AUTÉNTICO: ROSA TERCIOPELO, ORO Y CRISTAL) ══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F9F0F3] via-[#FDFBF9] to-[#F7EFF1] py-14 sm:py-20 px-4 sm:px-8 border-b border-[#B5838D]/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B5838D]/15 border border-[#B5838D]/35 text-[#7A4953] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>@caprastudio_ · Belleza, Cosmética &amp; Cuidado de Autor</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2D1E22] leading-[1.12] tracking-tight">
              Nos complace ser parte de tu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9E6370] via-[#B5838D] to-[#C5A059]">
                embellecimiento y armonía perfecta.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#5C4348] leading-relaxed max-w-xl">
              Bienvenida al estudio de <strong>María Giovanna Capra</strong>. Disfruta de nuestras <strong>6 áreas especializadas</strong> en
              un ambiente de relajación y lujo femenino, o capacítate como profesional certificada en nuestra <strong>Capra Academy</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onOpenBooking()}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#B5838D] to-[#8E5B66] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#B5838D]/25 hover:brightness-105 cursor-pointer transition-all"
              >
                <Calendar className="w-4 h-4 text-[#F5E6C8]" />
                <span>Reservar Cita en Capra Studio</span>
              </button>
              <a
                href="https://wa.me/584247429530?text=%C2%A1Hola%20Capra%20Studio!%20%E2%9C%A8%20Vengo%20desde%20su%20App%20Oficial%20y%20deseo%20informaci%C3%B3n%20sobre%20citas%20y%20cursos."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full bg-white hover:bg-[#F6EEF0] text-[#2D1E22] border border-[#B5838D]/40 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Directo: +58 424-7429530</span>
              </a>
            </div>

            {/* Los 6 Departamentos Reales */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4">
              {[
                { title: 'Cejas & Pestañas', desc: 'Glance Henna, Brow Lamination & Lifting' },
                { title: 'Estilismo & Alisados', desc: 'Cirugía Capilar, Ondas & Secado' },
                { title: 'Maquillaje Pro 👑', desc: 'Social, Novias & Quinceañeras' },
                { title: 'Manicure & Pedicure', desc: 'Jellytips Rojo Carmín & Rusa' },
                { title: 'Depilación Corporal', desc: 'Cabina Climatizada con Cera Suave' },
                { title: '🎓 Capra Academy', desc: 'Cursos Certificados Teórico-Prácticos' },
              ].map((zone) => (
                <div
                  key={zone.title}
                  className="p-3 rounded-2xl bg-white/90 border border-[#B5838D]/25 shadow-2xs"
                >
                  <span className="font-serif font-bold text-xs text-[#2D1E22] block">
                    {zone.title}
                  </span>
                  <span className="text-[10px] text-[#6E5359] leading-tight block mt-0.5">
                    {zone.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta de Lujo Derecha: Identidad Capra VIP */}
          <div className="lg:col-span-5">
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2D1E22] via-[#3B262C] to-[#1F1417] text-white border-2 border-[#C5A059]/60 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#E5C158] font-bold block">
                    Salón &amp; Academia de Autor
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Capra Studio VIP
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#E5C158] font-serif font-black text-xl">
                  CS
                </div>
              </div>

              <div className="space-y-3 text-xs text-white/85">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Clock className="w-4 h-4 text-[#E5C158] shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Horario de Atención</span>
                    <span>Lunes a Sábado: 9:00 AM – 6:00 PM (Previa Cita)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <MapPin className="w-4 h-4 text-[#E5C158] shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Ubicación</span>
                    <span>San Cristóbal, Estado Táchira, Venezuela</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Award className="w-4 h-4 text-[#E5C158] shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Club VIP 5 Sellos Capra</span>
                    <span>5 citas verificadas = Depilación de Cejas o Hidratación Capilar GRATIS</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenAccountModal}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C158] text-[#1F1417] font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all hover:brightness-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Consultar Mi Tarjeta de 5 Sellos</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CATÁLOGO EXCLUSIVO CAPRA STUDIO ══ */}
      <section id="catalogo-capra" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto space-y-10 flex-1">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] text-[#8E5B66] uppercase">
            Catálogo de Servicios &amp; Cursos
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#2D1E22] font-bold">
            Elige tu momento de belleza
          </h3>
          <div className="w-16 h-0.5 bg-[#B5838D] mx-auto" />
          <p className="text-sm text-[#5C4348]">
            Explora nuestros tratamientos de autor en cejas, pestañas, peluquería, maquillaje y formación profesional:
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {CAPRA_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#B5838D] to-[#8E5B66] text-white shadow-md shadow-[#B5838D]/25 font-black'
                  : 'bg-white hover:bg-[#F6EEF0] text-[#5C3A42] border border-[#B5838D]/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-3xl bg-white border border-[#B5838D]/25 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#B5838D]/15 text-[#8E5B66] border border-[#B5838D]/30">
                    {service.badgeText || 'Capra Studio'}
                  </span>
                  <span className="text-xs font-mono text-[#6E5359] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{service.durationMinutes} min</span>
                  </span>
                </div>

                <h4 className="font-serif text-xl font-bold text-[#2D1E22] group-hover:text-[#8E5B66] transition-colors">
                  {service.name}
                </h4>

                <p className="text-xs text-[#5C4348] leading-relaxed">
                  {service.fullDescription || service.shortDescription}
                </p>

                {service.idealFor && (
                  <div className="p-2.5 rounded-xl bg-[#FBF6F7] border border-[#B5838D]/20 text-[11px] text-[#7A4953] flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#B5838D] shrink-0 fill-current" />
                    <span>{service.idealFor}</span>
                  </div>
                )}
              </div>

              <div className="p-6 pt-0 border-t border-[#B5838D]/15 mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6E5359] block">Inversión</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-2xl font-bold text-[#2D1E22]">
                      ${service.priceUSD.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#6E5359]">
                      ({(service.priceUSD * exchangeRate).toFixed(0)} Bs)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenBooking(service)}
                  className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#B5838D] to-[#8E5B66] hover:brightness-105 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agendar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ POLÍTICAS & MÉTODOS DE PAGO DE CAPRA STUDIO ══ */}
      <section className="bg-[#F8F1F3] py-14 px-4 sm:px-8 border-t border-[#B5838D]/25">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Métodos de Pago */}
          <div className="p-6 rounded-3xl bg-white border border-[#B5838D]/25 space-y-4">
            <div className="flex items-center gap-2.5 text-[#2D1E22]">
              <DollarSign className="w-5 h-5 text-[#C5A059]" />
              <h4 className="font-serif font-bold text-lg">Métodos de Pago Aceptados</h4>
            </div>
            <p className="text-xs text-[#5C4348]">
              Aceptamos pagos en Bolívares y Dólares con total comodidad:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FBF6F7] border border-[#B5838D]/20">
                <strong className="block text-[#2D1E22]">Pago Móvil (Bs)</strong>
                <span className="text-[10px] text-[#6E5359]">Tasa BCV del día</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FBF6F7] border border-[#B5838D]/20">
                <strong className="block text-[#2D1E22]">Efectivo ($ / Bs)</strong>
                <span className="text-[10px] text-[#6E5359]">Directo en el local</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FBF6F7] border border-[#B5838D]/20">
                <strong className="block text-[#2D1E22]">Binance Pay (USDT)</strong>
                <span className="text-[10px] text-[#6E5359]">Sin comisiones</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FBF6F7] border border-[#B5838D]/20">
                <strong className="block text-[#2D1E22]">Zelle / Transferencia</strong>
                <span className="text-[10px] text-[#6E5359]">Banesco &amp; Mercantil</span>
              </div>
            </div>
          </div>

          {/* Políticas del Estudio */}
          <div className="p-6 rounded-3xl bg-white border border-[#B5838D]/25 space-y-4">
            <div className="flex items-center gap-2.5 text-[#2D1E22]">
              <ShieldCheck className="w-5 h-5 text-[#B5838D]" />
              <h4 className="font-serif font-bold text-lg">Políticas de Atención y Citas</h4>
            </div>
            <ul className="space-y-2 text-xs text-[#5C4348]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B5838D] shrink-0 mt-0.5" />
                <span><strong>Tolerancia de 15 minutos:</strong> Agradecemos puntualidad para respetar el turno de la siguiente clienta.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B5838D] shrink-0 mt-0.5" />
                <span><strong>Cancelaciones:</strong> Notificar con al menos 24 horas de antelación vía WhatsApp.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B5838D] shrink-0 mt-0.5" />
                <span><strong>Cursos Capra Academy:</strong> Se aparta el cupo con el 50% de anticipo.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ══ FOOTER CAPRA STUDIO ══ */}
      <footer className="bg-[#23171B] text-white py-10 px-4 sm:px-8 border-t border-[#B5838D]/40 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#B5838D] text-white font-serif font-bold text-sm flex items-center justify-center">
              CS
            </div>
            <div>
              <span className="font-serif font-bold text-white text-base block">Capra Studio</span>
              <span className="text-[10px] text-white/50">By María Giovanna Capra &bull; San Cristóbal, Táchira</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://instagram.com/caprastudio_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E5C158] hover:underline"
            >
              Instagram @caprastudio_
            </a>
            <span className="text-white/20">&bull;</span>
            <a
              href="https://wa.me/584247429530"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              WhatsApp +58 424-7429530
            </a>
          </div>

          <span className="text-[10px] text-white/40">
            Plataforma Oficial de Autor &bull; Impulsada por VANESEV Cloud
          </span>
        </div>
      </footer>
    </div>
  );
};
