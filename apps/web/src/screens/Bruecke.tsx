import { useState } from 'react';
import { productionPerHour, resourcesAt } from '@aquata/rules';
import { AlarmStrip, Button, Deck, Eyebrow, Hero, Icon, NavBar, Panel, Progress, Resources, Row, Sheet, Tag, TickClock, TideBar, useNow, type NavItem } from '../kit';
import { fallbackTick, useServer } from '../server';
import './screens.css';

/**
 * Vorschau der Brücke aus dem Baukasten. Tick und Uhr kommen live vom Server,
 * alles andere sind Beispieldaten, bis Konto und Wirtschaft gebaut sind (Schritte 3 und 4).
 */
const NAV: NavItem[] = [
  { id: 'bruecke', label: 'Brücke', icon: 'bruecke', badge: true },
  { id: 'karte', label: 'Karte', icon: 'karte' },
  { id: 'flotten', label: 'Flotten', icon: 'flotten' },
  { id: 'station', label: 'Station', icon: 'station' },
];

const loadedAt = Date.now();
const STORED = { alu: 12480, stahl: 8215, pu: 2940 };
const RATE = productionPerHour(48, { alu: 50, stahl: 30, pu: 20 });

export function Bruecke() {
  const { tick: live, online } = useServer();
  const t = live ?? fallbackTick();
  const now = useNow();
  const res = resourcesAt(STORED, RATE, loadedAt, now);
  const progress = Math.min(1, Math.max(0, 1 - (t.nextTickAt - now) / (t.tickSeconds * 1000)));
  const [alarm, setAlarm] = useState(true);
  const [sheet, setSheet] = useState(false);

  const events = [
    { tick: t.tick + 2, label: 'Werft 5', tone: 'amber' as const },
    ...(alarm ? [{ tick: t.tick + 3, label: 'Angriff', tone: 'rust' as const }] : []),
    { tick: t.tick + 6, label: 'Flotte 2', tone: 'petrol' as const },
  ];

  return (
    <div className="screen">
      {alarm && <AlarmStrip title="Angriff">2 Flotten von Krakenfürst · Ankunft Tick {t.tick + 3}</AlarmStrip>}
      <main className="screen__scroll">
        <Hero stage={3} height={alarm ? 250 : 330}>
          <header className="hud">
            <div>
              <div className="hud__name">Station Nerea</div>
              <div className="hud__coords k-data">Sektor 14 · 32|−07</div>
            </div>
            <TickClock nextTickAt={t.nextTickAt} tickSeconds={t.tickSeconds} tick={t.tick} />
            <div className="hud__res">
              <Resources values={res} rates={RATE} />
            </div>
          </header>
        </Hero>
        <Deck overlap={alarm ? 30 : 48}>
          <TideBar currentTick={t.tick} progress={progress} events={events} />

          <Panel title="Braucht dich" aside={<Tag tone={alarm ? 'rust' : 'petrol'}>{alarm ? 3 : 2}</Tag>}>
            {alarm && (
              <Row icon="warnung" tone="rust" title="Angriff in 3 Ticks" sub="Verteidigen, Flotte wegschicken oder Hilfe rufen"
                trailing={<Button variant="danger" onClick={() => setSheet(true)}>Reagieren</Button>} />
            )}
            <Row icon="werft" tone="amber" title="Werft 4 → 5" sub="noch 1 h 12 min · schaltet Mako frei" trailing={<Tag tone="amber">62 %</Tag>} />
            <Row icon="sammler" title="12 Sammler stehen still" sub="Aufteilung anpassen" trailing={<Button variant="outline">Aufteilen</Button>} />
          </Panel>

          <Panel title="Bauauftrag" aside={<span className="k-data k-muted" style={{ fontSize: '.75rem' }}>fertig Tick {t.tick + 2}</span>}>
            <Progress value={0.62} label="Werft Stufe 5" />
          </Panel>

          <Panel title="Logbuch">
            <Row icon="bericht" title="Kampf bei Tiefenrast" sub={`Tick ${t.tick - 1} · Sieg · 1.840 Alu Beute`} trailing={<Icon name="pfeil" />} onClick={() => {}} />
            <Row icon="rueckkehr" title="Flotte 1 ist zurück" sub={`Tick ${t.tick - 1} · 24 Piranhas`} />
            <Row icon="sonar" title="Sonar 2 fertig" sub={`Tick ${t.tick - 3} · Reichweite +20 %`} />
          </Panel>

          <p className="screen__foot k-muted">
            <Eyebrow>Vorschau</Eyebrow> Beispieldaten · Server {online ? 'verbunden' : 'nicht erreichbar'} ·{' '}
            <button className="linkish" onClick={() => setAlarm((a) => !a)}>Alarm {alarm ? 'aus' : 'an'}</button> ·{' '}
            <a href="#baukasten">Baukasten</a>
          </p>
        </Deck>
      </main>
      <NavBar items={NAV} current="bruecke" onSelect={() => {}} />

      <Sheet open={sheet} onClose={() => setSheet(false)} label="Auf Angriff reagieren">
        <Eyebrow>Angriff · Tick {t.tick + 3}</Eyebrow>
        <h2 className="k-h2" style={{ margin: '6px 0 4px' }}>Krakenfürst</h2>
        <p className="k-muted" style={{ margin: '0 0 14px', fontSize: '.88rem' }}>2 Flotten, zuletzt gescannt vor 4 Ticks: etwa 120 Mako, 40 Squid.</p>
        <div className="sheet-actions">
          <Button variant="solid" icon="bruecke">Verteidigen</Button>
          <Button variant="outline" icon="flotten">Flotte wegschicken</Button>
        </div>
      </Sheet>
    </div>
  );
}
