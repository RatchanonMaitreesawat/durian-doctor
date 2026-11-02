import Navbar from '@/components/Navbar';
import DashboardBanner from '@/components/DashboardBanner';
import DiagnosticDropzone from '@/components/DiagnosticDropzone';
import WeatherRiskMonitor from '@/components/WeatherRiskMonitor';
import ChatAssistant from '@/components/ChatAssistant';
import DiagnosisHistory from '@/components/DiagnosisHistory';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardBanner />
        <DiagnosticDropzone />
        <WeatherRiskMonitor />
        <ChatAssistant />
        <DiagnosisHistory />
      </div>
    </main>
  );
}