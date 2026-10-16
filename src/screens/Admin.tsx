import { useState } from 'react';
import { TIERS } from '../../shared/scoring.js';
import { api } from '../api';

type Pending = { question_id: string; prompt: string; key: string; display: string; plays: number };
type Queued = { question_id: string; prompt: string; input_key: string; display: string; n: number };

/** Small moderation page at /#admin: set up the database and review answers the Claude referee accepted. */
export default function Admin({ onExit }: { onExit: () => void }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('thadieu.admin') ?? '');
  const [data, setData] = useState<{ stats: Record<string, number>; pending: Pending[] } | null>(null);
  const [msg, setMsg] = useState('');
  const [tiers, setTiers] = useState<Record<string, number>>({});
  const [queue, setQueue] = useState<Queued[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [ins, setIns] = useState<Awaited<ReturnType<typeof api.admin.insights>> | null>(null);
  const [tab, setTab] = useState<Tab>('overview');

  const load = async () => {
    setMsg('');
    try {
      sessionStorage.setItem('thadieu.admin', token);
      setData(await api.admin.pending(token));
      setQueue((await api.admin.queue(token)).queue);
      setIns(await api.admin.insights(token));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Lỗi');
    }
  };

  const setup = async () => {
    try {
      const r = await api.admin.setup(token);
      setMsg(`Đã cài đặt cơ sở dữ liệu: ${r.questions} câu hỏi.`);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Lỗi');
    }
  };

  const decide = async (p: Pending, decision: 'approve' | 'reject') => {
    try {
      await api.admin.review(token, { questionId: p.question_id, key: p.key, decision, tier: tiers[p.question_id + p.key] });
      setData((d) => d && { ...d, pending: d.pending.filter((x) => !(x.question_id === p.question_id && x.key === p.key)) });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Lỗi');
    }
  };

  const decideQueued = async (x: Queued, decision: 'accept' | 'dismiss') => {
    const id = x.question_id + x.input_key;
    try {
      await api.admin.decide(token, { questionId: x.question_id, inputKey: x.input_key, decision, display: names[id] ?? x.display, tier: tiers[id] ?? 4 });
      setQueue((q) => q.filter((y) => !(y.question_id === x.question_id && y.input_key === x.input_key)));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Lỗi');
    }
  };

  return (
    <main className="admin" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="topbar" style={{ marginBottom: 16 }}>
          <h1 className="gd-print" style={{ margin: 0, fontSize: 32 }}>Sổ của làng</h1>
          <button className="gd-btn gd-btn--paper" onClick={onExit} style={{ fontSize: 15, minHeight: 44 }}>Về game</button>
        </div>
        <section className="gd-paper" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label htmlFor="tok" className="gd-label">Mã quản trị (ADMIN_TOKEN)</label>
          <div className="name-row">
            <input id="tok" className="gd-input" type="password" value={token} onChange={(e) => setToken(e.target.value)} />
            <button className="gd-btn" onClick={load} style={{ fontSize: 16 }}>Mở sổ</button>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="gd-chip" onClick={setup}>Cài đặt / cập nhật kho câu hỏi</button>
          </div>
          {msg && <p className="gd-msg gd-msg--hint" style={{ margin: 0 }}>{msg}</p>}
        </section>
        {data && (
          <>
            <nav className="adm-tabs" aria-label="Mục quản trị">
              {TABS.map(([k, l]) => (
                <button key={k} className={`gd-chip${tab === k ? ' on' : ''}`} aria-pressed={tab === k} onClick={() => setTab(k)}>
                  {l}
                </button>
              ))}
              <button className="gd-chip" onClick={load}>Tải lại</button>
            </nav>
            {tab !== 'book' && ins && <Insights tab={tab} ins={ins} token={token} onClosed={(k) => setIns({ ...ins, reports: ins.reports.filter((r) => r.question_id + r.input_key + r.kind !== k) })} />}
            {tab === 'book' && (
              <>
            <section className="gd-paper">
              <div className="gd-label">Hôm nay</div>
              <p style={{ margin: '6px 0 0' }}>
                {data.stats.players} người đã hoàn thành chuyến bay · {data.stats.answers} câu trả lời · {data.stats.questions} câu hỏi đang dùng · {data.stats.queued} đáp án người chơi chờ xem · {data.stats.pending} đáp án Claude chờ duyệt
              </p>
            </section>
            <section className="gd-paper">
              <div className="gd-label" style={{ marginBottom: 4 }}>Đáp án người chơi gõ mà sổ chưa có</div>
              <p className="gd-msg" style={{ margin: '0 0 8px' }}>
                Sửa tên cho đúng chính tả rồi bấm Nhận để thêm vào sổ. Nếu đó là cách viết khác của một đáp án đã có, gõ đúng tên đáp án đó: hệ thống sẽ ghép làm biệt danh.
              </p>
              {queue.length === 0 ? (
                <p className="gd-msg" style={{ margin: 0 }}>Hàng chờ đang trống.</p>
              ) : (
                <div className="tbl">
                  <table>
                    <thead>
                      <tr><th>Câu hỏi</th><th>Đáp án</th><th>Lượt gõ</th><th>Hạng</th><th /></tr>
                    </thead>
                    <tbody>
                      {queue.map((x) => {
                        const id = x.question_id + x.input_key;
                        return (
                          <tr key={id}>
                            <td>{x.prompt}</td>
                            <td>
                              <label className="sr" htmlFor={`n-${id}`}>Tên đáp án</label>
                              <input id={`n-${id}`} className="gd-input" style={{ fontSize: 15, minHeight: 36 }} value={names[id] ?? x.display} onChange={(e) => setNames((m) => ({ ...m, [id]: e.target.value }))} />
                            </td>
                            <td>{x.n}</td>
                            <td>
                              <label className="sr" htmlFor={`q-${id}`}>Hạng gốc</label>
                              <select id={`q-${id}`} defaultValue={4} onChange={(e) => setTiers((t) => ({ ...t, [id]: Number(e.target.value) }))}>
                                {TIERS.slice(0, 5).map((t) => <option key={t.index} value={t.index}>{t.name}</option>)}
                              </select>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <button className="gd-chip" onClick={() => decideQueued(x, 'accept')}>Nhận</button>{' '}
                              <button className="gd-chip" onClick={() => decideQueued(x, 'dismiss')}>Bỏ</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
            <section className="gd-paper">
              <div className="gd-label" style={{ marginBottom: 8 }}>Đáp án trọng tài Claude đã công nhận, chờ duyệt</div>
              {data.pending.length === 0 ? (
                <p className="gd-msg" style={{ margin: 0 }}>Không có đáp án nào chờ duyệt.</p>
              ) : (
                <div className="tbl">
                  <table>
                    <thead>
                      <tr><th>Câu hỏi</th><th>Đáp án</th><th>Lượt</th><th>Hạng gốc</th><th /></tr>
                    </thead>
                    <tbody>
                      {data.pending.map((p) => (
                        <tr key={p.question_id + p.key}>
                          <td>{p.prompt}</td>
                          <td><b>{p.display}</b></td>
                          <td>{p.plays}</td>
                          <td>
                            <label className="sr" htmlFor={`t-${p.question_id}-${p.key}`}>Hạng gốc</label>
                            <select id={`t-${p.question_id}-${p.key}`} defaultValue={4} onChange={(e) => setTiers((t) => ({ ...t, [p.question_id + p.key]: Number(e.target.value) }))}>
                              {TIERS.slice(0, 5).map((t) => <option key={t.index} value={t.index}>{t.name}</option>)}
                            </select>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <button className="gd-chip" onClick={() => decide(p, 'approve')}>Duyệt</button>{' '}
                            <button className="gd-chip" onClick={() => decide(p, 'reject')}>Gỡ</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

type Tab = 'overview' | 'questions' | 'reports' | 'book';
const TABS: [Tab, string][] = [
  ['overview', 'Tổng quan'],
  ['questions', 'Câu hỏi hôm nay'],
  ['reports', 'Báo cáo & lỗi'],
  ['book', 'Sổ làng'],
];

type Ins = Awaited<ReturnType<typeof api.admin.insights>>;
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : '—');
const dm = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;

function Insights({ tab, ins, token, onClosed }: { tab: Tab; ins: Ins; token: string; onClosed: (key: string) => void }) {
  if (tab === 'overview') return <Overview ins={ins} />;
  if (tab === 'questions') return <Questions ins={ins} />;
  return <Reports ins={ins} token={token} onClosed={onClosed} />;
}

function Overview({ ins }: { ins: Ins }) {
  const t = ins.days.find((d) => d.day === ins.today) ?? { opens: 0, starts: 0, finishes: 0, sharers: 0, invited: 0, fresh: 0 };
  const sc = ins.scores.find((d) => d.day === ins.today);
  const ret = ins.retention.find((r) => r.cohort > 0);
  const tiles: [string, string, string?][] = [
    [String(t.opens), 'người mở game hôm nay', `${t.fresh} người mới`],
    [String(t.finishes), 'bay xong chuyến hôm nay', `${pct(t.finishes, t.starts)} người bắt đầu đã bay xong`],
    [String(t.sharers), 'chia sẻ hoặc thách đấu', `${pct(t.sharers, t.finishes)} người bay xong`],
    [String(t.invited), 'vào từ link thách đấu'],
    [sc ? String(sc.avg) : '—', 'điểm trung bình hôm nay', sc ? `cao nhất ${sc.best}` : undefined],
    [ret ? pct(ret.d1, ret.cohort) : '—', 'quay lại hôm sau', ret ? `nhóm ngày ${dm(ret.day)}: ${ret.d1}/${ret.cohort}` : 'chưa đủ dữ liệu'],
  ];
  const peak = Math.max(1, ...ins.days.map((d) => d.opens));
  return (
    <>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 10 }}>Hôm nay · {dm(ins.today)}</div>
        <div className="adm-tiles">
          {tiles.map(([v, l, sub]) => (
            <div key={l}>
              <b>{v}</b>
              <span>{l}</span>
              {sub && <em>{sub}</em>}
            </div>
          ))}
        </div>
        <p className="gd-msg" style={{ margin: '10px 0 0' }}>
          Từ trước tới nay: {ins.totals.players.toLocaleString('vi-VN')} người chơi · {ins.totals.runs.toLocaleString('vi-VN')} chuyến bay ngày · {ins.totals.answers.toLocaleString('vi-VN')} câu trả lời
        </p>
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 8 }}>14 ngày qua</div>
        {ins.days.length === 0 ? (
          <p className="gd-msg" style={{ margin: 0 }}>Chưa có dữ liệu.</p>
        ) : (
          <div className="tbl">
            <table>
              <thead>
                <tr><th>Ngày</th><th>Mở game</th><th /><th>Người mới</th><th>Bắt đầu</th><th>Bay xong</th><th>Hoàn thành</th><th>Chia sẻ</th><th>Từ thách đấu</th><th>Điểm TB</th></tr>
              </thead>
              <tbody>
                {ins.days.map((d) => {
                  const s = ins.scores.find((x) => x.day === d.day);
                  return (
                    <tr key={d.day}>
                      <td>{dm(d.day)}</td>
                      <td>{d.opens}</td>
                      <td style={{ width: 120 }}><span className="adm-bar" style={{ width: `${(d.opens / peak) * 100}%` }} /></td>
                      <td>{d.fresh}</td>
                      <td>{d.starts}</td>
                      <td>{d.finishes}</td>
                      <td>{pct(d.finishes, d.starts)}</td>
                      <td>{d.sharers}</td>
                      <td>{d.invited}</td>
                      <td>{s ? s.avg : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 4 }}>Giữ chân người chơi</div>
        <p className="gd-msg" style={{ margin: '0 0 8px' }}>Mỗi dòng là nhóm người chơi lần đầu mở game trong ngày đó, và bao nhiêu người quay lại.</p>
        {ins.retention.length === 0 ? (
          <p className="gd-msg" style={{ margin: 0 }}>Chưa đủ dữ liệu: cần ít nhất một ngày trọn vẹn.</p>
        ) : (
          <div className="tbl">
            <table>
              <thead><tr><th>Ngày đầu</th><th>Số người</th><th>Quay lại hôm sau</th><th>Quay lại trong 7 ngày</th></tr></thead>
              <tbody>
                {ins.retention.map((r) => (
                  <tr key={r.day}><td>{dm(r.day)}</td><td>{r.cohort}</td><td>{pct(r.d1, r.cohort)} ({r.d1})</td><td>{pct(r.d7, r.cohort)} ({r.d7})</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function Questions({ ins }: { ins: Ins }) {
  return (
    <section className="gd-paper">
      <div className="gd-label" style={{ marginBottom: 4 }}>Bảy câu hôm nay</div>
      <p className="gd-msg" style={{ margin: '0 0 8px' }}>“Bị hỏi lại” cao nghĩa là người chơi hay gõ đáp án sổ chưa có: nên xem hàng chờ ở Sổ làng. “Hết gió” cao nghĩa là câu khó hoặc mơ hồ.</p>
      <div className="tbl">
        <table>
          <thead><tr><th>#</th><th>Câu hỏi</th><th>Trả lời</th><th>Hết gió</th><th>Bị hỏi lại</th><th>Tìm ra độc nhất</th><th>Khôn lỏi</th><th>Điểm TB</th></tr></thead>
          <tbody>
            {ins.questions.map((q, i) => (
              <tr key={q.id}>
                <td>{i + 1}</td>
                <td>{q.prompt}</td>
                <td>{q.answered}</td>
                <td>{q.misses} {q.answered + q.misses ? `(${pct(q.misses, q.answered + q.misses)})` : ''}</td>
                <td>{q.retries}</td>
                <td>{q.krill}</td>
                <td>{q.clever}</td>
                <td>{q.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Reports({ ins, token, onClosed }: { ins: Ins; token: string; onClosed: (key: string) => void }) {
  return (
    <>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 4 }}>Người chơi báo trọng tài chấm sai</div>
        <p className="gd-msg" style={{ margin: '0 0 8px' }}>“Bị từ chối” là đáp án người chơi cho là đúng mà làng không nhận: thêm vào sổ ở tab Sổ làng nếu hợp lệ. “Được tính” là đáp án người chơi cho là không nên tính.</p>
        {ins.reports.length === 0 ? (
          <p className="gd-msg" style={{ margin: 0 }}>Chưa có báo cáo nào.</p>
        ) : (
          <div className="tbl">
            <table>
              <thead>
                <tr><th>Câu hỏi</th><th>Đáp án</th><th>Loại</th><th>Lượt báo</th><th /></tr>
              </thead>
              <tbody>
                {ins.reports.map((r) => {
                  const k = r.question_id + r.input_key + r.kind;
                  return (
                    <tr key={k}>
                      <td>{r.prompt}</td>
                      <td><b>{r.display}</b></td>
                      <td>{r.kind === 'rejected' ? 'Bị từ chối' : 'Được tính'}</td>
                      <td>{r.n}</td>
                      <td>
                        <button className="gd-chip" onClick={() => api.admin.closeReport(token, { questionId: r.question_id, inputKey: r.input_key, kind: r.kind }).then(() => onClosed(k))}>Đã xử lý</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 8 }}>Lỗi trên máy người chơi · 7 ngày</div>
        {ins.errors.length === 0 ? (
          <p className="gd-msg" style={{ margin: 0 }}>Không có lỗi nào.</p>
        ) : (
          <div className="tbl">
            <table>
              <thead><tr><th>Thông báo</th><th>Lượt</th></tr></thead>
              <tbody>
                {ins.errors.map((e) => <tr key={e.message}><td style={{ wordBreak: 'break-word' }}>{e.message}</td><td>{e.n}</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
