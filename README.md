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
3. Thêm biến môi trường: `ADMIN_TOKEN` (một chuỗi ngẫu nhiên dài) và khóa trọng tài: `ANTHROPIC_API_KEY` hoặc `GEMINI_API_KEY` (tùy chọn `CLAUDE_MODEL`, `GEMINI_MODEL`). Không có khóa nào thì đáp án lạ chỉ được nhắc thử lại, không bị mất lượt.
4. Deploy, mở `https://<tên-miền>/#admin`, nhập `ADMIN_TOKEN`, bấm **Cài đặt / cập nhật kho câu hỏi**.

## Cấu trúc

- `shared/book/lex/`: **sổ làng**, khoảng 10.000 mục chia 25 nhóm (động vật, thực vật, món ăn, tỉnh thành, quốc gia, nhân vật, nghề, đồ vật, từ láy…). Mỗi dòng: `[độ quen 1–5] Tên|tên khác # nhãn ^ phụ`.
- `shared/book/questions.ts`: câu hỏi sinh từ nhãn (`dongvat` + `chim`…), luật chơi chữ (bắt đầu bằng chữ, số tiếng, tiếng đầu), câu chéo chủ đề và câu về con số; cộng với kho viết tay `shared/bank.ts` được bổ sung thêm đáp án từ sổ.
- `shared/match.ts`: khớp đáp án theo dấu thanh (dê ≠ dế), bỏ từ loại đứng trước (“con”, “tỉnh”…), không dấu thì hỏi lại khi trùng nhiều đáp án, gõ nhầm thì hỏi lại.
- `shared/`: chuẩn hóa tiếng Việt, thang hạng và độ cao (dùng chung client và server).
- `server/`: schema Postgres, chấm điểm, đếm độ hiếm, bộ 7 câu mỗi ngày (dễ → khó, khác chủ đề, không lặp trong 6 tuần), trọng tài Claude, hàng chờ trưởng làng, bảng xếp hạng.
- `api/[...path].ts`: một Vercel Function cho mọi đường dẫn `/api/*`.
- `src/scene/sky.ts`: bầu trời canvas, diều và dây diều làm thước độ cao.
- `src/audio/flute.ts`: nhạc sáo ngũ cung tạo bằng Web Audio.
- `src/giaydiep.css`: bộ UI Giấy Điệp.

## Thêm đáp án và câu hỏi

- Thêm dòng vào một tệp trong `shared/book/lex/`, chạy `npx tsx scripts/check-book.ts` để xem các dòng bị gộp và tên trùng.
- Thêm câu hỏi vào `SPECS` trong `shared/book/questions.ts`, chạy `npx tsx scripts/report-book.ts <id>` để xem số đáp án và độ hiếm khởi điểm.
- Chạy `npm test` rồi deploy. Máy chủ tự đồng bộ bảng câu hỏi khi phiên bản sổ thay đổi; đáp án nằm trong mã, cơ sở dữ liệu chỉ giữ đáp án do người chơi và trưởng làng bổ sung.
