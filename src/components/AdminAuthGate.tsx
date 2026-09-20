import React, { useState } from 'react';
import { AppStore } from '../services/store';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface AdminAuthGateProps {
  onAuthenticated: (email: string) => void;
  onExit: () => void;
}

type GateView = 'login' | 'two_factor' | 'request_reset' | 'confirm_reset';

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onAuthenticated, onExit }) => {
  const [view, setView] = useState<GateView>('login');
  const [email, setEmail] = useState('andrea.labrador.nails@gmail.com');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ─── PASO 1: VALIDAR CREDENCIALES (GMAIL + CONTRASEÑA) ────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await AppStore.loginAdminRemote(email.trim(), password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Credenciales inválidas.');
      return;
    }

    if (res.requires2FA) {
      setMaskedEmail(res.maskedEmail || email);
      if (res.demo2FACode) setDemoCode(res.demo2FACode);
      setSuccessMsg(res.message || 'Contraseña correcta. Introduce el código 2FA.');
      setView('two_factor');
    }
  };

  // ─── PASO 2: VERIFICAR CÓDIGO 2FA ─────────────────────────────────────────
  const handleVerify2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await AppStore.verifyAdmin2FARemote(email.trim(), twoFactorCode.trim());
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Código 2FA incorrecto o expirado.');
      return;
    }

    onAuthenticated(res.superAdminEmail || email);
  };

  // ─── PASO 3: SOLICITAR RESTABLECIMIENTO DE CONTRASEÑA ─────────────────────
  const handleRequestResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await AppStore.requestAdminResetRemote(email.trim());
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'No se pudo generar el código de recuperación.');
      return;
    }

    setMaskedEmail(res.maskedEmail || email);
    if (res.demoResetCode) setDemoCode(res.demoResetCode);
    setSuccessMsg(res.message || 'Código de recuperación generado.');
    setView('confirm_reset');
  };

  // ─── PASO 4: CONFIRMAR NUEVA CONTRASEÑA ───────────────────────────────────
  const handleConfirmResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await AppStore.resetAdminPasswordRemote(email.trim(), resetCode.trim(), newPassword);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Error al restablecer la contraseña.');
      return;
    }

    setSuccessMsg('¡Contraseña actualizada exitosamente! Ahora puedes iniciar sesión.');
    setPassword('');
    setView('login');
  };

  return (
    <div className="min-h-screen bg-[#0E1A14] flex flex-col justify-center items-center p-4 selection:bg-amber-400 selection:text-sage-950 relative overflow-hidden">
      
      {/* Subtle luxury background elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Security Card */}
      <div className="relative w-full max-w-md bg-[#16291F] border border-amber-400/30 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-white backdrop-blur-md">
        
        {/* Header with Security Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400/15 text-amber-300 border border-amber-300/30 shadow-inner mx-auto mb-1">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-300 block">
            Acceso Restringido &bull; Super Admin
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Andrea Labrador Nails
          </h2>
          <p className="text-xs text-sage-200/80">
            Portal administrativo protegido con Autenticación en Dos Pasos (2FA)
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VISTA 1: INICIO DE SESIÓN (EMAIL + CONTRASEÑA)
        ══════════════════════════════════════════════════════════════════════ */}
        {view === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-sage-200 block mb-1">
                Correo Gmail del Super Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0E1A14] border border-sage-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-sage-200">
                  Contraseña Maestra
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setSuccessMsg(null);
                    setView('request_reset');
                  }}
                  className="text-[11px] text-amber-300 hover:text-amber-200 transition-colors underline cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0E1A14] border border-sage-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sage-950 font-bold text-xs sm:text-sm shadow-luxury transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 stroke-[2.5]" />
                  <span>Continuar al Paso 2 (2FA)</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VISTA 2: VERIFICACIÓN EN DOS PASOS (2FA - CÓDIGO OTP)
        ══════════════════════════════════════════════════════════════════════ */}
        {view === 'two_factor' && (
          <form onSubmit={handleVerify2FASubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Paso 2 de 2: Autenticación en Dos Pasos</span>
              </div>
              <p className="text-sage-200 text-[11px] leading-relaxed">
                Ingresa el código de seguridad de 6 dígitos generado para el Super Admin: <span className="font-mono text-white font-bold">{maskedEmail}</span>.
              </p>
              {demoCode && (
                <div className="pt-1 flex items-center justify-between border-t border-white/10 text-[11px]">
                  <span className="text-sage-300">Código 2FA generado:</span>
                  <span className="font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded-md border border-amber-400/30 tracking-wider">
                    {demoCode}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-sage-200 block mb-1 text-center">
                Código de 6 Dígitos
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full py-3 text-center rounded-2xl bg-[#0E1A14] border border-amber-400/40 text-amber-300 text-xl font-mono tracking-[0.3em] font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || twoFactorCode.length < 6}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sage-950 font-bold text-xs sm:text-sm shadow-luxury transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validando código 2FA...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Acceder al Panel de Control</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setView('login');
                }}
                className="text-xs text-sage-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al Paso 1</span>
              </button>

              <button
                type="button"
                onClick={handleLoginSubmit}
                className="text-xs text-amber-300 hover:text-amber-200 transition-colors cursor-pointer underline"
              >
                Reenviar código
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VISTA 3: SOLICITAR RECUPERACIÓN DE CONTRASEÑA
        ══════════════════════════════════════════════════════════════════════ */}
        {view === 'request_reset' && (
          <form onSubmit={handleRequestResetSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-sage-200 leading-relaxed">
              Introduce el correo Gmail registrado como Super Admin. Generaremos un código temporal para verificar tu identidad y permitirte crear una nueva contraseña.
            </div>

            <div>
              <label className="text-xs font-bold text-sage-200 block mb-1">
                Correo Gmail del Super Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0E1A14] border border-sage-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sage-950 font-bold text-xs sm:text-sm shadow-luxury transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enviando código...</span>
                </>
              ) : (
                <span>Solicitar Código de Recuperación</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setSuccessMsg(null);
                setView('login');
              }}
              className="w-full text-center text-xs text-sage-300 hover:text-white transition-colors cursor-pointer pt-1"
            >
              Volver al inicio de sesión
            </button>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VISTA 4: INGRESAR CÓDIGO Y CONFIRMAR NUEVA CONTRASEÑA
        ══════════════════════════════════════════════════════════════════════ */}
        {view === 'confirm_reset' && (
          <form onSubmit={handleConfirmResetSubmit} className="space-y-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
              <span className="text-sage-300 block text-[11px]">Código de recuperación enviado a:</span>
              <span className="font-mono font-bold text-amber-300 text-xs">{maskedEmail}</span>
              {demoCode && (
                <div className="pt-1 flex items-center justify-between border-t border-white/10 text-[11px]">
                  <span className="text-sage-300">Código recibido:</span>
                  <span className="font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded-md border border-amber-400/30">
                    {demoCode}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-sage-200 block mb-1">
                Código de 6 Dígitos
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full py-2.5 text-center rounded-2xl bg-[#0E1A14] border border-amber-400/40 text-amber-300 font-mono tracking-widest font-bold text-lg focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-sage-200 block mb-1">
                Nueva Contraseña de Super Admin
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-2xl bg-[#0E1A14] border border-sage-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || resetCode.length < 6 || newPassword.length < 6}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sage-950 font-bold text-xs sm:text-sm shadow-luxury transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Actualizando contraseña...</span>
                </>
              ) : (
                <span>Guardar Nueva Contraseña</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setSuccessMsg(null);
                setView('login');
              }}
              className="w-full text-center text-xs text-sage-300 hover:text-white transition-colors cursor-pointer pt-1"
            >
              Cancelar y volver
            </button>
          </form>
        )}

        {/* Footer Link to Public Site */}
        <div className="pt-4 border-t border-white/10 text-center">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-xs text-sage-300 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Volver al Catálogo Público de Andrea Nails</span>
          </button>
        </div>

      </div>

    </div>
  );
};
