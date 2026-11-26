import { useState } from 'react';
import { canAfford, COLLECTOR_YIELD_PER_HOUR, tickAt, type BuildingId, type Cost } from '@aquata/rules';
import { Button, Deck, Hero, NavBar, Panel, Progress, Resources, Row, Tag, TickClock, TideBar, type IconName, type NavItem, type TideEvent } from '../kit';
import { fallbackTick, useServer, type TickState } from '../server';
import { fmtCost, fmtDuration, RES_NAMES, useStation, type StationData } from '../station';
import type { Me } from '../api';
import './screens.css';

/** Ein Regler ändert sich, die anderen teilen sich den Rest im alten Verhältnis (Summe bleibt 100) */
function rebalance(sp: Cost, r: keyof Cost, v: number): Cost {
  const others = (['alu', 'stahl', 'pu'] as const).filter((k) => k !== r);
  const rest = others.reduce((s, k) => s + sp[k], 0);
  const out = { ...sp, [r]: v } as Cost;
  for (const k of others) out[k] = rest > 0 ? (sp[k] / rest) * (100 - v) : (100 - v) / others.length;
  return out;
}

type Tab = 'bruecke' | 'karte' | 'flotten' | 'station';
const B_ICON: Record<BuildingId, IconName> = { werft: 'werft', antrieb: 'antrieb', sonar: 'sonar' };
const B_INFO: Record<BuildingId, string> = {
  werft: 'baut Schiffe, höhere Stufen schalten neue Typen frei',
  antrieb: 'kürzere Flugzeiten für Flotten',
  sonar: 'größere Reichweite, fremde Flotten früher sehen',
};

/** Ausbaustufe des Stationsbilds aus der Summe der Gebäudestufen */
const heroStage = (d: StationData | null) => {
  const sum = d ? d.buildings.reduce((s, b) => s + b.level, 0) : 2;
  return Math.max(1, Math.min(5, 1 + Math.floor((sum - 2) / 4))) as 1 | 2 | 3 | 4 | 5;
};

export function Spiel({ me, onLogout }: { me: Me & { player: NonNullable<Me['player']> }; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('bruecke');
  const st = useStation();
  const { tick } = useServer();
  const t = tick ?? fallbackTick();
  const toTick = (ms: number) => tickAt(me.round.startedAt, me.round.tickSeconds, ms) + 1;

  const nav: NavItem[] = [
    { id: 'bruecke', label: 'Brücke', icon: 'bruecke' },
    { id: 'karte', label: 'Karte', icon: 'karte' },
    { id: 'flotten', label: 'Flotten', icon: 'flotten' },
    { id: 'station', label: 'Station', icon: 'station' },
  ];

  const hud = (
    <header className="hud">
      <div>
        <div className="hud__name">{me.player.stationName}</div>
        <div className="hud__coords k-data">{me.player.x}|{me.player.y} · {me.round.name}</div>
      </div>
      <TickClock nextTickAt={t.nextTickAt} tickSeconds={t.tickSeconds} tick={t.tick} />
      {st.live && st.data && <div className="hud__res"><Resources values={st.live} rates={st.data.rate} /></div>}
    </header>
  );

  return (
    <div className="screen">
      <main className="screen__scroll" key={tab}>
        <Hero stage={heroStage(st.data)} height={tab === 'bruecke' ? 330 : 190}>{hud}</Hero>
        <Deck overlap={tab === 'bruecke' ? 48 : 32}>
          {st.error && <p className="k-error" role="alert">{st.error}</p>}
          {tab === 'bruecke' && <Bruecke st={st} t={t} toTick={toTick} go={setTab} />}
          {tab === 'station' && <Station st={st} toTick={toTick} />}
          {(tab === 'karte' || tab === 'flotten') && (
            <Panel title={tab === 'karte' ? 'Karte' : 'Flotten'}>
              <p className="k-muted" style={{ margin: 0, fontSize: '.88rem' }}>
                {tab === 'karte' ? 'Die Tiefenlinien-Karte mit Sonar und Flotten kommt in Schritt 7.' : 'Schiffe bauen und Flotten losschicken kommt in Schritt 5.'}
              </p>
            </Panel>
          )}
          <p className="screen__foot k-muted">
            Angemeldet als {me.account?.name} · <a href="#baukasten">Baukasten</a> · <button className="linkish" onClick={onLogout}>Abmelden</button>
          </p>
        </Deck>
      </main>
      <NavBar items={nav} current={tab} onSelect={(id) => setTab(id as Tab)} />
    </div>
  );
}

type St = ReturnType<typeof useStation>;

function Bruecke({ st, t, toTick, go }: { st: St; t: TickState; toTick: (ms: number) => number; go: (t: Tab) => void }) {
  const d = st.data;
  const progress = Math.min(1, Math.max(0, 1 - (t.nextTickAt - st.now) / (t.tickSeconds * 1000)));
  const building = d?.jobs.find((j) => j.kind === 'building');
  const collecting = d?.jobs.filter((j) => j.kind === 'collector') ?? [];
  const events: TideEvent[] = (d?.jobs ?? []).map((j) => ({
    tick: toTick(j.finishesAt),
    label: j.kind === 'building' ? `${d!.buildings.find((b) => b.id === j.item)?.name ?? ''} ${j.level}` : `+${j.amount} Sammler`,
    tone: 'amber',
  }));

  const needs: React.ReactNode[] = [];
  if (d && !building) needs.push(<Row key="b" icon="station" title="Bauplatz frei" sub="Kein Gebäude im Ausbau" trailing={<Button variant="outline" onClick={() => go('station')}>Ausbauen</Button>} />);
  if (d && collecting.length === 0 && st.live && canAfford(st.live, d.collector.cost)) needs.push(<Row key="c" icon="sammler" title="Mehr Sammler möglich" sub={`${d.collectors} Sammler fördern gerade`} trailing={<Button variant="outline" onClick={() => go('station')}>Bauen</Button>} />);

  return (
    <>
      <TideBar currentTick={t.tick} progress={progress} events={events} />
      <Panel title="Braucht dich" aside={<Tag tone={needs.length ? 'petrol' : undefined}>{needs.length}</Tag>}>
        {needs.length ? needs : <p className="k-muted" style={{ margin: 0, fontSize: '.85rem' }}>Alles läuft. Schau zum nächsten Tick wieder vorbei.</p>}
      </Panel>
      {building && d && (
        <Panel title={`${d.buildings.find((b) => b.id === building.item)?.name} → Stufe ${building.level}`} aside={<span className="k-data k-muted" style={{ fontSize: '.75rem' }}>fertig Tick {toTick(building.finishesAt)}</span>}>
          <Progress value={(st.now - building.startedAt) / (building.finishesAt - building.startedAt)} label="Ausbau" />
          <p className="k-muted k-data" style={{ margin: '8px 0 0', fontSize: '.75rem' }}>noch {fmtDuration(building.finishesAt - st.now)}</p>
        </Panel>
      )}
      <Panel title="Logbuch">
        <p className="k-muted" style={{ margin: 0, fontSize: '.85rem' }}>Noch keine Einträge. Hier landen fertige Ausbauten, Flotten und Kampfberichte.</p>
      </Panel>
    </>
  );
}

function Station({ st, toTick }: { st: St; toTick: (ms: number) => number }) {
  const d = st.data;
  const [split, setSplit] = useState<Cost | null>(null);
  if (!d || !st.live) return <p className="k-muted">Station lädt …</p>;
  const running = d.jobs.find((j) => j.kind === 'building');
  const queue = d.jobs.filter((j) => j.kind === 'collector');
  const sp = split ?? d.split;

  return (
    <>
      <Panel title="Gebäude">
        {d.buildings.map((b) => {
          const isRunning = running?.item === b.id;
          const affordable = canAfford(st.live!, b.next.cost);
          const reason = isRunning ? 'im Ausbau' : running ? 'ein Ausbau läuft' : !affordable ? 'zu wenig Rohstoffe' : '';
          return (
            <Row key={b.id} icon={B_ICON[b.id]} tone={isRunning ? 'amber' : undefined}
              title={<>{b.name} <span className="k-muted k-data" style={{ fontSize: '.78rem' }}>Stufe {b.level}</span></>}
              sub={isRunning
                ? <>→ Stufe {running!.level} · noch {fmtDuration(running!.finishesAt - st.now)} · Tick {toTick(running!.finishesAt)}</>
                : <>{B_INFO[b.id]}<br /><span className="k-data">{fmtCost(b.next.cost)} · {fmtDuration(b.next.seconds * 1000)}</span></>}
              trailing={isRunning ? <Tag tone="amber">{Math.round(((st.now - running!.startedAt) / (running!.finishesAt - running!.startedAt)) * 100)} %</Tag>
                : <Button variant="outline" disabled={!!reason} title={reason || undefined} onClick={() => st.act('/api/station/build', { building: b.id })}>Ausbauen</Button>} />
          );
        })}
      </Panel>

      <Panel title="Sammler" aside={<span className="k-data">{d.collectors}</span>}>
        <p className="k-muted" style={{ margin: '0 0 10px', fontSize: '.82rem' }}>
          Sammler pendeln zwischen Station und Rohstoffknoten. Ein Sammler kostet <span className="k-data">{fmtCost(d.collector.cost)}</span> und braucht {fmtDuration(d.collector.buildSeconds * 1000)}.
        </p>
        <div className="kit__row">
          {[1, 5, 10].map((n) => {
            const cost = { alu: d.collector.cost.alu * n, stahl: d.collector.cost.stahl * n, pu: d.collector.cost.pu * n };
            return <Button key={n} variant="outline" icon="plus" disabled={!canAfford(st.live!, cost)} onClick={() => st.act('/api/station/collectors', { amount: n })}>{n}</Button>;
          })}
        </div>
        {queue.length > 0 && (
          <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
            {queue.map((j) => (
              <div key={j.id} className="k-data k-muted" style={{ fontSize: '.75rem' }}>+{j.amount} Sammler · fertig in {fmtDuration(j.finishesAt - st.now)} (Tick {toTick(j.finishesAt)})</div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Aufteilung" aside={split && <Button onClick={async () => { if (await st.act('/api/station/split', split)) setSplit(null); }}>Übernehmen</Button>}>
        <div style={{ display: 'grid', gap: 12 }}>
          {(['alu', 'stahl', 'pu'] as const).map((r) => (
            <label key={r} className="split-row">
              <span><i className="k-res__dot" style={{ background: `var(--${r})`, display: 'inline-block', marginRight: 8 }} />{RES_NAMES[r]}</span>
              <input type="range" min={0} max={100} value={Math.round(sp[r])} aria-label={`Anteil ${RES_NAMES[r]}`} onChange={(e) => setSplit(rebalance(sp, r, Number(e.target.value)))} />
              <span className="k-data">{Math.round(sp[r])} % · +{Math.round((d.collectors * sp[r] / 100) * COLLECTOR_YIELD_PER_HOUR[r]).toLocaleString('de-DE')}/h</span>
            </label>
          ))}
        </div>
      </Panel>
      <p className="k-muted" style={{ margin: 0, fontSize: '.75rem' }}>Kommandoschiff und weitere Gebäude kommen mit späteren Schritten.</p>
    </>
  );
}
