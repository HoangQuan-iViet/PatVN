import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const texts = [
      "Tiêu đề", 
      "Trích dẫn ngắn gọn", 
      "<p>Nội dung bài viết <strong>cực kỳ chi tiết</strong> và dài. <br> Xuống dòng thứ hai.</p>"
  ];

  const prompt = `Bạn là một chuyên gia dịch thuật chuyên nghiệp. Hãy biên dịch mảng JSON chứa các chuỗi văn bản Tiếng Việt sau sang Tiếng Anh.
- Hãy bảo toàn tuyệt đối bất cứ code HTML nào nếu có, chỉ dịch chữ.
- Giữ vững cấu trúc và đúng thứ tự mảng.
- Trả về CHỈ một MẢNG JSON HỢP LỆ (valid JSON array), tuân thủ chặt chẽ không có các lời giới thiệu hay khối markdown (ví dụ \`\`\`json).
- Nếu gặp chuỗi rỗng thì giữ nguyên thành "".

Văn bản JSON cẩn dịch:
${JSON.stringify(texts)}`;

  try {
      const result = await model.generateContent(prompt);
      let responseText = result.response.text().trim();
      console.log("Raw LLM output:", responseText);

      if (responseText.startsWith('```json')) responseText = responseText.replace(/^```json\n?/, '');
      if (responseText.startsWith('```')) responseText = responseText.replace(/^```\n?/, '');
      if (responseText.endsWith('```')) responseText = responseText.replace(/\n?```$/, '');
      responseText = responseText.trim();

      const translatedArray = JSON.parse(responseText);
      console.log("Parsed Array:", translatedArray);
  } catch(e) {
      console.error(e);
  }
}

run();
