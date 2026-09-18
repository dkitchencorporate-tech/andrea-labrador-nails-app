import React from 'react';
import { Gift, ArrowRight, Sparkles, Heart, Users } from 'lucide-react';

interface ClubInviteSectionProps {
  onNavigateToShare: () => void;
}

export const ClubInviteSection: React.FC<ClubInviteSectionProps> = ({ onNavigateToShare }) => {
  return (
    <section className="py-10 sm:py-16 bg-warm-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Visual Luxury Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sage-900 via-sage-850 to-sage-950 text-white border border-amber-300/40 shadow-luxury">
          
          {/* Subtle Golden Glow Effects */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Visual Nail Art Previews */}
            <div className="lg:col-span-5 flex flex-col items-center sm:items-start space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-300/20 border border-amber-300/40 text-amber-200 text-xs font-bold uppercase tracking-wider">
                <Gift className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                <span>Especial de Lanzamiento</span>
              </div>

              {/* Overlapping Nail Showcase */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-200/80 shadow-luxury transform -rotate-3 hover:rotate-0 transition-transform">
                  <img 
                    src="/images/base-rubber.png" 
                    alt="Nivelación Rubber Base" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white shadow-luxury z-10 transform scale-105">
                  <img 
                    src="/images/jelly-tips.jpg" 
                    alt="Extensiones Jelly Tips" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-200/80 shadow-luxury transform rotate-3 hover:rotate-0 transition-transform">
                  <img 
                    src="/images/polygel-extensions.png" 
                    alt="Polygel Extensions" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <p className="text-[11px] text-sage-300 italic text-center sm:text-left">
                ✨ Diseños de autor, cutícula rusa y uña natural saludable.
              </p>
            </div>

            {/* Right Column: High Converting Offer & CTA */}
            <div className="lg:col-span-7 space-y-4 text-center sm:text-left">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                ¿Quieres tu próxima manicura <br />
                <span className="text-amber-200 italic font-normal">
                  100% GRATIS con Andrea?
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-sage-200 leading-relaxed max-w-xl">
                Celebramos la llegada de nuestra app oficial con el <strong>Club Embajadora VIP</strong>: regala un Pase de Bienvenida con <strong>$2 USD de descuento o Nail Art gratis</strong> a 2 amigas. Cuando asistan a su primera cita, tu próximo servicio completo corre por nuestra cuenta.
              </p>

              {/* Perks Highlights */}
              <div className="grid grid-cols-2 gap-2 max-w-md pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-sage-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>$2 OFF para tus amigas</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-sage-100 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>Tu manicura 100% Gratis</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={onNavigateToShare}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-sage-950 font-bold text-xs sm:text-sm rounded-full shadow-luxury hover:shadow-soft transition-all transform active:scale-95"
                >
                  <Gift className="w-4 h-4 text-sage-900" />
                  <span>Conocer el Club & Obtener Pase</span>
                  <ArrowRight className="w-4 h-4 text-sage-900" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
