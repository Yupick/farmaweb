import { getDatabase } from '../config/database.js';

export async function createAuditLog(userId, action, resource, resourceId, changes, ipAddress) {
  const db = await getDatabase();
  
  await db.run(
    `INSERT INTO audit_logs (user_id, action, resource, resource_id, changes, ip_address) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, action, resource, resourceId, JSON.stringify(changes), ipAddress]
  );
}

export async function getAuditLogs(limit = 100, offset = 0) {
  const db = await getDatabase();
  
  const logs = await db.all(
    `SELECT al.*, u.email FROM audit_logs al 
     LEFT JOIN users u ON al.user_id = u.id 
     ORDER BY al.created_at DESC 
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  return logs;
}

export async function getAuditLogsByUser(userId, limit = 50) {
  const db = await getDatabase();
  
  const logs = await db.all(
    `SELECT * FROM audit_logs 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [userId, limit]
  );

  return logs;
}
