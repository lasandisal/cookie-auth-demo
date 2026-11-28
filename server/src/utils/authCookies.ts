import type { CookieOptions, Response} from "express";
import { env } from "../config/env";

const baseOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? "none" : "lax",
  path: "/",
  ...(env.isProd ? ({ partitioned: true } as CookieOptions) : {}),
}

export function setAuthCookie(res: Response, token: string) : void {
  res.cookie(env.cookieName, token, {
    ...baseOptions,
    maxAge: env.cookieMaxAgeMs
  })
}

export function clearAuthCookie(res: Response) : void {
  res.clearCookie(env.cookieName, baseOptions);
}