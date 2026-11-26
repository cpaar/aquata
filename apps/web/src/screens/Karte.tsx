import { useEffect, useMemo, useState } from 'react';
import { flightTicks, sonarRange } from '@aquata/rules';
import { Button, Panel, Sheet } from '../kit';
import { api, type MapData, type Me } from '../api';
import { DepthMap, type MapFleet, type MapStation } from '../map/DepthMap';
import type { TickState } from '../server';
import type { useStation } from '../station';
import type { useFleets } from '../fleets';
import type { SendInit } from './Flotten';

type St = ReturnType<typeof useStation>;
type Fl = ReturnType<typeof useFleets>;

/** Karte: Tiefenlinien, Sonar, Stationen, eigene und gesichtete Flotten. Tippen auf eine Station öffnet ihr Blatt. */
export function Karte({ st, fl, me, t, onSend }: { st: St; fl: Fl; me: Me & { player: NonNullable<Me['player']> }; t: TickState; onSend: (i: SendInit) => void }) {
  const [map, setMap] = useState<MapData | null>(null);
  const [sel, setSel] = useState<MapStation | null>(null);
  useEffect(() => { api.map().then(setMap).catch(() => {}); }, [t.tick]);

  const d = st.data;
  const sonarLevel = d?.buildings.find((b) => b.id === 'sonar')?.level ?? 0;
  const drive = d?.buildings.find((b) => b.id === 'antrieb')?.level ?? 0;
  const pos = me.player;
  const sonar = useMemo(() => ({ x: pos.x, y: pos.y, r: sonarRange(sonarLevel) }), [pos.x, pos.y, sonarLevel]);
  // Tick mit Nachkommastelle, damit Flotten zwischen zwei Ticks weiterziehen
  const nowTick = t.tick + Math.min(1, Math.max(0, 1 - (t.nextTickAt - st.now) / (t.tickSeconds * 1000)));
  const prog = (l: { start: number; end: number }) => (nowTick - l.start) / Math.max(1, l.end - l.start);

  const fleets: MapFleet[] = [];
  for (const f of fl.fleets?.own ?? []) if (f.leg) fleets.push({ id: `o${f.id}`, from: f.leg.from, to: f.leg.to, progress: prog(f.leg), tone: f.status === 'returning' ? 'petrol' : f.mission === 'attack' ? 'amber' : 'petrol', label: String(Object.values(f.ships).reduce((a, b) => a + b, 0)) });
  for (const f of fl.fleets?.incoming ?? []) if (f.leg) fleets.push({ id: `i${f.id}`, from: f.leg.from, to: f.leg.to, progress: prog(f.leg), tone: f.mission === 'attack' ? 'rust' : 'petrol', label: `~${f.size}` });

  const dist = sel ? Math.round(Math.hypot(sel.x - pos.x, sel.y - pos.y)) : 0;
  const homeIds = d ? Object.keys(d.ships).filter((id) => d.ships[id]! > 0) : [];
  const hasShips = homeIds.length > 0;
  const there = sel ? (fl.fleets?.own ?? []).filter((f) => f.target.id === sel.id) : [];

  return (
    <>
      <Panel title="Karte">
        {map ? (
          <DepthMap seed={map.seed} size={map.size} stations={map.stations} sonar={sonar} fleets={fleets} selected={sel?.id ?? null}
            onStation={setSel} focus={pos} zoom={2.6} height={420} />
        ) : <p className="k-muted">Karte lädt …</p>}
        <div className="map-legend">
          <span><i style={{ background: 'var(--petrol)' }} />deine Station und Flotten</span>
          <span><i style={{ background: 'var(--amber)' }} />eigener Angriff</span>
          <span><i style={{ background: 'var(--rust)' }} />Spieler, fremder Angriff</span>
          <span><i style={{ background: 'var(--muted)' }} />Bot</span>
          <span><i className="map-legend__ring" />Sonar {sonar.r} Punkte</span>
        </div>
      </Panel>

      <Sheet open={!!sel} onClose={() => setSel(null)} label="Station">
        {sel && (
          <div className="report">
            <div>
              <div className="k-eyebrow">{sel.own ? 'Deine Station' : sel.bot ? 'Bot-Station' : `Station von ${sel.owner}`}</div>
              <h3 className="k-h2" style={{ margin: '4px 0 0' }}>{sel.name}</h3>
            </div>
            <dl className="send__sum">
              <dt>Position</dt><dd className="k-data">{sel.x}|{sel.y}</dd>
              {!sel.own && <><dt>Entfernung</dt><dd className="k-data">{dist} Punkte{dist <= sonar.r ? ' · im Sonar' : ''}</dd></>}
              {!sel.own && <><dt>Flugzeit</dt><dd className="k-data">{flightTicks(pos, sel, drive, homeIds)} Ticks mit deinen Schiffen</dd></>}
              {sel.own && <><dt>Sonar</dt><dd className="k-data">Stufe {sonarLevel} · {sonar.r} Punkte Reichweite</dd></>}
              {there.length > 0 && <><dt>Deine Flotten</dt><dd>{there.length} unterwegs oder vor Ort</dd></>}
            </dl>
            {!sel.own && (
              <div className="sheet-actions">
                <Button variant="danger" icon="angriff" disabled={!hasShips} onClick={() => { onSend({ target: sel, mission: 'attack' }); setSel(null); }}>Angreifen</Button>
                <Button variant="outline" icon="flotten" disabled={!hasShips} onClick={() => { onSend({ target: sel, mission: 'defend' }); setSel(null); }}>Verteidigen</Button>
                {!hasShips && <p className="k-muted" style={{ margin: 0, fontSize: '.78rem' }}>Du hast gerade keine Schiffe zuhause.</p>}
              </div>
            )}
            <p className="k-muted" style={{ margin: 0, fontSize: '.78rem' }}>Scans und genauere Infos über fremde Stationen kommen später.</p>
          </div>
        )}
      </Sheet>
    </>
  );
}
