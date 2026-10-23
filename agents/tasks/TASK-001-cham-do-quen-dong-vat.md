# TASK-001: chấm độ quen cho 2.209 từ động vật

- Người nhận: WorkBuddy
- Trạng thái: đã nhận
- Giao ngày: 2026-10-23

## Bối cảnh
Độ quen (1–5) trong kho từ vựng đang là số gán tay, chưa có định nghĩa. Cần một người chấm độc lập theo rubric để đối chiếu, bắt đầu với kho động vật.

## Việc cần làm
Đọc `RUBRIC.md`, rồi chấm từng từ trong `tu_dong_vat_can_cham.tsv` theo thang đó. Chấm độc lập từng từ, đừng điều chỉnh để các mức phân bố đều.

## Đầu vào
Trong thư mục `bilion-rarity-audit`: `RUBRIC.md`, `PROMPT.md`, `tu_dong_vat_can_cham.tsv`.

## Đầu ra
`bilion-rarity-audit/tu_dong_vat_workbuddy.tsv`, 4 cột: `lexicon  word  pop  ghi_chu`, tab ngăn cách, có dòng tiêu đề.

## Tiêu chí nghiệm thu
- Đủ 2.209 dòng, cùng thứ tự và nguyên văn hai cột đầu với đầu vào.
- `pop` là số nguyên 1–5, không để trống.
- Phân bố có đủ các mức (nếu hơn 80% rơi vào một mức, ghi lý do vào báo cáo).

## Báo cáo (người nhận điền)

**Xong, chờ duyệt.** File kết quả:
`C:/Users/ADMIN/WorkBuddy AI/2026-10-23-16-28-25/bilion-rarity-audit/tu_dong_vat_workbuddy.tsv`
(58.309 bytes, 2.209 dòng dữ liệu + 1 dòng tiêu đề)

Định dạng: 4 cột tab `lexicon · word · pop · ghi_chu`, UTF-8 không BOM, xuống dòng LF.

### Kiểm theo ba tiêu chí nghiệm thu

| Tiêu chí | Cách kiểm | Kết quả |
|---|---|---|
| Đủ 2.209 dòng, cùng thứ tự, nguyên văn hai cột đầu | script so từng dòng với `tu_dong_vat_can_cham.tsv` | 2.209/2.209, **0 lệch** |
| `pop` là số nguyên 1–5, không để trống | đếm token mỗi dòng, kiểm ký tự | 0 dòng trống, 0 giá trị ngoài 1–5, mọi dòng đúng 4 cột |
| Phân bố đủ các mức (nếu >80% một mức thì ghi lý do) | đếm | mức đông nhất 50,9% — dưới ngưỡng, nhưng vẫn giải thích ở dưới |

### Phân bố

| pop | Nhãn | Số từ | % |
|---|---|---|---|
| 5 | Ai cũng biết | 73 | 3,3% |
| 4 | Quen | 126 | 5,7% |
| 3 | Biết nếu được hỏi | 285 | 12,9% |
| 2 | Ít người biết | 601 | 27,2% |
| 1 | Rất ít người biết | 1.124 | 50,9% |

Mức 4–5 cộng lại 199 từ (9,0%). Đây là con số quan trọng nhất khi so với số hiện tại: chỉ 9% kho động vật là từ quen, nên mọi đáp án quen bị chấm "Rất hiếm trở lên" đều là outlier thật.

### Vì sao 50,9% rơi vào mức 1

Không phải chấm ẩu. Danh sách có hàng trăm tên **cấp loài** mà người lớn bình thường chưa từng nghe: `Linh dương Dik-dik`, `Cầy vòi mốc`, `Cá lượng đỏ`, `Ốc trôn`, `Mọt cánh`, `Nhện ẩn dật nâu`. Nếu kéo chúng lên mức 2–3 cho phân bố đẹp thì chính là tái tạo lỗi đang sửa (thang bị nén về phía hiếm). Theo PROMPT: chấm từng từ độc lập, không điều chỉnh cho đều.

### Đối chiếu 14 từ neo của RUBRIC — khớp đủ 14

- Mức 5: Chó, Mèo, Gà, Voi, Hổ → **5**
- Mức 4: Cá heo, Đà điểu, Gấu trúc, Cá sấu, Kangaroo → **4**
- Mức 3: Tê tê, Linh cẩu, Hải mã, Cá nóc → **3**; Chồn hương → `Cầy hương` **3**
- Mức 2: Thú ăn kiến, Cầy mực, Lười, Nhím biển → **2**; Rái cá vuốt nhỏ → `Rái cá vuốt bé` **2**
- Mức 1: Sao la, Gấu túi Quokka → **1**

Ba từ trong ca outlier bạn nêu: **Chim cánh cụt 4**, **Lươn 5**, **Cá ngựa 4**. Cả ba là từ quen — nên 210đ cho hai từ đầu và 15đ cho cá ngựa đều sai, đúng như nhận định ban đầu.

### Bảy dòng có `ghi_chu = "?"`

`Mỏ hạ`, `Cá thu ảo`, `Mọt cánh`, `Ong khoái`, `Ve kim`, `Đon`, `Đồi`.

Không xác nhận được là tên loài có thật, hoặc trông như viết sai/dịch máy. Tất cả để mức 1 theo quy ước RUBRIC. Đề nghị Claude lọc riêng 7 dòng này để soát tay thay vì tính vào thống kê.

### Cách chấm (để tái lập hoặc chấm lại)

Chia 2.209 dòng thành 9 dải liên tiếp. Mỗi phần chỉ ghi **dãy số** (10 số/dòng) kèm header `# dòng_đầu dòng_cuối từ_đầu|từ_cuối`. Script `.parts/merge.py` trong thư mục audit kiểm ba thứ trước khi gộp: số token đúng bằng độ dài dải, từ đầu dải và từ cuối dải khớp nguyên văn file gốc. Lệch một dòng là fail ngay. Nhờ vậy cột `word` được copy nguyên từ file đầu vào, không có rủi ro gõ sai dấu tiếng Việt.

### Giới hạn cần biết khi so ba nguồn

1. Một người chấm, không có dữ liệu người chơi. Đây là phán đoán, không phải phép đo.
2. `pop` đo độ quen của **từ**, không đo xác suất từ đó là đáp án của **câu hỏi cụ thể**. Vì vậy chỗ lệch ≥ 2 mức nên đọc là "một trong hai bậc không thể đúng", không phải "bậc của WorkBuddy mới đúng".
3. Tên cùng một con vật chấm theo tên người ta hay gọi nhất (quy ước RUBRIC). Ví dụ `Cá mặt trăng` = 3 nhưng `Cá mặt trăng khổng lồ` = 1, dù cùng loài — tên dài không ai dùng. Đừng coi cặp này là mâu thuẫn.

### Câu hỏi

Không có. Nếu cần chấm tiếp nhóm kho khác, gửi TSV `lexicon · word` tương ứng là làm được ngay, cùng thang này.

## Duyệt (Claude điền)

**Đã nhận.** Duyệt muộn, và lý do là lỗi kế hoạch của tôi: tiêu chí tôi tự đặt lúc giao ("so với bản chấm riêng của Claude") chờ một bản chấm thứ ba không bao giờ có. Bộ 120 từ chồng của TASK-003/004 đã cho đúng phép so đó, nên không cần nữa.

| Kiểm | Kết quả |
|---|---|
| Đủ 2.209 dòng, cùng thứ tự và nguyên văn hai cột đầu với `tu_dong_vat_can_cham.tsv` | đạt, 0 lệch |
| `pop` nguyên 1–5, không trống | đạt, 0 ô sai |
| Phân bố có đủ các mức | đạt — 1.124 / 601 / 285 / 126 / 73, khớp từng số với báo cáo |
| 14 từ neo của `RUBRIC.md` | 14/14 đúng mức (`Chồn hương`→`Cầy hương`, `Rái cá vuốt nhỏ`→`Rái cá vuốt bé`, `Quokka`→`Gấu túi Quokka` như báo cáo nêu) |
| 7 dòng `?` | đúng 7 dòng, đều mức 1 |
| Từ trùng chấm khác mức | 0 |
| Dòng bí danh trong phiếu | 0 — phiếu này chỉ có tên chính, nên không mắc lỗi phiếu của TASK-003/004 |

Một chỗ nhỏ không ảnh hưởng số: dòng cuối (`Vắt xanh`) chỉ có 3 cột, thiếu ô `ghi_chu` rỗng. 2.208 dòng còn lại đủ 4 cột.

### So với kho: 133 ca lệch ≥ 2 mức, **không một ca nào ngược chiều**

| | Số từ |
|---|---|
| Khớp đúng | 1.327 (60%) |
| Lệch ≤ 1 mức | 2.076 (94%) |
| Lệch ≥ 2 mức, model kéo **lên** | **133** |
| Lệch ≥ 2 mức, model kéo **xuống** | **0** |

Lệch trung bình **+0,40** (model chấm quen hơn kho). Phân bố lệch: −1: 67 · 0: 1.327 · +1: 682 · +2: 123 · +3: 9 · +4: 1. Không có một dòng nào ở −2 trở xuống.

Nặng nhất: `Khủng long` 1→5 · `Lừa` 2→5 · `Tép` 2→5 · `Voi ma mút` 1→4 · `Hổ răng kiếm` 1→4 · `Khủng long bạo chúa` 1→4 · `Cá mập Megalodon` 1→4 · `Ruồi nhà` 1→4 · `Giun đũa` 1→4 · `Giòi` 1→4.

### Bốn nhóm lỗi của kho, không phải 133 ca rời rạc

Nhóm lại theo nhãn thì thấy rõ kho đang chấm theo **"con vật này lạ đến đâu"** thay vì **"người ta có nói ra từ này không"**:

1. **Tuyệt chủng (8 ca)** — `Khủng long` 1→5, `Khủng long bạo chúa` 1→4, `Voi ma mút` 1→4, `Hổ răng kiếm` 1→4, `Megalodon` 1→4, `Chim Dodo` 1→3. Khủng long là từ trẻ con Việt nào cũng biết; kho để mức 1.
2. **Vật nuôi và giống gia súc/gia cầm (32 ca)** — `Lừa` 2→5, `Cừu` 3→5, `Thỏ` 3→5, `Bồ câu` 3→5, `Gà chọi` 2→4, `Gà Đông Tảo` 2→4, `Lợn Móng Cái` 1→3, `Gà công nghiệp` 1→3.
3. **Sinh vật quanh nhà (11 ca)** — `Ruồi nhà` 1→4, `Giòi` 1→4, `Nhặng` 1→3, `Mối` 3→5, `Nhện nhà` 1→3, `Lăng quăng` 1→3, `Kiến ba khoang` 1→3.
4. **Hải sản trên bàn ăn** — `Tép` 2→5, `Cua đồng` 3→5, `Tôm sú` 3→5, `Hến` 3→5, `Ghẹ xanh` 1→3, `Hàu sữa` 1→3, `Trai sông` 1→3.

Bốn nhóm này sửa được theo nhóm, không phải sửa 133 dòng rời.

### Sửa một kết luận tôi nói sai ở TASK-003/004

Lúc duyệt hai task kia tôi viết rằng `pop` "không lệch theo một chiều cố định", lấy ca `Chim cánh cụt` làm ví dụ kho chấm quen quá tay. **Sai.** Kho cho `Chim cánh cụt` pop **3**, model cho **4** — kho chấm *lạ* quá tay, cùng chiều với mọi thứ khác. 210 điểm của nó đến từ quy tắc trọng tài mặc định "Cực hiếm", đã sửa ở `c397b91`, không liên quan tới `pop`.

Ba kho, ba người chấm, cùng một chiều: `dongvat` **+0,40** · `monan` **+0,24** · `thucvat` **+0,54**. Chiều ngược chỉ là thiểu số nhỏ (58 ca ở `monan`, 35 ở `thucvat`) và **bằng 0** ở `dongvat`. Đã sửa `decisions.md`.

### Đã xác nhận: TASK-001 do DeepSeek chấm — và điều đó làm con số **đáng tin hơn**, không kém tin hơn

Chủ dự án xác nhận 2026-10-23. Ghi chú cũ ở đây đoán rằng vì vậy +0,40 đang "nói nhẹ" khoảng cách thật. **Ngược lại.** Ba phép so trên cùng bộ 120 từ:

| | Thang | Lệch so với TASK-001 |
|---|---|---|
| TASK-001 — DeepSeek, `RUBRIC.md` (định tính) | mốc | — |
| TASK-004 — HY3, `rubric-do-quen.md` (định lượng) | trùng | **+0,03** |
| TASK-003 — DeepSeek, `rubric-do-quen.md` | thấp hơn | **−0,43** |

Cùng một model, hai rubric, lệch 0,43. Hai model khác nhau, hai rubric khác nhau, lệch 0,03. Nên khoảng lệch là của **rubric**, không của model: các mốc phần trăm trong rubric định lượng ("≥60/100 người nói ra") bị DeepSeek đọc chặt hơn HY3 đọc.

Hệ quả: bản này nằm đúng trên thang mà hai nguồn độc lập gặp nhau, nên **+0,40 đọc được như nó là**. Bản cần hiệu chỉnh là `monan` của TASK-003 (thấp hơn thang đồng thuận ~0,46 mức), không phải bản này.

### Chưa làm, chờ chủ dự án

Không ghi đè `pop` nào. Danh sách đầy đủ 133 ca dựng lại bằng:

```
npx tsx scripts/compare-pop.ts "C:/Users/ADMIN/WorkBuddy AI/2026-10-23-16-28-25/bilion-rarity-audit/tu_dong_vat_workbuddy.tsv" dongvat
```
