# TASK-005: chấm độ quen 11 kho còn lại (DeepSeek v4.1 Flash)

- Người nhận: WorkBuddy · model **DeepSeek v4.1 Flash**
- Trạng thái: đã giao
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
8. `pop` đo **"người ta tự kể ra được từ đó"**, không đo "nhận ra khi đọc thấy". Người chơi **gõ** đáp án, không chọn từ danh sách.

## Đầu vào
Trong thư mục `bilion-rarity-audit`: `rubric-do-quen.md`, `RUBRIC.md`, `PROMPT.md`, `tu_doi_chieu_22kho.tsv`, và 11 file `tu_<kho>_can_cham.tsv` của bạn.

## Đầu ra
12 file, mỗi file 4 cột `lexicon  word  pop  ghi_chu`, tab ngăn cách, có dòng tiêu đề, UTF-8 không BOM, LF, kết thúc bằng newline. Đặt cùng thư mục `bilion-rarity-audit`.

## Tiêu chí nghiệm thu
- Mỗi file đúng số dòng của file đầu vào tương ứng, cùng thứ tự và nguyên văn hai cột đầu.
- `pop` là số nguyên 1–5, không để trống. Mọi dòng đúng 4 cột (kể cả dòng cuối, kể cả khi `ghi_chu` rỗng).
- Trong mỗi file: 0 từ trùng chấm khác mức.
- Mục Báo cáo có bảng phân bố **từng kho**, cộng bảng phân bố bộ 160 từ chồng.

## Báo cáo (người nhận điền)
Ghi: đường dẫn 12 file; bảng phân bố từng kho; những kho rubric không đủ neo; những từ tự thấy khó chấm; số dòng `?` mỗi kho; câu hỏi còn tồn. Rồi đổi trạng thái sang `chờ duyệt`.

## Duyệt (Claude điền)
Claude kiểm từng file theo tiêu chí trên (có script sẵn: `scripts/compare-pop.ts`), rồi so hai model trên 160 từ chồng để học bảng chuyển thang, rồi mới áp số vào sổ bằng `scripts/apply-pop.ts` — chỉ các mục lệch ≥ 2 mức, cổng tính trên mức thô. Không ghi đè `pop` nào khi chưa chạy xong phép so thang.
