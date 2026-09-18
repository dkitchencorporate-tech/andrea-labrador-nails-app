import React from 'react';
import { Sparkles, Calendar, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20">
      {/* Subtle organic background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sage-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Presentation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-100 border border-sage-200 text-xs font-semibold tracking-wider text-sage-800 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Estudio de Uñas & Cuidado Profesional</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-warm-900 font-semibold leading-[1.15] tracking-tight">
              Belleza, Estilo & <br />
              <span className="italic font-normal text-sage-700">Manos que hablan</span>
            </h1>

            <p className="text-base sm:text-lg text-warm-800/85 leading-relaxed max-w-xl">
              ¡Hola! Soy <strong className="text-sage-900 font-semibold">Andrea Labrador</strong>, técnico especialista en el cuidado y embellecimiento de tus uñas con <span className="font-semibold text-sage-800">7 años de experiencia</span> en este rubro.
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-sage-200/80 shadow-soft backdrop-blur-sm space-y-2">
              <p className="text-sm sm:text-base text-warm-900 font-serif italic text-sage-800">
                &ldquo;Mi pasión es resaltar la belleza de tus manos y pies, priorizando siempre la salud de tu uña natural.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-warm-800/80">
                Técnicas de vanguardia, nivelación anatómica con Rubber Base y esculpido en Polygel para resultados impecables y duraderos.
              </p>
            </div>

            {/* Core Values / Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-warm-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Salud uña natural</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-warm-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Brillo hasta 3 semanas</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-warm-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Higiene y bioseguridad</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-sage-800 hover:bg-sage-900 text-warm-50 text-sm font-semibold rounded-full shadow-luxury hover:shadow-soft transition-all transform active:scale-95"
              >
                <Calendar className="w-4 h-4 text-gold-400" />
                <span>Reservar Cita en Línea</span>
              </button>

              <a
                href="#catalogo"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-sage-50 text-sage-800 text-sm font-semibold rounded-full border border-sage-200 shadow-sm transition-all"
              >
                <span>Ver Servicios y Precios</span>
              </a>
            </div>
          </div>

          {/* Right Column: Editorial Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              {/* Decorative Frame */}
              <div className="absolute inset-0 bg-sage-400/20 rounded-3xl transform rotate-2 scale-102 filter blur-sm"></div>
              
              <div className="relative bg-white p-4 rounded-3xl shadow-luxury border border-sage-200/80">
                <div className="overflow-hidden rounded-2xl aspect-[4/5] relative bg-sage-100">
                  <img
                    src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop"
                    alt="Andrea Labrador Manicura Profesional"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  {/* Floating Luxury Tag */}
                  <div className="absolute top-4 left-4 bg-warm-900/85 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-md">
                    <Award className="w-3.5 h-3.5 text-gold-400" />
                    <span>7 Años de Experiencia</span>
                  </div>

                  <div className="absolute bottom-4 inset-x-4 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-sage-100 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-sage-600 font-semibold">Técnicas Exclusivas</p>
                        <p className="text-sm font-serif font-bold text-warm-900">Jelly Tips &bull; Polygel &bull; Rubber</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-sage-700 font-medium">Desde</span>
                        <p className="text-lg font-bold text-sage-900 font-serif">$10 USD</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-banner trust badges */}
                <div className="mt-4 pt-3 border-t border-sage-100 flex items-center justify-around text-center">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-sage-600 font-medium">Agenda</span>
                    <span className="text-sm font-bold text-sage-900">Citas Privadas</span>
                  </div>
                  <div className="w-px h-8 bg-sage-200"></div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-sage-600 font-medium">Garantía</span>
                    <span className="text-sm font-bold text-sage-900">3 Semanas</span>
                  </div>
                  <div className="w-px h-8 bg-sage-200"></div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-sage-600 font-medium">Ubicación</span>
                    <span className="text-sm font-bold text-sage-900">Venezuela</span>
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
