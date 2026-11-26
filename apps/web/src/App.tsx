import { useCallback, useEffect, useState } from 'react';
import { Bruecke } from './screens/Bruecke';
import { Baukasten } from './screens/Baukasten';
import { Anmelden } from './screens/Anmelden';
import { Platzwahl } from './screens/Platzwahl';
import { api, type Me } from './api';

const useHash = () => {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const on = () => setHash(location.hash);
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return hash;
};

export function App() {
  const hash = useHash();
  const [me, setMe] = useState<Me | null>(null);
  const [offline, setOffline] = useState(false);
  const reload = useCallback(() => { api.me().then((m) => { setMe(m); setOffline(false); }).catch(() => setOffline(true)); }, []);
  useEffect(reload, [reload]);

  if (hash === '#baukasten') return <Baukasten />;
  if (offline) return <Bruecke />; // ohne Server: reine Vorschau
  if (!me) return null;
  if (!me.account) return <Anmelden onDone={reload} />;
  if (!me.player) return <Platzwahl playerName={me.account.name} roundName={me.round.name} onDone={reload} />;
  return <Bruecke stationName={me.player.stationName} coords={`${me.player.x}|${me.player.y}`} onLogout={() => api.logout().then(reload)} />;
}
