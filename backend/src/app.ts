import express from "express"
import healthRouter from "./routes/health.js";

const app = express();

// basic middleware
app.use(express.json());

// routes
app.use("/health", healthRouter);

export default app;