import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { verifyToken } from "../utils/jwt";

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token: string | undefined = req.cookies?.[env.cookieName];

  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    const message =
      err instanceof jwt.TokenExpiredError ? "Token has expired" : "Invalid token";
    res.status(401).json({ message });
  }
}