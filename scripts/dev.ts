// Local development: the API on :8787 with an in-memory Postgres (unless DATABASE_URL is set), and Vite on :5173.
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { connect, pglite } from '../server/db.js';
import { route } from '../server/router.js';
import { setup } from '../server/service.js';
import type { Referee } from '../server/referee.js';
import { claudeReferee, nullReferee } from '../server/referee.js';

const db = process.env.DATABASE_URL ? await connect(process.env.DATABASE_URL) : await pglite();
await setup(db);

// Without an API key, a stand-in referee accepts answers that look like a real word so the flow can be tried offline.
const offlineReferee: Referee = async (_p, _n, input) =>
  /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(input)
    ? { valid: true, canonical: input.trim().replace(/^./, (c) => c.toLocaleUpperCase('vi')), reason: 'Trọng tài thử nghiệm.' }
    : { valid: false, canonical: '', reason: 'Trọng tài thử nghiệm không công nhận.' };
const referee = process.env.ANTHROPIC_API_KEY ? claudeReferee : process.env.OFFLINE_REFEREE ? offlineReferee : nullReferee;

createServer((req, res) => route(req, res, { db, referee })).listen(8787, () => {
  console.log('API sẵn sàng tại http://localhost:8787');
});

if (!process.argv.includes('--api-only')) {
  spawn('npx', ['vite', '--host'], { stdio: 'inherit', shell: true });
}
