// Vercel routes one path segment per dynamic file, so /api/admin/* needs its own entry; the router reads the full URL.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { route } from '../../server/router.js';

export const config = { maxDuration: 20 };

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return route(req, res);
}
