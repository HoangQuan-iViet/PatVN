import connectToDatabase from './_db.js';
import Post from './_models/Post.js';

export default async function handler(req, res) {
  // Bật CORS cho Vercel
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Luôn phải có dòng kết nối DB này đầu tiên ở mỗi hàm API
  await connectToDatabase();

  const { method } = req;
  const { locale } = req.query;

  // Hàm helper để map bản dịch tiếng Anh
  const mapTranslations = (post) => {
    if (locale !== 'en') return post;
    const p = post.toObject ? post.toObject() : post;
    return {
      ...p,
      title: p.title_en || p.title,
      excerpt: p.excerpt_en || p.excerpt,
      content: p.content_en || p.content
    };
  };
  
  switch (method) {
    case 'GET':
      try {
        const { slug, id } = req.query;
        // 1. Phục vụ Edit Trang Quản trị: Lọc bằng ID
        if (id) {
          const post = await Post.findById(id);
          if (!post) return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
          res.status(200).json({ success: true, data: post }); // Trả về nguyên bản để Admin edit
        } 
        // 2. Phục vụ Xem chi tiết ở Frontend: Lọc bằng Slug
        else if (slug) {
          const post = await Post.findOne({ slug });
          if (!post) return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
          res.status(200).json({ success: true, data: mapTranslations(post) });
        } 
        // 3. Phục vụ trang Danh sách lưới: Tải toàn bộ, NHƯNG LỌC BỎ `content` ĐỂ CHỐNG TREO MÁY
        else {
          const { status } = req.query;
          let filter = {};
          if (status === 'live') {
            // Chỉ lấy bài có thời gian xuất bản hợp lệ và <= thời điểm hiện tại (công khai & đã qua hẹn giờ)
            filter.publishedAt = { $ne: null, $lte: new Date() };
          }
          const posts = await Post.find(filter).select('-content').sort({ date: -1 });
          const mappedPosts = posts.map(p => mapTranslations(p));
          res.status(200).json({ success: true, data: mappedPosts });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST': // Tạo mới bài viết từ Trang Admin
      try {
        const newPost = await Post.create(req.body);
        res.status(201).json({ success: true, data: newPost });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'PUT': // Chỉnh sửa bài viết
      try {
        const { id } = req.query;
        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedPost) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
        res.status(200).json({ success: true, data: updatedPost });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'PATCH': // Cập nhật trường dữ liệu nhỏ (VD: isPinned)
      try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ success: false, message: "Thiếu ID để PATCH" });
        const updatedPost = await Post.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
        if (!updatedPost) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
        res.status(200).json({ success: true, data: updatedPost });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'DELETE': // Xóa bài viết
      try {
        const { id } = req.query;
        if (id) {
            await Post.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: "Xóa 1 bài thành công" });
        } else if (req.body && req.body.ids && Array.isArray(req.body.ids)) {
            // Hỗ trợ xoá đồng loạt
            await Post.deleteMany({ _id: { $in: req.body.ids } });
            res.status(200).json({ success: true, message: "Đã xóa toàn bộ bài viết được chọn" });
        } else {
            res.status(400).json({ success: false, message: "Thiếu ID hoặc danh sách ID để xóa" });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Phương thức không được hỗ trợ' });
      break;
  }
}
