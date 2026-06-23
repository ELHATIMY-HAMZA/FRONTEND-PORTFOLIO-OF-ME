import { Resend } from 'resend';

// Vercel serverless functions support ES modules if the project type is module or natively in some cases.
// We initialized package.json with "type": "module" implicitly if not we use ES syntax because Vercel transpiles or supports it.

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    const data = await resend.batch.send([
      // 1. Email to YOU (notification)
      {
        from: 'onboarding@resend.dev', // Replace with your verified domain (e.g., hello@yourdomain.com) when ready
        to: 'hamzaelhatimy7@gmail.com',
        subject: `New Portfolio Message: ${subject || 'No Subject'}`,
        html: `
          <h3>New Contact Message from ${name}</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      },
      // 2. Auto-reply to the USER (thank you)
      {
        from: 'onboarding@resend.dev', // Replace with your verified domain (e.g., hello@yourdomain.com) when ready
        to: email, // Sends back to the person who filled the form
        subject: `Thank you for reaching out, ${name}!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
            <h2>Hi ${name},</h2>
            <p>Thank you for getting in touch! I've received your message and will review it shortly.</p>
            <p>I usually respond within 24-48 hours. I'm looking forward to connecting!</p>
            <br>
            <p>Best regards,</p>
            <p><strong>Hamza Elhatimy</strong></p>
          </div>
        `
      }
    ]);

    res.status(200).json(data);
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ error: error.message });
  }
}
