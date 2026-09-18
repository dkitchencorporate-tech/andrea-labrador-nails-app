import React from 'react';
import { Smartphone, DollarSign, Coins, MessageCircle, ArrowUpRight, Copy, Check } from 'lucide-react';
import { InstagramIcon } from './Icons';

export const PaymentMethods: React.FC = () => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section className="py-16 bg-warm-100/70 border-t border-sage-200/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Explanation */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-semibold tracking-[0.2em] text-sage-600 uppercase font-sans">
              Transacciones Fáciles & Cómodas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-warm-900 font-semibold">
              Métodos de Pago Aceptados
            </h2>
            <p className="text-xs sm:text-sm text-warm-800/80 leading-relaxed">
              Para tu mayor comodidad y tranquilidad, puedes cancelar al finalizar tu cita mediante las modalidades más utilizadas en Venezuela y criptoactivos.
            </p>

            {/* Direct Contact Links from PDF Page 9 */}
            <div className="p-5 bg-white rounded-3xl border border-sage-200/80 shadow-soft space-y-3">
              <span className="text-xs font-bold text-sage-900 uppercase tracking-wider block">
                Canales de Atención Directa
              </span>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/584241360937"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between hover:bg-emerald-100 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>0424-1360937</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </a>

                <a
                  href="https://instagram.com/andrealabradorl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-800 flex items-center justify-between hover:bg-pink-100 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <InstagramIcon className="w-4 h-4 text-pink-600" />
                    <span>@andrealabradorl</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: 3 Payment cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* 1. Pago Móvil */}
            <div className="p-5 bg-white rounded-3xl border border-sage-200/80 shadow-soft space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-800">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-warm-900">
                  Pago Móvil
                </h4>
                <p className="text-[11px] text-warm-700 leading-relaxed">
                  Bancos nacionales a la tasa oficial del día (BCV).
                </p>
              </div>
              <button
                onClick={() => handleCopy('04241360937', 'pm')}
                className="w-full py-2 px-3 bg-sage-50 hover:bg-sage-100 text-sage-800 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-sage-200"
              >
                {copiedKey === 'pm' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'pm' ? 'Copiado' : 'Copiar Teléfono'}</span>
              </button>
            </div>

            {/* 2. Efectivo */}
            <div className="p-5 bg-white rounded-3xl border border-sage-200/80 shadow-soft space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-800">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-warm-900">
                  Efectivo ($ USD)
                </h4>
                <p className="text-[11px] text-warm-700 leading-relaxed">
                  Billetes en buen estado, sin roturas ni marcas acentuadas.
                </p>
              </div>
              <span className="block text-center py-2 px-3 bg-warm-50 text-warm-600 rounded-xl text-[10px] font-medium">
                Al finalizar cita
              </span>
            </div>

            {/* 3. Binance */}
            <div className="p-5 bg-white rounded-3xl border border-sage-200/80 shadow-soft space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center text-gold-600">
                  <Coins className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-warm-900">
                  Binance Pay
                </h4>
                <p className="text-[11px] text-warm-700 leading-relaxed">
                  USDT instantáneo sin comisiones interbancarias.
                </p>
              </div>
              <button
                onClick={() => handleCopy('andrealabrador.binance@gmail.com', 'binance')}
                className="w-full py-2 px-3 bg-sage-50 hover:bg-sage-100 text-sage-800 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-sage-200"
              >
                {copiedKey === 'binance' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'binance' ? 'Copiado' : 'Copiar Pay ID'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
