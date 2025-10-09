import bcrypt from "bcrypt";
import Doctor from "../models/Doctor.js"; // Make sure this path is correct
import cloudinary from "../config/cloudinary.js";

export const getDoctors = async (req, res) => {
  try {
    console.log("Fetching doctors...");
    const doctors = await Doctor.find({}, "name phone email specialty role image"); 
    // 👆 explicitly select fields (optional)
    
    console.log("Found doctors:", doctors.length);
    res.json(doctors);
  } catch (err) {
    console.error("Error in getDoctors:", err);
    res.status(500).json({ error: err.message });
  }
};


export const addDoctor = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    const { name, email, phone, password, specialty } = req.body; // ✅ add phone

    // Prevent duplicates
    const existing = await Doctor.findOne({ email });
    if (existing) return res.status(400).json({ error: "Doctor already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Upload image if provided
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "doctors",
      });
      imageUrl = result.secure_url;
    }

    const doctor = new Doctor({
      name,
      email,
      phone, // ✅ add phone
      password: hashed,
      role: "doctor",
      specialty,
      image: imageUrl,
    });

    console.log("Doctor to be saved:", doctor);
    await doctor.save();
    console.log("Doctor saved successfully");

    res.status(201).json({ message: "Doctor created successfully", doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * UPDATE doctor (admin only)
 */
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password, role, specialty } = req.body;

    const updateData = { name, email, phone, role, specialty };

    // Hash password if provided
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Upload new image if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "doctors",
      });
      updateData.image = result.secure_url;
    }

    const doctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    res.json({ message: "Doctor updated successfully", doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE doctor (admin only)
 */
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
