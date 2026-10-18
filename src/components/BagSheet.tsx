// The collection: kites unlocked (pick the one that flies), sky layers reached and the hidden answers found.
import { type CSSProperties, useState } from 'react';
import { MILESTONES } from '../../shared/scoring.js';
import type { SkyScene } from '../scene/sky';
import { SKINS, needLabel, progress, skinById, unlocked } from '../skins';
import { previewSvg } from '../kites';
import { CloseIcon } from '../glyphs';
import { album, krillFound, prefs, stats } from '../store';

/** Pictures of every kite for the collection, built once. */
export const KITE_PICS: Record<string, string> = Object.fromEntries(SKINS.map((k) => [k.id, 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(previewSvg(k.id))]));
const KITE_HERO: Record<string, string> = Object.fromEntries(SKINS.map((k) => [k.id, 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(previewSvg(k.id, { flutes: true }))]));

export function BagSheet({ sky, onClose }: { sky?: SkyScene | null; onClose: () => void }) {
  const [skin, setSkin] = useState(prefs.skin);
  const st = stats();
  const setSkinAll = (id: string) => {
    setSkin(id);
    sky?.setSkin(skinById(id));
  };
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Bộ sưu tập" onClick={onClose}>
          <section className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <h2>Bộ sưu tập</h2>
              <button className="sheet-x" onClick={onClose} aria-label="Đóng">
                <CloseIcon />
              </button>
            </div>
            {(() => {
              const me = { best: Math.max(st.best, st.nightBest), krill: krillFound(), streak: st.streak };
              const cur = skinById(skin);
              const owned = SKINS.filter((k) => unlocked(k, me)).length;
              const pick = (id: string) => {
                prefs.skin = id;
                setSkinAll(id);
              };
              const card = (k: (typeof SKINS)[number]) => {
                const open = unlocked(k, me);
                const on = skin === k.id;
                const pr = open ? null : progress(k, me);
                return (
                  <button
                    key={k.id}
                    className={`kc${on ? ' on' : ''}${open ? '' : ' locked'}${k.prize ? ' prize' : ''}`}
                    style={{ '--s1': k.sky[0], '--s2': k.sky[1] } as CSSProperties}
                    disabled={!open || on}
                    aria-pressed={on}
                    onClick={() => pick(k.id)}
                  >
                    <span className="kc-win" aria-hidden="true">
                      <img src={KITE_PICS[k.id]} alt="" />
                      {!open && (
                        <i className="kc-lock">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
                        </i>
                      )}
                      {on && <i className="kc-flag">Đang bay</i>}
                    </span>
                    <span className="kc-body">
                      <b>{k.name}</b>
                      {k.prize && <span className="kc-story">{k.story}</span>}
                      {open ? (
                        <small>{on ? 'Đang dùng' : 'Chạm để thả'}</small>
                      ) : (
                        <>
                          <small>{needLabel(k)}</small>
                          {pr && (
                            <span className="kc-bar" role="progressbar" aria-valuenow={Math.round(pr.f * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`Tiến độ: ${pr.text}`}>
                              <span style={{ width: `${Math.max(4, pr.f * 100)}%` }} />
                            </span>
                          )}
                          {pr && <small className="kc-num">{pr.text}</small>}
                        </>
                      )}
                    </span>
                  </button>
                );
              };
              return (
                <>
                  <div className="kc-hero" style={{ '--s1': cur.sky[0], '--s2': cur.sky[1] } as CSSProperties}>
                    <div className="kc-hero-art" aria-hidden="true">
                      <img src={KITE_HERO[cur.id]} alt="" />
                    </div>
                    <div className="kc-hero-txt">
                      <span className="kc-k">Đang bay</span>
                      <b>{cur.name}</b>
                      <p>{cur.story}</p>
                      <span className="kc-count">
                        <em>{owned}</em>/{SKINS.length} cánh diều đã mở
                      </span>
                    </div>
                  </div>
                  <div className="kc-sec">
                    <span className="card-k">Cánh diều</span>
                    <small>{SKINS.filter((k) => !k.prize && unlocked(k, me)).length}/{SKINS.filter((k) => !k.prize).length}</small>
                  </div>
                  <div className="kcs">{SKINS.filter((k) => !k.prize).map(card)}</div>
                  <div className="kc-sec gold">
                    <span className="card-k">Diều báu</span>
                    <small>Thưởng cho những chuyến bay xa nhất</small>
                  </div>
                  <div className="kcs wide">{SKINS.filter((k) => k.prize).map(card)}</div>
                </>
              );
            })()}
            <div className="card-k" style={{ margin: '16px 0 8px' }}>Tầng trời đã chạm</div>
            <div className="layers">
              {MILESTONES.filter((m) => m.alt > 0).map((m) => (
                <span key={m.name} className={Math.max(st.best, st.nightBest) >= m.alt ? 'on' : ''}>
                  {m.name}
                </span>
              ))}
            </div>
            <div className="card-k" style={{ margin: '16px 0 8px' }}>Đáp án độc nhất: đã tìm ra {krillFound()}</div>
            <div className="album">
              {Object.values(album()).length === 0 && <p className="row-q">Đáp án độc nhất của mỗi ngày mở lúc nửa đêm, sau khi cả làng đã bay xong.</p>}
              {Object.values(album())
                .sort((a, b) => (a.day < b.day ? 1 : -1))
                .slice(0, 60)
                .map((e) => (
                  <div key={e.day + e.prompt} className={`album-row${e.found ? ' found' : ''}`}>
                    <span>{e.prompt}</span>
                    <b>{e.krill}</b>
                  </div>
                ))}
            </div>
          </section>
        </div>
        );
}
