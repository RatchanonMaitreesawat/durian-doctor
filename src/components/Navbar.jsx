     import { Sprout, ShieldCheck } from 'lucide-react';

     export default function Navbar() {
       return (
         <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-50">
           <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
             <div className="flex items-center space-x-2">
               <div className="bg-amber-400 p-2 rounded-xl text-emerald-900">
                 <Sprout className="w-6 h-6" />
               </div>
               <div>
                 <h1 className="font-bold text-lg leading-tight">หมอทุเรียน (Durian Doctor)</h1>
                 <p className="text-xs text-emerald-100">ระบบวินิจฉัยโรคและเตือนภัยสวนทุเรียนอัจฉริยะ</p>
               </div>
             </div>
             <div className="hidden md:flex items-center space-x-2 bg-emerald-800 px-3 py-1.5 rounded-full text-xs">
               <ShieldCheck className="w-4 h-4 text-amber-400" />
               <span>สถานะระบบ: พร้อมใช้งาน (AI Online)</span>
             </div>
           </div>
         </header>
       );
     }