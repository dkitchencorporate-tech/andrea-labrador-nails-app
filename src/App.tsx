import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceCatalog } from './components/ServiceCatalog';
import { Promotions } from './components/Promotions';
import { StudioPolicies } from './components/StudioPolicies';
import { PaymentMethods } from './components/PaymentMethods';
import { LoyaltyClub } from './components/LoyaltyClub';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminPanel } from './components/AdminPanel';
import { AppStore } from './services/store';
import { ServiceItem, PromoOffer } from './types';
import { Calendar, MessageCircle, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  // Store reactive state
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [promos, setPromos] = useState<PromoOffer[]>([]);
  const [bookings, setBookings] = useState(AppStore.getBookings());
  const [blockedSlots, setBlockedSlots] = useState(AppStore.getBlockedSlots());
  const [loyaltyCards, setLoyaltyCards] = useState(AppStore.getLoyaltyCards());
  const [exchangeRate, setExchangeRate] = useState(AppStore.getExchangeRate());

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<PromoOffer | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load data on mount
  const refreshData = () => {
    setServices(AppStore.getServices());
    setPromos(AppStore.getPromos());
    setBookings(AppStore.getBookings());
    setBlockedSlots(AppStore.getBlockedSlots());
    setLoyaltyCards(AppStore.getLoyaltyCards());
    setExchangeRate(AppStore.getExchangeRate());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Synchronize route with Admin Panel
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      if (path === '/admin' || path.startsWith('/admin') || hash === '#admin' || search.has('admin')) {
        setIsAdminOpen(true);
      }
    };

    checkAdminRoute();

    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  const handleToggleAdmin = (openState?: boolean) => {
    const nextState = openState !== undefined ? openState : !isAdminOpen;
    setIsAdminOpen(nextState);
    if (nextState) {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } else {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        window.history.pushState(null, '', '/');
      }
    }
  };

  // Booking triggers
  const handleOpenGeneralBooking = () => {
    setSelectedService(null);
    setSelectedPromo(null);
    setIsBookingOpen(true);
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setSelectedPromo(null);
    setIsBookingOpen(true);
  };

  const handleSelectServiceById = (serviceId: string) => {
    const svc = services.find(s => s.id === serviceId);
    if (svc) {
      setSelectedService(svc);
      setSelectedPromo(null);
      setIsBookingOpen(true);
    } else {
      // Fallback: smooth scroll to element or open booking
      const el = document.getElementById(`service-${serviceId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        handleOpenGeneralBooking();
      }
    }
  };

  const handleSelectPromo = (promo: PromoOffer) => {
    setSelectedPromo(promo);
    setSelectedService(null);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-100 text-warm-900 font-sans selection:bg-sage-200">
      
      {/* Top Navbar */}
      <Navbar
        onOpenBooking={handleOpenGeneralBooking}
        onToggleAdmin={() => handleToggleAdmin()}
        isAdminOpen={isAdminOpen}
        exchangeRate={exchangeRate}
      />

      {/* Main Content Sections */}
      <main className="flex-1 pb-16 sm:pb-0">
        <Hero 
          onOpenBooking={handleOpenGeneralBooking}
          onSelectServiceById={handleSelectServiceById}
        />

        <Promotions
          promos={promos}
          services={services}
          exchangeRate={exchangeRate}
          onSelectPromoForBooking={handleSelectPromo}
        />

        <ServiceCatalog
          services={services}
          exchangeRate={exchangeRate}
          onSelectServiceForBooking={handleSelectService}
        />

        <StudioPolicies />

        <LoyaltyClub />

        <PaymentMethods />
      </main>

      {/* Footer */}
      <Footer
        onToggleAdmin={() => handleToggleAdmin()}
        onOpenBooking={handleOpenGeneralBooking}
      />

      {/* Sticky Mobile Fast Booking Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-sage-200/80 sm:hidden flex items-center justify-between shadow-luxury">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-sage-600 block">
            Agenda Abierta
          </span>
          <span className="font-serif font-bold text-sm text-sage-900">
            Citas Privadas
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/584241360937"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-emerald-100 text-emerald-800"
            title="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <button
            onClick={handleOpenGeneralBooking}
            className="px-5 py-2.5 bg-sage-800 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-soft"
          >
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedService={selectedService}
        preSelectedPromo={selectedPromo}
        services={services}
        exchangeRate={exchangeRate}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => handleToggleAdmin(false)}
        services={services}
        promos={promos}
        bookings={bookings}
        blockedSlots={blockedSlots}
        loyaltyCards={loyaltyCards}
        exchangeRate={exchangeRate}
        onRefreshData={refreshData}
      />

    </div>
  );
};

export default App;
