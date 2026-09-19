import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Sparkles, Smartphone, CheckCircle2 } from 'lucide-react';

export const PWAInstallModal: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (already installed)
    const isRunningStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsStandalone(isRunningStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Listen for beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android / Chromium native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalledSuccess(true);
        setTimeout(() => setInstalledSuccess(false), 3000);
      }
      setDeferredPrompt(null);
    } else {
      // iOS or browser without direct prompt support: show instruction modal
      setShowModal(true);
    }
  };

  // If already installed as PWA, do not show button
  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* ── BOTÓN DISCRETO / ELEGANTE EN ESQUINA INFERIOR O BANNER ── */}
      <div className="fixed bottom-20 left-4 z-40 sm:bottom-6 sm:left-6">
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#16291F] text-white hover:bg-sage-900 border border-amber-300/40 shadow-luxury transition-all text-xs font-bold active:scale-95 group"
          title="Instalar App en tu teléfono"
        >
          <div className="w-5 h-5 rounded-lg bg-amber-400 text-sage-950 flex items-center justify-center shrink-0">
            <Download className="w-3 h-3 stroke-[2.5]" />
          </div>
          <span className="hidden sm:inline">Descargar App</span>
          <span className="sm:hidden">App Móvil</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
        </button>
      </div>

      {/* ── MODAL DE INSTRUCCIONES (ESPECIAL PARA IPHONE / APPLE) ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-luxury border border-sage-200 overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-warm-400 hover:text-warm-900 hover:bg-sage-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with App Logo */}
            <div className="flex items-center gap-3 pr-6">
              <img
                src="/favicon-192x192.png"
                alt="Andrea Nails Logo"
                className="w-12 h-12 rounded-2xl border border-sage-200 shadow-sm object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Instalación PWA
                </span>
                <h3 className="font-serif text-lg font-bold text-warm-900 leading-tight">
                  Instala Andrea Nails en tu {isIOS ? 'iPhone / iPad' : 'Dispositivo'}
                </h3>
              </div>
            </div>

            <p className="text-xs text-warm-600 leading-relaxed">
              Disfruta del catálogo offline, acceso directo desde tu pantalla de inicio y reserva tus citas en un toque sin descargar nada desde App Store.
            </p>

            {/* Steps Guide */}
            <div className="space-y-3 bg-[#FBF9F6] p-4 rounded-2xl border border-sage-200 text-xs">
              
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#16291F] text-amber-200 font-serif font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold text-warm-900">
                    Toca el botón Compartir
                  </p>
                  <p className="text-warm-600 text-[11px] flex items-center gap-1.5 flex-wrap">
                    En la barra inferior de Safari, pulsa el ícono 
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-sage-200 font-bold text-sage-800">
                      <Share className="w-3 h-3" /> Compartir
                    </span>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 pt-2 border-t border-sage-200/60">
                <span className="w-6 h-6 rounded-full bg-[#16291F] text-amber-200 font-serif font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold text-warm-900">
                    Selecciona "Añadir a pantalla de inicio"
                  </p>
                  <p className="text-warm-600 text-[11px] flex items-center gap-1.5 flex-wrap">
                    Desliza hacia abajo en el menú y toca 
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-sage-200 font-bold text-sage-800">
                      <PlusSquare className="w-3 h-3" /> Añadir a inicio
                    </span>
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 pt-2 border-t border-sage-200/60">
                <span className="w-6 h-6 rounded-full bg-[#16291F] text-amber-200 font-serif font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold text-warm-900">
                    Confirma tocando "Añadir"
                  </p>
                  <p className="text-warm-600 text-[11px]">
                    En la esquina superior derecha, presiona "Añadir". ¡Listo! Ya tienes la app con el logo oficial en tu pantalla.
                  </p>
                </div>
              </div>

            </div>

            {/* Modal action */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 rounded-2xl bg-[#16291F] hover:bg-sage-900 text-white text-xs font-bold shadow-soft transition-all"
            >
              Entendido, voy a instalarla
            </button>

          </div>
        </div>
      )}

      {/* Success Notification toast */}
      {installedSuccess && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-800 text-white px-4 py-3 rounded-2xl shadow-luxury flex items-center gap-2 text-xs font-bold border border-emerald-500 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>¡App instalada con éxito en tu dispositivo!</span>
        </div>
      )}
    </>
  );
};
