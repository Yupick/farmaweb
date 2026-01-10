import * as reservationService from '../services/reservationService.js';

export async function createReservation(req, res) {
  try {
    const { phoneNumber, email, productId, quantity, notes } = req.body;

    if (!phoneNumber || !email || !productId || !quantity) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const result = await reservationService.createReservation(
      phoneNumber,
      email,
      productId,
      quantity,
      notes
    );

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getReservations(req, res) {
  try {
    const filters = {
      status: req.query.status,
      phoneNumber: req.query.phoneNumber,
      productId: req.query.productId,
      limit: req.query.limit || 50
    };

    const reservations = await reservationService.getReservations(filters);

    res.json({ data: reservations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getReservationById(req, res) {
  try {
    const { id } = req.params;

    const reservation = await reservationService.getReservationById(id);

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateReservationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const result = await reservationService.updateReservationStatus(id, status);

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    res.json({ success: true, message: 'Reserva actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function cancelReservation(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await reservationService.cancelReservation(id, reason);

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    res.json({ success: true, message: 'Reserva cancelada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getReservationStats(req, res) {
  try {
    const stats = await reservationService.getReservationStats();

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
