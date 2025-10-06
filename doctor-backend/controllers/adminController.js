import bcrypt from "bcrypt";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Admin creates either an Admin or Doctor
 */
export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role, specialty } = req.body;

    if (!["admin", "doctor"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    // Upload image if provided
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: role === "doctor" ? "doctors" : "admins",
      });
      imageUrl = result.secure_url;
    }

    const user = new User({
      name,
      email,
      password: hash,
      role,
      specialty,
      image: imageUrl,
    });

    await user.save();
    res.status(201).json({ message: `${role} created successfully`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
