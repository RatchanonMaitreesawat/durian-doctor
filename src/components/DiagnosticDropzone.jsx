'use client';
import { useState } from 'react';
import { UploadCloud, FileImage, AlertCircle, RefreshCw, Tag } from 'lucide-react';

export default function DiagnosticDropzone() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [treeName, setTreeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmitPrediction = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('https://durian-doctor-ai.onrender.com/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        const diagnosticResult = {
          treeName: treeName.trim() || 'ไม่ระบุชื่อต้น',
          date: new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }),
          name: data.disease,
          confidence: data.confidence,
          advice: data.advice
        };
        setResult(diagnosticResult);

        // บันทึกลง LocalStorage เพื่อส่งต่อให้ตารางประวัติด้านล่างแสดงผลจริง
        const existingHistory = JSON.parse(localStorage.getItem('durian_history') || '[]');
        localStorage.setItem('durian_history', JSON.stringify([diagnosticResult, ...existingHistory]));
        
        // แจ้งเตือนให้คอมโพเนนต์อื่นรับทราบว่ามีข้อมูลใหม่
        window.dispatchEvent(new Event('historyUpdated'));
      } else {
        alert('เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ AI: ' + data.error);
      }
    } catch (error) {
      console.error('ไม่สามารถเชื่อมต่อ Python Backend ได้:', error);
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ AI กรุณาตรวจสอบว่ารัน app.py หรือยัง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FileImage className="text-emerald-600" /> ตรวจโรคใบทุเรียนด้วย AI
      </h2>

      {/* ช่องกรอกชื่อต้นทุเรียน */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
          <Tag size={16} className="text-emerald-600" /> ระบุชื่อหรือรหัสต้นทุเรียน
        </label>
        <input 
          type="text" 
          value={treeName} 
          onChange={(e) => setTreeName(e.target.value)}
          placeholder="เช่น ต้นโซน A-01 หรือ ทุเรียนหมอนทองแถว 2" 
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 text-sm"
        />
      </div>

      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer relative bg-slate-50/50"
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {selectedImage ? (
          <div className="flex flex-col items-center">
            <img src={selectedImage} alt="Uploaded" className="max-h-48 rounded-lg mb-4 shadow-md object-contain" />
            <p className="text-sm text-slate-500">คลิกหรือลากรูปใหม่เพื่อเปลี่ยนภาพ</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
              <UploadCloud size={32} />
            </div>
            <p className="text-slate-700 font-medium">ลากและวางรูปภาพใบทุเรียนที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
            <p className="text-xs text-slate-400 mt-1">รองรับไฟล์ JPG, PNG</p>
          </div>
        )}
      </div>

      {selectedImage && !loading && !result && (
        <div className="mt-4 text-center">
          <button 
            onClick={handleSubmitPrediction}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition-colors"
          >
            เริ่มวิเคราะห์โรคด้วย AI
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-6 flex items-center justify-center gap-3 text-emerald-600 font-medium">
          <RefreshCw className="animate-spin" /> กำลังให้ AI วิเคราะห์โรคใบทุเรียน...
        </div>
      )}

      {result && !loading && (
        <div className="mt-6 p-5 bg-emerald-50 border border-emerald-100 rounded-xl">
          <h3 className="text-lg font-bold text-emerald-900 mb-2 flex items-center gap-2">
            <AlertCircle className="text-emerald-600" /> ผลการวิเคราะห์สำหรับ: <span className="text-emerald-700 underline">{result.treeName}</span>
          </h3>
          <p className="text-slate-700"><strong>โรคที่พบ:</strong> {result.name}</p>
          <p className="text-slate-700"><strong>ความแม่นยำ:</strong> {result.confidence}%</p>
          <p className="text-slate-700 mt-2"><strong>คำแนะนำการรักษา:</strong> {result.advice}</p>
        </div>
      )}
    </div>
  );
}
