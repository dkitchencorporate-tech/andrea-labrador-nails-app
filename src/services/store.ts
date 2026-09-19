import { 
  ServiceItem, 
  PromoOffer, 
  AppointmentBooking, 
  BlockedTimeSlot, 
  LoyaltyCard,
  PaymentMethodType
} from '../types';
import { INITIAL_SERVICES, INITIAL_PROMOS, AVAILABLE_TIME_SLOTS } from '../data/initialData';

const STORAGE_KEYS = {
  SERVICES: 'andrea_labrador_services_v5',
  PROMOS: 'andrea_labrador_promos_v3',
  BOOKINGS: 'andrea_labrador_bookings_v2',
  BLOCKED_SLOTS: 'andrea_labrador_blocked_slots_v2',
  TIME_SLOTS: 'andrea_labrador_time_slots_v1',
  LOYALTY: 'andrea_labrador_loyalty_v2',
  EXCHANGE_RATE: 'andrea_labrador_exchange_rate_v1',
  EMAIL_SETTINGS: 'andrea_labrador_email_settings_v2',
};

export interface StudioEmailSettings {
  contactEmail: string;
  senderName: string;
}

export interface AppStoreData {
  services: ServiceItem[];
  promos: PromoOffer[];
  bookings: AppointmentBooking[];
  blockedSlots: BlockedTimeSlot[];
  loyaltyCards: Record<string, LoyaltyCard>;
  exchangeRateVES: number;
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

  // ─── SERVICIOS ─────────────────────────────────────────────────────────────
  static getServices(): ServiceItem[] {
    const list = this.getStored<ServiceItem[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    if (!list[0]?.badgeText || list.some(s => s.imageUrl?.includes('unsplash.com'))) {
      this.saveServices(INITIAL_SERVICES);
      return INITIAL_SERVICES;
    }
    return list;
  }

  static saveServices(services: ServiceItem[]): void {
    this.setStored(STORAGE_KEYS.SERVICES, services);
  }

  static async fetchRemoteServices(): Promise<ServiceItem[]> {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.services) && data.services.length > 0) {
          this.saveServices(data.services);
          return data.services;
        }
      }
    } catch (e) {
      console.warn('Usando catálogo local:', e);
    }
    return this.getServices();
  }

  static async saveServiceRemote(service: ServiceItem): Promise<void> {
    this.updateService(service);
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      });
    } catch (e) {
      console.error('Error guardando servicio en Neon:', e);
    }
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

  static async deleteServiceRemote(id: string): Promise<void> {
    this.deleteService(id);
    try {
      await fetch(`/api/services?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Error eliminando servicio en Neon:', e);
    }
  }

  static deleteService(id: string): void {
    const services = this.getServices().filter(s => s.id !== id);
    this.saveServices(services);
  }

  static toggleServiceAvailability(id: string): void {
    const services = this.getServices();
    const service = services.find(s => s.id === id);
    if (service) {
      service.isAvailable = !service.isAvailable;
      this.saveServices(services);
      this.saveServiceRemote(service);
    }
  }

  // ─── PROMOCIONES ───────────────────────────────────────────────────────────
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

  // ─── CITAS Y RESERVAS ──────────────────────────────────────────────────────
  static getBookings(): AppointmentBooking[] {
    return this.getStored<AppointmentBooking[]>(STORAGE_KEYS.BOOKINGS, []);
  }

  static saveBookings(bookings: AppointmentBooking[]): void {
    this.setStored(STORAGE_KEYS.BOOKINGS, bookings);
  }

  static async fetchRemoteBookings(): Promise<AppointmentBooking[]> {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.bookings)) {
          this.saveBookings(data.bookings);
          return data.bookings;
        }
      }
    } catch (e) {
      console.warn('Usando citas locales:', e);
    }
    return this.getBookings();
  }

  static async createBookingRemote(booking: AppointmentBooking): Promise<{
    success: boolean;
    booking?: AppointmentBooking;
    error?: string;
  }> {
    // Guardar inmediatamente en local
    this.addBooking(booking);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: booking.clientName,
          clientPhone: booking.clientPhone,
          clientInstagram: booking.clientInstagram,
          serviceId: booking.serviceId,
          serviceName: booking.serviceName,
          servicePriceUSD: booking.servicePriceUSD,
          totalPriceUSD: booking.totalPriceUSD,
          date: booking.date,
          timeSlot: booking.timeSlot,
          paymentMethod: booking.paymentMethod,
          isFirstVisit: booking.isFirstVisit,
          notes: booking.notes,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Error al registrar cita.' };
      }

      if (data.booking) {
        // Actualizar id asignado por el backend
        this.updateBookingStatus(booking.id, data.booking.status);
      }

      return { success: true, booking: data.booking || booking };
    } catch (e: any) {
      console.warn('Cita guardada en modo local/offline:', e);
      return { success: true, booking };
    }
  }

  static addBooking(booking: AppointmentBooking): void {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    this.saveBookings(bookings);
    this.recordLoyaltyVisit(booking.clientPhone, booking.clientName);
  }

  static async updateBookingStatusRemote(id: string, status: AppointmentBooking['status']): Promise<void> {
    this.updateBookingStatus(id, status);
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
    } catch (e) {
      console.error('Error actualizando estado en Neon:', e);
    }
  }

  static updateBookingStatus(id: string, status: AppointmentBooking['status']): void {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      this.saveBookings(bookings);
    }
  }

  static async deleteBookingRemote(id: string): Promise<void> {
    this.deleteBooking(id);
    try {
      await fetch(`/api/bookings?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Error eliminando reserva en Neon:', e);
    }
  }

  static deleteBooking(id: string): void {
    const bookings = this.getBookings().filter(b => b.id !== id);
    this.saveBookings(bookings);
  }

  // ─── BLOQUEOS DE CALENDARIO ────────────────────────────────────────────────
  static getBlockedSlots(): BlockedTimeSlot[] {
    return this.getStored<BlockedTimeSlot[]>(STORAGE_KEYS.BLOCKED_SLOTS, []);
  }

  static saveBlockedSlots(slots: BlockedTimeSlot[]): void {
    this.setStored(STORAGE_KEYS.BLOCKED_SLOTS, slots);
  }

  static async fetchRemoteBlockedSlots(): Promise<BlockedTimeSlot[]> {
    try {
      const res = await fetch('/api/schedule');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.blockedSlots)) {
          this.saveBlockedSlots(data.blockedSlots);
          return data.blockedSlots;
        }
      }
    } catch (e) {
      console.warn('Usando bloqueos locales:', e);
    }
    return this.getBlockedSlots();
  }

  static async toggleBlockSlotRemote(date: string, timeSlot: string, reason?: string): Promise<boolean> {
    const isNowBlocked = this.toggleBlockSlot(date, timeSlot, reason);
    try {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', date, timeSlot, reason })
      });
    } catch (e) {
      console.error('Error sincronizando slot en Neon:', e);
    }
    return isNowBlocked;
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

  static async blockEntireDayRemote(date: string, slots?: string[], reason = 'Día cerrado / libre'): Promise<void> {
    this.blockEntireDay(date, reason);
    try {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'block_day',
          date,
          slots: slots || this.getTimeSlots(),
          reason
        })
      });
    } catch (e) {
      console.error('Error bloqueando día en Neon:', e);
    }
  }

  static blockEntireDay(date: string, reason = 'Día cerrado / libre'): void {
    const slots = this.getTimeSlots();
    const current = this.getBlockedSlots().filter(s => s.date !== date);
    slots.forEach(slot => {
      current.push({ date, timeSlot: slot, reason });
    });
    this.saveBlockedSlots(current);
  }

  static async unblockEntireDayRemote(date: string): Promise<void> {
    this.unblockEntireDay(date);
    try {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unblock_day', date })
      });
    } catch (e) {
      console.error('Error desbloqueando día en Neon:', e);
    }
  }

  static unblockEntireDay(date: string): void {
    const current = this.getBlockedSlots().filter(s => s.date !== date);
    this.saveBlockedSlots(current);
  }

  static isSlotOccupied(date: string, timeSlot: string): boolean {
    const blocked = this.getBlockedSlots().some(s => s.date === date && s.timeSlot === timeSlot);
    if (blocked) return true;

    const booked = this.getBookings().some(
      b => b.date === date && b.timeSlot === timeSlot && (b.status === 'confirmada' || b.status === 'pendiente')
    );
    return booked;
  }

  static isDayEntirelyBlocked(date: string): boolean {
    const slots = this.getTimeSlots();
    if (slots.length === 0) return false;
    const blocks = this.getBlockedSlots().filter(s => s.date === date);
    return slots.every(slot => blocks.some(b => b.timeSlot === slot));
  }

  // ─── TURNOS Y HORARIOS CONFIGURABLES ───────────────────────────────────────
  static getTimeSlots(): string[] {
    return this.getStored<string[]>(STORAGE_KEYS.TIME_SLOTS, AVAILABLE_TIME_SLOTS);
  }

  static saveTimeSlots(slots: string[]): void {
    this.setStored(STORAGE_KEYS.TIME_SLOTS, slots);
  }

  static addTimeSlot(slot: string): void {
    const slots = this.getTimeSlots();
    if (!slots.includes(slot)) {
      slots.push(slot);
      this.saveTimeSlots(slots);
    }
  }

  static removeTimeSlot(slot: string): void {
    const slots = this.getTimeSlots().filter(s => s !== slot);
    this.saveTimeSlots(slots);
  }

  // ─── FIDELIZACIÓN (6+1 GRATIS) ─────────────────────────────────────────────
  static getLoyaltyCards(): Record<string, LoyaltyCard> {
    return this.getStored<Record<string, LoyaltyCard>>(STORAGE_KEYS.LOYALTY, {});
  }

  static saveLoyaltyCards(cards: Record<string, LoyaltyCard>): void {
    this.setStored(STORAGE_KEYS.LOYALTY, cards);
  }

  static async fetchRemoteLoyaltyCards(): Promise<Record<string, LoyaltyCard>> {
    try {
      const res = await fetch('/api/loyalty');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.cards)) {
          const map: Record<string, LoyaltyCard> = {};
          data.cards.forEach((c: any) => {
            map[c.phone] = {
              phone: c.phone,
              clientName: c.clientName,
              stampsCount: c.stampsCount,
              lastVisit: c.lastVisit,
              rewardsEarned: c.rewardsEarned || [],
            };
          });
          this.saveLoyaltyCards(map);
          return map;
        }
      }
    } catch (e) {
      console.warn('Usando tarjetas de fidelización locales:', e);
    }
    return this.getLoyaltyCards();
  }

  static async fetchClientLoyaltyRemote(phone: string): Promise<LoyaltyCard | null> {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) return null;

    try {
      const res = await fetch(`/api/loyalty?phone=${encodeURIComponent(cleanPhone)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.found || data.stampsCount !== undefined) {
          const card: LoyaltyCard = {
            phone: data.phone,
            clientName: data.clientName || 'Clienta VIP',
            stampsCount: data.stampsCount || 0,
            lastVisit: data.lastVisit || new Date().toISOString().split('T')[0],
            rewardsEarned: data.rewardsEarned || [],
          };
          const cards = this.getLoyaltyCards();
          cards[cleanPhone] = card;
          this.saveLoyaltyCards(cards);
          return card;
        }
      }
    } catch (e) {
      console.warn('Error consultando fidelización remota:', e);
    }

    return this.getClientLoyalty(cleanPhone);
  }

  static getClientLoyalty(phone: string): LoyaltyCard | null {
    const cards = this.getLoyaltyCards();
    const normalized = phone.replace(/\D/g, '');
    return cards[normalized] || null;
  }

  static async setLoyaltyStampsRemote(phone: string, clientName: string, stamps: number): Promise<LoyaltyCard> {
    const card = this.setLoyaltyStamps(phone, clientName, stamps);
    try {
      await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: card.phone,
          clientName: card.clientName,
          stampsCount: card.stampsCount,
        })
      });
    } catch (e) {
      console.error('Error sincronizando fidelización en Neon:', e);
    }
    return card;
  }

  static setLoyaltyStamps(phone: string, clientName: string, stamps: number): LoyaltyCard {
    const cards = this.getLoyaltyCards();
    const normalized = phone.replace(/\D/g, '');
    const existing = cards[normalized] || {
      phone: normalized,
      clientName: clientName || 'Clienta',
      stampsCount: 0,
      lastVisit: new Date().toISOString().split('T')[0],
      rewardsEarned: []
    };
    existing.clientName = clientName || existing.clientName;
    existing.stampsCount = Math.max(0, Math.min(6, stamps));
    if (existing.stampsCount === 6 && !existing.rewardsEarned.includes('¡7º Servicio 100% GRATIS!')) {
      existing.rewardsEarned.push('¡7º Servicio 100% GRATIS!');
    }
    cards[normalized] = existing;
    this.saveLoyaltyCards(cards);
    return existing;
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
    existing.stampsCount = Math.min(6, existing.stampsCount + 1);

    if (existing.stampsCount === 6 && !existing.rewardsEarned.includes('¡7º Servicio 100% GRATIS!')) {
      existing.rewardsEarned.push('¡7º Servicio 100% GRATIS!');
    }

    cards[normalized] = existing;
    this.saveLoyaltyCards(cards);
    return existing;
  }

  // ─── CONFIGURACIÓN DE CORREO GMAIL ─────────────────────────────────────────
  static getEmailSettings(): StudioEmailSettings {
    return this.getStored<StudioEmailSettings>(STORAGE_KEYS.EMAIL_SETTINGS, {
      contactEmail: 'andrealabradornails@gmail.com',
      senderName: 'Andrea Labrador Nails Studio'
    });
  }

  static saveEmailSettings(settings: StudioEmailSettings): void {
    this.setStored(STORAGE_KEYS.EMAIL_SETTINGS, settings);
  }

  // ─── TASA DE CAMBIO (VES / USD) ────────────────────────────────────────────
  static getExchangeRate(): number {
    return this.getStored<number>(STORAGE_KEYS.EXCHANGE_RATE, 36.85);
  }

  static saveExchangeRate(rate: number): void {
    this.setStored(STORAGE_KEYS.EXCHANGE_RATE, rate);
  }

  // ─── GENERADOR DE MENSAJE WHATSAPP ─────────────────────────────────────────
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
    const loyaltyText = `\n⭐ *Programa de Fidelización:* Suma a mis 6 servicios para el 7º GRATIS`;
    
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

  // ─── RESPALDO JSON EXPORT/IMPORT ───────────────────────────────────────────
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
