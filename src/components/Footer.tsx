import React from 'react';
import { MessageCircle, Calendar } from 'lucide-react';
import { InstagramIcon } from './Icons';

interface FooterProps {
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  return (
    <footer className="bg-sage-900 text-warm-100 py-14 border-t border-sage-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Presentation */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="space-y-1">
              <span className="font-serif text-3xl font-bold tracking-wide text-white block">
                ANDREA LABRADOR
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold block">
                Manicurista Profesional
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sage-200/90 leading-relaxed max-w-sm">
              7 años dedicados al cuidado y embellecimiento de tus uñas en Venezuela. Especialista en nivelación con Base Rubber, Polygel y Jelly Tips, priorizando siempre la salud de tu uña natural.
            </p>
            
            {/* Social Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/584241360937"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm"
                title="WhatsApp Oficial"
              >
                <MessageCircle className="w-4 h-4" />
                <span>0424-1360937</span>
              </a>
              <a
                href="https://instagram.com/andrealabradorl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-sage-800 hover:bg-pink-600 text-white text-xs font-bold transition-all shadow-sm"
                title="Instagram Oficial"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>@andrealabradorl</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-300 block">
              Explorar
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-sage-200 font-medium">
              <li><a href="#catalogo" className="hover:text-white transition-colors">Catálogo de Servicios</a></li>
              <li><a href="#promociones" className="hover:text-white transition-colors">Combos & Promociones</a></li>
              <li><a href="#politicas" className="hover:text-white transition-colors">Políticas del Estudio</a></li>
              <li>
                <button onClick={onOpenBooking} className="text-amber-300 hover:text-white transition-colors flex items-center gap-1 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agendar Cita en Línea</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Working Hours & Location */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-300 block">
              Horario de Atención
            </span>
            <div className="p-4 bg-sage-800/90 rounded-2xl border border-sage-700 space-y-2 text-xs text-sage-200">
              <div className="flex justify-between">
                <span>Lunes a Sábado:</span>
                <span className="font-bold text-white">09:00 AM – 06:00 PM</span>
              </div>
              <div className="flex justify-between border-t border-sage-700 pt-1.5">
                <span>Domingos:</span>
                <span className="text-rose-300 font-semibold">Cerrado (Descanso)</span>
              </div>
              <div className="border-t border-sage-700 pt-1.5 text-[11px] text-sage-300">
                📍 Atención exclusiva bajo previa cita agendada en Venezuela.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sage-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sage-400">
          <p>
            &copy; {new Date().getFullYear()} Andrea Labrador &bull; Todos los derechos reservados.
          </p>
          <p className="text-sage-400 text-xs">
            Venezuela &bull; Cuidado Integral de Uñas
          </p>
        </div>

      </div>
    </footer>
  );
};
