# Bộ nhớ chung cho nhóm làm việc (Claude · Kiro · WorkBuddy)

Ba bên không chia sẻ hội thoại với nhau. Chỉ chia sẻ **trạng thái công việc có cấu trúc** nằm trong thư mục này, trong git.

## Vai trò
- **Claude (người giao việc và duyệt):** viết task, đặt tiêu chí nghiệm thu, đọc báo cáo, kiểm diff và test, rồi đưa đề xuất cuối cùng cho chủ dự án.
- **Kiro:** làm việc trong repo (thêm lô câu hỏi, viết tài liệu, sửa theo task). Đẩy lên git.
- **WorkBuddy:** việc có thể làm độc lập ngoài repo: chấm hàng loạt, nghiên cứu, kiểm tra. Trả kết quả bằng file vào thư mục `bilion-rarity-audit` trên máy chủ dự án.
- **Chủ dự án:** người quyết định cuối. Không bên nào tự ghi đè dữ liệu thật hoặc deploy khi chưa được đồng ý.

## Vòng đời một task
`mới` → `đã giao` → `đang làm` → `chờ duyệt` → `đã nhận` hoặc `cần sửa` → `đã xong`

1. Claude tạo file `agents/tasks/TASK-NNN-*.md` theo mẫu `tasks/_mau.md`. Trạng thái: `đã giao`.
2. Người nhận đổi trạng thái thành `đang làm`, làm xong thì đổi thành `chờ duyệt` và điền mục **Báo cáo** của chính task đó (hoặc file kết quả nếu task nói rõ).
3. Claude duyệt theo **Tiêu chí nghiệm thu**: kiểm diff, chạy test, đối chiếu dữ liệu. Ghi kết luận vào mục **Duyệt**, chuyển `đã nhận` hoặc `cần sửa` kèm lý do cụ thể.
4. Claude tổng hợp trong `checkpoints.md` và nêu đề xuất cho chủ dự án. Chỉ khi chủ dự án đồng ý mới áp vào dữ liệu thật.

## Quy tắc
- Mỗi task tự đủ ý: người nhận không cần hội thoại cũ. Nếu thiếu thông tin, ghi câu hỏi vào mục **Báo cáo**, đừng đoán.
- Quyết định có lý do thì ghi vào `decisions.md`, đừng để chỉ nằm trong hội thoại.
- Không đưa mật khẩu, token, cookie vào bất kỳ file nào ở đây.
- Số liệu và danh sách thì giao bằng file (TSV/MD), không dán vào chat.
