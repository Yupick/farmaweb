import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import * as reservationController from '../controllers/reservationController.js';

const router = express.Router();

// Crear reservación (público - desde WhatsApp o web)
router.post('/', reservationController.createReservation);

// Obtener reservaciones (solo admin)
router.get('/', authenticateToken, authorizeRole('admin'), reservationController.getReservations);

// Obtener estadísticas de reservaciones (solo admin)
router.get('/stats', authenticateToken, authorizeRole('admin'), reservationController.getReservationStats);

// Obtener reservación por ID (solo admin)
router.get('/:id', authenticateToken, authorizeRole('admin'), reservationController.getReservationById);

// Actualizar estado de reservación (solo admin)
router.put('/:id/status', authenticateToken, authorizeRole('admin'), reservationController.updateReservationStatus);

// Cancelar reservación (solo admin)
router.post('/:id/cancel', authenticateToken, authorizeRole('admin'), reservationController.cancelReservation);

export default router;
