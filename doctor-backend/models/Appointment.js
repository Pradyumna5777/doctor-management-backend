import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true }, // Changed to Doctor
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled"], 
    default: "pending" 
  }
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);