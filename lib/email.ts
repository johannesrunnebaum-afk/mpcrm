import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailOptions {
  to: string
  toName: string
  subject: string
  body: string
  fromName: string
  replyTo?: string
}

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY ist nicht konfiguriert. Bitte in .env.local eintragen.')
  }

  const { error } = await resend.emails.send({
    from: `${opts.fromName} <onboarding@resend.dev>`,
    to: [opts.to],
    replyTo: opts.replyTo,
    subject: opts.subject,
    html: buildHtml(opts),
  })

  if (error) throw new Error(error.message)
}

function buildHtml({ toName, fromName, subject, body }: SendEmailOptions): string {
  const escaped = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4F4F7;font-family:'DM Sans',-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6366F1,#8B5CF6);padding:28px 36px;">
            <div style="font-size:18px;font-weight:700;color:#fff;letter-spacing:-0.3px;">Mpilot CRM</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.75);margin-top:4px;">Nachricht von ${fromName}</div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px;">
            <p style="font-size:15px;color:#0F0F1A;margin:0 0 8px 0;">Hallo ${toName},</p>
            <div style="font-size:14px;color:#374151;line-height:1.7;margin:20px 0;">${escaped}</div>
            <hr style="border:none;border-top:1px solid #E8E8E8;margin:28px 0;">
            <p style="font-size:13px;color:#6B7280;margin:0;">Mit freundlichen Grüßen,<br><strong style="color:#0F0F1A;">${fromName}</strong></p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;padding:16px 36px;text-align:center;">
            <p style="font-size:11px;color:#A0A8B8;margin:0;">Gesendet über Mpilot CRM · Diese E-Mail wurde automatisch generiert</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
