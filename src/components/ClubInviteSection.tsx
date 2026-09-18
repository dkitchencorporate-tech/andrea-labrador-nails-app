import React from 'react';
import { Gift, Sparkles, Heart } from 'lucide-react';

interface ClubInviteSectionProps {
  onNavigateToShare: () => void;
}

export const ClubInviteSection: React.FC<ClubInviteSectionProps> = ({ onNavigateToShare }) => {
  return (
    <section className="py-10 sm:py-14 bg-warm-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Solid luxury banner — bg-[#16291F] = deep sage green, fully opaque */}
        <div className="rounded-3xl bg-[#16291F] text-white border border-amber-300/50 shadow-luxury overflow-hidden">
          <div className="p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">

            {/* Nail art stack */}
            <div className="flex items-center justify-center shrink-0">
              <div className="flex items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-200/80 shadow-lg -mr-4 relative z-0">
                  <img src="/images/base-rubber.png" alt="Rubber Base" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white shadow-xl relative z-10">
                  <img src="/images/jelly-tips.jpg" alt="Jelly Tips" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-200/80 shadow-lg -ml-4 relative z-0">
                  <img src="/images/polygel-extensions.png" alt="Polygel" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                <Gift className="w-3 h-3 shrink-0" />
                <span>Especial de Lanzamiento Oficial</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-snug">
                Club Embajadora VIP{' '}
                <span className="italic font-normal text-amber-200">
                  — ¡Invita 2 Amigas &amp; Gana tu Manicura!
                </span>
              </h2>

              <p className="text-sm text-sage-200 leading-relaxed">
                Tus amigas reciben <strong className="text-white">$2 OFF o Nail Art Glaseado</strong> de cortesía.
                Cuando asistan a su 1ª cita,{' '}
                <strong className="text-amber-300">tu servicio es 100% GRATIS</strong>.
              </p>

              <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-sage-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>$2 OFF para tus amigas</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-sage-100">
                  <Heart className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                  <span>Tu manicura 100% Gratis</span>
                </div>
              </div>

              <button
                onClick={onNavigateToShare}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-sage-950 font-bold text-xs sm:text-sm rounded-full shadow-lg transition-all active:scale-95 mt-1"
              >
                <Gift className="w-4 h-4 shrink-0" />
                <span>🎁 Conocer el Club &amp; Obtener mi Pase VIP</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
