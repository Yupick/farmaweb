import { verifyToken } from '../utils/auth.js';
import { createAuditLog } from '../services/auditService.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }

  req.user = decoded;
  next();
}

export function authorizeRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const { getDatabase } = await import('../config/database.js');
      const db = await getDatabase();
      
      const user = await db.get(
        `SELECT r.name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
        [req.user.id]
      );

      if (!user || !allowedRoles.includes(user.name)) {
        return res.status(403).json({ error: 'Permiso denegado' });
      }

      req.userRole = user.name;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Error de autenticación' });
    }
  };
}

export function logAction(resource) {
  return async (req, res, next) => {
    const originalSend = res.send;

    res.send = async function(data) {
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const ip = req.ip || req.connection.remoteAddress;
          await createAuditLog(
            req.user.id,
            req.method,
            resource,
            req.params.id || null,
            req.body,
            ip
          );
        } catch (error) {
          console.error('Error logging audit:', error);
        }
      }

      originalSend.call(this, data);
    };

    next();
  };
}

export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.message === 'Usuario no encontrado') {
    return res.status(404).json({ error: err.message });
  }

  if (err.message === 'Contraseña incorrecta' || err.message === 'Usuario inactivo') {
    return res.status(401).json({ error: err.message });
  }

  if (err.message === 'El email ya está registrado') {
    return res.status(409).json({ error: err.message });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
}
