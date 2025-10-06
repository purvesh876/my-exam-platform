// import mongoose from "mongoose";

// const OptionSchema = new mongoose.Schema({
//   text: { type: String, required: true }
// }, { _id: true });

// const questionSchema = new mongoose.Schema({
//   text: { type: String, required: true },
//   type: { type: String, enum: ["mcq", "multi"], required: true }, // mcq = single correct, multi = many correct
//   options: [OptionSchema],
//   correctIndexes: [Number], // indexes into options array (0-based)
//   marks: { type: Number, default: 1 },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
// }, { timestamps: true });

// export default mongoose.model("Question", questionSchema);

import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true }
}, { _id: true });

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  type: { type: String, enum: ["mcq", "multi"], required: true },
  options: {
    type: [OptionSchema],
    validate: [v => v.length > 1, "At least two options are required."]
  },
  correctIndexes: {
    type: [Number],
    validate: {
      validator: function (arr) {
        return arr.every(i => i >= 0 && i < this.options.length);
      },
      message: "Correct index out of range"
    }
  },
  marks: { type: Number, default: 1, min: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);
