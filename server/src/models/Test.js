// import mongoose from "mongoose";

// const TestSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   durationSeconds: { type: Number, required: true }, // duration in seconds
//   startAt: Date,
//   endAt: Date,
//   questions: [{
//     question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
//     marks: { type: Number } // override default if needed
//   }],
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
// }, { timestamps: true });

// export default mongoose.model("Test", TestSchema);

import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  durationSeconds: { type: Number, required: true, min: 10 },
  startAt: Date,
  endAt: Date,
  isPublished: { type: Boolean, default: false },
  questions: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    marks: { type: Number, min: 0,default:1 }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

TestSchema.path("endAt").validate(function (value) {
  if (this.startAt && value && value < this.startAt)
    throw new Error("endAt must be after startAt");
  return true;
});

export default mongoose.model("Test", TestSchema);
