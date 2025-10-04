import express from "express";
import Test from "../../models/Test.js";
import Attempt from "../../models/Attempt.js";
import Question from "../../models/Question.js";
import { verifyToken, requireRole } from "../../middleware/auth.js";

const router = express.Router();

// list available tests for student (times enforced)
router.get("/available", verifyToken, async (req, res) => {
  const now = new Date();
  const tests = await Test.find({
    $and: [
      { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
      { $or: [{ endAt: null }, { endAt: { $gte: now } }] }
    ]
  }).select("-questions"); // admin may include questions or not
  res.json(tests);
});

// start attempt: create Attempt & return populated questions (without correctAnswers!)
router.post("/:testId/start", verifyToken, async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId).populate("questions.question");
    if (!test) return res.status(404).json({ message: "Test not found" });
    const now = new Date();
    if (test.startAt && now < test.startAt) return res.status(400).json({ message: "Not started yet" });
    if (test.endAt && now > test.endAt) return res.status(400).json({ message: "Test ended" });
    // prevent multiple attempts - simple approach
    const prev = await Attempt.findOne({ test: test._id, student: req.user._id });
    if (prev && prev.isSubmitted) return res.status(400).json({ message: "Already attempted" });

    const attempt = new Attempt({
      test: test._id,
      student: req.user._id,
      startedAt: now
    });
    await attempt.save();

    // return questions but strip correctIndexes
    const questions = test.questions.map(q => {
      return {
        id: q.question._id,
        text: q.question.text,
        type: q.question.type,
        options: q.question.options
      };
    });

    res.json({
      attemptId: attempt._id,
      durationSeconds: test.durationSeconds,
      testName: test.name,
      startedAt: attempt.startedAt,
      questions
    });
  } catch (err) {
    console.error(err); res.status(500).json({ message: "err" });
  }
});

// helper to evaluate answers
const evaluate = async (testId, answers = []) => {
  const test = await Test.findById(testId).populate("questions.question");
  let total = 0;
  const answerResults = [];
  for (const qItem of test.questions) {
    const q = qItem.question;
    const submitted = answers.find(a => String(a.question) === String(q._id));
    const correct = q.correctIndexes || [];
    let marksObtained = 0;
    if (submitted) {
      if (q.type === "mcq") {
        // single correct: correct index matching
        if (submitted.selectedIndexes?.[0] === correct[0]) marksObtained = qItem.marks ?? q.marks;
      } else {
        // multi: exact match for now
        const s = (submitted.selectedIndexes || []).sort().join(",");
        const c = (correct || []).sort().join(",");
        if (s === c) marksObtained = qItem.marks ?? q.marks;
      }
    }
    total += marksObtained;
    answerResults.push({
      question: q._id,
      selectedIndexes: submitted ? submitted.selectedIndexes : [],
      marksObtained
    });
  }
  return { total, answerResults };
};

// submit attempt (student submits their final answers)
router.post("/:attemptId/submit", verifyToken, async (req, res) => {
  try {
    const { answers } = req.body;
    const attempt = await Attempt.findById(req.params.attemptId);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    if (String(attempt.student) !== String(req.user._id)) return res.status(403).json({ message: "Not your attempt" });
    if (attempt.isSubmitted) return res.status(400).json({ message: "Already submitted" });

    // server-side time enforcement
    const test = await Test.findById(attempt.test);
    const now = new Date();
    const timeElapsed = (now - new Date(attempt.startedAt)) / 1000;
    if (timeElapsed > test.durationSeconds + 5) { // small leeway
      // auto-evaluate with whatever answers were sent (or none)
    }

    const { total, answerResults } = await evaluate(attempt.test, answers || []);
    attempt.answers = answerResults;
    attempt.totalMarks = total;
    attempt.isSubmitted = true;
    attempt.submittedAt = new Date();
    await attempt.save();
    res.json({ total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "err" });
  }
});

// log a violation
router.post("/:attemptId/violation", verifyToken, async (req, res) => {
  try {
    const { type } = req.body;
    const attempt = await Attempt.findById(req.params.attemptId);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    attempt.violations.push({ type });
    attempt.violationsCount = attempt.violations.length;
    const THRESHOLD = parseInt(process.env.VIOLATION_THRESHOLD || "3", 10);

    // if threshold reached -> auto-submit
    if (attempt.violationsCount >= THRESHOLD && !attempt.isSubmitted) {
      // evaluate with whatever answers are stored (if none -> 0)
      // we save answers as empty array if none (you could expand to save in-progress answers)
      const { total, answerResults } = await evaluate(attempt.test, attempt.answers || []);
      attempt.answers = answerResults;
      attempt.totalMarks = total;
      attempt.isSubmitted = true;
      attempt.submittedAt = new Date();
    }
    await attempt.save();
    res.json({ violationsCount: attempt.violationsCount, isSubmitted: attempt.isSubmitted });
  } catch (err) {
    console.error(err); res.status(500).json({ message: "err" });
  }
});

export default router;
