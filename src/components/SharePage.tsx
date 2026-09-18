import React from 'react';
import { ReferralClub } from './ReferralClub';
import { ArrowLeft, Sparkles, MessageCircle } from 'lucide-react';

interface SharePageProps {
  onOpenBooking: () => void;
  onExitToCatalog: () => void;
  exchangeRate: number;
}

export const SharePage: React.FC<SharePageProps> = ({
  onOpenBooking,
  onExitToCatalog,
  exchangeRate,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-warm-100 text-warm-900 font-sans selection:bg-sage-200">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-warm-100/98 backdrop-blur-md border-b border-sage-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <button
            onClick={onExitToCatalog}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sage-900 hover:text-sage-700 transition-colors py-2 px-3 rounded-full hover:bg-sage-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo</span>
          </button>

          <a href="#" onClick={(e) => { e.preventDefault(); onExitToCatalog(); }} className="flex flex-col items-center group">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-sage-900 group-hover:text-sage-700 transition-colors">
              ANDREA LABRADOR
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-sage-600 font-sans font-bold">
              Manicurista Profesional
            </span>
          </a>

          <button
            onClick={onOpenBooking}
            className="px-4 py-2 bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold rounded-full shadow-soft transition-all"
          >
            <span>Agendar Cita</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24">
        <ReferralClub onOpenBooking={onOpenBooking} isStandalonePage={true} />
      </main>

      {/* Simplified Footer */}
      <footer className="bg-sage-900 text-warm-100 py-10 border-t border-sage-800 text-center text-xs text-sage-300">
        <div className="max-w-3xl mx-auto px-4 space-y-3">
          <p className="font-serif text-lg font-bold text-white">ANDREA LABRADOR &bull; NAILS</p>
          <p className="text-sage-300 text-xs">
            Programa de Lanzamiento Oficial &bull; Venezuela
          </p>
          <p className="text-sage-400 text-[11px] pt-2">
            &copy; {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
};
