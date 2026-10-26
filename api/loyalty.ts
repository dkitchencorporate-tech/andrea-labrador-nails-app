// Vercel Serverless Function: /api/loyalty
// Handles loyalty stamp queries and admin adjustments in Neon Postgres
import { neon } from '@neondatabase/serverless';

function getDb() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) return null;
  return neon(connectionString);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const sql = getDb();

  // ─── GET: Consultar tarjeta por teléfono O listar todas para CRM ───────────
  if (req.method === 'GET') {
    if (!sql) {
      return res.status(200).json({ cards: [], stampsCount: 0, databaseConnected: false });
    }

    try {
      const { phone, tenant } = req.query || {};
      const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';
      const cleanTenant = tenant ? String(tenant).trim().toLowerCase() : '';

      if (!cleanTenant) {
        return res.status(200).json({ cards: [], found: false, stampsCount: 0, databaseConnected: true });
      }

      // Si se consulta un teléfono específico dentro de este salón
      if (cleanPhone) {
        const rows = await sql`
          SELECT 
            phone,
            tenant_id as "tenantId",
            client_name as "clientName",
            stamps_count as "stampsCount",
            TO_CHAR(last_visit, 'YYYY-MM-DD') as "lastVisit",
            rewards_earned as "rewardsEarned"
          FROM public.loyalty_cards
          WHERE phone = ${cleanPhone} AND tenant_id = ${cleanTenant}
          LIMIT 1;
        `;

        function maskName(name: string): string {
          if (!name) return 'Clienta VIP';
          const parts = name.trim().split(/\s+/);
          return parts.map(p => p.length > 2 ? p[0] + '*'.repeat(Math.min(p.length - 2, 4)) + p[p.length - 1] : p[0] + '*').join(' ');
        }

        if (rows.length > 0) {
          const card = rows[0];
          return res.status(200).json({
            found: true,
            phone: card.phone,
            tenantId: card.tenantId,
            clientName: maskName(card.clientName),
            maskedName: maskName(card.clientName),
            stampsCount: card.stampsCount,
            maxStamps: 6,
            lastVisit: card.lastVisit,
            rewardsEarned: card.rewardsEarned || [],
            rewardEligible: card.stampsCount >= 6,
            databaseConnected: true,
          });
        }

        return res.status(200).json({
          found: false,
          phone: cleanPhone,
          tenantId: cleanTenant,
          stampsCount: 0,
          maxStamps: 6,
          rewardsEarned: [],
          rewardEligible: false,
          databaseConnected: true,
        });
      }

      // Si no se pasa teléfono, listar únicamente las tarjetas de este salón (tenant_id)
      const allRows = await sql`
        SELECT 
          phone,
          tenant_id as "tenantId",
          client_name as "clientName",
          stamps_count as "stampsCount",
          TO_CHAR(last_visit, 'YYYY-MM-DD') as "lastVisit",
          rewards_earned as "rewardsEarned"
        FROM public.loyalty_cards
        WHERE tenant_id = ${cleanTenant}
        ORDER BY last_visit DESC
        LIMIT 200;
      `;

      return res.status(200).json({
        cards: allRows,
        databaseConnected: true,
      });
    } catch (err: any) {
      console.error('[Neon Get Loyalty Error]:', err);
      return res.status(500).json({ error: 'Error al consultar programa de fidelización.' });
    }
  }

  // ─── POST: Ajustar sellos manualmente desde Admin ───────────────────────────
  if (req.method === 'POST') {
    if (!sql) {
      return res.status(500).json({ error: 'Base de datos no disponible.' });
    }

    try {
      const { phone, tenantId, clientName, stampsCount, action } = req.body || {};
      const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';
      const cleanTenant = String(tenantId || req.query?.tenant || '').trim().toLowerCase();

      if (!cleanPhone || !cleanTenant) {
        return res.status(400).json({ error: 'Teléfono y salón (tenantId) requeridos para ajustar fidelización.' });
      }

      const name = clientName ? String(clientName).trim().slice(0, 80) : 'Clienta';
      const targetStamps = Math.max(0, Math.min(6, Number(stampsCount) || 0));

      const existing = await sql`
        SELECT stamps_count, rewards_earned FROM public.loyalty_cards
        WHERE phone = ${cleanPhone} AND tenant_id = ${cleanTenant};
      `;

      let rewards: string[] = [];
      if (existing.length > 0 && Array.isArray(existing[0].rewards_earned)) {
        rewards = [...existing[0].rewards_earned];
      }

      if (targetStamps === 6 && !rewards.includes('¡7º Servicio 100% GRATIS!')) {
        rewards.push('¡7º Servicio 100% GRATIS!');
      }

      if (action === 'redeem') {
        rewards = rewards.filter(r => r !== '¡7º Servicio 100% GRATIS!');
      }

      await sql`
        INSERT INTO public.loyalty_cards (phone, tenant_id, client_name, stamps_count, last_visit, rewards_earned, updated_at)
        VALUES (${cleanPhone}, ${cleanTenant}, ${name}, ${targetStamps}, CURRENT_DATE, ${rewards}, NOW())
        ON CONFLICT (phone) DO UPDATE SET
          tenant_id = EXCLUDED.tenant_id,
          client_name = EXCLUDED.client_name,
          stamps_count = ${targetStamps},
          last_visit = CURRENT_DATE,
          rewards_earned = ${rewards},
          updated_at = NOW();
      `;

      return res.status(200).json({
        success: true,
        phone: cleanPhone,
        tenantId: cleanTenant,
        clientName: name,
        stampsCount: targetStamps,
        rewardsEarned: rewards,
      });
    } catch (err: any) {
      console.error('[Neon Update Loyalty Error]:', err);
      return res.status(500).json({ error: 'Error al actualizar fidelización.' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
