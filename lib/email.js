import nodemailer from 'nodemailer';

export async function sendOtpEmail(toEmail, otp) {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  const from = process.env.EMAIL_FROM || '"Local Hands" <noreply@localhands.com>';

  console.log(`[EMAIL DEV LOG] Sending OTP ${otp} to ${toEmail}`);

  if (!host || !user || !pass) {
    // Development fallback when SMTP is not configured
    return { success: true, mode: 'dev-log' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Number(port) === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from,
      to: toEmail,
      subject: 'Local Hands - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #2563EB;">Local Hands</h2>
          <p>Your one-time password (OTP) for resetting your password is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #7C3AED; background: #f1f5f9; padding: 12px; text-align: center; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
          <p style="color: #64748b; font-size: 12px;">If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    });

    return { success: true, mode: 'smtp' };
  } catch (error) {
    console.error('Failed to send email via SMTP:', error);
    return { success: false, error: error.message };
  }
}
