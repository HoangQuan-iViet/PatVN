import connectToDatabase from './_db.js';
import Customer from './_models/Customer.js';

export default async function handler(req, res) {
  // Bật CORS cho Vercel dev
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
  
  switch (method) {
    // LẤY DANH SÁCH KHÁCH HÀNG (QUẢN TRỊ KHÁCH HÀNG CRM)
    case 'GET':
      try {
        const { id, search } = req.query;

        if (id) {
            // Lấy 1 khách
            const customerDb = await Customer.findById(id);
            res.status(200).json({ success: true, data: customerDb });
            return;
        }

        // Search logic (Tìm Số điện thoại hoặc tên khách)
        let filter = {};
        if (search) {
            filter = {
               $or: [
                 { phone: { $regex: search, $options: 'i' } },
                 { name: { $regex: search, $options: 'i' } }
               ]
            }
        }
        
        // Sắp xếp các khách hàng vừa liên hệ hoặc tương tác lên trên cùng
        const customers = await Customer.find(filter).sort({ lastContactedAt: -1, createdAt: -1 });

        res.status(200).json({ success: true, data: customers });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, message: 'Phương thức '+method+' không được hỗ trợ để tìm khách' });
      break;
  }
}
