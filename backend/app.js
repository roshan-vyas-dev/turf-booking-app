const express = require("express");
const app = express();
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const turfRoutes = require("./routes/turfRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/turfs", turfRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/api/test", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Protected route works",
  });
});

module.exports = app;
