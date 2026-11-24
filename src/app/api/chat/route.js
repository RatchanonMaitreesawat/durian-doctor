import { NextResponse } from 'next/server';

const MODEL = 'qwen/qwen3-32b';

export async function POST(req) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ reply: 'ยังไม่ได้ตั้งค่า GROQ_API_KEY บนเซิร์ฟเวอร์' });
    }
    const { message } = await req.json();
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'คุณคือผู้เชี่ยวชาญด้านโรคทุเรียน ตอบสั้น กระชับ เข้าใจง่ายสำหรับเกษตรกรไทย' },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Groq error:', data);
      return NextResponse.json({ reply: `Groq ตอบกลับผิดพลาด: ${data.error?.message || response.status}` });
    }
    return NextResponse.json({ reply: data.choices[0].message.content, model: MODEL });
  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json({ reply: `ระบบขัดข้อง: ${error.message}` });
  }
}
