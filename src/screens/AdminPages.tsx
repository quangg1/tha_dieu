import { Fragment, useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const dm = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;
const num = (n: number) => n.toLocaleString('vi-VN');

type Bank = Awaited<ReturnType<typeof api.admin.bank>>;
type Item = Bank['items'][number];

/** Bars for a list of counts. */
function Bars({ rows, color = '#3a8fd8' }: { rows: { name: string; n: number }[]; color?: string }) {
  const peak = Math.max(1, ...rows.map((r) => r.n));
  return (
    <div>
      {rows.map((r) => (
        <div key={r.name} className="adm-spread">
          <span>{r.name}</span>
          <span className="adm-bar" style={{ width: `${(r.n / peak) * 100}%`, background: color }} />
          <b>{r.n}</b>
        </div>
      ))}
    </div>
  );
}

/** The question bank: what it holds, how long it lasts, what expires, and how each prompt plays. */
export function BankPage({ token }: { token: string }) {
  const [b, setB] = useState<Bank | null>(null);
  const [msg, setMsg] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'miss' | 'plays' | 'avg' | 'krill'>('miss');
  const [only, setOnly] = useState<'all' | 'played' | 'paused' | 'unseen'>('played');
  const load = () => api.admin.bank(token).then(setB).catch((e) => setMsg(e instanceof Error ? e.message : 'Chưa tải được.'));
  useEffect(() => void load(), [token]);
  const rows = useMemo(() => {
    if (!b) return [] as Item[];
    const needle = q.trim().toLowerCase();
    const missRate = (i: Item) => (i.plays + i.misses >= 10 ? i.misses / (i.plays + i.misses) : -1);
    return b.items
      .filter((i) => i.active || i.paused)
      .filter((i) => (only === 'played' ? i.plays + i.misses > 0 : only === 'paused' ? i.paused : only === 'unseen' ? !i.seen && i.active : true))
      .filter((i) => !needle || i.prompt.toLowerCase().includes(needle) || i.category.toLowerCase().includes(needle) || i.id.includes(needle))
      .sort((x, y) => (sort === 'miss' ? missRate(y) - missRate(x) : sort === 'plays' ? y.plays - x.plays : sort === 'avg' ? y.avg - x.avg : y.krill - x.krill))
      .slice(0, 80);
  }, [b, q, sort, only]);
  const pause = async (i: Item, paused: boolean) => {
    try {
      await api.admin.pause(token, i.id, paused);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Chưa lưu được.');
    }
  };
  if (!b) return <section className="gd-paper">{msg ? <p className="gd-msg gd-msg--hint" style={{ margin: 0 }}>{msg}</p> : <p className="gd-msg" style={{ margin: 0 }}>Đang tải…</p>}</section>;
  const t = b.totals;
  const tiles: [string | number, string, string?][] = [
    [t.live, 'câu đang chơi được', `${t.book} trong sổ · ${t.retired} đã nghỉ`],
    [t.unseen, 'câu chưa lên chuyến nào', `đủ ~${t.daysLeft} ngày chưa lặp`],
    [b.pop, 'câu đại chúng', 'dành cho chỗ 2 và 5'],
    [b.timely.length, 'câu thời sự còn hạn'],
    [t.paused, 'câu đang tạm dừng'],
  ];
  return (
    <>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 8 }}>Kiểm kê kho câu hỏi</div>
        <div className="adm-tiles">
          {tiles.map(([v, l, sub]) => (
            <div key={l}>
              <b>{v}</b>
              <span>{l}</span>
              {sub && <em>{sub}</em>}
            </div>
          ))}
        </div>
        {t.daysLeft < 30 && <p className="gd-msg gd-msg--hint" style={{ margin: '10px 0 0' }}>Kho chỉ còn đủ khoảng {t.daysLeft} ngày chưa lặp: cần giao thêm câu mới cho Kiro.</p>}
        {msg && <p className="gd-msg gd-msg--hint">{msg}</p>}
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 8 }}>Theo chủ đề</div>
        <Bars rows={b.byCategory} />
        <div className="gd-label" style={{ margin: '14px 0 8px' }}>Theo mức khó</div>
        <Bars rows={b.byLevel} color="#8a5cd6" />
        <p className="gd-msg" style={{ margin: '8px 0 0' }}>Câu khó là câu hiếm nhất kho; thiếu câu khó thì chỗ 5 và 7 của ngày phải dùng câu vừa.</p>
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 8 }}>Chuyến bay các ngày gần đây</div>
        <div className="tbl">
          <table>
            <tbody>
              {b.sets.map((s) => (
                <tr key={s.day}>
                  <td style={{ whiteSpace: 'nowrap', fontWeight: s.day === b.today ? 700 : 400 }}>{dm(s.day)}{s.day === b.today ? ' · nay' : ''}</td>
                  <td>{s.questions.map((x) => x.prompt.replace(/^Kể tên (một )?/, '')).join(' · ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {b.krillToday.length > 0 && (
        <section className="gd-paper">
          <div className="gd-label" style={{ marginBottom: 4 }}>Đáp án Độc nhất hôm nay</div>
          <p className="gd-msg" style={{ margin: '0 0 8px' }}>Chỉ trưởng làng thấy. Người chơi chỉ thấy sau nửa đêm, trừ khi tự tìm ra.</p>
          <div className="tbl">
            <table>
              <tbody>
                {b.krillToday.map((k) => (
                  <tr key={k.id}><td>{k.prompt}</td><td><b>{k.krill}</b></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 8 }}>Câu thời sự và hạn dùng</div>
        {b.timely.length === 0 ? (
          <p className="gd-msg" style={{ margin: 0 }}>Không còn câu thời sự nào còn hạn: chỗ 4 của ngày dùng câu thường.</p>
        ) : (
          <div className="tbl">
            <table>
              <thead><tr><th>Câu hỏi</th><th>Hết hạn</th><th>Còn</th></tr></thead>
              <tbody>
                {b.timely.map((x) => (
                  <tr key={x.id}>
                    <td>{x.prompt}</td>
                    <td>{dm(x.until)}</td>
                    <td style={x.daysLeft <= 14 ? { color: '#c0392b', fontWeight: 700 } : undefined}>{x.daysLeft} ngày</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 4 }}>Chất lượng từng câu</div>
        <p className="gd-msg" style={{ margin: '0 0 8px' }}>
          “Hết gió” là tỷ lệ người chơi bí không trả lời được (tính khi có từ 10 lượt). Câu hết gió quá cao là câu khó hoặc mơ hồ; bấm Tạm dừng để ngưng hỏi ngay mà không cần triển khai lại.
        </p>
        <div className="adm-filters">
          <input className="gd-input" style={{ fontSize: 15, minHeight: 36, flex: 1, minWidth: 160 }} placeholder="Tìm câu hỏi, chủ đề…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Tìm câu hỏi" />
          <select value={only} onChange={(e) => setOnly(e.target.value as typeof only)} aria-label="Lọc">
            <option value="played">Đã có người chơi</option>
            <option value="unseen">Chưa lên chuyến nào</option>
            <option value="paused">Đang tạm dừng</option>
            <option value="all">Tất cả</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sắp xếp">
            <option value="miss">Hết gió nhiều nhất</option>
            <option value="plays">Nhiều lượt nhất</option>
            <option value="avg">Điểm TB cao nhất</option>
            <option value="krill">Độc nhất tìm ra nhiều nhất</option>
          </select>
        </div>
        <div className="tbl">
          <table>
            <thead><tr><th>Câu hỏi</th><th>Lượt</th><th>Hết gió</th><th>Độc nhất</th><th>Khôn lỏi</th><th>Điểm TB</th><th /></tr></thead>
            <tbody>
              {rows.map((i) => {
                const all = i.plays + i.misses;
                const bad = all >= 10 && i.misses / all > 0.4;
                return (
                  <tr key={i.id} style={i.paused ? { opacity: 0.55 } : undefined}>
                    <td>{i.prompt}<br /><small style={{ opacity: 0.6 }}>{i.category} · {['dễ', 'vừa', 'khó'][i.level - 1] ?? i.level}{i.pop ? ' · đại chúng' : ''}{i.until ? ` · hạn ${dm(i.until)}` : ''}</small></td>
                    <td>{i.plays}</td>
                    <td style={bad ? { color: '#c0392b', fontWeight: 700 } : undefined}>{all >= 10 ? `${Math.round((i.misses / all) * 100)}%` : '—'}</td>
                    <td>{i.krill}</td>
                    <td>{i.clever}</td>
                    <td>{i.avg || '—'}</td>
                    <td>{i.paused ? <button className="gd-chip" onClick={() => void pause(i, false)}>Bật lại</button> : <button className="gd-chip" onClick={() => void pause(i, true)}>Tạm dừng</button>}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan={7}>Không có câu nào khớp.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

/** Looks a player up by id or name, shows their recent flights and flags, and lets the village head unmute a name. */
export function PlayersPage({ token }: { token: string }) {
  const [q, setQ] = useState('');
  const [res, setRes] = useState<Awaited<ReturnType<typeof api.admin.findPlayers>> | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [p, setP] = useState<Awaited<ReturnType<typeof api.admin.player>> | null>(null);
  const [msg, setMsg] = useState('');
  const search = (text = q) =>
    api.admin.findPlayers(token, text).then(setRes).catch((e) => setMsg(e instanceof Error ? e.message : 'Chưa tìm được.'));
  useEffect(() => void search(''), [token]);
  const look = async (id: string) => {
    if (open === id) return setOpen(null);
    setOpen(id);
    setP(null);
    try {
      setP(await api.admin.player(token, id));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Chưa mở được.');
    }
  };
  const act = async (id: string, kind: 'mute' | 'unmute') => {
    try {
      if (kind === 'mute') await api.admin.mute(token, id);
      else await api.admin.unmute(token, id);
      await search();
      if (open === id) setP(await api.admin.player(token, id));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Chưa lưu được.');
    }
  };
  return (
    <>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 4 }}>Tra người chơi</div>
        <p className="gd-msg" style={{ margin: '0 0 8px' }}>Gõ tên trên bảng hoặc phần đầu mã người chơi (ít nhất 2 ký tự). Hữu ích khi có người báo mất điểm hoặc bị ẩn tên.</p>
        <form className="name-row" onSubmit={(e) => { e.preventDefault(); void search(); }}>
          <input className="gd-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tên hoặc mã…" aria-label="Tên hoặc mã người chơi" />
          <button className="gd-btn" type="submit" style={{ fontSize: 16 }}>Tìm</button>
        </form>
        {msg && <p className="gd-msg gd-msg--hint">{msg}</p>}
        {res && q.trim().length >= 2 && (
          <div className="tbl" style={{ marginTop: 10 }}>
            {res.found.length === 0 ? (
              <p className="gd-msg" style={{ margin: 0 }}>Không thấy ai.</p>
            ) : (
              <table>
                <thead><tr><th>Tên</th><th>Mã</th><th>Lượt bay</th><th>Điểm cao nhất</th><th>Gần nhất</th><th /></tr></thead>
                <tbody>
                  {res.found.map((f) => (
                    <Fragment key={f.player_id}>
                      <tr style={f.muted ? { opacity: 0.6 } : undefined}>
                        <td>{f.name ?? '(chưa đặt tên)'}{f.muted ? ' · đã ẩn' : ''}</td>
                        <td>{f.player_id.slice(0, 8)}</td>
                        <td>{f.runs}</td>
                        <td>{f.best}</td>
                        <td>{dm(f.last_day)}</td>
                        <td><button className="gd-chip" onClick={() => void look(f.player_id)}>{open === f.player_id ? 'Đóng' : 'Xem'}</button></td>
                      </tr>
                      {open === f.player_id && (
                        <tr>
                          <td colSpan={6}>
                            {!p ? (
                              <p className="gd-msg" style={{ margin: 0 }}>Đang mở…</p>
                            ) : (
                              <div>
                                <p className="gd-msg" style={{ margin: '0 0 6px' }}>
                                  Lần đầu thấy: {p.firstSeen ? dm(p.firstSeen) : '—'} · {p.daysPlayed} ngày có chơi · {p.muted ? 'tên đang bị ẩn' : 'tên bình thường'}{' '}
                                  {p.muted ? <button className="gd-chip" onClick={() => void act(f.player_id, 'unmute')}>Bỏ ẩn</button> : <button className="gd-chip" onClick={() => void act(f.player_id, 'mute')}>Ẩn tên</button>}
                                </p>
                                {p.flags.length > 0 && (
                                  <p className="gd-msg gd-msg--hint" style={{ margin: '0 0 6px' }}>
                                    Cờ: {p.flags.map((x) => `${dm(x.day)} ${x.status === 'open' ? '(đang giữ)' : '(đã cho qua)'} ${x.reasons}`).join(' · ')}
                                  </p>
                                )}
                                <table>
                                  <thead><tr><th>Ngày</th><th>Loại</th><th>Tên</th><th>Điểm</th><th>Độ cao</th></tr></thead>
                                  <tbody>
                                    {p.runs.map((r) => (
                                      <tr key={r.day + r.mode}><td>{dm(r.day)}</td><td>{r.mode === 'daily' ? 'ngày' : 'vô tận'}</td><td>{r.name ?? '—'}</td><td>{r.score}</td><td>{num(Math.round(r.altitude))} m</td></tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 8 }}>Tên đang bị ẩn ({res?.muted.length ?? 0})</div>
        {!res || res.muted.length === 0 ? (
          <p className="gd-msg" style={{ margin: 0 }}>Chưa ẩn ai.</p>
        ) : (
          <div className="tbl">
            <table>
              <thead><tr><th>Mã</th><th>Từ</th><th /></tr></thead>
              <tbody>
                {res.muted.map((m) => (
                  <tr key={m.player_id}>
                    <td>{m.player_id.slice(0, 12)}</td>
                    <td>{m.at.slice(0, 10)}</td>
                    <td><button className="gd-chip" onClick={() => void act(m.player_id, 'unmute')}>Bỏ ẩn</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

const TABLE_NAMES: Record<string, string> = {
  runs: 'chuyến bay', turns: 'lượt trả lời', events: 'sự kiện', answers: 'đáp án học thêm', submissions: 'đáp án chờ xem', feedback: 'góp ý', flags: 'cờ gian lận', muted: 'tên bị ẩn', accounts: 'tài khoản',
};

/** Setup checks (set or not, never the value), the night shift, the AI referee's use, the busiest networks and table sizes. */
export function SystemPage({ token }: { token: string }) {
  const [s, setS] = useState<Awaited<ReturnType<typeof api.admin.system>> | null>(null);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    api.admin.system(token).then(setS).catch((e) => setMsg(e instanceof Error ? e.message : 'Chưa tải được.'));
  }, [token]);
  if (!s) return <section className="gd-paper">{msg ? <p className="gd-msg gd-msg--hint" style={{ margin: 0 }}>{msg}</p> : <p className="gd-msg" style={{ margin: 0 }}>Đang tải…</p>}</section>;
  const r = s.referee;
  const bad = s.config.filter((c) => !c.ok);
  return (
    <>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 4 }}>Cấu hình</div>
        <p className="gd-msg" style={{ margin: '0 0 8px' }}>Chỉ cho biết đã đặt hay chưa. Giá trị bí mật không bao giờ hiện ở đây.</p>
        {bad.length > 0 && <p className="gd-msg gd-msg--hint">Còn {bad.length} mục chưa đặt: {bad.map((c) => c.k).join(', ')}.</p>}
        <div className="tbl">
          <table>
            <tbody>
              {s.config.map((c) => (
                <tr key={c.k}>
                  <td><b>{c.k}</b></td>
                  <td style={{ color: c.ok ? '#2e8b57' : '#c0392b', fontWeight: 700 }}>{c.ok ? 'đã đặt' : 'CHƯA ĐẶT'}</td>
                  <td>{c.hint}</td>
                </tr>
              ))}
              <tr>
                <td><b>Sổ câu hỏi</b></td>
                <td style={{ color: s.bookSynced ? '#2e8b57' : '#c0392b', fontWeight: 700 }}>{s.bookSynced ? 'khớp' : 'LỆCH'}</td>
                <td>{s.bookSynced ? 'Cơ sở dữ liệu đã đồng bộ với sổ trong mã.' : 'Bấm “Cài đặt / cập nhật kho câu hỏi” ở đầu trang.'}</td>
              </tr>
              <tr>
                <td><b>Ca đêm</b></td>
                <td>{s.nightApplied ? `chạy lần cuối: ${dm(s.nightApplied)}` : 'chưa chạy'}</td>
                <td>Vercel Cron gọi lúc 23:20 giờ Việt Nam mỗi ngày.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 8 }}>Trọng tài AI hôm nay</div>
        <div className="adm-tiles">
          <div><b>{r.used}</b><span>lượt gọi AI</span><em>trần {r.max} lượt mỗi ngày</em></div>
          <div><b>{r.players}</b><span>người dùng đến trọng tài</span></div>
          <div><b>{r.refused}</b><span>lần bị từ chối vì hết lượt</span></div>
        </div>
        <span className="adm-bar" style={{ width: `${Math.min(100, (r.used / r.max) * 100)}%`, background: r.used / r.max > 0.8 ? '#c0392b' : '#3a8fd8', marginTop: 10 }} />
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 4 }}>Mạng gửi nhiều nhất hôm nay</div>
        <p className="gd-msg" style={{ margin: '0 0 8px' }}>Mã rút gọn, không phải địa chỉ IP. “an” là câu trả lời, “nq” là câu Thả vô tận, “yl” là danh sách hôm qua. Một mạng chạm trần thì bị chặn.</p>
        {s.nets.length === 0 ? <p className="gd-msg" style={{ margin: 0 }}>Chưa có.</p> : <Bars rows={s.nets.map((x) => ({ name: x.k, n: x.n }))} color="#e08a1e" />}
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 8 }}>Kiểm kê dữ liệu</div>
        <div className="adm-tiles">
          {Object.entries(s.tables).map(([k, v]) => (
            <div key={k}><b>{num(v)}</b><span>{TABLE_NAMES[k] ?? k}</span></div>
          ))}
        </div>
      </section>
    </>
  );
}
