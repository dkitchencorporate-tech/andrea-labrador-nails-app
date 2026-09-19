import React from 'react';
import { Calendar, Sparkles, Shield, MessageCircle, Gift } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onNavigateToShare?: () => void;
  exchangeRate: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onNavigateToShare,
  exchangeRate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F6] border-b border-sage-200/80 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand / Logo - Responsive and Non-wrapping */}
        <a href="#" className="flex items-center gap-2 group shrink-0">
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sage-800 text-amber-200 font-serif font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs">
            AL
          </span>
          <div className="flex flex-col">
            <span className="font-serif text-base sm:text-2xl font-bold tracking-tight text-sage-900 group-hover:text-sage-700 transition-colors leading-tight">
              Andrea Labrador
            </span>
            <span className="text-[8px] sm:text-[10px] tracking-[0.2em] uppercase text-sage-600 font-sans font-bold leading-none">
              Manicurista Profesional
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-bold text-warm-900">
          <a href="#catalogo" className="hover:text-sage-700 transition-colors">
            <span>Catálogo</span>
          </a>
          <a 
            href="/compartir" 
            onClick={(e) => {
              if (onNavigateToShare) {
                e.preventDefault();
                onNavigateToShare();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition-all border border-amber-300 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>⭐ Fidelización: 10+1 &amp; $2 OFF</span>
          </a>
          <a href="#politicas" className="hover:text-sage-700 transition-colors flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-sage-600" />
            <span>Políticas</span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Loyalty Shortcut */}
          <a
            href="/compartir"
            onClick={(e) => {
              if (onNavigateToShare) {
                e.preventDefault();
                onNavigateToShare();
              }
            }}
            className="md:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold shadow-xs active:scale-95"
            title="Programa de Fidelización"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Fidelidad</span>
          </a>

          {/* Exchange rate indicator pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-sage-100 rounded-full border border-sage-200 text-xs text-sage-900 font-sans font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>$1 = {exchangeRate.toFixed(2)} Bs</span>
          </div>

          {/* Direct WhatsApp chat */}
          <a
            href="https://wa.me/584241360937?text=Hola%20Andrea!%20Deseo%20hacerte%20una%20consulta%20sobre%20tus%20servicios"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-all shadow-sm"
            title="Chat directo con Andrea Labrador"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>0424-1360937</span>
          </a>

          {/* Book Appointment CTA Button */}
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2.5 bg-sage-800 hover:bg-sage-900 text-white text-xs sm:text-sm font-bold rounded-full shadow-soft hover:shadow-luxury transition-all transform active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Agendar Cita</span>
            <span className="sm:hidden">Cita</span>
          </button>
        </div>
      </div>
    </header>
  );
};
