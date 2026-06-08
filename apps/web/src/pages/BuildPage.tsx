import type { ReactElement } from "react";
import { useState } from "react";

import type { ShipType } from "../api/types.js";
import { formatResources, shipOrder } from "../game/format.js";
import { useGameSnapshot, useStartBuildMutation } from "../game/useGame.js";

export function BuildPage(): ReactElement {
  const { data } = useGameSnapshot();
  const mutation = useStartBuildMutation();
  const [quantities, setQuantities] = useState<Record<ShipType, number>>({
    fighter: 1,
    frigate: 1,
    harvester: 1,
    interceptor: 1,
  });

  if (!data) {
    return <p className="muted">Lade Bauhof...</p>;
  }

  return (
    <section className="page-stack" aria-labelledby="build-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Bau</p>
          <h2 id="build-title">Werftauftraege</h2>
        </div>
      </div>

      {mutation.isError ? <p className="error">{mutation.error.message}</p> : null}

      <div className="card-grid">
        {shipOrder.map((shipType) => {
          const buildable = data.catalog.buildables[shipType];
          const ship = data.catalog.ships[shipType];
          return (
            <article className="action-card" key={shipType}>
              <div>
                <h3>{ship.displayName}</h3>
                <p>{formatResources(buildable.cost)}</p>
                <p>{buildable.buildTimeTicks} Tick(s) pro Einheit</p>
                <p>Bestand: {data.station.ships[shipType]}</p>
              </div>
              <label>
                Menge
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={quantities[shipType]}
                  onChange={(event) =>
                    setQuantities((current) => ({
                      ...current,
                      [shipType]: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  mutation.mutate({ buildableId: shipType, quantity: quantities[shipType] })
                }
                disabled={mutation.isPending}
              >
                Bauen
              </button>
            </article>
          );
        })}
      </div>

      <section className="panel">
        <h3>Bauqueue</h3>
        <div className="list">
          {data.station.buildQueue.length === 0 ? <p className="muted">Keine Auftraege</p> : null}
          {data.station.buildQueue.map((order) => (
            <div className="row" key={order.id}>
              <span>{data.catalog.ships[order.buildableId].displayName}</span>
              <strong>{order.quantity}x</strong>
              <small>{order.remainingTicks} Tick(s)</small>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
