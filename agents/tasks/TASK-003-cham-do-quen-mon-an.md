# TASK-003: chấm độ quen kho món ăn (DeepSeek v4.1 Flash)

- Người nhận: WorkBuddy · model **DeepSeek v4.1 Flash**
- Trạng thái: đã nhận
- Giao ngày: 2026-10-23

## Bối cảnh
Độ quen (1–5) trong kho từ vựng đang là số gán tay, chưa có định nghĩa. Kho động vật đã có một bản chấm độc lập (TASK-001). Giờ cần chấm tiếp các kho lớn còn lại, và cần biết hai model chấm có cùng một thang hay không — nên hai model chấm song song hai kho khác nhau, cộng thêm **cùng một bộ 120 từ động vật** để đo mức đồng thuận.

Bạn làm độc lập. Đừng tham khảo kết quả của model kia, và đừng cố đoán số đang có trong repo — phiếu chấm cố tình không ghi số cũ.

## Việc cần làm
1. Đọc `RUBRIC.md` và `rubric-do-quen.md` (thang chung + ví dụ neo theo từng nhóm kho).
2. Chấm từng từ trong `tu_monan_can_cham.tsv` theo thang 1–5.
3. Chấm tiếp 120 từ trong `tu_doi_chieu_dongvat_120.tsv` theo đúng thang đó.
4. Chấm độc lập từng từ. **Không** điều chỉnh để các mức phân bố đều: phân bố lệch là dữ liệu, không phải khuyết điểm.
5. Từ không xác nhận được là có thật, hoặc trông như viết sai/dịch máy: ghi mức 1 và đặt `?` ở cột `ghi_chu`.
6. Không sửa file nào trong repo. Chỉ trả file kết quả.

## Đầu vào
Trong thư mục `bilion-rarity-audit`: `RUBRIC.md`, `rubric-do-quen.md`, `PROMPT.md`, `tu_monan_can_cham.tsv`, `tu_doi_chieu_dongvat_120.tsv`.

## Đầu ra
Hai file, 4 cột `lexicon  word  pop  ghi_chu`, tab ngăn cách, có dòng tiêu đề, UTF-8 không BOM, LF:
- `tu_monan_deepseek.tsv`
- `tu_doi_chieu_dongvat_deepseek.tsv`

## Tiêu chí nghiệm thu
- `tu_monan_deepseek.tsv`: đúng 3.198 dòng dữ liệu, cùng thứ tự và nguyên văn hai cột đầu với đầu vào.
- `tu_doi_chieu_dongvat_deepseek.tsv`: đúng 120 dòng dữ liệu, cùng thứ tự và nguyên văn hai cột đầu với `tu_doi_chieu_dongvat_120.tsv`.
- `pop` là số nguyên 1–5, không để trống.
- Mục Báo cáo có bảng phân bố của cả hai file.

## Báo cáo (người nhận điền)

### Đã làm gì
Đọc `RUBRIC.md` và `rubric-do-quen.md`, rồi chấm độc lập 3.198 từ `monan` và 120 từ đối chiếu. Không xem số nào trong repo, không tham khảo model kia (máy này không có kết quả của HY3).

Cách chấm để không lệch dòng: đọc nguồn từng đoạn ≤ 500 dòng, mỗi đoạn ghi ra một file chỉ gồm dãy số (10 số một dòng) và một dòng đầu `# dòng_đầu dòng_cuối từ_đầu|từ_cuối`. Script gộp kiểm ba thứ: số lượng số bằng đúng độ dài đoạn, từ đầu và từ cuối đoạn khớp **nguyên văn** với file nguồn, và các đoạn phủ kín file không chồng lấn (2→3199, 13 đoạn). Cột `lexicon` và `word` được copy nguyên từ file đầu vào, không gõ lại — nên không có đường nào làm sai dấu tiếng Việt.

### Hai file ở đâu
Trong `bilion-rarity-audit` (cùng chỗ với phiếu chấm):
- `tu_monan_deepseek.tsv` — 3.198 dòng dữ liệu, 81.620 bytes
- `tu_doi_chieu_dongvat_deepseek.tsv` — 120 dòng dữ liệu, 2.915 bytes

Cả hai: 4 cột `lexicon · word · pop · ghi_chu`, tab ngăn cách, có dòng tiêu đề, UTF-8 không BOM, LF, kết thúc bằng newline.

### Đối chiếu tiêu chí nghiệm thu

| Tiêu chí | Cách kiểm | Kết quả |
|---|---|---|
| `tu_monan_deepseek.tsv` đúng 3.198 dòng dữ liệu | đếm dòng sau khi bỏ tiêu đề | **3.198** ✓ |
| cùng thứ tự và nguyên văn hai cột đầu với đầu vào | so từng dòng với `tu_monan_can_cham.tsv` | **0/3.198 lệch** ✓ |
| `tu_doi_chieu_dongvat_deepseek.tsv` đúng 120 dòng | đếm dòng | **120** ✓ |
| cùng thứ tự và nguyên văn hai cột đầu | so từng dòng với `tu_doi_chieu_dongvat_120.tsv` | **0/120 lệch** ✓ |
| `pop` là số nguyên 1–5, không để trống | kiểm kiểu từng ô | **0 ô sai** ✓ |
| Báo cáo có bảng phân bố của cả hai file | hai bảng dưới | ✓ |

### Phân bố `tu_monan_deepseek.tsv` (3.198 dòng)

| Mức | Số từ | Tỉ lệ |
|---|---|---|
| 5 — ai cũng kể ra | 88 | 2,8% |
| 4 | 368 | 11,5% |
| 3 | 843 | 26,4% |
| 2 | 1.068 | 33,4% |
| 1 — gần như không ai kể | 831 | 26,0% |

### Phân bố `tu_doi_chieu_dongvat_deepseek.tsv` (120 dòng)

| Mức | Số từ | Tỉ lệ |
|---|---|---|
| 5 | 23 | 19,2% |
| 4 | 12 | 10,0% |
| 3 | 19 | 15,8% |
| 2 | 22 | 18,3% |
| 1 | 44 | 36,7% |

Phân bố hai file khác nhau rõ vì hai danh sách khác nhau về bản chất: kho `monan` là danh sách món, phần lớn là tên ghép đặc sản vùng miền nên dồn ở mức 2–3; bộ 120 từ động vật lấy cách đều từng mức của bản chấm TASK-001 nên có 24 từ mỗi mức theo thiết kế. Không chuẩn hoá file nào.

25/25 từ neo trong `rubric-do-quen.md` (nhóm monan) ra đúng mức ghi trong rubric, kiểm bằng script.

### Những từ tự thấy khó chấm
1. **Tên ghép kiểu "món + nguyên liệu"** — `Canh cá nấu khế`, `Canh cá nấu sấu`, `Canh cá nấu lá me`… gần như không tồn tại như một cái tên cố định, chỉ là một câu mô tả. Tôi chấm theo đúng chuỗi chữ như phiếu ghi, không quy về món gốc. Nếu quy về món gốc thì cả cụm này sẽ lên 2–3 và mất khác biệt.
2. **Ranh giới 4 và 5** — rubric đặt 4 = 30–60/100, 5 = ≥60/100. Tôi không đếm được, chỉ ước. Chỗ này là rủi ro hệ thống lớn nhất của cả bản chấm: `Bánh mì` (5) và `Bún bò Huế` (4) khác nhau ở chỗ nào là phán đoán, không phải đo.
3. **Nước ngoài đã Việt hoá hay chưa** — `Pizza` 5, `Sushi` 5, `KFC` 5, `Pad Thái` 5, nhưng `Focaccia` 1, `Ciabatta` 1, `Panettone` 1. Ranh giới "đã vào bữa ăn hằng ngày" và "chỉ thấy trên mạng" là cảm nhận.
4. **Từ vùng miền rất hẹp** — `Canh bí rợ`, `Gỏi bồn bồn`, `Mắm dắt`, `Trám đen om`: người ngoài vùng gần như không biết, người trong vùng thấy rất quen. Tôi chấm theo "người Việt phổ thông" như rubric dặn, nên đều xuống 1.
5. **Cấp độ thương hiệu so với cấp độ món** — `Mắm tôm` 5 nhưng `Mắm tôm Hậu Lộc` 3; `Bánh chưng` 5 nhưng `Bánh chưng Tranh Khúc` 2. Tôi coi tên có địa danh là tên riêng, hẹp hơn hẳn tên món.
6. **56 dòng trùng từ** (3.198 dòng nhưng chỉ 3.142 từ khác nhau). Cùng một từ thì phải cùng một mức; lúc gộp tôi tìm được 6 từ bị chấm lệch giữa hai chỗ và đã đưa về một mức: `Castella` 2, `Dê tái chanh` 2, `Bò tái chanh` 2, `Tiết canh` 4, `Samosa` 2, `Baklava` 1.
7. **7 dòng đánh `?`** (mức 1, không xác nhận được là tên món thật): `Canh mầm đá` (2803), `Gỏi tiến vua` (2919), `Nộm nộm` (2959, lặp từ), `Mắm cá mắm` (3025, lặp từ), `Mắm dắt` (3041), `Rươu chưng` (3133, nghi sai chính tả "rượu"), và bên động vật `Cá trích lầm` (dòng 21).

### Dữ liệu phụ: cùng model, hai rubric, trên 120 từ
Không nằm trong tiêu chí nghiệm thu, nhưng có sẵn nên ghi lại: bộ 120 từ này đã được chính tôi chấm ở TASK-001 bằng `RUBRIC.md` (thang định tính). So bản cũ với bản mới:

- khớp tuyệt đối: **69/120 = 57,5%**
- lệch ≤ 1 mức: **115/120 = 95,8%**
- lệch ≥ 2 mức: **5 từ**, và **cả 5 đều theo một chiều — rubric mới chấm thấp hơn**: `Gà so` 3→1, `Cá đuối manta` 3→1, `Bướm vua` 3→1, `Sâu đo` 3→1, `Cá rồng` 4→2.

Nghĩa là thang định lượng mới siết chặt hơn thang định tính cũ ở đúng nhóm "tên loài có trong sách nhưng người thường không kể ra". Đây là dữ liệu cho bước so ba nguồn của Claude, không phải kết luận.

### Câu hỏi còn tồn
1. **`pop` của kho `monan` đo cái gì: "tự kể ra" hay "nhận ra khi đọc"?** Tôi chấm theo nghĩa thứ nhất (đúng câu hỏi trong rubric: 100 người được hỏi, bao nhiêu người *nói ra* từ này). Nếu người chơi thực tế *nhìn thấy đáp án rồi mới chọn* thì gần như mọi mức nên cộng thêm 1, và phân bố sẽ khác hẳn. Cần chủ dự án xác nhận trước khi dùng số.
2. **Từ trùng có nên gộp thành một dòng khi tính bậc?** Tôi để nguyên 3.198 dòng và cho cùng một mức. Nếu `soft()` gộp tên như trường hợp `Hủ tiếu Mỹ Tho` thì 56 dòng trùng có thể đang đếm hai lần khi chia bậc.
3. **`Mắm tôm`, `Nước mắm`, `Dưa chua`, `Kim chi` — gia vị và món phụ có thuộc kho `monan` không?** Tôi vẫn chấm (đều 5) vì chúng nằm trong phiếu, nhưng nếu chúng được dùng làm đáp án thì bậc "Thường" sẽ đầy gia vị.
4. **Có cần chấm lại phần `canh` và `gỏi` bằng một lượt riêng không?** Hai khối này (dòng ~2752–3013 và các dòng canh rải rác) là chỗ tôi thấy khó nhất và cũng là chỗ dễ lệch nhất nếu model kia chấm khác.

## Duyệt (Claude điền)
Claude kiểm số dòng và thứ tự, rồi so ba nguồn trên 120 từ động vật (TASK-001, TASK-003, và kho trong repo): báo tỉ lệ khớp tuyệt đối, tỉ lệ lệch ≤ 1 mức, và danh sách lệch ≥ 2 mức. Nếu hai model lệch hệ thống (một bên luôn chấm cao hơn) thì ghi vào `decisions.md` trước khi dùng số của bên nào. Không ghi đè số cũ khi chủ dự án chưa đồng ý.

**Đã nhận.** Mọi điều người nhận tự báo đều kiểm lại được và đều đúng.

| Kiểm | Kết quả |
|---|---|
| `tu_monan_deepseek.tsv` đúng 3.198 dòng, thứ tự và hai cột đầu nguyên văn | đạt, 0 lệch |
| `tu_doi_chieu_dongvat_deepseek.tsv` đúng 120 dòng, nguyên văn | đạt, 0 lệch |
| `pop` nguyên 1–5, không trống | đạt, 0 ô sai |
| Báo cáo có phân bố cả hai file | đạt |
| 25 từ neo `monan` của rubric | 25/25 đúng mức |
| 56 dòng trùng từ, cùng từ phải cùng mức | 0 chỗ mâu thuẫn — đã tự phát hiện và gộp trước khi giao |
| 6 dòng `?` | đúng như báo cáo |

### Ba nguồn trên 120 từ động vật

| Cặp | Khớp tuyệt đối | Lệch ≤ 1 mức | Lệch ≥ 2 mức | Lệch trung bình |
|---|---|---|---|---|
| TASK-001 vs DeepSeek | 69/120 (57%) | 115/120 (96%) | 5 | **−0,43** (DeepSeek chấm lạ hơn) |
| TASK-001 vs HY3 | 77/120 (64%) | 120/120 (100%) | **0** | +0,03 |
| DeepSeek vs HY3 | 63/120 (53%) | 112/120 (93%) | 8 | +0,46 (HY3 chấm quen hơn) |

**Kết luận về thang:** DeepSeek chấm thấp hơn hai nguồn kia khoảng **0,4 mức** một cách hệ thống. HY3 trùng thang TASK-001 gần như hoàn hảo — không một từ nào lệch 2 mức trên 120 từ.

Bằng chứng mạnh hơn con số lệch trung bình: bộ 120 từ được lấy đúng 24 từ mỗi mức của TASK-001, nên một người chấm trùng thang phải cho phân bố phẳng. HY3 ra 25/23/22/24/26. DeepSeek ra 44/22/19/12/23 — dồn về mức 1.

5 ca lệch ≥ 2 mức giữa TASK-001 và DeepSeek, cả 5 cùng một chiều: `Gà so` 3→1, `Cá đuối manta` 3→1, `Bướm vua` 3→1, `Sâu đo` 3→1, `Cá rồng` 4→2.

Hệ quả khi dùng số: điểm `monan` của DeepSeek và điểm `thucvat` của HY3 **không cùng một thang**. So hai kho với nhau mà không hiệu chỉnh sẽ làm món ăn trông hiếm hơn thực vật khoảng nửa bậc.

### So với kho, chỉ tính dòng tên chính

| | Khớp | Lệch ≤1 | Lệch ≥2 | Lệch TB |
|---|---|---|---|---|
| DeepSeek · `monan` (2.685 từ) | 43% | 90% | 274 (10,2%) | **+0,24** |
| HY3 · `thucvat` (2.857 từ) | 47% | 85% | 415 (14,5%) | **+0,54** |

Hai model độc lập nhau đều nói cùng một điều: **kho chấm nhiều từ quen thành lạ**, chứ không phải ngược lại. Và vì DeepSeek chấm thấp hơn thang chung 0,4 mức, con số +0,24 của `monan` thực chất còn đậm hơn.

Chiều "kho chấm lạ quá tay" áp đảo: 216 so với 58 ở `monan`, 380 so với 35 ở `thucvat`. Các ca nặng nhất không cần tranh luận:
- `monan`: Trứng rán 2→5 · Thịt luộc 2→5 · Gà luộc 2→5 · Chả giò 2→5 · Rau muống xào tỏi 2→5 · Lòng lợn 2→5 · Vịt quay 2→5 · Tôm khô 1→4
- `thucvat`: Ô liu 1→4 · Hẹ 2→5 · Dầu ăn 2→5 · Măng tre 1→4 · Bồ kết 1→4 · Cây hướng dương 1→4 · Hoa mai vàng 1→4

Đây là phát hiện đáng giá nhất của hai task. Nó **ngược chiều** với ca động vật (ở đó kho chấm `Chim cánh cụt` quen quá tay nên cho 210 điểm). Nghĩa là `pop` của kho không lệch theo một chiều cố định — không chữa được bằng một hệ số chung, phải sửa theo từng từ.

### Một khuyết điểm của phiếu chấm — lỗi của Claude, không phải của người nhận

Phiếu được sinh bằng cách rải **mọi tên** của mỗi mục thành dòng riêng, nên tên khác (kể cả tên tiếng Anh) bị chấm như từ độc lập: 513/3.198 dòng của `monan`, **1.729/4.586 dòng (38%) của `thucvat`**. Nhưng `pop` trong kho thuộc về cả mục, không thuộc từng tên.

Cả hai model đều chấm **đúng** ở đây: `Water spinach` 5→1, `Fish sauce` 5→1, `Cassava` 4→1 — người Việt không nói ra tên tiếng Anh. Tên không dấu/tiếng Anh lệch trung bình **−0,40** (DeepSeek) và **−0,52** (HY3) so với kho, gần hết là ca này. Số đó là nhiễu của phiếu, không phải phát hiện về kho.

Đã sửa `scripts/emit-lex-tsv.ts` chỉ xuất tên chính (`monan` 3.198 → 2.638 dòng, `thucvat` 4.586 → 2.805 dòng). **Không chấm lại:** các dòng tên chính vẫn dùng được nguyên; khi áp số thì bỏ dòng tên khác.

### Trả lời bốn câu hỏi còn tồn

1. **`pop` đo "tự kể ra" hay "nhận ra khi đọc"?** Chấm theo "tự kể ra" là đúng — đó đúng là câu hỏi gốc trong rubric, và trong game người chơi **gõ** đáp án chứ không chọn từ danh sách. Không cần cộng 1.
2. **Từ trùng có nên gộp khi tính bậc?** Có, nhưng đó là việc của khâu dựng câu hỏi chứ không phải của phiếu chấm. `soft()` đã gộp một phần rồi (xem ca `Hủ tiếu Mỹ Tho` dưới). Để nguyên 3.198 dòng là đúng.
3. **Gia vị, món phụ có thuộc `monan`?** Chúng nằm trong kho nên cứ chấm. Việc "bậc Thường đầy gia vị" là chuyện của khâu chọn đáp án, không phải của độ quen.
4. **Chấm lại riêng khối `canh` và `gỏi`?** Không cần. Khối đó không phải nơi lệch nặng nhất: 274 ca lệch ≥ 2 mức tập trung ở món chế biến hằng ngày (trứng rán, thịt luộc), không ở canh/gỏi.

### Xác nhận một phát hiện của người nhận

`Hủ tiếu Mỹ Tho 4→2` trong danh sách lệch là thật nhưng không phải lỗi chấm: `soft()` gộp `Hủ tiếu Mỹ Tho`, `Hủ tiếu Sa Đéc`, `Hủ tiếu Cần Thơ` vào mục `Hủ tiếu` (pop 4), nên ba dòng riêng trong `lex/monan.ts` vô hiệu. Đã ghi vào `decisions.md` khi duyệt TASK-002.

### Chưa làm, chờ chủ dự án

Không ghi đè `pop` nào trong kho. Danh sách 274 ca lệch ≥ 2 mức của `monan` dựng lại được bất cứ lúc nào từ hai file trong `bilion-rarity-audit`.
