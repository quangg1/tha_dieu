# TASK-007: chấm lại 7 kho, mỗi kho một lượt riêng

- Người nhận: WorkBuddy · model **HY3**
- Trạng thái: đã giao
- Giao ngày: 2026-10-23

## Bối cảnh
TASK-006 giao bạn 11 kho. Bốn kho đầu (`nhanvat`, `diadanh`, `douong`, `ngonngu`) chấm rất tốt — `nhanvat` khớp đủ **25/25 từ neo** của rubric, bản chắc tay nhất trong bốn đợt, và cả bốn đã được áp vào sổ.

Bảy kho sau thì không dùng được, và lý do không phải cảm nhận của người duyệt:

| Kho | Dòng | Số từ ở mức 1 | Số từ ở mức 2 | Lệch TB so với sổ |
|---|---|---|---|---|
| `tungu` | 681 | **0** | 47 | +0,79 |
| `dovat` | 515 | **0** | 8 | +1,91 |
| `cotich` | 359 | **0** | **0** | +2,53 |
| `thethao` | 307 | **0** | **0** | +2,59 |
| `quanao` | 169 | **0** | **0** | +2,44 |
| `mausac` | 112 | **0** | **0** | +2,96 |
| `diaphuong` | 63 | **0** | **0** | +2,03 |

Bốn kho được nhận có 619, 336, 207, 149 từ ở mức 1. Bảy kho này không có một từ nào. Thêm hai chỗ:

- **Từ neo rubric bị vi phạm.** `diaphuong`: 17/20 lệch — cả 63 tỉnh đều mức 5, trong khi rubric ghi `Bắc Kạn` và `Hậu Giang` mức 1. `dovat`: 24/32 lệch — `Chạn` và `Ang` rubric mức 1, bản chấm cho 5.
- **Bản chấm tự mâu thuẫn với bộ chồng của chính bạn.** Trong `tu_doi_chieu_22kho_hy3.tsv` ba từ `diaphuong` được chấm **1, 2, 3**; trong `tu_diaphuong_hy3.tsv` cả 63 tỉnh là **5**. `mausac`, `quanao`, `cotich` cũng vậy.

Hình dạng lỗi khá rõ: bốn kho lớn làm trước thì tốt, bảy kho nhỏ làm sau thì sập, và càng về sau càng nặng (`mausac` +2,96). Nên lần này **mỗi kho một lượt riêng**, không làm liền mạch.

## Việc cần làm

Bảy lượt độc lập, theo thứ tự này. **Kết thúc mỗi lượt thì tự kiểm (mục dưới) và ghi kết quả tự kiểm vào báo cáo, rồi mới sang lượt sau.**

| Lượt | Kho | Phiếu chấm | Số dòng | File kết quả |
|---|---|---|---|---|
| 1 | `tungu` (từ ngữ) | `tu_tungu_can_cham.tsv` | 681 | `tu_tungu_hy3_v2.tsv` |
| 2 | `dovat` (đồ vật) | `tu_dovat_can_cham.tsv` | 515 | `tu_dovat_hy3_v2.tsv` |
| 3 | `cotich` (cổ tích) | `tu_cotich_can_cham.tsv` | 359 | `tu_cotich_hy3_v2.tsv` |
| 4 | `thethao` (thể thao) | `tu_thethao_can_cham.tsv` | 307 | `tu_thethao_hy3_v2.tsv` |
| 5 | `quanao` (quần áo) | `tu_quanao_can_cham.tsv` | 169 | `tu_quanao_hy3_v2.tsv` |
| 6 | `mausac` (màu sắc) | `tu_mausac_can_cham.tsv` | 112 | `tu_mausac_hy3_v2.tsv` |
| 7 | `diaphuong` (tỉnh thành) | `tu_diaphuong_can_cham.tsv` | 63 | `tu_diaphuong_hy3_v2.tsv` |

Phiếu chấm là file cũ, không đổi. Bản cũ (`tu_<kho>_hy3.tsv`) để nguyên, đừng ghi đè — để còn so được hai bản.

Không cần chấm lại bộ 160 từ chồng. Thang của bạn đã được xác nhận: trên bộ đó bạn và DeepSeek khớp 114/160, lệch ≤ 1 mức 157/160, lệch trung bình **+0,00**. Vấn đề của bảy kho này không phải lệch thang.

## Tự kiểm sau mỗi lượt — bắt buộc, ghi kết quả vào báo cáo

**1. Đếm số từ ở từng mức.** Nếu mức 1 ra **0 từ**, dừng lại và đọc lại cả kho một lượt nữa. Mức 1 nghĩa là "gần như chỉ người trong nghề, trong vùng hoặc đam mê mới biết" — kho nào cũng có phần đuôi như vậy. Nếu đọc lại mà vẫn thấy đúng là 0 thì **ghi vào báo cáo kèm lý do**, đừng bịa thêm từ mức 1 cho đủ hình. Tôi cần con số thật, không cần con số đẹp.

**2. Đối chiếu từ neo.** Các từ dưới đây phải ra đúng mức ghi kèm. Lệch 1 mức thì giải thích trong báo cáo; lệch từ 2 mức thì chấm lại kho đó.

`dovat` và `diaphuong` — neo lấy từ `rubric-do-quen.md`, đây là chuẩn đã duyệt:

| Kho | Mức 5 | Mức 4 | Mức 3 | Mức 2 | Mức 1 |
|---|---|---|---|---|---|
| `dovat` | Nồi · Bát · Đũa · Bàn · Ghế · Gối · Bút · Sách | Dao · Đĩa · Tủ lạnh · Ti vi · Quạt · Cặp sách · Khăn tắm | Lò vi sóng · Ấm trà · Compa · Bút màu · Tua vít · Vòi sen | Chày cối · Xửng hấp · Ghế bập bênh · Dập ghim · Ê tô | Chạn · Ang · Mẹt · Quang gánh · Gàu sòng · Máy đánh chữ |
| `diaphuong` | Hà Nội · TP Hồ Chí Minh · Đà Nẵng | Hải Phòng · Cần Thơ · Huế · Nghệ An · Lâm Đồng | Lào Cai · Nam Định · Quảng Bình · Đắk Lắk · An Giang | Tuyên Quang · Hà Nam · Ninh Thuận · Trà Vinh · Bạc Liêu | Bắc Kạn · Hậu Giang |

Năm kho còn lại rubric không có neo, nên neo lấy từ **bộ 160 từ chồng** — chỗ bạn và DeepSeek đã chấm và đã khớp nhau. Khoảng (ví dụ `2–3`) là chỗ hai bên lệch 1 mức, bạn chọn trong khoảng đó:

| Kho | Từ neo |
|---|---|
| `tungu` | `Thông minh` 5 · `Vui` 5 · `Nước mắm` 5 · `Nóng nảy` 4–5 · `Ầm ầm` 4–5 · `Đùng đoàng` 3 · `Xì xụp` 2–3 · `Uỳnh uỳnh` 2 |
| `cotich` | `Con Rồng cháu Tiên` 5 · `Mỵ Châu Trọng Thủy` 4 · `Vợ nhặt` 3–5 · `Sự tích chim hít cô` 1 |
| `thethao` | `Bóng bàn` 5 · `Bóng rổ` 5 · `Bóng ném` 3–4 · `Ném búa` 2–3 |
| `quanao` | `Áo len` 4–5 · `Mũ phớt` 3 · `Lắc chân` 3 |
| `mausac` | `Xanh lá` 4–5 · `Chàm` 3 · `Thiên thanh` 2–3 |

**3. Quét từ trùng.** Cùng một chuỗi chữ phải có cùng một `pop` trong một file. Báo số từ trùng tìm được và số chỗ phải gộp.

## Luật chấm (giữ nguyên từ TASK-006)

1. Đọc `rubric-do-quen.md` trước khi bắt đầu mỗi lượt.
2. Chấm độc lập từng từ. **Không chuẩn hoá phân bố** — kho lệch về một mức là bản chất của kho.
3. Phiếu chỉ có tên chính, không có dòng tên khác.
4. Từ không xác nhận được là có thật, hoặc trông như viết sai / dịch máy / mảnh tên bị cắt: mức 1 và đặt `?` ở cột `ghi_chu`.
5. **Không tự hậu xử lý bằng danh sách tay.** Thấy mức nào lạm phát thì ghi vào báo cáo để Claude quyết.
6. `pop` đo **"người ta tự kể ra được từ đó"**, không đo "nhận ra khi đọc thấy". Người chơi **gõ** đáp án.
7. Không sửa file nào trong repo ngoài mục Báo cáo của task này.

## Đầu ra
7 file, mỗi file 4 cột `lexicon  word  pop  ghi_chu`, tab ngăn cách, có dòng tiêu đề, UTF-8 không BOM, LF, kết thúc bằng newline. **Mọi dòng đúng 4 cột, kể cả dòng cuối, kể cả khi `ghi_chu` rỗng** — bốn đợt trước file nào cũng thiếu ô cuối.

## Tiêu chí nghiệm thu
- Mỗi file đúng số dòng của phiếu, cùng thứ tự và nguyên văn hai cột đầu.
- `pop` nguyên 1–5, không trống. Mọi dòng đúng 4 cột.
- 0 từ trùng chấm khác mức.
- Từ neo: 0 chỗ lệch ≥ 2 mức.
- Mục Báo cáo có, cho **từng kho**: bảng phân bố 5 mức, kết quả đối chiếu từ neo, số từ trùng đã gộp, và nhận xét ngắn nếu mức 1 ra 0 từ.

## Báo cáo (người nhận điền)
Bảy mục, mỗi kho một mục, theo thứ tự đã làm. Rồi đổi trạng thái sang `chờ duyệt`.

## Duyệt (Claude điền)
Claude kiểm từng file, đối chiếu từ neo, so với bản `tu_<kho>_hy3.tsv` cũ để thấy đã đổi gì, rồi áp vào sổ bằng `scripts/apply-pop.ts` — chỉ các mục lệch ≥ 2 mức so với sổ. Không cần bảng chuyển thang.
