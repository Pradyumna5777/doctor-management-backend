import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";

import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// load env based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: resolve(__dirname, envFile) });

const app = express();

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://madhuri-nidan-kendra.vercel.app", // Vercel frontend
    ],
    credentials: true,
  })
);
app.use(express.json());

// log current environment
console.log(`Running in ${process.env.NODE_ENV} mode`);

// Serve frontend from backend if exists (optional)
if (process.env.NODE_ENV === "production") {
  const frontendPath = join(__dirname, "public");
  app.use(express.static(frontendPath));

  // Serve index.html for all non-API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(join(frontendPath, "index.html"));
  });
}



// API routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);

// connect DB + start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
