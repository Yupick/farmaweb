import * as userService from '../services/userService.js';
import { getDatabase } from '../config/database.js';

export async function getUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getUser(req, res) {
  try {
    const { id } = req.params;

    // Verificar que el usuario solo pueda ver su propio perfil, a menos que sea admin
    if (req.userRole !== 'admin' && parseInt(id) !== req.user.id) {
      return res.status(403).json({ error: 'Permiso denegado' });
    }

    const user = await userService.getUserById(id);
    res.json(user);
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function createUser(req, res) {
  try {
    const { email, password, firstName, lastName, roleId } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    // Verificar que el rol existe
    const db = await getDatabase();
    const role = await db.get(`SELECT id FROM roles WHERE id = ?`, [roleId]);
    
    if (!role) {
      return res.status(400).json({ error: 'Rol no válido' });
    }

    const user = await userService.createUser(email, password, firstName || '', lastName || '', roleId);
    res.status(201).json(user);
  } catch (error) {
    if (error.message === 'El email ya está registrado') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;

    // Verificar que el usuario solo pueda actualizar su propio perfil, a menos que sea admin
    if (req.userRole !== 'admin' && parseInt(id) !== req.user.id) {
      return res.status(403).json({ error: 'Permiso denegado' });
    }

    const user = await userService.updateUser(id, req.body);
    res.json(user);
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function changePassword(req, res) {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Verificar que el usuario solo pueda cambiar su propia contraseña
    if (parseInt(id) !== req.user.id) {
      return res.status(403).json({ error: 'Permiso denegado' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Contraseña actual y nueva requeridas' });
    }

    await userService.changePassword(id, currentPassword, newPassword);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña actual incorrecta') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    if (error.message === 'No se puede eliminar el último administrador') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}
