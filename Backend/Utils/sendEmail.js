const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html, attachments }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({ from: SMTP_FROM, to, subject, html, attachments });
    return true;
  } catch (error) {
    console.error("Email notification failed:", error.message);
    return false;
  }
};

module.exports = sendEmail;
