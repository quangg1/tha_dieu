# Điểm kiểm tra

_Mới nhất ở trên._

## 2026-10-23 20:40
- **Đã giao, chạy song song:** TASK-003 (WorkBuddy · DeepSeek v4.1 Flash — kho `monan`, 3.198 từ) và TASK-004 (WorkBuddy · HY3 — kho `thucvat`, 4.586 từ). Mỗi bên chấm thêm cùng một bộ `tu_doi_chieu_dongvat_120.tsv` để đo đồng thuận với bản chấm TASK-001.
- Phiếu chấm sinh bằng `scripts/emit-lex-tsv.ts`, chỉ hai cột `lexicon · word` (không ghi `pop` hiện tại). Packet đủ cho cả hai model đã nằm trong `bilion-rarity-audit`: `TASK-003.md`, `TASK-004.md`, `RUBRIC.md`, `rubric-do-quen.md`, ba file TSV.
- **Chờ duyệt (chưa làm):** TASK-001 (WorkBuddy, kho động vật), TASK-002 (Kiro, `docs/rubric-do-quen.md`).
- **Chờ chủ dự án:** chuyển TASK-003 và TASK-004 cho hai model; các bước SQL trên production (reset người chơi, redraw, xóa 106 câu); truy vấn số 2 của báo cáo WorkBuddy.
- **Tiếp theo (Claude):** duyệt TASK-001 và TASK-002; khi có hai bản chấm mới thì so ba nguồn trên 120 từ chồng nhau trước khi dùng số của bên nào.

## 2026-10-23 20:45
- **Đã làm (WorkBuddy): xong TASK-001.** Chấm 2.209 từ động vật → `bilion-rarity-audit/tu_dong_vat_workbuddy.tsv` (2.209 dòng, 4 cột, 0 lệch so với đầu vào). Task chuyển `chờ duyệt`, mục Báo cáo đã điền đủ.
  - Phân bố: mức 5 · 73 (3,3%) · mức 4 · 126 (5,7%) · mức 3 · 285 (12,9%) · mức 2 · 601 (27,2%) · mức 1 · 1.124 (50,9%). Không chuẩn hoá (lý do ở `decisions.md`).
  - 14/14 từ neo của RUBRIC khớp đúng mức. 7 dòng đánh `?` (tên không xác nhận được là loài thật).
- **Đang chờ duyệt: TASK-001.** Việc của Claude: so với số hiện tại và bản chấm riêng, liệt kê từ lệch ≥ 2 mức. Ba từ của ca outlier đã có số độc lập: Chim cánh cụt **4**, Lươn **5**, Cá ngựa **4** — nên 210đ cho hai từ đầu và 15đ cho cá ngựa đều sai.
- **Đang chờ làm: TASK-002** (Kiro viết `docs/rubric-do-quen.md` cho các nhóm kho khác).
- **Chờ chủ dự án:** chạy truy vấn số 2 của báo cáo WorkBuddy trên production và gửi kết quả; các bước SQL trên production (reset người chơi, redraw, xóa 106 câu).
- **Tiếp theo:** Claude duyệt TASK-001. Nếu `đã nhận` → dùng bảng độ quen này để so lại `prior_tier` của kho động vật. Nếu `cần sửa` → WorkBuddy chấm lại đúng các dòng bị đánh dấu. WorkBuddy chấm tiếp nhóm kho khác ngay khi có TSV `lexicon · word`.

## 2026-10-23 20:30
- Đã làm (Claude): bậc đầu cho đáp án trọng tài theo độ quen; Krill không là từ quen; gỡ 2 bẫy. Đã push (5213c6c).
- Đang chờ: TASK-001 (WorkBuddy chấm 2.209 từ động vật), TASK-002 (Kiro viết ví dụ neo các nhóm khác).
- Chờ chủ dự án: chạy truy vấn số 2 của báo cáo WorkBuddy trên production và gửi kết quả; các bước SQL trên production (reset người chơi, redraw, xóa 106 câu).
- Tiếp theo (Claude): chấm độc lập kho động vật, so ba nguồn, đề xuất sửa.

## 2026-10-23 21:30
- Đã làm (Kiro, TASK-002): viết `docs/rubric-do-quen.md` — thang pop 1–5, ví dụ neo cho 6 nhóm kho (monan, douong, diaphuong, dovat, nhanvat, thucvat), mục "những chỗ dễ nhầm". Mọi từ ví dụ lấy từ `shared/book/lex/*.ts`, nguyên mức đang gán. Chỉ đụng file docs này.
- Đã làm (Kiro): cập nhật `tasks/_mau.md` thành mẫu task đủ 7 mục (bối cảnh, việc cần làm, đầu vào, đầu ra, tiêu chí nghiệm thu, Báo cáo, Duyệt), thêm hướng dẫn điền. Ghi 4 quyết định rubric vào `decisions.md`.
- TASK-002: đổi trạng thái sang `chờ duyệt`, chờ Claude duyệt theo tiêu chí nghiệm thu.
- Đang chờ: TASK-001 (WorkBuddy chấm 2.209 từ động vật).
- Chờ chủ dự án: các bước SQL trên production (reset người chơi, redraw, xóa 106 câu); truy vấn số 2 của báo cáo WorkBuddy.
- Lưu ý: chưa commit/push — chờ chủ dự án xem rubric trước (HITL).
