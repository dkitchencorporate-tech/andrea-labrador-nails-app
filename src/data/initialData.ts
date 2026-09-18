import { ServiceItem, ServiceAddon, PromoOffer, StudioPolicy } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'semipermanente',
    name: 'Esmaltado Semipermanente',
    category: 'natural',
    priceUSD: 10.00,
    durationMinutes: 60,
    shortDescription: 'Color vibrante con brillo espejo intacto de hasta 3 semanas.',
    fullDescription: 'Ideal para quienes tienen uñas fuertes y buscan un color vibrante con brillo intacto que dure hasta tres semanas, sin añadir volumen ni longitud. Incluye preparación rusa de cutícula y esmaltado de alta gama curado en lámpara LED UV.',
    idealFor: 'Uñas sanas y fuertes que buscan color perfecto sin mantenimiento semanal.',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    tags: ['Larga duración', 'Cuidado uña natural', 'Brillo espejo', 'Secado rápido']
  },
  {
    id: 'pedicure',
    name: 'Pedicure Spa Integral',
    category: 'pedicure',
    priceUSD: 11.50,
    durationMinutes: 75,
    shortDescription: 'Cuidado integral: limpieza profunda, estética y relajación total.',
    fullDescription: 'Un servicio de cuidado integral enfocado en la limpieza profunda, estética y relajación, para que tus pies luzcan y se sientan impecables. Incluye exfoliación mineral, hidratación con masajes relajantes y esmaltado impecable.',
    idealFor: 'Descanso, higiene profunda y pies suaves y saludables todo el año.',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    tags: ['Exfoliación profunda', 'Masaje relajante', 'Higiene clínica', 'Pies perfectos']
  },
  {
    id: 'base-rubber',
    name: 'Nivelación de Base Rubber',
    category: 'natural',
    priceUSD: 15.00,
    durationMinutes: 90,
    shortDescription: 'Flexibilidad, resistencia y curvatura perfecta para uña frágil.',
    fullDescription: 'Perfecto si tus uñas son frágiles, delgadas o irregulares. Aporta flexibilidad, resistencia y una estructura perfecta para ayudar a su crecimiento natural. Crea un ápice armónico que absorbe los impactos diarios sin quebrar.',
    idealFor: 'Uñas quebradizas, estriadas o en proceso de recuperación post-sistemas agresivos.',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    tags: ['Estructura flexible', 'Anti-quiebre', 'Crecimiento natural', 'Nivelación anatómica']
  },
  {
    id: 'jelly-tips',
    name: 'Extensiones Jelly Tips',
    category: 'extensions',
    priceUSD: 15.00,
    durationMinutes: 90,
    shortDescription: 'Longitud inmediata, simetría perfecta y máxima ligereza.',
    fullDescription: 'La opción más rápida si deseas lucir uñas largas de inmediato. Son puntas pre-diseñadas de gel de última generación que ofrecen simetría perfecta y ligereza en tiempo récord, sin peso excesivo ni daño al lecho ungueal.',
    idealFor: 'Eventos especiales, sesiones de fotos o quienes desean largo instantáneo sin horas de espera.',
    imageUrl: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=800&auto=format&fit=crop',
    isPopular: false,
    isAvailable: true,
    tags: ['Longitud express', 'Ultra ligeras', 'Simetría exacta', 'Gel flexible']
  },
  {
    id: 'polygel-extensions',
    name: 'Extensiones en Polygel',
    category: 'extensions',
    priceUSD: 18.00,
    durationMinutes: 120,
    shortDescription: 'Esculpido artesanal a medida: la combinación de acrílico y gel.',
    fullDescription: 'Ideal para quienes buscan un largo a medida y máxima resistencia. Se esculpen desde cero con técnica artesanal, logrando una estructura duradera con un aspecto muy natural, sin los olores fuertes del monómero tradicional.',
    idealFor: 'Largo personalizado, máxima durabilidad y uñas de pasarela con resistencia blindada.',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    tags: ['Esculpido a mano', 'Máxima durabilidad', 'Cero olores', 'Acabado ultra-fino']
  },
  {
    id: 'polygel-capping',
    name: 'Capping de Polygel',
    category: 'natural',
    priceUSD: 16.00,
    durationMinutes: 90,
    shortDescription: 'La armadura definitiva para tu uña natural sin añadir extensiones.',
    fullDescription: 'La armadura definitiva para tu uña natural. Altamente recomendado para quienes sufren de desprendimientos o quiebres constantes y desean máxima dureza sin extensiones. Protege tu uña mientras crece fuerte y protegida.',
    idealFor: 'Quienes quieren dejar crecer sus uñas naturales sin que se rompan en los bordes.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
    isPopular: false,
    isAvailable: true,
    tags: ['Blindaje total', 'Cero desprendimientos', 'Dureza diamantina', 'Cero extensión']
  }
];

export const INITIAL_ADDONS: ServiceAddon[] = [
  { id: 'nailart-express', name: 'Nail Art Express (Líneas / Glitter / 2 Uñas)', priceUSD: 2.00, durationMinutes: 15 },
  { id: 'nailart-deluxe', name: 'Nail Art Deluxe (Mármol / 3D / Pedrería)', priceUSD: 5.00, durationMinutes: 30 },
  { id: 'francesa', name: 'Diseño Francés Clásico / Baby Boomer', priceUSD: 3.00, durationMinutes: 15 },
  { id: 'retirada', name: 'Retirada de Sistema Anterior', priceUSD: 3.00, durationMinutes: 20 },
  { id: 'spa-parafina', name: 'Tratamiento Hidronutritivo con Aceites Botánicos', priceUSD: 4.00, durationMinutes: 15 },
];

export const INITIAL_PROMOS: PromoOffer[] = [
  {
    id: 'duo-estelar',
    title: 'Pack Dúo Estelar',
    subtitle: 'Manos y pies impecables en una sola sesión de spa.',
    servicesIncluded: ['Esmaltado Semipermanente', 'Pedicure Spa Integral'],
    regularPriceUSD: 21.50,
    promoPriceUSD: 19.00,
    badge: 'MÁS POPULAR',
    validUntil: 'Hasta agotar turnos del mes',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'reina-polygel',
    title: 'Combo Reina Polygel',
    subtitle: 'Extensiones esculpidas a medida con diseño Nail Art incluido.',
    servicesIncluded: ['Extensiones Polygel', 'Nail Art Express'],
    regularPriceUSD: 20.00,
    promoPriceUSD: 18.00,
    badge: 'EDICIÓN ESPECIAL',
    validUntil: 'Válido martes a jueves',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600&auto=format&fit=crop'
  }
];

export const STUDIO_POLICIES: StudioPolicy[] = [
  {
    id: 'puntualidad',
    title: 'Puntualidad Estricta',
    description: 'Por respeto al tiempo de todas las clientas, es indispensable llegar a la hora pautada. Contamos con un margen de tolerancia máximo de 10 minutos para no alterar las citas sucesivas.',
    iconName: 'Clock'
  },
  {
    id: 'asistencia',
    title: 'Asistencia Individual',
    description: 'Para garantizar un ambiente relajante, seguro y sin interrupciones, te solicitamos asistir a tu cita sin acompañantes ni niños.',
    iconName: 'UserCheck'
  },
  {
    id: 'bioseguridad',
    title: 'Bioseguridad & Salud Ungueal',
    description: 'Por estrictas normas sanitarias y de higiene preventiva, no se atienden personas que presenten patologías, micosis o sospecha de hongos en las uñas.',
    iconName: 'ShieldCheck'
  }
];

export const AVAILABLE_TIME_SLOTS = [
  '09:00 AM',
  '11:00 AM',
  '02:00 PM',
  '04:00 PM',
  '06:00 PM'
];
