'use client';
import { useState, useEffect } from 'react';
import { History, Sprout } from 'lucide-react';

export default function DiagnosisHistory() {
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    // โหลดประวัติจาก LocalStorage
    const loadHistory = () => {
      const saved = JSON.parse(localStorage.getItem('durian_history') || '[]');
      setHistoryList(saved);
    };

    loadHistory();
    window.addEventListener('historyUpdated', loadHistory);
    return () => window.removeEventListener('historyUpdated', loadHistory);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <History className="text-emerald-600" /> ประวัติการวินิจฉัยโรค
      </h2>

      {historyList.length === 0 ? (
        <p className="text-slate-400 text-sm py-4 text-center">ยังไม่มีประวัติการวินิจฉัย ลองอัปโหลดรูปภาพด้านบนได้เลยครับ</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase">
                <th className="py-3 px-4">วันที่/เวลา</th>
                <th className="py-3 px-4">ชื่อต้นทุเรียน</th>
                <th className="py-3 px-4">โรคที่วินิจฉัย</th>
                <th className="py-3 px-4">ความแม่นยำ</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600">
              {historyList.map((item, index) => (
                <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 text-xs">{item.date}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 flex items-center gap-1.5">
                    <Sprout size={16} className="text-emerald-600" /> {item.treeName}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700 font-medium">{item.name}</td>
                  <td className="py-3.5 px-4">{item.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}