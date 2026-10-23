import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Self-hosted fonts, only the Latin and Vietnamese subsets (latin-ext was never needed): no third-party round trips.
import '@fontsource/grandstander/latin-700.css';
import '@fontsource/grandstander/vietnamese-700.css';
import '@fontsource/grandstander/latin-800.css';
import '@fontsource/grandstander/vietnamese-800.css';
import '@fontsource/grandstander/latin-900.css';
import '@fontsource/grandstander/vietnamese-900.css';
import '@fontsource/be-vietnam-pro/latin-400.css';
import '@fontsource/be-vietnam-pro/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/latin-500.css';
import '@fontsource/be-vietnam-pro/vietnamese-500.css';
import '@fontsource/be-vietnam-pro/latin-600.css';
import '@fontsource/be-vietnam-pro/vietnamese-600.css';
import '@fontsource/be-vietnam-pro/latin-700.css';
import '@fontsource/be-vietnam-pro/vietnamese-700.css';
import './brand.css';
import './giaydiep.css';
import './app.css';
import { watchErrors } from './track';
import { inject } from '@vercel/analytics';
import { moveIfOld, takeMoved } from './move';

const leaving = moveIfOld();
if (!leaving) takeMoved();
watchErrors();
if (import.meta.env.PROD && !leaving) inject();

if (!leaving) createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
