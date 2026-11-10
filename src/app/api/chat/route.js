import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'คุณคือผู้เชี่ยวชาญด้านการเกษตรและโรคทุเรียน คอยให้คำแนะนำที่เป็นประโยชน์ สั้นกระชับ และเข้าใจง่ายสำหรับเกษตรกรไทย' },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch from Groq');
    }

    const reply = data.choices[0].message.content;
    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json({ reply: 'ขออภัยครับ ระบบ AI ขัดข้องชั่วคราว ลองใหม่อีกครั้งนะครับ' }, { status: 500 });
  }
}