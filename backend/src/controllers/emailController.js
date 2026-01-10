import * as emailService from '../services/emailService.js';

export async function sendTestEmail(req, res) {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Email, subject, and message required' });
    }

    const result = await emailService.sendEmail(
      to,
      subject,
      `<p>${message.replace(/\n/g, '<br>')}</p>`
    );

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    res.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getEmailLogs(req, res) {
  try {
    const limit = req.query.limit || 50;
    const logs = await emailService.getEmailLogs(limit);

    res.json({ data: logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function sendContactFormEmail(req, res) {
  try {
    const { email, name, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({ error: 'Email, subject, and message required' });
    }

    const result = await emailService.sendContactFormResponse(email, message);

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    res.json({ success: true, message: 'Tu mensaje ha sido registrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
