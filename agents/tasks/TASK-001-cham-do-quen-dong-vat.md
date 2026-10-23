# TASK-001: chấm độ quen cho 2.209 từ động vật

- Người nhận: WorkBuddy
- Trạng thái: chờ duyệt
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
Claude sẽ so với số hiện tại và với bản chấm riêng của Claude, liệt kê từ lệch ≥ 2 mức, rồi đề xuất sửa. Không ghi đè số cũ khi chủ dự án chưa đồng ý.
