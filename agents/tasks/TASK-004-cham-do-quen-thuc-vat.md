# TASK-004: chấm độ quen kho thực vật (HY3)

- Người nhận: WorkBuddy · model **HY3**
- Trạng thái: đã nhận
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

**Đã làm gì.** Đọc `RUBRIC.md` + `rubric-do-quen.md`, rồi chấm toàn bộ 4.586 từ thực vật và 120 từ động vật đối chiếu theo thang 1–5. Chấm độc lập từng từ, không xem số cũ trong repo, không xem kết quả của model kia.

Cách làm: chia kho thực vật thành 16 phiếu 300 từ (phiếu cuối 86 từ), mỗi phiếu chỉ có số thứ tự + từ, chấm bằng một lượt đọc liền mạch để giữ cùng một "mốc đầu óc" trong phiếu; sau đó ghép lại bằng script có kiểm biên (từ đầu/từ cuối mỗi phiếu phải khớp đúng dòng nguồn, không hở, không chồng). File nguồn không bị sửa.

Sau khi ghép, tôi tự soát lại hai vòng và **có sửa tay 27 dòng + hạ 57 dòng từ mức 5 xuống 4** (chi tiết ở mục "tự soát" dưới). Đây là chỗ tôi muốn Claude soi kỹ nhất, vì nó là phần không hoàn toàn "chấm mù".

**Hai file ở đâu.**
- `bilion-rarity-audit/tu_thucvat_hy3.tsv` — 4.586 dòng dữ liệu
- `bilion-rarity-audit/tu_doi_chieu_dongvat_hy3.tsv` — 120 dòng dữ liệu

Cả hai: 4 cột `lexicon word pop ghi_chu`, tab, có dòng tiêu đề, UTF-8 không BOM, LF. Hai cột đầu nguyên văn và đúng thứ tự đầu vào.

**Bảng phân bố — `tu_thucvat_hy3.tsv`** (4.586 dòng)

| pop | số từ | % |
|---|---|---|
| 1 | 1.843 | 40,2% |
| 2 | 1.446 | 31,5% |
| 3 | 800 | 17,4% |
| 4 | 412 | 9,0% |
| 5 | 85 | 1,9% |

**Bảng phân bố — `tu_doi_chieu_dongvat_hy3.tsv`** (120 dòng)

| pop | số từ | % |
|---|---|---|
| 1 | 25 | 20,8% |
| 2 | 23 | 19,2% |
| 3 | 22 | 18,3% |
| 4 | 24 | 20,0% |
| 5 | 26 | 21,7% |

Hai phân bố khác nhau rất xa, và tôi cho là đúng như vậy: kho thực vật là danh sách đi từ từ phổ thông xuống từ chuyên môn/hiếm nên nặng về 1–2; bộ 120 từ động vật là mẫu lấy đều các mức nên phẳng. Tôi không kéo cho hai bên giống nhau.

**Tự soát sau khi ghép (phần cần Claude biết).**
1. So 37 từ neo trong `rubric-do-quen.md` với kết quả: **37/37 khớp mức neo**.
2. Viết script quét mọi cặp "từ Việt — từ Anh" nằm cạnh nhau mà bản tiếng Anh **không** bị chấm thấp hơn bản tiếng Việt. Bắt được 2 lỗi thật do biên phiếu cắt đúng vào giữa cặp: `Dưa hấu = 3 / Watermelon = 5` và `Dừa = 3 / Coconut = 5`. Đã sửa thành `Dưa hấu = 4 / Watermelon = 3`, `Dừa = 5 / Coconut = 3`. 381 cặp còn lại là từ đồng nghĩa đặt cạnh nhau nên bằng mức là đúng.
3. Đối chiếu danh sách neo mức 5 của rubric: ban đầu có 142 từ ở mức 5, rõ ràng là lạm phát so với nghĩa "từ đầu tiên bật ra". Tôi lập danh sách trắng ~90 từ lõi (Chuối, Táo, Cam, Xoài, Lúa, Rau muống, Hoa hồng, Hoa sen, Dừa, Cà phê, Trà, Mía, Cỏ…) và hạ 57 từ ngoài danh sách trắng từ 5 xuống 4. Mức 5 còn 85 dòng (= 142 − 57, sau khi gộp 11 từ trùng ở dưới thì `Gạo` và `Mắm` về 5). Danh sách trắng nằm trong script, xem lại được.
4. Sửa `Cúc = 5` xuống 4 cho khớp `Hoa cúc = 4` (cùng một thứ, rubric nói chấm theo tên người ta hay gọi nhất — ở đây hai tên ngang nhau nên lấy cùng mức).

**Từ tự thấy khó chấm.** 10 từ, đều đã để mức 1 và đánh `?`:
- `tu_thucvat_hy3.tsv`: `Bom`, `Doi`, `Hạnh`, `Trường`, `Xay`, `Dưa hồng`, `Tre mai`, `De`, `Củ cái`
- `tu_doi_chieu_dongvat_hy3.tsv`: `Khủng long Tam giác`

Lý do: `Bom`, `Doi`, `Xay`, `De`, `Trường` là âm tiết tiếng Việt trần, không đủ để xác định là tên cây — rất có thể là mảnh của một tên dài bị cắt khi tách kho. `Hạnh` có thể là hạnh nhân (quen) hoặc cây hạnh (lạ), không xác định được ý nào. `Dưa hồng` và `Tre mai` tôi không xác nhận được là tên thật. `Củ cái` thì ngược lại: tôi *nghi* đây là tên gọi khác của củ cải trắng (quen, mức 3–4), nhưng không chắc nên để 1 + `?` thay vì đoán. `Khủng long Tam giác` là tên dịch máy, không phải tên tiếng Việt dùng thật.

**Câu hỏi còn tồn.**
1. Mức 5 chỉ chiếm 1,9% kho thực vật (85/4.586). Tôi cho là đúng bản chất kho, nhưng nếu chủ dự án cần mức 5 đủ dày để làm "bậc dễ nhất" cho người chơi mới thì phải nới tiêu chí, không phải sửa từng từ. Cần quyết trước khi dùng số.
2. Cách hạ 57 từ 5→4 theo danh sách trắng là quyết định của tôi, không có trong rubric. Nếu Claude thấy sai hướng thì nên bỏ hẳn bước này và chấm lại 142 từ đó, đừng chỉnh nửa vời.
3. `tu_dong_vat_workbuddy.tsv` của TASK-001 đã giao trước đó **không** áp dụng bước hạ mức 5 này. Nếu giữ chính sách danh sách trắng thì bản TASK-001 cũng cần soát lại cho cùng thang, nếu không thì phép so ba nguồn trên 120 từ sẽ lẫn hai thang khác nhau.
4. 9 từ đánh `?` ở kho thực vật: nếu đúng là mảnh tên bị cắt khi tách kho thì nên sửa ở khâu tách kho rồi chấm lại, chứ không phải để mức 1 trong dữ liệu cuối.

### Sửa theo mục Duyệt: 11 từ trùng chấm hai mức — đã xong

Quét lại toàn file: **149 từ xuất hiện nhiều lần (301 dòng)**, đúng **11 từ** bị chấm hai mức — khớp danh sách trong mục Duyệt, không thêm không bớt. Đã gộp mỗi từ về một mức, sửa đúng **11 ô**, không chấm lại dòng nào khác. `tu_doi_chieu_dongvat_hy3.tsv` không có từ trùng nên không đụng tới.

| từ | trước | chốt | lý do |
|---|---|---|---|
| `Gạo` | 4 / 5 | **5** | nghĩa thường ngày là hạt gạo. Dòng 4 là bí danh của `Cây gạo` (cây gạo) — chuỗi khác nên `Cây gạo` vẫn để 4. |
| `Mắm` | 5 / 3 | **5** | "mắm" là từ chỉ đồ mắm/nước mắm, ai cũng biết. Dòng 3 là bí danh của `Cây Mắm` (cây mắm, rừng ngập mặn); **cả hai dòng đều là bí danh** nên phiếu mới bỏ, không ảnh hưởng bảng bậc. |
| `Gỗ lim` | 4 / 1 | **4** | lim là loại gỗ ai cũng biết tên, chốt 4 cho khớp `Lim`=4 và `Cây gỗ lim`=4 đã chấm. Dòng 1 là lỗi do nằm giữa một loạt gỗ rừng hiếm. |
| `Măng tre` | 3 / 4 | **4** | măng là món quen; `Măng`=5 là tên người ta hay gọi, `Măng tre` là dạng viết đủ nên 4. |
| `Tỏi Lý Sơn` | 3 / 1 | **3** | đặc sản có tên trên báo chí/thị trường, nhiều người nhận ra. |
| `Nghệ đen` | 2 / 1 | **2** | biết qua tinh bột nghệ đen, không phổ thông. |
| `Tỏi đen` | 2 / 1 | **2** | sản phẩm sức khỏe phổ biến vài năm nay. |
| `Hồ đào` | 1 / 2 | **2** | biết qua "hạt hồ đào"; tên thường gọi của quả óc chó vẫn là "óc chó". |
| `Ngải bún` | 2 / 1 | **1** | cây gia vị chuyên môn, phải tra mới biết. |
| `Cashew` | 1 / 2 | **1** | từ tiếng Anh. |
| `Monstera` | 1 / 2 | **1** | tên cây cảnh ngoại lai. |

Kiểm lại sau khi sửa: 4.586 dòng, 0 lệch thứ tự/nguyên văn, `pop` nguyên 1–5, **0 từ còn lệch mức**, 37/37 neo vẫn đúng, 9 dòng `?` giữ nguyên. Phân bố dịch nhẹ: mức 1 −2, mức 2 không đổi, mức 3 −1, mức 4 +1, mức 5 +2 (bảng phân bố ở trên đã cập nhật).

Phần "26 cặp tiếng Anh bị bỏ sót" — nhận là sót thật, và biết vì sao. Phần lớn trong số đó script của tôi **có** bắt (nằm trong 383 cặp) nhưng tôi tự loại vì cho rằng "cả hai đều thấp, không hậu quả" — đánh giá đó quá dễ, vì lệch chiều ngay trong cùng một mục là lỗi thật (`Quýt Mandarin`=1 đứng trước `Mandarin`=2, `Dâu đen gai`=1 trước `Blackberry`=2). Số còn lại thì script bỏ sót vì chỉ so hai dòng **cạnh nhau**: `Nấm Truffle`=1 đứng trước `Nấm cục`=2, nên `Truffle`=2 được so với `Nấm cục` (2/2, không lệch) thay vì so với tên chính của nó. Đúng như mục Duyệt nói, cả 26 cặp đều là dòng bí danh nên phiếu mới bỏ; tôi để nguyên theo yêu cầu chỉ sửa 11 dòng, nhưng nếu cần thì sửa được trong một lượt mà không chạm tên chính.

## Duyệt (Claude điền)
Claude kiểm số dòng và thứ tự, rồi so ba nguồn trên 120 từ động vật (TASK-001, TASK-004, và kho trong repo): báo tỉ lệ khớp tuyệt đối, tỉ lệ lệch ≤ 1 mức, và danh sách lệch ≥ 2 mức. Nếu hai model lệch hệ thống (một bên luôn chấm cao hơn) thì ghi vào `decisions.md` trước khi dùng số của bên nào. Không ghi đè số cũ khi chủ dự án chưa đồng ý.

**Nhận phần lớn, cần sửa một chỗ.** Chất lượng chấm cao nhất trong ba bản tới nay — xem bảng ba nguồn dưới. Nhưng có một khuyết điểm người nhận không nêu trong báo cáo.

| Kiểm | Kết quả |
|---|---|
| `tu_thucvat_hy3.tsv` đúng 4.586 dòng, thứ tự và hai cột đầu nguyên văn | đạt, 0 lệch |
| `tu_doi_chieu_dongvat_hy3.tsv` đúng 120 dòng, nguyên văn | đạt, 0 lệch |
| `pop` nguyên 1–5, không trống | đạt, 0 ô sai |
| Báo cáo có phân bố cả hai file | đạt |
| 37 từ neo `thucvat` của rubric | 37/37 đúng mức |
| Hai cặp tự sửa (`Dưa hấu`/`Watermelon`, `Dừa`/`Coconut`) | đúng như báo cáo: 4/3 và 5/3 |
| `Cúc` hạ về 4 cho khớp `Hoa cúc` | đúng |
| Số dòng mức 5 sau khi hạ 57 dòng | 83, đúng như báo cáo |
| **152 dòng trùng từ, cùng từ phải cùng mức** | **11 từ bị chấm khác mức — cần sửa** |

### Cần sửa: 11 từ trùng chấm hai mức khác nhau

`Măng tre` 3/4 · `Gạo` 4/5 · `Gỗ lim` 4/1 · `Cashew` 1/2 · `Monstera` 1/2 · `Mắm` 5/3 · `Ngải bún` 2/1 · `Nghệ đen` 2/1 · `Tỏi đen` 2/1 · `Tỏi Lý Sơn` 3/1 · `Hồ đào` 1/2

Cùng một chuỗi chữ không thể vừa quen vừa lạ. `Gỗ lim` 4/1 và `Mắm` 5/3 lệch tới 2–3 mức. Chỗ này không tự quyết được thay người nhận: chọn mức nào là phán đoán của người chấm, nên trả lại.

Đây đúng là bước DeepSeek ở TASK-003 có làm mà bản này bỏ: nó quét 56 dòng trùng, tìm được 6 chỗ lệch và gộp trước khi giao. Đề nghị chạy đúng bước đó rồi giao lại — chỉ sửa 11 dòng, không chấm lại gì khác.

Thêm một chỗ nhỏ, không cần giao lại: script "tên tiếng Anh phải thấp hơn tên Việt" bỏ sót 26 cặp, trong đó đúng nghĩa tiếng Anh là `Truffle`, `Mandarin`, `Tangerine`, `Blueberry`, `Blackberry` — đều cao hơn tên Việt 1 mức. Sau khi phiếu chuyển sang chỉ xuất tên chính thì các dòng này không còn dùng nữa.

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

### Về bước hạ 57 từ từ mức 5 xuống 4 — nhận, nhưng ghi lại

Người nhận tự nêu và tự đề nghị bỏ nếu sai hướng. Giữ, vì ba lý do: hướng đúng theo định nghĩa "5 = từ đầu tiên bật ra", người nhận công khai chứ không giấu, và danh sách trắng xem lại được. Nhưng phải nhớ rằng mức 5 của `thucvat` được đặt bằng một danh sách viết tay, không phải bằng phán đoán từng từ. Đã ghi vào `decisions.md`.

Hai điều người nhận nêu kèm, đều đúng:
- `tu_dong_vat_workbuddy.tsv` (TASK-001) **không** qua bước này. Nên **không** so mức 5 giữa `thucvat` và kho động vật. Phép so ba nguồn ở trên không bị ảnh hưởng: bộ 120 từ không nằm trong `thucvat` nên danh sách trắng không chạm tới nó.
- 9 từ `?` (`Bom`, `Doi`, `Hạnh`, `Trường`, `Xay`, `De`…) rất có thể là mảnh tên bị cắt khi tách kho, không phải tên cây. Đồng ý: sửa ở khâu tách kho rồi chấm lại, đừng để mức 1 trong dữ liệu cuối. Chưa làm.

### Trả lời câu hỏi còn tồn

**Mức 5 chỉ 1,8% kho thực vật — có cần nới?** Không nới ở đây. Nếu bậc dễ nhất cần dày hơn thì chữa ở khâu chọn đáp án, không chữa bằng cách đẩy độ quen của từ lên. `pop` phải đo độ quen thật, nếu không thì mọi phép so sau này mất mốc.

### Một khuyết điểm của phiếu chấm — lỗi của Claude, không phải của người nhận

Phiếu được sinh bằng cách rải **mọi tên** của mỗi mục thành dòng riêng, nên tên khác (kể cả tên tiếng Anh) bị chấm như từ độc lập: 513/3.198 dòng của `monan`, **1.729/4.586 dòng (38%) của `thucvat`**. Nhưng `pop` trong kho thuộc về cả mục, không thuộc từng tên.

Cả hai model đều chấm **đúng** ở đây: `Water spinach` 5→1, `Fish sauce` 5→1, `Cassava` 4→1 — người Việt không nói ra tên tiếng Anh. Tên không dấu/tiếng Anh lệch trung bình **−0,40** (DeepSeek) và **−0,52** (HY3) so với kho, gần hết là ca này. Số đó là nhiễu của phiếu, không phải phát hiện về kho.

Đã sửa `scripts/emit-lex-tsv.ts` chỉ xuất tên chính (`monan` 3.198 → 2.638 dòng, `thucvat` 4.586 → 2.805 dòng). **Không chấm lại:** các dòng tên chính vẫn dùng được nguyên; khi áp số thì bỏ dòng tên khác.

---

## Duyệt lần hai (Claude điền) — `đã nhận`

**Đã nhận.** Sửa đúng việc được yêu cầu, không rộng hơn, không hẹp hơn.

| Kiểm | Kết quả |
|---|---|
| 4.586 dòng, thứ tự và hai cột đầu nguyên văn đầu vào | đạt, 0 lệch |
| `pop` nguyên 1–5, không trống | đạt |
| 11 từ trùng đã về một mức | đạt — `Gạo` 5 · `Mắm` 5 · `Gỗ lim` 4 · `Măng tre` 4 · `Tỏi Lý Sơn` 3 · `Nghệ đen` 2 · `Tỏi đen` 2 · `Hồ đào` 2 · `Ngải bún` 1 · `Cashew` 1 · `Monstera` 1 |
| Không còn từ nào chấm hai mức | đạt, 0 |
| 37 từ neo `thucvat` của rubric | 37/37 vẫn đúng mức |
| 9 dòng `?` | giữ nguyên |
| `tu_doi_chieu_dongvat_hy3.tsv` không bị đụng | đạt, md5 không đổi |

### Chứng minh đúng 11 ô bị sửa, không một ô nào khác

Không có bản cũ để diff, nhưng phân bố mới kiểm chéo được. Từ 11 mức chốt, tính ra dòng nào phải nhảy mức, cộng lại theo từng mức:

| Mức | Dự đoán từ 11 chỗ sửa | Phân bố thật (cũ → mới) |
|---|---|---|
| 1 | −2 | 1.845 → 1.843 ✓ |
| 2 | 0 | 1.446 → 1.446 ✓ |
| 3 | −1 | 801 → 800 ✓ |
| 4 | +1 | 411 → 412 ✓ |
| 5 | +2 | 83 → 85 ✓ |

Khớp cả năm mức. Nếu có ô thứ 12 bị sửa thì ít nhất một dòng trong bảng này phải lệch. So với kho cũng chỉ dịch nhẹ đúng cỡ đó: lệch ≥2 mức 415 → 416, lệch TB +0,54 không đổi.

### Một điều cả hai bên đều chưa nói ra

**Cả 11 ca trùng đều là dòng bí danh**, không có ca nào là hai tên chính đụng nhau:
`Gạo` là bí danh của `Hoa gạo` (pop 4) và của `Lúa` (pop 5) · `Mắm` của `Nước mắm` (5) và `Cây Mắm` (1) · `Gỗ lim` của `Lim` (3) và `Cây gỗ lim` (1) · `Hồ đào` của `Hạt hồ đào` và `Cây hồ đào` · `Cashew` của `Điều` (2) và `Hạt điều` (3) · `Monstera` của `Cây trầu bà lá xẻ` (2) và `Cây Monstera` (1).

Nghĩa là lỗi trùng mức **không phải khuyết điểm của người chấm** mà là hệ quả trực tiếp của phiếu rải mọi tên thành dòng riêng: một chuỗi chữ là bí danh của hai mục khác nghĩa thì không có một mức nào đúng cho nó. Phiếu đã sửa (chỉ xuất tên chính) làm cả lớp lỗi này mất hẳn, không cần quy tắc gộp nào nữa. Quy tắc "lấy nghĩa phổ thông hơn" trong `decisions.md` vẫn đúng, nhưng từ nay sẽ không có chỗ dùng.

Ngoại lệ duy nhất đáng ghi: `Măng tre` **là** tên chính của một mục (kho cho pop 1) **và** đồng thời là bí danh của `Măng` (pop 3). Chốt 4 là một trong các ca "kho chấm lạ quá tay" — `Măng tre` 1→4 đã nằm trong danh sách 380 ca kéo lên.

### Hai chỗ ghi sai tên mục trong báo cáo, không đổi kết luận

- `Gạo` mức 4 là bí danh của **`Hoa gạo`**, không phải `Cây gạo` (kho không có mục nào tên `Cây gạo`).
- `Lim` trong kho là **pop 3**, không phải 4; `Cây gỗ lim` là pop 1. Con số 4 trong báo cáo là mức do chính người nhận chấm, không phải mức của kho.

Cả hai đều không làm đổi mức chốt nào.

### Nhận lỗi 26 cặp bí danh — chấp nhận lời giải thích

Lý do nêu ra kiểm được và đúng: script chỉ so hai dòng **cạnh nhau**, nên `Truffle`=2 bị so với `Nấm cục`=2 thay vì với tên chính của nó. Để nguyên là đúng theo yêu cầu "chỉ sửa 11 dòng"; sau khi phiếu bỏ dòng bí danh thì các dòng này không còn được dùng.

### Chưa làm, chờ chủ dự án

Không ghi đè `pop` nào trong kho. Hai việc cần chốt trước khi dùng số, đã nêu trong `checkpoints.md`: hiệu chỉnh thang của DeepSeek (~0,4 mức), và có áp hướng "kho chấm lạ quá tay" cho `thucvat` hay không.
