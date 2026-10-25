// Vercel Serverless Function: /api/r
// Ultra-Fast Dynamic QR Redirect Engine & Real-Time Scan Analytics for VANESEV
// Reference architecture: https://www.javiggil.com/56fc9cb32b97
// 100% Editable target destination with zero re-printing of physical QR codes
import { getDb } from './_db.js';

function detectDevice(userAgent: string): string {
  const ua = (userAgent || '').toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function hashIp(ip: string): string {
  if (!ip) return 'anonymous';
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = (hash << 5) - hash + ip.charCodeAt(i);
    hash |= 0;
  }
  return 'ip_' + Math.abs(hash).toString(16);
}

export default async function handler(req: any, res: any) {
  // Prevent any intermediary or browser cache so 100% of scans are tracked in real-time
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const rawCode = String(req.query?.code || req.query?.c || '').trim();
  const cleanCode = rawCode.replace(/^\/+/, '').toLowerCase();

  // Fallback destination if code is missing
  if (!cleanCode) {
    res.writeHead(302, { Location: '/' });
    return res.end();
  }

  const sql = getDb();
  if (!sql) {
    // Database connection fallback
    const fallback = cleanCode.startsWith('capra')
      ? '/capra-studio'
      : cleanCode.startsWith('andrea')
      ? '/andrea-nails'
      : '/';
    res.writeHead(302, { Location: fallback });
    return res.end();
  }

  try {
    const rows = await sql`
      SELECT id, code, tenant_id, target_url, is_active
      FROM public.qr_codes
      WHERE LOWER(code) = ${cleanCode}
      LIMIT 1;
    `;

    const qr = rows[0] || null;

    if (!qr || qr.is_active === false) {
      // Smart fallback according to salon name
      const fallback = cleanCode.startsWith('capra')
        ? '/capra-studio'
        : cleanCode.startsWith('andrea')
        ? '/andrea-nails'
        : '/';
      res.writeHead(302, { Location: fallback });
      return res.end();
    }

    // Metadata for Real-Time Analytics
    const userAgent = String(req.headers['user-agent'] || '');
    const referer = String(req.headers['referer'] || '');
    const rawIp = String(
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      ''
    ).split(',')[0].trim();

    const deviceType = detectDevice(userAgent);
    const ipHash = hashIp(rawIp);
    const country = String(req.headers['x-vercel-ip-country'] || 'Desconocido');

    // Asynchronously log scan & increment counter in parallel
    Promise.all([
      sql`
        INSERT INTO public.qr_scans (code, tenant_id, user_agent, referer, ip_hash, device_type, country)
        VALUES (${qr.code}, ${qr.tenant_id}, ${userAgent.slice(0, 500)}, ${referer.slice(0, 500)}, ${ipHash}, ${deviceType}, ${country});
      `,
      sql`
        UPDATE public.qr_codes
        SET scan_count = scan_count + 1, updated_at = now()
        WHERE code = ${qr.code};
      `
    ]).catch((err) => {
      console.error('[QR Scan Track Error]:', err);
    });

    // Resolve Target Destination (relative or absolute)
    let destination = qr.target_url || '/';
    if (!destination.startsWith('http://') && !destination.startsWith('https://')) {
      if (!destination.startsWith('/')) {
        destination = '/' + destination;
      }
    }

    // Send HTTP 302 Found (NEVER 301, as explained in the architecture spec)
    res.writeHead(302, { Location: destination });
    return res.end();
  } catch (err: any) {
    console.error('[QR Redirect Error]:', err);
    const fallback = cleanCode.startsWith('capra')
      ? '/capra-studio'
      : cleanCode.startsWith('andrea')
      ? '/andrea-nails'
      : '/';
    res.writeHead(302, { Location: fallback });
    return res.end();
  }
}
