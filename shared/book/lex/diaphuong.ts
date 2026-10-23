// 63 tỉnh thành (trước 1/7/2025). Sau "^" là tỉnh thành mới mà nơi này thuộc về.
// Nhãn: bac trung nam · mnpb (trung du miền núi phía Bắc) tb db dbsh btb ntb tn dnb tnb (ĐBSCL)
//   bien (giáp biển) · gtq glao gcpc (giáp Trung Quốc / Lào / Campuchia) · con (tên còn trong 34 tỉnh thành mới) · tp (thành phố trực thuộc TW)
export default `
@ bac mnpb db
3 Hà Giang|Ha Giang # gtq ^ Tuyên Quang
3 Cao Bằng|Cao Bang # gtq con ^ Cao Bằng
1 Bắc Kạn|Bắc Cạn|Bac Kan # ^ Thái Nguyên
3 Lạng Sơn|Lang Son # gtq con ^ Lạng Sơn
2 Tuyên Quang|Tuyen Quang # con ^ Tuyên Quang
3 Thái Nguyên|Thai Nguyen # con ^ Thái Nguyên
3 Phú Thọ|Phu Tho # con ^ Phú Thọ
2 Bắc Giang|Bac Giang # ^ Bắc Ninh
4 Quảng Ninh|Quang Ninh # bien gtq con ^ Quảng Ninh
@ bac mnpb tb
3 Lào Cai|Lao Cai # gtq con ^ Lào Cai
2 Yên Bái|Yen Bai # ^ Lào Cai
3 Điện Biên|Dien Bien # gtq glao con ^ Điện Biên
2 Hòa Bình|Hoà Bình|Hoa Binh # ^ Phú Thọ
2 Lai Châu|Lai Chau # gtq con ^ Lai Châu
3 Sơn La|Son La # glao con ^ Sơn La
@ bac dbsh
5 Hà Nội|Ha Noi|Hanoi|Thủ đô|Thành phố Hà Nội # tp con ^ Hà Nội
4 Hải Phòng|Hai Phong|Thành phố Hải Phòng # bien tp con ^ Hải Phòng
3 Vĩnh Phúc|Vinh Phuc # ^ Phú Thọ
3 Bắc Ninh|Bac Ninh # con ^ Bắc Ninh
3 Hải Dương|Hai Duong # ^ Hải Phòng
3 Hưng Yên|Hung Yen # con ^ Hưng Yên
3 Thái Bình|Thai Binh # bien ^ Hưng Yên
2 Hà Nam|Ha Nam # ^ Ninh Bình
3 Nam Định|Nam Dinh # bien ^ Ninh Bình
3 Ninh Bình|Ninh Binh # bien con ^ Ninh Bình
@ trung btb
4 Thanh Hóa|Thanh Hoá|Thanh Hoa # bien glao con ^ Thanh Hóa
4 Nghệ An|Nghe An # bien glao con ^ Nghệ An
3 Hà Tĩnh|Ha Tinh # bien glao con ^ Hà Tĩnh
3 Quảng Bình|Quang Binh # bien glao ^ Quảng Trị
2 Quảng Trị|Quang Tri # bien glao con ^ Quảng Trị
4 Huế|Thừa Thiên Huế|Thừa Thiên - Huế|Thua Thien Hue|Hue|Cố đô Huế # bien glao tp con ^ Huế
@ trung ntb
5 Đà Nẵng|Da Nang|Danang|Thành phố Đà Nẵng # bien tp con ^ Đà Nẵng
4 Quảng Nam|Quang Nam # bien glao ^ Đà Nẵng
3 Quảng Ngãi|Quang Ngai # bien con ^ Quảng Ngãi
3 Bình Định|Binh Dinh # bien ^ Gia Lai
3 Phú Yên|Phu Yen # bien ^ Đắk Lắk
4 Khánh Hòa|Khánh Hoà|Khanh Hoa|Nha Trang # bien con ^ Khánh Hòa
2 Ninh Thuận|Ninh Thuan # bien ^ Khánh Hòa
3 Bình Thuận|Binh Thuan # bien ^ Lâm Đồng
@ trung tn
2 Kon Tum|Kontum # glao gcpc ^ Quảng Ngãi
3 Gia Lai # gcpc con ^ Gia Lai
3 Đắk Lắk|Đắc Lắc|Dak Lak|Daklak # gcpc con ^ Đắk Lắk
2 Đắk Nông|Đắc Nông|Dak Nong # gcpc ^ Lâm Đồng
4 Lâm Đồng|Lam Dong|Đà Lạt # con ^ Lâm Đồng
@ nam dnb
5 TP Hồ Chí Minh|Hồ Chí Minh|Thành phố Hồ Chí Minh|TP HCM|TPHCM|HCM|Sài Gòn|Saigon|Ho Chi Minh # bien tp con ^ TP Hồ Chí Minh
5 Bình Phước|Binh Phuoc # gcpc ^ Đồng Nai
2 Bình Dương|Binh Duong # ^ TP Hồ Chí Minh
4 Đồng Nai|Dong Nai # con ^ Đồng Nai
3 Tây Ninh|Tay Ninh # gcpc con ^ Tây Ninh
4 Bà Rịa - Vũng Tàu|Bà Rịa Vũng Tàu|Vũng Tàu|Bà Rịa|BRVT|Ba Ria Vung Tau # bien ^ TP Hồ Chí Minh
@ nam tnb
4 Cần Thơ|Can Tho|Thành phố Cần Thơ # tp con ^ Cần Thơ
3 Long An # gcpc ^ Tây Ninh
3 Tiền Giang|Tien Giang # bien ^ Đồng Tháp
3 Bến Tre|Ben Tre # bien ^ Vĩnh Long
2 Trà Vinh|Tra Vinh # bien ^ Vĩnh Long
2 Vĩnh Long|Vinh Long # con ^ Vĩnh Long
2 Đồng Tháp|Dong Thap # gcpc con ^ Đồng Tháp
3 An Giang # gcpc con ^ An Giang
3 Kiên Giang|Kien Giang # bien gcpc ^ An Giang
1 Hậu Giang|Hau Giang # ^ Cần Thơ
2 Sóc Trăng|Soc Trang # bien ^ Cần Thơ
2 Bạc Liêu|Bac Lieu # bien ^ Cà Mau
3 Cà Mau|Ca Mau # bien con ^ Cà Mau
`;
