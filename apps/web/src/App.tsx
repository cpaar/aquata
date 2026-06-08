import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import React from "react";

type HealthResponse = {
  service: string;
  status: string;
};

const apiUrl = String(import.meta.env.VITE_API_URL ?? "http://localhost:3000");
const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: AquataApp,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AquataApp(): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="app-shell">
        <Outlet />
      </main>
    </QueryClientProvider>
  );
}

function Dashboard(): React.ReactElement {
  const health = useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/health`);
      if (!response.ok) {
        throw new Error(`API healthcheck failed with ${response.status}`);
      }
      return response.json() as Promise<HealthResponse>;
    },
  });

  return (
    <section className="dashboard" aria-labelledby="page-title">
      <p className="eyebrow">Aquata Remake</p>
      <h1 id="page-title">Kommandostation</h1>
      <div className="status-grid">
        <article>
          <span>API</span>
          <strong data-testid="api-status">
            {health.isLoading ? "prueft" : (health.data?.status ?? "offline")}
          </strong>
        </article>
        <article>
          <span>Phase</span>
          <strong>0</strong>
        </article>
        <article>
          <span>Tick</span>
          <strong>30 min</strong>
        </article>
      </div>
    </section>
  );
}
