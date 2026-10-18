// Google sign-in through Neon Auth. The SDK is loaded only when someone signs in, so the game itself stays light.
// Neon Auth proves who came back from Google; right after that the server hands out Bilion's own session (account.ts),
// so nothing later depends on the auth server's cookies.

const AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL as string | undefined;

/** Sign-in is offered only when the build knows where Neon Auth lives. */
export const authEnabled = !!AUTH_URL;

/** The query parameter Neon Auth adds when Google sends the player back. */
const VERIFIER = 'neon_auth_session_verifier';

type Client = Awaited<ReturnType<typeof load>>;
let client: Promise<Client> | null = null;

async function load() {
  const { createAuthClient } = await import('@neondatabase/auth');
  return createAuthClient(AUTH_URL!);
}

function getClient() {
  client ??= load();
  return client;
}

/** Leaves for Google; the player comes back to the home page with a verifier in the address. */
export async function startGoogle() {
  const c = await getClient();
  const r = await c.signIn.social({ provider: 'google', callbackURL: `${location.origin}/?dang-nhap=1` });
  if (r && 'error' in r && r.error) throw new Error(r.error.message || 'Chưa mở được trang đăng nhập Google.');
}

/** True on the page load right after Google. */
export function backFromGoogle() {
  return new URLSearchParams(location.search).has(VERIFIER);
}

/** Trades the verifier for a short-lived token the server can check, then tidies the address. */
export async function finishGoogle(): Promise<string> {
  try {
    const c = await getClient();
    const r = await c.getSession();
    const token = (r as { data?: { session?: { token?: string } } | null }).data?.session?.token;
    if (!token) throw new Error('Không nhận được phiên đăng nhập từ Google. Thử lại nhé.');
    return token;
  } finally {
    const url = new URL(location.href);
    url.searchParams.delete(VERIFIER);
    url.searchParams.delete('dang-nhap');
    history.replaceState(null, '', url.pathname + (url.search === '?' ? '' : url.search) + url.hash);
  }
}

/** Ends the Neon Auth session too (Bilion's own session is ended by the server). */
export async function signOutGoogle() {
  if (!client) return;
  try {
    await (await client).signOut();
  } catch {
    /* already gone */
  }
}
