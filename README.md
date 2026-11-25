# Khám phá Việt Nam – Trường Tiếng Việt Của Em

Đây là trang học tương tác cho các bạn nhỏ. Các bạn cùng Trâu Con đi **31 trạm** dọc dải đất chữ S, từ Cột cờ Lũng Cú tới Đất Mũi Cà Mau, có ghé quần đảo Hoàng Sa và quần đảo Trường Sa. Học xong mỗi trạm, bé nhận được một ngôi sao vàng.

Tên miền: **vietnam.cvcec.org** (đã ghi sẵn trong file `CNAME`).

## Mỗi trạm có 7 bước

1. **🎬 Phim**: phim giới thiệu địa danh. Trâu Con kể chuyện, có phụ đề, cuối phim nhắc lại các ý cần nhớ.
2. **🔑 Ghi nhớ**: 3–4 ý chính. Câu đố ở bước 6 hỏi lại đúng các ý này.
3. **🃏 Thẻ từ**: thẻ lật. Mặt trước có hình và từ, mặt sau có câu ví dụ và nghĩa tiếng Anh.
4. **🎮 Trò chơi**: trò chơi riêng của từng trạm.
5. **🍜 Ăn gì, có gì**: món ăn hoặc phong tục, kèm thẻ "Bạn có biết?".
6. **❓ Đố vui**: mỗi câu có nút 💡 Gợi ý (nhắc ý cần nhớ) và 🔊 Nghe đáp án. Sau khi chọn, trang giải thích vì sao đúng hay sai. Bé cần đúng ít nhất 2/3 câu.
7. **⭐ Nhận sao**.

Phần nào cũng có nút 🔊 để nghe đọc và nút **EN · Explain in English** để nghe giải thích ngắn bằng tiếng Anh.

## 1. Đưa lên GitHub Pages

Repo nằm trong tổ chức (Organization) **CVCEC** trên GitHub; tài khoản `trangphan0301` là Owner của tổ chức.

1. Vào **github.com/new**. Owner chọn tổ chức CVCEC (ví dụ `cvcec`), Repository name `khampha-vietnam`, chọn **Public**, rồi bấm **Create repository**.
2. Giải nén `khampha-vietnam.zip`. Trong repo mới, bấm **uploading an existing file**, rồi kéo **những thứ bên trong** thư mục `khampha-vietnam` vào (`index.html` phải nằm ngay ngoài cùng). Bấm **Commit changes**.
   - Nên chia hai lần: lần 1 tải mọi thứ trừ thư mục `video`, lần 2 tải thư mục `video` (63 file, khoảng 110 MB).
   - Trên Mac, file `.nojekyll` bị ẩn trong Finder. Thiếu file này cũng không sao.
3. Vào **Settings → Pages**: Source chọn **Deploy from a branch**, Branch chọn **main**, thư mục **/ (root)**, rồi bấm **Save**. Ô **Custom domain** sẽ tự hiện `vietnam.cvcec.org` (nhờ file `CNAME`); nếu chưa có thì gõ vào và bấm **Save**.

## 2. Gắn tên miền ở Nhân Hòa

| Loại | Tên (Host) | Giá trị (Value) |
|---|---|---|
| CNAME | `vietnam` | `<tên-tổ-chức>.github.io` (ví dụ `cvcec.github.io`) |

Sau khi tên miền chạy (từ 15 phút đến vài giờ), vào **Settings → Pages** và tích **Enforce HTTPS**. Phần **ghi âm bưu thiếp** cần https mới chạy được.

## 3. Giọng Trâu Con (giọng AI Kore) – robot `giong-ai/`

Từ 25-11-2026 mọi góc học dùng chung một giọng Trâu Con: **giọng AI Kore** (Google Gemini, miền Bắc). Robot trên GitHub Actions (`.github/workflows/giong-ai.yml` → `tools/giong_ai.py`) đọc các câu trong `giong-ai/can-doc.tsv` mỗi ngày, lưu tệp vào `audio/kore/` và ghi `js/audio-manifest.js` (`tools/gan_giong.py`). Xem tiến độ ở `giong-ai/trang-thai.md`, cách dùng ở `giong-ai/README.md`.

- Mã API dùng chung khoảng 100 lượt/ngày cho mọi góc, nên mỗi góc có trần lượt gọi trong `giong-ai/chay.txt` (`TOI_DA_LUOT`, kho này 30).
- `studio.html` (tạo giọng "Elio" bằng tay) đã ngừng dùng: tải gói của nó sẽ thay `js/audio-manifest.js` và xoá mất các câu robot đã làm.

Câu nào chưa có tệp giọng, trang vẫn tạm đọc bằng giọng máy của thiết bị (qua bộ mẫu).

## 4. Video MP4 Trâu Con 3D

Cả **31 trạm** đã có video Trâu Con 3D trong thư mục `video/` (mỗi file khoảng 3,5 MB, 720p, dài khoảng 1 phút 15 giây; Văn Miếu dài 2 phút). Mỗi phim gồm: tên trạm → câu chuyện kèm tranh minh hoạ → Từ mới (bé đọc theo) → Các bạn hãy nhớ nhé → lời chào.

- Video chỉ có hình và phụ đề. Khi bé xem trên trang, Trâu Con đọc từng câu đúng lúc phụ đề hiện ra. Câu đã có tệp giọng thì Trâu Con đọc bằng giọng AI Kore, chưa có thì đọc bằng giọng máy. Nếu Trâu Con đọc chậm hơn phim, phim tự chờ đọc xong câu rồi mới chạy tiếp.
- Danh sách câu của từng video nằm trong `js/video-manifest.js` (mục `cues`). Các câu này cũng có trong danh sách của robot giọng đọc AI (`giong-ai/can-doc.tsv`).
- Thêm video cho trạm khác: chép file vào thư mục `video/`, rồi thêm một khối mới vào `js/video-manifest.js` theo mẫu của Văn Miếu. Mã trạm xem trong `js/stops.js` (dòng `id:`).

## 5. Bộ mẫu chung "Làng Trâu Con", ảnh Trâu Con và logo

- `index.html` nạp bộ mẫu chung của trường: `https://mau.cvcec.org/v1/cvcec-chung.css` và `cvcec-chung.js`. Bộ mẫu thêm thanh các góc học (chỉ khi mở trang riêng, không hiện khi nằm trong cổng vietclass.cvcec.org), dòng bản quyền và liên hệ ở chân trang, màu và phông chung (biến `--ttv-*`). Trang dùng màu của góc học `vietnam`.
- Trong `css/style.css`, các biến cũ (`--ink`, `--bg`, `--green`…) trỏ sang biến `--ttv-*`. Màu bản đồ, màu chặng, màu đúng/sai và nút EN là màu riêng của trang.
- Ảnh Trâu Con (`trau-wave.png`) và logo (`logo.png`) lấy từ `https://mau.cvcec.org/assets/`. Không chép, không vẽ lại.
- Trang chạy được trong khung iframe của cổng **https://vietclass.cvcec.org/#vietnam**. Link về trường mở `https://vietclass.cvcec.org` với `target="_top"`.
- `studio.html` chỉ còn là trang báo đã ngừng dùng (không gắn bộ mẫu).
- **Giọng máy (ngoại lệ tạm thời, xem `CLAUDE.md`):** khi chưa có tệp giọng cho một câu, trang vẫn đọc bằng giọng máy của thiết bị. Robot giọng đọc AI tạo dần các tệp (mục 3). Chỉ gỡ giọng máy khi đã đủ tệp.
- **Giọng máy qua bộ mẫu và ghi kết quả học (17-11-2026):** câu chưa có tệp giọng được đọc qua `TTV.phat({ chu })` của bộ mẫu (trang không tự gọi giọng máy); xong trò chơi hoặc đố vui của một trạm, trang gọi `TTV.ghiKetQua` (bai = mã trạm, hoatDong `tro-choi` / `do-vui`) để cổng ghi vào tài khoản.

## 6. Sửa hoặc thêm nội dung

Toàn bộ chữ của 31 trạm nằm trong **`js/stops.js`**. Bạn có thể sửa trực tiếp trên GitHub (biểu tượng bút chì) rồi Commit. Câu đã sửa cần cập nhật trong `giong-ai/can-doc.tsv` để robot đọc lại. Muốn thêm trạm, chép một khối trạm có sẵn rồi đổi nội dung.

## 7. Ghi chú khác

- **Bộ đọc của máy bị kẹt:** đôi khi bộ đọc giọng của máy tính bị kẹt (máy nhận câu nhưng không đọc, mọi trang đều im). Trang sẽ báo, và phụ đề vẫn chạy. Cách sửa: thoát hẳn trình duyệt (trên Mac bấm ⌘Q) rồi mở lại; nếu vẫn vậy thì khởi động lại máy. Khi đã có tệp giọng Trâu Con (file MP3), trang không cần bộ đọc của máy nữa.
- **Không nghe thấy giọng đọc:** mở ⚙️ **Cài đặt** → **▶ Nghe thử giọng**. Trang sẽ báo máy có đọc được không và đang dùng giọng nào. Nếu máy báo đọc được mà vẫn không nghe thấy, hãy kiểm tra âm lượng và loa của máy. Khi máy không đọc được, phụ đề vẫn chạy theo nhịp đọc để bé đọc theo.
- **Hình trên thẻ từ:** một số hình (thác nước, dòng sông, hồ nước, chợ nổi, hang động, bánh chưng…) được vẽ riêng trong `js/icons.js`. Trong `js/stops.js`, hình vẽ riêng ghi dạng `i: 'svg:waterfall'`; các hình khác là emoji.
- **Mở khoá:** trạm sau mở khi trạm trước đã có sao. Bố mẹ hoặc thầy cô có thể mở khoá bằng một phép nhân.
- **Lưu tiến trình:** sao vàng được lưu trong trình duyệt của từng máy.
- **Đường dẫn tới một trạm:** ví dụ `https://vietnam.cvcec.org/#tram-van-mieu`.
- **Bản đồ:** vẽ từ dữ liệu Natural Earth theo quan điểm Việt Nam, có đủ Hoàng Sa (đặc khu thuộc TP. Đà Nẵng) và Trường Sa (đặc khu thuộc Khánh Hòa). Tên tỉnh, thành ghi theo địa giới mới từ 1/7/2025.

## 8. Bảo vệ nội dung và Lưu ý về sử dụng tài liệu

- **Chữ chìm trên phim:** mỗi phim có dòng chữ chìm "© CVCEC · Trường Tiếng Việt Của Em · Chỉ xem, không sao chép". Phim không có nút tải về, không bật được cửa sổ nổi (picture-in-picture), và chỉ ở độ phân giải 720p.
- **Chặn lưu và sao chép:** trang chặn nhấn chuột phải, nhấn giữ để lưu ảnh, kéo thả ảnh và phim, phím Ctrl/Cmd+S và Ctrl/Cmd+P. In cả trang thì bản in chỉ có một dòng báo "Trang này chỉ để xem trực tuyến". Nút **In bằng khen** vẫn in được bình thường. Bưu thiếp bé tự làm vẫn tải về được để gửi ông bà.
- **`robots.txt`:** yêu cầu Google không đưa ảnh lên kết quả tìm kiếm; không cho các công cụ tìm kiếm vào thư mục `video/`, `audio/` và trang `studio.html`; chặn các công cụ AI thu thập dữ liệu. Trong `index.html` có thẻ `noimageindex` báo Google không lấy ảnh.
- **Lưu ý về sử dụng tài liệu · Terms of use:** nút ở chân trang và trong ⚙️ **Cài đặt**. Nội dung lời lưu ý nằm trong `js/app.js` (hàm `showTerms`). Địa chỉ liên hệ: contact@cvcec.org.
- Các lớp chặn này giúp người xem khó lưu hay sao chép, nhưng không chặn được việc quay hoặc chụp màn hình.

---
Copyrighted by CVCEC Trường Tiếng Việt Của Em 2026
