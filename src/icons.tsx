// Tier emblems: a rounded tile in the tier's colour with a simple white glyph, the way games badge rarity
// (grey, green, blue, purple, red, gold). Khôn lỏi gets a cheeky pink face; a miss gets a falling kite.
import { TIERS } from '../shared/scoring.js';

/** Tile colour of each tier, by tier index. */
export const TIER_COLOR = ['#94a69a', '#5fae5a', '#3a8fd8', '#8a5cd6', '#e5533d', '#f2b630', '#ec6f9e'];
const MISS = '#6b7280';
const W = '#ffffff';

function Grass() {
  return (
    <g fill={W}>
      <path d="M32 50 C 30 40, 26 32, 18 26 C 26 28, 32 36, 34 50 Z" />
      <path d="M32 50 C 33 38, 36 28, 44 20 C 40 30, 37 40, 36 50 Z" />
      <path d="M28 50 C 24 44, 18 42, 13 42 C 20 40, 26 43, 31 50 Z" />
      <path d="M36 50 C 40 44, 46 42, 51 42 C 44 40, 38 43, 34 50 Z" />
      {[[18, 24], [21, 21], [44, 18], [41, 15]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={2.6} ry={3.8} transform={`rotate(${x < 32 ? 35 : -35} ${x} ${y})`} />)}
    </g>
  );
}

function Bamboo() {
  return (
    <g fill={W}>
      <rect x="22" y="14" width="7" height="38" rx="3" />
      <rect x="35" y="20" width="7" height="32" rx="3" />
      <g fill="rgba(0,0,0,.18)">
        <rect x="22" y="26" width="7" height="2.4" />
        <rect x="22" y="39" width="7" height="2.4" />
        <rect x="35" y="32" width="7" height="2.4" />
        <rect x="35" y="44" width="7" height="2.4" />
      </g>
      <path d="M29 22 C 36 16, 44 16, 50 19 C 44 23, 36 24, 29 22 Z" />
      <path d="M22 18 C 16 14, 10 14, 7 17 C 11 20, 17 20, 22 18 Z" />
      <path d="M42 30 C 48 27, 54 28, 57 31 C 52 33, 46 33, 42 30 Z" />
    </g>
  );
}

function Bird() {
  return (
    <g fill={W}>
      <path d="M8 26 C 18 26, 26 30, 31 36 L 35 36 C 40 28, 48 20, 58 18 C 50 28, 44 36, 38 42 L 28 42 C 22 36, 14 30, 8 26 Z" />
      <path d="M38 40 C 44 39, 48 36, 50 33 L 58 34 L 50 36 C 48 40, 44 42, 38 43 Z" />
    </g>
  );
}

function Balloon() {
  return (
    <g>
      <path d="M32 9 C 46 9, 52 20, 51 28 C 50 37, 40 44, 37 48 L 27 48 C 24 44, 14 37, 13 28 C 12 20, 18 9, 32 9 Z" fill={W} />
      <path d="M32 9 C 26 18, 25 36, 28 48 L 36 48 C 39 36, 38 18, 32 9 Z" fill="rgba(0,0,0,.14)" />
      <rect x="27" y="51" width="10" height="6" rx="1.5" fill={W} />
    </g>
  );
}

function Cloud() {
  return <path d="M15 44 C 8 44, 7 33, 15 32 C 15 22, 28 19, 32 26 C 36 17, 52 19, 50 31 C 58 31, 59 44, 50 44 Z" fill={W} />;
}

function Moon() {
  return (
    <g>
      <circle cx="32" cy="32" r="19" fill="#fff8dc" />
      <g fill="rgba(176,128,46,.55)">
        <circle cx="32" cy="27" r="6.5" />
        <circle cx="26" cy="30" r="5" />
        <circle cx="38" cy="30" r="5" />
        <path d="M30.5 32 L 29.6 44 L 34.4 44 L 33.5 32 Z" />
        <ellipse cx="32" cy="45" rx="12" ry="3" />
      </g>
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

const GLYPH = [Grass, Bamboo, Bird, Balloon, Cloud, Moon, Grin];

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
