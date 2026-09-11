const express = require("express");
const app = express();
const authMiddleware = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/test", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Protected route works",
  });
});

module.exports = app;
