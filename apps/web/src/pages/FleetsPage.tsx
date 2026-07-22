import type { ReactElement } from "react";
import { useState } from "react";

import type { ShipLoadout, ShipType } from "../api/types.js";
import { formatLoadout, shipOrder } from "../game/format.js";
import {
  useGameSnapshot,
  useRecallFleetMutation,
  useSendFleetMutation,
  useStartScanMutation,
} from "../game/useGame.js";

export function FleetsPage(): ReactElement {
  const { data } = useGameSnapshot();
  const sendFleet = useSendFleetMutation();
  const recallFleet = useRecallFleetMutation();
  const startScan = useStartScanMutation();
  const [targetStationId, setTargetStationId] = useState("");
  const [mission, setMission] = useState<"attack" | "defend">("attack");
  const [stationTicks, setStationTicks] = useState(1);
  const [ships, setShips] = useState<ShipLoadout>(
    Object.fromEntries(
      shipOrder.map((shipType) => [shipType, shipType === "piranha" ? 1 : 0]),
    ) as Record<ShipType, number>,
  );

  if (!data) {
    return <p className="muted">Lade Flotten...</p>;
  }

  const selectedTarget = targetStationId || data.targets[0]?.id || "";
  const maxStationTicks = mission === "defend" ? 6 : 3;
  const totalShips = Object.values(ships).reduce((sum, value) => sum + value, 0);
  const invalidFleet =
    totalShips === 0 ||
    shipOrder.some((shipType) => ships[shipType] > data.station.ships[shipType]);

  return (
    <section className="page-stack" aria-labelledby="fleets-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Flotten</p>
          <h2 id="fleets-title">Flotte starten</h2>
        </div>
      </div>

      {sendFleet.isError ? <p className="error">{sendFleet.error.message}</p> : null}
      {startScan.isError ? <p className="error">{startScan.error.message}</p> : null}
      {recallFleet.isError ? <p className="error">{recallFleet.error.message}</p> : null}

      <section className="panel">
        <h3>Ziel</h3>
        <label>
          Zielstation
          <select
            value={selectedTarget}
            onChange={(event) => setTargetStationId(event.target.value)}
          >
            {data.targets.map((target) => (
              <option key={target.id} value={target.id}>
                {target.name} {target.x}:{target.y}
              </option>
            ))}
          </select>
        </label>
        <button
          className="secondary"
          type="button"
          onClick={() => startScan.mutate({ targetStationId: selectedTarget })}
          disabled={startScan.isPending || !selectedTarget}
        >
          Station scannen
        </button>
      </section>

      <section className="panel">
        <h3>Mission</h3>
        <div className="segmented">
          <button
            className={mission === "attack" ? "active" : ""}
            type="button"
            onClick={() => {
              setMission("attack");
              setStationTicks((current) => Math.min(current, 3));
            }}
          >
            Angriff
          </button>
          <button
            className={mission === "defend" ? "active" : ""}
            type="button"
            onClick={() => setMission("defend")}
          >
            Verteidigung
          </button>
        </div>
        <label>
          Stationierung
          <input
            type="number"
            min={1}
            max={maxStationTicks}
            value={stationTicks}
            onChange={(event) =>
              setStationTicks(Math.min(maxStationTicks, Math.max(1, Number(event.target.value))))
            }
          />
        </label>
      </section>

      <section className="panel">
        <h3>Schiffe</h3>
        <div className="ship-input-grid">
          {shipOrder.map((shipType) => (
            <label key={shipType}>
              {data.catalog.ships[shipType].displayName} ({data.station.ships[shipType]})
              <input
                type="number"
                min={0}
                max={data.station.ships[shipType]}
                value={ships[shipType]}
                onChange={(event) =>
                  setShips((current) => ({
                    ...current,
                    [shipType]: Number(event.target.value),
                  }))
                }
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            sendFleet.mutate({
              mission,
              ships,
              stationTicks,
              targetStationId: selectedTarget,
            })
          }
          disabled={sendFleet.isPending || invalidFleet || !selectedTarget}
        >
          Flotte senden
        </button>
      </section>

      <section className="panel">
        <h3>Aktive Flotten</h3>
        <div className="list">
          {data.activeFleets.length === 0 ? <p className="muted">Keine aktive Flotte</p> : null}
          {data.activeFleets.map((fleet) => (
            <div className="row" key={fleet.id}>
              <span>
                {fleet.mission} {fleet.status} nach {fleet.destinationX}:{fleet.destinationY}
              </span>
              <strong>
                {fleet.status === "stationed"
                  ? `${fleet.stationTicksRemaining} stationiert`
                  : `${fleet.remainingTicks} Tick(s)`}
              </strong>
              <small>{formatLoadout(fleet.ships)}</small>
              {fleet.status !== "returning" ? (
                <button
                  className="secondary"
                  type="button"
                  onClick={() => recallFleet.mutate(fleet.id)}
                  disabled={recallFleet.isPending}
                >
                  Rueckruf
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
