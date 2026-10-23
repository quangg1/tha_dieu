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
