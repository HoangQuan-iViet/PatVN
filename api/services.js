import connectToDatabase from './_db.js';
import Service from './_models/Service.js';

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

  // Hàm helper để map bản dịch tiếng Anh cho Service
  const mapTranslations = (service) => {
    if (locale !== 'en') return service;
    const s = service.toObject ? service.toObject() : service;
    
    return {
      ...s,
      title: s.title_en || s.title,
      excerpt: s.excerpt_en || s.excerpt,
      overview: s.overview_en || s.overview,
      pricing: s.pricing_en || s.pricing,
      // Fallback arrays if empty
      targetAudience: (s.targetAudience_en && s.targetAudience_en.length > 0) ? s.targetAudience_en : s.targetAudience,
      documents: (s.documents_en && s.documents_en.length > 0) ? s.documents_en : s.documents,
      process: (s.process_en && s.process_en.length > 0) ? s.process_en : s.process
    };
  };
  
  switch (method) {
    case 'GET':
      try {
        const { slug, id } = req.query;
        // 1. Phục vụ Edit Trang Quản trị: Lọc bằng ID
        if (id) {
          const service = await Service.findById(id);
          if (!service) return res.status(404).json({ success: false, message: "Dịch vụ không tồn tại" });
          res.status(200).json({ success: true, data: service }); // Trả về nguyên bản để Admin edit
        } 
        // 2. Phục vụ Xem chi tiết ở Frontend: Lọc bằng Slug
        else if (slug) {
          const service = await Service.findOne({ slug });
          if (!service) return res.status(404).json({ success: false, message: "Dịch vụ không tồn tại" });
          res.status(200).json({ success: true, data: mapTranslations(service) });
        } 
        // 3. Phục vụ trang Danh sách lưới
        else {
          const { status } = req.query;
          let filter = {};
          if (status === 'live') {
            filter.publishedAt = { $ne: null, $lte: new Date() };
          }
          const services = await Service.find(filter).select('-overview').sort({ date: -1 });
          const mappedServices = services.map(s => mapTranslations(s));
          res.status(200).json({ success: true, data: mappedServices });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST': // Tạo mới bài viết từ Trang Admin
      try {
        const newService = await Service.create(req.body);
        res.status(201).json({ success: true, data: newService });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'PUT': // Chỉnh sửa bài viết
      try {
        const { id } = req.query;
        const updatedService = await Service.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedService) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
        res.status(200).json({ success: true, data: updatedService });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'DELETE': // Xóa bài viết
      try {
        const { id } = req.query;
        if (id) {
            await Service.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: "Xóa 1 bài thành công" });
        } else if (req.body && req.body.ids && Array.isArray(req.body.ids)) {
            // Hỗ trợ xoá đồng loạt
            await Service.deleteMany({ _id: { $in: req.body.ids } });
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
