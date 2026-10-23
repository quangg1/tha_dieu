# Quyết định đã chốt

Mỗi dòng: ngày · quyết định · lý do.

- 2026-10-23 · Đáp án do trọng tài AI duyệt không còn mặc định "Cực hiếm". Bậc đầu theo độ quen của từ (mức 5 → Thường, 3–4 → Khá hiếm, còn lại → Hiếm) · từ thiếu trong sổ thường là từ quen; 210 điểm cho "chim cánh cụt" là lệch. Quy tắc này mới là phán đoán, cần hiệu chỉnh bằng dữ liệu người chơi (`shared/book/familiar.ts`).
- 2026-10-23 · Đáp án Độc nhất (Krill) của câu sinh từ kho từ vựng không chọn từ có độ quen ≥ 3 · Độc nhất phải là một phát hiện thật.
- 2026-10-23 · Gỡ bẫy Khôn lỏi "Thú mỏ vịt", "Sóc bay" · là đáp án hiếm thật, không phải đáp án ai cũng nghĩ tới.
- 2026-10-23 · Độ hiếm tính theo từng câu hỏi, không theo từ toàn cục · cùng một từ có thể thường ở câu này và hiếm ở câu khác.
- 2026-10-23 · Không bàn lại ngưỡng chia bậc `[0.30, 0.60, 0.85, 0.96]` theo kiểu đếm số mục trong sổ · báo cáo WorkBuddy đếm mục trong sổ, không đếm lượt gõ của người chơi.
- 2026-10-23 · Thang độ quen 1–5 cần rubric viết tay có ví dụ neo và hiệu chỉnh bằng dữ liệu người chơi (xem TASK-001) · hiện chỉ là số gán tay không có định nghĩa.
- 2026-10-23 · Không dùng cookie/token đăng nhập của dịch vụ khác để nối model · vi phạm điều khoản và rủi ro tài khoản. Phối hợp qua file.
- 2026-10-23 · Chấm độ quen **không** chuẩn hoá phân bố, chấp nhận 50,9% từ ở mức 1 · danh sách là tên cấp loài; kéo từ hiếm lên cho đều mức chính là tái tạo đúng lỗi "thang bị nén về phía hiếm" mà cả hai bên đang sửa. Phân bố lệch là dữ liệu, không phải khuyết điểm.
- 2026-10-23 · Từ không xác nhận được là tên loài có thật thì ghi mức 1 kèm `?` ở cột `ghi_chu`, không đoán mức · đoán sẽ tạo outlier giả rất khó truy nguyên; `?` cho phép người duyệt lọc riêng ra soát tay. Hiện có 7 dòng: Mỏ hạ, Cá thu ảo, Mọt cánh, Ong khoái, Ve kim, Đon, Đồi.
- 2026-10-23 · Hai tên cùng một con vật thì chấm theo tên người ta hay gọi nhất · `Cá mặt trăng` = 3 nhưng `Cá mặt trăng khổng lồ` = 1 dù cùng loài; tên dài không ai dùng nên không phải mâu thuẫn khi so ba nguồn.
- 2026-10-23 · WorkBuddy chỉ trả file kết quả, không sửa `prior_tier` hay bất kỳ số nào trong repo · quyền ghi đè dữ liệu thật thuộc chủ dự án; mọi thay đổi phải qua đối chiếu và duyệt trước.
- 2026-10-23 · Chấm bằng dãy số kèm đối chiếu từ đầu/cuối dải thay vì gõ lại tên từ · cột `word` được copy nguyên từ file đầu vào nên không có rủi ro sai dấu tiếng Việt, và lệch dòng bị script bắt tự động (2.209/2.209, 0 lệch).
- 2026-10-23 · Rubric độ quen dùng thang pop 1–5 khớp đúng số đứng đầu mỗi dòng trong `shared/book/lex/*.ts`, 5 = quen nhất, 1 = lạ nhất · tận dụng số đã có sẵn trong kho, không đẻ thang thứ hai; người chấm so trực tiếp với từ đang nằm trong file.
- 2026-10-23 · Ví dụ neo trong rubric phải là từ có thật trong đúng file kho, lấy nguyên mức đang gán · neo bằng ví dụ cụ thể thì nhiều người chấm mới ra số gần nhau; neo bịa làm lệch chuẩn.
- 2026-10-23 · Chấm độ quen theo người Việt phổ thông mọi lứa tuổi, không theo người địa phương hay dân chuyên ngành · đồ xưa và đặc sản vùng nghiêng về mức thấp, tránh gán quen quá tay cho từ chỉ một nhóm biết.
- 2026-10-23 · Ví dụ neo và dữ liệu lượt gõ thật mâu thuẫn thì dữ liệu thắng · rubric mới là phán đoán, phải hiệu chỉnh bằng `familiar.ts`.
- 2026-10-23 · Hai model của WorkBuddy (DeepSeek v4.1 Flash, HY3) chấm song song hai kho khác nhau, cộng cùng một bộ 120 từ động vật đã có bản chấm trước · chấm hai kho rời nhau thì không so được thang của hai bên; bộ chồng 120 từ là cách rẻ nhất để biết một model có chấm cao hơn model kia một cách hệ thống hay không trước khi dùng số của bên nào.
- 2026-10-23 · Bộ 120 từ đối chiếu lấy cách đều trong từng mức của bản chấm TASK-001 (24 từ mỗi mức) · lấy mẫu ngẫu nhiên sẽ thiếu mức 4–5 (chỉ 9% kho động vật), mà chỗ lệch đáng lo nhất lại nằm ở đầu quen.
- 2026-10-23 · Phiếu chấm giao cho model chỉ có hai cột `lexicon · word`, cố tình không ghi `pop` hiện tại · thấy số cũ là mất tính độc lập, bản chấm thành bản xác nhận.
- 2026-10-23 · Kho giao: DeepSeek v4.1 Flash chấm `monan` (3.198 từ), HY3 chấm `thucvat` (4.586 từ) · hai kho lớn nhất còn lại; giao mỗi bên một kho để hai bản chấm bù phủ cho nhau thay vì trùng nhau.

