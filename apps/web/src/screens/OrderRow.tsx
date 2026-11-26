import { useState } from 'react';
import { canAfford, type Cost } from '@aquata/rules';
import { Button } from '../kit';
import { fmtCost } from '../station';

/** Menge eingeben, „max“ füllt auf das Bezahlbare auf, dann bestellen */
export function OrderRow({ unit, live, label, onOrder }: { unit: Cost; live: Cost; label: string; onOrder: (n: number) => Promise<boolean> | void }) {
  const [n, setN] = useState(1);
  const max = Math.max(0, Math.floor(Math.min(...(['alu', 'stahl', 'pu'] as const).map((r) => (unit[r] > 0 ? live[r] / unit[r] : Infinity)))));
  const cost = { alu: unit.alu * n, stahl: unit.stahl * n, pu: unit.pu * n };
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

