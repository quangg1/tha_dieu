# Quyết định đã chốt

Mỗi dòng: ngày · quyết định · lý do.

- 2026-10-23 · Đáp án do trọng tài AI duyệt không còn mặc định "Cực hiếm". Bậc đầu theo độ quen của từ (mức 5 → Thường, 3–4 → Khá hiếm, còn lại → Hiếm) · từ thiếu trong sổ thường là từ quen; 210 điểm cho "chim cánh cụt" là lệch. Quy tắc này mới là phán đoán, cần hiệu chỉnh bằng dữ liệu người chơi (`shared/book/familiar.ts`).
- 2026-10-23 · Đáp án Độc nhất (Krill) của câu sinh từ kho từ vựng không chọn từ có độ quen ≥ 3 · Độc nhất phải là một phát hiện thật.
- 2026-10-23 · Gỡ bẫy Khôn lỏi "Thú mỏ vịt", "Sóc bay" · là đáp án hiếm thật, không phải đáp án ai cũng nghĩ tới.
- 2026-10-23 · Độ hiếm tính theo từng câu hỏi, không theo từ toàn cục · cùng một từ có thể thường ở câu này và hiếm ở câu khác.
- 2026-10-23 · Không bàn lại ngưỡng chia bậc `[0.30, 0.60, 0.85, 0.96]` theo kiểu đếm số mục trong sổ · báo cáo WorkBuddy đếm mục trong sổ, không đếm lượt gõ của người chơi.
- 2026-10-23 · Thang độ quen 1–5 cần rubric viết tay có ví dụ neo và hiệu chỉnh bằng dữ liệu người chơi (xem TASK-001) · hiện chỉ là số gán tay không có định nghĩa.
- 2026-10-23 · Không dùng cookie/token đăng nhập của dịch vụ khác để nối model · vi phạm điều khoản và rủi ro tài khoản. Phối hợp qua file.
