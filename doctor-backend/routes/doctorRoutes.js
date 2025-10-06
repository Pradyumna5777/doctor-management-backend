import express from "express";
import verifyAdmin from "../middleware/verifyAdmin.js";
import { addDoctor, deleteDoctor, updateDoctor, getDoctors } from "../controllers/doctorController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getDoctors);
router.post("/", verifyAdmin, upload.single("image"), addDoctor);
router.put("/:id", verifyAdmin, upload.single("image"), updateDoctor);
router.delete("/:id", verifyAdmin, deleteDoctor);

export default router;
