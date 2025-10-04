// import express from "express";
// import Test from "../../models/Test.js";
// import { verifyToken, requireRole } from "../../middleware/auth.js";

// const router = express.Router();

// router.post("/", verifyToken, requireRole("admin"), async (req, res) => {
//   try {
//     const { name, durationSeconds, startAt, endAt, questions } = req.body;
//     const t = new Test({
//       name,
//       durationSeconds,
//       startAt: startAt ? new Date(startAt) : null,
//       endAt: endAt ? new Date(endAt) : null,
//       questions,
//       createdBy: req.user._id
//     });
//     await t.save();
//     res.json(t);
//   } catch (err) {
//     console.error(err); res.status(500).json({ message: "err" });
//   }
// });

// // list tests (admin)
// router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
//   const tests = await Test.find().populate("questions.question");
//   res.json(tests);
// });

// export default router;

// server/src/routes/admin/tests.js
import express from "express";
import mongoose from "mongoose";
import Test from "../../models/Test.js";
import Question from "../../models/Question.js";
import { verifyToken, requireRole } from "../../middleware/auth.js";

const router = express.Router();

// Create a test
// Body: { name, durationSeconds, startAt, endAt, questions: [{ question: questionId, marks }] }
router.post("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const { name, durationSeconds, startAt, endAt, questions } = req.body;
    const test = new Test({
      name,
      durationSeconds,
      startAt: startAt ? new Date(startAt) : null,
      endAt: endAt ? new Date(endAt) : null,
      questions: questions || [],
      createdBy: req.user._id
    });
    await test.save();
    res.json(test);
  } catch (err) {
    console.error("create test err:", err);
    res.status(500).json({ message: "Server error creating test" });
  }
});

// List all tests (admin)
router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const tests = await Test.find()
      .populate({ path: "questions.question", select: "text type options marks" })
      .sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    console.error("list tests err:", err);
    res.status(500).json({ message: "Server error listing tests" });
  }
});

// Get single test by id
router.get("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "Invalid test id" });
    const test = await Test.findById(req.params.id)
      .populate({ path: "questions.question", select: "text type options marks correctIndexes" });
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json(test);
  } catch (err) {
    console.error("get test err:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update test
router.put("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const update = req.body;
    const test = await Test.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(test);
  } catch (err) {
    console.error("update test err:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete test
router.delete("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("delete test err:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
