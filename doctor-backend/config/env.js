import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";

dotenv.config({ path: resolve(__dirname, "../", envFile) });

console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
console.log(`📄 Loaded env file: ${envFile}`);
