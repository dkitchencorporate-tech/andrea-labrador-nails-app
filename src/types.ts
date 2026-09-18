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
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  createdAt: string;
}

export interface BlockedTimeSlot {
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM AM/PM
  reason?: string;
}

export interface LoyaltyCard {
  phone: string;
  clientName: string;
  stampsCount: number; // 0 to 6
  lastVisit: string;
  rewardsEarned: string[];
}

export interface StudioPolicy {
  id: string;
  title: string;
  description: string;
  iconName: string;
}
