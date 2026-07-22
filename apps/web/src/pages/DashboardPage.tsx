import type { ReactElement } from "react";

import {
  formatLoadout,
  formatResources,
  resourceLabels,
  resourceOrder,
  shipOrder,
} from "../game/format.js";
import { useGameSnapshot } from "../game/useGame.js";

export function DashboardPage(): ReactElement {
  const { data } = useGameSnapshot();

  if (!data) {
    return <p className="muted">Lade Dashboard...</p>;
  }

  return (
    <section className="page-stack" aria-labelledby="dashboard-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Ubersicht</p>
          <h2 id="dashboard-title">
            Station bei {data.station.x}:{data.station.y}
          </h2>
        </div>
        <p className="pill">Tick {data.round.currentTick}</p>
      </div>

      <div className="metric-grid">
        {resourceOrder.map((resourceType) => (
          <article className="metric" key={resourceType}>
            <span>{resourceLabels[resourceType]}</span>
            <strong>{data.station.resources[resourceType]}</strong>
          </article>
        ))}
      </div>

      <div className="two-column">
        <section className="panel">
          <h3>Produktion pro Tick</h3>
          <div className="list">
            {data.station.production.map((source) => (
              <div className="row" key={source.id}>
                <span>{source.id}</span>
                <strong>{source.count}x</strong>
                <small>{formatResources(source.produces)}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h3>Schiffe</h3>
          <div className="list">
            {shipOrder.map((shipType) => (
              <div className="row" key={shipType}>
                <span>{data.catalog.ships[shipType].displayName}</span>
                <strong data-testid={`ship-${shipType}`}>{data.station.ships[shipType]}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <h3>Aktuelle Lage</h3>
        <div className="list">
          <div className="row">
            <span>Bauqueue</span>
            <strong>{data.station.buildQueue.length}</strong>
          </div>
          <div className="row">
            <span>Forschung</span>
            <strong>{data.station.research.active?.definitionId ?? "frei"}</strong>
          </div>
          <div className="row">
            <span>Aktive Flotten</span>
            <strong>{data.activeFleets.length}</strong>
          </div>
          <div className="row">
            <span>Defense vor Ort</span>
            <strong>{data.stationedDefenseFleets.length}</strong>
          </div>
          <div className="row">
            <span>Dummy-Ziel</span>
            <strong>
              {data.targets[0]
                ? `${data.targets[0].name} ${data.targets[0].x}:${data.targets[0].y}`
                : "kein Ziel"}
            </strong>
          </div>
          <div className="row">
            <span>Letzter Bericht</span>
            <strong>{data.recentCombatReports[0]?.report.outcome ?? "keiner"}</strong>
          </div>
          <div className="row">
            <span>Letzter Scan</span>
            <strong>
              {data.recentScanReports[0]
                ? `${data.recentScanReports[0].report.result.position.x}:${data.recentScanReports[0].report.result.position.y}`
                : "keiner"}
            </strong>
          </div>
          <div className="row">
            <span>Flottenladung</span>
            <strong>
              {data.activeFleets[0] ? formatLoadout(data.activeFleets[0].ships) : "keine"}
            </strong>
          </div>
        </div>
      </section>
    </section>
  );
}
