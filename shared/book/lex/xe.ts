// Phương tiện. Nhãn: bo (đường bộ) thuy (đường thủy) khong (hàng không) sat (đường sắt) vutru · tho (không có động cơ, sức người/vật/gió)
//   congcong (giao thông công cộng) chuyendung (xe chuyên dụng) xua (phương tiện xưa) banh2 (hai bánh)
export default `
5 Xe máy|Xe gắn máy|Xe mô tô|Mô tô|Motorbike # bo banh2
5 Xe đạp|Bicycle # bo tho banh2
5 Ô tô|Xe hơi|Xe ô tô|Car|Xe con # bo
5 Máy bay|Phi cơ|Tàu bay|Airplane # khong
4 Tàu hỏa|Xe lửa|Tàu lửa|Train|Tàu # sat
4 Xe buýt|Xe bus|Bus|Buýt # bo congcong
4 Thuyền|Con thuyền # thuy
4 Tàu thủy|Tàu biển|Tàu|Ship # thuy
3 Taxi|Xe taxi # bo congcong
3 Xe tải|Xe tải lớn|Truck # bo
3 Xích lô # bo tho xua
3 Trực thăng|Máy bay trực thăng|Helicopter # khong
3 Tàu điện ngầm|Metro|Subway # sat congcong
3 Xe khách|Xe đò # bo congcong
3 Ghe|Đò|Xuồng|Ghe xuồng # thuy tho
3 Ca nô|Cano # thuy
3 Tên lửa|Hỏa tiễn|Rocket # vutru
3 Tàu vũ trụ|Phi thuyền|Tàu con thoi # vutru
3 Xe cứu thương|Xe cấp cứu # bo chuyendung
3 Xe cứu hỏa|Xe chữa cháy # bo chuyendung
3 Xe ôm|Xe ôm công nghệ|Grab|Grab bike # bo banh2 congcong
3 Khinh khí cầu|Khí cầu # khong
3 Xe đạp điện # bo banh2
3 Xe máy điện # bo banh2
2 Xe cảnh sát|Xe công an # bo chuyendung
2 Xe rác|Xe chở rác # bo chuyendung
2 Xe cẩu # bo chuyendung
2 Xe ủi|Máy ủi # bo chuyendung
2 Máy xúc|Xe xúc|Xe múc # bo chuyendung
2 Xe lu # bo chuyendung
2 Xe bồn|Xe bồn chở xăng # bo chuyendung
2 Xe container|Container|Xe công-te-nơ # bo
2 Xe tăng # bo chuyendung
2 Xe bọc thép # bo chuyendung
2 Xe bò|Xe trâu|Xe bò kéo # bo tho xua
2 Xe ngựa|Xe ngựa kéo # bo tho xua
2 Xe kéo|Xe tay|Xe kéo tay # bo tho xua
2 Xe ba gác|Ba gác # bo
2 Xe lôi|Xe lam # bo xua
2 Xe điện du lịch|Xe điện # bo
2 Xe đẩy|Xe đẩy em bé|Xe nôi # bo tho
2 Xe lăn # bo tho
2 Xe trượt|Ván trượt|Skateboard # bo tho
2 Xe scooter|Scooter|Xe trượt scooter # bo banh2
2 Xe máy cày|Máy cày|Máy kéo # bo chuyendung
2 Máy gặt|Máy gặt đập liên hợp # bo chuyendung
2 Tàu ngầm # thuy
2 Tàu sân bay # thuy
2 Tàu chiến|Chiến hạm # thuy
2 Tàu cá|Thuyền đánh cá # thuy
2 Thuyền buồm # thuy tho
2 Thuyền thúng|Thúng chai # thuy tho
2 Bè|Bè mảng|Bè nứa|Bè tre # thuy tho
2 Phà|Chiếc phà # thuy congcong
2 Du thuyền|Yacht # thuy
2 Tàu cánh ngầm|Ca nô cao tốc # thuy
2 Kayak|Thuyền kayak|Ca nô chèo # thuy tho
2 Thuyền rồng # thuy
2 Mô tô nước|Jet ski # thuy
2 Sà lan|Xà lan # thuy
2 Tàu kéo # thuy
2 Tàu phá băng # thuy
2 Tàu cao tốc|Tàu siêu tốc|Shinkansen # sat
2 Tàu điện trên cao|Metro trên cao # sat congcong
2 Tàu điện|Xe điện bánh sắt|Tram # sat congcong
2 Tàu hơi nước # sat xua
2 Cáp treo # congcong
2 Máy bay chiến đấu|Phi cơ chiến đấu # khong
2 Máy bay không người lái|Drone|Flycam # khong
2 Dù lượn|Diều lượn # khong tho
2 Khinh khí cầu # khong
1 Đĩa bay|UFO # vutru
1 Tàu đổ bộ mặt trăng # vutru
1 Xe tự lái # bo
1 Xe địa hình|Xe jeep|Jeep # bo
1 Xe limousine|Limousine # bo
1 Xe buýt hai tầng # bo congcong
1 Xe giường nằm # bo congcong
1 Xe đạp đôi # bo tho
1 Xe ba bánh # bo
1 Xe một bánh # bo tho
1 Xe trượt tuyết # bo tho
1 Xe trượt chó kéo # bo tho
1 Kiệu|Cáng|Võng cáng # tho xua
1 Thuyền độc mộc # thuy tho xua
1 Thuyền nan # thuy tho
1 Tàu ngựa|Tàu cánh buồm # thuy xua
1 Thuyền đua # thuy
1 Xe điện ba bánh # bo
1 Xe cút kít|Cút kít # bo tho
1 Xe nâng # bo chuyendung
1 Xe trộn bê tông # bo chuyendung
1 Xe quét đường # bo chuyendung
1 Xe chở tiền # bo chuyendung
1 Xe chở tù # bo chuyendung
1 Xe tang # bo chuyendung
1 Xe hoa # bo
1 Xe đua|Xe F1 # bo
1 Thủy phi cơ # khong thuy
1 Tàu bay chở khách|Khí cầu Zeppelin|Zeppelin # khong
1 Xe đạp chân|Xe chòi chân|Xe thăng bằng # bo tho
`;
