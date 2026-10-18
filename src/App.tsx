import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { flute } from './audio/flute';
import { SkyScene } from './scene/sky';
import { prefs } from './store';
import { skinById } from './skins';
import { SoundIcon } from './ui';
import Home from './screens/Home';
import Game, { type Summary } from './screens/Game';
import Result from './screens/Result';
import { api } from './api';
import { backFromGoogle } from './auth';

// The admin page is its own chunk, opened only at the secret path the server confirms.
const Admin = lazy(() => import('./screens/Admin'));
// Sign-in is its own chunk too, with the auth SDK behind it.
const Account = lazy(() => import('./screens/Account'));

type Screen = { name: 'home' } | { name: 'play'; mode: 'daily' | 'night'; run: number } | { name: 'result'; summary: Summary } | { name: 'admin' } | { name: 'account' };

export default function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [sky, setSky] = useState<SkyScene | null>(null);
  // Coming back from Google opens the account page, which finishes the sign-in.
  const [screen, setScreen] = useState<Screen>(() => (backFromGoogle() ? { name: 'account' } : { name: 'home' }));

  // A long hash may be the secret admin path: the server checks it, nothing about it lives in this code.
  useEffect(() => {
    const check = () => {
      const s = location.hash.slice(1);
      if (s.length < 12) return;
      api
        .gate(s)
        .then((r) => r.ok && setScreen({ name: 'admin' }))
        .catch(() => {});
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);
  const [sound, setSound] = useState(prefs.sound);

  useEffect(() => {
    const s = new SkyScene(canvas.current!);
    s.setSkin(skinById(prefs.skin));
    setSky(s);
    if (import.meta.env.DEV) (window as unknown as { __sky: SkyScene }).__sky = s;
    return () => s.destroy();
  }, []);

  useEffect(() => {
    flute.setOn(sound);
    prefs.sound = sound;
  }, [sound]);

  // Browsers allow sound only after the first tap; the music starts then.
  useEffect(() => {
    // Phones count only the end of a tap (not the touch down) as permission to play, so listen to those too,
    // and keep listening: a tap the browser refused is followed by one it accepts.
    const events = ['pointerup', 'touchend', 'click', 'keydown'] as const;
    const wake = () => {
      flute.unlock();
      flute.start();
    };
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, wake));
  }, []);

  const soundButton = (
    <button className="icon-btn" onClick={() => setSound((v) => !v)} aria-label={sound ? 'Tắt nhạc sáo' : 'Bật nhạc sáo'} aria-pressed={sound}>
      <SoundIcon on={sound} />
    </button>
  );

  return (
    <>
      <canvas ref={canvas} className="sky" aria-hidden="true" />
      {screen.name === 'admin' && (
        <Suspense fallback={null}>
          <Admin onExit={() => { history.replaceState(null, '', location.pathname); setScreen({ name: 'home' }); }} />
        </Suspense>
      )}
      {screen.name === 'account' && (
        <Suspense fallback={null}>
          <Account soundButton={soundButton} onHome={() => setScreen({ name: 'home' })} />
        </Suspense>
      )}
      {sky && screen.name === 'home' && <Home sky={sky} soundButton={soundButton} onPlay={(mode) => setScreen({ name: 'play', mode, run: Date.now() })} onReview={(summary) => setScreen({ name: 'result', summary })} onAccount={() => setScreen({ name: 'account' })} />}
      {sky && screen.name === 'play' && (
        <Game key={screen.run} sky={sky} mode={screen.mode} soundButton={soundButton} onExit={() => setScreen({ name: 'home' })} onDone={(summary) => setScreen({ name: 'result', summary })} />
      )}
      {sky && screen.name === 'result' && (
        <Result sky={sky} summary={screen.summary} soundButton={soundButton} onHome={() => setScreen({ name: 'home' })} onNight={() => setScreen({ name: 'play', mode: 'night', run: Date.now() })} />
      )}
    </>
  );
}
