import type { ReactElement } from "react";

import { formatLoadout, formatResources } from "../game/format.js";
import { useGameSnapshot } from "../game/useGame.js";

export function ReportsPage(): ReactElement {
  const { data } = useGameSnapshot();

  if (!data) {
    return <p className="muted">Lade Berichte...</p>;
  }

  return (
    <section className="page-stack" aria-labelledby="reports-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Berichte</p>
          <h2 id="reports-title">Kampfberichte</h2>
        </div>
      </div>

      <section className="panel">
        <div className="list">
          {data.recentCombatReports.length === 0 ? (
            <p className="muted">Keine Kampfberichte</p>
          ) : null}
          {data.recentCombatReports.map((combatReport) => (
            <article className="report" key={combatReport.id}>
              <div className="report-header">
                <h3>Kampf bei Tick {combatReport.tickNumber}</h3>
                <strong data-testid="combat-outcome">{combatReport.report.outcome}</strong>
              </div>
              <div className="report-grid">
                <span>Angreifer vorher</span>
                <strong>{formatLoadout(combatReport.report.attackerBefore)}</strong>
                <span>Verteidiger vorher</span>
                <strong>{formatLoadout(combatReport.report.defenderBefore)}</strong>
                <span>Angreifer Verluste</span>
                <strong>{formatLoadout(combatReport.report.attackerLosses)}</strong>
                <span>Verteidiger Verluste</span>
                <strong>{formatLoadout(combatReport.report.defenderLosses)}</strong>
                <span>Beteiligte</span>
                <strong>
                  {combatReport.report.participants
                    ?.map((participant) => `${participant.role}:${participant.source}`)
                    .join(", ") ?? "keine"}
                </strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Scanberichte</h3>
        <div className="list">
          {data.recentScanReports.length === 0 ? <p className="muted">Keine Scanberichte</p> : null}
          {data.recentScanReports.map((scanReport) => (
            <article className="report" key={scanReport.id}>
              <div className="report-header">
                <h3>
                  Scan bei Tick {scanReport.tickNumber} {scanReport.report.result.position.x}:
                  {scanReport.report.result.position.y}
                </h3>
                <strong data-testid="scan-report">Station</strong>
              </div>
              <div className="report-grid">
                <span>Ressourcen</span>
                <strong>{formatResources(scanReport.report.result.resources)}</strong>
                <span>Schiffe</span>
                <strong>{formatLoadout(scanReport.report.result.ships)}</strong>
                <span>Sichtbare Flotten</span>
                <strong>{scanReport.report.result.fleets.length}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
