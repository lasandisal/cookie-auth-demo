import { type FormEvent, useState } from "react";
import { isAxiosError } from "axios";
import { api } from "./api";
import { useAuth } from "./useAuth";
import type { ApiError } from "./types";

export default function App() {
  const { user, loading, error, login, logout } = useAuth();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("1234");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void login(email, password);
  };

  const loadSecret = async () => {
    try {
      const { data } = await api.get<{ message: string }>("/secret");
      setMessage(data.message);
    } catch (err: unknown) {
      setMessage(
        isAxiosError<ApiError>(err)
          ? `Not allowed (${err.response?.status ?? "network error"})`
          : "Something went wrong"
      );
    }
  };

  const onLogout = async () => {
    await logout();
    setMessage("");
  };

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <form onSubmit={onSubmit} style={{ maxWidth: 320, margin: "60px auto", display: "grid", gap: 8 }}>
        <h2>Sign in</h2>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h2>Welcome, {user.name}</h2>
      <button onClick={loadSecret}>Load protected data</button>{" "}
      <button onClick={onLogout}>Logout</button>
      <p>{message}</p>
      <p>Try <code>document.cookie</code> in the console: you won't see the token.</p>
    </div>
  );
}