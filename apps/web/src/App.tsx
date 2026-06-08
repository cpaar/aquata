import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
} from "@tanstack/react-router";
import type { ReactElement } from "react";

import { ApiError } from "./api/client.js";
import { useCurrentUser } from "./auth/useAuth.js";
import { AuthPage } from "./pages/AuthPage.js";
import { BuildPage } from "./pages/BuildPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { FleetsPage } from "./pages/FleetsPage.js";
import { ReportsPage } from "./pages/ReportsPage.js";
import { ResearchPage } from "./pages/ResearchPage.js";
import { GameShell } from "./routes/GameShell.js";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: Root,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthRoute,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedRoute,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/",
  component: DashboardPage,
});

const buildRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/build",
  component: BuildPage,
});

const researchRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/research",
  component: ResearchPage,
});

const fleetsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/fleets",
  component: FleetsPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/reports",
  component: ReportsPage,
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    authRoute,
    protectedRoute.addChildren([
      dashboardRoute,
      buildRoute,
      researchRoute,
      fleetsRoute,
      reportsRoute,
    ]),
  ]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function Root(): ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

function AuthRoute(): ReactElement {
  const currentUser = useCurrentUser();

  if (currentUser.isLoading) {
    return <main className="auth-screen">Lade Session...</main>;
  }

  if (currentUser.data) {
    return <Navigate to="/" />;
  }

  return <AuthPage />;
}

function ProtectedRoute(): ReactElement {
  const currentUser = useCurrentUser();

  if (currentUser.isLoading) {
    return <main className="auth-screen">Lade Session...</main>;
  }

  if (currentUser.error instanceof ApiError && currentUser.error.status === 401) {
    return <Navigate to="/auth" />;
  }

  if (currentUser.isError) {
    return <main className="auth-screen">Session konnte nicht geladen werden.</main>;
  }

  return <GameShell />;
}
