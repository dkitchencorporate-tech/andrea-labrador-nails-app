import React from 'react';
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
  Terminal,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface VanesevLandingProps {
  onOpenCentral: () => void;
  onSelectTenant: (slug: 'andrea-nails' | 'capra-studio') => void;
}

export const VanesevLanding: React.FC<VanesevLandingProps> = ({
  onOpenCentral,
  onSelectTenant,
}) => {
  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#F5F2EB] font-sans selection:bg-[#C5A059] selection:text-[#0B0D11] overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0D11]/90 backdrop-blur-xl px-3 sm:px-8 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#8C6D2F] flex items-center justify-center text-[#0B0D11] font-serif font-black text-base sm:text-lg shadow-lg shrink-0">
              V7
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base sm:text-lg tracking-wide text-white">
                  VANESEV
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#C5A059]/20 text-[#E5C158] border border-[#C5A059]/40 shrink-0">
                  Cloud SaaS Suite · Venezuela
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/50 truncate">
                vanesev.com &bull; Catálogos PWA, Agenda &amp; Fidelización Multi-Salón
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap pb-0.5 sm:pb-0">
            <button
              onClick={() => onSelectTenant('capra-studio')}
              className="px-3 py-1.5 sm:py-2 rounded-xl bg-[#B5838D]/20 hover:bg-[#B5838D]/30 text-[#F2D5DC] border border-[#B5838D]/40 text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              Ver Demo: Capra Studio
            </button>
            <button
              onClick={() => onSelectTenant('andrea-nails')}
              className="px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              Ver Flagship: Andrea Nails V2
            </button>
            <button
              onClick={onOpenCentral}
              className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0B0D11] text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Entrar a VANESEV Central</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Editorial */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#C5A059]/40 text-[#E5C158] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ingeniería de Autor para Salones de Belleza, Nails, Barberías &amp; Academias</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-[1.08] tracking-tight text-white">
              Transforma tu Salón en una{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C158] via-[#C5A059] to-[#F3E5AB]">
                Plataforma Digital VIP
              </span>{' '}
              con Base de Datos en Vivo.
            </h1>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">
              Olvídate de perder citas en WhatsApp o llevar cuentas en cuadernos.{' '}
              <strong className="text-white">VANESEV</strong> equipa a tu salón en Venezuela con su propio subdominio{' '}
              <code className="text-[#E5C158]">tusalon.vanesev.com</code>, catálogo interactivo en USD y Bolívares (Tasa BCV/Binance),
              agenda inteligente por especialista y cabina, y tarjeta digital de fidelización de 5 sellos.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTenant('capra-studio')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#B5838D] to-[#C5A059] text-[#0B0D11] font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Explorar Capra Studio (Nuevo Cliente)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectTenant('andrea-nails')}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Explorar Andrea Labrador Nails V2</span>
                <ExternalLink className="w-4 h-4 text-[#E5C158]" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs">
              <div>
                <span className="font-serif text-2xl font-bold text-[#E5C158] block">100% Cloud</span>
                <span className="text-white/50">Neon Postgres 18 + Vercel Blob</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-[#E5C158] block">Multi-Zona</span>
                <span className="text-white/50">Especialistas, Cabinas y Cursos</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-[#E5C158] block">Bimoneda VE</span>
                <span className="text-white/50">USD, Pago Móvil Bs &amp; Binance</span>
              </div>
            </div>
          </div>

          {/* Live Showcase Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#23191E] to-[#130E11] border border-[#B5838D]/40 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#B5838D]/25 text-[#F4D8DF] border border-[#B5838D]/50">
                  Caso Real · Multi-Departamento + Academia
                </span>
                <span className="text-xs font-mono text-[#E5C158]">caprastudio.vanesev.com</span>
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Capra Studio · By María Capra
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  6 Zonas operativas en BD: Cejas y Pestañas, Estilismo y Alisados, Maquillaje Profesional, Manicure y Pedicure, Depilación Corporal y Capra Academy.
                </p>
              </div>
              <button
                onClick={() => onSelectTenant('capra-studio')}
                className="w-full py-3 rounded-xl bg-[#B5838D] hover:bg-[#c6939d] text-[#0B0D11] font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Abrir App de Capra Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#13221B] to-[#0B1410] border border-emerald-500/30 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Flagship VIP Vitalicio
                </span>
                <span className="text-xs font-mono text-emerald-300">andrealabrador.vanesev.com</span>
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Andrea Labrador Nails Studio V2
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  Catálogo de autor, Ficha VIP sincronizada en vivo con Neon Postgres, Tarjeta de 5 Sellos unificada y Panel Admin Pro V2 con Equipo y Zonas.
                </p>
              </div>
              <button
                onClick={() => onSelectTenant('andrea-nails')}
                className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#0B1410] font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Abrir App de Andrea Labrador V2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Arquitectura de 4 Zonas */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#E5C158]">
            Arquitectura Cloud Multi-Tenant
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Las 4 Zonas del Ecosistema VANESEV
          </h2>
          <p className="text-xs sm:text-sm text-white/60">
            Cada salón opera aislado con su propia identidad visual, catálogo, equipo y clientela sobre Neon Postgres 18.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              zone: 'ZONA 1',
              title: 'Web Comercial SaaS',
              sub: 'vanesev.com',
              desc: 'Escaparate ejecutivo para captar nuevos salones, estudios de uñas, barberías y academias en toda Venezuela.',
              icon: Globe,
            },
            {
              zone: 'ZONA 2',
              title: 'VANESEV Central',
              sub: 'vanesev.com/central',
              desc: 'Centro de mando exclusivo para gobernanza de sesiones, auditoría de cambios, buzón de emergencias y subdominios.',
              icon: ShieldCheck,
            },
            {
              zone: 'ZONA 3',
              title: 'Admin Pro V2 del Salón',
              sub: '[salon].vanesev.com/?admin=1',
              desc: 'Panel gerencial del salón con agenda multi-especialista, zonas/cabinas en BD, analítica USD/Bs y CRM.',
              icon: Layers,
            },
            {
              zone: 'ZONA 4',
              title: 'App PWA & Ficha Clienta VIP',
              sub: '[salon].vanesev.com',
              desc: 'Experiencia móvil de lujo para agendar en 1 toque, consultar estado de citas en vivo y sumar 5 sellos VIP.',
              icon: Smartphone,
            },
          ].map((item) => (
            <div key={item.zone} className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#E5C158] bg-[#C5A059]/15 px-2.5 py-1 rounded-full">
                  {item.zone}
                </span>
                <item.icon className="w-5 h-5 text-[#E5C158]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">{item.title}</h3>
              <p className="text-[11px] font-mono text-white/40">{item.sub}</p>
              <p className="text-xs text-white/70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
