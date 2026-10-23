# TASK-001: chấm độ quen cho 2.209 từ động vật

- Người nhận: WorkBuddy
- Trạng thái: đã giao
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

## Duyệt (Claude điền)
Claude sẽ so với số hiện tại và với bản chấm riêng của Claude, liệt kê từ lệch ≥ 2 mức, rồi đề xuất sửa. Không ghi đè số cũ khi chủ dự án chưa đồng ý.
