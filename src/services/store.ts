import { 
  ServiceItem, 
  PromoOffer, 
  AppointmentBooking, 
  BlockedTimeSlot, 
  LoyaltyCard,
  PaymentMethodType
} from '../types';
import { INITIAL_SERVICES, INITIAL_PROMOS } from '../data/initialData';

const STORAGE_KEYS = {
  SERVICES: 'andrea_labrador_services_v4',
  PROMOS: 'andrea_labrador_promos_v3',
  BOOKINGS: 'andrea_labrador_bookings_v1',
  BLOCKED_SLOTS: 'andrea_labrador_blocked_slots_v1',
  LOYALTY: 'andrea_labrador_loyalty_v1',
  EXCHANGE_RATE: 'andrea_labrador_exchange_rate_v1',
};

export interface AppStoreData {
  services: ServiceItem[];
  promos: PromoOffer[];
  bookings: AppointmentBooking[];
  blockedSlots: BlockedTimeSlot[];
  loyaltyCards: Record<string, LoyaltyCard>;
  exchangeRateVES: number; // Bs per USD
}

export class AppStore {
  private static getStored<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
  }

  private static setStored<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  // --- SERVICIOS ---
  static getServices(): ServiceItem[] {
    const list = this.getStored<ServiceItem[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    // Sanitize any legacy unsplash URLs or missing badges
    if (!list[0]?.badgeText || list.some(s => s.imageUrl.includes('unsplash.com'))) {
      this.saveServices(INITIAL_SERVICES);
      return INITIAL_SERVICES;
    }
    return list;
  }

  static saveServices(services: ServiceItem[]): void {
    this.setStored(STORAGE_KEYS.SERVICES, services);
  }

  static updateService(service: ServiceItem): void {
    const services = this.getServices();
    const index = services.findIndex(s => s.id === service.id);
    if (index >= 0) {
      services[index] = service;
    } else {
      services.push(service);
    }
    this.saveServices(services);
  }

  static toggleServiceAvailability(id: string): void {
    const services = this.getServices();
    const service = services.find(s => s.id === id);
    if (service) {
      service.isAvailable = !service.isAvailable;
      this.saveServices(services);
    }
  }

  // --- PROMOCIONES ---
  static getPromos(): PromoOffer[] {
    return this.getStored<PromoOffer[]>(STORAGE_KEYS.PROMOS, INITIAL_PROMOS);
  }

  static savePromos(promos: PromoOffer[]): void {
    this.setStored(STORAGE_KEYS.PROMOS, promos);
  }

  static addPromo(promo: PromoOffer): void {
    const promos = this.getPromos();
    promos.unshift(promo);
    this.savePromos(promos);
  }

  static togglePromoActive(id: string): void {
    const promos = this.getPromos();
    const promo = promos.find(p => p.id === id);
    if (promo) {
      promo.isActive = !promo.isActive;
      this.savePromos(promos);
    }
  }

  // --- CITAS / RESERVAS ---
  static getBookings(): AppointmentBooking[] {
    return this.getStored<AppointmentBooking[]>(STORAGE_KEYS.BOOKINGS, []);
  }

  static saveBookings(bookings: AppointmentBooking[]): void {
    this.setStored(STORAGE_KEYS.BOOKINGS, bookings);
  }

  static addBooking(booking: AppointmentBooking): void {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    this.saveBookings(bookings);

    // Also automatically update loyalty profile
    this.recordLoyaltyVisit(booking.clientPhone, booking.clientName);
  }

  static updateBookingStatus(id: string, status: AppointmentBooking['status']): void {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      this.saveBookings(bookings);
    }
  }

  static deleteBooking(id: string): void {
    const bookings = this.getBookings().filter(b => b.id !== id);
    this.saveBookings(bookings);
  }

  // --- BLOQUEOS DE CALENDARIO ---
  static getBlockedSlots(): BlockedTimeSlot[] {
    return this.getStored<BlockedTimeSlot[]>(STORAGE_KEYS.BLOCKED_SLOTS, []);
  }

  static saveBlockedSlots(slots: BlockedTimeSlot[]): void {
    this.setStored(STORAGE_KEYS.BLOCKED_SLOTS, slots);
  }

  static toggleBlockSlot(date: string, timeSlot: string, reason?: string): boolean {
    const slots = this.getBlockedSlots();
    const index = slots.findIndex(s => s.date === date && s.timeSlot === timeSlot);
    let isNowBlocked = false;
    if (index >= 0) {
      slots.splice(index, 1);
      isNowBlocked = false;
    } else {
      slots.push({ date, timeSlot, reason: reason || 'Horario reservado/bloqueado por estudio' });
      isNowBlocked = true;
    }
    this.saveBlockedSlots(slots);
    return isNowBlocked;
  }

  static isSlotOccupied(date: string, timeSlot: string): boolean {
    // Check manual blocks
    const blocked = this.getBlockedSlots().some(s => s.date === date && s.timeSlot === timeSlot);
    if (blocked) return true;

    // Check confirmed or pending bookings
    const booked = this.getBookings().some(
      b => b.date === date && b.timeSlot === timeSlot && (b.status === 'confirmada' || b.status === 'pendiente')
    );
    return booked;
  }

  // --- FIDELIZACIÓN VIP ---
  static getLoyaltyCards(): Record<string, LoyaltyCard> {
    return this.getStored<Record<string, LoyaltyCard>>(STORAGE_KEYS.LOYALTY, {});
  }

  static saveLoyaltyCards(cards: Record<string, LoyaltyCard>): void {
    this.setStored(STORAGE_KEYS.LOYALTY, cards);
  }

  static getClientLoyalty(phone: string): LoyaltyCard | null {
    const cards = this.getLoyaltyCards();
    const normalized = phone.replace(/\D/g, '');
    return cards[normalized] || null;
  }

  static recordLoyaltyVisit(phone: string, clientName: string): LoyaltyCard {
    const cards = this.getLoyaltyCards();
    const normalized = phone.replace(/\D/g, '');
    const existing = cards[normalized] || {
      phone: normalized,
      clientName: clientName,
      stampsCount: 0,
      lastVisit: new Date().toISOString().split('T')[0],
      rewardsEarned: []
    };

    existing.clientName = clientName;
    existing.lastVisit = new Date().toISOString().split('T')[0];
    existing.stampsCount = Math.min(10, existing.stampsCount + 1);

    if (existing.stampsCount === 10 && !existing.rewardsEarned.includes('¡11º Servicio 100% GRATIS!')) {
      existing.rewardsEarned.push('¡11º Servicio 100% GRATIS!');
    }

    cards[normalized] = existing;
    this.saveLoyaltyCards(cards);
    return existing;
  }

  // --- TASA DE CAMBIO (VES / USD) ---
  static getExchangeRate(): number {
    return this.getStored<number>(STORAGE_KEYS.EXCHANGE_RATE, 36.85);
  }

  static saveExchangeRate(rate: number): void {
    this.setStored(STORAGE_KEYS.EXCHANGE_RATE, rate);
  }

  // --- WHATSAPP RESERVATION GENERATOR ---
  static generateWhatsAppBookingUrl(booking: {
    serviceName: string;
    totalPriceUSD: number;
    date: string;
    timeSlot: string;
    clientName: string;
    clientPhone: string;
    clientInstagram?: string;
    addons?: { name: string; priceUSD: number }[];
    paymentMethod: PaymentMethodType;
    notes?: string;
    isFirstVisit?: boolean;
    discountUSD?: number;
    referralCode?: string;
  }): string {
    const paymentLabel = {
      pago_movil: 'Pago Móvil (Bolívares)',
      efectivo: 'Efectivo en Dólares ($)',
      binance: 'Binance (USDT)'
    }[booking.paymentMethod];

    const addonsText = booking.addons && booking.addons.length > 0
      ? `\n✨ *Adicionales:* ${booking.addons.map(a => `${a.name} (+$${a.priceUSD.toFixed(2)})`).join(', ')}`
      : '';

    const igText = booking.clientInstagram ? `\n📸 *Instagram:* @${booking.clientInstagram.replace('@', '')}` : '';
    const notesText = booking.notes ? `\n📝 *Nota:* ${booking.notes}` : '';
    const firstVisitText = booking.isFirstVisit 
      ? `\n🎉 *Beneficio Primera Cita:* -$2.00 USD de descuento aplicado`
      : '';
    const loyaltyText = `\n⭐ *Programa de Fidelización:* Suma a mis 10 servicios para el 11º GRATIS`;
    
    const rate = this.getExchangeRate();
    const approxVES = (booking.totalPriceUSD * rate).toFixed(0);

    const message = `¡Hola Andrea! 💅✨ Deseo agendar una cita contigo desde tu catálogo:

👤 *Cliente:* ${booking.clientName}
📱 *Teléfono:* ${booking.clientPhone}${igText}
💅 *Servicio:* ${booking.serviceName}${addonsText}
📅 *Fecha:* ${booking.date}
⏰ *Hora:* ${booking.timeSlot}
💳 *Forma de Pago:* ${paymentLabel}${firstVisitText}${loyaltyText}${notesText}

💰 *Total a Cancelar:* $${booking.totalPriceUSD.toFixed(2)} USD (≈ ${approxVES} Bs)

¿Tienes este cupo disponible para confirmarme? ¡Muchas gracias! 💕`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/584241360937?text=${encoded}`;
  }

  // --- EXPORT / IMPORT (BACKEND READINESS) ---
  static exportDataJSON(): string {
    const payload: AppStoreData = {
      services: this.getServices(),
      promos: this.getPromos(),
      bookings: this.getBookings(),
      blockedSlots: this.getBlockedSlots(),
      loyaltyCards: this.getLoyaltyCards(),
      exchangeRateVES: this.getExchangeRate()
    };
    return JSON.stringify(payload, null, 2);
  }

  static importDataJSON(jsonString: string): boolean {
    try {
      const parsed: Partial<AppStoreData> = JSON.parse(jsonString);
      if (parsed.services) this.saveServices(parsed.services);
      if (parsed.promos) this.savePromos(parsed.promos);
      if (parsed.bookings) this.saveBookings(parsed.bookings);
      if (parsed.blockedSlots) this.saveBlockedSlots(parsed.blockedSlots);
      if (parsed.loyaltyCards) this.saveLoyaltyCards(parsed.loyaltyCards);
      if (parsed.exchangeRateVES) this.saveExchangeRate(parsed.exchangeRateVES);
      return true;
    } catch (e) {
      console.error('Error importing data:', e);
      return false;
    }
  }
}
