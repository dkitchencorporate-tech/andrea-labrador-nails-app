import React from 'react';
import { MessageCircle, Heart, Lock, Calendar, Sparkles } from 'lucide-react';
import { InstagramIcon } from './Icons';

interface FooterProps {
  onToggleAdmin: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onToggleAdmin, onOpenBooking }) => {
  return (
    <footer className="bg-sage-900 text-warm-100 py-16 border-t border-sage-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Presentation */}
          <div className="md:col-span-5 space-y-4">
            <div className="space-y-1">
              <span className="font-serif text-3xl font-bold tracking-wide text-white block">
                ANDREA LABRADOR
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
                Manicurista Profesional
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sage-200/80 leading-relaxed max-w-sm">
              7 años dedicados a perfeccionar el arte del cuidado ungueal y la alta estética en Venezuela. Especialista en nivelación Rubber, Polygel y Jelly Tips priorizando la salud de tu uña natural.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/584241360937"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sage-800 hover:bg-emerald-600 text-white flex items-center justify-center transition-all shadow-sm"
                title="WhatsApp Oficial"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/andrealabradorl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sage-800 hover:bg-pink-600 text-white flex items-center justify-center transition-all shadow-sm"
                title="Instagram Oficial"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-gold-400 block">
              Explorar
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-sage-200/90 font-medium">
              <li><a href="#catalogo" className="hover:text-white transition-colors">Catálogo de Servicios</a></li>
              <li><a href="#promociones" className="hover:text-white transition-colors">Combos & Promociones</a></li>
              <li><a href="#politicas" className="hover:text-white transition-colors">Políticas del Estudio</a></li>
              <li><a href="#club-vip" className="hover:text-white transition-colors">Tarjeta VIP de Fidelización</a></li>
              <li>
                <button onClick={onOpenBooking} className="text-gold-300 hover:text-white transition-colors flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reservar Turno en Línea</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Working Hours & Location */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-gold-400 block">
              Horario de Atención Privada
            </span>
            <div className="p-4 bg-sage-800/80 rounded-2xl border border-sage-700/80 space-y-2 text-xs text-sage-200">
              <div className="flex justify-between">
                <span>Lunes a Sábado:</span>
                <span className="font-bold text-white">09:00 AM – 06:00 PM</span>
              </div>
              <div className="flex justify-between border-t border-sage-700/60 pt-1.5">
                <span>Domingos:</span>
                <span className="text-rose-300 font-semibold">Cerrado (Descanso)</span>
              </div>
              <div className="border-t border-sage-700/60 pt-1.5 text-[11px] text-sage-300">
                📍 Atención exclusiva bajo previa cita agendada.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sage-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sage-400">
          <p>
            &copy; {new Date().getFullYear()} Andrea Labrador &bull; Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onToggleAdmin}
              className="text-sage-400 hover:text-gold-400 transition-colors flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acceso Administradora</span>
            </button>
            <span>&bull;</span>
            <span className="text-[11px]">Diseño de Alta Costura Digital</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
