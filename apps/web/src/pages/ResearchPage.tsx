import type { ReactElement } from "react";

import type { ResearchType } from "../api/types.js";
import { formatResources, researchOrder } from "../game/format.js";
import { useGameSnapshot, useStartResearchMutation } from "../game/useGame.js";

export function ResearchPage(): ReactElement {
  const { data } = useGameSnapshot();
  const mutation = useStartResearchMutation();

  if (!data) {
    return <p className="muted">Lade Forschung...</p>;
  }

  function status(researchId: ResearchType): string {
    if (data?.station.research.completed.includes(researchId)) {
      return "abgeschlossen";
    }
    if (data?.station.research.active?.definitionId === researchId) {
      return `${data.station.research.active.remainingTicks} Tick(s)`;
    }
    return "verfuegbar";
  }

  return (
    <section className="page-stack" aria-labelledby="research-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Forschung</p>
          <h2 id="research-title">Labore</h2>
        </div>
      </div>

      {mutation.isError ? <p className="error">{mutation.error.message}</p> : null}

      <div className="card-grid">
        {researchOrder.map((researchId) => {
          const definition = data.catalog.research[researchId];
          const isActive = data.station.research.active?.definitionId === researchId;
          const isCompleted = data.station.research.completed.includes(researchId);
          const blocked =
            Boolean(data.station.research.active) ||
            isCompleted ||
            !definition.prerequisites.every((id) => data.station.research.completed.includes(id));

          return (
            <article className="action-card" key={researchId}>
              <div>
                <h3>{definition.displayName}</h3>
                <p>{formatResources(definition.cost)}</p>
                <p>{definition.durationTicks} Tick(s)</p>
                <p>Status: {status(researchId)}</p>
                {definition.prerequisites.length > 0 ? (
                  <p>Voraussetzung: {definition.prerequisites.join(", ")}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => mutation.mutate({ researchId })}
                disabled={mutation.isPending || blocked || isActive}
              >
                Starten
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
