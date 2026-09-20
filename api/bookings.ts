// Vercel Serverless Function: /api/bookings
// High-performance Neon Serverless Postgres integration with Anti-Tampering & Anti-Hacking Security
import { neon } from '@neondatabase/serverless';

function getDb() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    return null;
  }
  return neon(connectionString);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const sql = getDb();

  // ─── POST: Crear y blindar cita (Anti-Hacking & Anti-Tampering) ─────────────
  if (req.method === 'POST') {
    try {
      const {
        clientName,
        clientPhone,
        clientEmail,
        clientPin,
        clientInstagram,
        serviceId,
        serviceName,
        servicePriceUSD,
        date,
        timeSlot,
        paymentMethod,
        isFirstVisit,
        notes,
      } = req.body || {};

      if (!clientName || !clientPhone || !date || !timeSlot || !serviceName) {
        return res.status(400).json({
          error: 'Campos obligatorios faltantes (nombre, teléfono, fecha, hora, servicio).',
        });
      }

      const cleanPhone = String(clientPhone).replace(/\D/g, '');
      const cleanName = String(clientName).trim().slice(0, 80);
      const cleanEmail = clientEmail ? String(clientEmail).trim().toLowerCase().slice(0, 80) : '';
      const cleanPin = clientPin ? String(clientPin).trim().slice(0, 10) : '';
      const cleanInstagram = clientInstagram ? String(clientInstagram).replace('@', '').trim().slice(0, 40) : '';
      const cleanDate = String(date).trim().slice(0, 10);
      const cleanTime = String(timeSlot).trim().slice(0, 10);
      const rawNotes = notes ? String(notes).trim().slice(0, 300) : '';
      const cleanNotes = [rawNotes, cleanEmail ? `Email: ${cleanEmail}` : ''].filter(Boolean).join(' | ');
      const validPayment = ['pago_movil', 'efectivo', 'binance'].includes(paymentMethod)
        ? paymentMethod
        : 'pago_movil';
      const cleanPrice = Number(servicePriceUSD) || 10.00;
      const claimedFirst = Boolean(isFirstVisit);

      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        return res.status(400).json({ error: 'Número de teléfono inválido (debe contener entre 7 y 15 dígitos).' });
      }

      if (sql) {
        try {
          // 1. Blindaje de Disponibilidad: validar que no esté ocupado ni bloqueado
          const existingSlot = await sql`
            SELECT 1 FROM public.blocked_slots 
            WHERE date = ${cleanDate}::date AND time_slot = ${cleanTime}
            UNION ALL
            SELECT 1 FROM public.bookings 
            WHERE date = ${cleanDate}::date AND time_slot = ${cleanTime} AND status IN ('en_whatsapp', 'pendiente', 'confirmada');
          `;

          if (existingSlot.length > 0) {
            return res.status(409).json({ error: 'El horario seleccionado ya se encuentra ocupado o bloqueado.' });
          }

          // 2. Blindaje Anti-Fraude: verificación estricta de primera visita
          const previousBookings = await sql`
            SELECT COUNT(*) as count FROM public.bookings 
            WHERE client_phone = ${cleanPhone} AND status != 'cancelada';
          `;
          const prevCount = Number(previousBookings[0]?.count || 0);
          const eligibleFirstVisit = (prevCount === 0) && claimedFirst;
          const discountUSD = eligibleFirstVisit ? 2.00 : 0.00;
          const finalPriceUSD = Math.max(0, cleanPrice - discountUSD);
          const bookingId = 'cita_' + Date.now();
          const bookingStatus = (req.body?.status === 'pendiente' || req.body?.status === 'en_whatsapp') ? req.body.status : 'en_whatsapp';

          // 3. Registrar Cita en estado 'en_whatsapp' o 'pendiente'
          await sql`
            INSERT INTO public.bookings (
              id, client_name, client_phone, client_instagram, service_id,
              service_name, service_price_usd, total_price_usd, date,
              time_slot, payment_method, notes, status, is_first_visit, discount_usd, created_at
            ) VALUES (
              ${bookingId}, ${cleanName}, ${cleanPhone}, ${cleanInstagram}, ${String(serviceId || '')},
              ${String(serviceName)}, ${cleanPrice}, ${finalPriceUSD}, ${cleanDate}::date,
              ${cleanTime}, ${validPayment}, ${cleanNotes}, ${bookingStatus}, ${eligibleFirstVisit}, ${discountUSD}, NOW()
            );
          `;

          // 4. Inicializar ficha en loyalty_cards si no existe (sellos = 0 hasta confirmarse el servicio)
          const loyaltyCardRows = await sql`
            SELECT stamps_count FROM public.loyalty_cards WHERE phone = ${cleanPhone};
          `;

          let verifiedStamps = 0;
          if (loyaltyCardRows.length === 0) {
            await sql`
              INSERT INTO public.loyalty_cards (phone, client_name, stamps_count, last_visit, rewards_earned, updated_at)
              VALUES (${cleanPhone}, ${cleanName}, 0, ${cleanDate}::date, ARRAY[]::TEXT[], NOW())
              ON CONFLICT (phone) DO NOTHING;
            `;
          } else {
            verifiedStamps = Number(loyaltyCardRows[0]?.stamps_count || 0);
          }

          return res.status(200).json({
            success: true,
            booking: {
              id: bookingId,
              clientName: cleanName,
              clientPhone: cleanPhone,
              clientEmail: cleanEmail || undefined,
              clientInstagram: cleanInstagram || undefined,
              serviceId,
              serviceName,
              servicePriceUSD: cleanPrice,
              totalPriceUSD: finalPriceUSD,
              date: cleanDate,
              timeSlot: cleanTime,
              paymentMethod: validPayment,
              isFirstVisit: eligibleFirstVisit,
              discountUSD,
              notes: cleanNotes || undefined,
              status: 'pendiente',
            },
            verifiedStamps,
            databaseConnected: true,
          });
        } catch (dbErr: any) {
          console.error('[Neon Booking Error]:', dbErr);
          return res.status(500).json({ error: 'Error al procesar reserva en base de datos.' });
        }
      }

      // Fallback si no hay conexión
      return res.status(200).json({
        success: true,
        booking: {
          id: 'cita_' + Date.now(),
          clientName: cleanName,
          clientPhone: cleanPhone,
          serviceName,
          date: cleanDate,
          timeSlot: cleanTime,
          totalPriceUSD: cleanPrice,
          status: 'pendiente'
        },
        databaseConnected: false,
      });
    } catch (err: any) {
      console.error('Error processing booking:', err);
      return res.status(500).json({ error: 'Error interno al registrar cita.' });
    }
  }

  // ─── GET: Obtener reservas para el Admin ─────────────────────────────────────
  if (req.method === 'GET') {
    if (!sql) {
      return res.status(200).json({ bookings: [], databaseConnected: false });
    }

    try {
      const rows = await sql`
        SELECT 
          id,
          client_name as "clientName",
          client_phone as "clientPhone",
          client_instagram as "clientInstagram",
          service_id as "serviceId",
          service_name as "serviceName",
          service_price_usd as "servicePriceUSD",
          total_price_usd as "totalPriceUSD",
          TO_CHAR(date, 'YYYY-MM-DD') as "date",
          time_slot as "timeSlot",
          payment_method as "paymentMethod",
          notes,
          status,
          is_first_visit as "isFirstVisit",
          discount_usd as "discountUSD",
          created_at as "createdAt"
        FROM public.bookings
        ORDER BY created_at DESC
        LIMIT 200;
      `;

      return res.status(200).json({
        bookings: rows.map((r: any) => ({
          ...r,
          servicePriceUSD: Number(r.servicePriceUSD) || 0,
          totalPriceUSD: Number(r.totalPriceUSD) || 0,
          discountUSD: Number(r.discountUSD) || 0,
        })),
        databaseConnected: true,
      });
    } catch (err: any) {
      console.error('[Neon Get Bookings Error]:', err);
      return res.status(500).json({ error: 'Error al consultar citas en base de datos.' });
    }
  }

  // ─── PATCH: Actualizar estado y validar fidelización oficial ────────────────
  if (req.method === 'PATCH') {
    if (!sql) {
      return res.status(500).json({ error: 'Base de datos no disponible.' });
    }

    try {
      const { id, status, action, date, timeSlot } = req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'id de cita es requerido.' });
      }

      // Reprogramación de Cita (cambio de fecha y turno)
      if (action === 'reschedule' && date && timeSlot) {
        const cleanDate = String(date).trim().slice(0, 10);
        const cleanTime = String(timeSlot).trim().slice(0, 10);

        // Validar que el nuevo turno no esté ocupado por otra cita activa ni bloqueado
        const occupied = await sql`
          SELECT 1 FROM public.blocked_slots 
          WHERE date = ${cleanDate}::date AND time_slot = ${cleanTime}
          UNION ALL
          SELECT 1 FROM public.bookings 
          WHERE date = ${cleanDate}::date AND time_slot = ${cleanTime} 
            AND id != ${id} 
            AND status IN ('en_whatsapp', 'pendiente', 'confirmada');
        `;

        if (occupied.length > 0) {
          return res.status(409).json({ error: 'El nuevo horario ya está ocupado o bloqueado en la agenda.' });
        }

        await sql`
          UPDATE public.bookings 
          SET date = ${cleanDate}::date, time_slot = ${cleanTime}, status = 'confirmada'
          WHERE id = ${id};
        `;

        return res.status(200).json({ 
          success: true, 
          message: 'Cita reprogramada y confirmada exitosamente.',
          date: cleanDate,
          timeSlot: cleanTime,
          status: 'confirmada'
        });
      }

      if (!status) {
        return res.status(400).json({ error: 'status o acción de reprogramación requerida.' });
      }

      // Actualizar estado de la cita
      await sql`
        UPDATE public.bookings 
        SET status = ${status}
        WHERE id = ${id};
      `;

      // Si la cita pasa a 'completada', acreditar oficialmente el sello a la clienta
      if (status === 'completada') {
        const bookingRows = await sql`
          SELECT client_phone, client_name FROM public.bookings WHERE id = ${id};
        `;

        if (bookingRows.length > 0) {
          const clientPhone = bookingRows[0].client_phone;
          const clientName = bookingRows[0].client_name;

          // Contar cuántas citas COMPLETADAS reales tiene
          const countRows = await sql`
            SELECT COUNT(*) as count FROM public.bookings 
            WHERE client_phone = ${clientPhone} AND status = 'completada';
          `;
          const totalCompleted = Number(countRows[0]?.count || 1);
          // Ciclo de 6 sellos para el 7mo gratis
          const cycleStamps = totalCompleted % 7 === 0 ? 6 : Math.min(6, totalCompleted % 7);
          const rewards = totalCompleted >= 6 ? ['¡7º Servicio 100% GRATIS!'] : [];

          await sql`
            INSERT INTO public.loyalty_cards (phone, client_name, stamps_count, last_visit, rewards_earned, updated_at)
            VALUES (${clientPhone}, ${clientName}, ${cycleStamps}, CURRENT_DATE, ${rewards}, NOW())
            ON CONFLICT (phone) DO UPDATE SET
              client_name = EXCLUDED.client_name,
              stamps_count = ${cycleStamps},
              last_visit = CURRENT_DATE,
              rewards_earned = ${rewards},
              updated_at = NOW();
          `;

          return res.status(200).json({
            success: true,
            id,
            status,
            loyalty: {
              phone: clientPhone,
              clientName,
              stampsCount: cycleStamps,
              totalCompleted,
              hasFreeReward: cycleStamps >= 6
            }
          });
        }
      }

      return res.status(200).json({ success: true, id, status });
    } catch (err: any) {
      console.error('[Neon Update Booking Error]:', err);
      return res.status(500).json({ error: 'Error al actualizar reserva.' });
    }
  }

  // ─── DELETE: Eliminar reserva ────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    if (!sql) {
      return res.status(500).json({ error: 'Base de datos no disponible.' });
    }

    try {
      const { id } = req.query || req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'id de reserva requerido.' });
      }

      await sql`
        DELETE FROM public.bookings 
        WHERE id = ${id};
      `;

      return res.status(200).json({ success: true, deletedId: id });
    } catch (err: any) {
      console.error('[Neon Delete Booking Error]:', err);
      return res.status(500).json({ error: 'Error al eliminar reserva.' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
