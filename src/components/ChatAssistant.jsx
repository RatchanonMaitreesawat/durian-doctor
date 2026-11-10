'use client';

import { useState } from 'react';

export default function ChatAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'สวัสดีครับ ผมคือผู้ช่วยอัจฉริยะสวนทุเรียน มีอะไรให้ผมช่วยไหมครับ?' }
  ]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    const newMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);
    setInput('');

    // เพิ่มข้อความกำลังพิมพ์ระหว่างรอ AI ตอบ
    setMessages(prev => [...prev, { sender: 'bot', text: 'กำลังคิดคำตอบ...' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();

      // ลบข้อความ "กำลังคิดคำตอบ..." ออก แล้วใส่คำตอบจริงจาก AI
      setMessages(prev => {
        const filtered = prev.slice(0, -1);
        return [...filtered, { sender: 'bot', text: data.reply }];
      });

    } catch (err) {
      setMessages(prev => {
        const filtered = prev.slice(0, -1);
        return [...filtered, { sender: 'bot', text: 'เกิดข้อผิดพลาดในการเชื่อมต่อครับ' }];
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        🤖 ผู้ช่วย AI ให้คำปรึกษา
      </h2>
      
      {/* กล่องแสดงข้อความแชท */}
      <div className="h-64 overflow-y-auto border border-slate-100 rounded-xl p-4 mb-4 bg-slate-50 flex flex-col gap-3">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-800 border border-slate-100 shadow-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* ฟอร์มพิมพ์ข้อความ */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์คำถามเกี่ยวกับทุเรียนที่นี่..."
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          ส่ง
        </button>
      </form>
    </div>
  );
}
