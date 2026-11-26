import type { Round } from './round.ts';
import { tickInfo } from './round.ts';

/**
 * Löst zu jeder Tick-Grenze aus. In v0.1-Schritt 1 nur ein Signal;
 * Flottenbewegung und Kämpfe hängen sich später hier an (eine Transaktion pro Tick).
 */
export function startTicker(round: Round, onTick: (tick: number) => void | Promise<void>) {
  let timer: NodeJS.Timeout;
  const schedule = () => {
    const { nextTickAt } = tickInfo(round);
    timer = setTimeout(async () => {
      const { tick } = tickInfo(round);
      try { await onTick(tick); } finally { schedule(); }
    }, Math.max(0, nextTickAt - Date.now()) + 50);
  };
  schedule();
  return () => clearTimeout(timer);
}
