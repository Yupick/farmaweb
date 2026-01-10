import { getDatabase } from '../config/database.js';

export async function getConfigurationByKey(key) {
  const db = await getDatabase();
  
  const config = await db.get(
    `SELECT * FROM configurations WHERE key = ?`,
    [key]
  );

  return config;
}

export async function getAllConfigurations() {
  const db = await getDatabase();
  
  const configs = await db.all(`SELECT * FROM configurations`);
  
  const result = {};
  configs.forEach(config => {
    result[config.key] = config.value;
  });

  return result;
}

export async function updateConfiguration(key, value) {
  const db = await getDatabase();
  
  const existing = await db.get(`SELECT * FROM configurations WHERE key = ?`, [key]);
  
  if (existing) {
    await db.run(
      `UPDATE configurations SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?`,
      [value, key]
    );
  } else {
    await db.run(
      `INSERT INTO configurations (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`,
      [key, value]
    );
  }

  return getConfigurationByKey(key);
}
