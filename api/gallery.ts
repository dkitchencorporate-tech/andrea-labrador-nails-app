// Vercel Serverless Function: /api/gallery
// Manages carousel gallery images in Neon Serverless Postgres
import { neon } from '@neondatabase/serverless';

function getDb() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) return null;
  return neon(connectionString);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const sql = getDb();

  // ─── GET: Listar imágenes del carrusel ─────────────────────────────────────
  if (req.method === 'GET') {
    if (!sql) {
      return res.status(200).json({ slides: [], databaseConnected: false });
    }

    try {
      // Garantizar que la tabla exista
      await sql`
        CREATE TABLE IF NOT EXISTS public.gallery_slides (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(120) NOT NULL,
          image_url TEXT NOT NULL,
          tag VARCHAR(100),
          technique VARCHAR(120),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;

      const rows = await sql`
        SELECT 
          id,
          name,
          image_url as "imageUrl",
          tag,
          technique,
          created_at as "createdAt"
        FROM public.gallery_slides
        ORDER BY created_at DESC
        LIMIT 40;
      `;

      return res.status(200).json({
        slides: rows,
        databaseConnected: true,
      });
    } catch (err: any) {
      console.error('[Neon Get Gallery Error]:', err);
      return res.status(500).json({ error: 'Error al consultar imágenes de la galería.' });
    }
  }

  // ─── POST: Añadir o actualizar imagen ──────────────────────────────────────
  if (req.method === 'POST') {
    if (!sql) {
      return res.status(500).json({ error: 'Base de datos no disponible.' });
    }

    try {
      const { id, name, imageUrl, tag, technique } = req.body || {};
      if (!name || !imageUrl) {
        return res.status(400).json({ error: 'Nombre e imagen son obligatorios.' });
      }

      // Validar límite máximo de 40 imágenes
      const countRes = await sql`SELECT COUNT(*) as count FROM public.gallery_slides;`;
      const currentCount = Number(countRes[0]?.count) || 0;
      if (currentCount >= 40) {
        return res.status(400).json({ error: 'Límite de 40 imágenes alcanzado. Elimina alguna para subir una nueva.' });
      }

      const slideId = id || `slide_${Date.now()}`;
      const cleanName = String(name).trim().slice(0, 120);
      const cleanTag = tag ? String(tag).trim().slice(0, 100) : 'Diseño Real';
      const cleanTech = technique ? String(technique).trim().slice(0, 120) : '';

      await sql`
        INSERT INTO public.gallery_slides (id, name, image_url, tag, technique)
        VALUES (${slideId}, ${cleanName}, ${imageUrl}, ${cleanTag}, ${cleanTech})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          image_url = EXCLUDED.image_url,
          tag = EXCLUDED.tag,
          technique = EXCLUDED.technique;
      `;

      return res.status(200).json({
        success: true,
        slide: { id: slideId, name: cleanName, imageUrl, tag: cleanTag, technique: cleanTech }
      });
    } catch (err: any) {
      console.error('[Neon Save Gallery Error]:', err);
      return res.status(500).json({ error: 'Error al guardar imagen de la galería.' });
    }
  }

  // ─── DELETE: Eliminar imagen por ID ───────────────────────────────────────
  if (req.method === 'DELETE') {
    if (!sql) {
      return res.status(500).json({ error: 'Base de datos no disponible.' });
    }

    try {
      const { id } = req.query || req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'ID de imagen requerido.' });
      }

      await sql`
        DELETE FROM public.gallery_slides 
        WHERE id = ${id};
      `;

      return res.status(200).json({ success: true, deletedId: id });
    } catch (err: any) {
      console.error('[Neon Delete Gallery Error]:', err);
      return res.status(500).json({ error: 'Error al eliminar imagen de la galería.' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
