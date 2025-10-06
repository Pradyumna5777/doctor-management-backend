// controllers/appointmentController.js
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

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
    const { name, email, phone, date, doctorId } = req.body;
    
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    
    let patient;
    
    // FIRST, try to find existing patient by email (important!)
    patient = await User.findOne({ email, role: "patient" });
    
    if (!patient) {
      // If no patient found, create new one
      patient = new User({
        name,
        email,
        password: await bcrypt.hash("temporaryPassword123", 10),
        role: "patient"
      });
      await patient.save();
    } else {
      // If patient exists, update their name if different
      if (patient.name !== name) {
        patient.name = name;
        await patient.save();
      }
    }
    
    const appointment = new Appointment({
      name,
      email,
      phone,
      date,
      doctor: doctorId,
      patient: patient._id
    });
    
    await appointment.save();
    await appointment.populate("doctor", "name email specialty");
    await appointment.populate("patient", "name email");
    
    res.status(201).json({ message: "Appointment created successfully", appointment });
  } catch (err) {
    console.error("Appointment creation error:", err);
    res.status(500).json({ error: err.message });
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
