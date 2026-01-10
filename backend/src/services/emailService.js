import nodemailer from 'nodemailer';
import { getDatabase } from '../config/database.js';

const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
const EMAIL_USER = process.env.EMAIL_USER || 'admin@fciacientifica.com.ar';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'Farmacia Científica Malvinas <admin@fciacientifica.com.ar>';

let transporter;

export function initializeEmailService() {
  if (EMAIL_SERVICE === 'gmail') {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      }
    });
  } else if (EMAIL_SERVICE === 'smtp') {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      }
    });
  }

  return transporter;
}

export async function sendEmail(to, subject, htmlContent, textContent = '') {
  try {
    if (!transporter) {
      initializeEmailService();
    }

    const mailOptions = {
      from: EMAIL_FROM,
      to,
      subject,
      html: htmlContent,
      text: textContent || subject
    };

    const info = await transporter.sendMail(mailOptions);

    // Guardar registro de email
    await saveEmailLog({
      to,
      subject,
      status: 'sent',
      messageId: info.messageId
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);

    // Guardar intento fallido
    await saveEmailLog({
      to,
      subject,
      status: 'failed',
      error: error.message
    });

    return { error: error.message };
  }
}

export async function sendOrderConfirmation(email, orderData) {
  const htmlContent = `
    <h1>Confirmación de Compra</h1>
    <p>Gracias por tu compra en Farmacia Científica Malvinas</p>
    <h2>Detalles del Pedido</h2>
    <ul>
      <li><strong>Número de Pedido:</strong> ${orderData.orderNumber}</li>
      <li><strong>Fecha:</strong> ${new Date(orderData.date).toLocaleDateString('es-AR')}</li>
      <li><strong>Total:</strong> $${orderData.total.toFixed(2)}</li>
    </ul>
    <h2>Productos</h2>
    <ul>
      ${orderData.items.map(item => `<li>${item.name} - $${item.price}</li>`).join('')}
    </ul>
    <p>Te contactaremos pronto con información sobre el envío.</p>
    <p>Farmacia Científica Malvinas</p>
  `;

  return sendEmail(email, 'Confirmación de tu Compra', htmlContent);
}

export async function sendReservationConfirmation(email, reservationData) {
  const htmlContent = `
    <h1>Confirmación de Reserva</h1>
    <p>Tu reserva ha sido registrada correctamente</p>
    <h2>Detalles de la Reserva</h2>
    <ul>
      <li><strong>Producto:</strong> ${reservationData.productName}</li>
      <li><strong>Cantidad:</strong> ${reservationData.quantity}</li>
      <li><strong>Fecha de Reserva:</strong> ${new Date(reservationData.date).toLocaleDateString('es-AR')}</li>
    </ul>
    <p>Nos pondremos en contacto contigo para confirmar la disponibilidad y el retiro.</p>
    <p>Farmacia Científica Malvinas</p>
  `;

  return sendEmail(email, 'Confirmación de Reserva', htmlContent);
}

export async function sendContactFormResponse(email, message) {
  const htmlContent = `
    <h1>Hemos Recibido tu Mensaje</h1>
    <p>Gracias por contactarnos. Tu mensaje ha sido recibido correctamente.</p>
    <h2>Tu Mensaje</h2>
    <p>${message.replace(/\n/g, '<br>')}</p>
    <p>Nos contactaremos contigo pronto.</p>
    <p>Farmacia Científica Malvinas</p>
  `;

  return sendEmail(email, 'Hemos recibido tu mensaje', htmlContent);
}

export async function sendNewsletter(subscribers, subject, htmlContent) {
  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    const result = await sendEmail(subscriber.email, subject, htmlContent);
    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed, total: subscribers.length };
}

export async function saveEmailLog(data) {
  try {
    const db = await getDatabase();

    await db.run(
      `INSERT INTO email_logs (recipient, subject, status, error_message)
       VALUES (?, ?, ?, ?)`,
      [data.to, data.subject, data.status, data.error || null]
    );
  } catch (error) {
    console.error('Error saving email log:', error);
  }
}

export async function getEmailLogs(limit = 50) {
  try {
    const db = await getDatabase();

    const logs = await db.all(
      `SELECT * FROM email_logs ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );

    return logs || [];
  } catch (error) {
    console.error('Error getting email logs:', error);
    return [];
  }
}
