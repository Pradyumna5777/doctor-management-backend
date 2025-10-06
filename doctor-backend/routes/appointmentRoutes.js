// routes/appointmentRoutes.js
import express from "express";
import { getAppointments, createAppointment, cancelAppointment, editAppointment } from "../controllers/appointmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getAppointments);
router.post("/", createAppointment);
router.put("/edit/:id", auth, editAppointment);
router.put("/cancel/:id", auth, cancelAppointment);

export default router;
