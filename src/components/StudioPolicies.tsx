import React from 'react';
import { Clock, UserX, ShieldAlert, Sparkles, HeartHandshake } from 'lucide-react';

export const StudioPolicies: React.FC = () => {
  return (
    <section id="politicas" className="py-16 bg-white border-t border-sage-200/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-semibold tracking-[0.2em] text-sage-600 uppercase font-sans">
            Normas de Convivencia y Cuidado
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-warm-900 font-semibold">
            Políticas del Estudio
          </h2>
          <div className="w-12 h-0.5 bg-gold-400 mx-auto"></div>
          <p className="text-xs sm:text-sm text-warm-800/80">
            Para garantizar la máxima calidad en cada set y brindarte una experiencia relajante y segura, te pido considerar lo siguiente:
          </p>
        </div>

        {/* 3 Policies Grid matching PDF */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Puntualidad */}
          <div className="p-6 sm:p-7 rounded-3xl bg-warm-50 border border-sage-200/80 shadow-soft hover:shadow-luxury transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-200/70 text-sage-800 flex items-center justify-center">
              <Clock className="w-6 h-6 text-sage-700" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-bold text-warm-900">
                Puntualidad Absoluta
              </h3>
              <p className="text-xs sm:text-sm text-warm-800/85 leading-relaxed">
                Por respeto al tiempo de todas las clientas, es indispensable llegar a la hora pautada. Contamos con un margen máximo de 10 minutos para proteger la calidad de tu servicio y el de la siguiente cita.
              </p>
            </div>
          </div>

          {/* 2. Asistencia Individual */}
          <div className="p-6 sm:p-7 rounded-3xl bg-warm-50 border border-sage-200/80 shadow-soft hover:shadow-luxury transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-200/70 text-sage-800 flex items-center justify-center">
              <UserX className="w-6 h-6 text-sage-700" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-bold text-warm-900">
                Asistencia Sin Acompañantes
              </h3>
              <p className="text-xs sm:text-sm text-warm-800/85 leading-relaxed">
                Para mantener un espacio relajante, enfocado y sin interrupciones ni riesgos con material químico profesional, por favor asiste a tu cita individualmente sin acompañantes ni niños.
              </p>
            </div>
          </div>

          {/* 3. Bioseguridad */}
          <div className="p-6 sm:p-7 rounded-3xl bg-warm-50 border border-sage-200/80 shadow-soft hover:shadow-luxury transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-200/70 text-sage-800 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-sage-700" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-bold text-warm-900">
                Bioseguridad & Salud
              </h3>
              <p className="text-xs sm:text-sm text-warm-800/85 leading-relaxed">
                Por estrictas normas de higiene preventiva y salud pública, no se atiende a personas que presenten patologías ungueales activas, micosis o sospecha de hongos. La salud de tu uña es siempre primero.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
