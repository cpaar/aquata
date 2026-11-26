import { useState } from 'react';
import { AlarmStrip, Button, Deck, Eyebrow, Heading, Hero, Icon, NavBar, Panel, Progress, Resources, Row, Sheet, Tag, TickClock, TideBar, type IconName } from '../kit';
import { fallbackTick, useServer } from '../server';
import './screens.css';

const COLORS = [
  ['deep', 'Grund', 'Hintergrund'],
  ['panel2', 'Paneel', 'erhöhte Flächen'],
  ['fg', 'Text', 'Lesetext'],
  ['muted', 'Gedämpft', 'Nebeninfos'],
  ['petrol', 'Petrol', 'Eigenes, Bedienbares'],
  ['amber', 'Bernstein', 'Zeit, Fortschritt'],
  ['rust', 'Rost', 'Gefahr, Gegner'],
  ['alu', 'Alu', 'Rohstoff'],
] as const;

const ICONS: IconName[] = ['bruecke', 'karte', 'flotten', 'station', 'komm', 'werft', 'antrieb', 'sonar', 'sammler', 'angriff', 'rueckkehr', 'bericht', 'warnung', 'uhr'];

export function Baukasten() {
  const { health, tick, online } = useServer();
  const t = tick ?? fallbackTick();
  const [sheet, setSheet] = useState(false);
  const [nav, setNav] = useState('bruecke');

  return (
    <div className="screen__scroll" style={{ height: '100%' }}>
      <div className="kit">
        <header style={{ display: 'grid', gap: 8 }}>
          <Eyebrow>Aquata · Stil E Petrol</Eyebrow>
          <Heading level={1}>Baukasten</Heading>
          <p className="k-muted" style={{ margin: 0, maxWidth: '60ch' }}>
            Alle Bausteine, aus denen sich die Bildschirme zusammensetzen. Server: {online ? `verbunden (${health?.db ?? '…'}, ${health?.round.name ?? '…'}, Tick alle ${t.tickSeconds} s)` : 'nicht erreichbar, Ersatzwerte'} ·{' '}
            <a href="#" style={{ color: 'var(--petrol)' }}>zur Brücke</a>
          </p>
        </header>

        <section>
          <Heading>Farben</Heading>
          <div className="kit__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            {COLORS.map(([v, name, use]) => (
              <div className="kit__swatch" key={v}>
                <i style={{ background: `var(--${v})` }} />
                <div><b>{name}</b><span className="k-muted">{use}</span></div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Heading>Schrift</Heading>
          <div style={{ display: 'grid', gap: 10 }}>
            <Heading level={1}>Station Nerea</Heading>
            <Heading level={2}>Überschrift Ebene 2</Heading>
            <Heading level={3}>Paneel-Titel</Heading>
            <Eyebrow>Kleine Zeile in Bernstein</Eyebrow>
            <p style={{ margin: 0, maxWidth: '60ch' }}>Lesetext in IBM Plex Sans. Die Flotte erreicht Schwarzgrund in 6 Ticks und kann sich bis zur Ankunft jederzeit zurückziehen.</p>
            <span className="k-data">Koordinaten 32|−07 · Tick 1.284 · 12.480 Alu</span>
          </div>
        </section>

        <section>
          <Heading>Knöpfe und Kennzeichen</Heading>
          <div className="kit__row">
            <Button>Ausbauen</Button>
            <Button variant="outline">Aufteilen</Button>
            <Button variant="danger">Reagieren</Button>
            <Button icon="angriff">Angreifen</Button>
            <Button disabled>Zu teuer</Button>
          </div>
          <div className="kit__row" style={{ marginTop: 12 }}>
            <Tag>neutral</Tag><Tag tone="petrol">eigen</Tag><Tag tone="amber">62 %</Tag><Tag tone="rust">feindlich</Tag>
          </div>
        </section>

        <section>
          <Heading>Kiesel-Paneele</Heading>
          <div className="kit__grid">
            <Panel title="Bauauftrag" aside={<Tag tone="amber">Tick {t.tick + 2}</Tag>}>
              <Progress value={0.62} label="Werft Stufe 5" />
              <p className="k-muted" style={{ margin: '8px 0 0', fontSize: '.8rem' }}>Werft 4 → 5 · noch 1 h 12 min</p>
            </Panel>
            <Panel title="Rohstoffe" raised>
              <Resources values={{ alu: 12480, stahl: 8215, pu: 2940 }} rates={{ alu: 1440, stahl: 648, pu: 192 }} />
            </Panel>
            <Panel title="Angriff erkannt" tone="danger">
              <p style={{ margin: 0, fontSize: '.85rem' }}>2 Flotten von Krakenfürst, Ankunft Tick {t.tick + 3}.</p>
            </Panel>
          </div>
        </section>

        <section>
          <Heading>Zeit</Heading>
          <div className="kit__row"><TickClock nextTickAt={t.nextTickAt} tickSeconds={t.tickSeconds} tick={t.tick} /></div>
          <div className="k-panel" style={{ marginTop: 12 }}>
            <TideBar currentTick={t.tick} progress={0.4} events={[
              { tick: t.tick + 2, label: 'Werft 5', tone: 'amber' },
              { tick: t.tick + 3, label: 'Angriff', tone: 'rust' },
              { tick: t.tick + 6, label: 'Flotte 2', tone: 'petrol' },
            ]} />
          </div>
        </section>

        <section>
          <Heading>Listen</Heading>
          <div className="k-panel">
            <Row icon="warnung" tone="rust" title="Angriff in 3 Ticks" sub="Verteidigen oder Flotte wegschicken" trailing={<Button variant="danger">Reagieren</Button>} />
            <Row icon="werft" tone="amber" title="Werft 4 → 5" sub="schaltet Mako frei" trailing={<Tag tone="amber">62 %</Tag>} />
            <Row icon="bericht" title="Kampf bei Tiefenrast" sub="Sieg · 1.840 Alu Beute" trailing={<Icon name="pfeil" />} onClick={() => {}} />
          </div>
        </section>

        <section>
          <Heading>Alarm, Blatt, Navigation</Heading>
          <div className="kit__frame">
            <AlarmStrip title="Angriff">2 Flotten · Ankunft Tick {t.tick + 3}</AlarmStrip>
            <div style={{ padding: 16 }}><Button variant="outline" onClick={() => setSheet(true)}>Blatt öffnen</Button></div>
            <NavBar current={nav} onSelect={setNav} items={[
              { id: 'bruecke', label: 'Brücke', icon: 'bruecke', badge: true },
              { id: 'karte', label: 'Karte', icon: 'karte' },
              { id: 'flotten', label: 'Flotten', icon: 'flotten' },
              { id: 'station', label: 'Station', icon: 'station' },
              { id: 'komm', label: 'Komm', icon: 'komm' },
            ]} />
          </div>
        </section>

        <section>
          <Heading>Stationsbild mit Deck</Heading>
          <div className="kit__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            {([1, 2, 3, 4, 5] as const).map((s) => (
              <div className="kit__frame" key={s}>
                <Hero stage={s} height={110} />
                <div style={{ padding: '6px 10px', fontSize: '.72rem' }} className="k-muted">Stufe {s}</div>
              </div>
            ))}
          </div>
          <div className="kit__frame" style={{ marginTop: 12, maxWidth: 400 }}>
            <Hero stage={4} height={220} />
            <Deck overlap={36}><Heading level={3}>Deck</Heading><p className="k-muted" style={{ margin: 0, fontSize: '.85rem' }}>Schiebt sich beim Scrollen über das Bild.</p></Deck>
          </div>
        </section>

        <section>
          <Heading>Icons</Heading>
          <div className="kit__row" style={{ color: 'var(--petrol)' }}>
            {ICONS.map((n) => <span key={n} title={n} style={{ display: 'grid', justifyItems: 'center', gap: 4, width: 64, fontSize: '.62rem', color: 'var(--muted)' }}><span style={{ color: 'var(--petrol)' }}><Icon name={n} size={24} /></span>{n}</span>)}
          </div>
        </section>
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)} label="Beispiel-Blatt">
        <Eyebrow>Schwarzgrund · feindlich</Eyebrow>
        <h2 className="k-h2" style={{ margin: '6px 0 12px' }}>Krakenfürst</h2>
        <div className="sheet-actions">
          <Button icon="angriff">Angreifen</Button>
          <Button variant="outline" onClick={() => setSheet(false)}>Schließen</Button>
        </div>
      </Sheet>
    </div>
  );
}
