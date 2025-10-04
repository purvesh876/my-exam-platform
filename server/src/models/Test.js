import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  durationSeconds: { type: Number, required: true }, // duration in seconds
  startAt: Date,
  endAt: Date,
  questions: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    marks: { type: Number } // override default if needed
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Test", TestSchema);
