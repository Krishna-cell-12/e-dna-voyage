export interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

// Attempts to send using Resend API if VITE_RESEND_API_KEY is set.
export async function sendEmail(options: SendEmailOptions): Promise<{ ok: boolean; error?: string }> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY as string | undefined;
  if (!apiKey) {
    return { ok: false, error: 'RESEND not configured' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from ?? 'Samudrayan <samudrayan.gov@gmail.com>',
        to: options.to,
        subject: options.subject,
        html: options.html ?? undefined,
        text: options.text ?? undefined,
      }),
    });
    if (!res.ok) {
      const msg = await res.text();
      return { ok: false, error: msg || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Unknown error' };
  }
}

export async function sendVerificationEmail(to: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const subject = 'Your Samudrayan Email Verification Code';
  const text = `Your verification code is ${code}. It expires in 10 minutes.`;
  const html = `<p>Your verification code is <strong style="font-size:18px;">${code}</strong>.</p><p>This code expires in 10 minutes.</p>`;
  // Try Resend first
  const primary = await sendEmail({ to, subject, text, html });
  if (primary.ok) return primary;

  // Fallback to EmailJS (client-side only)
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
  if (!serviceId || !templateId || !publicKey) {
    return { ok: false, error: primary.error || 'Email providers not configured' };
  }
  try {
    if (!(window as any).emailjs) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load EmailJS'));
        document.body.appendChild(s);
      });
    }
    const emailjs = (window as any).emailjs;
    emailjs.init(publicKey);
    await emailjs.send(serviceId, templateId, {
      to_email: to,
      from_email: 'samudrayan.gov@gmail.com',
      from_name: 'Samudrayan',
      subject,
      message: text,
      code,
    });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'EmailJS error' };
  }
}


