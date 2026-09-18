import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceCatalog } from './components/ServiceCatalog';
import { Promotions } from './components/Promotions';
import { StudioPolicies } from './components/StudioPolicies';
import { PaymentMethods } from './components/PaymentMethods';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AppStore } from './services/store';
import { ServiceItem, PromoOffer } from './types';
import { Calendar, MessageCircle } from 'lucide-react';

export const App: React.FC = () => {
  // Store reactive state
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [promos, setPromos] = useState<PromoOffer[]>([]);
  const [bookings, setBookings] = useState(AppStore.getBookings());
  const [blockedSlots, setBlockedSlots] = useState(AppStore.getBlockedSlots());
  const [exchangeRate, setExchangeRate] = useState(AppStore.getExchangeRate());

  // Routing state for SaaS Admin Dashboard
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return path.startsWith('/admin') || hash === '#admin' || search.has('admin');
  });

  // Client booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<PromoOffer | null>(null);

  // Load store data
  const refreshData = () => {
    setServices(AppStore.getServices());
    setPromos(AppStore.getPromos());
    setBookings(AppStore.getBookings());
    setBlockedSlots(AppStore.getBlockedSlots());
    setExchangeRate(AppStore.getExchangeRate());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Listen to browser navigation changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      setIsAdminRoute(path.startsWith('/admin') || hash === '#admin' || search.has('admin'));
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Booking modal triggers
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

  // Exit Admin to Public Catalog
  const handleExitToCatalog = () => {
    window.history.pushState(null, '', '/');
    setIsAdminRoute(false);
  };

  // --- RENDER REAL STANDALONE SAAS ADMIN DASHBOARD PAGE ---
  if (isAdminRoute) {
    return (
      <AdminDashboard
        services={services}
        promos={promos}
        bookings={bookings}
        blockedSlots={blockedSlots}
        exchangeRate={exchangeRate}
        onRefreshData={refreshData}
        onExitToCatalog={handleExitToCatalog}
      />
    );
  }

  // --- RENDER PUBLIC CUSTOMER CATALOG (NO ADMIN LOCKS VISIBLE) ---
  return (
    <div className="min-h-screen flex flex-col bg-warm-100 text-warm-900 font-sans selection:bg-sage-200">
      
      {/* Client Navbar (Completely clean, no admin lock) */}
      <Navbar
        onOpenBooking={handleOpenGeneralBooking}
        exchangeRate={exchangeRate}
      />

      {/* Main Public Content Sections */}
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

        <PaymentMethods />
      </main>

      {/* Client Footer (Completely clean, no admin link) */}
      <Footer
        onOpenBooking={handleOpenGeneralBooking}
      />

      {/* Sticky Mobile Fast Booking Bar for Clients */}
      <div className="fixed bottom-0 inset-x-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-sage-200/80 sm:hidden flex items-center justify-between shadow-luxury">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-sage-600 block">
            Agenda Abierta
          </span>
          <span className="font-serif font-bold text-sm text-sage-900">
            Citas Disponibles
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/584241360937"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-emerald-100 text-emerald-800"
            title="WhatsApp Oficial"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <button
            onClick={handleOpenGeneralBooking}
            className="px-5 py-2.5 bg-sage-800 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-soft"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>

      {/* Client Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedService={selectedService}
        preSelectedPromo={selectedPromo}
        services={services}
        exchangeRate={exchangeRate}
      />

    </div>
  );
};

export default App;
