import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Admin registration - protected by ADMIN_SECRET env var
router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;
    if (adminSecret !== process.env.ADMIN_SECRET) return res.status(403).json({ message: "Admin registration closed" });
    const hash = await bcrypt.hash(password, 10);
    const u = new User({ name, email, role: "admin", passwordHash: hash });
    await u.save();
    res.json({ message: "Admin created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login (admin or student) using rollNumber OR email
router.post("/login", async (req, res) => {
  try {
    const { rollNumber, email, password } = req.body;
    const user = rollNumber ? await User.findOne({ rollNumber }) : await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // store httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 3600 * 1000
    });
    res.json({ role: user.role, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

export default router;
