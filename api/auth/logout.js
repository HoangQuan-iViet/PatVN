import cookie from 'cookie';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    // Chặn tức thời token bằng cách chèn 1 token lỗi hoặc xoá thẳng thời gian sống (maxAge = -1)
    res.setHeader('Set-Cookie', cookie.serialize('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: -1, 
        path: '/'
    }));

    return res.status(200).json({ success: true, message: "Logged out" });
}
