import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true }
}, { _id: true });

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ["mcq", "multi"], required: true }, // mcq = single correct, multi = many correct
  options: [OptionSchema],
  correctIndexes: [Number], // indexes into options array (0-based)
  marks: { type: Number, default: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);
