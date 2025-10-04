// import express from "express";
// import Question from "../../models/Question.js";
// import { verifyToken, requireRole } from "../../middleware/auth.js";

// const router = express.Router();

// // create
// router.post("/", verifyToken, requireRole("admin"), async (req, res) => {
//   try {
//     const q = new Question({ ...req.body, createdBy: req.user._id });
//     await q.save();
//     res.json(q);
//   } catch (err) {
//     console.error(err); res.status(500).json({ message: "err" });
//   }
// });

// // list
// router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
//   const qs = await Question.find().sort({ createdAt: -1 });
//   res.json(qs);
// });

// // update
// router.put("/:id", verifyToken, requireRole("admin"), async (req, res) => {
//   const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(q);
// });

// // delete
// router.delete("/:id", verifyToken, requireRole("admin"), async (req, res) => {
//   await Question.findByIdAndDelete(req.params.id);
//   res.json({ ok: true });
// });

// export default router;

// server/src/routes/admin/questions.js
import express from "express";
import mongoose from "mongoose";
import Question from "../../models/Question.js";
import { verifyToken, requireRole } from "../../middleware/auth.js";

const router = express.Router();

// create question
router.post("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const { text, type, options, correctIndexes, marks } = req.body;
    const q = new Question({ text, type, options, correctIndexes, marks, createdBy: req.user._id });
    await q.save();
    res.json(q);
  } catch (err) {
    console.error("create question err:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// list questions
router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const qs = await Question.find().sort({ createdAt: -1 });
    res.json(qs);
  } catch (err) {
    console.error("list questions err:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// update question
router.put("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(q);
  } catch (err) {
    console.error("update question err:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// delete question
router.delete("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("delete question err:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
