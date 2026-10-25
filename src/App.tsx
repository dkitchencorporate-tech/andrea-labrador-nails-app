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

const CAPRA_EDITORIAL_IMAGES: Record<string, string> = {
  'capra-cejas-lam': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85',
  'capra-pestanas-vol': 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=900&q=85',
  'capra-alisado-org': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85',
  'capra-secado-ondas': 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=85',
  'capra-makeup-social': 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=85',
  'capra-nails-rubber': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85',
  'capra-pedi-spa': 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=85',
  'capra-depi-corporal': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85',
  'capra-curso-cejas': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=85',
  'capra-curso-automaq': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85',
};

const resolveCapraServiceImage = (id: string, category: string, name: string, rawUrl?: string): string => {
  if (rawUrl && !rawUrl.startsWith('/images/')) {
    return rawUrl;
  }
  if (CAPRA_EDITORIAL_IMAGES[id]) {
    return CAPRA_EDITORIAL_IMAGES[id];
  }
  const lower = `${id} ${category} ${name}`.toLowerCase();
  if (lower.includes('pestaña') || lower.includes('pestana') || lower.includes('rimel')) {
    return CAPRA_EDITORIAL_IMAGES['capra-pestanas-vol'];
  }
  if (lower.includes('ceja') && !lower.includes('curso')) {
    return CAPRA_EDITORIAL_IMAGES['capra-cejas-lam'];
  }
  if (lower.includes('alisado') || lower.includes('hidratac')) {
    return CAPRA_EDITORIAL_IMAGES['capra-alisado-org'];
  }
  if (lower.includes('secado') || lower.includes('onda') || lower.includes('estilismo')) {
    return CAPRA_EDITORIAL_IMAGES['capra-secado-ondas'];
  }
  if (lower.includes('automaq')) {
    return CAPRA_EDITORIAL_IMAGES['capra-curso-automaq'];
  }
  if (lower.includes('curso') || lower.includes('academy')) {
    return CAPRA_EDITORIAL_IMAGES['capra-curso-cejas'];
  }
  if (lower.includes('maquillaje') || lower.includes('makeup') || lower.includes('novia')) {
    return CAPRA_EDITORIAL_IMAGES['capra-makeup-social'];
  }
  if (lower.includes('pedi') || lower.includes('pie')) {
    return CAPRA_EDITORIAL_IMAGES['capra-pedi-spa'];
  }
  if (lower.includes('depi') || lower.includes('cera')) {
    return CAPRA_EDITORIAL_IMAGES['capra-depi-corporal'];
  }
  if (lower.includes('nail') || lower.includes('manicur')) {
    return CAPRA_EDITORIAL_IMAGES['capra-nails-rubber'];
  }
  return CAPRA_EDITORIAL_IMAGES['capra-cejas-lam'];
};

const CAPRA_FALLBACK_SERVICES: ServiceItem[] = [
  {
    id: 'capra-cejas-lam',
    name: 'Laminado de Cejas + Diseño y Pigmento HD',
    category: 'cejas_pestanas',
    priceUSD: 18,
    durationMinutes: 45,
    shortDescription: 'Visagismo personalizado con efecto pluma y nutrición profunda con keratina.',
    fullDescription: 'Diseño arquitectónico de cejas según tu morfología facial, laminado nutritivo, pigmentación híbrida de larga duración y perfilado orgánico.',
    idealFor: 'Mirada definida y cejas estilizadas por 5 semanas',
    imageUrl: CAPRA_EDITORIAL_IMAGES['capra-cejas-lam'],
    badgeText: 'Signature Miradas',
    badgeColor: 'bg-[#8E4A59]',
    isAvailable: true,
    tags: ['Cejas HD', 'Laminado', 'Visagismo'],
  },
  {
    id: 'capra-pestanas-vol',
    name: 'Extensiones de Pestañas Efecto Rímel / Volumen Sutil',
    category: 'cejas_pestanas',
    priceUSD: 25,
    durationMinutes: 90,
    shortDescription: 'Aplicación pelo a pelo ultraligera en fibras de seda sin dañar tu pestaña natural.',
    fullDescription: 'Mapping personalizado según la curvatura de tu párpado con fibras hipoalergénicas de acabado aterciopelado.',
    idealFor: 'Despertar con mirada expresiva todos los días',
    imageUrl: CAPRA_EDITORIAL_IMAGES['capra-pestanas-vol'],
    badgeText: 'Favorito Capra',
    badgeColor: 'bg-[#8E4A59]',
    isAvailable: true,
    tags: ['Pestañas', 'Efecto Rímel', 'Mirada'],
  },
  {
    id: 'capra-alisado-org',
    name: 'Alisado Orgánico Efecto Espejo & Hidratación Profunda',
    category: 'estilismo',
    priceUSD: 45,
    durationMinutes: 150,
    shortDescription: 'Alisado libre de formol con brillo tridimensional y sellado térmico de aminoácidos.',
    fullDescription: 'Fórmula botánica enriquecida con aminoácidos y aceites nobles para disciplinar la hebra al 100% y devolver la sedosidad espejo.',
    idealFor: 'Cabello liso, brillante y saludable por meses',
    imageUrl: CAPRA_EDITORIAL_IMAGES['capra-alisado-org'],
    badgeText: 'Hair Couture',
    badgeColor: 'bg-[#B8925A]',
    isAvailable: true,
    tags: ['Alisado', 'Brillo Espejo', 'Hidratación'],
  },
  {
    id: 'capra-secado-ondas',
    name: 'Secado Editorial, Brushing & Ondas Glamour',
    category: 'estilismo',
    priceUSD: 15,
    durationMinutes: 60,
    shortDescription: 'Lavado spa capilar, termoprotección y estilizado profesional de larga duración.',
    fullDescription: 'Incluye diagnóstico capilar, lavado relajante en lavacabezas spa y estilizado con cepillo o ondas de pasarela.',
    idealFor: 'Eventos especiales o lucir impecable toda la semana',
    imageUrl: CAPRA_EDITORIAL_IMAGES['capra-secado-ondas'],
    badgeText: 'Estilismo',
    badgeColor: 'bg-[#8E4A59]',
    isAvailable: true,
    tags: ['Secado', 'Ondas', 'Brushing'],
  },
  {
    id: 'capra-makeup-social',
    name: 'Maquillaje Profesional Social & Novias (Blindado HD)',
    category: 'maquillaje',
    priceUSD: 35,
    durationMinutes: 75,
    shortDescription: 'Piel blindada de alta definición a prueba de clima, sudor y lágrimas con pestañas.',
    fullDescription: 'Preparación dermo-cosmética de alta gama, técnica de piel blindada luminosa y diseño de ojos personalizado por María Capra.',
    idealFor: 'Bodas, graduaciones y sesiones editoriales',
    imageUrl: CAPRA_EDITORIAL_IMAGES['capra-makeup-social'],
    badgeText: 'By María Capra',
    badgeColor: 'bg-[#B8925A]',
    isAvailable: true,
    tags: ['Maquillaje HD', 'Piel Blindada', 'Novias'],
  },
  {
    id: 'capra-nails-rubber',
    name: 'Manicure Rusa Combinada + Nivelación Rubber',
    category: 'nails',
    priceUSD: 20,
    durationMinutes: 90,
    shortDescription: 'Limpieza micro-precisa de cutícula y arquitectura de uña con acabado natural.',
    fullDescription: 'Manicura rusa con instrumental esterilizado en autoclave, nivelación anatómica con base rubber y esmaltado en gel.',
    idealFor: 'Manos impecables por más de 21 días',
    imageUrl: CAPRA_EDITORIAL_IMAGES['capra-nails-rubber'],
    badgeText: 'Nails Atelier',
    badgeColor: 'bg-[#8E4A59]',
    isAvailable: true,
    tags: ['Manicure Rusa', 'Rubber', 'Gel'],
  },
  {
    id: 'capra-pedi-spa',
    name: 'Pedicure Spa Botánico & Esmaltado Semipermanente',
    category: 'nails',
    priceUSD: 18,
    durationMinutes: 60,
    shortDescription: 'Sales minerales, exfoliación orgánica, terapia de hidratación y gel.',
    fullDescription: 'Ritual de descanso podal con exfoliación nutritiva, retiro suave de asperezas y esmaltado de larga duración.',
    idealFor: 'Pies descansados, suaves y renovados',
    imageUrl: CAPRA_EDITORIAL_IMAGES['capra-pedi-spa'],
    badgeText: 'Ritual Spa',
    badgeColor: 'bg-[#8E4A59]',
    isAvailable: true,
    tags: ['Pedicure Spa', 'Semipermanente'],
  },
  {
    id: 'capra-depi-corporal',
    name: 'Depilación Corporal en Cabina Privada (Cera Miel / Española)',
    category: 'depilacion',
    priceUSD: 22,
    durationMinutes: 45,
    shortDescription: 'Cabina climatizada con protocolo calmante post-depilatorio de aloe y manzanilla.',
    fullDescription: 'Protocolo higiénico descartable en cabina privada para piernas completas, axilas y línea de bikini.',
    idealFor: 'Piel de seda libre de irritación',
    imageUrl: CAPRA_EDITORIAL_IMAGES['capra-depi-corporal'],
    badgeText: 'Cabina Privada',
    badgeColor: 'bg-[#8E4A59]',
    isAvailable: true,
    tags: ['Depilación', 'Cera Española', 'Cabina'],
  },
  {
    id: 'capra-curso-cejas',
    name: 'MASTERCLASS: Especialista en Diseño de Cejas & Pestañas',
    category: 'cursos',
    priceUSD: 80,
    durationMinutes: 240,
    shortDescription: 'Formación intensiva teórico-práctica con materiales en mesa, guía y certificado.',
    fullDescription: 'Aprende visagismo arquitectónico, laminado, pigmentación híbrida, aplicación punto por punto y rentabilidad de salón junto a María Giovanna Capra.',
    idealFor: 'Emprendedoras que buscan iniciar o escalar su estudio',
    imageUrl: CAPRA_EDITORIAL_IMAGES['capra-curso-cejas'],
    badgeText: 'Capra Academy',
    badgeColor: 'bg-[#B8925A]',
    isAvailable: true,
    tags: ['Certificado', 'Práctica Real', 'Capra Academy'],
  },
  {
    id: 'capra-curso-automaq',
    name: 'MASTERCLASS: Automaquillaje & Piel Blindada Pro',
    category: 'cursos',
    priceUSD: 50,
    durationMinutes: 180,
    shortDescription: 'Domina la preparación de tu piel, visagismo y transición de día a noche.',
    fullDescription: 'Diagnóstico de tu cosmetiquera, preparación de piel luminosa, contorno sutil, técnica de ojos y sellado de larga duración.',
    idealFor: 'Dominar tu imagen personal con acabado profesional',
    imageUrl: CAPRA_EDITORIAL_IMAGES['capra-curso-automaq'],
    badgeText: 'Capra Academy',
    badgeColor: 'bg-[#B8925A]',
    isAvailable: true,
    tags: ['Automaquillaje', 'Piel Blindada', 'Capra Academy'],
  },
];

const CAPRA_CATEGORIES = [
  { id: 'all', label: 'Todos los Servicios' },
  { id: 'cejas_pestanas', label: 'Cejas & Pestañas' },
  { id: 'estilismo_alisados', label: 'Estilismo & Alisados' },
  { id: 'maquillaje', label: 'Maquillaje Pro' },
  { id: 'manicure_pedicure', label: 'Manicure & Pies' },
  { id: 'depilacion', label: 'Cabina Depilación' },
  { id: 'cursos', label: 'Capra Academy' },
];

export const App: React.FC = () => {
  // Resolve active zone & tenant from URL path (Single Domain Architecture: /m/<slug> or /<slug> - No Subdomains)
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
      path.startsWith('/capra') ||
      path.startsWith('/m/capra');

    const isAndrea =
      salonParam === 'andrea-nails' ||
      salonParam === 'andrea' ||
      path.startsWith('/andrea') ||
      path.startsWith('/m/andrea');

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
              imageUrl: resolveCapraServiceImage(row.id, row.category || 'cejas_pestanas', row.name || '', row.imageUrl || row.image_url),
              badgeText: row.badgeText || (row.category === 'cursos' ? 'Capra Academy' : 'Capra Studio'),
              badgeColor: row.category === 'cursos' ? 'bg-[#B8925A]' : 'bg-[#8E4A59]',
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
      ? 'VANESEV Central · Centro de Control Multi-Sede'
      : isSaasRoute
      ? 'VANESEV — Arquitectura Digital, Reservas & Fidelización para Salones de Belleza'
      : isCapra
      ? 'Capra Studio · By María Capra | Salón de Belleza & Capra Academy'
      : 'Andrea Labrador · Nails Studio | Cordero & San Cristóbal';

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
      setIsAdminRoute(r.isAdmin);

      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
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
    <div className="min-h-screen bg-[#0C0A0E] text-[#FBF9F6] flex items-center justify-center p-6">
      <div className="text-center space-y-3">
        <div className="w-9 h-9 rounded-full border-2 border-[#8E1B46] border-t-[#C8A97E] animate-spin mx-auto" />
        <p className="text-[11px] font-mono text-[#C8A97E] tracking-[0.2em] uppercase">
          VANESEV · Iniciando Entorno
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
          <div className="bg-[#0C0A0E] text-[#FBF9F6] px-4 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-[#8E1B46] text-white font-mono font-bold text-[10px] tracking-wider uppercase">
                ADMIN SEDE
              </span>
              <span className="font-semibold text-white/90">
                {activeTenant === 'capra-studio' ? 'Capra Studio (@caprastudio_)' : 'Andrea Labrador Nails Studio'}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => switchToTenant(activeTenant === 'capra-studio' ? 'andrea-nails' : 'capra-studio', true)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white/90 font-medium transition-colors cursor-pointer"
              >
                Cambiar a {activeTenant === 'capra-studio' ? 'Andrea Nails' : 'Capra Studio'}
              </button>
              <button
                onClick={switchToCentral}
                className="px-3 py-1 rounded-lg bg-[#C8A97E] text-[#0C0A0E] font-bold flex items-center gap-1.5 hover:bg-[#d8bc93] transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>VANESEV Central</span>
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
