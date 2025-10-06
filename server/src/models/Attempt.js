// import mongoose from "mongoose";

// const AnswerSchema = new mongoose.Schema({
//   question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
//   selectedIndexes: [Number],
//   marksObtained: Number
// });

// const ViolationSchema = new mongoose.Schema({
//   type: String, // e.g., "tab-change", "back", "blur"
//   time: { type: Date, default: Date.now }
// });

// const attemptSchema = new mongoose.Schema({
//   test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
//   student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   startedAt: { type: Date, default: Date.now },
//   submittedAt: Date,
//   answers: [AnswerSchema],
//   totalMarks: Number,
//   isSubmitted: { type: Boolean, default: false },
//   violations: [ViolationSchema],
//   violationsCount: { type: Number, default: 0 }
// }, { timestamps: true });

// export default mongoose.model("Attempt", attemptSchema);
import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  selectedIndexes: [Number],
  marksObtained: { type: Number, min: 0 }
});

const ViolationSchema = new mongoose.Schema({
  type: { type: String, enum: ["tab-change", "back", "blur"], required: true },
  time: { type: Date, default: Date.now }
});

const attemptSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startedAt: { type: Date, default: Date.now },
  submittedAt: Date,
  answers: [AnswerSchema],
  totalMarks: { type: Number, default: 0 },
  isSubmitted: { type: Boolean, default: false },
  violations: [ViolationSchema],
  violationsCount: { type: Number, default: 0 }
}, { timestamps: true });

// one attempt per test per student
attemptSchema.index({ test: 1, student: 1 }, { unique: true });

export default mongoose.model("Attempt", attemptSchema);
