import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceCatalog } from './components/ServiceCatalog';
import { PromoPage } from './components/PromoPage';
import { LoyaltyClub } from './components/LoyaltyClub';
import { ClientAccountModal } from './components/ClientAccountModal';
import { StudioPolicies } from './components/StudioPolicies';
import { PaymentMethods } from './components/PaymentMethods';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAuthGate } from './components/AdminAuthGate';
import { SharePage } from './components/SharePage';
import { ClubInviteSection } from './components/ClubInviteSection';
import { PWAInstallModal } from './components/PWAInstallModal';
import { LegalModals, LegalModalType } from './components/LegalModals';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { CentralDashboard } from './components/CentralDashboard';
import { VanesevLanding } from './components/VanesevLanding';
import { AppStore } from './services/store';
import { ServiceItem, PromoOffer, GallerySlide } from './types';
import {
  Calendar,
  MessageCircle,
  Sparkles,
  Download,
  Terminal,
  ShieldCheck,
  Globe,
  Phone,
  Award,
  Clock,
  Users,
} from 'lucide-react';

const CAPRA_FALLBACK_SERVICES: ServiceItem[] = [
  {
    id: 'capra-cejas-lam',
    name: 'Laminado de Cejas + Diseño y Pigmento HD',
    category: 'cejas_pestanas',
    priceUSD: 18,
    durationMinutes: 45,
    shortDescription: 'Visagismo personalizado con efecto pluma y nutrición profunda.',
    fullDescription: 'Diseño geométrico de cejas, laminado con keratina nutritiva, pigmentación híbrida de larga duración y depilación con hilo.',
    idealFor: 'Mirada definida y cejas pobladas por 5 semanas',
    imageUrl: '/images/esmaltado-semipermanente.png',
    badgeText: 'Top Miradas',
    badgeColor: 'bg-[#B5838D]',
    isAvailable: true,
    tags: ['Cejas HD', 'Laminado', 'Visagismo'],
  },
  {
    id: 'capra-pestanas-vol',
    name: 'Extensiones de Pestañas Efecto Rímel / Volumen Sutil',
    category: 'cejas_pestanas',
    priceUSD: 25,
    durationMinutes: 90,
    shortDescription: 'Aplicación pelo a pelo ultraligera sin dañar tu pestaña natural.',
    fullDescription: 'Diseño personalizado según la morfología de tu ojo con fibras de seda hipoalergénicas.',
    idealFor: 'Despertar maquillada todos los días',
    imageUrl: '/images/nivelacion-rubber.png',
    badgeText: 'Favorito Capra',
    badgeColor: 'bg-[#B5838D]',
    isAvailable: true,
    tags: ['Pestañas', 'Efecto Rímel', 'Mirada'],
  },
  {
    id: 'capra-alisado-org',
    name: 'Alisado Orgánico Efecto Espejo & Hidratación Profunda',
    category: 'estilismo',
    priceUSD: 45,
    durationMinutes: 150,
    shortDescription: 'Alisado libre de formol con brillo tridimensional y sellado térmico.',
    fullDescription: 'Fórmula enriquecida con aminoácidos y aceites nobles para eliminar el frizz al 100% y devolver la sedosidad.',
    idealFor: 'Cabello liso, brillante y saludable',
    imageUrl: '/images/bano-polygel.png',
    badgeText: 'Estilismo VIP',
    badgeColor: 'bg-[#C5A059]',
    isAvailable: true,
    tags: ['Alisado', 'Brillo Espejo', 'Hidratación'],
  },
  {
    id: 'capra-secado-ondas',
    name: 'Secado Editorial, Brushing & Ondas Glamour',
    category: 'estilismo',
    priceUSD: 15,
    durationMinutes: 60,
    shortDescription: 'Lavado spa, termoprotección y estilizado profesional de larga duración.',
    fullDescription: 'Incluye lavado con línea profesional, masaje capilar relajante y estilizado con cepillo o tenaza.',
    idealFor: 'Eventos o lucir impecable toda la semana',
    imageUrl: '/images/esmaltado-pies.png',
    badgeText: 'Peluquería',
    badgeColor: 'bg-[#B5838D]',
    isAvailable: true,
    tags: ['Secado', 'Ondas', 'Estilismo'],
  },
  {
    id: 'capra-makeup-social',
    name: 'Maquillaje Profesional Social & Novias (Blindado HD)',
    category: 'maquillaje',
    priceUSD: 35,
    durationMinutes: 75,
    shortDescription: 'Piel blindada a prueba de sudor y lágrimas con pestañas incluidas.',
    fullDescription: 'Preparación de piel de alta gama, técnica de piel blindada resistente al clima húmedo y pestañas postizas.',
    idealFor: 'Graduaciones, bodas y sesiones fotográficas',
    imageUrl: '/images/sistema-polygel.png',
    badgeText: 'By María Capra',
    badgeColor: 'bg-[#C5A059]',
    isAvailable: true,
    tags: ['Maquillaje HD', 'Piel Blindada', 'Pestañas'],
  },
  {
    id: 'capra-nails-rubber',
    name: 'Manicure Rusa + Nivelación Rubber / Polygel',
    category: 'nails',
    priceUSD: 20,
    durationMinutes: 90,
    shortDescription: 'Limpieza profunda de cutícula y estructura resistente de acabado natural.',
    fullDescription: 'Manicura combinada con herramientas esterilizadas y nivelación con base rubber o polygel.',
    idealFor: 'Uñas impecables por 21+ días',
    imageUrl: '/images/nivelacion-rubber.png',
    badgeText: 'Nails Bar',
    badgeColor: 'bg-[#B5838D]',
    isAvailable: true,
    tags: ['Manicure Rusa', 'Rubber', 'Polygel'],
  },
  {
    id: 'capra-pedi-spa',
    name: 'Pedicure Spa Detox & Esmaltado Semipermanente',
    category: 'nails',
    priceUSD: 18,
    durationMinutes: 60,
    shortDescription: 'Sales relajantes, exfoliación botánica, retiro de callosidades y gel.',
    fullDescription: 'Ritual de descanso para pies con exfoliación hidratante y esmaltado semipermanente.',
    idealFor: 'Pies suaves y renovados',
    imageUrl: '/images/pedi-spa.png',
    badgeText: 'Spa Pies',
    badgeColor: 'bg-[#B5838D]',
    isAvailable: true,
    tags: ['Pedicure Spa', 'Semipermanente'],
  },
  {
    id: 'capra-depi-corporal',
    name: 'Depilación Corporal Integral con Cera Miel / Española',
    category: 'depilacion',
    priceUSD: 22,
    durationMinutes: 45,
    shortDescription: 'Cabina privada climatizada con protocolo suave post-depilatorio.',
    fullDescription: 'Incluye piernas completas, axilas y línea de bikini con loción calmante de aloe y manzanilla.',
    idealFor: 'Piel suave libre de irritación',
    imageUrl: '/images/esmaltado-semipermanente.png',
    badgeText: 'Cabina Privada',
    badgeColor: 'bg-[#B5838D]',
    isAvailable: true,
    tags: ['Depilación', 'Cera', 'Cabina'],
  },
  {
    id: 'capra-curso-cejas',
    name: 'CURSO: Especialista en Diseño de Cejas & Pestañas (Capra Academy)',
    category: 'cursos',
    priceUSD: 80,
    durationMinutes: 240,
    shortDescription: 'Formación intensiva teórico-práctica con materiales y certificado avalado.',
    fullDescription: 'Aprende visagismo, laminado, punto por punto y manejo de clientas con María Giovanna Capra. Incluye guía impresa, materiales en clase y certificado.',
    idealFor: 'Emprendedoras que desean iniciar su propio negocio',
    imageUrl: '/images/sistema-polygel.png',
    badgeText: 'Capra Academy',
    badgeColor: 'bg-[#C5A059]',
    isAvailable: true,
    tags: ['Curso Certificado', 'Cejas y Pestañas', 'Capra Academy'],
  },
  {
    id: 'capra-curso-automaq',
    name: 'CURSO: Automaquillaje & Piel Perfecta (Capra Academy)',
    category: 'cursos',
    priceUSD: 50,
    durationMinutes: 180,
    shortDescription: 'Aprende a maquillar tu rostro para el día y la noche como una profesional.',
    fullDescription: 'Reconocimiento de tu tipo de piel, correcciones, contorno, transición de sombras y sellado duradero.',
    idealFor: 'Dominar tu propio maquillaje paso a paso',
    imageUrl: '/images/bano-polygel.png',
    badgeText: 'Capra Academy',
    badgeColor: 'bg-[#C5A059]',
    isAvailable: true,
    tags: ['Curso', 'Automaquillaje', 'Capra Academy'],
  },
];

const CAPRA_CATEGORIES = [
  { id: 'all', label: 'Todos (Servicios & Cursos)' },
  { id: 'cejas_pestanas', label: 'Cejas & Pestañas' },
  { id: 'estilismo', label: 'Estilismo & Alisados' },
  { id: 'maquillaje', label: 'Maquillaje Pro' },
  { id: 'nails', label: 'Manicure & Pedicure' },
  { id: 'depilacion', label: 'Depilación Corporal' },
  { id: 'cursos', label: '🎓 Cursos Capra Academy' },
];

export const App: React.FC = () => {
  // Resolve active zone & tenant from URL / Hostname
  const resolveInitialRoute = () => {
    const host = window.location.hostname.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = new URLSearchParams(window.location.search);

    const isCentral =
      path.startsWith('/central') ||
      hash === '#central' ||
      search.has('central') ||
      host.startsWith('central.');

    const isSaasLanding =
      path.startsWith('/saas') ||
      hash === '#saas' ||
      search.get('zone') === 'saas';

    const salonParam = search.get('salon');
    let tenant: 'andrea-nails' | 'capra-studio' = 'andrea-nails';
    if (
      salonParam === 'capra-studio' ||
      salonParam === 'capra' ||
      host.startsWith('caprastudio.') ||
      path.startsWith('/capra')
    ) {
      tenant = 'capra-studio';
    }

    return { isCentral, isSaasLanding, tenant };
  };

  const initialRoute = resolveInitialRoute();
  const [isCentralRoute, setIsCentralRoute] = useState(initialRoute.isCentral);
  const [isSaasRoute, setIsSaasRoute] = useState(initialRoute.isSaasLanding);
  const [activeTenant, setActiveTenant] = useState<'andrea-nails' | 'capra-studio'>(initialRoute.tenant);

  // Legal modal state
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);

  // Store reactive state
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [promos, setPromos] = useState<PromoOffer[]>([]);
  const [gallerySlides, setGallerySlides] = useState<GallerySlide[]>(AppStore.getGallery());
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

  // Super Admin session state with 2FA protection
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => AppStore.isAdminAuthenticated());

  // Routing state for Share / Referral Page
  const [isShareRoute, setIsShareRoute] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return path.startsWith('/compartir') || hash === '#compartir' || search.has('compartir');
  });

  // Routing state for Dedicated Promo Page
  const [isPromoRoute, setIsPromoRoute] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = new URLSearchParams(window.location.search);
    return path.startsWith('/promociones') || hash === '#promociones' || search.has('promociones');
  });

  // Referred by friend parameter
  const [referralCode, setReferralCode] = useState<string>(() => {
    const search = new URLSearchParams(window.location.search);
    return search.get('ref') || '';
  });

  // Client booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<PromoOffer | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Load store data with Neon Cloud synchronization per activeTenant
  const refreshData = (targetTenant: 'andrea-nails' | 'capra-studio' = activeTenant) => {
    if (targetTenant === 'capra-studio') {
      setServices(CAPRA_FALLBACK_SERVICES);
      fetch('/api/services?tenant=capra-studio')
        .then(r => (r.ok ? r.json() : null))
        .then(json => {
          if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
            const mapped: ServiceItem[] = json.data.map((row: any) => ({
              id: row.id,
              name: row.name,
              category: row.category || 'cejas_pestanas',
              priceUSD: Number(row.price_usd || 20),
              durationMinutes: Number(row.duration_min || 60),
              shortDescription: row.description || '',
              fullDescription: row.description || '',
              idealFor: row.includes_note || 'Atención personalizada en Capra Studio',
              imageUrl: row.image_url || '/images/esmaltado-semipermanente.png',
              badgeText: row.category === 'cursos' ? 'Capra Academy' : 'Capra Studio',
              badgeColor: row.category === 'cursos' ? 'bg-[#C5A059]' : 'bg-[#B5838D]',
              isAvailable: row.is_active !== false,
              tags: [row.category || 'Belleza', 'By María Capra'],
            }));
            setServices(mapped);
          }
        })
        .catch(() => {});
    } else {
      setServices(AppStore.getServices());
      AppStore.fetchRemoteServices()
        .then(remoteServices => {
          if (remoteServices && remoteServices.length > 0) setServices(remoteServices);
        })
        .catch(() => {});
    }

    setPromos(AppStore.getPromos());
    setBookings(AppStore.getBookings());
    setBlockedSlots(AppStore.getBlockedSlots());
    setExchangeRate(AppStore.getExchangeRate());

    Promise.all([
      AppStore.fetchRemoteBookings(),
      AppStore.fetchRemoteBlockedSlots(),
      AppStore.fetchRemoteLoyaltyCards(),
      AppStore.fetchRemoteGallery(),
    ])
      .then(([remoteBookings, remoteBlockedSlots, _, remoteGallery]) => {
        if (remoteBookings) setBookings(remoteBookings);
        if (remoteBlockedSlots) setBlockedSlots(remoteBlockedSlots);
        if (remoteGallery && remoteGallery.length > 0) setGallerySlides(remoteGallery);
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshData(activeTenant);
  }, [activeTenant]);

  // Listen to browser navigation changes
  useEffect(() => {
    const handleLocationChange = () => {
      const r = resolveInitialRoute();
      setIsCentralRoute(r.isCentral);
      setIsSaasRoute(r.isSaasLanding);
      setActiveTenant(r.tenant);

      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      setIsAdminRoute(path.startsWith('/admin') || hash === '#admin' || search.has('admin'));
      setIsShareRoute(path.startsWith('/compartir') || hash === '#compartir' || search.has('compartir'));
      setIsPromoRoute(path.startsWith('/promociones') || hash === '#promociones' || search.has('promociones'));
      if (search.get('ref')) {
        setReferralCode(search.get('ref') || '');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Zone & Tenant Switchers
  const switchToCentral = () => {
    window.history.pushState(null, '', '/central');
    setIsCentralRoute(true);
    setIsSaasRoute(false);
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToSaasLanding = () => {
    window.history.pushState(null, '', '/?zone=saas');
    setIsSaasRoute(true);
    setIsCentralRoute(false);
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToTenant = (slug: 'andrea-nails' | 'capra-studio', openAdmin = false) => {
    const url = slug === 'capra-studio'
      ? openAdmin ? '/?salon=capra-studio&admin=1' : '/?salon=capra-studio'
      : openAdmin ? '/?salon=andrea-nails&admin=1' : '/?salon=andrea-nails';
    window.history.pushState(null, '', url);
    setActiveTenant(slug);
    setIsCentralRoute(false);
    setIsSaasRoute(false);
    setIsShareRoute(false);
    setIsPromoRoute(false);
    setIsAdminRoute(openAdmin);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation handlers
  const handleNavigateToShare = () => {
    window.history.pushState(null, '', '/compartir');
    setIsShareRoute(true);
    setIsAdminRoute(false);
    setIsPromoRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToPromo = () => {
    window.history.pushState(null, '', '/promociones');
    setIsPromoRoute(true);
    setIsShareRoute(false);
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitToCatalog = () => {
    const url = activeTenant === 'capra-studio' ? '/?salon=capra-studio' : '/';
    window.history.pushState(null, '', url);
    setIsAdminRoute(false);
    setIsShareRoute(false);
    setIsPromoRoute(false);
    setIsCentralRoute(false);
    setIsSaasRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // ─── ZONA 2: VANESEV CENTRAL (SUPER-ADMIN COMMAND CENTER FOR KARC0) ───────
  if (isCentralRoute) {
    return (
      <CentralDashboard
        onNavigateToSaaSLanding={switchToSaasLanding}
        onNavigateToTenant={(slug) => {
          if (slug === 'capra-studio' || slug === 'andrea-nails') {
            switchToTenant(slug, false);
          } else {
            switchToSaasLanding();
          }
        }}
      />
    );
  }

  // ─── ZONA 1: WEB COMERCIAL DE VENTA VANESEV (vanesev.com / ?zone=saas) ───
  if (isSaasRoute) {
    return (
      <VanesevLanding
        onOpenCentral={switchToCentral}
        onSelectTenant={(slug) => switchToTenant(slug, false)}
      />
    );
  }

  // ─── ZONA 3: PROTECTED ADMIN PRO V2 DEL SALÓN ACTIVO ──────────────────────
  if (isAdminRoute) {
    if (!isAdminAuthenticated && activeTenant === 'andrea-nails') {
      return (
        <AdminAuthGate
          onAuthenticated={() => {
            setIsAdminAuthenticated(true);
            refreshData(activeTenant);
          }}
          onExit={handleExitToCatalog}
        />
      );
    }

    return (
      <div>
        {/* Top Ecosystem Bar inside Admin */}
        <div className="bg-[#0B0D11] text-white px-4 py-2 border-b border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#C5A059] text-[#0B0D11] font-black text-[10px]">
              ZONA 3 · ADMIN PRO V2
            </span>
            <span className="font-bold text-white/90">
              Salón Activo: {activeTenant === 'capra-studio' ? 'Capra Studio (@caprastudio_)' : 'Andrea Labrador Nails Studio'}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => switchToTenant(activeTenant === 'capra-studio' ? 'andrea-nails' : 'capra-studio', true)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
            >
              Cambiar a Admin de {activeTenant === 'capra-studio' ? 'Andrea Nails' : 'Capra Studio'}
            </button>
            <button
              onClick={switchToCentral}
              className="px-3 py-1 rounded-lg bg-[#C5A059] text-[#0B0D11] font-black flex items-center gap-1 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Ir a VANESEV Central</span>
            </button>
          </div>
        </div>
        <AdminDashboard
          services={services}
          promos={promos}
          bookings={bookings}
          blockedSlots={blockedSlots}
          exchangeRate={exchangeRate}
          tenantSlug={activeTenant}
          tenantName={activeTenant === 'capra-studio' ? 'Capra Studio · By María Capra' : 'Andrea Labrador Nails Studio'}
          onRefreshData={() => refreshData(activeTenant)}
          onExitToCatalog={handleExitToCatalog}
          onLogout={() => {
            AppStore.clearAdminSession();
            setIsAdminAuthenticated(false);
          }}
        />
      </div>
    );
  }

  // --- RENDER DEDICATED SHARE / REFERRAL CLUB PAGE ---
  if (isShareRoute) {
    return (
      <SharePage
        onOpenBooking={handleOpenGeneralBooking}
        onExitToCatalog={handleExitToCatalog}
        exchangeRate={exchangeRate}
      />
    );
  }

  // --- RENDER DEDICATED PROMOTIONS PAGE ---
  if (isPromoRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-warm-100 text-warm-900 font-sans selection:bg-sage-200">
        <PromoPage
          promos={promos}
          services={services}
          exchangeRate={exchangeRate}
          onSelectPromoForBooking={handleSelectPromo}
          onOpenBooking={handleOpenGeneralBooking}
          onExitToCatalog={handleExitToCatalog}
        />
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          services={services}
          preSelectedService={selectedService}
          preSelectedPromo={selectedPromo}
          exchangeRate={exchangeRate}
          referralCode={referralCode}
          onBookingCreated={() => refreshData(activeTenant)}
        />
        <ClientAccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          onBookNewAppointment={handleOpenGeneralBooking}
        />
        <PWAInstallModal />
      </div>
    );
  }

  // --- RENDER PUBLIC CUSTOMER CATALOG (ZONA 4: CAPRA STUDIO OR ANDREA NAILS V2) ---
  const isCapra = activeTenant === 'capra-studio';

  return (
    <div className="min-h-screen flex flex-col bg-warm-100 text-warm-900 font-sans selection:bg-sage-200">
      {/* ══ BARRA RÁPIDA DE GOBERNANZA MULTI-ZONA VANESEV (ACCESO DIRECTO PARA KARC0) ══ */}
      <div className="bg-[#0B0D11] text-white px-3 sm:px-6 py-2 border-b border-[#C5A059]/30 flex flex-wrap items-center justify-between gap-2 text-[11px] z-50">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0B0D11] font-black uppercase tracking-wider text-[10px]">
            VANESEV CLOUD
          </span>
          <button
            onClick={switchToCentral}
            className="px-2.5 py-1 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/35 text-[#E5C158] border border-[#C5A059]/50 font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <Terminal className="w-3 h-3" />
            <span>1. Central (/central)</span>
          </button>
          <button
            onClick={() => switchToTenant('capra-studio', false)}
            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
              isCapra
                ? 'bg-[#B5838D] text-[#0B0D11]'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            2. Capra Studio (@caprastudio_)
          </button>
          <button
            onClick={() => switchToTenant('andrea-nails', false)}
            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
              !isCapra
                ? 'bg-emerald-400 text-[#0B0D11]'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            3. Andrea Labrador V2 (VIP)
          </button>
          <button
            onClick={switchToSaasLanding}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3 h-3 text-[#E5C158]" />
            <span>4. Web Comercial (vanesev.com)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchToTenant(activeTenant, true)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#E5C158] border border-white/15 font-bold flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Abrir Admin Pro V2 ({isCapra ? 'Capra' : 'Andrea'})</span>
          </button>
        </div>
      </div>

      {/* Sticky Top Header: PWA Install Banner + Client Navbar */}
      <div className="sticky top-0 z-40">
        <PWAInstallModal onOpenClientAccount={() => setIsAccountModalOpen(true)} />
        {isCapra ? (
          /* ══ NAVBAR EXCLUSIVO DE CAPRA STUDIO (VELVET MAUVE & 3D GOLD) ══ */
          <header className="bg-[#FDFBF9]/95 backdrop-blur-md border-b border-[#B5838D]/30 px-4 sm:px-8 py-3.5 shadow-xs">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#B5838D] to-[#8E5B66] border-2 border-[#C5A059] flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
                  CS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif font-bold text-lg sm:text-xl text-[#2D1E22] tracking-tight">
                      Capra Studio
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#B5838D]/15 text-[#8E5B66] border border-[#B5838D]/40">
                      By María Capra
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E5359] font-medium">
                    Salón de Belleza Integral &amp; Capra Academy &bull; 9:00 a 18:00
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsAccountModalOpen(true)}
                  className="px-3.5 py-2 rounded-full bg-[#F6EEF0] hover:bg-[#EAD8DC] text-[#5C3A42] border border-[#B5838D]/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Mi Ficha VIP (5 Sellos)</span>
                </button>
                <button
                  onClick={handleOpenGeneralBooking}
                  className="px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B5838D] to-[#9B6B75] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#F5E6C8]" />
                  <span>Agendar Cita o Curso</span>
                </button>
              </div>
            </div>
          </header>
        ) : (
          <Navbar
            onOpenBooking={handleOpenGeneralBooking}
            onOpenClientAccount={() => setIsAccountModalOpen(true)}
            onNavigateToShare={handleNavigateToShare}
            onNavigateToPromo={handleNavigateToPromo}
            exchangeRate={exchangeRate}
          />
        )}
      </div>

      {/* Main Public Content Sections */}
      <main className="flex-1 pb-16 sm:pb-0">
        {isCapra ? (
          /* ══ HERO EDITORIAL DE CAPRA STUDIO (BASADO EN CAPTURAS REALES DE @caprastudio_) ══ */
          <section className="relative overflow-hidden bg-gradient-to-b from-[#F9F2F4] via-[#FDFBF9] to-[#F5E9EC] py-12 sm:py-20 px-4 sm:px-8 border-b border-[#B5838D]/25">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B5838D]/15 border border-[#B5838D]/40 text-[#7A4953] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>@caprastudio_ &bull; Cejas · Pestañas · Peluquería · Maquillaje · Uñas · Cursos</span>
                </div>

                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2D1E22] leading-[1.1]">
                  Nos complace ser parte de tu{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9E6370] via-[#B5838D] to-[#C5A059]">
                    embellecimiento y armonía perfecta.
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-[#5C4348] leading-relaxed max-w-xl">
                  Bienvenida a <strong>Capra Studio — By María Giovanna Capra</strong>. Disfruta de nuestras{' '}
                  <strong>6 áreas especializadas</strong> con atención personalizada de lunes a sábado (9:00 a 18:00),
                  o fórmate como profesional certificada en nuestra <strong>Capra Academy</strong>.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={handleOpenGeneralBooking}
                    className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#B5838D] to-[#8E5B66] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-[#F5E6C8]" />
                    <span>Reservar Turno en Capra Studio</span>
                  </button>
                  <a
                    href="https://wa.me/584247429530?text=%C2%A1Hola%20Capra%20Studio!%20%E2%9C%A8%20Vengo%20desde%20su%20App%20Oficial%20y%20deseo%20informaci%C3%B3n%20sobre%20citas%20y%20cursos."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 rounded-full bg-white hover:bg-[#F9F2F4] text-[#2D1E22] border border-[#B5838D]/40 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xs"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp: +58 424-7429530</span>
                  </a>
                </div>

                {/* 6 Departamentos Reales en Neon DB */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4">
                  {[
                    { title: 'Cejas & Pestañas', desc: 'Laminado, Visagismo y Extensiones' },
                    { title: 'Estilismo & Alisados', desc: 'Cirugía Capilar, Secado y Color' },
                    { title: 'Maquillaje Pro', desc: 'Social, Novias y Piel Blindada HD' },
                    { title: 'Manicure & Pedicure', desc: 'Manicura Rusa, Rubber y Spa Pies' },
                    { title: 'Depilación Corporal', desc: 'Cabina Privada con Cera Suave' },
                    { title: '🎓 Capra Academy', desc: 'Cursos Intensivos con Certificado' },
                  ].map((zone) => (
                    <div
                      key={zone.title}
                      className="p-3 rounded-2xl bg-white/90 border border-[#B5838D]/30 shadow-2xs"
                    >
                      <span className="font-serif font-bold text-xs text-[#2D1E22] block">
                        {zone.title}
                      </span>
                      <span className="text-[10px] text-[#6E5359] leading-tight block mt-0.5">
                        {zone.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarjeta Derecha: Identidad & Academia Capra */}
              <div className="lg:col-span-5">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2D1E22] via-[#3B262C] to-[#1F1417] text-white border-2 border-[#C5A059]/60 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#E5C158] font-bold block">
                        Salón &amp; Academia Oficial
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-white">
                        Capra Studio VIP
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#E5C158] font-serif font-black text-xl">
                      CS
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-white/85">
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                      <Clock className="w-4 h-4 text-[#E5C158] shrink-0" />
                      <div>
                        <span className="font-bold text-white block">Horario de Atención</span>
                        <span>Lunes a Sábado: 9:00 AM – 6:00 PM</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                      <Users className="w-4 h-4 text-[#E5C158] shrink-0" />
                      <div>
                        <span className="font-bold text-white block">Dirección &amp; Equipo Especializado</span>
                        <span>María Giovanna Capra &bull; Staff Multi-Zona en Base de Datos</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                      <Award className="w-4 h-4 text-[#E5C158] shrink-0" />
                      <div>
                        <span className="font-bold text-white block">Tarjeta de Fidelidad Capra (5 Sellos)</span>
                        <span>Acumula 5 visitas verificadas y recibe tu cortesía VIP.</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => switchToTenant('capra-studio', true)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C158] text-[#1F1417] font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Explorar Panel Admin Pro V2 de Capra Studio</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <Hero
            onOpenBooking={handleOpenGeneralBooking}
            onSelectServiceById={handleSelectServiceById}
            gallerySlides={gallerySlides}
          />
        )}

        {/* Visual Loyalty & First Visit Banner */}
        <ClubInviteSection onNavigateToShare={handleNavigateToShare} />

        {/* Catálogo Completo de Servicios (Multi-Tenant) */}
        <ServiceCatalog
          services={services}
          exchangeRate={exchangeRate}
          onSelectServiceForBooking={handleSelectService}
          customCategories={isCapra ? CAPRA_CATEGORIES : undefined}
          studioSubtitle={
            isCapra
              ? 'Explora nuestros 6 departamentos especializados y los cursos profesionales certificados de Capra Academy:'
              : undefined
          }
        />

        {/* Tarjeta Digital & Club VIP de Fidelización */}
        <LoyaltyClub />

        <StudioPolicies />

        <PaymentMethods />
      </main>

      {/* Client Footer */}
      <Footer
        onOpenBooking={handleOpenGeneralBooking}
        onNavigateToShare={handleNavigateToShare}
        onOpenLegal={(type) => setActiveLegalModal(type)}
      />

      {/* Sticky Mobile Fast Booking Bar for Clients */}
      <div className="fixed bottom-0 inset-x-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-sage-200/80 sm:hidden flex items-center justify-between shadow-luxury">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-sage-600 block">
            {isCapra ? 'Capra Studio' : 'Agenda Abierta'}
          </span>
          <span className="font-serif font-bold text-sm text-sage-900">
            Citas Disponibles
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="p-2.5 rounded-full bg-sage-100 text-sage-800"
            title="Mi Ficha VIP"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-pwa-install'))}
            className="p-2.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-xs"
            title="Instalar App Oficial"
          >
            <Download className="w-4 h-4 text-amber-700 stroke-[2.5]" />
          </button>
          <a
            href={isCapra ? 'https://wa.me/584247429530' : 'https://wa.me/584241360937'}
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
        referralCode={referralCode}
        onNavigateToShare={handleNavigateToShare}
      />

      {/* Client Account & Loyalty Card Modal */}
      <ClientAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onBookNewAppointment={handleOpenGeneralBooking}
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner onOpenLegal={(type) => setActiveLegalModal(type)} />

      {/* Legal Modals */}
      <LegalModals activeModal={activeLegalModal} onClose={() => setActiveLegalModal(null)} />
    </div>
  );
};

export default App;
