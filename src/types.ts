export type ServiceCategory = 'all' | 'natural' | 'extensions' | 'pedicure' | 'combos';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'natural' | 'extensions' | 'pedicure';
  priceUSD: number;
  durationMinutes: number;
  shortDescription: string;
  fullDescription: string;
  idealFor: string;
  imageUrl: string;
  isPopular?: boolean;
  badgeText?: string;
  badgeColor?: string;
  isAvailable: boolean;
  tags: string[];
}

export interface ServiceAddon {
  id: string;
  name: string;
  priceUSD: number;
  durationMinutes: number;
}

export interface PromoOffer {
  id: string;
  title: string;
  subtitle: string;
  servicesIncluded: string[];
  regularPriceUSD: number;
  promoPriceUSD: number;
  badge: string;
  validUntil: string;
  isActive: boolean;
  imageUrl: string;
}

export type PaymentMethodType = 'pago_movil' | 'efectivo' | 'binance';

export interface AppointmentBooking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientPin?: string;
  clientInstagram?: string;
  serviceId: string;
  serviceName: string;
  servicePriceUSD: number;
  selectedAddons: ServiceAddon[];
  totalPriceUSD: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM AM/PM
  paymentMethod: PaymentMethodType;
  notes?: string;
  status: 'en_whatsapp' | 'pendiente' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio';
  cancellationReason?: string;
  isFirstVisit?: boolean;
  discountUSD?: number;
  createdAt: string;
}

export interface ClientAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
  pin?: string;
  instagram?: string;
  stampsCount: number;
  createdAt: string;
  lastVisit?: string;
}

export interface BlockedTimeSlot {
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM AM/PM
  reason?: string;
}

export interface LoyaltyCard {
  phone: string;
  clientName: string;
  stampsCount: number; // 0 to 10
  lastVisit: string;
  rewardsEarned: string[];
}

export interface StudioPolicy {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface GallerySlide {
  id: string;
  name: string;
  imageUrl: string;
  tag?: string;
  technique?: string;
  createdAt?: string;
}
