// "Bilion của tôi": an optional Google sign-in that keeps one history (streak, scores, collection) on every device.
import { type ReactNode, useEffect, useState } from 'react';
import { api } from '../api';
import { authEnabled, backFromGoogle, finishGoogle, signOutGoogle, startGoogle } from '../auth';
import { MyRecord } from '../components/PlayerStats';
import { account, enterAccount, krillFound, leaveAccount, playerId, refreshAccount, stats } from '../store';
import { track } from '../track';

type Pending = { session: string; device: string; days: number; profile: { name: string | null; email: string | null } };

export default function Account({ soundButton, onHome }: { soundButton: ReactNode; onHome: () => void }) {
  const [acc, setAcc] = useState(account());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [pending, setPending] = useState<Pending | null>(null);
  const [, redraw] = useState(0);

  // Back from Google: trade the verifier for Bilion's session, then ask before folding in this device's history.
  useEffect(() => {
    if (!backFromGoogle()) {
      if (acc) {
        api.account
          .me(acc.session)
          .then((me) => {
            refreshAccount(me);
            redraw((n) => n + 1);
          })
          .catch((e) => {
            if (e?.status === 401) {
              leaveAccount();
              setAcc(null);
              setMsg('Phiên đăng nhập đã hết hạn. Đăng nhập lại để đồng bộ nhé.');
            }
          });
      }
      return;
    }
    setBusy(true);
    (async () => {
      try {
        const jwt = await finishGoogle();
        const device = playerId();
        const r = await api.account.login({ jwt, playerId: device });
        track('login', { created: r.created, deviceDays: r.deviceDays });
        if (r.deviceDays > 0) {
          setPending({ session: r.session, device, days: r.deviceDays, profile: r.profile });
        } else {
          await enter(r.session, r.profile, r.created || r.playerId === device);
        }
      } catch (e) {
        setMsg(e instanceof Error ? e.message : 'Chưa đăng nhập được. Thử lại nhé.');
      } finally {
        setBusy(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = async (session: string, profile: Pending['profile'], keepDevice: boolean) => {
    const me = await api.account.me(session);
    const info = { session, name: profile.name ?? me.profile.name, email: profile.email ?? me.profile.email };
    enterAccount(info, me, { keepDevice });
    setAcc(info);
    setMsg('Đã đăng nhập. Chuyến bay của bạn sẽ theo bạn sang mọi máy.');
  };

  const decide = async (fold: boolean) => {
    if (!pending) return;
    setBusy(true);
    try {
      if (fold) {
        const r = await api.account.merge(pending.session, pending.device);
        track('merge', { days: r.days });
      }
      await enter(pending.session, pending.profile, fold);
      setPending(null);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Chưa xong, thử lại nhé.');
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    setMsg('');
    track('login_open');
    try {
      await startGoogle();
    } catch (e) {
      setBusy(false);
      setMsg(e instanceof Error ? e.message : 'Chưa mở được trang đăng nhập Google.');
    }
  };

  const signOut = async () => {
    if (!acc) return;
    setBusy(true);
    await api.account.logout(acc.session).catch(() => {});
    await signOutGoogle();
    leaveAccount();
    setAcc(null);
    setBusy(false);
    setMsg('Đã đăng xuất. Máy này trở về như trước khi đăng nhập.');
  };

  const st = stats();

  return (
    <main className="stage result account">
      <div className="home-top">
        <button className="icon-btn" onClick={onHome} aria-label="Về màn chính">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <span className="hud-sound">{soundButton}</span>
      </div>

      <div className="result-hero acct-hero">
        <span className="result-kicker">Sổ diều của bạn</span>
        <span className="result-title">Bilion của tôi</span>
        <span className="result-sub">Chuyến bay của bạn. Một lịch sử. Mọi thiết bị.</span>
      </div>

      <div className="result-body">
        {pending ? (
          <section className="card acct-card">
            <div className="card-k">Gộp lịch sử của máy này?</div>
            <p className="acct-p">
              Máy này có <b>{pending.days} ngày bay</b> chưa thuộc tài khoản. Gộp vào thì chuỗi ngày, điểm và bộ sưu tập của máy này đi theo tài khoản. Ngày nào tài khoản đã bay rồi thì giữ chuyến của tài khoản.
            </p>
            <div className="home-row">
              <button className="next-btn" disabled={busy} onClick={() => void decide(true)}>Gộp vào tài khoản</button>
              <button className="pill-btn ghost" disabled={busy} onClick={() => void decide(false)}>Bỏ qua</button>
            </div>
            <p className="acct-note">Bỏ qua thì bạn chỉ thấy những gì đã lưu trong tài khoản.</p>
          </section>
        ) : acc ? (
          <section className="card acct-card">
            <div className="card-k">Đã đăng nhập</div>
            <p className="acct-p">
              <b>{acc.name || 'Người thả diều'}</b>
              {acc.email && <span className="acct-mail"> · {acc.email}</span>}
            </p>
            <p className="acct-note">Chuyến bay mới tự đồng bộ. Mở Bilion trên máy khác và đăng nhập cùng tài khoản Google là thấy đủ chuỗi ngày và bộ sưu tập.</p>
            <button className="pill-btn ghost" disabled={busy} onClick={() => void signOut()}>Đăng xuất</button>
          </section>
        ) : (
          <section className="card acct-card">
            <div className="card-k">Giữ chuyến bay của bạn</div>
            <p className="acct-p">Đăng nhập bằng Google để lưu chuỗi ngày, điểm và bộ sưu tập, rồi chơi tiếp trên máy khác. Miễn phí, không bắt buộc.</p>
            {authEnabled ? (
              <button className="next-btn acct-google" disabled={busy} onClick={() => void google()}>
                {busy ? 'Đang mở…' : 'Tiếp tục với Google'}
              </button>
            ) : (
              <p className="acct-note">Đăng nhập sắp có.</p>
            )}
            <p className="acct-note">
              Lần đầu đăng nhập, lịch sử trên máy này thành của tài khoản. Đăng nhập trên máy khác, Bilion hỏi trước khi gộp lịch sử của máy đó. Bilion chỉ nhận tên và email từ Google. <a href="/rieng-tu.html">Quyền riêng tư</a>
            </p>
          </section>
        )}

        {msg && <p className="acct-msg" role="status">{msg}</p>}

        <section className="card">
          <div className="card-k">{acc ? 'Thành tích của tài khoản' : 'Trên máy này'}</div>
          <MyRecord s={st} krill={krillFound()} />
          <p className="acct-note">Chuỗi tính theo số ngày bay liên tiếp; ngày mới bắt đầu lúc 0 giờ, giờ Việt Nam.</p>
        </section>
      </div>
    </main>
  );
}
