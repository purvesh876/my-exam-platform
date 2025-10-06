// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, lowercase: true },
//   role: { type: String, enum: ["admin", "student"], required: true },
//   rollNumber: { type: String, unique: true, sparse: true }, // for students
//   passwordHash: { type: String, required: true },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // for students
// }, { timestamps: true });

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true },
  role: { type: String, enum: ["admin", "student"], required: true, index: true },
  rollNumber: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
