import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  title_en:  { type: String, default: '' },
  slug:      { type: String, required: true, unique: true },
  excerpt:   { type: String, default: '' },
  excerpt_en: { type: String, default: '' },
  category:  { type: String, default: '' },
  date:      { type: Date, default: Date.now },
  image:     { type: String, default: '' },
  imagePosition: { type: String, default: 'center' },
  content:   { type: String, default: '' },
  content_en: { type: String, default: '' },
  publishedAt: { type: Date, default: null },
  isPinned:  { type: Boolean, default: false }
});

// Ngăn lỗi khai báo lại Model khi Vercel tắt/bật nóng API
export default mongoose.models.Post || mongoose.model('Post', PostSchema);
