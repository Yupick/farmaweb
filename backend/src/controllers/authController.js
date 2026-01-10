import * as userService from '../services/userService.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const result = await userService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta') {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function logout(req, res) {
  // En JWT, el logout es manejado del lado del cliente eliminando el token
  res.json({ message: 'Sesión cerrada correctamente' });
}

export async function getProfile(req, res) {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export async function health(req, res) {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
}
