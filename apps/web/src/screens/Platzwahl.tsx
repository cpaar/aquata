import { useEffect, useState } from 'react';
import { placementError } from '@aquata/rules';
import { Button, Eyebrow, Field, Panel } from '../kit';
import { api, type MapData } from '../api';
import { DepthMap, type Pt } from '../map/DepthMap';
import './screens.css';

/** Rundenstart: Station benennen und einen Platz auf der Tiefenlinien-Karte wählen */
export function Platzwahl({ playerName, roundName, onDone }: { playerName: string; roundName: string; onDone: () => void }) {
  const [map, setMap] = useState<MapData | null>(null);
  const [picked, setPicked] = useState<Pt | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.map().then((m) => { setMap(m); setPicked(m.suggestions[0] ?? null); }).catch((e) => setError(e.message));
  }, []);

  const localErr = picked && map ? placementError(picked, map.stations) : null;
  const isSuggestion = !!picked && !!map?.suggestions.some((s) => s.x === picked.x && s.y === picked.y);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!picked) return;
    setBusy(true); setError('');
    try { await api.place(name, picked); onDone(); } catch (err) { setError((err as Error).message); api.map().then(setMap); } finally { setBusy(false); }
  };

  return (
    <div className="screen">
      <main className="screen__scroll">
        <form className="pick" onSubmit={submit}>
          <div style={{ display: 'grid', gap: 6 }}>
            <Eyebrow>{roundName} · Willkommen, {playerName}</Eyebrow>
            <h1 className="k-h1">Platz wählen</h1>
            <p className="k-muted" style={{ margin: 0, fontSize: '.9rem' }}>
              Wo deine Station steht, bestimmt die Flugzeiten zu Nachbarn und Rohstoffen. Die gelben Kreise sind empfohlene Plätze; du kannst auch frei auf die Karte tippen.
            </p>
          </div>
          {map && <DepthMap seed={map.seed} size={map.size} stations={map.stations} suggestions={map.suggestions} picked={picked} onPick={setPicked} height={360} />}
          <Panel>
            <div className="k-data k-muted" style={{ fontSize: '.78rem', marginBottom: 10 }}>
              {picked ? <>Gewählt: {picked.x}|{picked.y} {isSuggestion && '· empfohlen'}</> : 'Noch kein Platz gewählt'}
              {' · '}{map ? `${map.stations.length} Stationen in der Runde` : 'Karte lädt …'}
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              <Field id="station" label="Name deiner Station" required minLength={3} maxLength={20} placeholder="z. B. Nerea" value={name} onChange={(e) => setName(e.target.value)} />
              {(localErr || error) && <p className="k-error" role="alert">{localErr ?? error}</p>}
              <Button type="submit" block disabled={!picked || !!localErr || busy || name.trim().length < 3}>Station hier bauen</Button>
            </div>
          </Panel>
        </form>
      </main>
    </div>
  );
}
