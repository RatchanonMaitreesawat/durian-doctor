   import './globals.css';

   export const metadata = {
     title: 'หมอทุเรียน (Durian Doctor)',
     description: 'ระบบวินิจฉัยโรคและเตือนภัยสวนทุเรียนอัจฉริยะ',
   };

   export default function RootLayout({ children }) {
     return (
       <html lang="th">
         <body>{children}</body>
       </html>
     );
   }