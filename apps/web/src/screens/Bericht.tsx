import { useEffect, useMemo, useState } from 'react';
import { addShips, countShips, SHIPS, type Ships } from '@aquata/rules';
import { Button, Sheet } from '../kit';
import { getReport, type Report } from '../fleets';
import { cargoText, shipList } from './Flotten';

interface Frame { title: string; text: string; a: Ships; d: Ships; parA: Ships; parD: Ships; lostA: Ships; lostD: Ships }
const sum = (list: Ships[]) => list.reduce<Ships>((acc, s) => addShips(acc, s), {});
const names = (s: Ships) => (countShips(s) ? shipList(s) : 'nichts');

/** Baut aus einem Bericht die Bilder der Wiedergabe: Aufstellung, EMP, Erstschlag, Hauptkampf, Ergebnis */
function frames(r: Report): Frame[] {
  let a = sum(r.attackers.map((p) => p.before)), d = sum(r.defenders.map((p) => p.before));
  const none = {};
  const out: Frame[] = [{ title: 'Aufstellung', text: `${countShips(a)} Schiffe greifen an, ${countShips(d)} verteidigen.`, a, d, parA: none, parD: none, lostA: none, lostD: none }];
  if (!r.phases.length) {
    out.push({ title: 'Kein Kampf', text: 'Keine Verteidigung vor Ort. Der Angreifer hat freie Bahn.', a, d, parA: none, parD: none, lostA: none, lostD: none });
    return out;
  }
  for (const ph of r.phases) {
    if (ph.phase === 'emp') {
      const any = countShips(ph.attacker.active) + countShips(ph.defender.active) > 0;
      out.push({
        title: 'EMP', a, d, parA: ph.attacker.paralyzed, parD: ph.defender.paralyzed, lostA: none, lostD: none,
        text: any
          ? `EMP-Schiffe lähmen zuerst. Gelähmt beim Angreifer: ${names(ph.attacker.paralyzed)}. Beim Verteidiger: ${names(ph.defender.paralyzed)}. Gelähmte Schiffe schießen in diesem Tick nicht.`
          : 'Keine EMP-Schiffe dabei, niemand wird gelähmt.',
      });
    } else {
      const first = ph.phase === 'erstschlag';
      const fired = countShips(ph.attacker.active) + countShips(ph.defender.active);
      a = addShips(a, ph.attacker.lost, -1); d = addShips(d, ph.defender.lost, -1);
      const prev = out[out.length - 1]!;
      out.push({
        title: first ? 'Erstschlag' : 'Hauptkampf', a, d,
        parA: first ? prev.parA : none, parD: first ? prev.parD : none, lostA: ph.attacker.lost, lostD: ph.defender.lost,
        text: !fired
          ? (first ? 'Keine Erstschlag-Schiffe bereit.' : 'Niemand mehr da, der schießen kann.')
          : `${first ? 'Erstschlag-Schiffe feuern vor allen anderen.' : 'Jetzt feuern alle übrigen Schiffe.'} Verloren beim Angreifer: ${names(ph.attacker.lost)}. Beim Verteidiger: ${names(ph.defender.lost)}.`,
      });
    }
  }
  const verdict = r.winner === 'attacker' ? 'Die Verteidigung ist ausgeschaltet, der Angreifer plündert.' : r.winner === 'defender' ? 'Der Angriff ist abgewehrt.' : 'Beide Seiten haben noch Schiffe. Weiter geht es im nächsten Tick, wenn der Angreifer bleibt.';
  out.push({ title: 'Ergebnis', text: verdict, a, d, parA: none, parD: none, lostA: none, lostD: none });
  return out;
}

function SideBars({ label, start, now, par, lost, tone }: { label: string; start: Ships; now: Ships; par: Ships; lost: Ships; tone: 'petrol' | 'rust' }) {
  const ids = Object.keys(SHIPS).filter((id) => (start[id] ?? 0) > 0);
  return (
    <div className="replay__side">
      <div className="k-eyebrow">{label}</div>
      {ids.map((id) => {
        const s = start[id]!, n = now[id] ?? 0, p = Math.min(n, par[id] ?? 0), l = lost[id] ?? 0;
        return (
          <div key={id} className="replay__row">
            <span className="replay__name">{SHIPS[id]!.name}</span>
            <span className="replay__bar" aria-hidden="true">
              <i className={`replay__fill replay__fill--${tone}`} style={{ width: `${(n / s) * 100}%` }} />
              {p > 0 && <i className="replay__par" style={{ width: `${(p / s) * 100}%` }} />}
            </span>
            <span className="k-data replay__n">{n}{l > 0 && <b> −{l}</b>}</span>
          </div>
        );
      })}
      {!ids.length && <span className="k-muted" style={{ fontSize: '.78rem' }}>keine Schiffe</span>}
    </div>
  );
}

export function ReportSheet({ id, onClose, onSeen }: { id: number | null; onClose: () => void; onSeen?: (id: number) => void }) {
  const [report, setReport] = useState<Report | null>(null);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    setReport(null); setI(0);
    if (id == null) return;
    getReport(id).then((r) => { setReport(r); setPlaying(true); onSeen?.(id); }).catch(() => onClose());
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const fs = useMemo(() => (report ? frames(report) : []), [report]);
  useEffect(() => {
    if (!playing) return;
    if (i >= fs.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setI(i + 1), 1700);
    return () => clearTimeout(t);
  }, [playing, i, fs.length]);

  if (id == null) return null;
  if (!report) return <Sheet open onClose={onClose} label="Kampfbericht"><p className="k-muted">Bericht lädt …</p></Sheet>;
  const f = fs[i]!;
  const start = fs[0]!;
  const won = report.winner === 'draw' ? 'Unentschieden' : report.side === report.winner ? 'Gewonnen' : 'Verloren';
  const mine = report.side === 'attacker';
  const side = (title: string, list: Report['attackers']) => (
    <div className="report__side">
      <h4 className="k-eyebrow">{title}</h4>
      {list.map((p, k) => (
        <div key={k} className="report__p">
          <b>{p.station}</b> <span className="k-muted">{p.owner}{p.fleetId == null ? ' · zuhause' : p.fightNo ? ` · Kampftick ${p.fightNo}/${p.of}` : ''}</span>
          <div className="k-data">{shipList(p.before)}</div>
          {countShips(p.lost) > 0 && <div className="k-data" style={{ color: 'var(--rust)' }}>verloren: {shipList(p.lost)}</div>}
          {cargoText(p.debris) && <div className="k-data k-muted">Müll: {cargoText(p.debris)}</div>}
          {cargoText(p.loot) && <div className="k-data" style={{ color: 'var(--amber)' }}>Beute: {cargoText(p.loot)}</div>}
        </div>
      ))}
    </div>
  );

  return (
    <Sheet open onClose={onClose} label="Kampfbericht">
      <div className="report">
        <div>
          <div className="k-eyebrow">Kampfbericht · Tick {report.tick} · {mine ? 'dein Angriff' : 'Verteidigung'}</div>
          <h3 className="k-h2" style={{ margin: '4px 0 0' }}>{report.target.station}: {won}</h3>
        </div>

        <div className="replay">
          <ol className="replay__steps" aria-label="Phasen">
            {fs.map((x, k) => <li key={k} className={k < i ? 'done' : undefined} aria-current={k === i ? 'step' : undefined}><button type="button" onClick={() => { setPlaying(false); setI(k); }}>{x.title}</button></li>)}
          </ol>
          <div className="replay__grid">
            <SideBars label="Angreifer" start={start.a} now={f.a} par={f.parA} lost={f.lostA} tone={mine ? 'petrol' : 'rust'} />
            <SideBars label="Verteidiger" start={start.d} now={f.d} par={f.parD} lost={f.lostD} tone={mine ? 'rust' : 'petrol'} />
          </div>
          <p className="replay__text" aria-live="polite"><b>{f.title}.</b> {f.text}</p>
          <div className="send__nav">
            <Button variant="outline" disabled={i === 0} onClick={() => { setPlaying(false); setI(i - 1); }}>Zurück</Button>
            {i < fs.length - 1
              ? <Button onClick={() => (playing ? setPlaying(false) : setI(i + 1))}>{playing ? 'Anhalten' : 'Weiter'}</Button>
              : <Button variant="outline" onClick={() => { setI(0); setPlaying(true); }}>Nochmal</Button>}
          </div>
        </div>

        {side('Angreifer', report.attackers)}
        {side('Verteidiger', report.defenders)}
        <Button block variant="outline" onClick={onClose}>Schließen</Button>
      </div>
    </Sheet>
  );
}
