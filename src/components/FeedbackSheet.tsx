// The feedback sheet: general thoughts, bug reports or a question to add, with an optional contact.
import { useState } from 'react';
import { api } from '../api';
import { playerId } from '../store';
import { track } from '../track';
import { CloseIcon } from '../glyphs';

const KINDS: [string, string][] = [
  ['gopy', 'Góp ý chung'],
  ['loi', 'Báo lỗi'],
  ['cauhoi', 'Đề xuất câu hỏi'],
];

export function FeedbackSheet({ onClose, intro }: { onClose: () => void; intro?: string }) {
  const [kind, setKind] = useState('gopy');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [state, setState] = useState<'' | 'sending' | 'sent' | string>('');

  const send = async () => {
    setState('sending');
    try {
      await api.feedback({ kind, message, contact: contact || undefined, playerId: playerId() });
      track('report', { kind: 'feedback' });
      setState('sent');
    } catch (e) {
      setState(e instanceof Error ? e.message : 'Chưa gửi được, thử lại nhé.');
    }
  };

  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Góp ý" onClick={onClose}>
      <section className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>Góp ý</h2>
          <button className="sheet-x" onClick={onClose} aria-label="Đóng">
            <CloseIcon />
          </button>
        </div>
        {state === 'sent' ? (
          <p className="fb-done">Cảm ơn bạn! Góp ý đã tới tay người làm game.</p>
        ) : (
          <div className="fb-form">
            {intro && <p className="sup-note" style={{ margin: 0 }}>{intro}</p>}
            <div className="fb-kinds" role="radiogroup" aria-label="Loại góp ý">
              {KINDS.map(([k, l]) => (
                <button key={k} role="radio" aria-checked={kind === k} className={`fb-kind${kind === k ? ' on' : ''}`} onClick={() => setKind(k)}>
                  {l}
                </button>
              ))}
            </div>
            <label htmlFor="fb-msg" className="sr">
              Nội dung góp ý
            </label>
            <textarea
              id="fb-msg"
              className="fb-text"
              rows={5}
              maxLength={1500}
              placeholder={kind === 'cauhoi' ? 'Câu hỏi bạn muốn làng đố, kèm vài đáp án nếu có…' : kind === 'loi' ? 'Lỗi xảy ra ở đâu, trên máy gì…' : 'Bạn thích gì, chỗ nào khó hiểu, muốn game thêm gì…'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <label htmlFor="fb-contact" className="fb-label">
              Email hoặc Zalo, nếu muốn được phản hồi (không bắt buộc)
            </label>
            <input id="fb-contact" className="fb-input" maxLength={120} value={contact} onChange={(e) => setContact(e.target.value)} />
            {state && state !== 'sending' && (
              <p className="fb-err" role="alert">
                {state}
              </p>
            )}
            <button className="next-btn" disabled={message.trim().length < 3 || state === 'sending'} onClick={send}>
              {state === 'sending' ? 'Đang gửi…' : 'Gửi góp ý'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
