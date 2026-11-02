     'use client';
     import { useState } from 'react';
     import { MessageSquare, Send, Bot, User } from 'lucide-react';

     export default function ChatAssistant() {
       const [messages, setMessages] = useState([
         { sender: 'bot', text: 'สวัสดีครับผม "หมอทุเรียน AI" มีข้อสงสัยเรื่องการให้ปุ๋ย การจัดการโรค หรือสภาพอากาศ สอบถามได้เลยครับ!' }
       ]);
       const [input, setInput] = useState('');

       const handleSend = (e) => {
         e.preventDefault();
         if (!input.trim()) return;

         const newMessages = [...messages, { sender: 'user', text: input }];
         setMessages(newMessages);
         setInput('');

         setTimeout(() => {
           setMessages(prev => [
             ...prev,
             { sender: 'bot', text: 'ขอบคุณสำหรับคำถามครับ ช่วงนี้ฝนตกชุกแนะนำให้ระวังโรครากเน่าโคนเน่า และงดใส่ปุ๋ยไนโตรเจนสูงเกินไปครับ (จำลองคำตอบจาก Groq LLaMA-3.3)' }
           ]);
         }, 1000);
       };

       return (
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 flex flex-col h-[450px]">
           <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
             <MessageSquare className="text-emerald-600" /> หมอทุเรียน AI Advisory (Groq LLaMA-3.3-70B)
           </h3>
           <p className="text-sm text-slate-500 mb-4">ปรึกษาปัญหาการดูแลสวนทุเรียนได้ตลอด 24 ชม.</p>

           <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 border rounded-xl p-4 bg-slate-50">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-emerald-950'}`}>
                   {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                 </div>
                 <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border text-slate-700 rounded-tl-none shadow-sm'}`}>
                   {msg.text}
                 </div>
               </div>
             ))}
           </div>

           <form onSubmit={handleSend} className="flex gap-2">
             <input 
               type="text" 
               value={input} 
               onChange={(e) => setInput(e.target.value)}
               placeholder="พิมพ์คำถาม เช่น ทุเรียนใบเหลืองเกิดจากขาดธาตุอะไร..." 
               className="flex-1 px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
             />
             <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl flex items-center justify-center transition">
               <Send className="w-4 h-4" />
             </button>
           </form>
         </div>
       );
     }