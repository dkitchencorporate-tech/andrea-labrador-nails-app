/**
 * CONTRATO MAESTRO DE ESQUEMA POSTGRESQL 18 (NEON SERVERLESS + DRIZZLE-COMPATIBLE)
 * Garantiza tipado estático estricto (tsc --noEmit) entre las 17 tablas de Neon DB y el código TypeScript.
 */

export interface DbTenantRow {
  id: string;
  slug: string;
  name: string;
  brand_subtitle: string | null;
  owner_name: string;
  whatsapp_phone: string;
  instagram_handle: string | null;
  address_line: string | null;
  city: string;
  country: string;
  business_hours: string;
  slogan: string | null;
  plan_type: 'unipersonal' | 'salon_pro' | 'academia_elite' | 'flagship_vip';
  subscription_status: 'active' | 'trial' | 'past_due' | 'suspended';
  loyalty_stamps_target: number;
  loyalty_reward_name: string;
  exchange_rate_bs: string | number;
  theme_config: {
    primaryColor?: string;
    secondaryColor?: string;
    accentGold?: string;
    bgLight?: string;
    pagoMovilPhone?: string;
    pagoMovilCedula?: string;
    pagoMovilBank?: string;
    binanceEmail?: string;
    depositPercent?: number;
    toleranceMinutes?: number;
  };
  custom_domain: string | null;
  subdomain: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbStudioZoneRow {
  id: string;
  tenant_id: string;
  name: string;
  department: string;
  description: string | null;
  capacity: number;
  station_code: string | null;
  color_tag?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbStaffMemberRow {
  id: string;
  tenant_id: string;
  name: string;
  role_title: string;
  specialty_tags: string[];
  phone: string | null;
  instagram: string | null;
  commission_percent: string | number;
  zone_id: string | null;
  schedule_summary: string;
  avatar_url: string | null;
  rating: string | number;
  completed_services_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbServiceRow {
  id: string;
  tenant_id: string;
  name: string;
  category: string;
  price_usd: string | number;
  duration_minutes: number;
  short_description: string;
  full_description: string;
  ideal_for: string;
  image_url: string;
  badge_text: string | null;
  badge_color: string | null;
  zone_id: string | null;
  default_staff_id: string | null;
  is_available: boolean;
  tags: string[];
}

export interface DbBookingRow {
  id: string;
  tenant_id: string;
  client_name: string;
  client_phone: string;
  client_instagram: string | null;
  service_id: string;
  service_name: string;
  service_price_usd: string | number;
  total_price_usd: string | number;
  staff_id: string | null;
  staff_name: string | null;
  zone_id: string | null;
  zone_name: string | null;
  date: string;
  time_slot: string;
  payment_method: 'pago_movil' | 'efectivo' | 'binance' | string;
  notes: string | null;
  status: 'en_whatsapp' | 'pendiente' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio';
  cancellation_reason: string | null;
  is_first_visit: boolean;
  discount_usd: string | number;
  created_at: string;
}
