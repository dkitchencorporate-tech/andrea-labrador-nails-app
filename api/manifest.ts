import { getDb } from './_db.js';

export default async function handler(req: any, res: any) {
  const queryTenant = typeof req.query.tenant === 'string' ? req.query.tenant.trim().toLowerCase() : '';

  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  // Si no se especifica un salón explícito, devolver manifiesto neutro de navegador para VANESEV (nunca PWA instalable ni de ningún cliente)
  if (!queryTenant || queryTenant === 'vanesev' || queryTenant === 'saas' || queryTenant === 'central') {
    return res.status(200).json({
      name: 'VANESEV',
      short_name: 'VANESEV',
      description: 'Plataforma integral para salones de belleza, clínicas estéticas, spas y barberías.',
      start_url: '/',
      display: 'browser',
      background_color: '#FAF7F2',
      theme_color: '#FAF7F2',
      icons: [
        {
          src: '/favicon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
        },
      ],
    });
  }

  const tenantSlug = queryTenant === 'capra' ? 'capra-studio' : queryTenant === 'andrea' ? 'andrea-nails' : queryTenant;
  const isAndrea = tenantSlug === 'andrea-nails';

  let name = tenantSlug === 'capra-studio'
    ? 'Capra Studio · Salón de Belleza & Academy'
    : isAndrea
    ? 'Andrea Labrador Nails Studio'
    : `Salón ${tenantSlug}`;
  let shortName = tenantSlug === 'capra-studio' ? 'Capra Studio' : isAndrea ? 'Andrea Nails' : tenantSlug.slice(0, 18);
  let themeColor = tenantSlug === 'capra-studio' ? '#9E475B' : isAndrea ? '#16291F' : '#9E475B';
  let bgColor = tenantSlug === 'capra-studio' ? '#FAF7F2' : isAndrea ? '#FBF9F6' : '#FAF7F2';
  let description = tenantSlug === 'capra-studio'
    ? 'Cejas, Pestañas, Estilismo, Maquillaje Profesional, Uñas y Cursos Capra Academy — By María Capra.'
    : isAndrea
    ? 'Catálogo interactivo, reservas online y tarjeta de fidelización VIP de 5 sellos.'
    : 'Reserva online, catálogo de servicios y tarjeta de fidelización VIP.';
  const startUrl = isAndrea ? '/andrea-nails' : `/m/${tenantSlug}`;

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
      // Fallback seguro del salón específico
    }
  }

  const icons = isAndrea
    ? [
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
      ]
    : [
        {
          src: '/favicon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any maskable',
        },
      ];

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
    icons,
  };

  return res.status(200).json(manifest);
}

