import express from "express";
import { createUserByAdmin } from "../controllers/adminController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Admin can create doctor/admin
router.post("/create-user", verifyAdmin, upload.single("image"), createUserByAdmin);

export default router;
