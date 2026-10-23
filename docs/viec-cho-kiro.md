> Cập nhật 23/10/2026 (chiều): đã gỡ 106 câu không đạt; **đọc `docs/cau-da-go.md` trước khi soạn lô mới** (danh sách câu gỡ, bốn phép thử và kho đang thiếu gì).
> Cập nhật 23/10/2026: sổ câu hỏi giờ nằm trong database. Câu mới vẫn viết vào file release (tự được thêm khi deploy); sửa câu cũ thì làm ở trang admin. Xem `.kiro/steering/structure.md`.

# Việc giao cho Kiro: kho câu hỏi

Đọc trước `.kiro/steering/` (đặc biệt `questions.md`). Mỗi việc làm xong thì chạy `npm run check:questions`, `npx tsc --noEmit -p .`, `npm test`, rồi commit và push.

## Việc 1: lệnh "Sức khỏe kho câu hỏi" (`npm run report:pool`)

Tạo `scripts/report-pool.ts` và thêm script `report:pool` vào `package.json`. Lệnh in ra, bằng tiếng Việt, dễ đọc:

1. **Tổng quan**: số câu đang dùng (bỏ `RETIRED` và câu thời sự đã hết hạn), số câu mới hoàn toàn còn đủ bao nhiêu ngày (chia 7).
2. **Theo mức khó** (`level` 1/2/3) và **theo chủ đề**: số câu mỗi nhóm; đánh dấu nhóm thiếu so với nhu cầu của bộ chọn câu trong 42 ngày (mức 1 cần ≥ 84 câu, mức 2 ≥ 126, mức 3 ≥ 84; câu đại chúng không thời sự ≥ 100).
3. **Câu thời sự**: danh sách kèm ngày hết hạn, xếp theo hạn gần nhất; báo câu hết hạn trong 30 ngày tới.
4. **Giả lập 365 ngày** theo đúng luật của `dailySet` trong `server/service.ts` (mức khó, chỗ đại chúng 2 và 5, chỗ thời sự 4, không trùng chủ đề, cửa sổ 42 ngày): báo ngày đầu tiên phải lặp câu trong 42 ngày, nếu có. Logic chọn câu nên tách ra một hàm dùng chung cho cả server và script để không lệch nhau.

Không cần database cho bước 1–4. Tùy chọn (bước 5, cần `DATABASE_URL` nên chỉ chạy khi có): đọc bảng `daily_sets` để biết mỗi câu hỏi lần cuối khi nào, và bảng `turns`/`asks` để tính cho từng câu số người chơi, tỉ lệ hết giờ không trả lời, điểm trung bình, số lần bị báo (`reports`). Liệt kê 10 câu "đáng xem lại" (bỏ trống nhiều, điểm trung bình bất thường, bị báo nhiều). Không in thông tin người chơi.

## Việc 2: soạn câu mỗi tuần

Nhịp: **20–30 câu mỗi tuần**, trong đó **3–5 câu thời sự** (có `until`, tìm web xác minh tin). Trước mỗi đợt chạy `npm run report:pool` và ưu tiên:
1. **Câu khó `lv:3`** (đang thiếu nhiều nhất): đáp án phổ biến vẫn có, nhưng phần lớn đáp án cần hiểu biết sâu.
2. **Câu đại chúng không thời sự** (phim, nhạc, món ăn, thương hiệu, công nghệ) cho đủ ≥ 100.
3. Chủ đề còn ít câu.
Mỗi đợt một file `shared/book/releaseN.ts` mới; message commit ghi số câu theo chủ đề và mức khó.

## Việc 3: rà lỗi câu cũ (mỗi đợt một ít)

Theo mục "Rà lỗi câu hỏi cũ" trong `questions.md`. Ưu tiên các câu mà `report:pool` đánh dấu "đáng xem lại".
