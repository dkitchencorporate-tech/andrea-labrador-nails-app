import React from 'react';
import { Clock, ShieldCheck, Heart } from 'lucide-react';

export const StudioPolicies: React.FC = () => {
  return (
    <section id="politicas" className="py-16 bg-white border-t border-sage-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold tracking-[0.2em] text-sage-700 uppercase font-sans">
            Cuidado & Convivencia
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-warm-900 font-bold">
            Políticas del Estudio
          </h2>
          <div className="w-12 h-0.5 bg-sage-400 mx-auto"></div>
          <p className="text-sm text-warm-900 font-normal">
            Para garantizar la calidad de mi trabajo y brindarte el mejor ambiente, te pido considerar lo siguiente:
          </p>
        </div>

        {/* 3 Warm Authentic Policies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Puntualidad */}
          <div className="p-6 rounded-3xl bg-sage-50/80 border border-sage-200/90 shadow-soft hover:shadow-luxury transition-all space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sage-700 text-white flex items-center justify-center shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-bold text-warm-900">
                Puntualidad
              </h3>
              <p className="text-sm text-warm-900 leading-relaxed font-normal">
                Por respeto al tiempo de todas, es indispensable llegar a la hora pautada. Contamos con 10 minutos de tolerancia para realizar tu servicio con toda la dedicación que mereces.
              </p>
            </div>
          </div>

          {/* 2. Bioseguridad */}
          <div className="p-6 rounded-3xl bg-sage-50/80 border border-sage-200/90 shadow-soft hover:shadow-luxury transition-all space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sage-700 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-bold text-warm-900">
                Bioseguridad & Salud
              </h3>
              <p className="text-sm text-warm-900 leading-relaxed font-normal">
                Por estrictas normas de higiene y prevención, no atiendo a personas con patologías o sospecha de hongos. La salud y bienestar de tu uña natural es siempre primero.
              </p>
            </div>
          </div>

          {/* 3. Confort & Relajación (Sutil) */}
          <div className="p-6 rounded-3xl bg-sage-50/80 border border-sage-200/90 shadow-soft hover:shadow-luxury transition-all space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sage-700 text-white flex items-center justify-center shadow-sm">
              <Heart className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-bold text-warm-900">
                Tu Momento de Relax
              </h3>
              <p className="text-sm text-warm-900 leading-relaxed font-normal">
                Para brindarte una experiencia exclusiva de spa y desconexión, te sugerimos asistir individualmente a tu cita. Si requieres venir acompañada o con pequeños, con gusto avísame previamente por WhatsApp para coordinarlo.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
