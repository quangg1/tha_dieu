// Tier emblems: a rounded tile in the tier's colour with a simple white glyph, the way games badge rarity
// (grey dot, one to three stars, a gem, a crown). Khôn lỏi gets a cheeky pink face; a miss gets a falling kite.
import { TIERS } from '../shared/scoring.js';

/** Tile colour of each tier, by tier index. */
export const TIER_COLOR = ['#94a69a', '#5fae5a', '#3a8fd8', '#8a5cd6', '#e5533d', '#f2b630', '#ec6f9e'];
const MISS = '#6b7280';
const W = '#ffffff';

const STAR = 'M0 -10 L2.9 -3.6 L9.5 -3.1 L4.5 1.3 L5.9 8.1 L0 4.5 L-5.9 8.1 L-4.5 1.3 L-9.5 -3.1 L-2.9 -3.6 Z';

function Stars({ n }: { n: number }) {
  const xs = n === 1 ? [32] : n === 2 ? [22, 42] : [16, 32, 48];
  const k = n === 1 ? 1.9 : n === 2 ? 1.35 : 1.1;
  return (
    <g fill={W}>
      {xs.map((x, i) => (
        <path key={i} d={STAR} transform={`translate(${x} ${n === 3 && i === 1 ? 28 : 32}) scale(${k})`} />
      ))}
    </g>
  );
}

function Dot() {
  return <circle cx="32" cy="32" r="9" fill={W} />;
}

function Gem() {
  return (
    <g>
      <path d="M20 22 L28 14 L36 14 L44 22 L32 48 Z" fill={W} />
      <path d="M20 22 L44 22 M28 14 L26 22 L32 48 L38 22 L36 14" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="2" />
    </g>
  );
}

function Crown() {
  return (
    <g fill={W}>
      <path d="M14 42 L12 20 L23 30 L32 14 L41 30 L52 20 L50 42 Z" />
      <rect x="14" y="44" width="36" height="6" rx="2" />
      <circle cx="12" cy="19" r="3" />
      <circle cx="32" cy="13" r="3" />
      <circle cx="52" cy="19" r="3" />
    </g>
  );
}

function Grin() {
  return (
    <g>
      <circle cx="32" cy="34" r="17" fill={W} />
      <path d="M32 17 C 28 13, 30 8, 35 9 C 33 12, 36 14, 35 17 Z" fill={W} />
      <path d="M23 31 q 3.5 -4 7 0 M34 31 q 3.5 -4 7 0" fill="none" stroke="#2b2420" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M23 38 C 25 47, 39 47, 41 38 Z" fill="#c0392b" />
      <circle cx="21" cy="38" r="3" fill="#ec6f9e" opacity=".6" />
      <circle cx="43" cy="38" r="3" fill="#ec6f9e" opacity=".6" />
    </g>
  );
}

function Fall() {
  return (
    <g>
      <g transform="rotate(40 32 30)">
        <path d="M32 10 C 43 16, 45 31, 32 47 C 19 31, 21 16, 32 10 Z" fill={W} />
        <path d="M32 10 L 32 47 M21 26 Q 32 21 43 26" fill="none" stroke="rgba(0,0,0,.2)" strokeWidth="2" />
      </g>
      <path d="M18 48 l 4 4 M26 54 l 3 5" stroke={W} strokeWidth="2.4" strokeLinecap="round" opacity=".7" />
    </g>
  );
}

const GLYPH = [Dot, () => <Stars n={1} />, () => <Stars n={2} />, () => <Stars n={3} />, Gem, Crown, Grin];

export function TierIcon({ tier, size = 56, className = '' }: { tier: number | null; size?: number; className?: string }) {
  const miss = tier === null || tier < 0;
  const G = miss ? Fall : GLYPH[tier];
  const col = miss ? MISS : TIER_COLOR[tier];
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={miss ? 'Diều không lên' : TIERS[tier].name}>
      <rect x="2" y="4" width="60" height="58" rx="16" fill="rgba(10,20,40,.22)" />
      <rect x="2" y="2" width="60" height="58" rx="16" fill={col} />
      <path d="M2 18 C 2 9, 9 2, 18 2 L 46 2 C 55 2, 62 9, 62 18 L 62 22 C 44 14, 20 14, 2 22 Z" fill="rgba(255,255,255,.16)" />
      <G />
    </svg>
  );
}
