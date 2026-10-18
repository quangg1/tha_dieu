// The friends board: people who invited each other, racing today and over the last seven days.
import { useEffect, useState } from 'react';
import { formatAlt } from '../../shared/scoring.js';
import { rudeName } from '../../shared/names.js';
import { api, type FriendsBoard } from '../api';
import { CloseIcon } from '../glyphs';
import { playerId, prefs } from '../store';
import { track } from '../track';

/** The link a friend opens to join this player's board. */
export function inviteLink(code: string) {
  return `${location.origin}/?ban=${code}`;
}

/** Shares the invitation (phone share sheet, else the clipboard); says what happened. */
export async function shareInvite(code: string): Promise<string> {
  const url = inviteLink(code);
  const text = `🪁 Đua thả diều Bilion với mình mỗi ngày nhé! Bấm để vào bảng bạn bè:`;
  track('invite', { kind: 'friends' });
  try {
    if (navigator.share && matchMedia('(pointer: coarse)').matches) {
      await navigator.share({ text, url });
      return '';
    }
    await navigator.clipboard.writeText(`${text} ${url}`);
    return 'Đã chép lời mời, dán vào Zalo hay Messenger nhé!';
  } catch {
    return '';
  }
}

/** The board itself: today (after your own flight) or the seven-day race. */
export function FriendsList({ board, tab, compact = false }: { board: FriendsBoard; tab: 'today' | 'week'; compact?: boolean }) {
  const rows = [...board.rows].sort((a, b) =>
    tab === 'week' ? b.week - a.week || b.days - a.days : (b.score ?? (b.flew ? -1 : -2)) - (a.score ?? (a.flew ? -1 : -2)),
  );
  const shown = compact ? rows.slice(0, 5) : rows;
  return (
    <div className="board fr-board">
      {shown.map((r, i) => (
        <div key={r.code} className={`board-row${r.me ? ' me' : ''}`}>
          <span className="board-rank">{i + 1}</span>
          <span>{r.me ? (r.name === 'Bạn' ? 'Bạn' : `${r.name} (bạn)`) : r.name}</span>
          <b>
            {tab === 'week'
              ? `${r.week.toLocaleString('vi-VN')} điểm`
              : r.score != null
                ? formatAlt(r.altitude ?? 0)
                : r.flew
                  ? 'Đã bay'
                  : 'Chưa bay'}
          </b>
          {tab === 'week' && <small className="fr-days">{r.days}/7 ngày</small>}
        </div>
      ))}
    </div>
  );
}

export function FriendsSheet({ onClose }: { onClose: () => void }) {
  const [board, setBoard] = useState<FriendsBoard | null>(null);
  const [tab, setTab] = useState<'today' | 'week'>('today');
  const [name, setName] = useState(prefs.name);
  const [msg, setMsg] = useState('');
  const load = (n?: string) =>
    api
      .friends(playerId(), n || prefs.name || undefined)
      .then(setBoard)
      .catch((e) => setMsg(e instanceof Error ? e.message : 'Chưa tải được bảng bạn bè.'));
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const needName = !prefs.name && !board?.name;
  const invite = async () => {
    if (!board) return;
    if (needName) {
      const n = name.trim().slice(0, 24);
      if (!n || rudeName(n)) {
        setMsg('Đặt một cái tên để bạn bè nhận ra bạn nhé.');
        return;
      }
      prefs.name = n;
      await load(n);
    }
    const said = await shareInvite(board.code);
    if (said) setMsg(said);
  };
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Bảng bạn bè" onClick={onClose}>
      <section className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>Bảng bạn bè</h2>
          <button className="sheet-x" onClick={onClose} aria-label="Đóng">
            <CloseIcon />
          </button>
        </div>
        <p className="sup-note" style={{ margin: 0 }}>Mời bạn bè và đua với nhau mỗi ngày. Điểm hôm nay của bạn bè hiện ra sau khi bạn bay xong chuyến của mình.</p>
        {board && (
          <>
            <div className="fb-kinds" role="tablist" aria-label="Xếp hạng">
              <button role="tab" aria-selected={tab === 'today'} className={`fb-kind${tab === 'today' ? ' on' : ''}`} onClick={() => setTab('today')}>Hôm nay</button>
              <button role="tab" aria-selected={tab === 'week'} className={`fb-kind${tab === 'week' ? ' on' : ''}`} onClick={() => setTab('week')}>7 ngày qua</button>
            </div>
            {board.friends === 0 ? (
              <p className="row-q">Chưa có ai trong bảng. Gửi lời mời cho bạn bè, ai bấm vào là cả hai cùng lên bảng.</p>
            ) : (
              <FriendsList board={board} tab={tab} />
            )}
            {!board.done && tab === 'today' && board.friends > 0 && <p className="acct-note">Bay xong chuyến hôm nay để xem điểm của mọi người.</p>}
            {needName && (
              <input className="text-input" placeholder="Tên của bạn (bạn bè sẽ thấy)" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} aria-label="Tên của bạn" />
            )}
            <button className="next-btn" onClick={() => void invite()}>Mời bạn bè</button>
          </>
        )}
        {msg && <p className="acct-note" role="status">{msg}</p>}
      </section>
    </div>
  );
}
