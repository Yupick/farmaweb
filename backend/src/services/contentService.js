import { getDatabase } from '../config/database.js';

export async function getPublicContent() {
  const db = await getDatabase();
  
  const content = await db.all(
    `SELECT * FROM content WHERE is_active = 1 ORDER BY type, position ASC`
  );

  return content;
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

  return content;
}

export async function getContentByType(type) {
  const db = await getDatabase();
  
  const content = await db.all(
    `SELECT * FROM content WHERE type = ? AND is_active = 1 ORDER BY position ASC`,
    [type]
  );

  return content;
}

export async function createContent(type, title, description, imageUrl, data, position) {
  const db = await getDatabase();
  
  const result = await db.run(
    `INSERT INTO content (type, title, description, image_url, data, position, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [type, title, description, imageUrl, JSON.stringify(data || {}), position || 0]
  );

  return getContentById(result.lastID);
}

export async function updateContent(contentId, updates) {
  const db = await getDatabase();
  
  const allowedFields = ['type', 'title', 'description', 'image_url', 'data', 'position', 'is_active'];
  const fieldsToUpdate = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (allowedFields.includes(dbKey)) {
      fieldsToUpdate.push(`${dbKey} = ?`);
      values.push(dbKey === 'data' ? JSON.stringify(value) : value);
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
