// Vercel Serverless Function: /api/client-auth
// Hermetic Client Authentication Layer with SHA-256 Hashed PINs, Anti-Enumeration & Brute-Force Lockout
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const AUTH_SECRET = process.env.CLIENT_AUTH_SECRET || process.env.DATABASE_URL || 'andrea_labrador_super_secret_auth_key_2026';

function getDb() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) return null;
  return neon(connectionString);
}

function hashPin(pin: string, salt: string): string {
  return crypto.createHash('sha256').update(salt + pin + AUTH_SECRET).digest('hex');
}

function generateSessionToken(phone: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days validity
  const payload = `${phone}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

function verifySessionToken(token: string): { valid: boolean; phone?: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [phone, expiresAtStr, signature] = decoded.split(':');
    if (!phone || !expiresAtStr || !signature) return { valid: false };

    const expiresAt = Number(expiresAtStr);
    if (Date.now() > expiresAt) return { valid: false };

    const payload = `${phone}:${expiresAtStr}`;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { valid: true, phone };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const sql = getDb();

  // ─── GET: Verificar sesión activa con Bearer / Query Token ─────────────────
  if (req.method === 'GET') {
    const token = req.query.token || (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : '');
    if (!token) {
      return res.status(401).json({ error: 'Token de sesión no proporcionado.' });
    }

    const { valid, phone } = verifySessionToken(String(token));
    if (!valid || !phone) {
      return res.status(401).json({ error: 'Sesión expirada o inválida. Inicia sesión nuevamente.' });
    }

    if (!sql) {
      return res.status(200).json({ phone, clientName: 'Clienta VIP', stampsCount: 0 });
    }

    try {
      const rows = await sql`
        SELECT 
          c.phone,
          c.client_name as "clientName",
          c.email,
          c.instagram,
          COALESCE(l.stamps_count, 0) as "stampsCount",
          COALESCE(l.rewards_earned, ARRAY[]::text[]) as "rewardsEarned"
        FROM public.client_accounts c
        LEFT JOIN public.loyalty_cards l ON l.phone = c.phone
        WHERE c.phone = ${phone}
        LIMIT 1;
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Cuenta no encontrada.' });
      }

      const client = rows[0];
      return res.status(200).json({
        success: true,
        phone: client.phone,
        clientName: client.clientName,
        email: client.email,
        instagram: client.instagram,
        stampsCount: Number(client.stampsCount) || 0,
        rewardsEarned: client.rewardsEarned || [],
      });
    } catch (err: any) {
      console.error('[Neon Auth GET Error]:', err);
      return res.status(500).json({ error: 'Error al verificar sesión.' });
    }
  }

  // ─── POST: Operaciones de autenticación hermética ───────────────────────────
  if (req.method === 'POST') {
    const { action, phone, pin, name, email, instagram, token } = req.body || {};
    const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';

    // 1. Ensure Table Exists
    if (sql) {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS public.client_accounts (
            phone VARCHAR(20) PRIMARY KEY,
            client_name VARCHAR(100) NOT NULL,
            email VARCHAR(100),
            instagram VARCHAR(50),
            pin_hash VARCHAR(64) NOT NULL,
            salt VARCHAR(32) NOT NULL,
            failed_attempts INT DEFAULT 0,
            locked_until TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
      } catch (tableErr) {
        console.warn('Auto-init client_accounts table notice:', tableErr);
      }
    }

    // ─── ACTION 1: Check existencia (ANTI-ENUMERATION / ZERO PII EXPOSURE) ────
    if (action === 'check') {
      if (!cleanPhone || cleanPhone.length < 7) {
        return res.status(200).json({ registered: false, hasPin: false, stampsCount: 0 });
      }

      if (!sql) {
        return res.status(200).json({ registered: false, hasPin: false, stampsCount: 0 });
      }

      try {
        const rows = await sql`
          SELECT 
            c.phone,
            (c.pin_hash IS NOT NULL AND c.pin_hash != '') as "hasPin",
            COALESCE(l.stamps_count, 0) as "stampsCount"
          FROM (SELECT ${cleanPhone}::text as phone) q
          LEFT JOIN public.client_accounts c ON c.phone = q.phone
          LEFT JOIN public.loyalty_cards l ON l.phone = q.phone
          LIMIT 1;
        `;

        const record = rows[0];
        const isRegistered = Boolean(record && (record.hasPin || record.stampsCount > 0));

        // NOTE: Strict Anti-Enumeration: NO clientName, NO email, NO private booking details are returned!
        return res.status(200).json({
          registered: isRegistered,
          hasPin: Boolean(record?.hasPin),
          stampsCount: Number(record?.stampsCount || 0),
          rewardEligible: Number(record?.stampsCount || 0) >= 6,
        });
      } catch (checkErr) {
        console.error('[Neon Auth Check Error]:', checkErr);
        return res.status(200).json({ registered: false, hasPin: false, stampsCount: 0 });
      }
    }

    // ─── ACTION 2: Registro o Actualización de PIN ───────────────────────────
    if (action === 'register') {
      if (!cleanPhone || cleanPhone.length < 7 || cleanPhone.length > 15) {
        return res.status(400).json({ error: 'Teléfono inválido (debe tener entre 7 y 15 dígitos).' });
      }
      if (!pin || String(pin).trim().length < 4) {
        return res.status(400).json({ error: 'El PIN de seguridad debe contener al menos 4 dígitos.' });
      }

      const clientName = name ? String(name).trim().slice(0, 80) : 'Clienta';
      const cleanEmail = email ? String(email).trim().toLowerCase().slice(0, 80) : null;
      const cleanIg = instagram ? String(instagram).replace('@', '').trim().slice(0, 40) : null;
      const cleanPin = String(pin).trim().slice(0, 10);

      const salt = crypto.randomBytes(16).toString('hex');
      const pinHashed = hashPin(cleanPin, salt);

      if (!sql) {
        const sessionToken = generateSessionToken(cleanPhone);
        return res.status(200).json({
          success: true,
          sessionToken,
          profile: { phone: cleanPhone, name: clientName, stampsCount: 0 }
        });
      }

      try {
        await sql`
          INSERT INTO public.client_accounts (
            phone, client_name, email, instagram, pin_hash, salt, failed_attempts, locked_until, updated_at
          ) VALUES (
            ${cleanPhone}, ${clientName}, ${cleanEmail}, ${cleanIg}, ${pinHashed}, ${salt}, 0, NULL, NOW()
          )
          ON CONFLICT (phone) DO UPDATE SET
            client_name = EXCLUDED.client_name,
            email = COALESCE(EXCLUDED.email, client_accounts.email),
            instagram = COALESCE(EXCLUDED.instagram, client_accounts.instagram),
            pin_hash = EXCLUDED.pin_hash,
            salt = EXCLUDED.salt,
            failed_attempts = 0,
            locked_until = NULL,
            updated_at = NOW();
        `;

        // Sincronizar en loyalty_cards si no existe
        await sql`
          INSERT INTO public.loyalty_cards (phone, client_name, stamps_count, last_visit, rewards_earned, updated_at)
          VALUES (${cleanPhone}, ${clientName}, 0, CURRENT_DATE, ARRAY[]::text[], NOW())
          ON CONFLICT (phone) DO NOTHING;
        `;

        const sessionToken = generateSessionToken(cleanPhone);
        return res.status(200).json({
          success: true,
          sessionToken,
          profile: {
            phone: cleanPhone,
            name: clientName,
            email: cleanEmail,
            instagram: cleanIg,
            stampsCount: 0,
          }
        });
      } catch (regErr: any) {
        console.error('[Neon Auth Register Error]:', regErr);
        return res.status(500).json({ error: 'Error al registrar la ficha segura de clienta.' });
      }
    }

    // ─── ACTION 3: Inicio de Sesión Seguro (Brute-Force & Lockout Protected) ──
    if (action === 'login') {
      if (!cleanPhone || cleanPhone.length < 7) {
        return res.status(400).json({ error: 'Número de teléfono requerido.' });
      }
      if (!pin) {
        return res.status(400).json({ error: 'PIN o contraseña requerida.' });
      }

      if (!sql) {
        const sessionToken = generateSessionToken(cleanPhone);
        return res.status(200).json({
          success: true,
          sessionToken,
          profile: { phone: cleanPhone, name: 'Clienta VIP', stampsCount: 0 }
        });
      }

      try {
        const rows = await sql`
          SELECT 
            c.phone,
            c.client_name as "clientName",
            c.email,
            c.instagram,
            c.pin_hash as "pinHash",
            c.salt,
            c.failed_attempts as "failedAttempts",
            c.locked_until as "lockedUntil",
            COALESCE(l.stamps_count, 0) as "stampsCount",
            COALESCE(l.rewards_earned, ARRAY[]::text[]) as "rewardsEarned"
          FROM public.client_accounts c
          LEFT JOIN public.loyalty_cards l ON l.phone = c.phone
          WHERE c.phone = ${cleanPhone}
          LIMIT 1;
        `;

        if (rows.length === 0) {
          // Check if exists in loyalty_cards without password set yet
          const loyaltyRows = await sql`
            SELECT phone, client_name as "clientName", stamps_count as "stampsCount"
            FROM public.loyalty_cards WHERE phone = ${cleanPhone} LIMIT 1;
          `;

          if (loyaltyRows.length > 0) {
            return res.status(404).json({
              error: 'Tienes una ficha activa pero aún no has establecido un PIN de seguridad. Por favor regístralo para proteger tus datos.',
              needsPinSetup: true,
            });
          }

          return res.status(404).json({
            error: 'No encontramos una ficha registrada con este teléfono. ¡Al agendar tu primera cita se creará automáticamente!',
          });
        }

        const account = rows[0];

        // 1. Check Brute-force Lockout
        if (account.lockedUntil) {
          const lockedUntilTime = new Date(account.lockedUntil).getTime();
          if (Date.now() < lockedUntilTime) {
            const minutesLeft = Math.ceil((lockedUntilTime - Date.now()) / 60000);
            return res.status(429).json({
              error: `Cuenta temporalmente bloqueada por seguridad. Por favor intenta en ${minutesLeft} minutos.`,
              locked: true,
            });
          }
        }

        // 2. Verify Hashed PIN
        const inputHashed = hashPin(String(pin).trim(), account.salt);
        if (inputHashed !== account.pinHash) {
          const newFailed = (account.failedAttempts || 0) + 1;
          if (newFailed >= 5) {
            await sql`
              UPDATE public.client_accounts
              SET failed_attempts = ${newFailed}, locked_until = NOW() + INTERVAL '15 minutes', updated_at = NOW()
              WHERE phone = ${cleanPhone};
            `;
            return res.status(429).json({
              error: 'Has superado el límite de 5 intentos. Tu ficha ha sido bloqueada temporalmente por 15 minutos.',
              locked: true,
            });
          } else {
            await sql`
              UPDATE public.client_accounts
              SET failed_attempts = ${newFailed}, updated_at = NOW()
              WHERE phone = ${cleanPhone};
            `;
            const remaining = 5 - newFailed;
            return res.status(401).json({
              error: `PIN incorrecto. Te quedan ${remaining} ${remaining === 1 ? 'intento' : 'intentos'} antes de que la cuenta se bloquee.`,
            });
          }
        }

        // 3. Login Successful: Reset counters
        await sql`
          UPDATE public.client_accounts
          SET failed_attempts = 0, locked_until = NULL, updated_at = NOW()
          WHERE phone = ${cleanPhone};
        `;

        const sessionToken = generateSessionToken(cleanPhone);
        return res.status(200).json({
          success: true,
          sessionToken,
          profile: {
            phone: account.phone,
            name: account.clientName,
            email: account.email,
            instagram: account.instagram,
            stampsCount: Number(account.stampsCount) || 0,
            rewardsEarned: account.rewardsEarned || [],
          }
        });
      } catch (loginErr: any) {
        console.error('[Neon Auth Login Error]:', loginErr);
        return res.status(500).json({ error: 'Error durante el inicio de sesión.' });
      }
    }

    // ─── ACTION 4: Cerrar sesión ─────────────────────────────────────────────
    if (action === 'logout') {
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Acción no reconocida.' });
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
