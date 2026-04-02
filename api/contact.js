import connectToDatabase from './_db.js';
import Customer from './_models/Customer.js';
import ContactForm from './_models/ContactForm.js';

export default async function handler(req, res) {
  // CORS Headers
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
    // ----------------------------------------------------
    // LẤY DANH SÁCH FORM TƯ VẤN (TÍCH HỢP CHO NHÂN VIÊN)
    // ----------------------------------------------------
    case 'GET':
      try {
        const { status } = req.query;
        let filter = {};
        if (status && status !== 'all') {
          filter.status = status;
        }

        // Lấy danh sách form liên hệ kèm thông tin khách hàng từ Customer model (Ref)
        const contacts = await ContactForm.find(filter)
            .populate('customerId', 'name phone email totalRequests lastContactedAt')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: contacts });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    // ----------------------------------------------------
    // KHÁCH HÀNG SUBMIT FORM MỚI TỪ WEBSITE
    // ----------------------------------------------------
    case 'POST': 
      try {
        const { name, phone, email, serviceInterest, message, urlSource } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Phải điền ít nhất Tên và Số điện thoại' });
        }

        // 1. TÌM HOẶC TẠO MỚI KHÁCH HÀNG DỰA TRÊN SỐ ĐIỆN THOẠI
        let currentCustomer = await Customer.findOne({ phone: phone });
        
        if (!currentCustomer) {
            // Khách mới toanh (Chưa từng tới website)
            currentCustomer = await Customer.create({
                name: name,
                phone: phone,
                email: email || '',
                totalRequests: 1,
                lastContactedAt: new Date()
            });
        } else {
            // Khách quen (Đã từng gửi form trước đó)
            currentCustomer.totalRequests += 1;
            currentCustomer.lastContactedAt = new Date();
            // Cập nhật lại email/tên nếu khách điền thông tin mới nhất khác lúc đầu
            if (name) currentCustomer.name = name;
            if (email && email !== '') currentCustomer.email = email;
            await currentCustomer.save();
        }

        // 2. GHI LẠI YÊU CẦU TƯ VẤN LIÊN HỆ CỦA LẦN NÀY (Để sale chăm sóc riêng biệt)
        const newContact = await ContactForm.create({
            customerId: currentCustomer._id,
            submittedName: name,
            submittedPhone: phone,
            submittedEmail: email || '',
            
            serviceInterest: serviceInterest || '',
            message: message || '',
            urlSource: urlSource || '',
            status: 'new' // Mới tinh chưa phản hồi
        });

        res.status(201).json({ success: true, data: newContact, message: "Gửi yêu cầu thành công" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    // ----------------------------------------------------
    // NHÂN VIÊN THEO DÕI VÀ CẬP NHẬT TRẠNG THÁI CHĂM SÓC
    // ----------------------------------------------------
    case 'PUT':
    case 'PATCH':
      try {
        const { id } = req.query; // ID của ContactForm
        // Cho phép cập nhật trạng thái (sang Đã giải quyết / Đang gọi lại) hoặc ghi chú riêng của sale
        const updatedContact = await ContactForm.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: updatedContact });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    // ----------------------------------------------------
    // SUPER ADMIN XOÁ BỎ FORM RÁC (SPAM)
    // ----------------------------------------------------
    case 'DELETE': 
      try {
        const { id, ids } = req.query;
        if (ids) {
            // Xóa nhiều Form rác cùng lúc
            const idArray = ids.split(',');
            await ContactForm.deleteMany({ _id: { $in: idArray } });
        } else if (id) {
            // Xóa 1 Form
            await ContactForm.findByIdAndDelete(id);
        } else {
            return res.status(400).json({ success: false, message: "Không tìm thấy ID Form Spam" });
        }
        res.status(200).json({ success: true, message: "Đã xóa thành công" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Phương thức '+method+' không được hỗ trợ' });
      break;
  }
}
