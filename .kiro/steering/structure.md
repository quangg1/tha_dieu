---
inclusion: always
---

# Cấu trúc và lệnh

## Sổ câu hỏi nằm trong database, không nằm trong file
- **Database là nguồn chính** (bảng `book`). Các file trong `shared/book` chỉ là **cửa nhận câu mới**: mỗi lần deploy, câu có `id` mà database chưa có sẽ được thêm vào; câu đã có thì **bị bỏ qua**.
- Vì vậy: **thêm câu mới** thì viết vào file release như bên dưới. **Sửa câu đã có** (chữ, đáp án, bậc, hạn dùng, cho nghỉ) thì **không sửa trong file**, vì deploy sẽ không áp dụng; sửa ở trang admin, tab "Kho câu hỏi" (nút Sửa, Tạm dừng, Bật lại).
- Trang admin có nút tải bản sao lưu toàn bộ sổ (JSON) và mục "Khác với file trong mã".
- Kiểm tra `npm run check:questions` chỉ kiểm tra các file trong mã, không kiểm tra những gì đã sửa trong database.

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
