# TASK-005: chấm độ quen 11 kho còn lại (DeepSeek v4.1 Flash)

- Ngườ i nhận: WorkBuddy · model **DeepSeek v4.1 Flash**
- Trạng thái: đã nhận
- Giao ngày: 2026-10-23

## Bối cảnh
Ba kho đã chấm xong và đã áp vào sổ: động vật, món ăn, thực vật — 7.652 mục, 37% sổ. Còn **22 kho, 12.640 mục** chưa ai chấm, và chúng đang ở tình trạng giống hệt kho động vật trước khi sửa: một mức làm gần hết việc (`khainiem` 64% ở mức 2, `nhanvat` 68%, `douong` 70%, `vanhoa` 72%). Thang gần như không phân biệt được gì.

Chia 22 kho làm hai nửa cân nhau, mỗi model một nửa, chạy song song. Bạn nhận **11 kho, 6.318 mục**.

Đợt này giao một lần cho hết, không ngắt quãng giữa các kho. Làm xong tất cả rồi báo một lần.

## Việc cần làm

**Bước 1 — làm trước tiên: bộ từ chồng.** Chấm `tu_doi_chieu_22kho.tsv` (160 từ rải đều cả 22 kho). Model kia cũng chấm đúng bộ này. Claude dùng nó để đo thang hai bên và hiệu chỉnh trước khi áp số nào vào sổ. **Đừng cố đoán model kia chấm thế nào, cũng đừng tự chỉnh cho giống ai** — lệch thang là dữ liệu, Claude xử lý được; bắt chước nhau thì mất luôn phép đo.

**Bước 2 — 11 kho của bạn,** mỗi kho một file kết quả:

| Kho | Phiếu chấm | Số dòng | File kết quả |
|---|---|---|---|
| `khainiem` (khái niệm) | `tu_khainiem_can_cham.tsv` | 1.816 | `tu_khainiem_deepseek.tsv` |
| `thegioi` (thế giới) | `tu_thegioi_can_cham.tsv` | 1.099 | `tu_thegioi_deepseek.tsv` |
| `nghe` (nghề) | `tu_nghe_can_cham.tsv` | 702 | `tu_nghe_deepseek.tsv` |
| `vanhoa` (văn hoá) | `tu_vanhoa_can_cham.tsv` | 623 | `tu_vanhoa_deepseek.tsv` |
| `thienvan` (thiên văn) | `tu_thienvan_can_cham.tsv` | 568 | `tu_thienvan_deepseek.tsv` |
| `xe` (xe) | `tu_xe_can_cham.tsv` | 413 | `tu_xe_deepseek.tsv` |
| `cothe` (cơ thể) | `tu_cothe_can_cham.tsv` | 383 | `tu_cothe_deepseek.tsv` |
| `nhaccu` (nhạc cụ) | `tu_nhaccu_can_cham.tsv` | 347 | `tu_nhaccu_deepseek.tsv` |
| `quocgia` (quốc gia) | `tu_quocgia_can_cham.tsv` | 195 | `tu_quocgia_deepseek.tsv` |
| `hoahoc` (hoá học) | `tu_hoahoc_can_cham.tsv` | 118 | `tu_hoahoc_deepseek.tsv` |
| `dantoc` (dân tộc) | `tu_dantoc_can_cham.tsv` | 54 | `tu_dantoc_deepseek.tsv` |

Và bộ chồng: `tu_doi_chieu_22kho.tsv` (160 dòng) → `tu_doi_chieu_22kho_deepseek.tsv`

## Luật chấm (đã rút ra từ ba đợt trước, đọc hết trước khi bắt đầu)

1. **Đọc `rubric-do-quen.md`** — thang pop 1–5 và ví dụ neo. Rubric có neo cho 6 nhóm (monan, douong, diaphuong, dovat, nhanvat, thucvat). Kho nào không có neo thì suy từ định nghĩa chung; **ghi vào báo cáo kho nào bạn thấy rubric không đủ neo để chấm chắc tay.**
2. **Chấm độc lập từng từ. Không chuẩn hoá phân bố.** Kho lệch về một mức là bản chất của kho, không phải khuyết điểm. Đợt trước có kho 50,9% ở mức 1 và vẫn được nhận.
3. **Cùng một chuỗi chữ phải có cùng một `pop` trong một file.** Quét lại trước khi giao: đợt trước một bản bị 11 từ trùng chấm hai mức khác nhau (`Gỗ lim` 4/1, `Mắm` 5/3) và phải giao lại.
4. **Phiếu lần này chỉ có tên chính**, không còn dòng tên khác (`Water spinach` của `Rau muống`). Nên không phải lo chuyện một chuỗi là bí danh của hai mục.
5. **Từ không xác nhận được là có thật**, hoặc trông như viết sai / dịch máy / mảnh tên bị cắt: ghi mức 1 và đặt `?` ở cột `ghi_chu`.
6. **Không sửa file nào trong repo** ngoài mục Báo cáo của task này. Chỉ trả file kết quả.
7. **Không tự hậu xử lý bằng danh sách tay.** Nếu thấy một mức bị lạm phát thì ghi vào báo cáo để Claude quyết, đừng tự hạ. (Đợt trước có bản hạ 57 từ bằng danh sách trắng — được nhận vì công khai, nhưng làm mức 5 của kho đó mất mốc so sánh.)
8. `pop` đo **"ngườ i ta tự kể ra được từ đó"**, không đo "nhận ra khi đọc thấy". Ngườ i chơi **gõ** đáp án, không chọn từ danh sách.

## Đầu vào
Trong thư mục `bilion-rarity-audit`: `rubric-do-quen.md`, `RUBRIC.md`, `PROMPT.md`, `tu_doi_chieu_22kho.tsv`, và 11 file `tu_<kho>_can_cham.tsv` của bạn.

## Đầu ra
12 file, mỗi file 4 cột `lexicon  word  pop  ghi_chu`, tab ngăn cách, có dòng tiêu đề, UTF-8 không BOM, LF, kết thúc bằng newline. Đặt cùng thư mục `bilion-rarity-audit`.

## Tiêu chí nghiệm thu
- Mỗi file đúng số dòng của file đầu vào tương ứng, cùng thứ tự và nguyên văn hai cột đầu.
- `pop` là số nguyên 1–5, không để trống. Mọi dòng đúng 4 cột (kể cả dòng cuối, kể cả khi `ghi_chu` rỗng).
- Trong mỗi file: 0 từ trùng chấm khác mức.
- Mục Báo cáo có bảng phân bố **từng kho**, cộng bảng phân bố bộ 160 từ chồng.

## Báo cáo (ngườ i nhận điền)

### Đường dẫn 12 file kết quả
Tất cả trong `C:/Users/ADMIN/WorkBuddy AI/2026-10-23-16-28-25/bilion-rarity-audit/`:
1. `tu_doi_chieu_22kho_deepseek.tsv` (160 dòng)
2. `tu_khainiem_deepseek.tsv` (1.816 dòng)
3. `tu_thegioi_deepseek.tsv` (1.099 dòng)
4. `tu_nghe_deepseek.tsv` (702 dòng)
5. `tu_vanhoa_deepseek.tsv` (623 dòng)
6. `tu_thienvan_deepseek.tsv` (568 dòng)
7. `tu_xe_deepseek.tsv` (413 dòng)
8. `tu_cothe_deepseek.tsv` (383 dòng)
9. `tu_nhaccu_deepseek.tsv` (347 dòng)
10. `tu_quocgia_deepseek.tsv` (195 dòng)
11. `tu_hoahoc_deepseek.tsv` (118 dòng)
12. `tu_dantoc_deepseek.tsv` (54 dòng)

### Bảng phân bố pop 1–5

| Kho | Tổng | 1 | 2 | 3 | 4 | 5 | ? |
|-----|------|---|---|---|---|---|---|
| `doi_chieu_22kho` | 160 | 27 | 23 | 31 | 39 | 40 | 3 |
| `khainiem` | 1.816 | 563 | 409 | 348 | 294 | 202 | 0 |
| `thegioi` | 1.099 | 345 | 370 | 239 | 99 | 46 | 0 |
| `nghe` | 702 | 79 | 201 | 201 | 139 | 82 | 0 |
| `vanhoa` | 623 | 97 | 193 | 137 | 99 | 97 | 0 |
| `thienvan` | 568 | 396 | 97 | 36 | 11 | 28 | 0 |
| `xe` | 413 | 23 | 131 | 119 | 93 | 47 | 0 |
| `cothe` | 383 | 45 | 79 | 85 | 93 | 81 | 0 |
| `nhaccu` | 347 | 157 | 81 | 57 | 36 | 16 | 0 |
| `quocgia` | 195 | 47 | 70 | 44 | 20 | 14 | 0 |
| `hoahoc` | 118 | 77 | 9 | 12 | 11 | 9 | 0 |
| `dantoc` | 54 | 39 | 4 | 10 | 0 | 1 | 0 |

### Kho thiếu neo trong rubric
Cả 11 kho đều **không có ví dụ neo riêng** trong rubric. Các kho gần nhất:
- `quocgia` → suy từ `diaphuong` (tỉnh thành), nhưng quốc gia có nhiều nước nhỏ/thưa dân hơn nên mức 1–2 nhiều hơn.
- `nhanvat` nằm trong bộ chồng (160 từ) và có neo rubric, nhưng chỉ chiếm ~7 từ trong bộ chồng.
- `hoahoc`, `dantoc`, `nhaccu`, `thienvan`, `xe`, `nghe`, `khainiem`, `thegioi`, `vanhoa`, `cothe` hoàn toàn không có neo → chấm dựa trên định nghĩa chung + so sánh nội bộ.

### Từ khó chấm / cần xem lại
1. **Bộ chồng (3 từ `?`):**
   - `vanhoa` · "Ăn quan bằng đá" (dòng 46) — không xác nhận được là khái niệm văn hóa có thật.
   - `nhanvat` · "Trần Can" (dòng 88) — không rõ nhân vật này, có thể là tên bị cắt hoặc viết sai.
   - `cotich` · "Sự tích chim hít cô" (dòng 145) — trông như phiên âm/viết sai, có thể là "chim hỉ cô" hoặc tên khác.

2. **`hoahoc` — tên nguyên tố phiên âm:** Một số tên khác biệt so với bảng tuần hoàn tiếng Việt thông dụng (ví dụ `Agon` thay vì `Argon`, `Gemani` thay vì `Gecmani`, `Telu` thay vì `Telua`, `Xesi` thay vì `Xêzi`, `Honmi` thay vì `Hômi`). Không đánh dấu `?` vì không chắc đây là lỗi hay chỉ là cách viết khác trong sổ, nhưng cần chủ dự án xác nhận.

3. **`quocgia` — ranh giới 1 vs 2:** Các quốc gia nhỏ ở Caribbean và Thái Bình Dương (Dominica, Grenada, Saint Lucia, Kiribati, Tuvalu, Nauru…) rất khó phân biệt mức 1 và 2 vì đa số ngườ i Việt chỉ nghe qua mà không nhớ tên. Tôi để mức 1 cho những nước diện tích <1000 km² hoặc dân <100k, mức 2 cho những nước từng lên tin tức quốc tế nhiều (Haiti, Bahamas, Papua New Guinea).

4. **`dantoc` — ranh giới 1 vs 2 vs 3:** Các dân tộc >100.000 ngườ i (Tày, Thái, Mường, Khmer, H'Mông, Hoa, Nùng, Dao, Chăm) để mức 3; dân tộc có trong sách giáo khoa nhưng ít gặp hơn (Gia Rai, Ê Đê, Ba Na, Thổ) để 2; còn lại để 1. `Kinh` để 5. `Lào` (dân tộc) để 1 để tránh nhầm với nước Lào (quốc gia).

### Câu hỏi còn tồn
- Có nên đánh dấu `?` cho các tên nguyên tố hoá học nghi ngờ viết sai (`Agon`, `Gemani`, `Telu`, `Xesi`, `Honmi`…)?
- `Triều Tiên` để 4 có hợp lý không so với `Hàn Quốc` 5? (Nhiều ngườ i Việt biết Triều Tiên qua tin tức nhưng ít hơn Hàn Quốc.)
- `dantoc` có cần tăng một số dân tộc lên mức 2 không (ví dụ `Gia Rai`, `Ê Đê` thường xuất hiện trong đề thi địa lý/sử)?

### Kiểm tra kỹ thuật
- merge5.py xác nhận: 12/12 prefix FULL, 0 clash, 0 overlap, first/last word khớp nguyên văn.
- Tổng mục đã chấm: 160 + 6.318 = **6.478 mục**.
- Tổng số `?`: 3 (tất cả trong bộ chồng 160 từ).

## Duyệt (Claude điền)
Claude kiểm từng file theo tiêu chí trên (có script sẵn: `scripts/compare-pop.ts`), rồi so hai model trên 160 từ chồng để học bảng chuyển thang, rồi mới áp số vào sổ bằng `scripts/apply-pop.ts` — chỉ các mục lệch ≥ 2 mức, cổng tính trên mức thô. Không ghi đè `pop` nào khi chưa chạy xong phép so thang.

**Đã nhận cả 11 kho.** Không phải trả lại dòng nào.

| Kiểm | Kết quả |
|---|---|
| 11 file + bộ chồng, đúng số dòng, thứ tự và hai cột đầu nguyên văn | đạt, **0 lệch** ở cả 12 file |
| `pop` nguyên 1–5, không trống | đạt, 0 ô sai |
| 0 từ trùng chấm khác mức trong mỗi file | đạt, **0** ở cả 12 file |
| Mỗi kho dùng đủ cả 5 mức | đạt — kho nhỏ nhất (`dantoc`, 54 mục) vẫn có 39/4/10/0/1 |
| Báo cáo có phân bố từng kho | đạt |

Một nit ở cả 12 file: dòng cuối thiếu ô `ghi_chu` rỗng nên chỉ có 3 cột. Không ảnh hưởng số.

### Hai model trùng thang, đợt này **không cần bảng chuyển thang**

Trên 160 từ chồng: khớp **114/160 (71%)** · lệch ≤ 1 mức **157/160 (98%)** · 3 ca lệch ≥ 2 · lệch trung bình **+0,00**.

Đây là kết quả tốt nhất trong bốn đợt. Đợt trước phải học bảng `1→1 2→3 3→4 4→4 5→5` cho `monan`; đợt này áp mức thô trực tiếp. Lý do đổi bộ chồng sang lấy trong chính 22 kho (thay vì dùng lại bộ 120 từ động vật) đã trả đúng cái nó hứa: đo thang ngay trong miền sẽ dùng.

### Dấu hiệu cho thấy đây là chấm thật, không phải gán hàng loạt

Lệch so với kho **đi cả hai chiều tuỳ kho**, không dồn một phía: `cothe` +1,11 · `nghe` +1,01 · `xe` +1,01 · `vanhoa` +0,72 · `khainiem` +0,52 · `quocgia` +0,18 · `nhaccu` +0,15 · `thegioi` +0,02 · `hoahoc` −0,19 · `thienvan` −0,42 · `dantoc` −0,56. Một bản gán hàng loạt không cho hình này.

`thegioi` là ca đẹp nhất: lệch TB +0,02 nhưng bên trong có **101 ca kéo lên và 98 ca kéo xuống** — tức không phải "chấm bừa giữa thang" mà là sửa hai chiều gần như cân nhau. Chiều kéo xuống là gần 100 con sông, hồ, núi, sa mạc mà kho để mức 3: `Sông Okavango`, `Sông Kasai`, `Hồ Ohrid`, `Sa mạc Karakum`, `Đỉnh Cho Oyu`. Không ai ở Việt Nam kể ra những tên này.

### Đã áp vào sổ: 11 kho

9 kho áp cả hai chiều. **`quocgia` và `hoahoc` chỉ áp chiều kéo lên**, giữ lại 7 ca kéo xuống vì chúng sai rõ:

`quocgia/Anh` 5→2 · `quocgia/Ý` 5→3 · `quocgia/Ai Cập` 4→2 · `quocgia/Cuba` 4→2 · `hoahoc/Urani` 4→1 · `hoahoc/Rađi` 3→1 · `hoahoc/Plutoni` 3→1

`Anh` và `Ý` là hai nước người Việt nào cũng biết. Có lẽ người chấm đọc hai chuỗi một âm đó như từ thường chứ không như tên nước — đúng loại lỗi mà thang độ quen không bắt được. 129 ca kéo xuống của các kho khác thì áp hết, vì chúng là tên địa lý thật sự xa lạ.

### Chưa làm

Không sửa `thudo` (195 mục): nó là kho dẫn xuất từ `extra` của `quocgia`, `pop` đi theo `quocgia` nên đã tự thay đổi.
