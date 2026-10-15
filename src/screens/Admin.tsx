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

  const load = async () => {
    setMsg('');
    try {
      sessionStorage.setItem('thadieu.admin', token);
      setData(await api.admin.pending(token));
      setQueue((await api.admin.queue(token)).queue);
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
      </div>
    </main>
  );
}
