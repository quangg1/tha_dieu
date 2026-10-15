import type { ReactNode } from 'react';
import { TIERS, type Milestone } from '../shared/scoring.js';
import type { Crowd } from './api';

export function Seal({ tier, small, strike, extra, className = '' }: { tier: number; small?: boolean; strike?: boolean; extra?: string; className?: string }) {
  const t = TIERS[tier];
  return (
    <span className={`gd-seal gd-seal--${t.css}${small ? ' gd-seal--small' : ''}${strike ? ' gd-seal--strike' : ''} ${className}`} aria-label={`Hạng ${t.name}`}>
      {t.name}
      {!small && <small>{extra ?? `+${t.points}`}</small>}
    </span>
  );
}

export function MissBox() {
  return (
    <span className="miss-box" aria-label="Hết gió">
      hết
      <br />
      gió
    </span>
  );
}

export function Wind({ left, total }: { left: number; total: number }) {
  const pct = Math.max(0, Math.min(100, (left / total) * 100));
  const low = left <= 5;
  return (
    <div className={`gd-wind${low ? ' gd-wind--low' : ''}`} role="timer" aria-label={`Còn ${Math.ceil(left)} giây gió`}>
      <span className="gd-label">Gió</span>
      <div className="gd-wind__track">
        <div className="gd-wind__ribbon" style={{ width: `${pct}%` }} />
      </div>
      <span className="gd-wind__time" style={low ? { color: 'var(--son-dark)' } : undefined}>
        {Math.max(0, Math.ceil(left))}s
      </span>
    </div>
  );
}

export function CrowdBars({ crowd, mine }: { crowd: Crowd; mine: string | null }) {
  if (crowd.estimated) {
    return (
      <p className="gd-msg" style={{ margin: 0 }}>
        Mới có {crowd.total.toLocaleString('vi-VN')} người trả lời câu này, nên độ hiếm đang được ước tính. Càng nhiều người chơi, con số càng chính xác.
      </p>
    );
  }
  const max = Math.max(...crowd.top.map((t) => t.pct), crowd.mine, 1);
  const rows = crowd.top.filter((t) => !t.mine);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="gd-label">{crowd.total.toLocaleString('vi-VN')} người đã trả lời câu này</span>
      <div className="gd-crowd">
        {rows.slice(0, 4).map((r) => (
          <CrowdRow key={r.display} label={r.display} pct={r.pct} max={max} />
        ))}
        {mine && <CrowdRow label={`${mine} · bạn`} pct={crowd.mine} max={max} me />}
      </div>
    </div>
  );
}

function CrowdRow({ label, pct, max, me }: { label: string; pct: number; max: number; me?: boolean }) {
  return (
    <>
      <span className={me ? 'gd-crowd__me' : undefined}>{label}</span>
      <div className="gd-crowd__bar">
        <div className="gd-crowd__fill" style={{ width: `${Math.max(me ? 4 : 2, (pct / max) * 100)}%` }} />
      </div>
      <span className="gd-crowd__pct">{pct.toLocaleString('vi-VN')}%</span>
    </>
  );
}

export function MilestoneBanner({ m, alt, dark }: { m: Milestone; alt: string; dark: boolean }) {
  return (
    <div className={`banner gd-paper gd-milestone${dark ? ' gd-paper--dark' : ''}`} role="status">
      <div className="gd-milestone__art" style={dark ? { background: 'var(--trang)' } : undefined}>
        <MilestoneIcon kind={m.kind} />
      </div>
      <div>
        <div className="gd-milestone__k" style={dark ? { color: 'var(--trang)' } : undefined}>
          Vượt mốc · {alt}
        </div>
        <div className="gd-milestone__t">{m.name}</div>
        {m.note && <div style={{ fontSize: 13 }}>{m.note}</div>}
      </div>
    </div>
  );
}

function MilestoneIcon({ kind }: { kind: Milestone['kind'] }) {
  const ink = { stroke: 'var(--than)', strokeWidth: 2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  const shapes: Partial<Record<Milestone['kind'], ReactNode>> = {
    mountain: <path d="M2 26 L12 8 L17 15 L22 3 L32 26 Z" fill="var(--la)" {...ink} />,
    cloud: <rect x="3" y="11" width="28" height="12" rx="6" fill="var(--diep-100)" {...ink} />,
    plane: <path d="M2 17 L28 15 C 33 15, 33 19, 28 19 L2 18 Z M14 16 L8 6 L12 6 L20 16 Z M14 18 L8 28 L12 28 L20 18 Z" fill="var(--diep-100)" {...ink} />,
    moon: <><circle cx="17" cy="17" r="13" fill="var(--diep-100)" {...ink} /><path d="M15 26 L15 17 M9 18 C 9 11, 23 11, 23 18 Z" fill="var(--la)" {...ink} /></>,
    planet: <circle cx="17" cy="17" r="11" fill="var(--son)" {...ink} />,
    stork: <path d="M4 16 Q 10 10 17 16 Q 24 10 30 16" fill="none" {...ink} />,
    bamboo: <path d="M10 30 L10 4 M18 30 L18 8 M26 30 L26 6 M6 12 L10 9 M22 14 L18 11" fill="none" {...ink} />,
  };
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      {shapes[kind] ?? <circle cx="17" cy="17" r="9" fill="var(--trang)" {...ink} />}
    </svg>
  );
}

export function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      {on ? (
        <>
          <path d="M16.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19.5 5.5a9 9 0 0 1 0 13" />
        </>
      ) : (
        <path d="M17 9l5 6M22 9l-5 6" />
      )}
    </svg>
  );
}

export function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}
