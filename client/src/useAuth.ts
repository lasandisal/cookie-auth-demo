import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import type { ApiError, AuthResponse, User } from "./types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    api
      .get<AuthResponse>("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch((err: unknown) => {
        // Only 401/403 means "guest". Network errors / 5xx must NOT sign you out.
        if (isAxiosError(err) && [401, 403].includes(err.response?.status ?? 0)) {
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError("");
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
      setUser(data.user);
    } catch (err: unknown) {
      setError(
        isAxiosError<ApiError>(err)
          ? err.response?.data?.message ?? "Login failed"
          : "Login failed"
      );
    }
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setUser(null);
  }, []);

  return { user, loading, error, login, logout };
}