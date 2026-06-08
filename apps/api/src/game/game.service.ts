import {
  buildOrders,
  fleets,
  players,
  researchStates,
  rounds,
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
  normalizeLoadout,
  startBuildOrder,
  startResearch,
  subtractLoadouts,
  type BuildQueueState,
  type ResearchId,
  type ResearchState,
  type ShipTypeId,
} from "@aquata/domain";
import { and, asc, count, eq } from "drizzle-orm";
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
const startShips: ShipLoadout = { fighter: 1, frigate: 0, harvester: 1, interceptor: 2 };
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

      return {
        player: context.player,
        round: context.round,
        station: {
          ...context.station,
          buildQueue: queue.orders,
          research: toResearchState(researchRow?.state),
          ships: shipsRow?.ships ?? startShips,
        },
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

  async sendFleet(user: AuthenticatedUser, targetStationId: string, ships: Partial<ShipLoadout>) {
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

      const [shipsRow] = await tx
        .select()
        .from(stationShips)
        .where(eq(stationShips.stationId, context.station.id))
        .limit(1);
      const currentShips = shipsRow?.ships ?? startShips;
      const requestedShips = normalizeLoadout(ships);
      if (isFleetEmpty(requestedShips)) {
        throw new BadRequestException("Fleet must contain at least one ship");
      }

      try {
        const remainingShips = subtractLoadouts(currentShips, requestedShips);
        const movement = createFleetMovement({
          destination: { x: target.x, y: target.y },
          id: randomUUID(),
          mission: "attack",
          origin: { x: context.station.x, y: context.station.y },
          ownerId: context.player.id,
          ships: requestedShips,
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
          status: movement.status,
          totalTicks: movement.totalTicks,
        });

        return { fleet: movement, ships: remainingShips };
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
