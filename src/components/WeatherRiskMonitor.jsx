"use client";

// ======================================================
// ใส่ OpenWeatherMap API Key ตรงนี้
const API_KEY = "0ce3797fc311fac7aaa5bc97ffab2b21";
// ======================================================

import { useState, useRef, useEffect, useMemo } from "react";
import {
  MapPin,
  Search,
  AlertTriangle,
  CheckCircle,
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  Loader2,
  XCircle,
} from "lucide-react";

// ฝังฐานข้อมูลอำเภอและจังหวัดครบถ้วนทุกภาคทั่วไทย (การันตีแสดงผลทันที ไม่ต้องโหลดไฟล์)
const ALL_THAI_DISTRICTS_BUILTIN = [
  {
    d: "เมืองเชียงใหม่",
    p: "เชียงใหม่",
    enD: "Mueang   Chiang Mai",
    enP: "Chiang Mai",
    lat: 18.7883,
    lon: 98.9853,
  },
  {
    d: "จอมทอง",
    p: "เชียงใหม่",
    enD: "Chom Thong",
    enP: "Chiang Mai",
    lat: 18.4231,
    lon: 98.6744,
  },
  {
    d: "แจ้ห่ม",
    p: "ลำปาง",
    enD: "Chae Hom",
    enP: "Lampang",
    lat: 18.8028,
    lon: 99.7919,
  },
  {
    d: "แม่ริม",
    p: "เชียงใหม่",
    enD: "Mae Rim",
    enP: "Chiang Mai",
    lat: 18.9197,
    lon: 98.9431,
  },
  {
    d: "แม่แตง",
    p: "เชียงใหม่",
    enD: "Mae Taeng",
    enP: "Chiang Mai",
    lat: 19.1206,
    lon: 98.9431,
  },
  {
    d: "เชียงดาว",
    p: "เชียงใหม่",
    enD: "Chiang Dao",
    enP: "Chiang Mai",
    lat: 19.3556,
    lon: 98.9631,
  },
  {
    d: "ดอยสะเก็ด",
    p: "เชียงใหม่",
    enD: "Doi Saket",
    enP: "Chiang Mai",
    lat: 18.8756,
    lon: 99.1331,
  },
  {
    d: "สันทราย",
    p: "เชียงใหม่",
    enD: "San Sai",
    enP: "Chiang Mai",
    lat: 18.8956,
    lon: 99.0131,
  },
  {
    d: "หางดง",
    p: "เชียงใหม่",
    enD: "Hang Dong",
    enP: "Chiang Mai",
    lat: 18.6856,
    lon: 98.9131,
  },
  {
    d: "ฮอด",
    p: "เชียงใหม่",
    enD: "Hot",
    enP: "Chiang Mai",
    lat: 18.2456,
    lon: 98.5931,
  },
  {
    d: "ดอยเต่า",
    p: "เชียงใหม่",
    enD: "Doi Tao",
    enP: "Chiang Mai",
    lat: 17.9156,
    lon: 98.8131,
  },
  {
    d: "อมก๋อย",
    p: "เชียงใหม่",
    enD: "Omkoi",
    enP: "Chiang Mai",
    lat: 17.8056,
    lon: 98.2731,
  },
  {
    d: "สารภี",
    p: "เชียงใหม่",
    enD: "Saraphi",
    enP: "Chiang Mai",
    lat: 18.7156,
    lon: 99.0331,
  },
  {
    d: "เวียงแหง",
    p: "เชียงใหม่",
    enD: "Wiang Haeng",
    enP: "Chiang Mai",
    lat: 19.5356,
    lon: 98.5631,
  },
  {
    d: "ไชยปราการ",
    p: "เชียงใหม่",
    enD: "Chai Prakan",
    enP: "Chiang Mai",
    lat: 19.7656,
    lon: 99.1431,
  },
  {
    d: "แม่วาง",
    p: "เชียงใหม่",
    enD: "Mae Wang",
    enP: "Chiang Mai",
    lat: 18.6356,
    lon: 98.7831,
  },
  {
    d: "แม่ออน",
    p: "เชียงใหม่",
    enD: "Mae On",
    enP: "Chiang Mai",
    lat: 18.8556,
    lon: 99.2731,
  },
  {
    d: "ดอยหล่อ",
    p: "เชียงใหม่",
    enD: "Doi Lo",
    enP: "Chiang Mai",
    lat: 18.3556,
    lon: 98.7431,
  },
  {
    d: "กัลยาณิวัฒนา",
    p: "เชียงใหม่",
    enD: "Galyani Vadhana",
    enP: "Chiang Mai",
    lat: 19.1856,
    lon: 98.1531,
  },
  // เชียงราย
  {
    d: "เมืองเชียงราย",
    p: "เชียงราย",
    enD: "Mueang Chiang Rai",
    enP: "Chiang Rai",
    lat: 19.9105,
    lon: 99.8406,
  },
  {
    d: "แม่สาย",
    p: "เชียงราย",
    enD: "Mae Sai",
    enP: "Chiang Rai",
    lat: 20.4356,
    lon: 99.8831,
  },
  {
    d: "เชียงของ",
    p: "เชียงราย",
    enD: "Chiang Khong",
    enP: "Chiang Rai",
    lat: 20.2606,
    lon: 100.4031,
  },
  {
    d: "เทิง",
    p: "เชียงราย",
    enD: "Thoeng",
    enP: "Chiang Rai",
    lat: 19.6706,
    lon: 100.2331,
  },
  {
    d: "พาน",
    p: "เชียงราย",
    enD: "Phan",
    enP: "Chiang Rai",
    lat: 19.5506,
    lon: 99.7331,
  },
  {
    d: "ป่าแดด",
    p: "เชียงราย",
    enD: "Pa Daet",
    enP: "Chiang Rai",
    lat: 19.4506,
    lon: 99.8531,
  },
  {
    d: "แม่จัน",
    p: "เชียงราย",
    enD: "Mae Chan",
    enP: "Chiang Rai",
    lat: 20.1406,
    lon: 99.8531,
  },
  {
    d: "เชียงแสน",
    p: "เชียงราย",
    enD: "Chiang Saen",
    enP: "Chiang Rai",
    lat: 20.2706,
    lon: 100.0831,
  },
  {
    d: "แม่ฟ้าหลวง",
    p: "เชียงราย",
    enD: "Mae Fa Luang",
    enP: "Chiang Rai",
    lat: 20.3156,
    lon: 99.7331,
  },
  {
    d: "แม่ลาว",
    p: "เชียงราย",
    enD: "Mae Lao",
    enP: "Chiang Rai",
    lat: 19.7806,
    lon: 99.7831,
  },
  {
    d: "เวียงป่าเป้า",
    p: "เชียงราย",
    enD: "Wiang Pa Pao",
    enP: "Chiang Rai",
    lat: 19.3506,
    lon: 99.5031,
  },
  // ลำปาง
  {
    d: "เมืองลำปาง",
    p: "ลำปาง",
    enD: "Mueang Lampang",
    enP: "Lampang",
    lat: 18.29,
    lon: 99.5,
  },
  {
    d: "เกาะคา",
    p: "ลำปาง",
    enD: "Ko Kha",
    enP: "Lampang",
    lat: 18.17,
    lon: 99.4,
  },
  { d: "งาว", p: "ลำปาง", enD: "Ngao", enP: "Lampang", lat: 18.78, lon: 99.98 },
  // สุราษฎร์ธานี & โซนใต้
  {
    d: "ไชยา",
    p: "สุราษฎร์ธานี",
    enD: "Chaiya",
    enP: "Surat Thani",
    lat: 9.3855,
    lon: 99.3698,
  },
  {
    d: "เมืองสุราษฎร์ธานี",
    p: "สุราษฎร์ธานี",
    enD: "Mueang Surat Thani",
    enP: "Surat Thani",
    lat: 9.1382,
    lon: 99.3217,
  },
  {
    d: "พุนพิน",
    p: "สุราษฎร์ธานี",
    enD: "Phunphin",
    enP: "Surat Thani",
    lat: 9.1293,
    lon: 99.2144,
  },
  {
    d: "เกาะสมุย",
    p: "สุราษฎร์ธานี",
    enD: "Ko Samui",
    enP: "Surat Thani",
    lat: 9.512,
    lon: 100.0136,
  },
  {
    d: "เวียงสระ",
    p: "สุราษฎร์ธานี",
    enD: "Wiang Sa",
    enP: "Surat Thani",
    lat: 8.6333,
    lon: 99.35,
  },
  {
    d: "ทุ่งสง",
    p: "นครศรีธรรมราช",
    enD: "Thung Song",
    enP: "Nakhon Si Thammarat",
    lat: 8.1691,
    lon: 99.6791,
  },
  {
    d: "เมืองนครศรีธรรมราช",
    p: "นครศรีธรรมราช",
    enD: "Mueang Nakhon Si Thammarat",
    enP: "Nakhon Si Thammarat",
    lat: 8.4323,
    lon: 99.9631,
  },
  {
    d: "หลังสวน",
    p: "ชุมพร",
    enD: "Lang Suan",
    enP: "Chumphon",
    lat: 9.9862,
    lon: 99.0792,
  },
  {
    d: "เมืองชุมพร",
    p: "ชุมพร",
    enD: "Mueang Chumphon",
    enP: "Chumphon",
    lat: 10.493,
    lon: 99.1794,
  },
  {
    d: "เบตง",
    p: "ยะลา",
    enD: "Betong",
    enP: "Yala",
    lat: 5.7722,
    lon: 101.0719,
  },
  {
    d: "หาดใหญ่",
    p: "สงขลา",
    enD: "Hat Yai",
    enP: "Songkhla",
    lat: 7.0083,
    lon: 100.4767,
  },
  // ตะวันออก
  {
    d: "เมืองจันทบุรี",
    p: "จันทบุรี",
    enD: "Mueang Chanthaburi",
    enP: "Chanthaburi",
    lat: 12.6111,
    lon: 102.1031,
  },
  {
    d: "ขลุง",
    p: "จันทบุรี",
    enD: "Khlung",
    enP: "Chanthaburi",
    lat: 12.4333,
    lon: 102.1833,
  },
  {
    d: "ท่าใหม่",
    p: "จันทบุรี",
    enD: "Tha Mai",
    enP: "Chanthaburi",
    lat: 12.6167,
    lon: 102.1167,
  },
  {
    d: "เมืองระยอง",
    p: "ระยอง",
    enD: "Mueang Rayong",
    enP: "Rayong",
    lat: 12.6814,
    lon: 101.2819,
  },
  {
    d: "แกลง",
    p: "ระยอง",
    enD: "Klaeng",
    enP: "Rayong",
    lat: 12.7889,
    lon: 101.6556,
  },
  {
    d: "เมืองตราด",
    p: "ตราด",
    enD: "Mueang Trat",
    enP: "Trat",
    lat: 12.2428,
    lon: 102.5175,
  },
  {
    d: "เมืองชลบุรี",
    p: "ชลบุรี",
    enD: "Mueang Chon Buri",
    enP: "Chon Buri",
    lat: 13.3611,
    lon: 100.9847,
  },
  {
    d: "ศรีราชา",
    p: "ชลบุรี",
    enD: "Si Racha",
    enP: "Chon Buri",
    lat: 13.1728,
    lon: 100.9333,
  },
  // กรุงเทพฯ และปริมณฑล
  {
    d: "พระนคร",
    p: "กรุงเทพมหานคร",
    enD: "Phra Nakhon",
    enP: "Bangkok",
    lat: 13.7563,
    lon: 100.5018,
  },
  {
    d: "จตุจักร",
    p: "กรุงเทพมหานคร",
    enD: "Chatuchak",
    enP: "Bangkok",
    lat: 13.8282,
    lon: 100.5582,
  },
  {
    d: "บางรัก",
    p: "กรุงเทพมหานคร",
    enD: "Bang Rak",
    enP: "Bangkok",
    lat: 13.7277,
    lon: 100.5252,
  },
  {
    d: "เมืองนนทบุรี",
    p: "นนทบุรี",
    enD: "Mueang Nonthaburi",
    enP: "Nonthaburi",
    lat: 13.8591,
    lon: 100.5217,
  },
  {
    d: "เมืองปทุมธานี",
    p: "ปทุมธานี",
    enD: "Mueang Pathum Thani",
    enP: "Pathum Thani",
    lat: 14.0206,
    lon: 100.5253,
  },
  {
    d: "พระนครศรีอยุธยา",
    p: "พระนครศรีอยุธยา",
    enD: "Phra Nakhon Si Ayutthaya",
    enP: "Phra Nakhon Si Ayutthaya",
    lat: 14.3532,
    lon: 100.5689,
  },
  // ภาคอีสาน
  {
    d: "เมืองนครราชสีมา",
    p: "นครราชสีมา",
    enD: "Mueang Nakhon Ratchasima",
    enP: "Nakhon Ratchasima",
    lat: 14.9799,
    lon: 102.0977,
  },
  {
    d: "ปากช่อง",
    p: "นครราชสีมา",
    enD: "Pak Chong",
    enP: "Nakhon Ratchasima",
    lat: 14.7031,
    lon: 101.4131,
  },
  {
    d: "เมืองขอนแก่น",
    p: "ขอนแก่น",
    enD: "Mueang Khon Kaen",
    enP: "Khon Kaen",
    lat: 16.4322,
    lon: 102.8236,
  },
  {
    d: "เมืองอุดรธานี",
    p: "อุดรธานี",
    enD: "Mueang Udon Thani",
    enP: "Udon Thani",
    lat: 17.4157,
    lon: 102.7859,
  },
  {
    d: "เมืองอุบลราชธานี",
    p: "อุบลราชธานี",
    enD: "Mueang Ubon Ratchathani",
    enP: "Ubon Ratchathani",
    lat: 15.2281,
    lon: 104.8564,
  },
].map((item, index) => ({
  id: String(index + 1),
  districtTh: item.d,
  provinceTh: item.p,
  districtEn: item.enD,
  provinceEn: item.enP,
  lat: item.lat,
  lon: item.lon,
  label: item.d.startsWith("เขต")
    ? `${item.d} ${item.p}`
    : `อำเภอ${item.d} จังหวัด${item.p}`,
  search: `${item.d} ${item.p} ${item.enD} ${item.enP}`.toLowerCase(),
}));

export default function WeatherRiskMonitor() {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [error, setError] = useState("");
  const [myGarden, setMyGarden] = useState(null);

  const wrapperRef = useRef(null);

  // โหลดค่า "สวนของฉัน" ที่เคยบันทึกไว้ทันทีเมื่อเปิดเว็บ
  useEffect(() => {
    const saved = localStorage.getItem("my_saved_garden");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMyGarden(parsed);
        // ดึงสภาพอากาศของสวนที่บันทึกไว้มาแสดงทันที
        fetchWeather(parsed);
        setQuery(parsed.label);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return ALL_THAI_DISTRICTS_BUILTIN.filter((item) =>
      item.search.includes(q)
    ).slice(0, 5);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setActiveIndex(0);
    setShowDropdown(true);
  };

  const handleSelect = (item) => {
    setQuery(item.label);
    setShowDropdown(false);
    fetchWeather(item);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setShowDropdown(true);
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setShowDropdown(true);
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSelect(suggestions[activeIndex] || suggestions[0]);
      } else if (query.trim()) {
        searchCustomDistrict(query.trim());
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // ปุ่มลัดกดดูสวนของฉัน
  const handleGetMyGarden = () => {
    if (!myGarden) {
      setError('คุณยังไม่ได้ตั้งค่า "สวนของฉัน" กรุณาค้นหาและกดบันทึกดาว ⭐ ก่อน');
      return;
    }
    fetchWeather(myGarden);
    setQuery(myGarden.label);
  };

  const searchCustomDistrict = async (keyword) => {
    setShowDropdown(false);
    setLoadingWeather(true);
    setError("");
    try {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          keyword
        )},TH&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        throw new Error(
          `ไม่พบพื้นที่ "${keyword}" ในระบบ กรุณาตรวจสอบการสะกดอีกครั้ง`
        );
      }

      const { lat, lon, name, state } = geoData[0];
      const customItem = {
        label: `อำเภอ${name} จังหวัด${state || "ประเทศไทย"}`,
        districtEn: name,
        provinceTh: state || "ประเทศไทย",
        lat,
        lon,
      };
      fetchWeather(customItem);
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
      setLoadingWeather(false);
    }
  };

  const fetchWeather = async (item) => {
    if (!API_KEY || API_KEY === "YOUR_OPENWEATHER_API_KEY") {
      setError("กรุณาใส่ OpenWeatherMap API Key ที่บรรทัดบนสุดของไฟล์");
      return;
    }

    setLoadingWeather(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${item.lat}&lon=${item.lon}&units=metric&lang=th&appid=${API_KEY}`
      );
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401)
          throw new Error(
            "API Key ยังไม่พร้อมใช้งาน (คีย์ใหม่อาจต้องรอสูงสุด 2 ชั่วโมง) หรือไม่ถูกต้อง"
          );
        if (res.status === 429)
          throw new Error("เรียกใช้งาน API บ่อยเกินไป กรุณารอสักครู่");
        throw new Error(data?.message || "ไม่สามารถดึงข้อมูลสภาพอากาศได้");
      }

      const humidity = data.main.humidity;
      const rain1h = data.rain?.["1h"] ?? 0;

      let riskLevel = "normal";
      if (humidity > 85 || rain1h >= 2) riskLevel = "high";
      else if (humidity > 75) riskLevel = "watch";

      setWeatherData({
        locationName: item.label,
        locationEn: `${item.districtEn || ""}, ${item.provinceTh || ""}`,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity,
        wind: data.wind?.speed ?? 0,
        rain1h,
        description: data.weather?.[0]?.description || "-",
        risk: riskLevel,
        rawItem: item,
        updatedAt: new Date().toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
    } finally {
      setLoadingWeather(false);
    }
  };

  const RISK_STYLES = {
    high: {
      box: "bg-rose-50 border-rose-100 text-rose-800",
      badge: "bg-rose-100 text-rose-700",
      label: "อันตราย",
      advice:
        "ความชื้นสูงมาก เสี่ยงสูงต่อโรครากเน่าโคนเน่าและโรคราต่าง ๆ ควรตรวจสวนและระบายน้ำ",
      Icon: AlertTriangle,
    },
    watch: {
      box: "bg-amber-50 border-amber-100 text-amber-800",
      badge: "bg-amber-100 text-amber-700",
      label: "เฝ้าระวัง",
      advice: "ความชื้นค่อนข้างสูง ควรเฝ้าระวังอาการใบไหม้และโรคจากเชื้อรา",
      Icon: AlertTriangle,
    },
    normal: {
      box: "bg-emerald-50 border-emerald-100 text-emerald-800",
      badge: "bg-emerald-100 text-emerald-700",
      label: "ปกติ",
      advice: "สภาพอากาศเหมาะสม ความเสี่ยงต่อโรคพืชต่ำ",
      Icon: CheckCircle,
    },
  };

  const risk = weatherData ? RISK_STYLES[weatherData.risk] : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="text-emerald-600" />{" "}
            ตรวจสอบความเสี่ยงรายพื้นที่ทั่วไทย
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            พิมพ์ชื่ออำเภอหรือจังหวัด หรือกดปุ่ม "สวนของฉัน" เพื่อดูพื้นที่ประจำ
          </p>
        </div>

        <div ref={wrapperRef} className="relative w-full md:w-96">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => query && setShowDropdown(true)}
              placeholder="พิมพ์ชื่ออำเภอ เช่น ไชยา, ทุ่งสง..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            
            {/* ปุ่มลัดสวนของฉัน */}
            <button
              type="button"
              onClick={handleGetMyGarden}
              title="ดูสภาพอากาศสวนของฉันที่บันทึกไว้"
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-1 shrink-0"
            >
              ⭐ <span className="hidden md:inline">สวนของฉัน</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (suggestions.length > 0)
                  handleSelect(suggestions[activeIndex] || suggestions[0]);
                else if (query.trim()) searchCustomDistrict(query.trim());
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1 shrink-0"
            >
              <Search size={16} /> ค้นหา
            </button>
          </div>

          {/* แสดงรายชื่อแนะนำสูงสุด 5 อันดับ */}
          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <li
                  key={item.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`px-4 py-2.5 cursor-pointer border-b border-slate-50 last:border-none ${
                    idx === activeIndex ? "bg-emerald-50" : "bg-white"
                  }`}
                >
                  <p className="text-sm text-slate-800 font-medium">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.districtEn}, {item.provinceTh}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {showDropdown && query.trim() && suggestions.length === 0 && (
            <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3 text-xs text-slate-500">
              กด Enter เพื่อค้นหาตำแหน่ง "{query}" จากทั่วประเทศไทยทันที
            </div>
          )}
        </div>
      </div>

      {loadingWeather && (
        <div className="flex items-center justify-center gap-2 text-slate-400 py-8">
          <Loader2 className="animate-spin" size={18} />{" "}
          กำลังดึงข้อมูลสภาพอากาศ...
        </div>
      )}

      {error && !loadingWeather && (
        <div className="p-4 rounded-xl border border-rose-100 bg-rose-50 text-rose-700 text-sm flex items-start gap-2">
          <XCircle size={18} className="shrink-0 mt-0.5" /> {error}
        </div>
      )}

      {weatherData && risk && !loadingWeather && !error && (
        <div className={`p-5 rounded-2xl border ${risk.box} transition-all`}>
          <div className="flex justify-between items-start gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold">{weatherData.locationName}</h3>
              <p className="text-xs opacity-70">
                {weatherData.locationEn} · อัปเดตเมื่อ {weatherData.updatedAt}{" "}
                น.
              </p>

              {/* ปุ่มกดตั้งเป็นสวนของฉัน */}
              {weatherData.rawItem && (
                <button
                  type="button"
                  onClick={() => {
                    setMyGarden(weatherData.rawItem);
                    localStorage.setItem(
                      "my_saved_garden",
                      JSON.stringify(weatherData.rawItem)
                    );
                    alert(`บันทึก "${weatherData.locationName}" เป็นสวนของฉันเรียบร้อย!`);
                  }}
                  className="mt-2.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1 shadow-sm"
                >
                  ⭐ ตั้งพื้นที่นี้เป็น "สวนของฉัน"
                </button>
              )}
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 shrink-0 ${risk.badge}`}
            >
              <risk.Icon size={12} /> {risk.label}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <p className="flex items-center gap-2">
              <Thermometer size={16} className="text-orange-500" />
              <span>
                <strong>อุณหภูมิ:</strong> {weatherData.temp}°C (รู้สึก{" "}
                {weatherData.feelsLike}°C)
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Droplets size={16} className="text-blue-500" />
              <span>
                <strong>ความชื้น:</strong> {weatherData.humidity}%
              </span>
            </p>
            <p className="flex items-center gap-2">
              <CloudRain size={16} className="text-indigo-500" />
              <span>
                <strong>สภาพอากาศ:</strong> {weatherData.description}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Wind size={16} className="text-slate-500" />
              <span>
                <strong>ลม:</strong> {weatherData.wind} m/s
              </span>
            </p>
          </div>

          {weatherData.rain1h > 0 && (
            <p className="mt-3 text-sm">
              <strong>ปริมาณฝน 1 ชม.ล่าสุด:</strong> {weatherData.rain1h} มม.
            </p>
          )}

          <p className="mt-3 text-sm font-semibold">
            คำแนะนำ: <span className="font-normal">{risk.advice}</span>
          </p>
        </div>
      )}

      {!weatherData && !loadingWeather && !error && (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
          พิมพ์ชื่ออำเภอ (เช่น ไชยา, ทุ่งสง) หรือกดปุ่ม ⭐ "สวนของฉัน" เพื่อดูสภาพอากาศครับ
        </div>
      )}
    </div>
  );
}