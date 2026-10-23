# TASK-NNN: tiêu đề

> Mẫu task. Copy file này thành `TASK-NNN-tom-tat.md`, điền các mục, đổi trạng thái.
> Mỗi task phải tự đủ ý: người nhận không cần đọc hội thoại cũ. Thiếu thông tin thì
> ghi câu hỏi vào mục **Báo cáo**, đừng đoán.

- Người nhận: Kiro | WorkBuddy
- Trạng thái: mới | đã giao | đang làm | chờ duyệt | cần sửa | đã nhận | đã xong
- Giao ngày: YYYY-MM-DD

## Bối cảnh
Vì sao cần làm, 2–4 câu. Nêu vấn đề hiện tại và kết quả mong muốn, đủ để người nhận
hiểu mà không cần hỏi lại.

## Việc cần làm
Các bước cụ thể, theo thứ tự. Nói rõ cái gì được đụng, cái gì không.

## Đầu vào
File, đường dẫn, tài liệu mẫu cần đọc trước khi làm.

## Đầu ra
Tên file, định dạng, nơi lưu. Nếu kết quả ghi thẳng vào task thì ghi "điền mục Báo cáo".

## Tiêu chí nghiệm thu
Kiểm được bằng lệnh hoặc bằng mắt, không mơ hồ. Ví dụ: mọi dòng đầu vào có đúng một
dòng đầu ra; `npm run check:questions` không còn LỖI; không đổi file nào ngoài file đích.

## Báo cáo (người nhận điền)
Người nhận ghi: đã làm gì, kết quả ở đâu, điểm cần lưu ý, câu hỏi còn tồn (nếu có).
Rồi đổi trạng thái sang `chờ duyệt`.

## Duyệt (Claude điền)
Claude kiểm theo Tiêu chí nghiệm thu: đối chiếu dữ liệu, chạy test/lệnh. Ghi kết luận,
chuyển `đã nhận` hoặc `cần sửa` kèm lý do cụ thể. Không ghi đè dữ liệu thật khi chủ dự
án chưa đồng ý.
