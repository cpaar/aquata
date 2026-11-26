import { useEffect, useMemo, useState } from 'react';
import { ATTACK, countShips, flightTicks, fuelCost, MIN_WARNING_TICKS, SHIPS, tickTime, type Cost, type Ships } from '@aquata/rules';
import { AlarmStrip, Button, Panel, Row, Sheet, Tabs, Tag } from '../kit';
import { api, type Me } from '../api';
import type { MapStation } from '../map/DepthMap';
import { fmtCost, fmtDuration, type useStation } from '../station';
import { OrderRow } from './OrderRow';
import type { IncomingFleet, OwnFleet, useFleets } from '../fleets';

type St = ReturnType<typeof useStation>;
type Fl = ReturnType<typeof useFleets>;
type Round = Me['round'];

const ROLE: Record<string, string> = { normal: 'Normal', emp: 'EMP', erstschlag: 'Erstschlag' };
const CLASS: Record<string, string> = { klein: 'klein', mittel: 'mittel', fregatte: 'Fregatte', schwer: 'schwer' };
export const shipList = (s: Ships) => Object.entries(s).filter(([, n]) => n > 0).map(([id, n]) => `${n.toLocaleString('de-DE')} ${SHIPS[id]?.name ?? id}`).join(' · ') || 'keine Schiffe';
export const cargoText = (c: Cost) => (c.alu + c.stahl + c.pu > 0 ? fmtCost(c) : '');

/** „Tick 42 · in 13 min“ */
export function TickWhen({ round, tick, now, short }: { round: Round; tick: number; now: number; short?: boolean }) {
  const at = tickTime(round.startedAt, round.tickSeconds, tick);
  const when = at > now ? `in ${fmtDuration(at - now)}` : 'jetzt';
  return <span className="k-data">{short ? when : `Tick ${tick} · ${when}`}</span>;
}

/** Warnung vor anfliegenden fremden Angriffen, für Brücke und Flotten */
export function IncomingAlarm({ incoming, round, now }: { incoming: IncomingFleet[]; round: Round; now: number }) {
  const attacks = incoming.filter((f) => f.mission === 'attack');
  if (!attacks.length) return null;
  const first = attacks[0]!;
  return (
    <AlarmStrip title="Angriff">
      {attacks.length === 1 ? `${first.from.station} (${first.from.owner}) mit ${first.size} Schiffen` : `${attacks.length} Flotten im Anflug`} ·{' '}
      {first.status === 'engaged' ? 'kämpft gerade' : <>Ankunft <TickWhen round={round} tick={first.arriveTick} now={now} /></>}
    </AlarmStrip>
  );
}

const statusText = (f: OwnFleet) =>
  f.status === 'outbound' ? `fliegt zu ${f.target.station}` : f.status === 'engaged' ? (f.mission === 'attack' ? `kämpft an ${f.target.station} (${f.fought}/${f.fightTicks})` : `verteidigt ${f.target.station} (${f.fought}/${f.fightTicks})`) : `kehrt heim von ${f.target.station}`;

export function Flotten({ st, fl, me, toTick, onSend, onReport }: { st: St; fl: Fl; me: Me & { player: NonNullable<Me['player']> }; toTick: (ms: number) => number; onSend: () => void; onReport: (id: number) => void }) {
  const d = st.data;
  if (!d || !st.live) return <p className="k-muted">Flotten laden …</p>;
  const queue = d.jobs.filter((j) => j.kind === 'ship');
  const home = Object.entries(d.ships).filter(([, n]) => n > 0);
  const werft = d.buildings.find((b) => b.id === 'werft')!.level;

  return (
    <>
      {fl.fleets && <IncomingAlarm incoming={fl.fleets.incoming} round={me.round} now={st.now} />}
      {fl.error && <p className="k-error" role="alert">{fl.error}</p>}

      <Panel title="Zuhause" aside={<span className="k-data">{home.reduce((s, [, n]) => s + n, 0)} Schiffe</span>}>
        {home.length ? home.map(([id, n]) => {
          const t = d.shipTypes.find((x) => x.id === id);
          return <Row key={id} icon="flotten" title={<><span className="k-data">{n.toLocaleString('de-DE')}×</span> {t?.name ?? id}</>} sub={t && `${CLASS[t.class]} · ${ROLE[t.role]}`} />;
        }) : <p className="k-muted" style={{ margin: 0, fontSize: '.85rem' }}>Keine Schiffe zuhause. Gib unten welche in der Werft in Auftrag.</p>}
        {home.length > 0 && <div style={{ marginTop: 12 }}><Button block icon="angriff" onClick={onSend}>Flotte losschicken</Button></div>}
      </Panel>

      {fl.fleets && fl.fleets.own.length > 0 && (
        <Panel title="Unterwegs" aside={<span className="k-data">{fl.fleets.own.length}</span>}>
          {fl.fleets.own.map((f) => (
            <Row key={f.id} icon={f.status === 'returning' ? 'rueckkehr' : 'angriff'} tone={f.status === 'engaged' && f.mission === 'attack' ? 'rust' : f.status === 'returning' ? undefined : 'amber'}
              title={<>{statusText(f)}</>}
              sub={<>{shipList(f.ships)}{cargoText(f.cargo) && <><br />Fracht: {cargoText(f.cargo)}</>}<br />{f.status === 'engaged' ? 'am Ziel' : <>{f.status === 'returning' ? 'zurück' : 'Ankunft'} <TickWhen round={me.round} tick={f.arriveTick} now={st.now} /></>}</>}
              trailing={f.status !== 'returning' ? <Button variant="outline" icon="rueckkehr" onClick={() => fl.recall(f.id)}>Zurück</Button> : undefined} />
          ))}
        </Panel>
      )}

      {fl.fleets && fl.fleets.incoming.length > 0 && (
        <Panel title="Im Sonar" tone="danger">
          {fl.fleets.incoming.map((f) => (
            <Row key={f.id} icon={f.mission === 'attack' ? 'warnung' : 'flotten'} tone={f.mission === 'attack' ? 'rust' : undefined}
              title={<>{f.mission === 'attack' ? 'Angriff' : 'Verteidigung'} von {f.from.station}</>}
              sub={<>{f.from.owner} · etwa {f.size} Schiffe · {f.status === 'engaged' ? 'am Ziel' : <>Ankunft <TickWhen round={me.round} tick={f.arriveTick} now={st.now} /></>}</>} />
          ))}
        </Panel>
      )}

      <Panel title={`Werft · Stufe ${werft}`}>
        <p className="k-muted" style={{ margin: '0 0 6px', fontSize: '.8rem' }}>Ein Auftrag dauert gleich lang, egal wie viele Schiffe. Mehrere Aufträge laufen gleichzeitig.</p>
        {d.shipTypes.filter((t) => t.unlocked).map((t) => (
          <div key={t.id} className="ship-order">
            <div className="k-row__title">{t.name} <span className="k-muted" style={{ fontSize: '.75rem' }}>{CLASS[t.class]} · {ROLE[t.role]}</span></div>
            <div className="k-row__sub k-data">{fmtCost(t.cost)} je Schiff · {fmtDuration(t.seconds * 1000)} je Auftrag</div>
            <OrderRow unit={t.cost} live={st.live!} label={t.name} onOrder={(n) => st.act('/api/station/ships', { ship: t.id, amount: n })} />
          </div>
        ))}
        {d.shipTypes.filter((t) => !t.unlocked).slice(0, 1).map((t) => (
          <p key={t.id} className="k-muted" style={{ margin: '10px 0 0', fontSize: '.78rem' }}>Nächster Schiffstyp: {t.name} mit Werft Stufe {t.werft}.</p>
        ))}
      </Panel>

      {queue.length > 0 && (
        <Panel title="In Bau">
          {queue.map((j) => {
            const t = d.shipTypes.find((x) => x.id === j.item);
            const running = st.now >= j.startedAt;
            return (
              <Row key={j.id} icon="werft" tone="amber" title={<>{(j.amount ?? 0).toLocaleString('de-DE')}× {t?.name}</>}
                sub={running ? `fertig in ${fmtDuration(j.finishesAt - st.now)} · Tick ${toTick(j.finishesAt)}` : `wartet · startet in ${fmtDuration(j.startedAt - st.now)}`}
                trailing={running ? <Tag tone="amber">{Math.round(((st.now - j.startedAt) / (j.finishesAt - j.startedAt)) * 100)} %</Tag> : <Tag>wartet</Tag>} />
            );
          })}
        </Panel>
      )}

      <Panel title="Kampfberichte" aside={<Tag tone={fl.reports.some((r) => !r.seen) ? 'rust' : undefined}>{fl.reports.filter((r) => !r.seen).length} neu</Tag>}>
        {fl.reports.length ? fl.reports.slice(0, 10).map((r) => (
          <Row key={r.id} icon="bericht" tone={!r.seen ? 'rust' : undefined} onClick={() => onReport(r.id)}
            title={<>{r.target} · {r.winner === 'draw' ? 'unentschieden' : (r.side === r.winner) ? 'gewonnen' : 'verloren'}</>}
            sub={<span className="k-data">Tick {r.tick} · {r.side === 'attacker' ? 'Angriff' : 'Verteidigung'}</span>} />
        )) : <p className="k-muted" style={{ margin: 0, fontSize: '.85rem' }}>Noch keine Kämpfe.</p>}
      </Panel>

    </>
  );
}

/* ---------- Losschicken in vier Schritten: Ziel, Schiffe, Ankunft, Bestätigen ---------- */
export interface SendInit { target?: MapStation; mission?: 'attack' | 'defend' }
export function SendSheet({ st, fl, me, init, onClose }: { st: St; fl: Fl; me: Me & { player: NonNullable<Me['player']> }; init: SendInit; onClose: () => void }) {
  const d = st.data!;
  const [step, setStep] = useState(init.target ? 1 : 0);
  const [mission, setMission] = useState<'attack' | 'defend'>(init.mission ?? 'attack');
  const [stations, setStations] = useState<MapStation[]>([]);
  const [target, setTarget] = useState<MapStation | null>(init.target ?? null);
  const [ships, setShips] = useState<Ships>({});
  const [arrive, setArrive] = useState<number | null>(null);
  const [fightTicks, setFightTicks] = useState(1);
  const [busy, setBusy] = useState(false);
  useEffect(() => { api.map().then((m) => setStations(m.stations.filter((s) => !s.own))).catch(() => {}); }, []);

  const drive = d.buildings.find((b) => b.id === 'antrieb')!.level;
  const nowTick = fl.fleets?.tick ?? 0;
  const pos = me.player;
  const sorted = useMemo(() => [...stations].sort((a, b) => Math.hypot(a.x - pos.x, a.y - pos.y) - Math.hypot(b.x - pos.x, b.y - pos.y)), [stations, pos.x, pos.y]);
  const chosen = Object.fromEntries(Object.entries(ships).filter(([, n]) => n > 0));
  const ticks = target ? flightTicks(pos, target, drive, Object.keys(chosen)) : 0;
  const earliest = nowTick + ticks, latest = earliest + ATTACK.maxDelayTicks;
  const at = Math.min(latest, Math.max(earliest, arrive ?? earliest));
  const fuel = fuelCost(chosen, ticks, drive);
  const fuelOk = fuel <= (st.live?.pu ?? 0);

  const go = async () => {
    setBusy(true);
    const ok = await fl.send({ target: target!.id, ships: chosen, arriveTick: at, fightTicks, mission });
    setBusy(false);
    if (ok) { st.reload(); onClose(); }
  };

  const steps = ['Ziel', 'Schiffe', 'Ankunft', 'Los'];
  return (
    <Sheet open onClose={onClose} label="Flotte losschicken">
      <div className="send">
        <ol className="send__steps" aria-label="Schritte">
          {steps.map((s, i) => <li key={s} aria-current={i === step ? 'step' : undefined} className={i < step ? 'done' : undefined}>{s}</li>)}
        </ol>

        {step === 0 && (
          <>
            <Tabs label="Auftrag" value={mission} onChange={setMission} options={[{ id: 'attack', label: 'Angreifen' }, { id: 'defend', label: 'Verteidigen' }]} />
            <div className="send__list">
              {sorted.length ? sorted.map((s) => (
                <Row key={s.id} icon={mission === 'attack' ? 'angriff' : 'flotten'} onClick={() => { setTarget(s); setStep(1); }}
                  title={<>{s.name} <span className="k-muted" style={{ fontSize: '.75rem' }}>{s.bot ? 'Bot' : s.owner}</span></>}
                  sub={<span className="k-data">{s.x}|{s.y} · {flightTicks(pos, s, drive, [])} Ticks Flug</span>} />
              )) : <p className="k-muted" style={{ fontSize: '.85rem' }}>Noch keine anderen Stationen auf der Karte.</p>}
            </div>
          </>
        )}

        {step === 1 && target && (
          <>
            <p className="send__lead">{mission === 'attack' ? 'Angriff auf' : 'Verteidigung für'} <b>{target.name}</b>. Welche Schiffe fliegen mit?</p>
            {Object.entries(d.ships).filter(([, n]) => n > 0).map(([id, have]) => (
              <div key={id} className="ship-row">
                <div><div className="k-row__title">{SHIPS[id]?.name}</div><div className="k-row__sub k-data">{have} zuhause</div></div>
                <input className="k-input ship-row__n" type="number" min={0} max={have} value={ships[id] ?? 0} aria-label={`Anzahl ${SHIPS[id]?.name}`}
                  onChange={(e) => setShips({ ...ships, [id]: Math.max(0, Math.min(have, Math.floor(Number(e.target.value) || 0))) })} />
                <Button variant="outline" onClick={() => setShips({ ...ships, [id]: have })}>alle</Button>
              </div>
            ))}
            <div className="send__nav">
              <Button variant="outline" onClick={() => setStep(0)}>Zurück</Button>
              <Button disabled={!countShips(chosen)} onClick={() => setStep(2)}>Weiter</Button>
            </div>
          </>
        )}

        {step === 2 && target && (
          <>
            <p className="send__lead">Flugzeit {ticks} Ticks. Du kannst später ankommen, etwa um dich mit anderen abzustimmen.</p>
            <div className="send__stepper">
              <Button variant="outline" aria-label="früher" disabled={at <= earliest} onClick={() => setArrive(at - 1)}>−</Button>
              <div><b className="k-data">Tick {at}</b><small><TickWhen short round={me.round} tick={at} now={st.now} /></small></div>
              <Button variant="outline" aria-label="später" disabled={at >= latest} onClick={() => setArrive(at + 1)}>+</Button>
            </div>
            <p className="k-muted" style={{ margin: 0, fontSize: '.8rem' }}>{mission === 'attack' ? 'Kampfticks am Ziel' : 'Ticks am Ziel bleiben'}</p>
            <Tabs label="Ticks am Ziel" value={String(fightTicks)} onChange={(v) => setFightTicks(Number(v))} options={Array.from({ length: ATTACK.maxFightTicks }, (_, i) => ({ id: String(i + 1), label: String(i + 1) }))} />
            <div className="send__nav">
              <Button variant="outline" onClick={() => setStep(1)}>Zurück</Button>
              <Button onClick={() => setStep(3)}>Weiter</Button>
            </div>
          </>
        )}

        {step === 3 && target && (
          <>
            <dl className="send__sum">
              <dt>Auftrag</dt><dd>{mission === 'attack' ? 'Angriff' : 'Verteidigung'} · {target.name}</dd>
              <dt>Schiffe</dt><dd>{shipList(chosen)}</dd>
              <dt>Ankunft</dt><dd><TickWhen round={me.round} tick={at} now={st.now} /></dd>
              <dt>Am Ziel</dt><dd>{fightTicks} {fightTicks === 1 ? 'Tick' : 'Ticks'}, dann Heimflug</dd>
              <dt>Treibstoff</dt><dd className={fuelOk ? 'k-data' : 'k-data k-error'}>{fuel.toLocaleString('de-DE')} Plutonium (hin und zurück)</dd>
            </dl>
            {mission === 'attack' && <p className="k-muted" style={{ margin: 0, fontSize: '.78rem' }}>Das Ziel sieht dich, sobald du in sein Sonar fliegst, spätestens ab Tick {at - MIN_WARNING_TICKS}.</p>}
            {fl.error && <p className="k-error" role="alert">{fl.error}</p>}
            <div className="send__nav">
              <Button variant="outline" onClick={() => setStep(2)}>Zurück</Button>
              <Button variant={mission === 'attack' ? 'danger' : 'solid'} icon={mission === 'attack' ? 'angriff' : 'flotten'} disabled={!fuelOk || busy} onClick={go}>{mission === 'attack' ? 'Angreifen' : 'Losschicken'}</Button>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
