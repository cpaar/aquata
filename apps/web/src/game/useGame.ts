import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getGameSnapshot,
  recallFleet,
  runDevTick,
  sendFleet,
  startBuildOrder,
  startResearch,
  startScan,
} from "../api/game.js";
import { queryKeys } from "../api/queries.js";
import type { ResearchType, ShipLoadout, ShipType } from "../api/types.js";

export function useGameSnapshot() {
  return useQuery({
    queryKey: queryKeys.game.snapshot,
    queryFn: getGameSnapshot,
  });
}

export function useStartBuildMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { buildableId: ShipType; quantity: number }) => startBuildOrder(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.game.snapshot }),
  });
}

export function useStartResearchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { researchId: ResearchType }) => startResearch(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.game.snapshot }),
  });
}

export function useSendFleetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      targetStationId: string;
      ships: Partial<ShipLoadout>;
      mission: "attack" | "defend";
      stationTicks: number;
    }) => sendFleet(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.game.snapshot }),
  });
}

export function useRecallFleetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recallFleet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.game.snapshot }),
  });
}

export function useStartScanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startScan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.game.snapshot }),
  });
}

export function useDevTickMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: runDevTick,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.game.snapshot }),
  });
}
