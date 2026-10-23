---
inclusion: always
---

# Luật soạn câu hỏi

> Đợt gỡ 23/10/2026: xem `docs/cau-da-go.md` (106 câu đã gỡ, bốn phép thử một câu mới phải qua). Đối soát với đó trước khi thêm lô mới.

## Một câu tốt
1. **Đáp án phổ biến ai cũng nghĩ ra ngay**, nhưng **đáp án hiếm phải cần kiến thức thật**. Ví dụ tốt: "Kể tên một loài khủng long" (ai cũng nói T-Rex; Nigersaurus thì phải biết).
2. **Không chọn câu có vô số đáp án dễ** (ví dụ "Kể tên một quốc gia ở châu Á": ai cũng kể được nước hiếm). Không chọn danh sách đóng học thuộc trong sách giáo khoa (môn học, 12 con giáp).
3. **Không chọn câu ghép chữ**, tức là đáp án hiếm chỉ do ghép tùy ý ("lẩu + nguyên liệu bất kỳ", "món + nguyên liệu").
4. Có từ khoảng **25 đáp án trở lên**, trừ câu thời sự.
5. **Không bịa.** Chỉ ghi đáp án chắc chắn có thật. Không chắc thì bỏ, hoặc tạm ghi kèm dấu `?` để `check:questions` báo, rồi xác minh (tìm web) trước khi commit.

## Câu chữ phải rõ, một nghĩa
- Mỗi câu hỏi **một khái niệm**. Tránh kiểu "Kể tên một lễ hội truyền thống hoặc ngày lễ tết Việt Nam" (gộp hai thứ, đọc rối). Viết gọn: "Kể tên một lễ hội truyền thống của Việt Nam", rồi dùng ghi chú `n` để nói rõ phạm vi: "Các dịp Tết như Tết Nguyên Đán, Trung Thu cũng được tính."
- **Ranh giới phải rõ** để người chơi không bị chấm oan. Ví dụ "nước mắm" thì mắm tôm, mắm nêm không phải nước mắm: hoặc nói rõ trong `n`, hoặc đổi câu thành "loại mắm hoặc nước mắm".
- Bắt đầu bằng "Kể tên một …". Không viết tắt, không tiếng lóng, đúng chính tả và dấu.
- Câu hỏi về một người hay một tác phẩm thì ghi đủ tên: "bài hát của Sơn Tùng M-TP", không ghi "bài của Tùng".
- Chủ đề (`c`) dùng tên đã có: Ẩm thực, Ăn uống, Động vật, Thực vật, Du lịch, Thế giới, Lịch sử, Văn hóa, Văn học, Nghệ thuật, Âm nhạc, Nhạc Việt, Giải trí, Điện ảnh, Thể thao, Khoa học, Công nghệ, Ngôn ngữ, Mua sắm, Thời trang, Giao thông, Đời sống.

## Định dạng (một câu)
```ts
{id:'r-khung-long',c:'Động vật',q:'Kể tên một loài khủng long hoặc bò sát thời tiền sử',n:'(ghi chú, không bắt buộc)',s:['khunglong'],k:'Nigersaurus',t:[
'Khủng long bạo chúa|T-Rex|Tyrannosaurus, Velociraptor, Triceratops',   // Thường: 2–5 đáp án ai cũng nghĩ ra
'Brachiosaurus, Stegosaurus, …',                                       // Khá hiếm
'Iguanodon, Dilophosaurus, …',                                          // Hiếm
'Microraptor, Utahraptor, …',                                           // Rất hiếm
'Dracorex, Irritator, …']},                                             // Cực hiếm
```
- `id`: bắt đầu bằng `r-`, chữ thường không dấu, duy nhất trong toàn sổ.
- `t`: **đúng 5 dòng**, từ phổ biến nhất tới hiếm nhất. Dấu phẩy `,` ngăn các đáp án; dấu `|` ngăn **tên gọi khác của cùng một đáp án** (tên tiếng Anh, viết tắt, tên dân gian).
- `k`: **đáp án làng giấu** (Độc nhất): có thật, ít người biết nhưng nghe là nhận ra. **Không được** nằm trong 5 dòng bậc.
- `s`: những từ người chơi hay gõ thêm mà máy nên bỏ qua khi so khớp, viết liền không dấu (ví dụ `['tinh','thanhpho']` để "tỉnh Lào Cai" khớp "Lào Cai").
- `until:'YYYY-MM-DD'` cho **câu thời sự** (phim mới, bài hát đang hot, giải đấu năm nay): ngày cuối cùng còn được hỏi, thường 6–18 tháng sau sự kiện. Mỗi đợt nên xen 1–2 câu thời sự để app có cảm giác cập nhật tin tức; tin thời sự phải tìm web xác minh.
- Một đáp án chỉ xuất hiện **một lần** trong cả 5 dòng (kể cả tên gọi khác).

## Xếp bậc
- Hỏi: "100 người Việt bình thường được hỏi thì bao nhiêu người nói ra đáp án này?" Khoảng 15% trở lên là Thường; 5–15% là Khá hiếm; 1–5% là Hiếm; dưới 1% là Rất hiếm; gần như không ai là Cực hiếm.
- Đáp án quen thuộc trong đời sống Việt Nam (Kiwi, Cá cam, Hoa đào…) **không được** để Rất hiếm hay Cực hiếm. Người chơi sẽ thấy vô lý ngay.

## Thêm một đợt câu mới
1. Tạo `shared/book/releaseN.ts` theo mẫu file gần nhất, rồi thêm vào `shared/book/release.ts`.
2. Kiểm trùng ý với câu đã có: `npm run check:questions` báo "gần giống câu …"; tìm thêm bằng grep từ khóa trong `shared/book`.
3. Chạy `npm run check:questions`, `npx tsc --noEmit -p .`, `npm test`; sửa hết **LỖI**, đọc lại các **CHÚ Ý**.
4. Commit và push (xem structure.md).

## Rà lỗi câu hỏi cũ
**Câu cũ đã nằm trong database**: sửa chúng ở trang admin (tab Kho câu hỏi), không sửa trong file release (deploy sẽ không áp dụng). Nếu không vào được admin, ghi danh sách chỗ cần sửa cho người quản lý.
Đọc từng câu đang dùng và sửa khi:
- câu chữ rối, gộp hai ý, hoặc có thể hiểu hai nghĩa;
- ranh giới không rõ, người chơi dễ bị chấm oan (thêm `n` hoặc viết lại câu);
- đáp án sai sự thật, đáp án trùng nghĩa ở hai bậc (ví dụ "Falcon" và "Sam Wilson" là một người: gộp bằng `|`);
- đáp án quen bị xếp quá hiếm, hoặc đáp án lạ bị xếp quá phổ biến;
- câu quá dễ để có điểm cao (nhiều đáp án hiếm mà ai cũng biết): đề nghị cho nghỉ (nút Tạm dừng ở admin) và ghi lý do trong báo cáo. `RETIRED` trong `questions.ts` chỉ có tác dụng với câu mới thêm lần đầu.
Ghi lại danh sách những gì đã sửa trong message commit.

## Bộ chọn câu mỗi ngày dùng gì (để soạn đúng chỗ đang thiếu)
- 7 câu mỗi ngày theo mức khó `1, 2, 1, 2, 3, 2, 3`. Mức khó đặt bằng trường `lv` (1 dễ, 2 vừa, 3 khó); bỏ trống thì máy tự đoán (thường ra 1 hoặc 2). **Câu khó (`lv:3`) đang rất thiếu**: chỉ khoảng 17 câu, cần thêm nhiều.
- Chỗ 2 và 5 dành cho câu **đại chúng**: id bắt đầu `pop-` hoặc chủ đề Giải trí, Âm nhạc, Nhạc Việt, Điện ảnh, Mua sắm, Thời trang, Ăn uống, Công nghệ, Tuổi thơ.
- Chỗ 4 dành cho **câu thời sự** (có `until`) khi còn câu chưa hết hạn; mỗi câu thời sự quay lại sau ít nhất 14 ngày. Hết hạn thì tự thôi hỏi.
- Không hai câu cùng chủ đề trong một ngày; một câu không quay lại trong 42 ngày nếu kho còn đủ.
- Câu hỏi dễ sửa bậc nhất là câu có trường `lv` rõ ràng và chủ đề đúng danh sách ở trên.
