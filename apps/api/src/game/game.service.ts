import {
  buildOrders,
  combatReports,
  fleets,
  players,
  researchStates,
  rounds,
  scanReports,
  stationShips,
  stations,
  type AquataDb,
  type DbClient,
  type ProductionSource,
  type ResearchSnapshot,
  type ResourceStock,
  type ShipLoadout,
} from "@aquata/db";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  createFleetMovement,
  isFleetEmpty,
  mvpBuildables,
  mvpResearchDefinitions,
  mvpShipDefinitions,
  normalizeLoadout,
  recallFleetMovement,
  startBuildOrder,
  startResearch,
  startStationScan,
  subtractLoadouts,
  type BuildQueueState,
  type FleetMission,
  type ResearchId,
  type ResearchState,
  type ShipTypeId,
  type TickStationSnapshot,
} from "@aquata/domain";
import { and, asc, count, desc, eq, or } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { DB_CLIENT } from "../persistence/db.provider.js";
import type { AuthenticatedUser } from "../auth/auth.types.js";

type DbOrTx = Parameters<Parameters<AquataDb["transaction"]>[0]>[0] | AquataDb;

const startResources: ResourceStock = { aluminium: 500, energy: 300, steel: 400 };
const startProduction: ProductionSource[] = [
  { count: 2, id: "aluminium-collector", produces: { aluminium: 6, energy: 0, steel: 0 } },
  { count: 2, id: "steel-collector", produces: { aluminium: 0, energy: 0, steel: 5 } },
  { count: 1, id: "reactor", produces: { aluminium: 0, energy: 4, steel: 0 } },
];
const startShips: ShipLoadout = {
  atlantis: 0,
  bermuda: 0,
  blizzard: 0,
  enterprise: 0,
  hackboot: 0,
  hai: 1,
  harvester: 1,
  hurricane: 0,
  kittyHawk: 0,
  piranha: 4,
  qualle: 2,
  taifun: 0,
  tsunami: 0,
};
const startResearchState: ResearchState = { completed: [] };

@Injectable()
export class GameService {
  constructor(@Inject(DB_CLIENT) private readonly client: DbClient) {}

  async getSnapshot(user: AuthenticatedUser) {
    return this.client.db.transaction(async (tx) => {
      const context = await this.ensurePlayerStation(tx, user);
      const queue = await this.loadBuildQueue(tx, context.station.id);
      const [shipsRow] = await tx
        .select()
        .from(stationShips)
        .where(eq(stationShips.stationId, context.station.id))
        .limit(1);
      const [researchRow] = await tx
        .select()
        .from(researchStates)
        .where(eq(researchStates.stationId, context.station.id))
        .limit(1);
      const dummyTargets = await tx
        .select({
          id: stations.id,
          name: stations.name,
          x: stations.x,
          y: stations.y,
        })
        .from(stations)
        .innerJoin(players, eq(players.id, stations.playerId))
        .where(and(eq(stations.roundId, context.round.id), eq(players.isDummy, true)));
      const activeFleets = await tx
        .select()
        .from(fleets)
        .where(
          and(eq(fleets.roundId, context.round.id), eq(fleets.ownerPlayerId, context.player.id)),
        )
        .orderBy(asc(fleets.createdAt));
      const stationedDefenseFleets = await tx
        .select()
        .from(fleets)
        .where(
          and(
            eq(fleets.roundId, context.round.id),
            eq(fleets.mission, "defend"),
            eq(fleets.destinationX, context.station.x),
            eq(fleets.destinationY, context.station.y),
          ),
        )
        .orderBy(asc(fleets.createdAt));
      const recentCombatReports = await tx
        .select()
        .from(combatReports)
        .where(
          and(
            eq(combatReports.roundId, context.round.id),
            or(
              eq(combatReports.attackerPlayerId, context.player.id),
              eq(combatReports.defenderPlayerId, context.player.id),
            ),
          ),
        )
        .orderBy(desc(combatReports.tickNumber), desc(combatReports.createdAt))
        .limit(10);
      const recentScanReports = await tx
        .select()
        .from(scanReports)
        .where(
          and(
            eq(scanReports.roundId, context.round.id),
            eq(scanReports.scannerPlayerId, context.player.id),
          ),
        )
        .orderBy(desc(scanReports.tickNumber), desc(scanReports.createdAt))
        .limit(10);

      return {
        catalog: {
          buildables: mvpBuildables,
          research: mvpResearchDefinitions,
          ships: mvpShipDefinitions,
        },
        player: context.player,
        recentCombatReports,
        recentScanReports,
        round: context.round,
        station: {
          ...context.station,
          buildQueue: queue.orders,
          research: toResearchState(researchRow?.state),
          ships: shipsRow?.ships ?? startShips,
        },
        activeFleets,
        stationedDefenseFleets,
        targets: dummyTargets,
      };
    });
  }

  async startBuild(user: AuthenticatedUser, buildableId: ShipTypeId, quantity: number) {
    return this.client.db.transaction(async (tx) => {
      const context = await this.ensurePlayerStation(tx, user);
      const queue = await this.loadBuildQueue(tx, context.station.id);
      const orderId = randomUUID();

      try {
        const result = startBuildOrder(queue, context.station.resources, {
          buildableId,
          id: orderId,
          quantity,
        });
        const order = result.queue.orders.find((candidate) => candidate.id === orderId);
        if (!order) {
          throw new BadRequestException("Could not create build order");
        }

        await tx
          .update(stations)
          .set({ resources: result.resources })
          .where(eq(stations.id, context.station.id));
        await tx.insert(buildOrders).values({
          id: order.id,
          order: {
            buildableId: order.buildableId,
            quantity: order.quantity,
            remainingTicks: order.remainingTicks,
          },
          position: queue.orders.length,
          stationId: context.station.id,
        });

        return { buildOrder: order, resources: result.resources };
      } catch (error) {
        throw commandError(error);
      }
    });
  }

  async startResearch(user: AuthenticatedUser, researchId: ResearchId) {
    return this.client.db.transaction(async (tx) => {
      const context = await this.ensurePlayerStation(tx, user);
      const [researchRow] = await tx
        .select()
        .from(researchStates)
        .where(eq(researchStates.stationId, context.station.id))
        .limit(1);

      try {
        const result = startResearch(
          toResearchState(researchRow?.state),
          researchId,
          context.station.resources,
        );
        await tx
          .update(stations)
          .set({ resources: result.resources })
          .where(eq(stations.id, context.station.id));
        await tx
          .update(researchStates)
          .set({ state: result.state, updatedAt: new Date() })
          .where(eq(researchStates.stationId, context.station.id));

        return { research: result.state, resources: result.resources };
      } catch (error) {
        throw commandError(error);
      }
    });
  }

  async sendFleet(
    user: AuthenticatedUser,
    input: {
      targetStationId: string;
      ships: Partial<ShipLoadout>;
      mission?: Exclude<FleetMission, "return">;
      stationTicks?: number;
    },
  ) {
    return this.client.db.transaction(async (tx) => {
      const context = await this.ensurePlayerStation(tx, user);
      const [target] = await tx
        .select()
        .from(stations)
        .where(eq(stations.id, input.targetStationId))
        .limit(1);
      if (!target || target.roundId !== context.round.id) {
        throw new NotFoundException("Target station not found");
      }

      const [shipsRow] = await tx
        .select()
        .from(stationShips)
        .where(eq(stationShips.stationId, context.station.id))
        .limit(1);
      const currentShips = shipsRow?.ships ?? startShips;
      const requestedShips = normalizeLoadout(input.ships);
      if (isFleetEmpty(requestedShips)) {
        throw new BadRequestException("Fleet must contain at least one ship");
      }

      try {
        const remainingShips = subtractLoadouts(currentShips, requestedShips);
        const movement = createFleetMovement({
          destination: { x: target.x, y: target.y },
          id: randomUUID(),
          mission: input.mission ?? "attack",
          origin: { x: context.station.x, y: context.station.y },
          ownerId: context.player.id,
          ships: requestedShips,
          stationTicks: input.stationTicks ?? 1,
        });

        await tx
          .update(stationShips)
          .set({ ships: remainingShips, updatedAt: new Date() })
          .where(eq(stationShips.stationId, context.station.id));
        await tx.insert(fleets).values({
          destinationX: movement.destination.x,
          destinationY: movement.destination.y,
          id: movement.id,
          mission: movement.mission,
          originX: movement.origin.x,
          originY: movement.origin.y,
          ownerPlayerId: context.player.id,
          remainingTicks: movement.remainingTicks,
          roundId: context.round.id,
          ships: movement.ships,
          recalled: movement.recalled,
          stationTicks: movement.stationTicks,
          stationTicksRemaining: movement.stationTicksRemaining,
          status: movement.status,
          totalTicks: movement.totalTicks,
        });

        return { fleet: movement, ships: remainingShips };
      } catch (error) {
        throw commandError(error);
      }
    });
  }

  async recallFleet(user: AuthenticatedUser, fleetId: string) {
    return this.client.db.transaction(async (tx) => {
      const context = await this.ensurePlayerStation(tx, user);
      const [fleet] = await tx
        .select()
        .from(fleets)
        .where(
          and(
            eq(fleets.id, fleetId),
            eq(fleets.roundId, context.round.id),
            eq(fleets.ownerPlayerId, context.player.id),
          ),
        )
        .limit(1);
      if (!fleet) {
        throw new NotFoundException("Fleet not found");
      }

      try {
        const recalled = recallFleetMovement({
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
          status: fleet.status as "inTransit" | "stationed" | "returning",
          totalTicks: fleet.totalTicks,
        });
        const [updated] = await tx
          .update(fleets)
          .set({
            destinationX: recalled.destination.x,
            destinationY: recalled.destination.y,
            originX: recalled.origin.x,
            originY: recalled.origin.y,
            recalled: recalled.recalled,
            remainingTicks: recalled.remainingTicks,
            status: recalled.status,
          })
          .where(eq(fleets.id, fleet.id))
          .returning();
        return { fleet: updated };
      } catch (error) {
        throw commandError(error);
      }
    });
  }

  async startScan(user: AuthenticatedUser, targetStationId: string) {
    return this.client.db.transaction(async (tx) => {
      const context = await this.ensurePlayerStation(tx, user);
      const [target] = await tx
        .select()
        .from(stations)
        .where(eq(stations.id, targetStationId))
        .limit(1);
      if (!target || target.roundId !== context.round.id) {
        throw new NotFoundException("Target station not found");
      }
      const [targetPlayer] = await tx
        .select()
        .from(players)
        .where(eq(players.id, target.playerId))
        .limit(1);
      const [targetShips] = await tx
        .select()
        .from(stationShips)
        .where(eq(stationShips.stationId, target.id))
        .limit(1);
      if (!targetPlayer || !targetShips) {
        throw new NotFoundException("Target station not found");
      }
      const visibleFleets = await tx
        .select()
        .from(fleets)
        .where(eq(fleets.roundId, context.round.id));
      const targetSnapshot: TickStationSnapshot = {
        buildQueue: { orders: [] },
        id: target.id,
        ownerId: targetPlayer.id,
        position: { x: target.x, y: target.y },
        production: target.production,
        research: { completed: [] },
        resources: target.resources,
        ships: normalizeLoadout(targetShips.ships),
      };

      try {
        const reportId = randomUUID();
        const result = startStationScan(context.station.resources, {
          id: reportId,
          scannerPlayerId: context.player.id,
          target: targetSnapshot,
          tickNumber: context.round.currentTick,
          visibleFleets: visibleFleets.map((fleet) => ({
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
            status: fleet.status as "inTransit" | "stationed" | "returning",
            totalTicks: fleet.totalTicks,
          })),
        });
        await tx
          .update(stations)
          .set({ resources: result.resources })
          .where(eq(stations.id, context.station.id));
        const [created] = await tx
          .insert(scanReports)
          .values({
            id: reportId,
            report: result.report,
            roundId: context.round.id,
            scannerPlayerId: context.player.id,
            targetStationId: target.id,
            tickNumber: context.round.currentTick,
            type: result.report.type,
          })
          .returning();
        return { report: created, resources: result.resources };
      } catch (error) {
        throw commandError(error);
      }
    });
  }

  async getActiveRound(db: DbOrTx = this.client.db) {
    const [round] = await db.select().from(rounds).where(eq(rounds.status, "active")).limit(1);
    if (!round) {
      throw new NotFoundException("No active round");
    }
    return round;
  }

  async ensurePlayerStation(db: DbOrTx, user: AuthenticatedUser) {
    const activeRound = await this.getActiveRound(db);
    const [existing] = await db
      .select({
        player: players,
        station: stations,
      })
      .from(players)
      .innerJoin(stations, eq(stations.playerId, players.id))
      .where(and(eq(players.userId, user.id), eq(players.roundId, activeRound.id)))
      .limit(1);

    if (existing) {
      return { player: existing.player, round: activeRound, station: existing.station };
    }

    const [player] = await db
      .insert(players)
      .values({
        displayName: user.username,
        roundId: activeRound.id,
        userId: user.id,
      })
      .returning();
    if (!player) {
      throw new Error("Could not create player");
    }

    const position = await this.nextStartPosition(db, activeRound.id);
    const [station] = await db
      .insert(stations)
      .values({
        name: `${user.username}'s Station`,
        playerId: player.id,
        production: startProduction,
        resources: startResources,
        roundId: activeRound.id,
        x: position.x,
        y: position.y,
      })
      .returning();
    if (!station) {
      throw new Error("Could not create station");
    }

    await db.insert(stationShips).values({ ships: startShips, stationId: station.id });
    await db.insert(researchStates).values({ state: startResearchState, stationId: station.id });

    return { player, round: activeRound, station };
  }

  private async loadBuildQueue(db: DbOrTx, stationId: string): Promise<BuildQueueState> {
    const rows = await db
      .select()
      .from(buildOrders)
      .where(eq(buildOrders.stationId, stationId))
      .orderBy(asc(buildOrders.position), asc(buildOrders.createdAt));

    return {
      orders: rows.map((row) => ({
        buildableId: row.order.buildableId as ShipTypeId,
        id: row.id,
        quantity: row.order.quantity,
        remainingTicks: row.order.remainingTicks,
      })),
    };
  }

  private async nextStartPosition(db: DbOrTx, roundId: string): Promise<{ x: number; y: number }> {
    const [row] = await db
      .select({ value: count() })
      .from(stations)
      .where(eq(stations.roundId, roundId));
    const ordinal = row?.value ?? 0;
    return { x: ordinal * 3 + 1, y: ordinal * 2 + 1 };
  }
}

function toResearchState(snapshot: ResearchSnapshot | undefined): ResearchState {
  return {
    active: snapshot?.active as ResearchState["active"],
    completed: (snapshot?.completed ?? []) as ResearchId[],
  };
}

function commandError(error: unknown): BadRequestException {
  if (error instanceof BadRequestException) {
    return error;
  }
  if (error instanceof Error) {
    return new BadRequestException(error.message);
  }
  return new BadRequestException("Invalid command");
}
