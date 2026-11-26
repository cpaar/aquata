import { useEffect, useState } from 'react';
import { Bruecke } from './screens/Bruecke';
import { Baukasten } from './screens/Baukasten';

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
  return hash === '#baukasten' ? <Baukasten /> : <Bruecke />;
}
