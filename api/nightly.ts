// The night shift has its own function: it may take a minute while the AI judges and fills tomorrow's book.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { route } from '../server/router.js';

export const config = { maxDuration: 60 };

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return route(req, res);
}
