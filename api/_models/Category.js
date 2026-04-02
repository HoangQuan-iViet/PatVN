import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },       // Vd: "Sở hữu trí tuệ"
  name_en: { type: String, default: '' },      // Vd: "Intellectual Property"
  slug: { type: String, required: true, unique: true },       // Vd: "so-huu-tri-tue"
  type: { type: String, required: true, enum: ['post', 'service'] }, // Phân loại chuyên trang của danh mục
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
