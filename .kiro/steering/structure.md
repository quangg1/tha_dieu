---
inclusion: always
---

# Cấu trúc và lệnh

## Nơi để câu hỏi
- `shared/book/release1.ts` … `releaseN.ts`: bộ câu hỏi chính, mỗi file 10–35 câu theo chủ đề. **Câu mới viết vào đây.**
- `shared/book/release.ts`: gom các file release. Tạo file mới thì thêm `import { RELEASEn }` và thêm vào mảng `RELEASE`.
- `shared/book/questions.ts`: ghép toàn bộ sổ câu hỏi; danh sách `RETIRED` là câu đã cho nghỉ (không hỏi nữa).
- `shared/book/calibrate.ts`: chỉnh bậc cho đáp án của các câu cũ (không phải câu release).
- `shared/bank.ts`, `shared/book/more*.ts`, `narrow.ts`: câu cũ, chỉ sửa khi rà lỗi.
- `shared/book/night*.ts`: do scheduled task ca đêm tự sinh, **không sửa tay**.

## Lệnh
- `npm run check:questions`: kiểm tra sổ câu hỏi (trùng id, đáp án lặp, đáp án giấu nằm trong bậc, dấu "?", hạn `until`, câu gần giống nhau). Thêm tên id để chỉ kiểm vài câu: `npm run check:questions -- r-dao`.
- `npx tsc --noEmit -p .`: kiểm tra kiểu.
- `npm test`: chạy toàn bộ test (Vercel cũng chạy lúc build; test hỏng là deploy hỏng).
- Phải chạy cả ba lệnh, không còn **LỖI**, trước khi commit.

## Commit
- Commit nhỏ, mỗi lần một nhóm câu, message tiếng Việt ngắn gọn, ví dụ: `Câu hỏi: thêm 12 câu Ẩm thực, sửa 3 câu mơ hồ`.
- Luôn `git pull --rebase` trước khi push, vì scheduled task ca đêm cũng đẩy commit lên `main`.
