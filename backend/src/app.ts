import express from "express";
import cors from "cors"; // [ADDED] Import cors
import healthRouter from "./routes/health.js";
import apiRouter from "./routes/index.js";
import { env } from "./config/env.js";

const app = express();

// This allows your frontend (port 3000) to talk to this backend
app.use(
  cors({
    origin: env.FRONTEND_URL, // Allow only your frontend
    credentials: true, // Allow cookies/tokens if needed
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// basic middleware
app.use(express.json());

// Main routes
app.use("/api", apiRouter);
app.use("/health", healthRouter);

export default app;
