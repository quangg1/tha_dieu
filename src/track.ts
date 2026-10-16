// Small first-party analytics: a handful of named steps (open, start, finish, share…) and browser errors,
// sent to our own API so the village head can see where players drop off. No third-party trackers.
import { playerId } from './store';

let errors = 0;

export function track(name: string, props?: Record<string, unknown>) {
  try {
    const body = JSON.stringify({ name, playerId: playerId(), props });
    const blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon?.('/api/event', blob)) return;
    fetch('/api/event', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
  } catch {
    /* analytics never breaks the game */
  }
}

/** Reports uncaught errors, at most a few per visit. */
export function watchErrors() {
  const send = (m: string, src?: string) => {
    if (errors++ >= 5) return;
    track('error', { m: m.slice(0, 200), src: src?.slice(0, 120), ua: navigator.userAgent.slice(0, 120), path: location.pathname + location.hash });
  };
  window.addEventListener('error', (e) => send(e.message || 'error', `${e.filename}:${e.lineno}`));
  window.addEventListener('unhandledrejection', (e) => send(String((e.reason as Error)?.message ?? e.reason ?? 'rejection')));
}
