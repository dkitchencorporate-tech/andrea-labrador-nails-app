import { ServiceItem, ServiceAddon, PromoOffer, StudioPolicy } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'semipermanente',
    name: 'Esmaltado Semipermanente',
    category: 'natural',
    priceUSD: 10.00,
    durationMinutes: 60,
    shortDescription: 'Color vibrante con brillo intacto de hasta 3 semanas.',
    fullDescription: 'Ideal para quienes tienen uñas fuertes y buscan un color vibrante con brillo intacto que dure hasta tres semanas, sin añadir volumen ni longitud.',
    idealFor: 'Uñas sanas y fuertes que buscan color perfecto y duradero.',
    imageUrl: '/images/esmaltado-semipermanente.png',
    isPopular: true,
    isAvailable: true,
    tags: ['Larga duración', 'Uña natural', 'Brillo intacto', 'Secado rápido']
  },
  {
    id: 'pedicure',
    name: 'Pedicure Spa',
    category: 'pedicure',
    priceUSD: 11.50,
    durationMinutes: 75,
    shortDescription: 'Limpieza profunda, estética y relajación para tus pies.',
    fullDescription: 'Un servicio de cuidado integral enfocado en la limpieza profunda, estética y relajación, para que tus pies luzcan y se sientan impecables.',
    idealFor: 'Descanso, higiene profunda y pies suaves y saludables.',
    imageUrl: '/images/pedicure-spa.jpg',
    isPopular: true,
    isAvailable: true,
    tags: ['Limpieza profunda', 'Estética', 'Relajación', 'Pies impecables']
  },
  {
    id: 'base-rubber',
    name: 'Nivelación de Base Rubber',
    category: 'natural',
    priceUSD: 15.00,
    durationMinutes: 90,
    shortDescription: 'Flexibilidad, resistencia y estructura para uña frágil.',
    fullDescription: 'Perfecto si tus uñas son frágiles, delgadas o irregulares. Aporta flexibilidad, resistencia y una estructura perfecta para ayudar a su crecimiento natural.',
    idealFor: 'Uñas frágiles, delgadas o irregulares que necesitan fuerza.',
    imageUrl: '/images/base-rubber.png',
    isPopular: true,
    isAvailable: true,
    tags: ['Flexibilidad', 'Resistencia', 'Crecimiento natural', 'Nivelación']
  },
  {
    id: 'jelly-tips',
    name: 'Extensiones Jelly Tips',
    category: 'extensions',
    priceUSD: 15.00,
    durationMinutes: 90,
    shortDescription: 'Longitud inmediata, simetría perfecta y máxima ligereza.',
    fullDescription: 'La opción más rápida si deseas lucir uñas largas de inmediato. Son puntas pre-diseñadas que ofrecen simetría perfecta y ligereza en tiempo récord.',
    idealFor: 'Quienes desean lucir uñas largas de inmediato en tiempo récord.',
    imageUrl: '/images/jelly-tips.jpg',
    isPopular: false,
    isAvailable: true,
    tags: ['Largo inmediato', 'Puntas pre-diseñadas', 'Simetría perfecta', 'Ligereza']
  },
  {
    id: 'polygel-extensions',
    name: 'Extensiones en Polygel',
    category: 'extensions',
    priceUSD: 18.00,
    durationMinutes: 120,
    shortDescription: 'Largo a medida y máxima resistencia con aspecto natural.',
    fullDescription: 'Ideal para quienes buscan un largo a medida y máxima resistencia. Se esculpen desde cero, logrando una estructura duradera con un aspecto muy natural.',
    idealFor: 'Quienes buscan un largo a medida y máxima resistencia.',
    imageUrl: '/images/polygel-extensions.png',
    isPopular: true,
    isAvailable: true,
    tags: ['Esculpido desde cero', 'Largo a medida', 'Máxima resistencia', 'Aspecto natural']
  },
  {
    id: 'polygel-capping',
    name: 'Capping de Polygel',
    category: 'natural',
    priceUSD: 16.00,
    durationMinutes: 90,
    shortDescription: 'Máxima protección para uña natural sin extensiones.',
    fullDescription: 'Altamente recomendado para quienes sufren de desprendimientos o quiebres constantes y desean máxima dureza sin extensiones.',
    idealFor: 'Quienes sufren de desprendimientos o quiebres constantes.',
    imageUrl: '/images/polygel-capping.png',
    isPopular: false,
    isAvailable: true,
    tags: ['Máxima dureza', 'Sin extensiones', 'Anti-quiebres', 'Uña natural']
  }
];

export const INITIAL_ADDONS: ServiceAddon[] = [
  { id: 'nailart-express', name: 'Nail Art Express (Líneas / Glitter)', priceUSD: 2.00, durationMinutes: 15 },
  { id: 'nailart-deluxe', name: 'Nail Art Diseños Especiales', priceUSD: 5.00, durationMinutes: 30 },
  { id: 'francesa', name: 'Diseño Francés / Baby Boomer', priceUSD: 3.00, durationMinutes: 15 },
  { id: 'retirada', name: 'Retiro de Sistema Anterior', priceUSD: 3.00, durationMinutes: 20 },
];

export const INITIAL_PROMOS: PromoOffer[] = [
  {
    id: 'duo-estelar',
    title: 'Pack Manos & Pies',
    subtitle: 'Esmaltado Semipermanente + Pedicure Spa en una sola cita.',
    servicesIncluded: ['Esmaltado Semipermanente', 'Pedicure Spa'],
    regularPriceUSD: 21.50,
    promoPriceUSD: 19.00,
    badge: 'MÁS PEDIDO',
    validUntil: 'Cupos limitados por semana',
    isActive: true,
    imageUrl: '/images/pedicure-spa.jpg'
  },
  {
    id: 'reina-polygel',
    title: 'Combo Polygel + Diseño',
    subtitle: 'Extensiones en Polygel con diseño Nail Art incluido.',
    servicesIncluded: ['Extensiones Polygel', 'Nail Art Express'],
    regularPriceUSD: 20.00,
    promoPriceUSD: 18.00,
    badge: 'ESPECIAL',
    validUntil: 'Válido de martes a jueves',
    isActive: true,
    imageUrl: '/images/polygel-extensions.png'
  }
];

export const STUDIO_POLICIES: StudioPolicy[] = [
  {
    id: 'puntualidad',
    title: 'Puntualidad',
    description: 'Por respeto al tiempo de todas, es indispensable llegar a la hora pautada (contamos con 10 minutos de tolerancia).',
    iconName: 'Clock'
  },
  {
    id: 'bioseguridad',
    title: 'Bioseguridad & Salud',
    description: 'Por estrictas normas de higiene y prevención, no atiendo a personas que presenten patologías o sospecha de hongos en las uñas.',
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
