import { useState } from 'react';
import { canAfford, type Cost } from '@aquata/rules';
import { Button } from '../kit';
import { fmtCost } from '../station';

const linear = (unit: Cost) => (n: number): Cost => ({ alu: unit.alu * n, stahl: unit.stahl * n, pu: unit.pu * n });

/** Größte Menge, deren Kosten noch bezahlbar sind (Kosten steigen mit der Menge) */
function maxAffordable(costFor: (n: number) => Cost, live: Cost) {
  let lo = 0, hi = 1;
  while (canAfford(live, costFor(hi)) && hi < 1e7) hi *= 2;
  while (hi - lo > 1) { const m = Math.floor((lo + hi) / 2); if (canAfford(live, costFor(m))) lo = m; else hi = m; }
  return lo;
}

/** Menge eingeben, „max“ füllt auf das Bezahlbare auf, dann bestellen. unit für feste Stückkosten, costFor für steigende. */
export function OrderRow({ unit, costFor, live, label, onOrder }: { unit?: Cost; costFor?: (n: number) => Cost; live: Cost; label: string; onOrder: (n: number) => Promise<boolean> | void }) {
  const [n, setN] = useState(1);
  const price = costFor ?? linear(unit ?? { alu: 0, stahl: 0, pu: 0 });
  const max = maxAffordable(price, live);
  const cost = price(n);
  const ok = n >= 1 && canAfford(live, cost);
  return (
    <div className="order-row">
      <input className="k-input order-row__n" type="number" min={1} value={n} aria-label={`Anzahl ${label}`}
        onChange={(e) => setN(Math.max(1, Math.floor(Number(e.target.value) || 1)))} />
      <Button variant="outline" disabled={max < 1} onClick={() => setN(Math.max(1, max))}>max {max.toLocaleString('de-DE')}</Button>
      <Button disabled={!ok} title={ok ? undefined : 'zu wenig Rohstoffe'} onClick={() => onOrder(n)}>Bauen</Button>
      <span className="k-data k-muted order-row__cost">{fmtCost(cost)}</span>
    </div>
  );
}
