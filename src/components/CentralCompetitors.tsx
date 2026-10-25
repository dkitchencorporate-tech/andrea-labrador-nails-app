import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  BookOpen,
  MessageCircle,
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';

interface CompetitorData {
  id: string;
  name: string;
  domain: string;
  category: 'Marketplace Parásito' | 'CXP Luxury Corporativo' | 'Software Indie' | 'Legacy';
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  combatArgument: string;
  targetMarket: string;
  status: 'Auditoría Completa' | 'En Seguimiento';
}

const COMPETITORS_DATABASE: CompetitorData[] = [
  {
    id: 'fresha',
    name: 'Fresha (ex-Shedul)',
    domain: 'fresha.com',
    category: 'Marketplace Parásito',
    pricing: 'Aparente 0€/mes, pero 20% + IVA por cada clienta nueva que reserva + 2.19% por transacción',
    strengths: [
      'Marca masiva muy reconocida por el público final',
      'Gran directorio de búsqueda en ciudades grandes',
      'Cero coste de entrada inicial que seduce a dueñas novatas'
    ],
    weaknesses: [
      'Modelo parásito: Las clientas pertenecen a Fresha, no al salón',
      'Fresha muestra salones de la competencia justo al lado de tu perfil',
      'Cero identidad de autor: Todos los salones lucen exactamente iguales',
      'No tiene Tarjeta VIP de 5 sellos vinculada al WhatsApp del negocio',
      'No permite QR Dinámico personalizable en acrílicos de mesa'
    ],
    combatArgument: 'Fresha parece gratis hasta que calculas el 20% que te quitan de cada clienta nueva. Si atiendes 150 clientas al mes a 25$, estás perdiendo más de 400$ mensuales regalados a Fresha, mientras ellos le sugieren tu competencia a tus clientas. En VANESEV pagas una cuota fija de 29$ o 59$, el 100% de tus ingresos es tuyo y tu marca es sagrada.',
    targetMarket: 'Salones medianos y peluquerías en España y Latam que caen en la trampa del marketplace',
    status: 'Auditoría Completa'
  },
  {
    id: 'boulevard',
    name: 'Boulevard (BLVD)',
    domain: 'joinblvd.com',
    category: 'CXP Luxury Corporativo',
    pricing: '175$ a 450$ USD / mes + hardware propietario',
    strengths: [
      'Excelente Self-Booking Overlay que se abre sobre la web del salón',
      'Algoritmo de precisión para tiempos de secado y tintes sin huecos muertos',
      'Diseño ultra pulido y premium para medspas de alta gama en EE.UU.'
    ],
    weaknesses: [
      'Precios astronómicos inalcanzables para salones independientes y en Latam',
      'Configuración extremadamente compleja que requiere semanas de onboarding',
      'Solo opera en EE.UU. y con pasarelas estadounidenses (sin Zelle, Pago Móvil o Binance)',
      'No cuenta con PWA ligera instalable con 1 toque sin pasar por tiendas'
    ],
    combatArgument: 'Boulevard es el estándar de lujo en Beverly Hills o Nueva York, pero cuesta 350$ al mes y no entiende la realidad de pagos locales, Zelle o WhatsApp en nuestro mercado. VANESEV ofrece esa misma altura de experiencia estética de autor, sincronización multi-cabina y elegancia editorial, pero llave en mano en 24 horas y con métodos de pago nativos.',
    targetMarket: 'Medspas, clínicas estéticas y salones de lujo',
    status: 'Auditoría Completa'
  },
  {
    id: 'glossgenius',
    name: 'GlossGenius',
    domain: 'glossgenius.com',
    category: 'Software Indie',
    pricing: '24$ a 48$ USD / mes + comisiones de procesamiento de tarjeta',
    strengths: [
      'Estética chic y de alta moda pensada para estilistas modernas',
      'Datáfonos físicos muy atractivos para el mostrador de cobro',
      'Fácil configuración móvil para manicuristas que trabajan solas'
    ],
    weaknesses: [
      'Falla completamente cuando el salón crece a 5-10 colaboradoras con cabinas compartidas',
      'No tiene módulo formativo para Academias y venta de cursos certificados',
      'Plantillas cerradas con poca capacidad de personalización radical de autor',
      'No incluye motor de QR vectorial editable sin re-impresión'
    ],
    combatArgument: 'GlossGenius es genial para una estilista independiente que renta una silla en EE.UU., pero cuando tienes un estudio integral con cejas, uñas, estilismo y academia (como Capra Studio), necesitas gestión de cabinas sin solapamiento, liquidación de comisiones de equipo y cursos certificados. Ahí es donde VANESEV no tiene rival.',
    targetMarket: 'Manicuristas y lashistas individuales en EE.UU.',
    status: 'Auditoría Completa'
  },
  {
    id: 'treatwell',
    name: 'Treatwell',
    domain: 'treatwell.es',
    category: 'Marketplace Parásito',
    pricing: 'Cuota de alta + comisiones del 15% al 25% por cliente nuevo',
    strengths: [
      'Líder en España y varios países europeos',
      'Software de gestión Connect integrado con agenda'
    ],
    weaknesses: [
      'Comisiones asfixiantes que comen el margen operativo del salón',
      'Diseño rígido y aburrido: no puedes transmitir la vibra única de tu marca',
      'Las clientas sienten que le compran a Treatwell, nunca al estilista',
      'Burocracia pesada para altas y cobros'
    ],
    combatArgument: 'En Treatwell eres solo una fila más en un directorio con cientos de peluquerías compitiendo por precio a la baja. En VANESEV tienes tu propia aplicación de autor, donde tus clientas entran por recomendación o por tu Instagram/TikTok y descubren una marca de culto sin que nadie les robe la atención.',
    targetMarket: 'Salones tradicionales en España',
    status: 'Auditoría Completa'
  },
  {
    id: 'mangomint',
    name: 'Mangomint',
    domain: 'mangomint.com',
    category: 'CXP Luxury Corporativo',
    pricing: '$165 a $375 USD / mes + costos adicionales por módulos de marketing y formularios',
    strengths: [
      'Flujos "invisible software" muy rápidos sin recargas de página (Express Booking)',
      'Interfaz cálida y limpia que huye del aspecto frío de software médico antiguo',
      'Automatizaciones sólidas para salones de más de 10 estilistas en Norteamérica'
    ],
    weaknesses: [
      'No está diseñado para salones con menos de 5 especialistas (su propio sitio lo advierte)',
      'Precio prohibitivo ($165-$375/mes) para salones en Latinoamérica y estudios independientes',
      'No soporta bimonetarismo automático (USD / Bs BCV / COP) ni cobros por Zelle o Pago Móvil',
      'No ofrece Carta Digital de Autor con identidad visual propia ni módulo de Academia'
    ],
    combatArgument: 'Mangomint tiene una velocidad de interfaz admirable, pero cuesta desde $165 USD al mes y ellos mismos descartan a estudios boutique de 1 a 4 especialistas. Con VANESEV obtienes esa misma fluidez instantánea, más una Carta Digital de Autor diseñada a la medida de tu salón, pasaporte de 5 sellos y soporte nativo para WhatsApp y multimoneda desde $29 USD/mes.',
    targetMarket: 'Salones grandes y spas de 10 a 30 empleados en EE.UU. y Canadá',
    status: 'Auditoría Completa'
  },
  {
    id: 'agendapro',
    name: 'AgendaPro',
    domain: 'agendapro.com',
    category: 'Legacy',
    pricing: '$29 a $115 USD / mes + cobros extra por recordatorios de WhatsApp y facturación',
    strengths: [
      'Amplia presencia comercial en Latinoamérica (Chile, México, Colombia)',
      'Módulos administrativos contables e inventario básico probados'
    ],
    weaknesses: [
      'El portal donde reserva la clienta luce como un formulario médico genérico de hace 10 años',
      'Cero diferenciación estética: una barbería de autor, un spa y un podólogo se ven idénticos',
      'No tiene pasaporte de fidelidad visual interactivo ni QR dinámico con telemetría',
      'Penaliza el crecimiento cobrando por cantidad de usuarios en vez de capacidad operativa clara'
    ],
    combatArgument: 'AgendaPro sirve para llevar cuentas internas, pero de cara a tu clienta proyecta una imagen fría de consultorio genérico que apaga el deseo de compra. En belleza la estética vende: VANESEV te da el control administrativo en la nube, pero hacia afuera viste a tu salón como una firma de lujo con carta interactiva propia y club de fidelidad.',
    targetMarket: 'Centros estéticos y consultorios en Latinoamérica',
    status: 'Auditoría Completa'
  }
];

export const CentralCompetitors: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<CompetitorData>(COMPETITORS_DATABASE[0]);
  const [search, setSearch] = useState('');

  const filtered = COMPETITORS_DATABASE.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* ══ HEADER DE INTELIGENCIA DE GUERRA ══ */}
      <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-800 border border-amber-200">
              Estrategia Comercial &amp; Cierre de Ventas
            </span>
            <span className="text-xs text-slate-500 font-mono">Actualizado Octubre 2026</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#0F172A]">
            Radar de Competidores: Virtudes, Trampas y Argumentos de Cierre
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Herramienta interna para auditar el software del mercado, capacitar a nuestro equipo comercial y cerrar salones demostrando por qué VANESEV es superior en diseño de autor y economía sin comisiones.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar competidor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* ══ MATRIZ DE COMPARACIÓN RÁPIDA ══ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filtered.map((comp) => {
          const isSelected = selectedComp.id === comp.id;
          return (
            <button
              key={comp.id}
              onClick={() => setSelectedComp(comp)}
              className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-50/90 border-amber-500 shadow-sm ring-1 ring-amber-500/20'
                  : 'bg-white hover:bg-slate-50 border-[#E2E8F0] shadow-xs'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-700">{comp.category}</span>
                <span className="text-[10px] text-slate-400 font-mono">{comp.domain}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0F172A]">{comp.name}</h3>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{comp.pricing}</p>
            </button>
          );
        })}
      </div>

      {/* ══ FICHA TÉCNICA DETALLADA DEL COMPETIDOR SELECCIONADO ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="lg:col-span-7 space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <div className="flex items-center gap-2 text-xs text-amber-700 font-mono mb-1">
              <span>Auditando: {selectedComp.name}</span>
              <span>&bull;</span>
              <a
                href={`https://${selectedComp.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline text-slate-500"
              >
                <span>{selectedComp.domain}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <h3 className="text-3xl font-serif font-black text-[#0F172A]">{selectedComp.name}</h3>
            <div className="mt-2 text-xs text-slate-700 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
              <strong className="text-amber-800">Modelo de Precios:</strong> {selectedComp.pricing}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Virtudes */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Virtudes de su Producto
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedComp.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desventajas Críticas */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                Puntos Débiles (Donde les Ganamos)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedComp.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">&bull;</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ══ SCRIPT DE GUERRA & ARGUMENTO DE CIERRE ══ */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 border border-amber-300/80 p-6 rounded-2xl space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              Script de Cierre contra {selectedComp.name}
            </span>
            <h4 className="text-lg font-serif font-bold text-[#0F172A]">
              ¿Qué decirle a la dueña del salón cuando te mencione este competidor?
            </h4>
            <div className="p-4 rounded-xl bg-white border border-amber-200 text-xs text-slate-800 leading-relaxed italic shadow-2xs">
              "{selectedComp.combatArgument}"
            </div>
          </div>

          <div className="pt-3 border-t border-amber-200/60 text-[11px] text-slate-600 space-y-1">
            <div>
              <strong className="text-slate-800">Público Objetivo:</strong> {selectedComp.targetMarket}
            </div>
            <div className="text-emerald-700 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Factor Decisivo VANESEV: PWA de Autor + 0% Comisiones + Tarjeta VIP 5 Sellos.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
