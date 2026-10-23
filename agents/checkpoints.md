# Điểm kiểm tra

_Mới nhất ở trên._

## 2026-10-23 21:30
- **Duyệt lần hai TASK-004: `đã nhận`.** Sửa đúng 11 ô, không rộng hơn. Kiểm chéo bằng phân bố: từ 11 mức chốt suy ra mức 1 −2, mức 2 0, mức 3 −1, mức 4 +1, mức 5 +2 — khớp **cả năm mức** với phân bố thật (1.845→1.843, 1.446→1.446, 801→800, 411→412, 83→85). Có ô thứ 12 bị sửa thì ít nhất một dòng phải lệch. 0 từ còn chấm hai mức, 37/37 neo đúng, file 120 từ md5 không đổi.
- **Điều cả hai bên chưa nói ra:** cả 11 ca trùng đều là **dòng bí danh** của hai mục khác nghĩa (`Gạo` = bí danh của `Hoa gạo` pop 4 và `Lúa` pop 5; `Mắm` của `Nước mắm` 5 và `Cây Mắm` 1; `Gỗ lim` của `Lim` 3 và `Cây gỗ lim` 1…). Không phải khuyết điểm của người chấm mà là hệ quả trực tiếp của phiếu rải mọi tên thành dòng riêng. Phiếu đã sửa làm cả lớp lỗi này mất hẳn — quy tắc "lấy nghĩa phổ thông hơn" vẫn đúng nhưng từ nay không có chỗ dùng. Ngoại lệ: `Măng tre` vừa là tên chính (kho pop 1) vừa là bí danh của `Măng` (pop 3); chốt 4 nằm trong danh sách 380 ca "kho chấm lạ quá tay".
- Hai chỗ báo cáo ghi sai tên mục, không đổi kết luận: `Gạo` mức 4 là bí danh của `Hoa gạo` (kho không có mục `Cây gạo`); `Lim` trong kho là pop 3 chứ không phải 4.
- **Trạng thái bốn task:** TASK-001 `chờ duyệt` · TASK-002 `đã nhận` · TASK-003 `đã nhận` · TASK-004 `đã nhận`.
- **Hai việc phải chốt trước khi áp số vào kho:** (1) hiệu chỉnh thang của DeepSeek, nó chấm thấp hơn TASK-001/HY3 ~0,4 mức; (2) có áp hướng "kho chấm lạ quá tay" cho `monan` và `thucvat` hay không, và áp theo từng từ chứ không bằng hệ số chung.
- **Chờ chủ dự án:** các bước SQL trên production (reset người chơi, redraw, xóa 106 câu); truy vấn số 2 của báo cáo WorkBuddy; xác nhận TASK-001 do model nào chấm.

## 2026-10-23 21:40
- **Đã sửa xong TASK-004, giao lại.** Đúng 11 từ trùng bị chấm hai mức như mục Duyệt nêu — sửa 11 ô, không chấm lại dòng nào khác. Quét lại toàn file: 149 từ xuất hiện nhiều lần (301 dòng), khớp danh sách Claude, không thêm không bớt. `tu_doi_chieu_dongvat_hy3.tsv` không có từ trùng nên không đụng.
- Mức chốt: `Gạo` 5 · `Mắm` 5 · `Gỗ lim` 4 · `Măng tre` 4 · `Tỏi Lý Sơn` 3 · `Nghệ đen` 2 · `Tỏi đen` 2 · `Hồ đào` 2 · `Ngải bún` 1 · `Cashew` 1 · `Monstera` 1. Lý do từng từ ở mục Báo cáo TASK-004.
- Phân bố `thucvat` sau khi sửa: 1 · 1.843 (40,2%) · 2 · 1.446 (31,5%) · 3 · 800 (17,4%) · 4 · 412 (9,0%) · 5 · 85 (1,9%). Mức 5 giờ đúng bằng 142 − 57, khớp phép tính trong báo cáo (trước khi gộp thì lệch 2 vì `Gạo` và `Mắm` còn nằm ở 4 và 3).
- Kiểm lại: 4.586 dòng, 0 lệch thứ tự/nguyên văn, `pop` nguyên 1–5, **0 từ còn lệch mức**, 37/37 neo đúng, 9 dòng `?` giữ nguyên.
- **Nhận lỗi 26 cặp tiếng Anh bị bỏ sót:** phần lớn script có bắt nhưng tôi tự loại vì "cả hai đều thấp" — sai, vì lệch chiều trong cùng một mục là lỗi thật (`Quýt Mandarin`=1 đứng trước `Mandarin`=2). Số còn lại script bỏ sót vì chỉ so hai dòng cạnh nhau (`Nấm Truffle`=1, `Nấm cục`=2, `Truffle`=2 → `Truffle` được so với `Nấm cục` nên không lệch). Để nguyên theo yêu cầu; cả 26 đều là bí danh nên phiếu mới bỏ.
- **Chờ duyệt:** TASK-004 (giao lại, chỉ cần kiểm 11 ô + 0 từ lệch mức). TASK-001 chưa duyệt.
- **Tiếp theo (Claude):** chốt chuyện DeepSeek chấm thấp hơn thang chung ~0,4 mức trước khi dùng số `monan`; quyết `pop` của `thucvat` có hiệu chỉnh theo hướng "kho chấm lạ quá tay" không.

## 2026-10-23 21:10
- **Duyệt TASK-003: `đã nhận`.** DeepSeek · `monan`, 3.198 dòng. Mọi tiêu chí đạt, 25/25 từ neo đúng mức, 56 dòng trùng đã tự gộp về một mức trước khi giao. Đã trả lời 4 câu hỏi còn tồn.
- **Duyệt TASK-004: `cần sửa` (một việc nhỏ).** HY3 · `thucvat`, 4.586 dòng. Chất lượng chấm cao nhất tới nay, nhưng **11 từ trùng bị chấm hai mức khác nhau** (`Gỗ lim` 4/1, `Mắm` 5/3, `Gạo` 4/5…). Trả lại đúng 11 dòng đó, không chấm lại gì khác.
- **Ba nguồn trên 120 từ động vật:** HY3 trùng thang TASK-001 gần hoàn hảo (khớp 64%, lệch ≤1 **100%**, 0 ca lệch ≥2, lệch TB +0,03). DeepSeek chấm thấp hơn hệ thống **−0,43 mức** (lệch ≤1 96%, 5 ca lệch ≥2). Bộ 120 từ lấy 24 từ mỗi mức nên người trùng thang phải ra phân bố phẳng: HY3 25/23/22/24/26, DeepSeek 44/22/19/12/23. ⇒ Điểm `monan` và `thucvat` **không cùng thang**, phải hiệu chỉnh trước khi so hai kho.
- **Phát hiện đáng giá nhất:** tính riêng dòng tên chính, cả hai model độc lập đều nói kho **chấm nhiều từ quen thành lạ** — lệch TB +0,24 (`monan`), +0,54 (`thucvat`); chiều "kho chấm lạ quá tay" áp đảo (216 vs 58, và 380 vs 35). Ca không cần tranh luận: Trứng rán 2→5, Thịt luộc 2→5, Chả giò 2→5, Ô liu 1→4, Hẹ 2→5, Dầu ăn 2→5. **Ngược chiều** với ca động vật (Chim cánh cụt) ⇒ `pop` không lệch một chiều cố định, không chữa được bằng hệ số chung.
- **Khuyết điểm của phiếu chấm, lỗi của Claude:** phiếu rải mọi tên của một mục thành dòng riêng, nên tên tiếng Anh bị chấm riêng (38% phiếu `thucvat`). Hai model chấm đúng (`Water spinach` 5→1) nhưng số đó không so được với kho. Đã sửa `scripts/emit-lex-tsv.ts` chỉ xuất tên chính (`monan` 2.638, `thucvat` 2.805 dòng). Không chấm lại; khi áp số thì bỏ dòng tên khác.
- **Cần chủ dự án xác nhận:** DeepSeek nói **chính nó đã chấm TASK-001**. Nếu đúng thì TASK-001 và TASK-003 là cùng một model với hai rubric, nên hiện chỉ có **hai** người chấm độc lập, không phải ba — và cặp "TASK-001 vs HY3" là phép so chéo model duy nhất.
- **Chờ:** TASK-001 (chưa duyệt), TASK-004 sửa 11 dòng. Chờ chủ dự án: các bước SQL trên production; truy vấn số 2 của báo cáo WorkBuddy.

## 2026-10-23 21:30
- **Đã làm (WorkBuddy · HY3): xong TASK-004.** Chấm 4.586 từ `thucvat` → `bilion-rarity-audit/tu_thucvat_hy3.tsv` (4.586 dòng) và 120 từ đối chiếu → `tu_doi_chieu_dongvat_hy3.tsv` (120 dòng). Cả hai 4 cột, UTF-8 không BOM, LF, hai cột đầu nguyên văn đúng thứ tự đầu vào. Task chuyển `chờ duyệt`, mục Báo cáo đã điền đủ.
  - Phân bố `thucvat`: 1 · 1.845 (40,2%) · 2 · 1.446 (31,5%) · 3 · 801 (17,5%) · 4 · 411 (9,0%) · 5 · 83 (1,8%).
  - Phân bố 120 từ động vật: 5 · 26 · 4 · 24 · 3 · 22 · 2 · 23 · 1 · 25.
  - 37/37 từ neo nhóm `thucvat` ra đúng mức rubric. 9 dòng đánh `?` (8 ở kho thực vật + 1 động vật).
- **Cần Claude soi trước khi dùng số:** sau khi ghép phiếu tôi có sửa tay **27 dòng** và **hạ 57 dòng từ 5 xuống 4** theo một danh sách trắng ~90 từ lõi (để mức 5 không phình lên 142 dòng, trái nghĩa "từ đầu tiên bật ra"). Đây là phần duy nhất không còn "chấm mù" — chi tiết ở mục Báo cáo TASK-004.
- **Dữ liệu cho bước so ba nguồn:** `tu_doi_chieu_dongvat_hy3.tsv` đã sẵn sàng, cùng 120 từ và cùng thang `rubric-do-quen.md` với `tu_doi_chieu_dongvat_deepseek.tsv` của TASK-003 nên so trực tiếp được từng dòng. Tôi **không** tự so — việc đó thuộc mục Duyệt của Claude, và tôi chấm trong lúc chưa xem bản của model kia.
- **Đang chờ duyệt:** TASK-001 (kho động vật), TASK-003 (kho `monan`), TASK-004 (kho `thucvat`).
- **Chờ chủ dự án:** hai câu hỏi mới ở Báo cáo TASK-004 — (1) mức 5 chỉ 1,8% ở kho thực vật có đủ dày để làm bậc dễ nhất không; (2) có áp chính sách hạ mức 5 ngược lại bản TASK-001 đã giao không, nếu không thì phép so ba nguồn sẽ lẫn hai thang.
- **Tiếp theo (Claude):** duyệt TASK-001/003/004; so ba nguồn trên 120 từ động vật (TASK-001, TASK-003, TASK-004 + kho trong repo) và chốt chuyện lệch hệ thống giữa hai model trước khi ghi đè `prior_tier`.

## 2026-10-23 21:05
- **Đã làm (WorkBuddy): xong TASK-003.** Chấm 3.198 từ `monan` → `bilion-rarity-audit/tu_monan_deepseek.tsv` (3.198 dòng) và 120 từ đối chiếu → `tu_doi_chieu_dongvat_deepseek.tsv` (120 dòng). Cả hai 4 cột, UTF-8 không BOM, LF, 0 dòng lệch so với đầu vào. Task chuyển `chờ duyệt`, mục Báo cáo đã điền đủ.
  - Phân bố `monan`: mức 5 · 88 (2,8%) · 4 · 368 (11,5%) · 3 · 843 (26,4%) · 2 · 1.068 (33,4%) · 1 · 831 (26,0%). Không chuẩn hoá.
  - Phân bố 120 từ động vật: 5 · 23 · 4 · 12 · 3 · 19 · 2 · 22 · 1 · 44.
  - 25/25 từ neo nhóm monan ra đúng mức rubric. 7 dòng đánh `?` (6 món, 1 động vật). 6 từ bị chấm lệch giữa hai chỗ trùng đã đưa về một mức.
- **Dữ liệu phụ đáng chú ý cho bước so ba nguồn:** cùng tôi, cùng 120 từ, `RUBRIC.md` cũ (TASK-001) so với `rubric-do-quen.md` mới (TASK-003) — khớp tuyệt đối 69/120 (57,5%), lệch ≤ 1 mức 115/120 (95,8%), lệch ≥ 2 mức **5 từ và cả 5 đều một chiều: rubric mới chấm thấp hơn** (`Gà so` 3→1, `Cá đuối manta` 3→1, `Bướm vua` 3→1, `Sâu đo` 3→1, `Cá rồng` 4→2). Thang định lượng siết hơn thang định tính đúng ở nhóm "có trong sách nhưng người thường không kể ra".
- **Đang chờ duyệt:** TASK-001 (WorkBuddy, kho động vật), TASK-003 (WorkBuddy, kho `monan`).
- **Đang chạy:** TASK-004 (HY3, kho `thucvat`).
- **Chờ chủ dự án:** xác nhận `pop` của kho `monan` đo "tự kể ra" hay "nhận ra khi đọc" (câu hỏi 1 trong Báo cáo TASK-003) — trả lời khác đi thì cả bảng phải cộng/trừ một mức; các bước SQL trên production (reset người chơi, redraw, xóa 106 câu); truy vấn số 2 của báo cáo WorkBuddy.
- **Tiếp theo (Claude):** duyệt TASK-001 và TASK-003; khi có bản của HY3 thì so ba nguồn trên 120 từ. Riêng `monan` còn hai việc thuộc về kho: 56 dòng trùng tên (có thể bị đếm hai lần khi chia bậc) và chuyện gia vị/món phụ (`Mắm tôm`, `Dưa chua`, `Kim chi`) đang nằm chung kho món.

## 2026-10-23 20:50
- **TASK-002 đã nhận (chủ dự án duyệt).** Claude kiểm lại ví dụ neo bằng script: 162/162 từ có trong kho, nhưng **9 từ ghi sai mức** so với `pop` thật — đã sửa trong `docs/rubric-do-quen.md`, kiểm lại 0 sai. Bản sửa đã copy sang `bilion-rarity-audit`. Chi tiết trong mục Duyệt của TASK-002.
- 8 trong 9 chỗ lệch cùng chiều: rubric chấm thấp hơn kho một mức. Chưa kết luận bên nào đúng — chờ `familiar.ts`.
- Phát hiện thuộc về kho: `3 Hủ tiếu Mỹ Tho` (`lex/monan.ts:51`) bị `soft()` gộp vào mục `Hủ tiếu` (pop 4) nên vô hiệu — nên soát còn bao nhiêu dòng cùng kiểu; `Kvass` và `Makgeolli` trong `douong` có hai dòng pop 1 và 2.
- **Chờ duyệt:** TASK-001 (WorkBuddy, kho động vật).
- **Đang chạy:** TASK-003 (DeepSeek v4.1 Flash, `monan`), TASK-004 (HY3, `thucvat`).
- **Chờ chủ dự án:** các bước SQL trên production (reset người chơi, redraw, xóa 106 câu); truy vấn số 2 của báo cáo WorkBuddy.

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
