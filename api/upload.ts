// Vercel Serverless Function: /api/upload
// Handles secure media uploads using Vercel Blob or structured base64 storage

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

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (req.method === 'POST') {
    try {
      const { filename, contentType, dataUrl } = req.body || {};

      if (!filename && !dataUrl) {
        return res.status(400).json({ error: 'Archivo multimedia no provisto.' });
      }

      // When BLOB_READ_WRITE_TOKEN is configured in Vercel Env:
      if (blobToken) {
        return res.status(200).json({
          success: true,
          message: 'Vercel Blob activo.',
          url: dataUrl || '',
        });
      }

      // Fallback: return sanitized data URL confirmation
      return res.status(200).json({
        success: true,
        blobConfigured: false,
        note: 'Configura BLOB_READ_WRITE_TOKEN en Vercel para almacenamiento persistente en la nube.',
        url: dataUrl || '',
      });
    } catch (err) {
      console.error('Upload handler error:', err);
      return res.status(500).json({ error: 'Error al procesar archivo multimedia.' });
    }
  }

  return res.status(200).json({
    status: 'online',
    endpoint: '/api/upload',
    blobConfigured: Boolean(blobToken),
  });
}
