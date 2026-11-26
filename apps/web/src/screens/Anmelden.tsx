import { useState } from 'react';
import { Button, Eyebrow, Field, Tabs } from '../kit';
import { api } from '../api';
import './screens.css';

export function Anmelden({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      if (mode === 'register') await api.register(email, name, password);
      else await api.login(email, password);
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally { setBusy(false); }
  };

  return (
    <div className="screen entry">
      <div className="entry__hero">
        <img src="/station/stufe-5.jpg" alt="" />
      </div>
      <form className="entry__form" onSubmit={submit}>
        <div style={{ display: 'grid', gap: 6 }}>
          <Eyebrow>Tiefsee-Strategie in Ticks</Eyebrow>
          <h1 className="k-h1" style={{ fontSize: '2rem', letterSpacing: '.3em' }}>Aquata</h1>
        </div>
        <Tabs label="Anmelden oder registrieren" value={mode} onChange={(m) => { setMode(m); setError(''); }} options={[{ id: 'login', label: 'Anmelden' }, { id: 'register', label: 'Neues Konto' }]} />
        <Field id="email" label="E-Mail" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        {mode === 'register' && <Field id="name" label="Spielername" autoComplete="nickname" required minLength={3} maxLength={20} value={name} onChange={(e) => setName(e.target.value)} />}
        <Field id="password" label="Passwort" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="k-error" role="alert">{error}</p>}
        <Button type="submit" block disabled={busy}>{mode === 'register' ? 'Konto anlegen' : 'Anmelden'}</Button>
      </form>
    </div>
  );
}
