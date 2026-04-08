/**
 * Chuyển đổi chuỗi tiếng Việt thành slug chuẩn SEO.
 * - Loại bỏ dấu tiếng Việt
 * - Chuyển khoảng trắng thành dấu gạch nối '-'
 * - Chỉ giữ lại ký tự a-z, 0-9, và dấu gạch nối
 */
export const generateSlug = (str) => {
    if (!str) return ''
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")  // Xóa dấu tiếng Việt
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')      // Chỉ giữ chữ, số, khoảng trắng, gạch nối
        .replace(/\s+/g, '-')             // Khoảng trắng → gạch nối
        .replace(/-+/g, '-')             // Gộp nhiều gạch nối liên tiếp
        .replace(/^-|-$/g, '')           // Xóa gạch nối đầu/cuối
}

/**
 * Hàm sanitize real-time cho ô input Slug.
 * Gọi trên @input event để ngăn người dùng nhập dấu tiếng Việt,
 * tự động chuyển khoảng trắng thành '-', và normalize ngay lập tức.
 */
export const sanitizeSlugInput = (value) => {
    if (!value) return ''
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")  // Xóa dấu tiếng Việt ngay lập tức
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')      // Chỉ giữ chữ, số, khoảng trắng, gạch nối
        .replace(/\s+/g, '-')             // Khoảng trắng → gạch nối
        .replace(/-+/g, '-')             // Gộp gạch nối trùng
}
