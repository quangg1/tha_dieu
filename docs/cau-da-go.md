# Câu đã gỡ ngày 23/10/2026 (để Kiro đối soát khi soạn lô mới)

Đợt rà soát đọc từng câu trong 403 câu đang hỏi và gỡ **106 câu** (còn **297 câu**). Các câu này **đã bị xoá hẳn** khỏi các file câu hỏi (và khỏi database bằng script SQL), nên Kiro có thể dùng lại đúng id cũ trong một release mới mà không bị vướng. Danh sách id đầy đủ nằm bên dưới; muốn xem nội dung cũ của một câu thì xem lịch sử git (commit trước b68d24a).

## Bốn phép thử một câu mới phải qua

1. **Vũ trụ đáp án hữu hạn và sổ phủ được phần lớn.** Hỏi "người nổi tiếng / tác phẩm / thương hiệu" nói chung là không có đáy: sổ 50–100 đáp án thì phần lớn tên người chơi gõ nằm ngoài sổ, điểm không công bằng và bộ chống gian lận dễ nghi nhầm. Hãy thu hẹp đề cho hữu hạn: "cầu thủ từng giành Quả bóng Vàng" (`nv-bong-vang`) là mẫu tốt; "cầu thủ bóng đá" thì không.
2. **Có đuôi hiếm thật.** Tập đóng nhỏ (8 đội vô địch World Cup, 54 dân tộc, 7 đỉnh núi cao nhất) không có đáp án hiếm để chạm "một trong một triệu"; ai cũng gõ được ngay.
3. **Không trùng câu khác.** Trước khi thêm, tìm trong sổ chủ đề đó đã có câu nào cùng ý chưa (ví dụ đã có `pop-hang-bay` thì không thêm "hãng hàng không" lần nữa).
4. **Gõ tự do mà máy khớp được.** Thành ngữ, câu thơ, tên bài hát dài dễ sai chính tả và nhiều biến thể; nếu phải hỏi thì nên có nhiều cách gọi ở mỗi đáp án (`a|b|c`).

Thêm: một đáp án hiếm phải đến từ hiểu biết hoặc trí nhớ, không phải từ việc "cố chọn khác" (xem `HARD_TO_BE_RARE_FAILS`). Câu thời sự phải có `until`.

## Những câu đã gỡ và lý do

### A1 người nổi tiếng: sổ chỉ phủ một phần nhỏ, đa số tên người chơi gõ nằm ngoài sổ

`r-cauthu-tg`, `r-cauthu-vn`, `r-nba`, `r-tay-vot`, `r-ca-si-us`, `r-rapper-vn`, `r-dao-dien`, `r-hoa-si-tg`, `r-nha-toan-hoc`, `r-lich-su-tg`, `r-trieu-dai-tq`, `r-nha-phat-minh`, `r-f1`, `r-vdv-nuoc-ngoai`, `r-vdv-vn`, `nv-van-vn`, `nv-nhacsi-tg`, `pop-danh-hai`

### A2 tác phẩm và thương hiệu nhiều vô kể

`r-phim-netflix`, `r-game`, `r-tac-pham-tg`, `r-tac-pham-vn`, `r-kpop-group`, `r-bia`, `r-dong-ho`, `r-thoi-trang-nhanh`, `r-my-pham`, `r-hang-cong-nghe`

### A3 "một thành phố của nước X": danh mục địa lý quá rộng

`r-tp-my`, `r-tp-trung`, `r-tp-nhat`, `r-tp-han`, `r-tp-phap`, `r-tp-y`, `r-tp-duc`, `r-tp-anh`, `r-tp-uc`, `r-tp-ando`, `r-tp-tbn`, `r-tp-nga`, `r-tp-canada`, `r-tp-dna`, `r-tp-my-latin`, `r-tp-trung-dong`, `r-tp-chau-phi`

### B trùng hoặc gần trùng câu khác

`r-dao-dien-phim`, `r-chuong-trinh-tv`, `r-hang-hang-khong`, `r-bai-hat-thieu-nhi`, `r-nhac-cu-dan-toc`, `r-benh-truyen-nhiem`, `r-giai-bong-da`, `r-loai-bo-sat`, `r-dong-vat-co-vu-bien`, `r-chim-bien`, `r-loai-nam`, `r-cay-an-qua`, `r-trai-cay-nhiet-doi`, `tg-noc-chau-luc`, `r-ngon-ngu-web`

### C tập đáp án đóng và nhỏ, không có đuôi hiếm

`r-dt-wc-vo-dich`, `dd-cho-noi`, `r-bh-jack`, `r-bh-my-tam`, `r-tp-wc2026`, `r-dt-wc2026`, `r-thanh-pho-asiad`, `r-olympic-dong`, `r-phim-viet-moi`, `r-bh-thay-co`, `r-bh-ha-noi`, `r-bh-me`, `r-bh-den`, `r-trieu-dai-vn`, `r-truyen-kieu`, `r-trieu-dai-trung-hoa`, `dt-all`, `vh-shakespeare`

### D khó khớp khi gõ tự do hoặc đề mơ hồ

`r-thanh-ngu`, `r-mon-thuong-hieu`, `r-tu-ghep-an`, `r-tu-han-viet`, `r-bai-tho-sgk`

### E lô 26 đáp án, đề chung chung, ai cũng nói giống nhau

`r-loai-den`, `r-vat-dung-van-phong`, `r-kieu-toc`, `r-dung-cu-bep`, `r-vat-dung-phong-khach`, `r-do-dung-hoc-sinh`, `r-bo-phan-xe-may`, `r-bien-bao-giao-thong`, `r-dung-cu-the-thao`, `r-vi-tri-bong-da`, `r-hoa-tiet-vai`, `r-thiet-bi-thong-minh`, `r-thuat-ngu-internet`, `r-mon-chay`, `r-mon-cuon`, `r-nhac-cu-bo-go`, `r-loai-vaccine`, `r-bai-bien-vn`, `r-hang-dong-vn`, `r-xuong-mat`, `r-tuyen-co-the`, `r-chat-khi`, `r-loai-te-bao`


## Việc riêng cho Kiro: viết lại bản mở rộng của 4 câu thời sự đã gỡ

Bốn câu này còn hạn (`until` 2027) nên **đề tài vẫn đúng thời điểm**; chúng bị gỡ chỉ vì sổ quá nhỏ và tập đáp án đóng. Hãy viết lại thành câu mới (id mới, có `until`, cùng chủ đề) với sổ đủ dày để có đuôi hiếm. Mỗi câu mới cần tối thiểu 80 đáp án trong sổ và qua bốn phép thử ở trên.

| Câu cũ đã gỡ | Vấn đề | Gợi ý bản mở rộng |
|---|---|---|
| `r-dt-wc2026` (48 đáp án, `until` 2027-06-30) | 48 đội, tập đóng | "Kể tên một đội tuyển từng dự vòng chung kết World Cup bóng đá nam" (hơn 80 đội kể cả đội đã giải thể: Liên Xô, Tiệp Khắc, Nam Tư, Đông Đức, Zaire, Indonesia thuộc Hà Lan…); giữ độ hiếm theo số lần dự |
| `r-tp-wc2026` (16 đáp án, `until` 2027-06-30) | 16 thành phố, ai cũng đoán được | "Kể tên một thành phố từng đăng cai trận đấu World Cup nam" (nhiều kỳ giải, gồm cả thành phố cũ như Montevideo, Berne, Cordoba…) |
| `r-phim-viet-moi` (20 đáp án, `until` 2027-03-31) | 20 phim, năm quá hẹp | "Kể tên một phim điện ảnh Việt Nam chiếu rạp từ năm 2023 đến nay" (kèm tên gọi khác, tên có phụ đề); `until` theo ngày cập nhật cuối của danh sách |
| `r-thanh-pho-asiad` (16 đáp án, `until` 2027-10-31) | 16 thành phố, tập đóng | "Kể tên một thành phố từng đăng cai Đại hội Thể thao châu Á hoặc SEA Games" (gộp hai giải để đủ dày, đúng cả thành phố lẫn nước) |

Khi viết: đáp án nào cũng cần tên gọi khác (`a|b|c`), đáp án đã tuyệt chủng hoặc đã giải thể vẫn nằm trong sổ nếu đúng đề. Sau khi xong, ghi vào commit tên 4 câu mới và id câu cũ mà chúng thay thế.

## Sau khi gỡ: kho đang thiếu gì

Còn 297 câu đang hỏi: mức 1 có 94 câu (31 đại chúng), mức 2 có 189 câu (35 đại chúng), **mức 3 chỉ có 14 câu** (bộ chọn câu cần khoảng 84 câu mức 3 để 42 ngày không lặp). Các chủ đề còn 27 nhóm. Lô mới nên ưu tiên:

1. **Câu khó mức 3** (đủ đáp án phổ biến, phần đuôi cần hiểu biết sâu), đây là chỗ thiếu nhất.
2. **Câu đại chúng không thời sự** (phim, nhạc, món ăn, thương hiệu, công nghệ) nhưng đã thu hẹp theo phép thử 1.
3. Câu thay thế cho những chủ đề bị gỡ nhiều: người nổi tiếng thể thao và nghệ thuật (dạng hữu hạn: từng vô địch, từng đoạt giải), thành phố (dạng "thành phố trên 1 triệu dân của nước X"), đồ dùng hàng ngày (dạng có đuôi sâu hơn, ví dụ theo vùng miền, theo thời kỳ).

Sau khi thêm lô mới, chạy `npm run check:questions`, `npx tsc --noEmit -p .`, `npm test`, và ghi trong commit số câu theo chủ đề và mức khó. Đối soát với danh sách trên: không thêm lại câu cùng ý với câu đã gỡ trừ khi đã thu hẹp đề như phép thử 1.
