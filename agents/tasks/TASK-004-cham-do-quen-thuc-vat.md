# TASK-004: chấm độ quen kho thực vật (HY3)

- Người nhận: WorkBuddy · model **HY3**
- Trạng thái: đã giao
- Giao ngày: 2026-10-23

## Bối cảnh
Độ quen (1–5) trong kho từ vựng đang là số gán tay, chưa có định nghĩa. Kho động vật đã có một bản chấm độc lập (TASK-001). Giờ cần chấm tiếp các kho lớn còn lại, và cần biết hai model chấm có cùng một thang hay không — nên hai model chấm song song hai kho khác nhau, cộng thêm **cùng một bộ 120 từ động vật** để đo mức đồng thuận.

Bạn làm độc lập. Đừng tham khảo kết quả của model kia, và đừng cố đoán số đang có trong repo — phiếu chấm cố tình không ghi số cũ.

## Việc cần làm
1. Đọc `RUBRIC.md` và `rubric-do-quen.md` (thang chung + ví dụ neo theo từng nhóm kho).
2. Chấm từng từ trong `tu_thucvat_can_cham.tsv` theo thang 1–5.
3. Chấm tiếp 120 từ trong `tu_doi_chieu_dongvat_120.tsv` theo đúng thang đó.
4. Chấm độc lập từng từ. **Không** điều chỉnh để các mức phân bố đều: phân bố lệch là dữ liệu, không phải khuyết điểm.
5. Từ không xác nhận được là có thật, hoặc trông như viết sai/dịch máy: ghi mức 1 và đặt `?` ở cột `ghi_chu`.
6. Không sửa file nào trong repo. Chỉ trả file kết quả.

## Đầu vào
Trong thư mục `bilion-rarity-audit`: `RUBRIC.md`, `rubric-do-quen.md`, `PROMPT.md`, `tu_thucvat_can_cham.tsv`, `tu_doi_chieu_dongvat_120.tsv`.

## Đầu ra
Hai file, 4 cột `lexicon  word  pop  ghi_chu`, tab ngăn cách, có dòng tiêu đề, UTF-8 không BOM, LF:
- `tu_thucvat_hy3.tsv`
- `tu_doi_chieu_dongvat_hy3.tsv`

## Tiêu chí nghiệm thu
- `tu_thucvat_hy3.tsv`: đúng 4.586 dòng dữ liệu, cùng thứ tự và nguyên văn hai cột đầu với đầu vào.
- `tu_doi_chieu_dongvat_hy3.tsv`: đúng 120 dòng dữ liệu, cùng thứ tự và nguyên văn hai cột đầu với `tu_doi_chieu_dongvat_120.tsv`.
- `pop` là số nguyên 1–5, không để trống.
- Mục Báo cáo có bảng phân bố của cả hai file.

## Báo cáo (người nhận điền)
Ghi: đã làm gì, hai file ở đâu, bảng phân bố, những từ tự thấy khó chấm, câu hỏi còn tồn.
Rồi đổi trạng thái sang `chờ duyệt`.

## Duyệt (Claude điền)
Claude kiểm số dòng và thứ tự, rồi so ba nguồn trên 120 từ động vật (TASK-001, TASK-004, và kho trong repo): báo tỉ lệ khớp tuyệt đối, tỉ lệ lệch ≤ 1 mức, và danh sách lệch ≥ 2 mức. Nếu hai model lệch hệ thống (một bên luôn chấm cao hơn) thì ghi vào `decisions.md` trước khi dùng số của bên nào. Không ghi đè số cũ khi chủ dự án chưa đồng ý.
