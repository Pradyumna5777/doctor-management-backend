// utils/sendEmail.js
import nodemailer from "nodemailer";
import "../config/env.js"; // ensure .env loads

export const sendEmail = async (to, subject, html, bccAdmin = true) => {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const adminEmail = process.env.ADMIN_EMAIL;

    console.log("📡 Preparing to send email...");
    console.log("EMAIL_USER:", user ? user : "❌ MISSING");
    console.log("EMAIL_PASS:", pass ? "****" : "❌ MISSING");
    console.log("ADMIN_EMAIL:", adminEmail ? adminEmail : "❌ Not set");

    if (!user || !pass) {
      console.error("⚠️ EMAIL_USER or EMAIL_PASS missing. Skipping email send.");
      return;
    }

  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS
  auth: { user, pass },
});


    console.log("🚀 Transporter created. Verifying connection...");

    // Verify transporter connection
    await transporter.verify();
    console.log("✅ SMTP transporter verified successfully.");

    const mailOptions = {
      from: `"Madhuri Nidan Kendra" <${user}>`,
      to,
      subject,
      html,
      ...(bccAdmin && adminEmail ? { bcc: adminEmail } : {}),
    };

    console.log(`✉️ Sending email to: ${to}${bccAdmin && adminEmail ? ` (BCC: ${adminEmail})` : ""}`);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);

  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    console.error(err.stack); // full stack trace

    if (err.code === "EAUTH") {
      console.error("⚠️ Gmail authentication failed — check EMAIL_USER / EMAIL_PASS (App Password).");
    } else if (err.code === "ECONNECTION") {
      console.error("⚠️ Could not connect to SMTP server — check server firewall / ports.");
    }
  }
};
