import { getDatabase } from '../config/database.js';

export async function getPublicContent() {
  const db = await getDatabase();
  
  const content = await db.all(
    `SELECT * FROM content WHERE is_active = 1 ORDER BY type, position ASC`
  );

  return content.map(item => ({
    ...item,
    data: item.data ? JSON.parse(item.data) : null
  }));
}

export async function getContentById(contentId) {
  const db = await getDatabase();
  
  const content = await db.get(
    `SELECT * FROM content WHERE id = ?`,
    [contentId]
  );

  if (!content) {
    throw new Error('Contenido no encontrado');
  }

  return {
    ...content,
    data: content.data ? JSON.parse(content.data) : null
  };
}

export async function getContentByType(type) {
  const db = await getDatabase();
  
  const content = await db.all(
    `SELECT * FROM content WHERE type = ? AND is_active = 1 ORDER BY position ASC`,
    [type]
  );

  return content.map(item => ({
    ...item,
    data: item.data ? JSON.parse(item.data) : null
  }));
}

export async function getPageBySlug(slug) {
  const db = await getDatabase();
  // Buscar páginas por coincidencia en JSON data (slug)
  const page = await db.get(
    `SELECT * FROM content WHERE type = 'page' AND is_active = 1 AND (data LIKE ? OR data LIKE ?) LIMIT 1`,
    [
      `%"slug":"${slug}"%`,
      `%"slug": "${slug}"%`
    ]
  );

  if (!page) {
    throw new Error('Página no encontrada');
  }

  return {
    ...page,
    data: page.data ? JSON.parse(page.data) : null
  };
}

export async function createContent(type, title, description, imageUrl, data, position, display_modal = 0, display_footer = 0, display_menu = 0) {
  const db = await getDatabase();
  
  const result = await db.run(
    `INSERT INTO content (type, title, description, image_url, data, position, is_active, display_modal, display_footer, display_menu)
     VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
    [type, title, description, imageUrl, JSON.stringify(data || {}), position || 0, display_modal ? 1 : 0, display_footer ? 1 : 0, display_menu ? 1 : 0]
  );

  return getContentById(result.lastID);
}

export async function updateContent(contentId, updates) {
  const db = await getDatabase();
  
  const allowedFields = ['type', 'title', 'description', 'image_url', 'data', 'position', 'is_active', 'display_modal', 'display_footer', 'display_menu'];
  const fieldsToUpdate = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (allowedFields.includes(dbKey)) {
      fieldsToUpdate.push(`${dbKey} = ?`);
      if (dbKey === 'data') {
        values.push(JSON.stringify(value));
      } else if (dbKey === 'display_modal' || dbKey === 'display_footer' || dbKey === 'display_menu') {
        values.push(value ? 1 : 0);
      } else {
        values.push(value);
      }
    }
  }

  if (fieldsToUpdate.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(contentId);
  
  await db.run(
    `UPDATE content SET ${fieldsToUpdate.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );

  return getContentById(contentId);
}

export async function deleteContent(contentId) {
  const db = await getDatabase();
  
  await db.run(`DELETE FROM content WHERE id = ?`, [contentId]);
}
