// A daily reminder without accounts or push servers: a repeating event in the player's own calendar, at the hour they
// pick. Google Calendar opens with the event filled in; other calendars (iPhone, Outlook) take the .ics file.
import { useState } from 'react';
import { track } from '../track';
import { CloseIcon } from '../glyphs';

const HOURS: [number, string][] = [
  [7, '7 giờ sáng'],
  [12, '12 giờ trưa'],
  [20, '8 giờ tối'],
];

const SITE = 'https://bilion-vn.vercel.app';
const TITLE = 'Thả diều Bilion 🪁';
const DETAILS = `Bảy câu hỏi mới đang chờ. Đáp án càng hiếm, diều càng bay cao. ${SITE}`;

/** The next day at that hour in Vietnam, as a UTC calendar stamp (20261020T130000Z). */
function startStamp(hour: number, minutes = 0): string {
  const now = new Date();
  const vn = new Date(now.getTime() + 7 * 3600_000);
  const start = new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate() + 1, hour - 7, minutes));
  return start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function googleLink(hour: number) {
  const s = startStamp(hour);
  const e = startStamp(hour, 10);
  const p = new URLSearchParams({ action: 'TEMPLATE', text: TITLE, details: DETAILS, dates: `${s}/${e}`, recur: 'RRULE:FREQ=DAILY' });
  return `https://calendar.google.com/calendar/render?${p}`;
}

function icsFile(hour: number) {
  const s = startStamp(hour);
  const e = startStamp(hour, 10);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bilion//Tha Dieu//VI',
    'BEGIN:VEVENT',
    `UID:bilion-daily-${hour}@bilion-vn.vercel.app`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART:${s}`,
    `DTEND:${e}`,
    'RRULE:FREQ=DAILY',
    `SUMMARY:${TITLE}`,
    `DESCRIPTION:${DETAILS}`,
    `URL:${SITE}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${TITLE}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
}

export function RemindSheet({ onClose }: { onClose: () => void }) {
  const [hour, setHour] = useState(20);
  const download = () => {
    const url = URL.createObjectURL(icsFile(hour));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bilion-nhac-choi.ics';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    track('remind', { hour, how: 'ics' });
  };
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Nhắc chơi mỗi ngày" onClick={onClose}>
      <section className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>Nhắc chơi mỗi ngày</h2>
          <button className="sheet-x" onClick={onClose} aria-label="Đóng">
            <CloseIcon />
          </button>
        </div>
        <div className="fb-form">
          <p className="sup-note" style={{ margin: 0 }}>Bilion thêm một lời nhắc lặp lại mỗi ngày vào lịch trên máy bạn. Muốn tắt thì xóa sự kiện đó trong lịch.</p>
          <div className="fb-kinds" role="radiogroup" aria-label="Giờ nhắc">
            {HOURS.map(([h, l]) => (
              <button key={h} role="radio" aria-checked={hour === h} className={`fb-kind${hour === h ? ' on' : ''}`} onClick={() => setHour(h)}>
                {l}
              </button>
            ))}
          </div>
          <a className="next-btn remind-btn" href={googleLink(hour)} target="_blank" rel="noreferrer" onClick={() => track('remind', { hour, how: 'google' })}>
            Thêm vào Google Lịch
          </a>
          <button className="pill-btn ghost" onClick={download}>
            Lịch iPhone và máy khác
          </button>
        </div>
      </section>
    </div>
  );
}
