import connectToDatabase from './_db.js';
import Category from './_models/Category.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  await connectToDatabase();
  const { method } = req;
  const { locale } = req.query;
  
  switch (method) {
    case 'GET':
      try {
        const { type } = req.query;
        let filter = {};
        if (type && type !== 'all') {
            filter.type = type;
        }
        const categories = await Category.find(filter).sort({ date: -1 });
        
        // Ánh xạ bản dịch nếu là tiếng Anh
        const mappedCategories = categories.map(cat => {
            if (locale !== 'en') return cat;
            const c = cat.toObject();
            return {
                ...c,
                name: c.name_en || c.name
            };
        });
        
        res.status(200).json({ success: true, data: mappedCategories });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST': 
      try {
        const newCat = await Category.create(req.body);
        res.status(201).json({ success: true, data: newCat });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'PUT':
    case 'PATCH':
      try {
        const { id } = req.query;
        const updatedCat = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: updatedCat });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'DELETE': 
      try {
        const { id, ids } = req.query;
        if (ids) {
            const idArray = ids.split(',');
            await Category.deleteMany({ _id: { $in: idArray } });
        } else if (id) {
            await Category.findByIdAndDelete(id);
        }
        res.status(200).json({ success: true, message: "Xóa danh mục thành công" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Phương thức '+method+' không được hỗ trợ' });
      break;
  }
}
