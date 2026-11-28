import type { SignOptions } from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";

const jwtSecret = process.env.NODE_ENV ?? "change-me-in-production";

if(isProd && jwtSecret === "change-me-in-production") {
  throw new Error("Please set a strong JWT secret in production!");
}

export const env = {
  isProd,
  port: Number(process.env.PORT ?? 5000),
  jwtSecret,
  cookieName: process.env.AUTH_COOKIE_NAME ?? "demo_token",
  allowedOrigins: [process.env.CLIENT_URL ?? "http://localhost:5173"],
  tokenExpiresIn: "7d" as SignOptions["expiresIn"],
  cookieMaxAgeMs: 7 * 24 * 60 * 60 * 1000, 
}