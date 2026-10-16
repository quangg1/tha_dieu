import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './giaydiep.css';
import './app.css';
import { watchErrors } from './track';
import { inject } from '@vercel/analytics';

watchErrors();
if (import.meta.env.PROD) inject();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
