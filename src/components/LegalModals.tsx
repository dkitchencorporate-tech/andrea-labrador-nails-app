import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Cookie, AlertCircle } from 'lucide-react';

export type LegalModalType = 'terminos' | 'privacidad' | 'cookies' | 'descargo' | null;

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-luxury border border-sage-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-sage-200/80 flex items-center justify-between bg-warm-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage-800 text-amber-200 flex items-center justify-center">
              {activeModal === 'terminos' && <FileText className="w-5 h-5" />}
              {activeModal === 'privacidad' && <ShieldCheck className="w-5 h-5" />}
              {activeModal === 'cookies' && <Cookie className="w-5 h-5" />}
              {activeModal === 'descargo' && <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-warm-900 leading-tight">
                {activeModal === 'terminos' && 'Términos y Condiciones del Servicio'}
                {activeModal === 'privacidad' && 'Política de Privacidad & Protección de Datos'}
                {activeModal === 'cookies' && 'Política de Cookies'}
                {activeModal === 'descargo' && 'Descargo de Responsabilidad (Disclaimer)'}
              </h3>
              <p className="text-[11px] text-sage-600 uppercase tracking-wider font-semibold">
                Andrea Labrador Nails Studio &bull; Cordero, Táchira
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-warm-400 hover:text-warm-900 hover:bg-sage-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-warm-800 leading-relaxed space-y-4">
          
          {/* TÉRMINOS Y CONDICIONES */}
          {activeModal === 'terminos' && (
            <>
              <p><strong>1. Ámbito y Objeto del Servicio:</strong> Andrea Labrador Nails Studio ofrece servicios profesionales de manicura, nivelación, sistemas de esculpido y pedicura estética/spa en el municipio Andrés Bello (Cordero) y San Cristóbal, Estado Táchira, Venezuela. El presente catálogo digital opera como plataforma oficial de consulta y pre-reserva de citas.</p>
              <p><strong>2. Agendamiento y Confirmación:</strong> Toda cita solicitada a través de esta plataforma constituye una pre-reserva sujeta a validación final de disponibilidad por parte de Andrea Labrador vía WhatsApp. Ninguna cita se considerará definitiva sin la confirmación recíproca.</p>
              <p><strong>3. Políticas de Puntualidad y Cancelaciones:</strong> Se contempla un margen estricto de 10 minutos de tolerancia por respeto al tiempo de las demás clientas. Cancelaciones o reprogramaciones deben notificarse con al menos 24 horas de antelación.</p>
              <p><strong>4. Políticas de Salud e Higiene (Bioseguridad):</strong> Por estrictos estándares de sanidad y protección de la clientela, no se atenderán servicios sobre uñas con patologías activas, sospechas de micosis (hongos) o lesiones abiertas, reservándose el derecho de admisión por razones de bioseguridad.</p>
              <p><strong>5. Modificación de Tarifas:</strong> Los precios expresados en dólares estadounidenses ($ USD) son las tarifas base oficiales. Las equivalencias referenciales en bolívares se calculan a la tasa acordada del día al momento del pago final en el salón.</p>
            </>
          )}

          {/* POLÍTICA DE PRIVACIDAD */}
          {activeModal === 'privacidad' && (
            <>
              <p><strong>1. Responsable del Tratamiento:</strong> Los datos personales facilitados por las clientas (nombre, teléfono de contacto y correo electrónico voluntario) son tratados con estricta confidencialidad por Andrea Labrador para la gestión de su agenda, historial de citas y tarjeta de fidelización.</p>
              <p><strong>2. Finalidad del Uso de Datos:</strong> La información recopilada se utiliza exclusivamente para: (a) Coordinar y confirmar turnos de atención; (b) Computar sellos de fidelización; (c) Notificar recordatorios de citas vía WhatsApp o correo; (d) Asegurar la autenticación segura en la ficha personal de la clienta.</p>
              <p><strong>3. Confidencialidad y Hermetismo Absoluto:</strong> Bajo ninguna circunstancia los datos personales, números telefónicos o historiales de atención son cedidos, comercializados ni transferidos a terceros con fines publicitarios ajenos al estudio.</p>
              <p><strong>4. Derechos de Acceso y Rectificación:</strong> En cualquier momento la clienta puede solicitar la actualización o supresión de sus registros de la base de datos comunicándose directamente al canal oficial de atención (+58 424-1360937).</p>
            </>
          )}

          {/* POLÍTICA DE COOKIES */}
          {activeModal === 'cookies' && (
            <>
              <p><strong>1. ¿Qué son y para qué se utilizan?:</strong> Esta aplicación web utiliza cookies técnicas y almacenamiento local (LocalStorage / SessionStorage) para permitir el correcto funcionamiento de la navegación, recordar tu sesión de clienta VIP y guardar tus preferencias de uso sin requerir descargas pesadas.</p>
              <p><strong>2. Tipos de Almacenamiento Utilizados:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Técnicas / Esenciales:</strong> Necesarias para permitir el flujo de pre-reserva y el mantenimiento de tu ficha digital.</li>
                <li><strong>Preferencia y PWA:</strong> Guardan el estado de aceptación de términos y la configuración de instalación en tu pantalla de inicio.</li>
              </ul>
              <p><strong>3. Gestión del Consentimiento:</strong> Puedes limpiar o borrar estos datos en cualquier momento desde las opciones de privacidad y caché de tu navegador móvil.</p>
            </>
          )}

          {/* DESCARGO DE RESPONSABILIDAD */}
          {activeModal === 'descargo' && (
            <>
              <p><strong>1. Información General:</strong> El contenido, imágenes y descripciones de técnicas presentadas en este catálogo tienen carácter demostrativo y profesional sobre trabajos reales efectuados por Andrea Labrador.</p>
              <p><strong>2. Cuidados Posteriores y Durabilidad:</strong> La durabilidad de los sistemas (Semipermanente, Base Rubber, Polygel y Jelly Tips) depende estrictamente del correcto cuidado diario de la clienta, evitando el contacto prolongado con químicos corrosivos sin guantes o el uso de las uñas como herramienta de tracción.</p>
              <p><strong>3. Reacciones Alérgicas:</strong> Es responsabilidad de la clienta notificar previamente a la sesión si posee alergias conocidas a monómeros, acrilatos o productos cosméticos para evaluar la idoneidad del procedimiento.</p>
              <p><strong>4. Plataforma Tecnológica:</strong> La arquitectura tecnológica y de software opera bajo diseño seguro para optimizar el contacto entre el estudio y sus clientas, no asumiendo responsabilidades por fallos ajenos a la plataforma como caídas de operadoras de telecomunicaciones o servicios de WhatsApp.</p>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sage-200/80 bg-warm-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-sage-800 hover:bg-sage-900 text-white rounded-full font-bold text-xs shadow-soft transition-all"
          >
            Entendido y Acepto
          </button>
        </div>

      </div>
    </div>
  );
};
