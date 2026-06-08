import type { ReactElement } from "react";
import { useState } from "react";

import type { ShipLoadout } from "../api/types.js";
import { formatLoadout, shipOrder } from "../game/format.js";
import { useGameSnapshot, useSendFleetMutation } from "../game/useGame.js";

export function FleetsPage(): ReactElement {
  const { data } = useGameSnapshot();
  const mutation = useSendFleetMutation();
  const [targetStationId, setTargetStationId] = useState("");
  const [ships, setShips] = useState<ShipLoadout>({
    fighter: 0,
    frigate: 0,
    harvester: 0,
    interceptor: 1,
  });

  if (!data) {
    return <p className="muted">Lade Flotten...</p>;
  }

  const selectedTarget = targetStationId || data.targets[0]?.id || "";
  const totalShips = Object.values(ships).reduce((sum, value) => sum + value, 0);
  const invalidFleet =
    totalShips === 0 ||
    shipOrder.some((shipType) => ships[shipType] > data.station.ships[shipType]);

  return (
    <section className="page-stack" aria-labelledby="fleets-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Flotten</p>
          <h2 id="fleets-title">Angriff starten</h2>
        </div>
      </div>

      {mutation.isError ? <p className="error">{mutation.error.message}</p> : null}

      <section className="panel">
        <h3>Ziel</h3>
        <label>
          Dummy-Ziel
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
          onClick={() => mutation.mutate({ ships, targetStationId: selectedTarget })}
          disabled={mutation.isPending || invalidFleet || !selectedTarget}
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
                {fleet.mission} nach {fleet.destinationX}:{fleet.destinationY}
              </span>
              <strong>{fleet.remainingTicks} Tick(s)</strong>
              <small>{formatLoadout(fleet.ships)}</small>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
