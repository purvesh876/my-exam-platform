import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, lowercase: true },
  role: { type: String, enum: ["admin", "student"], required: true },
  rollNumber: { type: String, unique: true, sparse: true }, // for students
  passwordHash: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // for students
}, { timestamps: true });

export default mongoose.model("User", userSchema);
