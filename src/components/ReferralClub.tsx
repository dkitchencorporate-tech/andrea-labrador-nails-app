import React, { useState } from 'react';
import { 
  Gift, 
  Share2, 
  Users, 
  Sparkles, 
  Check, 
  Copy, 
  MessageCircle, 
  Heart, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

interface ReferralClubProps {
  onOpenBooking: () => void;
  isStandalonePage?: boolean;
}

export const ReferralClub: React.FC<ReferralClubProps> = ({ 
  onOpenBooking,
  isStandalonePage = false 
}) => {
  const [referrerName, setReferrerName] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'invite' | 'rules'>('invite');

  // Sanitize name for clean slug
  const cleanName = referrerName.trim().replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, '') || 'Amiga';
  const referralCode = `AL-${cleanName.toUpperCase().slice(0, 10).replace(/\s+/g, '')}`;
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://andrea-labrador-nails-app.vercel.app';
  const referralLink = `${baseUrl}/?ref=${encodeURIComponent(cleanName)}`;

  const whatsappMessage = `¡Hola bella! 💅✨ Te comparto el nuevo catálogo oficial de Andrea Labrador (mi manicurista).

Por lanzamiento de su nueva app oficial nos dieron un *Pase VIP de Bienvenida*: al agendar tu primera cita desde mi enlace recibes *$2 USD de regalo* o un *Nail Art Glaseado de Cortesía*.

Reserva tu cita desde aquí para que se active tu regalo:
${referralLink} 💕`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pase VIP Andrea Labrador Nails',
          text: whatsappMessage,
          url: referralLink,
        });
      } catch (err) {
        console.log('Share canceled or not supported');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <section id="compartir" className={`relative overflow-hidden ${isStandalonePage ? 'py-8 sm:py-16' : 'py-12 sm:py-20'} bg-[#FBF9F6] border-t border-sage-200/80`}>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        
        {/* Top Visual Nail Art Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-luxury border border-amber-300/40">
          <img 
            src="/images/banner-club-regalo.jpg" 
            alt="Club Embajadora VIP Andrea Labrador Nails"
            className="w-full h-auto object-cover max-h-[360px]"
            loading="eager"
          />
        </div>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Gift className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span>Edición Especial de Lanzamiento</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-900 tracking-tight leading-tight">
            Club Embajadora VIP: <br />
            <span className="italic font-normal text-sage-800">
              Comparte & Gana tu Manicura Gratis
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-warm-700 leading-relaxed max-w-xl mx-auto">
            Celebramos la llegada de nuestra app oficial en Venezuela con un beneficio mutuo: obsequia un pase VIP a 2 amigas y, al venir a su primera cita, tu próximo servicio es <strong>100% GRATIS</strong>.
          </p>
        </div>

        {/* 3 Step Visual Cards with Real Nail Imagery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-3xl border border-sage-200/80 shadow-soft hover:shadow-luxury transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-sage-100 text-sage-900 font-bold flex items-center justify-center text-xs font-serif">
                  01
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Paso 1
                </span>
              </div>
              <div className="h-28 rounded-2xl overflow-hidden border border-sage-100">
                <img 
                  src="/images/esmaltado-semipermanente.png" 
                  alt="Genera tu Pase" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <h3 className="font-serif text-lg font-bold text-warm-900">
                Genera tu Pase VIP
              </h3>
              <p className="text-xs text-warm-600 leading-relaxed">
                Escribe tu nombre abajo y crea tu enlace exclusivo. Solo por compartirlo hoy recibes un <strong>Bono de Hidratación Spa</strong> en tu próxima cita.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-3xl border border-sage-200/80 shadow-soft hover:shadow-luxury transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs font-serif">
                  02
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Paso 2
                </span>
              </div>
              <div className="h-28 rounded-2xl overflow-hidden border border-sage-100">
                <img 
                  src="/images/jelly-tips.jpg" 
                  alt="Tus amigas ganan" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <h3 className="font-serif text-lg font-bold text-warm-900">
                Tus Amigas Ganan
              </h3>
              <p className="text-xs text-warm-600 leading-relaxed">
                Tus 2 amigas reciben <strong>$2 USD de descuento</strong> o un <strong>Nail Art de Tendencia de Cortesía</strong> en su primera cita al reservar desde tu enlace.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-300 shadow-soft hover:shadow-luxury transition-all flex flex-col justify-between group bg-gradient-to-br from-white to-emerald-50/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-xs font-serif">
                  03
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 font-semibold">
                  Premio Final
                </span>
              </div>
              <div className="h-28 rounded-2xl overflow-hidden border border-emerald-200">
                <img 
                  src="/images/base-rubber.png" 
                  alt="Manicura 100% Gratis" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <h3 className="font-serif text-lg font-bold text-emerald-950">
                Tú Ganas Manicura Gratis
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Al asistir tus 2 amigas a su primera cita, tu próximo <strong>Esmaltado Semipermanente o Mantenimiento Rubber</strong> corre 100% por cuenta del estudio.
              </p>
            </div>
          </div>

        </div>

        {/* Interactive Pass Generator & High-Contrast VIP Card */}
        <div className="bg-white rounded-3xl border border-sage-200 shadow-luxury p-5 sm:p-8 max-w-2xl mx-auto space-y-6">
          
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold tracking-wider text-sage-900">
              1. Escribe tu nombre (para personalizar el pase de tus amigas)
            </label>
            <input
              type="text"
              placeholder="Ejemplo: Camila, Valeria, Sofía..."
              value={referrerName}
              onChange={(e) => setReferrerName(e.target.value)}
              maxLength={25}
              className="w-full p-3.5 bg-warm-50 border border-sage-300 rounded-2xl text-sm font-semibold text-warm-900 focus:ring-2 focus:ring-sage-500 focus:outline-none transition-all"
            />
            <p className="text-[11px] text-warm-600">
              Tus amigas verán que tú les estás regalando este beneficio oficial.
            </p>
          </div>

          {/* HIGH CONTRAST LUXURY VIRTUAL CARD */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#14221A] text-white border-2 border-amber-400/50 shadow-luxury space-y-4 relative overflow-hidden">
            
            {/* Top Header of Card */}
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="font-serif text-xs sm:text-sm tracking-wider uppercase text-[#FDF2D6] font-bold">
                  PASE VIP DE LANZAMIENTO
                </span>
              </div>
              <span className="text-[11px] font-mono bg-amber-400/25 text-amber-200 px-3 py-0.5 rounded-full font-bold border border-amber-300/40">
                {referralCode}
              </span>
            </div>

            {/* Referrer Name */}
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-sage-300 font-semibold block">
                Cortesía exclusiva de:
              </span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {cleanName}
              </p>
            </div>

            {/* Nail Art Micro Showcase Inside Card */}
            <div className="flex items-center gap-2 py-1">
              <span className="text-[10px] text-sage-300 font-semibold uppercase tracking-wider">Incluye:</span>
              <div className="flex items-center gap-1.5">
                <img src="/images/base-rubber.png" alt="Nail sample" className="w-7 h-7 rounded-full object-cover border border-amber-200" />
                <img src="/images/jelly-tips.jpg" alt="Nail sample" className="w-7 h-7 rounded-full object-cover border border-amber-200" />
                <img src="/images/polygel-extensions.png" alt="Nail sample" className="w-7 h-7 rounded-full object-cover border border-amber-200" />
              </div>
              <span className="text-[11px] text-amber-200 font-medium ml-auto">Técnicas de Autor</span>
            </div>

            {/* High Contrast Benefit Box */}
            <div className="p-3 bg-black/40 rounded-xl border border-white/20 text-xs flex items-center justify-between text-white">
              <span className="font-semibold text-sage-100">🎁 Regalo de bienvenida:</span>
              <span className="font-bold text-amber-300 text-sm">$2 OFF o Nail Art Glaseado</span>
            </div>

            {/* Bottom Details with High Contrast */}
            <div className="text-[11px] text-sage-200 flex items-center justify-between pt-1 border-t border-white/15">
              <span>Válido en 1ª cita agendada</span>
              <span className="text-amber-200 font-bold">Andrea Labrador &bull; Manicurista</span>
            </div>

          </div>

          {/* 1-Tap Sharing Actions */}
          <div className="space-y-3 pt-1">
            <label className="block text-xs uppercase font-bold tracking-wider text-sage-900">
              2. Comparte con tus Amigas en 1 Clic
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp Share Button */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm shadow-soft transition-all transform active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Compartir por WhatsApp</span>
              </a>

              {/* Copy Link Button */}
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-warm-100 hover:bg-sage-100 border border-sage-300 text-warm-900 font-bold text-xs sm:text-sm transition-all active:scale-98"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">¡Enlace Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-sage-700" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>
            </div>

            {/* Native Mobile Share */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full py-2 text-xs text-sage-800 hover:text-sage-950 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-sage-600" />
                <span>Más opciones (Telegram, Instagram Direct, etc.)</span>
              </button>
            )}
          </div>

          {/* Transparent Rules Accordion */}
          <div className="pt-3 border-t border-sage-100">
            <div className="flex items-center justify-between text-xs text-warm-600">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
                Transparente, sin sorteos ni costos ocultos.
              </span>
              <button
                onClick={() => setActiveTab(activeTab === 'rules' ? 'invite' : 'rules')}
                className="text-sage-800 hover:text-sage-950 font-bold underline text-xs"
              >
                {activeTab === 'rules' ? 'Ocultar' : 'Ver reglas'}
              </button>
            </div>

            {activeTab === 'rules' && (
              <div className="mt-3 p-3.5 bg-sage-50 rounded-xl text-xs text-warm-700 space-y-1.5 border border-sage-200/80 animate-fadeIn">
                <p className="font-bold text-sage-900">Condiciones del Programa:</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-warm-600">
                  <li>Aplica cuando 2 amigas nuevas agenden su primera cita a través de tu enlace y asistan a su servicio.</li>
                  <li>El regalo de manicura para ti incluye Esmaltado Semipermanente o Mantenimiento Rubber (o $10 de saldo para Polygel / Jelly Tips).</li>
                  <li>Tus amigas reciben $2 de descuento directo o Nail Art glaseado de cortesía en su cita.</li>
                  <li>Válido durante la temporada de lanzamiento oficial en Venezuela.</li>
                </ul>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
