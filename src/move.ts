// The game moved from tha-dieu-dusky.vercel.app to bilion-vn.vercel.app. Browser storage belongs to one address,
// so the old address hands its saved progress (player id, streak, collection) to the new one in the link.
const OLD = 'tha-dieu-dusky.vercel.app';
const NEW = 'https://bilion-vn.vercel.app';
const PREFIX = 'thadieu.';

const b64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const unb64 = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0)));

/** Returns true when the page is leaving for the new address. */
export function moveIfOld(): boolean {
  if (location.host !== OLD) return false;
  const data: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) data[k] = localStorage.getItem(k) ?? '';
    }
  } catch {
    /* storage blocked: move without it */
  }
  // Keep a challenge link or the admin path working after the move.
  const keep = location.hash && !location.hash.startsWith('#mig=') ? location.hash.slice(1) : '';
  const mig = Object.keys(data).length ? `mig=${encodeURIComponent(b64(JSON.stringify(data)))}` : '';
  const hash = [mig, keep ? `then=${encodeURIComponent(keep)}` : ''].filter(Boolean).join('&');
  location.replace(`${NEW}${location.pathname}${location.search}${hash ? '#' + hash : ''}`);
  return true;
}

/** On the new address: takes in progress handed over from the old one, without overwriting anything newer. */
export function takeMoved() {
  if (!location.hash.startsWith('#mig=') && !location.hash.startsWith('#then=')) return;
  const p = new URLSearchParams(location.hash.slice(1));
  try {
    const raw = p.get('mig');
    if (raw) {
      const data = JSON.parse(unb64(raw)) as Record<string, unknown>;
      for (const [k, v] of Object.entries(data)) {
        if (k.startsWith(PREFIX) && typeof v === 'string' && v.length < 200_000 && localStorage.getItem(k) == null) localStorage.setItem(k, v);
      }
    }
  } catch {
    /* a broken hand-over is ignored */
  }
  const then = p.get('then');
  history.replaceState(null, '', location.pathname + location.search + (then ? '#' + then : ''));
}
