import express from "express";
import Contact from "../models/Contact.js";
import { verifyToken } from "../middleware/auth.js"; // 🔐 middleware
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// Add new contact message (public)
router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all messages (only admin)
// routes/contactRoutes.js
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Contact.countDocuments();
    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      messages,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
