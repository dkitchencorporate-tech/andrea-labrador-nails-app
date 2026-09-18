import React from 'react';
import { Calendar, Sparkles, Shield, Heart, Lock, MessageCircle, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  onToggleAdmin: () => void;
  isAdminOpen: boolean;
  exchangeRate: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onToggleAdmin,
  isAdminOpen,
  exchangeRate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-warm-100/90 backdrop-blur-md border-b border-sage-200/60 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="#" className="flex flex-col group">
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-wide text-sage-900 group-hover:text-sage-700 transition-colors">
            ANDREA LABRADOR
          </span>
          <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-sage-600 font-sans font-medium">
            Manicurista Profesional
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-warm-800">
          <a href="#catalogo" className="hover:text-sage-600 transition-colors flex items-center gap-1">
            <span>Catálogo</span>
          </a>
          <a href="#promociones" className="hover:text-sage-600 transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>Promos</span>
          </a>
          <a href="#politicas" className="hover:text-sage-600 transition-colors flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-sage-500" />
            <span>Políticas</span>
          </a>
          <a href="#club-vip" className="hover:text-sage-600 transition-colors flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Club VIP</span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Exchange rate indicator pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-sage-100/80 rounded-full border border-sage-200 text-xs text-sage-800 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>$1 = {exchangeRate.toFixed(2)} Bs / USDT</span>
          </div>

          {/* Direct WhatsApp chat */}
          <a
            href="https://wa.me/584241360937?text=Hola%20Andrea!%20Deseo%20hacerte%20una%20consulta%20sobre%20tus%20servicios"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-sage-800 bg-white hover:bg-sage-50 border border-sage-200 rounded-full transition-all shadow-sm"
            title="Chat directo con Andrea Labrador"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>

          {/* Book Appointment CTA Button */}
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-sage-700 hover:bg-sage-800 text-warm-50 text-xs sm:text-sm font-medium rounded-full shadow-soft hover:shadow-luxury transition-all transform active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Cita</span>
          </button>

          {/* Internal Admin Toggle */}
          <button
            onClick={onToggleAdmin}
            className={`p-2 rounded-full border transition-all ${
              isAdminOpen
                ? 'bg-sage-900 text-white border-sage-900'
                : 'bg-white hover:bg-sage-50 text-sage-700 border-sage-200 shadow-sm'
            }`}
            title="Panel Administrativo Interno"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
