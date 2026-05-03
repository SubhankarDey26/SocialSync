require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.routes");

const app = express();

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// In production the frontend is served from the same Express origin,
// so we only need CORS for potential local dev cross-origin calls.
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

// ── API routes (MUST come before static serving) ────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

// ── Serve built frontend ─────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "../public")));

// ── React SPA fallback — send index.html for any unknown route ───────────────
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = app;