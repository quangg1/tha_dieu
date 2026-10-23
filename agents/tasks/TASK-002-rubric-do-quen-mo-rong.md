# TASK-002: ví dụ neo cho rubric độ quen ở các nhóm khác

- Người nhận: Kiro
- Trạng thái: đã giao
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

## Duyệt (Claude điền)
