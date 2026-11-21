# 🍪 cookie-auth-demo

> The cookie JavaScript can't touch: secure login with **React + Express + HttpOnly JWT cookies**.

A small, beginner-friendly sample project that shows how to keep your login token **out of `localStorage`** and inside an **HttpOnly cookie**, so injected scripts (XSS) can't steal it.

📖 Companion article: *The Cookie JavaScript Can't Touch: Secure Login in React + Express* (add your Medium link here)

---

## ✨ What this demo shows

- 🔐 JWT stored in an **HttpOnly** cookie (never exposed to JavaScript)
- 🍪 Proper cookie attributes: `HttpOnly`, `Secure`, `SameSite`, `Path`, `Max-Age`
- 🙋 Identity check with `GET /api/auth/me` instead of reading the cookie
- 🚪 Clean logout (cookie cleared with matching attributes)
- 🛡️ Basic CSRF protection with strict CORS + an Origin check
- 🚀 Production notes: the `/api` rewrite trick for cross-site deployments

---

## 🧰 Tech stack

| Layer    | Tools                                           |
| -------- | ----------------------------------------------- |
| Frontend | React (Vite), Axios                             |
| Backend  | Node.js, Express, jsonwebtoken, cookie-parser, cors |

---

## 📁 Project structure

```
cookie-auth-demo/
├── server/
│   ├── package.json
│   └── index.js        # Express API + cookie auth
└── client/             # Vite + React app
    └── src/App.jsx     # Login UI
```

---

## 🚀 Getting started

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/cookie-auth-demo.git
cd cookie-auth-demo
```

### 2. Start the server

```bash
cd server
npm install
node index.js
```

API runs at **http://localhost:5000**

### 3. Start the client

```bash
cd client
npm install
npm run dev
```

App runs at **http://localhost:5173**

### 4. Log in

Use the demo credentials:

```
Email:    demo@example.com
Password: 1234
```

---

## 🔑 Environment variables (server)

| Variable     | Default                   | Description                                  |
| ------------ | ------------------------- | -------------------------------------------- |
| `JWT_SECRET` | `change-me-in-production` | Secret used to sign JWTs. **Change it!**     |
| `NODE_ENV`   | `development`             | Set to `production` for `Secure`/`SameSite=None` cookies |

---

## 🔌 API endpoints

| Method | Endpoint           | Auth | Description                                   |
| ------ | ------------------ | ---- | --------------------------------------------- |
| POST   | `/api/auth/login`  | No   | Verifies credentials, sets the HttpOnly cookie |
| GET    | `/api/auth/me`     | Yes  | Returns the current user (or `401`)           |
| POST   | `/api/auth/logout` | No   | Clears the auth cookie                        |
| GET    | `/api/secret`      | Yes  | Example protected route                       |

---

## 🧪 Try it with curl

```bash
# Log in and save the cookie
curl -i -c jar.txt -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"1234"}'

# Call a protected route using the saved cookie
curl -b jar.txt http://localhost:5000/api/secret

# Without the cookie → 401
curl -i http://localhost:5000/api/secret
```

---

## 🔎 Prove it's HttpOnly

1. Log in, then open DevTools → **Application → Cookies**. You'll see `demo_token` with the **HttpOnly** box ticked.
2. In the Console, type `document.cookie`. The token is **not** there.
3. Refresh the page. You're still signed in, because `/auth/me` reads the cookie on the server.
4. Click **Logout**. The cookie disappears.

---

## 🍪 The cookie, explained

```
Set-Cookie: demo_token=<JWT>; HttpOnly; Path=/; Max-Age=604800
            (production) Secure; SameSite=None; Partitioned
            (development) SameSite=Lax
```

| Attribute     | Why it matters                                           |
| ------------- | -------------------------------------------------------- |
| `HttpOnly`    | JavaScript can't read it, which blocks XSS token theft   |
| `Secure`      | Sent over HTTPS only                                     |
| `SameSite`    | Controls cross-site sending (helps against CSRF)         |
| `Partitioned` | Lets Chrome accept a cross-site cookie (CHIPS)           |
| `Max-Age`     | Matches the JWT expiry (7 days)                          |

---

## 🌍 Deploying (the cross-site cookie trap)

If your frontend and API live on different `*.vercel.app` domains, the API's cookie is **third-party** and Chrome may reject it.

**Recommended fix:** proxy the API through the frontend so the cookie is first-party. Add this to the frontend's `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-api.vercel.app/api/:path*"
    }
  ]
}
```

Then use a relative base URL in production:

```js
const api = axios.create({
  baseURL: import.meta.env.PROD ? "/api" : "http://localhost:5000/api",
  withCredentials: true,
});
```

---

## 🛡️ Security notes

- Always set a strong `JWT_SECRET` and never commit it.
- Keep `cors` on an **explicit origin allow-list** (never `*` with credentials).
- The Origin check blocks untrusted state-changing requests; add CSRF tokens for higher-risk apps.
- This demo uses one hard-coded user. In a real app, use a database and hash passwords (e.g. bcrypt).
- On logout, clear the cookie with the **same attributes** it was set with, or the browser won't remove it.

---

## 🗺️ Ideas to extend

- [ ] Real user registration with hashed passwords
- [ ] Refresh-token rotation
- [ ] Role-based access (`401` vs `403`)
- [ ] CSRF tokens
- [ ] Short-lived token for WebSockets (cookies don't cross hosts)

---

## 📄 License

MIT. Free to use, learn from, and remix.

---

⭐ If this helped you, give the repo a star and share the article!