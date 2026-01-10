import { getDatabase } from '../config/database.js';
import { sendReservationConfirmation } from './emailService.js';

export async function createReservation(phoneNumber, email, productId, quantity, notes = '') {
  try {
    const db = await getDatabase();

    const result = await db.run(
      `INSERT INTO reservations (phone_number, email, product_id, quantity, notes, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [phoneNumber, email, productId, quantity, notes]
    );

    // Enviar confirmación por email
    const reservation = {
      productName: `Producto #${productId}`,
      quantity,
      date: new Date().toISOString()
    };
    
    await sendReservationConfirmation(email, reservation);

    return {
      success: true,
      reservationId: result.lastID
    };
  } catch (error) {
    console.error('Error creating reservation:', error);
    return { error: error.message };
  }
}

export async function getReservations(filters = {}) {
  try {
    const db = await getDatabase();

    let query = 'SELECT * FROM reservations WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.phoneNumber) {
      query += ' AND phone_number = ?';
      params.push(filters.phoneNumber);
    }

    if (filters.productId) {
      query += ' AND product_id = ?';
      params.push(filters.productId);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(filters.limit || 50);

    const reservations = await db.all(query, params);

    return reservations || [];
  } catch (error) {
    console.error('Error getting reservations:', error);
    return [];
  }
}

export async function getReservationById(id) {
  try {
    const db = await getDatabase();

    const reservation = await db.get(
      'SELECT * FROM reservations WHERE id = ?',
      [id]
    );

    return reservation;
  } catch (error) {
    console.error('Error getting reservation:', error);
    return null;
  }
}

export async function updateReservationStatus(id, status) {
  try {
    const db = await getDatabase();

    await db.run(
      'UPDATE reservations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating reservation:', error);
    return { error: error.message };
  }
}

export async function cancelReservation(id, reason = '') {
  try {
    const db = await getDatabase();

    await db.run(
      'UPDATE reservations SET status = ?, cancellation_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['cancelled', reason, id]
    );

    return { success: true };
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    return { error: error.message };
  }
}

export async function getReservationStats() {
  try {
    const db = await getDatabase();

    const stats = await db.get(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
       FROM reservations`
    );

    return stats;
  } catch (error) {
    console.error('Error getting reservation stats:', error);
    return { total: 0, pending: 0, confirmed: 0, cancelled: 0, completed: 0 };
  }
}
