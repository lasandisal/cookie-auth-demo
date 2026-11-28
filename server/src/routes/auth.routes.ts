import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth.middleware";
import type { ApiMessage, PublicUser } from "../types/auth";
import { clearAuthCookie, setAuthCookie } from "../utils/authCookies";
import { signToken } from "../utils/jwt";

// Fake "database" for the demo. Use a real DB + bcrypt in a real app.
const USER = { id: 1, email: "demo@example.com", password: "1234", name: "Demo User" };

interface LoginBody {
  email?: string;
  password?: string;
}

const router = Router();

router.post(
  "/login",
  (
    req: Request<Record<string, never>, { user: PublicUser } | ApiMessage, LoginBody>,
    res: Response<{ user: PublicUser } | ApiMessage>
  ) => {
    const { email, password } = req.body ?? {};

    if (email !== USER.email || password !== USER.password) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = signToken({ id: USER.id, email: USER.email });
    setAuthCookie(res, token);

    res.json({ user: { id: USER.id, email: USER.email, name: USER.name } });
  }
);

router.get("/me", authenticate, (req: Request, res: Response<{ user: PublicUser }>) => {
  const { id, email } = req.user!;
  res.json({ user: { id, email, name: USER.name } });
});

router.post("/logout", (_req: Request, res: Response<ApiMessage>) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
});

export default router;