import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { env } from "./config/env";
import { authenticate } from "./middleware/auth.middleware";
import { requireTrustedOrigin } from "./middleware/origin.middleware";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors({ origin: env.allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requireTrustedOrigin);

app.use("/api/auth", authRoutes);

app.get("/api/secret", authenticate, (req: Request, res: Response) => {
  res.json({ message: `Hello ${req.user!.email}, this data is protected.` });
});

app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}`);
});