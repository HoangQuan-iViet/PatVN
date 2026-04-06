import connectToDatabase from '../_db.js';
import User from '../_models/User.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { email, password, initKey } = req.body;

        // 1. Kiểm tra khóa bí mật cấp Server
        const SERVER_INIT_KEY = process.env.INIT_SECRET_KEY;
        if (!SERVER_INIT_KEY) {
            console.error("VULNERABILITY PREVENTION: Cannot register, server missing INIT_SECRET_KEY.");
            return res.status(403).json({ success: false, message: "Registration is disabled." });
        }

        if (initKey !== SERVER_INIT_KEY) {
            return res.status(401).json({ success: false, message: "Unauthorized hidden registration attempt." });
        }

        // 2. Validate dữ liệu
        if (!email || !password || password.length < 8) {
            return res.status(400).json({ success: false, message: "Email và Password hợp lệ (tối thiểu 8 ký tự) là bắt buộc." });
        }

        await connectToDatabase();

        // 3. Kiểm tra xem user tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Tài khoản email này đã được sử dụng." });
        }

        // 4. Mã hóa và Lưu
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });

        return res.status(201).json({ success: true, message: "Đăng ký ẩn (Hidden Registration) thành công! Hãy dùng tài khoản này để đăng nhập." });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
