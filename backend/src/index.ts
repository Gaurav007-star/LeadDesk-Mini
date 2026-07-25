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

app.get("/", (_req, res) => {
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
        const c = {
          reset:  "\x1b[0m",
          bold:   "\x1b[1m",
          blue:   "\x1b[34m",
          cyan:   "\x1b[36m",
          green:  "\x1b[32m",
          yellow: "\x1b[33m",
          dim:    "\x1b[2m",
        };
        const line = `${c.dim}${"─".repeat(46)}${c.reset}`;
        console.log(`
${line}
  ${c.bold}${c.blue}⚡ LeadDesk Mini — Backend${c.reset}
${line}
  ${c.green}✔ Status   ${c.reset}Running
  ${c.cyan}🌐 Server   ${c.reset}http://localhost:${PORT}
  ${c.cyan}📡 API      ${c.reset}http://localhost:${PORT}/api
  ${c.yellow}🔗 Frontend ${c.reset}${frontendUrl}
  ${c.dim}🛠  Env      ${process.env.NODE_ENV ?? "development"}${c.reset}
${line}
`);
      });
    })
    .catch((err) => {
      console.error("Failed to start server:", err);
      process.exit(1);
    });
}
