# TASK-002: ví dụ neo cho rubric độ quen ở các nhóm khác

- Người nhận: Kiro
- Trạng thái: đã nhận
- Giao ngày: 2026-10-23

## Bối cảnh
`agents/` có thang độ quen 1–5 cho động vật (xem `RUBRIC.md` trong TASK-001). Các kho khác (món ăn, địa danh, đồ vật, người nổi tiếng, tác phẩm) cần ví dụ neo riêng thì mới chấm nhất quán.

## Việc cần làm
Tạo `docs/rubric-do-quen.md` gồm: định nghĩa chung của thang 1–5; với mỗi nhóm kho ở `shared/book/lex/` (chọn tối thiểu: monan, douong, diaphuong, dovat, nhanvat, thucvat) cho 3–5 từ neo ở mỗi mức; một mục "những chỗ dễ nhầm" (tên vùng miền, tên Hán Việt, từ nước ngoài). Mọi ví dụ phải là từ có thật trong kho đó.

## Đầu vào
Mẫu: nội dung RUBRIC.md ở TASK-001. Kho: `shared/book/lex/*.ts`.

## Đầu ra
`docs/rubric-do-quen.md` trong repo, đẩy lên git.

## Tiêu chí nghiệm thu
- Mỗi nhóm kho có đủ 5 mức, mỗi mức ít nhất 3 từ.
- Mọi từ ví dụ tìm được trong file kho tương ứng.
- Không thay đổi file nào ngoài `docs/rubric-do-quen.md`.

## Báo cáo (người nhận điền)
Đã tạo `docs/rubric-do-quen.md`:
- Định nghĩa chung thang pop 1–5, khớp số đứng đầu mỗi dòng trong `shared/book/lex/*.ts` (5 = quen nhất, 1 = lạ nhất), kèm bảng khoảng người nói ra /100 và câu hỏi gốc khi chấm.
- Ví dụ neo cho đủ 6 nhóm yêu cầu: monan, douong, diaphuong, dovat, nhanvat, thucvat. Mỗi nhóm có đủ 5 mức, mỗi mức ≥ 3 từ. Mọi từ lấy nguyên văn và nguyên mức từ file kho tương ứng.
- Mục "những chỗ dễ nhầm": tên vùng miền, tên Hán Việt / tên gọi khác, từ nước ngoài, đồ dùng/khái niệm xưa, đặc sản/giống mới.
- Chỉ đụng `docs/rubric-do-quen.md`, không sửa file nào khác.

Điểm cần Claude kiểm:
- Mức gán trong ví dụ neo lấy từ file kho; nếu Claude thấy mức nào trong file vốn đã lệch thì ghi vào mục Duyệt — rubric chỉ trích dẫn, không sửa kho.
- `diaphuong` chỉ có mức 1 cho 2 tỉnh (Bắc Kạn, Hậu Giang), đã liệt kê đủ 2 từ ở mức 1; tiêu chí "mỗi mức ≥ 3 từ" cho nhóm này không đạt được vì kho chỉ có 2 tỉnh mức 1. Cần Claude xác nhận chấp nhận hay muốn bổ sung cách xử lý.

Chưa commit/push — chờ chủ dự án xem (HITL).

## Duyệt (Claude điền)
Chủ dự án duyệt 2026-10-23. Ngoại lệ `diaphuong` mức 1 chỉ có 2 tỉnh (Bắc Kạn, Hậu Giang) được chấp nhận: kho thật chỉ có 2 tỉnh ở mức đó, không bịa thêm từ để đủ 3. Rubric chỉ trích dẫn mức sẵn có trong kho, không sửa kho. Đã commit và push.
