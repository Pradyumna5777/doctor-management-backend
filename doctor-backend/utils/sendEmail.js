// utils/sendEmail.js
import nodemailer from "nodemailer";
import "../config/env.js"; // ensures correct .env file loads in both dev & prod

export const sendEmail = async (to, subject, html, bccAdmin = true) => {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const adminEmail = process.env.ADMIN_EMAIL; // optional clinic copy

    if (!user || !pass) {
      console.error("⚠️ EMAIL_USER or EMAIL_PASS missing. Skipping email send.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const mailOptions = {
      from: `"Madhuri Nidan Kendra" <${user}>`,
      to,
      subject,
      html,
      ...(bccAdmin && adminEmail ? { bcc: adminEmail } : {}), // CC admin copy
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${to}${bccAdmin && adminEmail ? ` (BCC: ${adminEmail})` : ""}`);
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    if (err.code === "EAUTH") {
      console.error("⚠️ Gmail authentication failed — check EMAIL_USER / EMAIL_PASS (App Password).");
    }
  }
};
