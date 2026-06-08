import { apiRequest } from "./client.js";
import type { GameSnapshot, ResearchType, ShipLoadout, ShipType } from "./types.js";

export function getGameSnapshot(): Promise<GameSnapshot> {
  return apiRequest<GameSnapshot>("/game/me");
}

export function startBuildOrder(payload: {
  buildableId: ShipType;
  quantity: number;
}): Promise<unknown> {
  return apiRequest<unknown>("/build-orders", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export function startResearch(payload: { researchId: ResearchType }): Promise<unknown> {
  return apiRequest<unknown>("/research", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export function sendFleet(payload: {
  targetStationId: string;
  ships: Partial<ShipLoadout>;
}): Promise<unknown> {
  return apiRequest<unknown>("/fleets", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export function runDevTick(): Promise<unknown> {
  return apiRequest<unknown>("/dev/tick", { method: "POST", body: JSON.stringify({}) });
}
