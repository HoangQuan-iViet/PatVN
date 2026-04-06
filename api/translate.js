import { GoogleGenerativeAI } from '@google/generative-ai';
import connectToDatabase from './_db.js';

export default async function handler(req, res) {
  // CORS setup for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Phương thức không được hỗ trợ' });
  }

  try {
    const { texts } = req.body;
    
    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ success: false, message: 'Tham số truyền vào không hợp lệ. Vui lòng cung cấp một mảng "texts".' });
    }

    if (texts.length === 0) {
       return res.status(200).json({ success: true, translations: [], mode: 'none' });
    }

    // 1. CHÍNH: DỊCH BẰNG GOOGLE GEMINI API (MÔ HÌNH LLM CONTEXTUAL)
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Chưa có GEMINI_API_KEY");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `Bạn là một chuyên gia dịch thuật chuyên nghiệp. Hãy biên dịch mảng JSON chứa các chuỗi văn bản Tiếng Việt sau sang Tiếng Anh.
- Hãy bảo toàn tuyệt đối bất cứ code HTML nào nếu có, chỉ dịch chữ.
- Giữ vững cấu trúc và đúng thứ tự mảng.
- Trả về CHỈ một MẢNG JSON HỢP LỆ (valid JSON array), tuân thủ chặt chẽ không có các lời giới thiệu hay khối markdown (ví dụ \`\`\`json).
- Nếu gặp chuỗi rỗng thì giữ nguyên thành "".

Văn bản JSON cẩn dịch:
${JSON.stringify(texts)}`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text().trim();
      
      // Cleanup markdown block wrapping if present despite instructions
      if (responseText.startsWith('```json')) responseText = responseText.replace(/^```json/, '');
      if (responseText.startsWith('```')) responseText = responseText.replace(/^```/, '');
      if (responseText.endsWith('```')) responseText = responseText.replace(/```$/, '');
      responseText = responseText.trim();

      const translatedArray = JSON.parse(responseText);

      if (Array.isArray(translatedArray) && translatedArray.length === texts.length) {
         return res.status(200).json({ success: true, translations: translatedArray, mode: 'gemini' });
      } else {
         throw new Error("Gemini API structure parsed badly.");
      }

    } catch (llmError) {
       console.error("Gemini API Error (Chuyển sang cơ chế Fallback Google Translate): ", llmError.message || llmError);
       
       // 2. DỰ PHÒNG: DỊCH BẰNG GOOGLE TRANSLATE GTX ENDPOINT
       // Nếu LLM bị lỗi do Rate Limit, Downtime hay thiếu API KEY, chúng ta dùng cơ chế dự phòng
       const fallbackTranslations = [];
       for (const text of texts) {
          if (!text || text.trim() === '') {
             fallbackTranslations.push(text);
             continue;
          }

          try {
             const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t`;
             const fetchRes = await fetch(gtxUrl, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/x-www-form-urlencoded'
                 },
                 body: `q=${encodeURIComponent(text)}`
             });
             const parsedData = await fetchRes.json();
             
             // Extract translations parts and combine
             let fullTranslatedString = '';
             if (parsedData && parsedData[0]) {
                 fullTranslatedString = parsedData[0].map(chunk => chunk[0]).join('');
             } else {
                 fullTranslatedString = text; // Fail safe
             }
             fallbackTranslations.push(fullTranslatedString);
             
          } catch(e) {
             console.error("Lỗi Fallback Google Translate với item:", e);
             fallbackTranslations.push(text); // Fail safe again
          }
       }

       return res.status(200).json({ success: true, translations: fallbackTranslations, mode: 'google-translate-fallback' });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
