import { Fragment, useEffect, useState } from 'react';
import { TIERS } from '../../shared/scoring.js';
import { TIER_COLOR } from '../icons';
import { api, type Support } from '../api';
import { BANKS, vietQr } from '../../shared/banks.js';

type Pending = { question_id: string; prompt: string; key: string; display: string; plays: number };
type Queued = { question_id: string; prompt: string; input_key: string; display: string; n: number };

/** The admin page, opened only at the secret path in ADMIN_PATH: numbers, reports, feedback and the village book. */
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

type Tab = 'overview' | 'questions' | 'reports' | 'feedback' | 'names' | 'safety' | 'book';
const TABS: [Tab, string][] = [
  ['overview', 'Tổng quan'],
  ['questions', 'Câu hỏi hôm nay'],
  ['reports', 'Báo cáo & lỗi'],
  ['feedback', 'Góp ý & ủng hộ'],
  ['names', 'Tên trên bảng'],
  ['safety', 'Gian lận'],
  ['book', 'Sổ làng'],
];

type Ins = Awaited<ReturnType<typeof api.admin.insights>>;
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : '—');
const dm = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;

function Insights({ tab, ins, token, onClosed }: { tab: Tab; ins: Ins; token: string; onClosed: (key: string) => void }) {
  if (tab === 'overview') return <Overview ins={ins} />;
  if (tab === 'questions') return <Questions ins={ins} />;
  if (tab === 'feedback') return <Feedback token={token} />;
  if (tab === 'names') return <Names token={token} />;
  if (tab === 'safety') return <Safety token={token} />;
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

const KIND: Record<string, string> = { gopy: 'Góp ý', loi: 'Báo lỗi', cauhoi: 'Đề xuất câu hỏi' };

function Feedback({ token }: { token: string }) {
  const [list, setList] = useState<Awaited<ReturnType<typeof api.admin.feedback>>['feedback']>([]);
  const [sup, setSup] = useState<Support>({ momo: '', qr: '', card: '', note: '', bank: '', account: '', holder: '' });
  const [msg, setMsg] = useState('');
  useEffect(() => {
    api.admin
      .feedback(token)
      .then((r) => {
        setList(r.feedback);
        setSup(r.support);
      })
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Lỗi'));
  }, [token]);
  const save = async () => {
    try {
      const v = await api.admin.setSupport(token, sup);
      setSup(v);
      setMsg('Đã lưu. Mục Ủng hộ trên trang chủ hiện những ô có điền.');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Lỗi');
    }
  };
  /** Shrinks a QR picture to a small PNG before it is saved. */
  const upload = (file: File) => {
    const img = new Image();
    img.onload = () => {
      const side = Math.min(480, img.width, img.height) || 480;
      const c = document.createElement('canvas');
      const scale = side / Math.max(img.width, img.height);
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      const url = c.toDataURL('image/png');
      if (url.length > 300_000) setMsg('Ảnh QR quá lớn, hãy cắt sát mã QR rồi thử lại.');
      else setSup((x) => ({ ...x, qr: url }));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  };
  const field = (k: keyof Support, label: string, hint: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label htmlFor={`sup-${k}`} className="gd-label">{label}</label>
      <input id={`sup-${k}`} className="gd-input" style={{ fontSize: 15, minHeight: 40 }} value={sup[k]} placeholder={hint} onChange={(e) => setSup({ ...sup, [k]: e.target.value })} />
    </div>
  );
  return (
    <>
      <section className="gd-paper" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="gd-label">Thông tin ủng hộ</div>
        <p className="gd-msg" style={{ margin: 0 }}>Điền ít nhất một cách, rồi bấm Lưu. Nút “Ủng hộ tác giả” ở trang chủ chỉ hiện khi đã có thông tin. Ô nào để trống sẽ không hiện cho người chơi.</p>
        <div className="gd-label" style={{ fontSize: 13 }}>Chuyển khoản ngân hàng (tự tạo mã VietQR)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label htmlFor="sup-bank" className="gd-label">Ngân hàng</label>
          <select id="sup-bank" className="gd-input" style={{ fontSize: 15, minHeight: 40 }} value={sup.bank} onChange={(e) => setSup({ ...sup, bank: e.target.value })}>
            <option value="">Chọn ngân hàng</option>
            {BANKS.map((b) => <option key={b.bin} value={b.bin}>{b.name}</option>)}
          </select>
        </div>
        {field('account', 'Số tài khoản', '0123456789')}
        {field('holder', 'Tên chủ tài khoản', 'NGUYEN VAN A')}
        {sup.bank && sup.account && <img src={vietQr(sup.bank, sup.account, sup.holder)} alt="Mã VietQR xem trước" style={{ width: 160, borderRadius: 12, background: '#fff' }} />}
        <div className="gd-label" style={{ fontSize: 13 }}>Ví điện tử và thẻ</div>
        {field('momo', 'Link MoMo (không bắt buộc)', 'https://me.momo.vn/...')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="gd-label">Ảnh mã QR riêng (MoMo, ZaloPay… không bắt buộc)</span>
          <input type="file" accept="image/*" aria-label="Tải ảnh mã QR" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          {sup.qr && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <img src={sup.qr} alt="Mã QR đã tải" style={{ width: 120, borderRadius: 10, background: '#fff' }} />
              <button className="gd-chip" onClick={() => setSup({ ...sup, qr: '' })}>Bỏ ảnh</button>
            </div>
          )}
        </div>
        {field('card', 'Trang nhận thẻ (Ko-fi, Buy Me a Coffee, PayPal...)', 'https://ko-fi.com/...')}
        {field('note', 'Lời cảm ơn', 'Cảm ơn bạn đã giúp làng thả diều cao hơn!')}
        <div><button className="gd-btn" style={{ fontSize: 16 }} onClick={save}>Lưu</button></div>
        {msg && <p className="gd-msg gd-msg--hint" style={{ margin: 0 }}>{msg}</p>}
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 8 }}>Góp ý của người chơi</div>
        {list.length === 0 ? (
          <p className="gd-msg" style={{ margin: 0 }}>Chưa có góp ý nào.</p>
        ) : (
          <div className="tbl">
            <table>
              <thead><tr><th>Lúc</th><th>Loại</th><th>Nội dung</th><th>Liên hệ</th><th /></tr></thead>
              <tbody>
                {list.map((f) => (
                  <tr key={f.id} style={f.status === 'open' ? undefined : { opacity: 0.5 }}>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(f.at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td>{KIND[f.kind] ?? f.kind}</td>
                    <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{f.message}</td>
                    <td style={{ wordBreak: 'break-word' }}>{f.contact ?? ''}</td>
                    <td>
                      {f.status === 'open' && (
                        <button className="gd-chip" onClick={() => api.admin.closeFeedback(token, f.id).then(() => setList((l) => l.map((x) => (x.id === f.id ? { ...x, status: 'closed' } : x))))}>Đã đọc</button>
                      )}
                    </td>
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

/** Today's board names: a rude one the filter missed is taken off here, for good (the player's scores stay). */
function Names({ token }: { token: string }) {
  const [list, setList] = useState<Awaited<ReturnType<typeof api.admin.names>>['names']>([]);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    api.admin
      .names(token)
      .then((r) => setList(r.names))
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Chưa tải được.'));
  }, [token]);
  const mute = async (id: string) => {
    try {
      await api.admin.mute(token, id);
      setList((l) => l.map((x) => (x.player_id === id ? { ...x, muted: true, name: null } : x)));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Chưa ẩn được.');
    }
  };
  return (
    <section className="gd-paper">
      <div className="gd-label" style={{ marginBottom: 8 }}>Tên trên bảng diều hôm nay</div>
      <p className="gd-msg" style={{ margin: '0 0 8px' }}>Tên tục rõ ràng đã bị chặn tự động. Bấm Ẩn để gỡ một tên khỏi mọi bảng, hôm nay và về sau; điểm của người chơi vẫn giữ.</p>
      {msg && <p className="gd-msg gd-msg--hint">{msg}</p>}
      {list.length === 0 ? (
        <p className="gd-msg" style={{ margin: 0 }}>Hôm nay chưa ai đặt tên.</p>
      ) : (
        <div className="tbl">
          <table>
            <thead><tr><th>Tên</th><th>Điểm</th><th /></tr></thead>
            <tbody>
              {list.map((n) => (
                <tr key={n.player_id} style={n.muted ? { opacity: 0.5 } : undefined}>
                  <td style={{ wordBreak: 'break-word' }}>{n.name ?? '(đã ẩn)'}</td>
                  <td>{n.score}</td>
                  <td>{!n.muted && <button className="gd-chip" onClick={() => void mute(n.player_id)}>Ẩn</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/** Anti-cheat dashboard: the numbers, today's spread, the runs to watch and the runs held off the board, each opened turn by turn. */
function Safety({ token }: { token: string }) {
  const [s, setS] = useState<Awaited<ReturnType<typeof api.admin.safety>> | null>(null);
  const [list, setList] = useState<Awaited<ReturnType<typeof api.admin.flags>>['flags']>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof api.admin.flight>> | null>(null);
  const [msg, setMsg] = useState('');
  const refresh = () => {
    api.admin.safety(token).then(setS).catch((e) => setMsg(e instanceof Error ? e.message : 'Chưa tải được.'));
    api.admin.flags(token).then((r) => setList(r.flags)).catch(() => {});
  };
  useEffect(refresh, [token]);
  const look = async (pid: string, day: string) => {
    const key = pid + day;
    if (open === key) return setOpen(null);
    setOpen(key);
    setDetail(null);
    try {
      setDetail(await api.admin.flight(token, pid, day));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Chưa mở được.');
    }
  };
  const set = async (f: (typeof list)[number], status: 'cleared' | 'open') => {
    try {
      await api.admin.flagSet(token, f.player_id, f.day, status);
      refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Chưa lưu được.');
    }
  };
  const Detail = () =>
    !detail ? (
      <p className="gd-msg" style={{ margin: 0 }}>Đang mở…</p>
    ) : (
      <div className="tbl">
        <table>
          <thead><tr><th>Câu hỏi</th><th>Đáp án</th><th>Bậc</th><th>Thời gian</th><th>Sổ làng</th></tr></thead>
          <tbody>
            {detail.rows.map((r, i) => (
              <tr key={i}>
                <td>{r.prompt}</td>
                <td><b>{r.answer ?? '—'}</b></td>
                <td style={r.tier != null && r.tier >= 0 ? { color: TIER_COLOR[r.tier], fontWeight: 700 } : undefined}>{r.tier != null && r.tier >= 0 ? TIERS[r.tier].name : 'hết gió'}</td>
                <td style={r.fast ? { color: '#c0392b', fontWeight: 700 } : undefined}>{r.ms != null ? `${(r.ms / 1000).toFixed(1)}s` : '—'}{r.fast ? ' · quá nhanh' : ''}</td>
                <td style={r.outside ? { color: '#c0392b', fontWeight: 700 } : undefined}>{r.answer ? (r.outside ? 'ngoài sổ' : 'có trong sổ') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="gd-msg" style={{ margin: '6px 0 0' }}>Điểm đáng ngờ: <b>{detail.score}</b>{detail.reasons.length ? ` · ${detail.reasons.join('; ')}` : ''}</p>
      </div>
    );
  if (!s) return <section className="gd-paper">{msg ? <p className="gd-msg gd-msg--hint" style={{ margin: 0 }}>{msg}</p> : <p className="gd-msg" style={{ margin: 0 }}>Đang tải…</p>}</section>;
  const peak = Math.max(1, ...s.spread);
  const labels = ['0 · bình thường', '1 · hơi lạ', '2 · đáng để mắt', `${s.threshold}+ · bị giữ`];
  const open_ = list.filter((f) => f.status === 'open');
  const cleared = list.filter((f) => f.status === 'cleared');
  const tiles: [string | number, string, string?][] = [
    [s.totals.held, 'chuyến đang bị giữ', 'không lên bảng xếp hạng'],
    [s.now.heldToday, 'bị giữ hôm nay', `trên ${s.now.players} người bay`],
    [s.totals.cleared, 'đã cho lên bảng', 'trưởng làng xem và cho qua'],
    [s.now.krill, 'Độc nhất tìm ra hôm nay'],
    [s.now.outside, 'đáp án ngoài sổ hôm nay'],
    [s.now.fast, 'câu trả lời quá nhanh hôm nay', 'dưới 1,2 giây'],
  ];
  const peakDay = Math.max(1, ...s.days.map((d) => d.krill));
  const Row = ({ f }: { f: (typeof list)[number] }) => (
    <Fragment>
      <tr style={f.status === 'cleared' ? { opacity: 0.6 } : undefined}>
        <td>{dm(f.day)}</td>
        <td style={{ wordBreak: 'break-word' }}>{f.name ?? f.player_id.slice(0, 8)}</td>
        <td>{f.score}</td>
        <td style={{ wordBreak: 'break-word' }}>{f.reasons}</td>
        <td style={{ whiteSpace: 'nowrap' }}>
          <button className="gd-chip" onClick={() => void look(f.player_id, f.day)}>{open === f.player_id + f.day ? 'Đóng' : 'Xem từng câu'}</button>{' '}
          {f.status === 'open' ? (
            <button className="gd-chip" onClick={() => void set(f, 'cleared')}>Cho lên bảng</button>
          ) : (
            <button className="gd-chip" onClick={() => void set(f, 'open')}>Gỡ lại</button>
          )}
        </td>
      </tr>
      {open === f.player_id + f.day && <tr><td colSpan={5}><Detail /></td></tr>}
    </Fragment>
  );
  return (
    <>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 4 }}>Kiểm kê gian lận · {dm(s.today)}</div>
        <p className="gd-msg" style={{ margin: '0 0 10px' }}>
          Mỗi chuyến bay được chấm độ đáng ngờ khi người chơi lưu kết quả. Từ {s.threshold} điểm trở lên thì chuyến bay bị giữ: không lên bảng, nhưng người chơi vẫn thấy điểm và hạng như bình thường. Người từng bị giữ (cùng ID hoặc cùng thiết bị) bị giữ ngay khi có dấu hiệu đầu tiên.
        </p>
        <div className="adm-tiles">
          {tiles.map(([v, l, sub]) => (
            <div key={l}>
              <b>{v}</b>
              <span>{l}</span>
              {sub && <em>{sub}</em>}
            </div>
          ))}
        </div>
        {msg && <p className="gd-msg gd-msg--hint">{msg}</p>}
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 8 }}>Hôm nay, người chơi theo điểm đáng ngờ</div>
        {s.spread.map((n, i) => (
          <div key={i} className="adm-spread">
            <span>{labels[i]}</span>
            <span className="adm-bar" style={{ width: `${(n / peak) * 100}%`, background: i >= 3 ? '#c0392b' : i === 2 ? '#e08a1e' : i === 1 ? '#f2b630' : '#3a8fd8' }} />
            <b>{n}</b>
          </div>
        ))}
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 8 }}>14 ngày qua</div>
        {s.days.length === 0 ? (
          <p className="gd-msg" style={{ margin: 0 }}>Chưa có dữ liệu.</p>
        ) : (
          <div className="tbl">
            <table>
              <thead><tr><th>Ngày</th><th>Người bay</th><th>Độc nhất</th><th /><th>Quá nhanh</th><th>Bị giữ</th><th>Cho qua</th></tr></thead>
              <tbody>
                {s.days.map((d) => (
                  <tr key={d.day}>
                    <td>{dm(d.day)}</td>
                    <td>{d.players}</td>
                    <td>{d.krill}</td>
                    <td style={{ width: 100 }}><span className="adm-bar" style={{ width: `${(d.krill / peakDay) * 100}%` }} /></td>
                    <td>{d.fast}</td>
                    <td style={d.held ? { color: '#c0392b', fontWeight: 700 } : undefined}>{d.held}</td>
                    <td>{d.cleared}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 4 }}>Đang bị giữ ({open_.length})</div>
        <p className="gd-msg" style={{ margin: '0 0 8px' }}>Bấm “Xem từng câu” để đọc đáp án, thời gian trả lời và đáp án có trong sổ làng hay không. Hợp lệ thì “Cho lên bảng”, hệ thống sẽ không gắn cờ lại chuyến bay đó.</p>
        {open_.length === 0 ? (
          <p className="gd-msg" style={{ margin: 0 }}>Không có chuyến bay nào đang bị giữ.</p>
        ) : (
          <div className="tbl">
            <table>
              <thead><tr><th>Ngày</th><th>Tên</th><th>Điểm</th><th>Lý do</th><th /></tr></thead>
              <tbody>{open_.map((f) => <Row key={f.player_id + f.day} f={f} />)}</tbody>
            </table>
          </div>
        )}
      </section>
      <section className="gd-paper">
        <div className="gd-label" style={{ marginBottom: 4 }}>Cần để mắt hôm nay ({s.watch.length})</div>
        <p className="gd-msg" style={{ margin: '0 0 8px' }}>Có dấu hiệu lạ nhưng chưa đủ {s.threshold} điểm để bị giữ.</p>
        {s.watch.length === 0 ? (
          <p className="gd-msg" style={{ margin: 0 }}>Chưa có ai.</p>
        ) : (
          <div className="tbl">
            <table>
              <thead><tr><th>Tên</th><th>Điểm</th><th>Dấu hiệu</th><th /></tr></thead>
              <tbody>
                {s.watch.map((w) => (
                  <Fragment key={w.player_id}>
                    <tr>
                      <td>{w.name ?? w.player_id.slice(0, 8)}</td>
                      <td>{w.score}</td>
                      <td style={{ wordBreak: 'break-word' }}>{w.reasons.join('; ')}</td>
                      <td><button className="gd-chip" onClick={() => void look(w.player_id, s.today)}>{open === w.player_id + s.today ? 'Đóng' : 'Xem từng câu'}</button></td>
                    </tr>
                    {open === w.player_id + s.today && <tr><td colSpan={4}><Detail /></td></tr>}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {cleared.length > 0 && (
        <section className="gd-paper">
          <div className="gd-label" style={{ marginBottom: 8 }}>Đã cho lên bảng ({cleared.length})</div>
          <div className="tbl">
            <table>
              <thead><tr><th>Ngày</th><th>Tên</th><th>Điểm</th><th>Lý do</th><th /></tr></thead>
              <tbody>{cleared.map((f) => <Row key={f.player_id + f.day} f={f} />)}</tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
