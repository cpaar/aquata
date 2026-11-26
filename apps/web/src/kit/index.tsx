import { useEffect, useState, type ReactNode, type ButtonHTMLAttributes } from 'react';
import type { Resource } from '@aquata/rules';
import { Icon, type IconName } from './icons';
import './kit.css';

export { Icon, type IconName };

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

/* ---------- Typografie ---------- */
export const Eyebrow = ({ children }: { children: ReactNode }) => <span className="k-eyebrow">{children}</span>;
export const Heading = ({ level = 2, children }: { level?: 1 | 2 | 3; children: ReactNode }) => {
  const Tag = `h${level}` as const;
  return <Tag className={`k-h${level}`}>{children}</Tag>;
};

/* ---------- Kiesel-Paneel ---------- */
export function Panel({ title, aside, tone, raised, children }: { title?: ReactNode; aside?: ReactNode; tone?: 'danger'; raised?: boolean; children?: ReactNode }) {
  return (
    <section className={cx('k-panel', raised && 'k-panel--raised', tone === 'danger' && 'k-panel--danger')}>
      {(title || aside) && (
        <div className="k-panel__head">
          {title ? <h3 className="k-h3">{title}</h3> : <span />}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

/* ---------- Knopf ---------- */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'outline' | 'danger'; block?: boolean; icon?: IconName };
export function Button({ variant = 'solid', block, icon, children, className, disabled, ...rest }: ButtonProps) {
  return (
    <button className={cx('k-btn', `k-btn--${variant}`, block && 'k-btn--block', className)} aria-disabled={disabled || undefined} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

/* ---------- Kennzeichen ---------- */
export const Tag = ({ tone, children }: { tone?: 'amber' | 'rust' | 'petrol'; children: ReactNode }) => (
  <span className={cx('k-tag', tone && `k-tag--${tone}`)}>{children}</span>
);

/* ---------- Fortschritt ---------- */
export const Progress = ({ value, tone = 'amber', label }: { value: number; tone?: 'amber' | 'petrol'; label: string }) => (
  <div className={cx('k-progress', tone === 'petrol' && 'k-progress--petrol')} role="progressbar" aria-label={label} aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
    <i style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
  </div>
);

/* ---------- Rohstoffe ---------- */
const RES_LABEL: Record<Resource, string> = { alu: 'Alu', stahl: 'Stahl', pu: 'Pu' };
export const fmt = (n: number) => Math.floor(n).toLocaleString('de-DE');
export function Resources({ values, rates }: { values: Record<Resource, number>; rates?: Record<Resource, number> }) {
  return (
    <div className="k-res" aria-label="Rohstoffe">
      {(Object.keys(RES_LABEL) as Resource[]).map((r) => (
        <span className="k-res__item" key={r} title={RES_LABEL[r]}>
          <i className="k-res__dot" style={{ background: `var(--${r})` }} />
          <span>{fmt(values[r])}</span>
          {rates && <span className="k-res__rate">+{fmt(rates[r])}/h</span>}
        </span>
      ))}
    </div>
  );
}

/* ---------- Tick-Uhr ---------- */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export function TickClock({ nextTickAt, tickSeconds, tick }: { nextTickAt: number; tickSeconds: number; tick?: number }) {
  const now = useNow();
  const left = Math.max(0, nextTickAt - now);
  const frac = 1 - left / (tickSeconds * 1000);
  const m = Math.floor(left / 60000);
  const s = Math.floor(left / 1000) % 60;
  const h = Math.floor(m / 60);
  const text = h > 0 ? `${h}:${String(m % 60).padStart(2, '0')} h` : `${m}:${String(s).padStart(2, '0')}`;
  const r = 11, c = 2 * Math.PI * r;
  return (
    <div className={cx('k-tick', left < 1500 && 'k-tick--pulse')} role="timer" aria-label={`Nächster Tick in ${text}`}>
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="14" cy="14" r={r} fill="none" stroke="rgba(217,160,74,.2)" strokeWidth="2" />
        <circle cx="14" cy="14" r={r} fill="none" stroke="var(--amber)" strokeWidth="2" strokeDasharray={`${c * frac} ${c}`} transform="rotate(-90 14 14)" strokeLinecap="round" />
      </svg>
      <span>
        <b>{text}</b>
        <small>{tick !== undefined ? `bis Tick ${tick + 1}` : 'nächster Tick'}</small>
      </span>
    </div>
  );
}

/* ---------- Listenzeile ---------- */
export function Row({ icon, title, sub, trailing, tone, onClick }: { icon: IconName; title: ReactNode; sub?: ReactNode; trailing?: ReactNode; tone?: 'rust' | 'amber'; onClick?: () => void }) {
  const inner = (
    <>
      <span className="k-row__icon"><Icon name={icon} /></span>
      <span style={{ minWidth: 0 }}>
        <span className="k-row__title" style={{ display: 'block' }}>{title}</span>
        {sub && <span className="k-row__sub">{sub}</span>}
      </span>
      {trailing ?? <span />}
    </>
  );
  return onClick ? (
    <button className={cx('k-row', tone && `k-row--${tone}`)} onClick={onClick}>{inner}</button>
  ) : (
    <div className={cx('k-row', tone && `k-row--${tone}`)}>{inner}</div>
  );
}

/* ---------- Alarm-Streifen ---------- */
export const AlarmStrip = ({ title, children }: { title: string; children?: ReactNode }) => (
  <div className="k-alarm" role="alert">
    <span className="k-alarm__dot" />
    <b>{title}</b>
    <span style={{ opacity: 0.9 }}>{children}</span>
  </div>
);

/* ---------- Gezeitenleiste ---------- */
export interface TideEvent { tick: number; label: string; tone: 'petrol' | 'amber' | 'rust' }
export function TideBar({ currentTick, progress, events, span = 8 }: { currentTick: number; progress: number; events: TideEvent[]; span?: number }) {
  const pos = (t: number) => `${((t - currentTick) / span) * 100}%`;
  return (
    <div className="k-tide" aria-label="Gezeitenleiste: die nächsten Ticks">
      <div className="k-tide__track">
        <div className="k-tide__line" />
        {Array.from({ length: span + 1 }, (_, i) => (
          <span key={i}>
            <span className="k-tide__tick" style={{ left: pos(currentTick + i) }} />
            {i > 0 && i % 2 === 0 && <span className="k-tide__label" style={{ left: pos(currentTick + i) }}>+{i}</span>}
          </span>
        ))}
        <span className="k-tide__now" style={{ left: pos(currentTick + progress) }} title="jetzt" />
        {events.filter((e) => e.tick > currentTick && e.tick <= currentTick + span).map((e, i) => (
          <span className="k-tide__ev" key={i} style={{ left: pos(e.tick) }}>
            <span style={{ color: `var(--${e.tone})`, top: i % 2 ? 40 : 0 }}>{e.label}</span>
            <i style={{ background: `var(--${e.tone})` }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Stationsbild mit Deck ---------- */
export function Hero({ stage, height = 300, children }: { stage: 1 | 2 | 3 | 4 | 5; height?: number; children?: ReactNode }) {
  return (
    <div className="k-hero" style={{ height }}>
      <img src={`/station/stufe-${stage}.jpg`} alt={`Deine Station, Ausbaustufe ${stage}`} />
      {children}
    </div>
  );
}
export const Deck = ({ children, overlap = 40 }: { children: ReactNode; overlap?: number }) => (
  <div className="k-deck" style={{ marginTop: -overlap }}>{children}</div>
);

/* ---------- Blatt von unten ---------- */
export function Sheet({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <>
      <div className="k-sheet-scrim" onClick={onClose} />
      <div className="k-sheet" role="dialog" aria-modal="true" aria-label={label}>
        <div className="k-sheet__grip" />
        {children}
      </div>
    </>
  );
}

/* ---------- Navigationsleiste ---------- */
export interface NavItem { id: string; label: string; icon: IconName; badge?: boolean }
export function NavBar({ items, current, onSelect }: { items: NavItem[]; current: string; onSelect: (id: string) => void }) {
  return (
    <nav className="k-nav" aria-label="Hauptnavigation">
      {items.map((it) => (
        <button key={it.id} className="k-nav__item" aria-current={it.id === current ? 'page' : undefined} onClick={() => onSelect(it.id)}>
          <Icon name={it.icon} />
          {it.label}
          {it.badge && <span className="k-nav__badge" aria-label="neu" />}
        </button>
      ))}
    </nav>
  );
}
