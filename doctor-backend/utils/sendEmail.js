// utils/sendEmail.js
import nodemailer from "nodemailer";

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

    // Try different configurations
    const transporterConfigs = [
      {
        // Try SSL first
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user, pass },
        connectionTimeout: 30000,
        socketTimeout: 30000
      },
      {
        // Try TLS
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user, pass },
        connectionTimeout: 30000,
        socketTimeout: 30000
      }
    ];

    let transporter;
    let lastError;

    for (const config of transporterConfigs) {
      try {
        console.log(`🔧 Trying SMTP config: ${config.host}:${config.port} (secure: ${config.secure})`);
        transporter = nodemailer.createTransport(config);
        
        console.log("🔍 Verifying SMTP connection...");
        await transporter.verify();
        console.log(`✅ SMTP connection successful on port ${config.port}`);
        break; // Success, break the loop
      } catch (verifyError) {
        lastError = verifyError;
        console.log(`❌ Failed on port ${config.port}:`, verifyError.message);
        continue; // Try next configuration
      }
    }

    if (!transporter) {
      throw new Error(`All SMTP configurations failed. Last error: ${lastError?.message}`);
    }

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
    } else if (err.code === "ETIMEDOUT" || err.code === "ECONNECTION") {
      console.error("🌐 Connection failed - Possible solutions:");
      console.error("1. Try using a different email service (SendGrid, Mailgun)");
      console.error("2. Check if Render allows outbound SMTP connections");
      console.error("3. Use Gmail API instead of SMTP");
      console.error("4. Contact Render support about SMTP restrictions");
    }
    
    return { 
      success: false, 
      error: err.message,
      code: err.code 
    };
  }
};