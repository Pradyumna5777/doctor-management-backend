import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  phone: String,
  email: String,
 role: { type: String, default: "doctor" },
  image: String, // store Cloudinary URL  bio: String,
  timings: String
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
