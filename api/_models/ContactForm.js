import mongoose from 'mongoose';

const ContactFormSchema = new mongoose.Schema({
  // Liên kết tới Hồ sơ Khách hàng đã lưu
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  
  // Lưu lại snapshot thông tin chính xác lúc gửi form (vì sau này khách có thể đổi thông tin trong hồ sơ)
  submittedName: { type: String, required: true },
  submittedPhone: { type: String, required: true },
  submittedEmail: { type: String, default: '' },
  
  // Nội dung cần tư vấn
  serviceInterest: { type: String, default: '' }, // Tên gói dịch vụ quan tâm
  message: { type: String, default: '' },         // Lời nhắn ngắn gọn
  urlSource: { type: String, default: '' },       // Nơi mà khách đang đứng khi bấm gửi Form (Rất tốt cho Sale)
  
  // Trạng thái xử lý nội bộ của nhân viên
  status: { 
      type: String, 
      enum: ['new', 'processing', 'resolved', 'spam'], 
      default: 'new' 
  },
  
  // Ghi chú ẩn của nhân viên (Khách không thấy)
  staffNotes: { type: String, default: '' }
}, {
  timestamps: true // Tự sinh trường createdAt (Thời điểm gửi form) và updatedAt (Hoạt động cập nhật cuối cùng)
});

export default mongoose.models.ContactForm || mongoose.model('ContactForm', ContactFormSchema);
