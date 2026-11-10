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
