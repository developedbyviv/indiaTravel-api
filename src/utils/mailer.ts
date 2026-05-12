import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Send an enquiry notification email to the admin.
 */
export const sendEnquiryNotification = async (
  subject: string,
  html: string
): Promise<void> => {
  await transporter.sendMail({
    from: `"indiaTravel.net" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  });
};

/**
 * Send an OTP email to the user for password reset.
 */
export const sendOtpEmail = async (
  to: string,
  otp: string
): Promise<void> => {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Password Reset OTP</h2>
      <p>Your one-time password (OTP) for resetting your indiaTravel.net account password is:</p>
      <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e40af; padding: 16px 0;">
        ${otp}
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        This OTP is valid for <strong>${process.env.OTP_EXPIRY_MINUTES || 10} minutes</strong>. 
        Do not share it with anyone.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"indiaTravel.net" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Your Password Reset OTP — indiaTravel.net',
    html,
  });
};
