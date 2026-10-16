// Small first-party analytics: a handful of named steps (open, start, finish, share…) and browser errors,
// sent to our own API so the village head can see where players drop off. No third-party trackers.
import { playerId } from './store';

let errors = 0;

// Events wait in a small queue and go out together: when the page is hidden, every 20 seconds, or at ten.
let queue: { name: string; props?: Record<string, unknown> }[] = [];
let timer: number | null = null;

function flush() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (!queue.length) return;
  const events = queue.slice(0, 20);
  queue = queue.slice(20);
  try {
    const body = JSON.stringify({ playerId: playerId(), events });
    const blob = new Blob([body], { type: 'application/json' });
    if (!navigator.sendBeacon?.('/api/event', blob)) {
      fetch('/api/event', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
    }
  } catch {
    /* analytics never breaks the game */
  }
  if (queue.length) flush();
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flush());
  window.addEventListener('pagehide', flush);
}

export function track(name: string, props?: Record<string, unknown>) {
  queue.push({ name, props });
  if (queue.length >= 10) flush();
  else timer ??= window.setTimeout(flush, 20_000);
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
