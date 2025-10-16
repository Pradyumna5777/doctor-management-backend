// controllers/appointmentController.js
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";

// controllers/appointmentController.js
export const getAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Make sure req.user.id exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: user id missing" });
    }

    let query = {};
    if (req.user.role === "doctor") query = { doctor: req.user.id };
    if (req.user.role === "patient") query = { patient: req.user.id };

    const total = await Appointment.countDocuments(query);

    const appointments = await Appointment.find(query)
      .populate("doctor", "name email specialty")
      .populate("patient", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      appointments,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("getAppointments error:", err);
    res.status(500).json({ error: err.message });
  }
};



// controllers/appointmentController.js
export const createAppointment = async (req, res) => {
  try {
    const { name, email, phone, date, doctorId, notes } = req.body;

    // --- Check doctor ---
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    // --- Find or create patient ---
    let patient = await User.findOne({ email, role: "patient" });
    if (!patient) {
      patient = new User({
        name,
        email,
        password: await bcrypt.hash("temporaryPassword123", 10),
        role: "patient",
      });
      await patient.save();
    } else if (patient.name !== name) {
      patient.name = name;
      await patient.save();
    }

    // --- Create appointment ---
    const appointment = new Appointment({
      name,
      email,
      phone,
      date,
      doctor: doctorId,
      patient: patient._id,
      status: "pending",
      notes: notes || "" // Make sure notes are saved
    });

    await appointment.save();
    await appointment.populate("doctor", "name email specialty");
    await appointment.populate("patient", "name email");

    // --- Email notifications with error handling ---
    const formattedDate = new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    // Email to doctor
    const doctorEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">🩺 New Appointment Booking</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          <p><strong>Doctor:</strong> ${doctor.name}</p>
          <p><strong>Patient Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Date & Time:</strong> ${formattedDate}</p>
          ${notes ? `<p><strong>Patient Notes:</strong> ${notes}</p>` : ""}
        </div>
        <br/>
        <p>Please log in to your doctor portal to view and manage this appointment.</p>
        <p style="color: #64748b;">– Madhuri Nidan Kendra, Hasanpura</p>
      </div>
    `;

    // Email to patient
    const patientEmailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">✅ Appointment Confirmation</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your appointment has been successfully booked at <strong>Madhuri Nidan Kendra</strong>.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #059669;">
          <h3 style="margin-top: 0;">Appointment Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li>📋 <strong>Doctor:</strong> Dr. ${doctor.name}</li>
            <li>🎯 <strong>Specialty:</strong> ${doctor.specialty || "General Consultation"}</li>
            <li>📅 <strong>Date & Time:</strong> ${formattedDate}</li>
            <li>📍 <strong>Clinic:</strong> Madhuri Nidan Kendra, Hasanpura</li>
            <li>📞 <strong>Clinic Phone:</strong> +91 9939497429</li>
          </ul>
          ${notes ? `<p><strong>Your Notes:</strong> ${notes}</p>` : ""}
        </div>
        
        <div style="background: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
          <h4 style="margin-top: 0;">📍 Clinic Address:</h4>
          <p>Opp. M. H. Nagar Police Station,<br>Hasanpura, Siwan - 841236</p>
        </div>
        
        <p><strong>Please arrive 10-15 minutes early for your appointment.</strong></p>
        
        <p style="color: #64748b;">Thank you for choosing Madhuri Nidan Kendra. We look forward to serving you!</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px;">This is an automated confirmation. Please do not reply to this email.</p>
      </div>
    `;

    // Send emails with robust error handling
    const emailResults = {
      doctorEmail: { success: false, error: null },
      patientEmail: { success: false, error: null }
    };

    try {
      console.log(`📧 Attempting to send email to doctor: ${doctor.email}`);
      emailResults.doctorEmail = await sendEmail(
        doctor.email, 
        `🩺 New Appointment from ${name}`, 
        doctorEmailBody
      );
    } catch (emailError) {
      console.error('❌ Failed to send email to doctor:', emailError.message);
      emailResults.doctorEmail.error = emailError.message;
    }

    try {
      console.log(`📧 Attempting to send email to patient: ${email}`);
      emailResults.patientEmail = await sendEmail(
        email, 
        `Appointment Confirmation with Dr. ${doctor.name}`, 
        patientEmailBody
      );
    } catch (emailError) {
      console.error('❌ Failed to send email to patient:', emailError.message);
      emailResults.patientEmail.error = emailError.message;
    }

    // Log email results
    console.log('📨 Email sending results:', JSON.stringify(emailResults, null, 2));

    // Prepare response message based on email results
    let emailStatusMessage = "Appointment created successfully. ";
    
    if (emailResults.doctorEmail.success && emailResults.patientEmail.success) {
      emailStatusMessage += "Confirmation emails sent to both doctor and patient.";
    } else if (emailResults.doctorEmail.success) {
      emailStatusMessage += "Email sent to doctor, but failed to send patient confirmation.";
    } else if (emailResults.patientEmail.success) {
      emailStatusMessage += "Email sent to patient, but failed to send doctor notification.";
    } else {
      emailStatusMessage += "Appointment created but email notifications failed. Please contact the clinic directly.";
    }

    res.status(201).json({
      message: emailStatusMessage,
      appointment: {
        _id: appointment._id,
        name: appointment.name,
        email: appointment.email,
        phone: appointment.phone,
        date: appointment.date,
        doctor: appointment.doctor,
        status: appointment.status,
        notes: appointment.notes
      },
      emailResults: {
        doctor: emailResults.doctorEmail.success ? 'sent' : 'failed',
        patient: emailResults.patientEmail.success ? 'sent' : 'failed'
      }
    });

  } catch (err) {
    console.error("Appointment creation error:", err);
    
    // More specific error responses
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: Object.values(err.errors).map(e => e.message) 
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "Duplicate appointment found" 
      });
    }
    
    res.status(500).json({ 
      error: "Failed to create appointment. Please try again or contact the clinic directly." 
    });
  }
};

// Cancel appointment by patient
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Only patient who booked the appointment can cancel
    const appointment = await Appointment.findOne({ _id: id, patient: req.user.id });
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Edit appointment by patient (date, phone, name)
export const editAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, phone, name } = req.body;

    // Only patient who booked the appointment can edit
    const appointment = await Appointment.findOne({ _id: id, patient: req.user.id });
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    if (date) appointment.date = date;
    if (phone) appointment.phone = phone;
    if (name) appointment.name = name;

    await appointment.save();

    res.json({ message: "Appointment updated successfully", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
