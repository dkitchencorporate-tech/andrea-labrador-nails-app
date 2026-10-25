// Vercel Serverless Function: /api/qr
// Management API for Dynamic QR Codes & Analytics
import { getDb } from './_db.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sql = getDb();
  if (!sql) {
    return res.status(503).json({ error: 'Neon Database connection not configured.' });
  }

  try {
    // ─── GET: Fetch QR Codes & Scan Stats ────────────────────────────────────
    if (req.method === 'GET') {
      const tenant = req.query?.tenant ? String(req.query.tenant).trim().toLowerCase() : '';

      let qrCodes;
      let recentScans;
      let statsToday;

      if (tenant && tenant !== 'all') {
        [qrCodes, recentScans, statsToday] = await Promise.all([
          sql`
            SELECT id, code, tenant_id, label, target_url, is_active, scan_count, created_at, updated_at
            FROM public.qr_codes
            WHERE tenant_id = ${tenant}
            ORDER BY created_at ASC;
          `,
          sql`
            SELECT id, code, tenant_id, scanned_at, device_type, country
            FROM public.qr_scans
            WHERE tenant_id = ${tenant}
            ORDER BY scanned_at DESC
            LIMIT 25;
          `,
          sql`
            SELECT COUNT(*)::int as count_today
            FROM public.qr_scans
            WHERE tenant_id = ${tenant} AND scanned_at >= date_trunc('day', now());
          `
        ]);
      } else {
        [qrCodes, recentScans, statsToday] = await Promise.all([
          sql`
            SELECT id, code, tenant_id, label, target_url, is_active, scan_count, created_at, updated_at
            FROM public.qr_codes
            ORDER BY created_at ASC;
          `,
          sql`
            SELECT id, code, tenant_id, scanned_at, device_type, country
            FROM public.qr_scans
            ORDER BY scanned_at DESC
            LIMIT 50;
          `,
          sql`
            SELECT COUNT(*)::int as count_today
            FROM public.qr_scans
            WHERE scanned_at >= date_trunc('day', now());
          `
        ]);
      }

      const totalScans = qrCodes.reduce((sum: number, q: any) => sum + (Number(q.scan_count) || 0), 0);

      return res.status(200).json({
        qrCodes,
        totalScans,
        scansToday: statsToday[0]?.count_today || 0,
        recentScans,
      });
    }

    // ─── POST: Create or Update QR Code Destination ─────────────────────────
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { action } = body;

      // 1. Update Destination URL in real-time (no re-print required)
      if (action === 'update_target') {
        const { code, targetUrl, label } = body;
        if (!code || !targetUrl) {
          return res.status(400).json({ error: 'code and targetUrl are required' });
        }

        const cleanCode = String(code).trim().toLowerCase();
        const cleanTarget = String(targetUrl).trim();

        const updated = await sql`
          UPDATE public.qr_codes
          SET target_url = ${cleanTarget},
              label = COALESCE(${label ? String(label).trim() : null}, label),
              updated_at = now()
          WHERE LOWER(code) = ${cleanCode}
          RETURNING *;
        `;

        if (updated.length === 0) {
          return res.status(404).json({ error: 'QR Code not found' });
        }

        return res.status(200).json({ success: true, qr: updated[0] });
      }

      // 2. Create new dynamic QR Code
      if (action === 'create') {
        const { code, tenantId, label, targetUrl } = body;
        if (!code || !tenantId || !targetUrl) {
          return res.status(400).json({ error: 'code, tenantId, and targetUrl are required' });
        }

        const cleanCode = String(code).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
        const cleanTenant = String(tenantId).trim().toLowerCase();
        const cleanTarget = String(targetUrl).trim();
        const cleanLabel = String(label || cleanCode).trim();

        const created = await sql`
          INSERT INTO public.qr_codes (code, tenant_id, label, target_url, is_active)
          VALUES (${cleanCode}, ${cleanTenant}, ${cleanLabel}, ${cleanTarget}, true)
          ON CONFLICT (code) DO UPDATE
          SET target_url = EXCLUDED.target_url,
              label = EXCLUDED.label,
              updated_at = now()
          RETURNING *;
        `;

        return res.status(200).json({ success: true, qr: created[0] });
      }

      // 3. Toggle Active Status
      if (action === 'toggle_active') {
        const { code, isActive } = body;
        const updated = await sql`
          UPDATE public.qr_codes
          SET is_active = ${Boolean(isActive)}, updated_at = now()
          WHERE LOWER(code) = ${String(code).trim().toLowerCase()}
          RETURNING *;
        `;
        return res.status(200).json({ success: true, qr: updated[0] });
      }

      return res.status(400).json({ error: 'Unknown action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[API QR Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
