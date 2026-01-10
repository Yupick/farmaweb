import * as auditService from '../services/auditService.js';

export async function getAuditLogs(req, res) {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const logs = await auditService.getAuditLogs(parseInt(limit), parseInt(offset));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getMyActivity(req, res) {
  try {
    const { limit = 50 } = req.query;
    const logs = await auditService.getAuditLogsByUser(req.user.id, parseInt(limit));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
