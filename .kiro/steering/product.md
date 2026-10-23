---
inclusion: always
---

# Bilion – đố chữ thả diều mỗi ngày

- Game web tiếng Việt (bilion, repo `quangg1/tha_dieu`), chạy trên Vercel. Push lên nhánh `main` là Vercel tự build và deploy, không cần làm gì thêm trên Vercel.
- Mỗi ngày người chơi trả lời 7 câu dạng "Kể tên một …". Không có đúng sai: đáp án càng ít người nghĩ ra thì càng **hiếm**, điểm càng cao, diều bay càng cao.
- Có 7 bậc hiếm (theo thứ tự trong file câu hỏi): Thường, Khá hiếm, Hiếm, Rất hiếm, Cực hiếm; **Độc nhất** là đáp án làng giấu (trường `k`); **Khôn lỏi** là đáp án tưởng độc mà ai cũng nghĩ ra (máy tự chấm, không cần soạn).
- Người chơi là người Việt phổ thông, nhiều lứa tuổi. Giọng văn thân thiện, đúng chính tả, dùng tiếng Việt có dấu.
- Việc chính trong dự án này: **soạn câu hỏi, đáp án và rà lỗi câu hỏi**. Không sửa logic điểm, giao diện hay server trừ khi được yêu cầu rõ.
- Không bao giờ đọc, in hay commit khóa bí mật, token, file `.env`.

## Một hệ quy chiếu (quyết định thiết kế 23/10/2026)
- **Thế giới trong game chỉ kể chuyến bay hôm nay.** Bầu trời (hoặc sông, biển, sân khấu trong gói chủ đề) luôn bắt đầu từ 0 mỗi ngày; cả làng cùng một vạch xuất phát. Các mốc trên bầu trời (ngọn tre, máy bay, bờ vũ trụ, Cung Trăng…) chỉ có một nghĩa: độ cao diều đạt được hôm nay.
- **Tiến trình dài hạn không phải là một nơi chốn.** Điểm cộng dồn của các chuyến bay ngày thành **danh hiệu** (`shared/titles.ts`: Mới cầm diều → Tập thả → … → Thợ diều → Nghệ nhân → …), cộng với bộ sưu tập (diều mở khoá, album đáp án Độc nhất) và chuỗi ngày. Không đặt tên danh hiệu trùng tên mốc trên bầu trời.
- Gói chủ đề mới chỉ thay thế giới và thước đo của chuyến bay hôm nay; danh hiệu và bộ sưu tập dùng chung (có thể đổi chữ cho hợp không khí), không thêm một "hành trình" không gian thứ hai.
