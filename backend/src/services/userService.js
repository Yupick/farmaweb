import { getDatabase } from '../config/database.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

export async function loginUser(email, password) {
  const db = await getDatabase();
  
  const user = await db.get(
    `SELECT u.*, r.name as role_name FROM users u 
     JOIN roles r ON u.role_id = r.id 
     WHERE u.email = ?`,
    [email]
  );

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Contraseña incorrecta');
  }

  if (user.status !== 'active') {
    throw new Error('Usuario inactivo');
  }

  // Actualizar último login
  await db.run(
    `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`,
    [user.id]
  );

  const token = generateToken(user);
  
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role_name
    }
  };
}

export async function getUserById(userId) {
  const db = await getDatabase();
  
  const user = await db.get(
    `SELECT u.*, r.name as role_name FROM users u 
     JOIN roles r ON u.role_id = r.id 
     WHERE u.id = ?`,
    [userId]
  );

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    role: user.role_name,
    status: user.status,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
}

export async function getAllUsers() {
  const db = await getDatabase();
  
  const users = await db.all(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, 
            r.name as role, u.status, u.created_at, u.updated_at 
     FROM users u 
     JOIN roles r ON u.role_id = r.id 
     ORDER BY u.created_at DESC`
  );

  return users;
}

export async function createUser(email, password, firstName, lastName, roleId) {
  const db = await getDatabase();
  
  // Verificar si el usuario ya existe
  const existingUser = await db.get(
    `SELECT id FROM users WHERE email = ?`,
    [email]
  );

  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  const passwordHash = await hashPassword(password);
  
  const result = await db.run(
    `INSERT INTO users (email, password_hash, first_name, last_name, role_id, status) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [email, passwordHash, firstName, lastName, roleId, 'active']
  );

  return {
    id: result.lastID,
    email,
    firstName,
    lastName,
    roleId
  };
}

export async function updateUser(userId, updates) {
  const db = await getDatabase();
  
  const allowedFields = ['first_name', 'last_name', 'phone', 'status'];
  const fieldsToUpdate = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (allowedFields.includes(dbKey)) {
      fieldsToUpdate.push(`${dbKey} = ?`);
      values.push(value);
    }
  }

  if (fieldsToUpdate.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(userId);
  
  await db.run(
    `UPDATE users SET ${fieldsToUpdate.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );

  return getUserById(userId);
}

export async function deleteUser(userId) {
  const db = await getDatabase();
  
  // No permitir eliminar al único admin
  const adminCount = await db.get(
    `SELECT COUNT(*) as count FROM users u 
     JOIN roles r ON u.role_id = r.id 
     WHERE r.name = 'admin'`
  );

  if (adminCount.count === 1) {
    const user = await db.get(`SELECT u.* FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ? AND r.name = 'admin'`, [userId]);
    if (user) {
      throw new Error('No se puede eliminar el último administrador');
    }
  }

  await db.run(`DELETE FROM users WHERE id = ?`, [userId]);
}

export async function changePassword(userId, currentPassword, newPassword) {
  const db = await getDatabase();
  
  const user = await db.get(`SELECT password_hash FROM users WHERE id = ?`, [userId]);
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isPasswordValid = await comparePassword(currentPassword, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Contraseña actual incorrecta');
  }

  const newPasswordHash = await hashPassword(newPassword);
  
  await db.run(
    `UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [newPasswordHash, userId]
  );
}
