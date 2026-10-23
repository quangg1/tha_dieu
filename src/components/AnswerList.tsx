import { useMemo, useState } from 'react';
import { TIERS } from '../../shared/scoring.js';
import { norm } from '../../shared/normalize.js';
import { TIER_COLOR } from '../icons';
import type { Reveal } from '../api';

/** Every answer the village knows for one prompt, by tier, with a box to find a particular one. */
export function AnswerList({ reveal }: { reveal: Reveal }) {
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<number | null>(null);
  const [q, setQ] = useState('');
  const list = reveal.list ?? [];
  const total = list.reduce((s, g) => s + g.names.length, 0);
  const shown = useMemo(() => {
    const needle = norm(q.trim());
    return list
      .filter((g) => tier == null || g.tier === tier)
      .map((g) => ({ tier: g.tier, names: needle ? g.names.filter((n) => norm(n).includes(needle)) : g.names }))
      .filter((g) => g.names.length);
  }, [list, tier, q]);
  if (!total) return null;
  const mine = reveal.mine ? norm(reveal.mine) : null;
  return (
    <div className="alist">
      <button className="alist-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? 'Ẩn danh sách' : `Xem cả ${total} đáp án`}
      </button>
      {open && (
        <div className="alist-body">
          <div className="alist-chips">
            <button className={`alist-chip${tier == null ? ' on' : ''}`} onClick={() => setTier(null)}>Tất cả {total}</button>
            {list.map((g) => (
              <button
                key={g.tier}
                className={`alist-chip${tier === g.tier ? ' on' : ''}`}
                style={{ color: TIER_COLOR[g.tier] }}
                onClick={() => setTier(tier === g.tier ? null : g.tier)}
              >
                {TIERS[g.tier].name} {g.names.length}
              </button>
            ))}
          </div>
          <input className="alist-search" type="search" placeholder="Tìm một đáp án…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Tìm đáp án" />
          <div className="alist-rows">
            {shown.length === 0 && <p className="alist-empty">Sổ làng chưa có đáp án này.</p>}
            {shown.map((g) => (
              <div key={g.tier} className="alist-group">
                <span className="alist-tier" style={{ color: TIER_COLOR[g.tier] }}>{TIERS[g.tier].name}</span>
                <span className="alist-names">
                  {g.names.map((n) => (
                    <span key={n} className={`alist-name${mine && norm(n) === mine ? ' mine' : ''}`}>{n}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
