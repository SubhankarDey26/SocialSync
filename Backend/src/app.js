const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.routes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: true,
    credentials: true
}));

// API routes (VERY IMPORTANT: first)
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

// Serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// React fallback (Express v5 safe)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;