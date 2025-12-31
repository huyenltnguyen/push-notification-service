require("dotenv").config();
const express = require("express");
const cors = require("cors");
const webpush = require("web-push");

const app = express();

// Configure CORS to allow specific origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["*"];
app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

// Set VAPID details
webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

let subscriptions = [];

// Register subscription
app.post("/register", (req, res) => {
  const { subscription } = req.body;
  if (subscription) {
    subscriptions.push(subscription);
    console.log("Subscription registered. Total:", subscriptions.length);
    res.json({ message: "Subscription registered" });
  } else {
    res.status(400).json({ error: "No subscription provided" });
  }
});

// Send notification
app.post("/notify", async (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  console.log("Sending to", subscriptions.length, "subscriptions");

  const promises = subscriptions.map((sub) =>
    webpush.sendNotification(sub, payload).catch((err) => {
      console.log("Send failed:", err.message);
    })
  );

  await Promise.all(promises);
  res.json({ message: "Notifications sent", count: subscriptions.length });
});

// Health check (public, for Koyeb)
app.get("/health", (req, res) => {
  res.json({ status: "ok", subscriptions: subscriptions.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
