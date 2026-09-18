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
    <section id="compartir" className={`relative overflow-hidden ${isStandalonePage ? 'py-12 sm:py-20' : 'py-16 sm:py-24'} bg-gradient-to-b from-warm-100 via-sage-50/50 to-warm-100 border-t border-sage-200/80`}>
      
      {/* Background Subtle Elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-sage-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Badge & Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Gift className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span>Especial Lanzamiento App Oficial</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-900 tracking-tight leading-tight">
            Club Embajadora VIP: <br />
            <span className="italic font-normal text-sage-800">
              Comparte & Gana tu Manicura Gratis
            </span>
          </h2>

          <p className="text-sm sm:text-base text-warm-700 leading-relaxed">
            Celebramos el lanzamiento de nuestra app en Venezuela con un regalo mutuo: invita a 2 amigas y, cuando asistan a su primera cita, tu próximo servicio es <strong>100% GRATIS</strong>.
          </p>
        </div>

        {/* 3 Steps Visual Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-sage-200/80 shadow-soft hover:shadow-luxury transition-all relative overflow-hidden group">
            <div className="w-10 h-10 rounded-2xl bg-sage-100 text-sage-800 font-bold flex items-center justify-center mb-4 text-sm font-serif">
              01
            </div>
            <h3 className="font-serif text-lg font-bold text-warm-900 mb-1.5">
              Genera tu Pase VIP
            </h3>
            <p className="text-xs sm:text-sm text-warm-600 leading-relaxed">
              Escribe tu nombre abajo y crea tu enlace personal. Además, solo por compartirlo hoy recibes un <strong>Bono de Hidratación Spa</strong> en tu próxima visita.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-sage-200/80 shadow-soft hover:shadow-luxury transition-all relative overflow-hidden group">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center mb-4 text-sm font-serif">
              02
            </div>
            <h3 className="font-serif text-lg font-bold text-warm-900 mb-1.5">
              Tus Amigas Ganan
            </h3>
            <p className="text-xs sm:text-sm text-warm-600 leading-relaxed">
              Tus 2 amigas reciben <strong>$2 USD de descuento</strong> o un <strong>Nail Art de Tendencia de Cortesía</strong> en su primera cita al reservar desde tu enlace.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-300 shadow-soft hover:shadow-luxury transition-all relative overflow-hidden group bg-gradient-to-br from-white to-emerald-50/40">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white font-bold flex items-center justify-center mb-4 text-sm font-serif">
              03
            </div>
            <h3 className="font-serif text-lg font-bold text-emerald-900 mb-1.5">
              Tú Ganas Manicura Gratis
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
              Una vez que tus 2 amigas asistan a su primera cita, tu próximo <strong>Esmaltado Semipermanente o Mantenimiento Rubber</strong> corre por nuestra cuenta (100% Gratis).
            </p>
          </div>

        </div>

        {/* Interactive Pass Generator & Sharing Hub */}
        <div className="bg-white rounded-3xl border border-sage-200 shadow-luxury p-6 sm:p-10 max-w-3xl mx-auto">
          
          <div className="space-y-6">
            
            <div className="space-y-2">
              <label className="block text-xs uppercase font-bold tracking-wider text-sage-800">
                1. ¿Cómo te llamas? (Para personalizar el regalo de tus amigas)
              </label>
              <input
                type="text"
                placeholder="Ejemplo: Camila, Valeria, Sofia..."
                value={referrerName}
                onChange={(e) => setReferrerName(e.target.value)}
                maxLength={30}
                className="w-full p-4 bg-warm-50 border border-sage-200 rounded-2xl text-sm font-semibold text-warm-900 focus:ring-2 focus:ring-sage-500 focus:outline-none transition-all"
              />
              <p className="text-[11px] text-warm-500">
                Tus amigas verán que tú les estás obsequiando este pase VIP oficial.
              </p>
            </div>

            {/* Virtual VIP Pass Preview */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-sage-900 via-sage-850 to-sage-950 text-white border border-amber-300/40 shadow-soft space-y-4 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="font-serif text-sm tracking-wider uppercase text-amber-200 font-bold">
                    Pase VIP de Lanzamiento
                  </span>
                </div>
                <span className="text-[11px] font-mono bg-amber-300/20 text-amber-200 px-2.5 py-0.5 rounded-full font-bold border border-amber-300/30">
                  {referralCode}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-sage-300 uppercase tracking-widest block font-medium">
                  Cortesía exclusiva de:
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {cleanName}
                </p>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs text-sage-100 flex items-center justify-between">
                <span>🎁 Regalo para tus amigas:</span>
                <span className="font-bold text-amber-200">$2 OFF o Nail Art Glaseado</span>
              </div>

              <div className="text-[11px] text-sage-300 flex items-center justify-between pt-1">
                <span>Válido en primera cita agendada</span>
                <span className="text-amber-200 font-semibold">Andrea Labrador &bull; Manicurista</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs uppercase font-bold tracking-wider text-sage-800">
                2. Comparte tu Pase con tus Amigas en 1 Clic
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp Share Button */}
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-soft hover:shadow-luxury transition-all transform active:scale-98"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Compartir por WhatsApp</span>
                </a>

                {/* Copy Link Button */}
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-warm-100 hover:bg-sage-100 border border-sage-300 text-warm-900 font-bold text-xs sm:text-sm transition-all active:scale-98"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">¡Enlace Copiado al Portapapeles!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-sage-700" />
                      <span>Copiar Enlace de Regalo</span>
                    </>
                  )}
                </button>
              </div>

              {/* Native mobile share if supported */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 text-xs text-sage-700 hover:text-sage-900 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Más opciones (Telegram, Instagram Direct, etc.)</span>
                </button>
              )}
            </div>

            {/* Reassurance & Terms Accordion */}
            <div className="pt-4 border-t border-sage-100">
              <div className="flex items-center justify-between text-xs text-warm-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-sage-600" />
                  Transparente, sin sorteos confusos ni costos ocultos.
                </span>
                <button
                  onClick={() => setActiveTab(activeTab === 'rules' ? 'invite' : 'rules')}
                  className="text-sage-700 hover:text-sage-900 font-bold underline"
                >
                  {activeTab === 'rules' ? 'Ocultar detalles' : 'Ver cómo funciona'}
                </button>
              </div>

              {activeTab === 'rules' && (
                <div className="mt-3 p-4 bg-sage-50/70 rounded-xl text-xs text-warm-700 space-y-2 border border-sage-200/60 animate-fadeIn">
                  <p className="font-bold text-sage-900">Condiciones del Programa de Lanzamiento:</p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-warm-600">
                    <li>Aplica cuando 2 amigas nuevas agenden su primera cita a través de tu enlace y asistan a su servicio.</li>
                    <li>El regalo de manicura para ti incluye Esmaltado Semipermanente o Mantenimiento Rubber (o $10 de saldo para Polygel / Jelly Tips).</li>
                    <li>Tus amigas reciben $2 de descuento directo o Nail Art glaseado de cortesía en su cita.</li>
                    <li>Válido durante la temporada de lanzamiento de la app oficial en Venezuela.</li>
                  </ul>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Floating Call to Action to Book */}
        {!isStandalonePage && (
          <div className="text-center pt-10">
            <p className="text-xs text-warm-600 mb-2">
              ¿Aún no tienes tu propia cita reservada?
            </p>
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage-800 hover:bg-sage-900 text-white rounded-full text-xs font-bold shadow-soft transition-all"
            >
              <span>Agendar mi Cita Primero</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
