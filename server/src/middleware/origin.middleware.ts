import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function requireTrustedOrigin(req: Request, res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.headers.origin;
  if (origin && !env.allowedOrigins.includes(origin)) {
    res.status(403).json({ message: "Untrusted origin" });
    return;
  }
  next();
}