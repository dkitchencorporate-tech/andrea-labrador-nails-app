// Vercel Serverless Function: /api/loyalty
// Handles loyalty stamp queries and validations

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

  const { phone } = req.query || {};
  const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';

  if (req.method === 'GET') {
    if (!cleanPhone) {
      return res.status(400).json({ error: 'Parámetro de teléfono requerido.' });
    }

    const databaseUrl = process.env.DATABASE_URL;

    return res.status(200).json({
      phone: cleanPhone,
      stampsCount: 0,
      maxStamps: 6,
      rewardEligible: false,
      databaseConnected: Boolean(databaseUrl),
    });
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
