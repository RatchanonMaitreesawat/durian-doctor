"use client";

import { useState, useEffect } from "react";
import { Thermometer, Droplets, CloudRain } from "lucide-react";

export default function DashboardBanner() {
  const [bannerData, setBannerData] = useState({
    location: "กำลังโหลดพิกัดสวน...",
    temp: "--",
    humidity: "--",
    rainChance: "--",
    statusText: "กำลังตรวจสอบสภาพอากาศ...",
    advice: "กรุณารอสักครู่...",
  });

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลสภาพอากาศของสวนที่บันทึกไว้
    const loadGardenBanner = async () => {
      try {
        const saved = localStorage.getItem("my_saved_garden");
        if (!saved) {
          setBannerData({
            location: "ยังไม่ได้ตั้งค่าสวนของฉัน",
            temp: "--",
            humidity: "--",
            rainChance: "--",
            statusText: "กรุณาเลือกและตั้งค่า 'สวนของฉัน' ด้านล่าง",
            advice: "เลือกอำเภอที่คุณต้องการแล้วกดบันทึก",
          });
          return;
        }

        const garden = JSON.parse(saved);
        const API_KEY = "0ce3797fc311fac7aaa5bc97ffab2b21"; // ใช้คีย์เดียวกัน

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${garden.lat}&lon=${garden.lon}&units=metric&lang=th&appid=${API_KEY}`
        );
        const data = await res.json();

        if (res.ok) {
          const humidity = data.main.humidity;
          const temp = Math.round(data.main.temp);
          const clouds = data.clouds?.all ?? 0;

          let statusText = "สภาพอากาศปกติ เหมาะสมกับการเจริญเติบโต";
          let advice = `พิกัด: ${garden.label} | ความชื้นสัมพัทธ์ ${humidity}% บรรยากาศปกติ`;

          if (humidity > 85) {
            statusText = "สภาพอากาศมีความชื้นสูง เสี่ยงต่อโรคราแจกตัว";
            advice = `พิกัด: ${garden.label} | ความชื้นสูง ${humidity}% แนะนำให้งดการให้น้ำแบบสปริงเกอร์ชั่วคราว`;
          } else if (humidity > 75) {
            statusText = "ความชื้นค่อนข้างสูง ควรเฝ้าระวังโรคพืช";
            advice = `พิกัด: ${garden.label} | ความชื้นสัมพัทธ์ ${humidity}% เฝ้าระวังโรคใบไหม้และเชื้อรา`;
          }

          setBannerData({
            location: garden.label,
            temp: `${temp}°C`,
            humidity: `${humidity}% ${humidity > 85 ? "(สูงมาก)" : ""}`,
            rainChance: `${clouds}%`,
            statusText,
            advice,
          });
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadGardenBanner();
    // อัปเดตข้อมูลทุกๆ 10 นาที หรือเมื่อมีการเปลี่ยนหน้า
    const interval = setInterval(loadGardenBanner, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-emerald-700 rounded-3xl p-6 md:p-8 text-white shadow-lg mb-8 flex flex-col lg:flex-row justify-between items-center gap-6">
      {/* ฝั่งซ้าย: ข้อความแจ้งเตือน */}
      <div className="space-y-3 w-full lg:w-2/3">
        <span className="inline-block px-3 py-1 bg-amber-400 text-slate-900 rounded-full text-xs font-bold tracking-wide">
          แจ้งเตือนภัยสวนทุเรียน ({bannerData.location})
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug">
          {bannerData.statusText}
        </h1>
        <p className="text-emerald-100 text-sm opacity-90">
          {bannerData.advice}
        </p>
      </div>

      {/* ฝั่งขวา: กล่องแสดงตัวเลขสภาพอากาศย่อ */}
      <div className="bg-emerald-800/80 border border-emerald-600/50 rounded-2xl p-4 w-full lg:w-80 shrink-0 space-y-3 shadow-inner">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-emerald-100">
            <Thermometer size={16} className="text-amber-300" /> อุณหภูมิ
          </span>
          <span className="font-bold text-lg">{bannerData.temp}</span>
        </div>

        <div className="flex justify-between items-center text-sm border-t border-emerald-700/60 pt-2">
          <span className="flex items-center gap-2 text-emerald-100">
            <Droplets size={16} className="text-blue-300" /> ความชื้นสัมพัทธ์
          </span>
          <span className="font-bold text-emerald-200">{bannerData.humidity}</span>
        </div>

        <div className="flex justify-between items-center text-sm border-t border-emerald-700/60 pt-2">
          <span className="flex items-center gap-2 text-emerald-100">
            <CloudRain size={16} className="text-cyan-300" /> โอกาสเมฆฝน
          </span>
          <span className="font-bold">{bannerData.rainChance}</span>
        </div>
      </div>
    </div>
  );
}