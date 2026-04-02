import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true }, // Khóa chính chống trùng lặp khách
  email: { type: String, default: '' },
  
  // Tự động lưu thống kê về khách hàng này
  totalRequests: { type: Number, default: 0 },
  lastContactedAt: { type: Date, default: Date.now },
  
  // Bạn có thể mở rộng thêm: Mức độ khách hàng (Tỷ phú, Khách thường...), Nguồn gốc...
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
