import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Explicit path
dotenv.config({ path: ".env.development" }); // or ".env" if you renamed it

// Validate env
const requiredVars = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
requiredVars.forEach(v => {
  if (!process.env[v]) {
    console.error(`❌ Missing env variable: ${v}`);
  }
});

console.log("Cloudinary ENV values:");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌");

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
