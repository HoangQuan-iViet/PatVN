import connectToDatabase from '../_db.js';
import User from '../_models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Rate Limiting tạm thời trên bộ nhớ Serverless
const rateLimitMap = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 phút khóa

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    // 1. Chống Brute Force (Dò mật khẩu liên tục)
    const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

    const now = Date.now();
    const record = rateLimitMap.get(ip) || { count: 0, startTime: now };
    if (now - record.startTime < WINDOW_MS) {
        if (record.count >= MAX_ATTEMPTS) {
            return res.status(429).json({ success: false, message: 'Too many attempts. Try again later.' });
        }
        record.count++;
    } else {
        record.count = 1;
        record.startTime = now;
    }
    rateLimitMap.set(ip, record);

    try {
        // 1.5 KIỂM TRA MÃ CLOUDFLARE TURNSTILE
        const { email, password, turnstileToken } = req.body;

        if (!turnstileToken) {
            return res.status(400).json({ success: false, message: "Missing Turnstile Token (Báo cáo: Chưa tick mã chống Spam)" });
        }

        const formData = new URLSearchParams();
        formData.append('secret', process.env.SECRET_KEY || process.env.TURNSTILE_SECRET_KEY);
        formData.append('response', turnstileToken);

        const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { body: formData, method: 'POST' });
        const result = await verification.json();

        if (!result.success) {
            return res.status(400).json({ success: false, message: "Kẻ mạo danh Robot bị phát hiện!" });
        }

        await connectToDatabase();

        if (!email || !password) return res.status(400).json({ success: false, message: "Invalid email or password" });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error("CRITICAL SECURITY ERROR: Missing JWT_SECRET in environment variables.");
            return res.status(500).json({ success: false, message: "Server Misconfiguration (Fail Secure)" });
        }
        const token = jwt.sign({ userId: user._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

        rateLimitMap.delete(ip);

        res.setHeader('Set-Cookie', cookie.serialize('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 ngày
            path: '/'
        }));

        return res.status(200).json({ success: true, message: "Login successful" });
    } catch (error) {
        console.error("LỖI LOGIN:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
