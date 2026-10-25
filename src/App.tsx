import React, { useState, useEffect, Suspense } from 'react';
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
import { AdminAuthGate } from './components/AdminAuthGate';
import { SharePage } from './components/SharePage';
import { ClubInviteSection } from './components/ClubInviteSection';
import { PWAInstallModal } from './components/PWAInstallModal';
import { LegalModals, LegalModalType } from './components/LegalModals';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { CapraStudioExperience } from './components/CapraStudioExperience';
import { AppStore } from './services/store';
import { ServiceItem, PromoOffer, GallerySlide } from './types';

// Lazy-loaded Heavy Admin & Super-Admin Bundles (Code-Splitting for 3G/4G Mobile Speed)
const CentralDashboard = React.lazy(() =>
  import('./components/CentralDashboard').then((m) => ({ default: m.CentralDashboard }))
);
const VanesevLanding = React.lazy(() =>
  import('./components/VanesevLanding').then((m) => ({ default: m.VanesevLanding }))
);
const AdminDashboard = React.lazy(() =>
  import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
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
  { id: 'estilismo_alisados', label: 'Estilismo & Alisados' },
  { id: 'maquillaje', label: 'Maquillaje Pro' },
  { id: 'manicure_pedicure', label: 'Manicure & Pedicure' },
  { id: 'depilacion', label: 'Depilación Corporal' },
  { id: 'cursos', label: '🎓 Cursos Capra Academy' },
];

export const App: React.FC = () => {
  // Resolve active zone & tenant from URL path (Single Domain Architecture - No Subdomains)
  const resolveInitialRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = new URLSearchParams(window.location.search);

    const isCentral =
      path.startsWith('/central') ||
      hash === '#central' ||
      search.has('central');

    const salonParam = search.get('salon');
    const isCapra =
      salonParam === 'capra-studio' ||
      salonParam === 'capra' ||
      path.startsWith('/capra');

    const isAndrea =
      salonParam === 'andrea-nails' ||
      salonParam === 'andrea' ||
      path.startsWith('/andrea');

    const isAdmin =
      path.includes('/admin') ||
      hash === '#admin' ||
      search.has('admin');

    const tenant: 'andrea-nails' | 'capra-studio' = isCapra ? 'capra-studio' : 'andrea-nails';

    // Root SaaS route: on apex domain or /, or explicitly /saas
    const isSaasLanding =
      !isCentral &&
      !isCapra &&
      !isAndrea &&
      (path === '/' || path === '' || path.startsWith('/saas') || hash === '#saas' || search.get('zone') === 'saas');

    return { isCentral, isSaasLanding, isAdmin, tenant };
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
  const [isAdminRoute, setIsAdminRoute] = useState(initialRoute.isAdmin);

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
    AppStore.setActiveTenant(targetTenant);
    if (targetTenant === 'capra-studio') {
      setServices(CAPRA_FALLBACK_SERVICES);
      fetch('/api/services?tenant=capra-studio')
        .then(r => (r.ok ? r.json() : null))
        .then(json => {
          const rawServices = Array.isArray(json?.services) ? json.services : Array.isArray(json?.data) ? json.data : null;
          if (rawServices && rawServices.length > 0) {
            const mapped: ServiceItem[] = rawServices.map((row: any) => ({
              id: row.id,
              name: row.name,
              category: row.category || 'cejas_pestanas',
              priceUSD: Number(row.priceUSD ?? row.price_usd ?? 20),
              durationMinutes: Number(row.durationMinutes ?? row.duration_min ?? 60),
              shortDescription: row.shortDescription || row.description || '',
              fullDescription: row.fullDescription || row.description || '',
              idealFor: row.idealFor || row.includes_note || 'Atención personalizada en Capra Studio',
              imageUrl: row.imageUrl || row.image_url || '/images/esmaltado-semipermanente.png',
              badgeText: row.badgeText || (row.category === 'cursos' ? 'Capra Academy' : 'Capra Studio'),
              badgeColor: row.category === 'cursos' ? 'bg-[#C5A059]' : 'bg-[#B5838D]',
              isAvailable: row.isAvailable !== false && row.is_active !== false,
              tags: Array.isArray(row.tags) ? row.tags : [row.category || 'Belleza', 'By María Capra'],
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
    AppStore.setActiveTenant(activeTenant);
    refreshData(activeTenant);

    // Dynamic PWA Manifest & Title per Tenant
    const isCapra = activeTenant === 'capra-studio';
    document.title = isCentralRoute
      ? 'VANESEV Central • Super-Admin Command Center'
      : isSaasRoute
      ? 'VANESEV Cloud • Suite SaaS Multi-Tenant de Belleza'
      : isCapra
      ? 'Capra Studio • By María Capra | Salón & Capra Academy'
      : 'Andrea Labrador • Nails Studio | Cordero & San Cristóbal';

    const manifestLink = document.querySelector("link[rel='manifest']") as HTMLLinkElement | null;
    if (manifestLink) {
      manifestLink.href = `/api/manifest?tenant=${activeTenant}`;
    }
  }, [activeTenant, isCentralRoute, isSaasRoute]);

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
  // Synchronize browser history (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const route = resolveInitialRoute();
      setIsCentralRoute(route.isCentral);
      setIsSaasRoute(route.isSaasLanding);
      setIsAdminRoute(route.isAdmin);
      setActiveTenant(route.tenant);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const switchToCentral = () => {
    window.history.pushState(null, '', '/central');
    setIsCentralRoute(true);
    setIsSaasRoute(false);
    setIsAdminRoute(false);
    setIsShareRoute(false);
    setIsPromoRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToSaasLanding = () => {
    window.history.pushState(null, '', '/');
    setIsSaasRoute(true);
    setIsCentralRoute(false);
    setIsAdminRoute(false);
    setIsShareRoute(false);
    setIsPromoRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToTenant = (slug: 'andrea-nails' | 'capra-studio', openAdmin = false) => {
    const basePath = slug === 'capra-studio' ? '/capra-studio' : '/andrea-nails';
    const url = openAdmin ? `${basePath}/admin` : basePath;
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
    const url = activeTenant === 'capra-studio' ? '/capra-studio' : '/andrea-nails';
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

  const lazyFallback = (
    <div className="min-h-screen bg-[#0B0D11] text-white flex items-center justify-center p-6">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs font-semibold text-[#E5C158] tracking-widest uppercase">
          Cargando Módulo Cloud VANESEV...
        </p>
      </div>
    </div>
  );

  // ─── ZONA 2: VANESEV CENTRAL (SUPER-ADMIN COMMAND CENTER FOR KARC0) ───────
  if (isCentralRoute) {
    return (
      <Suspense fallback={lazyFallback}>
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
      </Suspense>
    );
  }

  // ─── ZONA 1: WEB COMERCIAL DE VENTA VANESEV (vanesev.com / ?zone=saas) ───
  if (isSaasRoute) {
    return (
      <Suspense fallback={lazyFallback}>
        <VanesevLanding
          onOpenCentral={switchToCentral}
          onSelectTenant={(slug) => switchToTenant(slug, false)}
        />
      </Suspense>
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
      <Suspense fallback={lazyFallback}>
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
      </Suspense>
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
          tenantSlug={activeTenant}
          tenantName={activeTenant === 'capra-studio' ? 'Capra Studio' : 'Andrea Labrador Nails Studio'}
          tenantWhatsapp={activeTenant === 'capra-studio' ? '584247429530' : '584241360937'}
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

  if (isCapra) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFBF9] text-[#2D1E22] font-sans selection:bg-[#B5838D]/30 selection:text-[#2D1E22] overflow-x-hidden">
        <PWAInstallModal onOpenClientAccount={() => setIsAccountModalOpen(true)} />
        <CapraStudioExperience
          services={services}
          exchangeRate={exchangeRate}
          onOpenBooking={(s) => s ? handleSelectService(s) : handleOpenGeneralBooking()}
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
        />
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          preSelectedService={selectedService}
          preSelectedPromo={selectedPromo}
          services={services}
          exchangeRate={exchangeRate}
          referralCode={referralCode}
          tenantSlug="capra-studio"
          tenantName="Capra Studio · By María Capra"
          tenantWhatsapp="584247429530"
          onBookingCreated={() => refreshData('capra-studio')}
          onNavigateToShare={handleNavigateToShare}
        />
        <ClientAccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          onBookNewAppointment={handleOpenGeneralBooking}
        />
        <LegalModals
          activeModal={activeLegalModal}
          onClose={() => setActiveLegalModal(null)}
        />
        <CookieConsentBanner onOpenLegal={(type) => setActiveLegalModal(type)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-100 text-warm-900 font-sans selection:bg-sage-200 overflow-x-hidden">
      {/* Sticky Top Header: PWA Install Banner + Client Navbar */}
      <div className="sticky top-0 z-40">
        <PWAInstallModal onOpenClientAccount={() => setIsAccountModalOpen(true)} />
        <Navbar
          onOpenBooking={handleOpenGeneralBooking}
          onOpenClientAccount={() => setIsAccountModalOpen(true)}
          onNavigateToShare={handleNavigateToShare}
          onNavigateToPromo={handleNavigateToPromo}
          exchangeRate={exchangeRate}
        />
      </div>

      {/* Main Public Content Sections */}
      <main className="flex-1 pb-16 sm:pb-0">
        <Hero
          onOpenBooking={handleOpenGeneralBooking}
          onSelectServiceById={handleSelectServiceById}
          gallerySlides={gallerySlides}
        />

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
        <LoyaltyClub
          tenantSlug={activeTenant}
          tenantName={isCapra ? 'Capra Studio · By María Capra' : 'Andrea Labrador Nails Studio'}
        />

        <StudioPolicies tenantSlug={activeTenant} />

        <PaymentMethods tenantSlug={activeTenant} />
      </main>

      {/* Client Footer */}
      <Footer
        onOpenBooking={handleOpenGeneralBooking}
        onNavigateToShare={handleNavigateToShare}
        onOpenLegal={(type) => setActiveLegalModal(type)}
        tenantSlug={activeTenant}
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
        tenantSlug={activeTenant}
        tenantName={isCapra ? 'Capra Studio' : 'Andrea Labrador Nails Studio'}
        tenantWhatsapp={isCapra ? '584247429530' : '584241360937'}
        onBookingCreated={() => refreshData(activeTenant)}
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
