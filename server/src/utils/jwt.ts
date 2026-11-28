import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import type { AuthPayload } from "../types/auth";

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.tokenExpiresIn });
}

function isAuthPayload(value: string | JwtPayload): value is JwtPayload & AuthPayload {
  return (
    typeof value === "object" &&
    typeof value.id === "number" &&
    typeof value.email === "string"
  );
}

export function verifyToken(token: string): AuthPayload {
  const decoded = jwt.verify(token, env.jwtSecret);
  if (!isAuthPayload(decoded)) throw new jwt.JsonWebTokenError("Invalid payload");
  return { id: decoded.id, email: decoded.email };
}