// Minimal email transport abstraction.
//
// No email provider is connected yet, so this currently only logs to the
// server console. Wire up a real provider (e.g. Resend, SES, SMTP) here
// before relying on this in production — see README.md "メール送信について".

export async function sendMail(options: { to: string; subject: string; text: string }) {
  console.log(`[mailer] (no provider configured) would send email to ${options.to}`);
  console.log(`[mailer] subject: ${options.subject}`);
  console.log(`[mailer] body:\n${options.text}`);
}
