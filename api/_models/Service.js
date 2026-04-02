import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  title_en:  { type: String, default: '' },
  slug:      { type: String, required: true, unique: true },
  excerpt:   { type: String, default: '' },
  excerpt_en: { type: String, default: '' },
  overview:  { type: String, default: '' },
  overview_en: { type: String, default: '' },
  category:  { type: String, default: '' },
  image:     { type: String, default: '' },
  imagePosition: { type: String, default: 'center' },
  targetAudience: [{ type: String }],
  targetAudience_en: [{ type: String }],
  documents: [{ type: String }],
  documents_en: [{ type: String }],
  process: [{ 
      title: String,
      desc: String,
      time: String
  }],
  process_en: [{ 
      title: String,
      desc: String,
      time: String
  }],
  pricing: { type: String, default: '' },
  pricing_en: { type: String, default: '' },
  publishedAt: { type: Date, default: null },
  date:      { type: Date, default: Date.now },
  isPinned:  { type: Boolean, default: false }
});

// Ngăn lỗi khai báo lại Model khi Vercel tắt/bật nóng API
export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
