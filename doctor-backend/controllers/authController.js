import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// controllers/authController.js
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Only allow 'patient' from frontend
    const userRole = role === "patient" ? "patient" : "patient";

    // Check if user already exists as a "temporary" patient
    const existingTemporaryPatient = await User.findOne({ email, role: "patient" });
    
    if (existingTemporaryPatient) {
      // Update the existing patient record with the new password and name
      existingTemporaryPatient.name = name;
      existingTemporaryPatient.password = await bcrypt.hash(password, 10);
      await existingTemporaryPatient.save();
      
      // Generate JWT token
      const token = jwt.sign(
        { id: existingTemporaryPatient._id, role: existingTemporaryPatient.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({ 
        message: "User registered and merged with existing appointments", 
        token,
        user: { 
          name: existingTemporaryPatient.name, 
          email: existingTemporaryPatient.email, 
          role: existingTemporaryPatient.role 
        }
      });
    }

    // Create new user if no existing patient found
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash, role: userRole });

    await user.save();
    
    // Generate JWT token for new user
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      message: "User registered",
      token,
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/authController.js
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New Google OAuth login function
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ error: "Google token is required" });

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) return res.status(400).json({ error: "Email not provided by Google" });

    // Find existing user
    let user = await User.findOne({ email });

    if (!user) {
      // No user exists → create new patient
      const randomPassword = Math.random().toString(36) + Date.now().toString();
      user = new User({
        name: name || email.split("@")[0],
        email,
        password: await bcrypt.hash(randomPassword, 10),
        role: "patient",
      });
      await user.save();
    } else {
      // User exists
      if (user.role !== "patient") {
        // If the existing user is not a patient, convert them temporarily to patient
        console.log(`Converting existing user (${user.role}) to patient for Google login`);
        user.role = "patient";
        if (!user.name || user.name === "") user.name = name || email.split("@")[0];
        await user.save();
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id, role: "patient" }, // Always patient role for dashboard
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      user: { name: user.name, email: user.email, role: "patient" },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Google authentication failed" });
  }
};
