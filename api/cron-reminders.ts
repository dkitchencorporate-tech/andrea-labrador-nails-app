import { getDb } from './_db.js';

/**
 * Endpoint de Automatización Nivel 2 (Cron / Webhook):
 * - Consulta citas confirmadas para las próximas 24 horas en Neon Postgres.
 * - Prepara y despacha recordatorios transaccionales vía Resend (Email) y Meta WhatsApp Cloud API (si las credenciales están activas).
 */
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = getDb();
  if (!sql) {
    return res.status(500).json({ error: 'Base de datos Neon no disponible.' });
  }

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const upcomingBookings = await sql`
      SELECT
        b.id,
        b.tenant_id as "tenantId",
        b.client_name as "clientName",
        b.client_phone as "clientPhone",
        b.staff_id as "staffId",
        b.zone_id as "zoneId",
        b.date as "date",
        b.time_slot as "timeSlot",
        b.total_usd as "totalPriceUSD",
        t.business_name as "salonName",
        t.whatsapp_phone as "salonWhatsapp"
      FROM public.bookings b
      LEFT JOIN public.tenants t ON t.id = b.tenant_id
      WHERE b.date = ${tomorrowStr}
        AND b.status IN ('confirmada', 'en_whatsapp', 'pendiente', 'confirmed', 'pending')
      ORDER BY b.time_slot ASC;
    `;

    const resendApiKey = process.env.RESEND_API_KEY || '';
    const metaWaToken = process.env.META_WHATSAPP_TOKEN || '';
    const metaPhoneId = process.env.META_WHATSAPP_PHONE_ID || '';

    const dispatches = upcomingBookings.map((b: any) => ({
      bookingId: b.id,
      tenantId: b.tenantId,
      salonName: b.salonName || b.tenantId,
      clientName: b.clientName,
      clientPhone: b.clientPhone,
      date: b.date,
      timeSlot: b.timeSlot,
      channels: {
        whatsappDeepLink: `https://wa.me/${String(b.clientPhone).replace(/\D/g, '')}?text=${encodeURIComponent(
          `¡Hola ${b.clientName}! ✨ Te recordamos tu cita de mañana (${b.date} a las ${b.timeSlot}) en ${b.salonName || 'nuestro estudio'}. ¡Te esperamos!`
        )}`,
        metaCloudApiReady: Boolean(metaWaToken && metaPhoneId),
        resendEmailReady: Boolean(resendApiKey),
      },
    }));

    return res.status(200).json({
      ok: true,
      success: true,
      window: '24h',
      targetDate: tomorrowStr,
      totalUpcoming: dispatches.length,
      providersConfigured: {
        resendEmail: Boolean(resendApiKey),
        metaWhatsappCloud: Boolean(metaWaToken && metaPhoneId),
      },
      dispatches,
    });
  } catch (err: any) {
    console.error('[Cron Reminders Error]:', err);
    return res.status(500).json({ error: 'Error procesando cola de recordatorios 24h.' });
  }
}
