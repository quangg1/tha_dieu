import { useEffect, useRef, useState } from 'react';
import { flute } from './audio/flute';
import { SkyScene } from './scene/sky';
import { prefs } from './store';
import { SoundIcon } from './ui';
import Home from './screens/Home';
import Game, { type Summary } from './screens/Game';
import Result from './screens/Result';
import Admin from './screens/Admin';

type Screen = { name: 'home' } | { name: 'play'; mode: 'daily' | 'night'; run: number } | { name: 'result'; summary: Summary } | { name: 'admin' };

export default function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [sky, setSky] = useState<SkyScene | null>(null);
  const [screen, setScreen] = useState<Screen>(() => (location.hash === '#admin' ? { name: 'admin' } : { name: 'home' }));
  const [sound, setSound] = useState(prefs.sound);

  useEffect(() => {
    const s = new SkyScene(canvas.current!);
    setSky(s);
    return () => s.destroy();
  }, []);

  useEffect(() => {
    flute.setOn(sound);
    prefs.sound = sound;
  }, [sound]);

  // Browsers allow sound only after the first tap; the music starts then.
  useEffect(() => {
    const wake = () => {
      flute.unlock();
      flute.start();
    };
    window.addEventListener('pointerdown', wake, { once: true });
    window.addEventListener('keydown', wake, { once: true });
    return () => {
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('keydown', wake);
    };
  }, []);

  const soundButton = (
    <button className="icon-btn" onClick={() => setSound((v) => !v)} aria-label={sound ? 'Tắt nhạc sáo' : 'Bật nhạc sáo'} aria-pressed={sound}>
      <SoundIcon on={sound} />
    </button>
  );

  return (
    <>
      <canvas ref={canvas} className="sky" aria-hidden="true" />
      {screen.name === 'admin' && <Admin onExit={() => { location.hash = ''; setScreen({ name: 'home' }); }} />}
      {sky && screen.name === 'home' && <Home sky={sky} soundButton={soundButton} onPlay={(mode) => setScreen({ name: 'play', mode, run: Date.now() })} onReview={(summary) => setScreen({ name: 'result', summary })} />}
      {sky && screen.name === 'play' && (
        <Game key={screen.run} sky={sky} mode={screen.mode} soundButton={soundButton} onExit={() => setScreen({ name: 'home' })} onDone={(summary) => setScreen({ name: 'result', summary })} />
      )}
      {sky && screen.name === 'result' && (
        <Result sky={sky} summary={screen.summary} soundButton={soundButton} onHome={() => setScreen({ name: 'home' })} onNight={() => setScreen({ name: 'play', mode: 'night', run: Date.now() })} />
      )}
    </>
  );
}
