# SITE MAP - IP LAW FIRM PROJECT

## 1. Trang chủ (Home) - Route: /

1.  **Hero Section:**
    * Full màn hình. Banner, Slogan, CTA.

2.  **Giới thiệu công ty (Intro Section) - [SPLIT LAYOUT]:**
    * **Bố cục:** Trái: Ảnh văn phòng/Luật sư - Phải: Text giới thiệu "Chúng tôi là ai".
    * **Mục đích:** Tạo ấn tượng đầu tiên chuyên nghiệp.

3.  **Dịch vụ (Services Section) - [FULL WIDTH]:**
    * **Bố cục:** Grid 3 cột (Card dịch vụ).
    * **Mục đích:** Show danh sách dịch vụ chính. Cần không gian rộng.

4.  **Tại sao chọn chúng tôi (Why Us) - [SPLIT LAYOUT]:**
    * **Bố cục:** Phải: Ảnh minh hoạt (Handshake/Meeting) - Trái: Grid 4 điểm mạnh (Icon + Text).
    * **Mục đích:** Thuyết phục khách hàng bằng lý trí.

5.  **Kho nội dung (Content Hub) - [FULL WIDTH]:**
    * **Bố cục:** Grid 3-4 cột (Bài viết mới nhất).
    * **Background:** Màu nền riêng biệt (Ví dụ: Xám nhạt/Nâu nhạt) để tách khối.

6.  **Tầm nhìn & Cam kết (Trust Section) - [SPLIT LAYOUT]:**
    * **Bố cục:** Trái: Ảnh chân dung lãnh đạo/Team - Phải: Quote Tầm nhìn, Sứ mệnh.

7.  **Thương hiệu đối tác (Partners) - [FULL WIDTH]:**
    * **Bố cục:** Dải logo chạy ngang hoặc Grid nhiều cột.

## 2. Dịch vụ (Services) - Route: /services
### 2.1. Danh sách dịch vụ (List Page)
- Page banner
- Thanh tìm kiếm & Filter theo danh mục (Sáng chế, Nhãn hiệu, Bản quyền...)
- Grid hiển thị các Thẻ dịch vụ (Hình ảnh, Tiêu đề, Mô tả ngắn)

### 2.2. Chi tiết dịch vụ (Detail Page) - Route: /services/:slug
- Tổng quan dịch vụ
- Quy trình thực hiện
- Chi phí ước tính
- FAQ (Câu hỏi thường gặp về dịch vụ đó)
- Sidebar: Form đăng ký tư vấn nhanh

## 3. Về chúng tôi (About Us) - Route: /about
- Câu chuyện thương hiệu: Tầm nhìn - Sứ mệnh - Giá trị cốt lõi
- Hồ sơ năng lực (Company Profile Download)
- Đội ngũ chuyên gia (Team Profile):
    - Profile chi tiết luật sư (Bằng cấp, Chứng chỉ, Kinh nghiệm)

## 4. Kho nội dung (Resources/Blog) - Route: /blog
### 4.1. Danh sách bài viết (List Page)
- Page banner
- Thanh tìm kiếm & Filter theo lĩnh vực
- Grid bài viết (Tin tức pháp lý, Kiến thức chuyên ngành, Case study)

### 4.2. Chi tiết bài viết (Detail Page) - Route: /blog/:slug
- Nội dung bài viết
- Mục lục (Table of Content)
- Bài viết liên quan
- Chia sẻ Social

## 5. Liên hệ (Contact) - Route: /contact
- Thông tin liên hệ (Địa chỉ, Hotline, Email, Giờ làm việc)
- Google Map Embed
- Form gửi tin nhắn nhanh

## 6. Đăng ký tư vấn (Consultation) - Route: /consultation
- Form thu thập yêu cầu chi tiết (Phức tạp hơn form liên hệ):
    - Thông tin khách hàng
    - Lĩnh vực quan tâm (Checkbox)
    - Tải lên tài liệu sơ bộ (Optional)

## 7. Các trang phụ & Hệ thống (Utility & System)
- Chính sách bảo mật (Privacy Policy)
- Điều khoản sử dụng (Terms of Use)
- Trang 404 (Not Found Page) - Giao diện thân thiện + Nút về trang chủ

## 8. Functionality Requirements (Yêu cầu phi chức năng)
- Multi-language: Tiếng Việt (Default) / Tiếng Anh
- SEO: Meta tags, Sitemap.xml, SEO friendly URLs
- Database: MongoDB (Dự kiến)
- Responsive: Mobile-first design