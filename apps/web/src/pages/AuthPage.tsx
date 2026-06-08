import type { FormEvent, ReactElement } from "react";
import { useState } from "react";

import { useLoginMutation, useRegisterMutation } from "../auth/useAuth.js";

type AuthMode = "register" | "login";

export function AuthPage(): ReactElement {
  const [mode, setMode] = useState<AuthMode>("register");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const register = useRegisterMutation();
  const loginMutation = useLoginMutation();
  const activeMutation = mode === "register" ? register : loginMutation;

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (mode === "register") {
      register.mutate({ email, password, username });
      return;
    }
    loginMutation.mutate({ login, password });
  }

  return (
    <main className="auth-screen">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div>
          <p className="eyebrow">Aquata Remake</p>
          <h1 id="auth-title">{mode === "register" ? "Neue Station" : "Ruckkehr"}</h1>
        </div>

        <div className="segmented" role="tablist" aria-label="Auth Modus">
          <button
            className={mode === "register" ? "active" : ""}
            type="button"
            onClick={() => setMode("register")}
          >
            Registrieren
          </button>
          <button
            className={mode === "login" ? "active" : ""}
            type="button"
            onClick={() => setMode("login")}
          >
            Login
          </button>
        </div>

        <form className="form-grid" onSubmit={submit}>
          {mode === "register" ? (
            <>
              <label>
                Username
                <input
                  name="username"
                  autoComplete="username"
                  minLength={3}
                  maxLength={64}
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </label>
              <label>
                E-Mail
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
            </>
          ) : (
            <label>
              Username oder E-Mail
              <input
                name="login"
                autoComplete="username"
                minLength={3}
                required
                value={login}
                onChange={(event) => setLogin(event.target.value)}
              />
            </label>
          )}

          <label>
            Passwort
            <input
              name="password"
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {activeMutation.isError ? (
            <p className="error" role="alert">
              {activeMutation.error.message}
            </p>
          ) : null}

          <button type="submit" disabled={activeMutation.isPending}>
            {activeMutation.isPending
              ? "Sende..."
              : mode === "register"
                ? "Station starten"
                : "Einloggen"}
          </button>
        </form>
      </section>
    </main>
  );
}
