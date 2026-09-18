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
    <header className="sticky top-0 z-40 bg-warm-100/98 backdrop-blur-lg border-b border-sage-200/80 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="#" className="flex flex-col group">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-sage-900 group-hover:text-sage-700 transition-colors">
            ANDREA LABRADOR
          </span>
          <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-sage-600 font-sans font-bold">
            Manicurista Profesional
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-bold text-warm-900">
          <a href="#catalogo" className="hover:text-sage-700 transition-colors">
            <span>Catálogo</span>
          </a>
          <a href="#promociones" className="hover:text-sage-700 transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Combos & Promos</span>
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
            <Gift className="w-3.5 h-3.5 text-amber-600" />
            <span>🎁 Regalo de Lanzamiento</span>
          </a>
          <a href="#politicas" className="hover:text-sage-700 transition-colors flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-sage-600" />
            <span>Políticas</span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Gift Shortcut */}
          <a
            href="/compartir"
            onClick={(e) => {
              if (onNavigateToShare) {
                e.preventDefault();
                onNavigateToShare();
              }
            }}
            className="md:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold"
            title="Club de Regalos"
          >
            <Gift className="w-3.5 h-3.5 text-amber-600" />
            <span>Regalo</span>
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
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-sage-800 hover:bg-sage-900 text-white text-xs sm:text-sm font-bold rounded-full shadow-soft hover:shadow-luxury transition-all transform active:scale-95"
          >
            <Calendar className="w-4 h-4 text-amber-300" />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>
    </header>
  );
};
