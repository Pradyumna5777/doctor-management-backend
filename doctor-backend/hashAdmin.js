import bcrypt from "bcrypt";

const password = "YourAdminPasswordHere"; // replace with your admin password

const hashPassword = async () => {
  try {
    const hashed = await bcrypt.hash(password, 10); // 10 = salt rounds
    console.log("Hashed password:", hashed);
  } catch (err) {
    console.error(err);
  }
};

hashPassword();
