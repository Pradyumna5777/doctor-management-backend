// utils/sendEmail.js
import nodemailer from "nodemailer";
import "../config/env.js"; // ensure .env loads

export const sendEmail = async (to, subject, html, bccAdmin = true) => {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const adminEmail = process.env.ADMIN_EMAIL;

    console.log("📡 Email Configuration Check:");
    console.log("EMAIL_USER:", user ? "✅ Set" : "❌ MISSING");
    console.log("EMAIL_PASS:", pass ? "✅ Set" : "❌ MISSING");
    console.log("Recipient:", to);

    if (!user || !pass) {
      console.error("❌ Email credentials missing");
      throw new Error("Email configuration incomplete");
    }

    if (!to) {
      console.error("❌ No recipient specified");
      throw new Error("No email recipient specified");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 60000,
    });

    console.log("🔍 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const mailOptions = {
      from: `"Madhuri Nidan Kendra" <${user}>`,
      to: to,
      subject: subject,
      html: html,
      ...(bccAdmin && adminEmail ? { bcc: adminEmail } : {}),
    };

    console.log(`✉️ Sending email to: ${to}`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email sent successfully:", info.messageId);
    console.log("📧 Response:", info.response);
    
    return { success: true, messageId: info.messageId };

  } catch (err) {
    console.error("❌ Email sending failed:");
    console.error("Error Name:", err.name);
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
    
    if (err.code === "EAUTH") {
      console.error("🔐 Authentication failed - Check:");
      console.error("1. Gmail username/password");
      console.error("2. 2FA is enabled");
      console.error("3. App Password is used (not regular password)");
    } else if (err.code === "ECONNECTION") {
      console.error("🌐 Connection failed - Check:");
      console.error("1. Internet connection");
      console.error("2. Firewall settings");
      console.error("3. Port 587 is open");
    } else if (err.code === "EENVELOPE") {
      console.error("📨 Envelope error - Check recipient email:", to);
    }
    
    return { 
      success: false, 
      error: err.message,
      code: err.code 
    };
  }
};