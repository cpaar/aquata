import {
  buildOrders,
  combatReports,
  fleets,
  players,
  researchStates,
  rounds,
  stationShips,
  stations,
  tickRuns,
  type DbClient,
} from "@aquata/db";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  normalizeLoadout,
  runGameTick,
  type FleetMovement,
  type FleetMission,
  type FleetMovementStatus,
  type ResearchState,
  type TickStationSnapshot,
} from "@aquata/domain";
import { asc, eq, sql } from "drizzle-orm";

import { DB_CLIENT } from "../persistence/db.provider.js";
import { GameService } from "./game.service.js";

@Injectable()
export class TickService {
  constructor(
    @Inject(DB_CLIENT) private readonly client: DbClient,
    @Inject(GameService) private readonly game: GameService,
  ) {}

  async runPersistedTick(input: { roundId?: string; tickNumber?: number }) {
    return this.client.db.transaction(async (tx) => {
      const activeRound = input.roundId
        ? (await tx.select().from(rounds).where(eq(rounds.id, input.roundId)).limit(1))[0]
        : await this.game.getActiveRound(tx);
      if (!activeRound) {
        throw new NotFoundException("Round not found");
      }

      const tickNumber = input.tickNumber ?? activeRound.currentTick + 1;
      const inserted = await tx
        .insert(tickRuns)
        .values({ roundId: activeRound.id, status: "running", tickNumber })
        .onConflictDoNothing()
        .returning();

      if (inserted.length === 0) {
        const [existing] = await tx
          .select()
          .from(tickRuns)
          .where(eq(tickRuns.roundId, activeRound.id))
          .limit(1);
        return { applied: false, tickRun: existing };
      }

      const stationSnapshots = await this.loadStations(tx, activeRound.id);
      const fleetSnapshots = await this.loadFleets(tx, activeRound.id);
      const result = runGameTick({
        fleets: fleetSnapshots,
        stations: stationSnapshots,
        tickNumber,
      });

      await this.persistStations(tx, result.stations);
      await tx.delete(fleets).where(eq(fleets.roundId, activeRound.id));
      if (result.fleets.length > 0) {
        await tx.insert(fleets).values(
          result.fleets.map((fleet) => ({
            destinationX: fleet.destination.x,
            destinationY: fleet.destination.y,
            id: fleet.id,
            mission: fleet.mission,
            originX: fleet.origin.x,
            originY: fleet.origin.y,
            ownerPlayerId: fleet.ownerId,
            remainingTicks: fleet.remainingTicks,
            roundId: activeRound.id,
            ships: fleet.ships,
            recalled: fleet.recalled,
            stationTicks: fleet.stationTicks,
            stationTicksRemaining: fleet.stationTicksRemaining,
            status: fleet.status,
            totalTicks: fleet.totalTicks,
          })),
        );
      }

      if (result.combatReports.length > 0) {
        await tx.insert(combatReports).values(
          result.combatReports.map((report) => ({
            attackerPlayerId: report.attackerOwnerId,
            defenderPlayerId: report.defenderOwnerId,
            report,
            roundId: activeRound.id,
            tickNumber,
          })),
        );
      }

      const summary = {
        combatReports: result.combatReports.length,
        completedBuilds: result.completedBuilds.length,
        completedResearch: result.completedResearch.length,
        fleets: result.fleets.length,
        stations: result.stations.length,
      };
      const [tickRun] = await tx
        .update(tickRuns)
        .set({ finishedAt: new Date(), status: "completed", summary })
        .where(eq(tickRuns.id, inserted[0]!.id))
        .returning();
      await tx
        .update(rounds)
        .set({ currentTick: sql`greatest(${rounds.currentTick}, ${tickNumber})` })
        .where(eq(rounds.id, activeRound.id));

      return { applied: true, result, tickRun };
    });
  }

  private async loadStations(
    tx: Parameters<Parameters<typeof this.client.db.transaction>[0]>[0],
    roundId: string,
  ): Promise<TickStationSnapshot[]> {
    const stationRows = await tx
      .select({
        player: players,
        research: researchStates,
        ships: stationShips,
        station: stations,
      })
      .from(stations)
      .innerJoin(players, eq(players.id, stations.playerId))
      .innerJoin(stationShips, eq(stationShips.stationId, stations.id))
      .innerJoin(researchStates, eq(researchStates.stationId, stations.id))
      .where(eq(stations.roundId, roundId));

    const queueRows = await tx
      .select()
      .from(buildOrders)
      .orderBy(asc(buildOrders.position), asc(buildOrders.createdAt));
    const queueByStation = new Map<string, typeof queueRows>();
    for (const row of queueRows) {
      const rows = queueByStation.get(row.stationId) ?? [];
      rows.push(row);
      queueByStation.set(row.stationId, rows);
    }

    return stationRows.map((row) => ({
      buildQueue: {
        orders: (queueByStation.get(row.station.id) ?? []).map((order) => ({
          buildableId: order.order
            .buildableId as TickStationSnapshot["buildQueue"]["orders"][number]["buildableId"],
          id: order.id,
          quantity: order.order.quantity,
          remainingTicks: order.order.remainingTicks,
        })),
      },
      id: row.station.id,
      ownerId: row.player.id,
      position: { x: row.station.x, y: row.station.y },
      production: row.station.production,
      research: toResearchState(row.research.state),
      resources: row.station.resources,
      ships: normalizeLoadout(row.ships.ships),
    }));
  }

  private async loadFleets(
    tx: Parameters<Parameters<typeof this.client.db.transaction>[0]>[0],
    roundId: string,
  ): Promise<FleetMovement[]> {
    const rows = await tx.select().from(fleets).where(eq(fleets.roundId, roundId));
    return rows.map((fleet) => ({
      destination: { x: fleet.destinationX, y: fleet.destinationY },
      id: fleet.id,
      mission: fleet.mission as FleetMission,
      origin: { x: fleet.originX, y: fleet.originY },
      ownerId: fleet.ownerPlayerId,
      recalled: fleet.recalled,
      remainingTicks: fleet.remainingTicks,
      ships: normalizeLoadout(fleet.ships),
      stationTicks: fleet.stationTicks,
      stationTicksRemaining: fleet.stationTicksRemaining,
      status: fleet.status as FleetMovementStatus,
      totalTicks: fleet.totalTicks,
    }));
  }

  private async persistStations(
    tx: Parameters<Parameters<typeof this.client.db.transaction>[0]>[0],
    stationSnapshots: TickStationSnapshot[],
  ): Promise<void> {
    for (const snapshot of stationSnapshots) {
      await tx
        .update(stations)
        .set({ resources: snapshot.resources })
        .where(eq(stations.id, snapshot.id));
      await tx
        .update(stationShips)
        .set({ ships: snapshot.ships, updatedAt: new Date() })
        .where(eq(stationShips.stationId, snapshot.id));
      await tx
        .update(researchStates)
        .set({ state: snapshot.research, updatedAt: new Date() })
        .where(eq(researchStates.stationId, snapshot.id));

      await tx.delete(buildOrders).where(eq(buildOrders.stationId, snapshot.id));
      if (snapshot.buildQueue.orders.length > 0) {
        await tx.insert(buildOrders).values(
          snapshot.buildQueue.orders.map((order, position) => ({
            id: order.id,
            order: {
              buildableId: order.buildableId,
              quantity: order.quantity,
              remainingTicks: order.remainingTicks,
            },
            position,
            stationId: snapshot.id,
          })),
        );
      }
    }
  }
}

function toResearchState(snapshot: {
  completed: readonly string[];
  active?: unknown;
}): ResearchState {
  return {
    active: snapshot.active as ResearchState["active"],
    completed: snapshot.completed as ResearchState["completed"],
  };
}
