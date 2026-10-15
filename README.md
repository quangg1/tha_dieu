# Thả Diều

Trò đố chữ mỗi ngày: đáp án càng hiếm, diều càng bay cao. Bảy câu hỏi, một cánh diều sáo, bầu trời không có trần.

## Chạy thử trên máy

```bash
npm install
npm run dev        # API :8787 với Postgres chạy trong bộ nhớ, giao diện :5173
npm test           # kiểm thử khớp đáp án, chấm điểm, API
```

Không cần cơ sở dữ liệu thật khi chạy thử. Không có `ANTHROPIC_API_KEY` thì dùng trọng tài thử nghiệm.

## Triển khai lên Vercel

1. Tạo project Vercel từ repo này (framework: Vite).
2. Vào tab **Storage**, thêm một cơ sở dữ liệu Postgres (Neon). Vercel tự thêm `DATABASE_URL`.
3. Thêm biến môi trường: `ANTHROPIC_API_KEY`, `ADMIN_TOKEN` (một chuỗi ngẫu nhiên dài), tùy chọn `CLAUDE_MODEL`.
4. Deploy, mở `https://<tên-miền>/#admin`, nhập `ADMIN_TOKEN`, bấm **Cài đặt / cập nhật kho câu hỏi**.

## Cấu trúc

- `shared/`: kho câu hỏi, chuẩn hóa tiếng Việt, khớp đáp án, thang hạng và độ cao (dùng chung client và server).
- `server/`: schema Postgres, chấm điểm trên máy chủ, đếm độ hiếm, trọng tài Claude, bảng xếp hạng, quản trị.
- `api/[...path].ts`: một Vercel Function cho mọi đường dẫn `/api/*`.
- `src/scene/sky.ts`: bầu trời canvas, diều và dây diều làm thước độ cao.
- `src/audio/flute.ts`: nhạc sáo ngũ cung tạo bằng Web Audio.
- `src/giaydiep.css`: bộ UI Giấy Điệp.

## Thêm câu hỏi

Thêm vào `shared/bank.ts` (5 tầng đáp án và một đáp án Cung Trăng), chạy `npm test`, deploy, rồi bấm **Cài đặt / cập nhật kho câu hỏi** trong trang quản trị. Đáp án và số đếm cũ được giữ nguyên.
