import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.auth_token;

    if (!token) return res.status(401).json({ success: false, message: "Unauthorized - Blocked by HTTPOnly Cookie" });

    try {
        // Bí mật giải mã (Secret Key)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_123');
        return res.status(200).json({ success: true, user: decoded });
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
}
