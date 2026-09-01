import { Resend } from 'resend';

const FROM_EMAIL = 'Hamza Elhatimy <hello@hamzaautomate.site>';
const DEFAULT_OWNER_EMAIL = 'hamzaelhatimy7@gmail.com';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const clean = (value, maxLength) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

function autoReplyHtml(name) {
  const safeName = escapeHtml(name);

  return `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;background:#0b0d12;color:#e7e9ee;font-family:Arial,sans-serif">
        <div style="max-width:600px;margin:0 auto;padding:40px 24px">
          <div style="border:1px solid #262b36;border-radius:18px;background:#12151c;padding:32px">
            <p style="margin:0 0 22px;color:#8b5cf6;font-size:13px;font-weight:700;letter-spacing:.08em">HAMZA AUTOMATE</p>
            <h1 style="margin:0 0 18px;font-size:26px;line-height:1.25">Thanks for reaching out, ${safeName}.</h1>
            <p style="margin:0 0 14px;color:#b8bec9;line-height:1.7">I received your message and will review it shortly.</p>
            <p style="margin:0 0 28px;color:#b8bec9;line-height:1.7">You can expect a personal reply within 24–48 hours.</p>
            <p style="margin:0;color:#e7e9ee;line-height:1.6">Best regards,<br><strong>Hamza Elhatimy</strong></p>
          </div>
          <p style="margin:18px 0 0;text-align:center;color:#737b8c;font-size:12px">This confirmation was sent from hamzaautomate.site.</p>
        </div>
      </body>
    </html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured.');
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  const name = clean(req.body?.name, 100);
  const email = clean(req.body?.email, 254).toLowerCase();
  const subject = clean(req.body?.subject, 160) || 'Portfolio enquiry';
  const message = clean(req.body?.message, 5000);
  const submissionId = clean(req.body?.submissionId, 100);

  if (!name || !message || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid name, email, and message.' });
  }

  if (!/^[a-zA-Z0-9_-]{8,100}$/.test(submissionId)) {
    return res.status(400).json({ error: 'Invalid form submission.' });
  }

  const ownerEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_OWNER_EMAIL;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br>');

  const { data, error } = await resend.batch.send(
    [
      {
        from: FROM_EMAIL,
        to: [ownerEmail],
        replyTo: email,
        subject: `New portfolio message: ${subject}`,
        html: `<h2>New contact from ${safeName}</h2><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Subject:</strong> ${safeSubject}</p><p><strong>Message:</strong></p><p>${safeMessage}</p>`,
        text: `New contact from ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      },
      {
        from: FROM_EMAIL,
        to: [email],
        replyTo: ownerEmail,
        subject: `Thanks for reaching out, ${name}!`,
        html: autoReplyHtml(name),
        text: `Hi ${name},\n\nThank you for getting in touch. I received your message and will review it shortly. You can expect a personal reply within 24–48 hours.\n\nBest regards,\nHamza Elhatimy`,
      },
    ],
    { idempotencyKey: `batch-contact-form/${submissionId}` }
  );

  if (error) {
    console.error('Resend error:', error);
    const status = Number(error.statusCode);
    return res
      .status(Number.isInteger(status) && status >= 400 && status < 500 ? status : 502)
      .json({ error: 'Your message could not be sent. Please try again.' });
  }

  return res.status(200).json({ success: true, ids: data?.data?.map(({ id }) => id) ?? [] });
}
