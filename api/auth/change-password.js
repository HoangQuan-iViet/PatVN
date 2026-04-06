import connectToDatabase from '../_db.js';
import User from '../_models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.auth_token;

        if (!token) return res.status(401).json({ success: false, message: 'Unauthorized, missing token' });

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) return res.status(500).json({ success: false, message: 'Server Secret Misconfiguration' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const { userId } = decoded;

        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized, invalid token structure' });

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword || newPassword.length < 8) {
             return res.status(400).json({ success: false, message: 'Mật khẩu mới phải từ 8 ký tự trở lên.' });
        }

        await connectToDatabase();
        
        // Find current user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found in Database' });

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác.' });

        // Update with new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ success: true, message: 'Cập nhật mật khẩu thành công!' });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             return res.status(401).json({ success: false, message: 'Token invalid or expired' });
        }
        console.error("CHANGE PASSWORD ERROR:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
