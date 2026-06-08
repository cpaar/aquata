import { Link, Outlet } from "@tanstack/react-router";
import type { ReactElement } from "react";

import { useCurrentUser, useLogoutMutation } from "../auth/useAuth.js";
import { useDevTickMutation, useGameSnapshot } from "../game/useGame.js";

const showDevTick = import.meta.env.MODE !== "production";

export function GameShell(): ReactElement {
  const currentUser = useCurrentUser();
  const snapshot = useGameSnapshot();
  const logout = useLogoutMutation();
  const devTick = useDevTickMutation();

  return (
    <div className="game-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Aquata</span>
          <h1>{snapshot.data?.station.name ?? "Kommandostation"}</h1>
        </div>
        <div className="topbar-actions">
          {showDevTick ? (
            <button
              className="secondary"
              type="button"
              onClick={() => devTick.mutate()}
              disabled={devTick.isPending}
            >
              {devTick.isPending ? "Tick..." : "Dev-Tick"}
            </button>
          ) : null}
          <button type="button" onClick={() => logout.mutate()} disabled={logout.isPending}>
            Logout
          </button>
        </div>
      </header>

      <nav className="nav-tabs" aria-label="Spielnavigation">
        <Link to="/" activeProps={{ className: "active" }}>
          Dashboard
        </Link>
        <Link to="/build" activeProps={{ className: "active" }}>
          Bau
        </Link>
        <Link to="/research" activeProps={{ className: "active" }}>
          Forschung
        </Link>
        <Link to="/fleets" activeProps={{ className: "active" }}>
          Flotten
        </Link>
        <Link to="/reports" activeProps={{ className: "active" }}>
          Berichte
        </Link>
      </nav>

      <main className="content">
        {currentUser.isLoading || snapshot.isLoading ? (
          <p className="muted">Lade Station...</p>
        ) : null}
        {snapshot.isError ? <p className="error">Spielstand konnte nicht geladen werden.</p> : null}
        {snapshot.data ? <Outlet /> : null}
      </main>
    </div>
  );
}
