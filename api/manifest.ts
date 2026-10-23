import { getDb } from './_db.js';

export default async function handler(req: any, res: any) {
  const host = String(req.headers.host || '').toLowerCase();
  const queryTenant = typeof req.query.tenant === 'string' ? req.query.tenant.trim().toLowerCase() : '';

  let tenantSlug = 'andrea-nails';
  if (queryTenant) {
    tenantSlug = queryTenant === 'capra' ? 'capra-studio' : queryTenant;
  } else if (host.startsWith('caprastudio.')) {
    tenantSlug = 'capra-studio';
  } else if (host.startsWith('andrealabrador.')) {
    tenantSlug = 'andrea-nails';
  }

  let name = tenantSlug === 'capra-studio'
    ? 'Capra Studio · Salón de Belleza & Academy'
    : 'Andrea Labrador Nails Studio';
  let shortName = tenantSlug === 'capra-studio' ? 'Capra Studio' : 'Andrea Nails';
  let themeColor = tenantSlug === 'capra-studio' ? '#B5838D' : '#16291F';
  let bgColor = tenantSlug === 'capra-studio' ? '#FDFBF9' : '#FBF9F6';
  let description = tenantSlug === 'capra-studio'
    ? 'Cejas, Pestañas, Estilismo, Maquillaje Profesional, Uñas y Cursos Capra Academy — By María Capra.'
    : 'Catálogo interactivo, reservas online y tarjeta de fidelización VIP de 5 sellos.';
  let startUrl = tenantSlug === 'capra-studio' ? '/?salon=capra-studio' : '/?salon=andrea-nails';

  const sql = getDb();
  if (sql) {
    try {
      const rows = await sql`
        SELECT business_name, custom_subdomain, primary_color, secondary_color, slogan
        FROM public.tenants
        WHERE id = ${tenantSlug} OR custom_subdomain = ${tenantSlug}
        LIMIT 1;
      `;
      if (rows.length > 0) {
        const t = rows[0];
        name = t.business_name || name;
        shortName = String(t.business_name || shortName).slice(0, 18);
        themeColor = t.primary_color || themeColor;
        bgColor = t.secondary_color || bgColor;
        if (t.slogan) description = t.slogan;
      }
    } catch {
      // Fallback a valores seguros del tenant
    }
  }

  const manifest = {
    name,
    short_name: shortName,
    description,
    start_url: startUrl,
    display: 'standalone',
    background_color: bgColor,
    theme_color: themeColor,
    orientation: 'portrait-primary',
    lang: 'es-VE',
    icons: [
      {
        src: '/images/esmaltado-semipermanente.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/images/nivelacion-rubber.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };

  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  return res.status(200).json(manifest);
}
