const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function register(req, res) {
  try {
    const { full_name, email, mobile, date_of_birth, password } = req.body;
    if (!full_name || !email || !mobile || !date_of_birth || !password) {
      return res.status(400).json({ message: "Full name, email, mobile, date of birth, and password are required" });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    if (!/^\d{10}$/.test(String(mobile).trim())) return res.status(400).json({ message: "Enter a valid 10-digit mobile number" });
    const dob = new Date(date_of_birth + "T00:00:00");
    if (Number.isNaN(dob.getTime()) || dob >= new Date()) return res.status(400).json({ message: "Enter a valid date of birth" });
    const age = calculateAge(date_of_birth);
    if (age < 18) return res.status(403).json({ message: "You must be at least 18 years old to register as a voter" });

    const normalizedEmail = String(email).trim().toLowerCase();
    if (await User.findByEmail(normalizedEmail)) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const userId = await User.createUser({
      full_name: String(full_name).trim(),
      email: normalizedEmail,
      mobile: String(mobile).trim(),
      date_of_birth,
      password_hash
    });
    res.status(201).json({ message: "Registration successful", user_id: userId });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Email or mobile is already registered" });
    console.error(error);
    res.status(500).json({ message: "Could not register user" });
  }
}

async function login(req, res) {
  try {
    const { email, password, login_type } = req.body;
    if (!email || !password || !["ADMIN", "VOTER"].includes(login_type)) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findByEmail(String(email).trim().toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.role !== login_type) {
      return res.status(403).json({ message: login_type === "ADMIN" ? "Access denied. This account is not an admin." : "This account is registered as admin. Choose Admin Login." });
    }
    if (user.role === "VOTER" && (!user.date_of_birth || calculateAge(user.date_of_birth) < 18)) return res.status(403).json({ message: "Only voters aged 18 or above can log in and vote" });
    if (user.account_status !== "ACTIVE") return res.status(403).json({ message: "This account is not active" });
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes("replace_this")) {
      return res.status(500).json({ message: "Set a secure JWT_SECRET in backend/.env before logging in" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({
      message: "Login successful",
      token,
      user: { user_id: user.user_id, full_name: user.full_name, email: user.email, mobile: user.mobile, date_of_birth: user.date_of_birth, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not log in" });
  }
}

function calculateAge(value) {
  const dob = new Date(value);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) age--;
  return age;
}
module.exports = { register, login };
