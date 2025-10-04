// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import { connectDB } from "./config/db.js";
// import authRoutes from "./routes/auth.js";
// import adminQuestionRoutes from "./routes/admin/questions.js";
// import adminTestRoutes from "./routes/admin/tests.js";
// import studentTestRoutes from "./routes/student/tests.js";

// dotenv.config();
// const app = express();
// await connectDB();

// app.use(helmet());
// app.use(express.json());
// app.use(cookieParser());

// // allow origin from client
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3000",
//   credentials: true
// }));

// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// app.use("/api/auth", authRoutes);
// app.use("/api/admin/questions", adminQuestionRoutes);
// app.use("/api/admin/tests", adminTestRoutes);
// app.use("/api/student/tests", studentTestRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// server/src/index.js
import dotenv from "dotenv";
import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import adminQuestionRoutes from "./routes/admin/questions.js";
import adminTestRoutes from "./routes/admin/tests.js";
import studentTestRoutes from "./routes/student/tests.js";

dotenv.config();
const app = express();

// connect DB
connectDB().catch(err => {
  console.error("DB connection failed:", err);
  process.exit(1);
});

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS - allow client origin (set REACT/CLIENT URL)
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
}));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/questions", adminQuestionRoutes);
app.use("/api/admin/tests", adminTestRoutes);
app.use("/api/student/tests", studentTestRoutes);

// basic health
app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
