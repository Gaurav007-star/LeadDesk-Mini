import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import leadRoutes from "./routes/leads.js";

const app = express();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Vercel serverless: connect to DB on cold start, export app
let isConnected = false;

const ensureDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

export default async function handler(req: any, res: any) {
  await ensureDB();
  return app(req, res);
}

// Local dev: listen on port
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  ensureDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to start server:", err);
      process.exit(1);
    });
}
