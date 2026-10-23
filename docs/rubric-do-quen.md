# Rubric độ quen (pop 1–5)

Tài liệu này định nghĩa thang **độ quen** dùng để chấm từng từ trong kho từ vựng
(`shared/book/lex/*.ts`). Số độ quen là **số đứng đầu mỗi dòng** trong các file kho
đó. Mục tiêu: nhiều người chấm độc lập vẫn ra con số gần nhau, và số đó giải thích
được tại sao, chứ không phải cảm tính.

> Thang này mới là phán đoán của người viết sổ. Nó cần được hiệu chỉnh bằng dữ liệu
> lượt gõ thật của người chơi (xem `shared/book/familiar.ts` và `decisions.md` ngày
> 2026-10-23). Khi có dữ liệu thật mâu thuẫn với ví dụ neo ở đây, dữ liệu thắng.

## Câu hỏi gốc khi chấm

> "100 người Việt bình thường được hỏi câu tương ứng, bao nhiêu người nói ra từ này?"

Chấm theo mức độ **một người phổ thông nghĩ tới được từ đó**, không phải mức độ từ đó
có thật hay đúng. Một từ có thật nhưng gần như không ai nghĩ ra vẫn là mức 1.

## Định nghĩa chung của 5 mức

| Mức | Tên bậc khi hỏi | Khoảng người nói ra (/100) | Ý nghĩa |
|-----|-----------------|----------------------------|---------|
| **5** | Thường | ≥ 60 | Ai cũng nghĩ ra ngay. Từ đầu tiên bật ra khi nghe câu hỏi. |
| **4** | Thường / Khá hiếm | 30–60 | Rất quen, phần lớn người lớn biết, nhưng không phải từ bật ra đầu tiên. |
| **3** | Khá hiếm | 10–30 | Nhiều người biết nếu được gợi, nhưng không chủ động nhớ ra. |
| **2** | Hiếm | 3–10 | Cần có quan tâm/kiến thức riêng mới nhớ. Người phổ thông ngờ ngợ. |
| **1** | Rất hiếm / Cực hiếm | < 3 | Gần như chỉ người trong nghề, trong vùng, hoặc đam mê mới biết. |

Nguyên tắc chống trôi thang:
- **Chấm độc lập từng từ.** Đừng chỉnh để các mức phân bố đều.
- **Neo bằng ví dụ, không bằng con số.** So từ đang chấm với các từ neo cùng nhóm
  bên dưới: nó quen hơn hay lạ hơn từ neo nào?
- Từ quen trong đời sống Việt Nam **không được** rơi xuống mức 1. Người chơi thấy vô lý.
- Từ ngoại lai/chuyên ngành chỉ dân đam mê biết **không được** để mức 4–5.

---

## Ví dụ neo theo nhóm kho

Mọi từ dưới đây là từ **có thật trong file kho tương ứng**, lấy đúng mức đang gán trong file.

### monan — Món ăn (`shared/book/lex/monan.ts`)

| Mức | Ví dụ neo |
|-----|-----------|
| 5 | Phở, Bánh mì, Cơm tấm, Bánh chưng, Pizza |
| 4 | Bún bò Huế, Mì Quảng, Cơm gà, Bánh xèo, Cháo lòng |
| 3 | Bún thang, Hủ tiếu Mỹ Tho, Bánh giầy, Chè bà ba, Cơm âm phủ |
| 2 | Bún bề bề, Bánh răng bừa, Cháo ám, Chè táo xọn, Nậm pịa |
| 1 | Bún cù kỳ, Bánh coóc mò, Cháo nhum, Chè heo quay, Pa pỉnh tộp |

Chỗ dễ nhầm: món vùng miền (Mì Quảng, Cao lầu) quen hơn với người miền đó nhưng vẫn
là mức 3–4 toàn quốc. Món nước ngoài đã Việt hóa mạnh (Pizza, Sushi) để mức 5, món
nước ngoài ít gặp (Injera, Bobotie) để mức 1–2.

### douong — Đồ uống (`shared/book/lex/douong.ts`)

| Mức | Ví dụ neo |
|-----|-----------|
| 5 | Cà phê, Trà, Nước lọc, Trà sữa |
| 4 | Nước cam, Sinh tố, Bia, Sữa, Nước dừa |
| 3 | Matcha, Trà đào, Cà phê muối, Rượu vang, Espresso |
| 2 | Trà hoa đậu biếc, Rượu Làng Vân, Nước râu ngô, Cà phê Culi |
| 1 | Rượu ngô men lá, Trà xạ đen, Cà phê vợt, Kvass, Makgeolli |

Chỗ dễ nhầm: tên đồ uống nước ngoài viết kiểu tiếng Anh (Espresso, Cappuccino) nay khá
quen, để mức 3; nhưng tên lạ (Horchata, Rooibos) vẫn mức 1.

### diaphuong — Tỉnh thành (`shared/book/lex/diaphuong.ts`)

| Mức | Ví dụ neo |
|-----|-----------|
| 5 | Hà Nội, TP Hồ Chí Minh, Đà Nẵng |
| 4 | Hải Phòng, Cần Thơ, Huế, Nghệ An, Lâm Đồng |
| 3 | Lào Cai, Nam Định, Quảng Nam, Đắk Lắk, An Giang |
| 2 | Tuyên Quang, Hà Nam, Ninh Thuận, Trà Vinh, Bạc Liêu |
| 1 | Bắc Kạn, Hậu Giang |

Chỗ dễ nhầm: tỉnh thành ai cũng nghe tên (qua thời tiết, bóng đá) nên ít tỉnh nào
xuống mức 1; nhưng tỉnh nhỏ, ít lên tin tức (Bắc Kạn, Hậu Giang) thì mức 1. Tên viết
không dấu (Ha Noi, Da Nang) là biến thể của cùng một từ, không chấm riêng.

### dovat — Đồ vật (`shared/book/lex/dovat.ts`)

| Mức | Ví dụ neo |
|-----|-----------|
| 5 | Nồi, Bát, Đũa, Bàn, Ghế, Gối, Bút, Sách |
| 4 | Dao, Đĩa, Tủ lạnh, Ti vi, Quạt, Cặp sách, Khăn tắm |
| 3 | Lò vi sóng, Ấm trà, Compa, Bút màu, Tua vít, Vòi sen |
| 2 | Chày cối, Xửng hấp, Ghế bập bênh, Dập ghim, Ê tô |
| 1 | Chạn, Ang, Mẹt, Quang gánh, Gàu sòng, Máy đánh chữ |

Chỗ dễ nhầm: đồ dùng xưa (Chạn, Mẹt, Đèn dầu, Chõng tre) người trẻ ít biết nên mức 1,
dù người lớn tuổi nhận ra ngay — chấm theo người phổ thông mọi lứa, nghiêng về mức thấp.

### nhanvat — Nhân vật có thật (`shared/book/lex/nhanvat.ts`)

| Mức | Ví dụ neo |
|-----|-----------|
| 5 | Hồ Chí Minh, Quang Trung, Trần Hưng Đạo, Nguyễn Du, Albert Einstein |
| 4 | Lê Lợi, Lý Thường Kiệt, Ngô Bảo Châu, Napoleon Bonaparte, Leonardo da Vinci |
| 3 | Mạc Đĩnh Chi, Hàn Mặc Tử, Phan Đình Phùng, Socrates, Marco Polo |
| 2 | Cao Lỗ, Đào Duy Từ, Tô Ngọc Vân, Immanuel Kant, James Cook |
| 1 | Khúc Hạo, Lý Thiên Bảo, Vũ Cao Đàm, Hypatia, Ibn Battuta |

Chỗ dễ nhầm: nhân vật lịch sử có trong sách giáo khoa phổ thông thường mức 3–5; nhân
vật chỉ chuyên ngành sử nhắc (Khúc Hạo, Lý Phật Tử) là mức 1. Tên Hán Việt của người
nước ngoài (Kha Luân Bố = Columbus) là biến thể cùng một người, chấm theo mức của
người đó, không tách.

### thucvat — Thực vật và nấm (`shared/book/lex/thucvat.ts`)

| Mức | Ví dụ neo |
|-----|-----------|
| 5 | Chuối, Táo, Cam, Xoài, Rau muống, Hoa hồng, Hoa sen, Lúa |
| 4 | Dưa hấu, Sầu riêng, Cà rốt, Bắp cải, Hoa cúc, Thông, Đậu phộng |
| 3 | Vú sữa, Khế, Su hào, Tía tô, Thạch thảo, Keo, Nấm rơm, Hạt sen |
| 2 | Dâu da, Bồn bồn, Củ năng, Hoa phù dung, Sến mủ, Nấm mối, Quinoa |
| 1 | Bứa, Rau tề, Củ ấu tẩu, Hoa tầm xuân, Kim giao, Nấm ruốc, Hạt ươi |

Chỗ dễ nhầm: cây/quả đặc sản vùng (Sâm Ngọc Linh, Gạo ST25) được dân vùng đó hoặc dân
quan tâm biết, thường mức 2; loài gỗ quý chỉ dân lâm nghiệp biết (Nghiến, Pơ mu, Kim
giao) là mức 1 dù có tiếng.

---

## Những chỗ dễ nhầm (chung cho mọi nhóm)

- **Tên vùng miền.** Một từ rất quen ở một vùng (Nậm pịa với người Tây Bắc) không có
  nghĩa là quen toàn quốc. Chấm theo người phổ thông cả nước, không theo người địa phương.
- **Tên Hán Việt và tên gọi khác.** "Kha Luân Bố", "Nã Phá Luân", "Niu-tơn" chỉ là cách
  gọi khác của cùng một mục (đứng sau dấu `|`). Không chấm riêng; cả mục lấy một mức theo
  độ quen của bản thân nhân vật/sự vật.
- **Từ nước ngoài.** Phân biệt (a) từ đã Việt hóa, ai cũng dùng (Pizza, Cà phê, Ti vi):
  mức cao; với (b) từ phiên âm còn lạ tai (Makgeolli, Horchata, Bobotie): mức 1–2. Mức
  độ quen đo bằng tai người Việt, không bằng độ phổ biến ở nước gốc.
- **Đồ dùng/khái niệm xưa.** Người lớn tuổi nhận ra ngay nhưng người trẻ mù tịt
  (Chạn, Gàu sòng, Đèn dầu). Vì người chơi trải nhiều lứa tuổi, nghiêng về mức thấp (1–2).
- **Đặc sản/giống mới.** "Mít Thái", "Gạo ST25", "Nho Ninh Thuận" quen với người hay
  mua sắm hoặc theo tin nông sản, nhưng chưa phải ai cũng biết: thường mức 2, hiếm khi 3.
