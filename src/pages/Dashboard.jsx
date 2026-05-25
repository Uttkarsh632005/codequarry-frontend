import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar as CalendarIcon, TrendingUp, 
  Settings, Link as LinkIcon, Share2, Eye, Users, 
  MessageSquare, Sparkles, Loader2, ChevronRight, Globe, Database 
} from 'lucide-react'
;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '', websiteUrl: '', instagram: '', facebook: '', linkedin: '', twitter: '', youtube: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const runAnalysis = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
          setReport(data.reportData);
      } else {
          alert("Backend connected, but AI failed to generate proper format.");
      }
    } catch (error) {
      alert("Backend connection failed! Is Node.js running?");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 font-sans flex">
      {/* Sidebar - Desktop Only */}
      <aside className="w-64 border-r border-slate-800 p-6 hidden lg:flex flex-col gap-8 bg-[#0f172a]">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-blue-600 p-2 rounded-lg"><Sparkles size={20} className="text-white"/></div>
          <span className="text-xl font-bold tracking-tight text-white">BrandMiner<span className="text-blue-500">.</span></span>
        </div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard size={20}/> Overview
          </button>
          <button onClick={() => setActiveTab('calendar')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'calendar' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'hover:bg-slate-800'}`}>
            <CalendarIcon size={20}/> Content Calendar
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed">
            <TrendingUp size={20}/> Live Stats (Coming Soon)
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Intelligence Hub</h1>
            <p className="text-slate-500">Real-time trends & AI strategy engine</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-all text-sm">Save Config</button>
            <button onClick={runAnalysis} disabled={isAnalyzing} className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-500 transition-all text-sm flex items-center gap-2">
              {isAnalyzing ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
              {isAnalyzing ? "Processing..." : "Run Global Scan"}
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Users className="text-blue-400"/>} label="Est. Reach" value="124.5K" trend="+12%" />
          <StatCard icon={<Share2 className="text-purple-400"/>} label="Engagement" value="4.2%" trend="+0.8%" />
          <StatCard icon={<Eye className="text-emerald-400"/>} label="Daily Views" value="12.1K" trend="+24%" />
          <StatCard icon={<TrendingUp className="text-amber-400"/>} label="Market Score" value="88/100" trend="Stable" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column: Input Form & Connection */}
          <div className="xl:col-span-1 space-y-8">
            <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><LinkIcon size={18} className="text-blue-500"/> Connect Handles</h3>
              <form className="space-y-4">
                <InputGroup label="Brand Name" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="e.g. CodeQuarry Studios" />
                <InputGroup label="Main Website" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} placeholder="https://..." />
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Instagram" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="@handle" />
                  <InputGroup label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="Company URL" />
                </div>
              </form>
            </section>
          </div>

          {/* Right Column: Dynamic Content Tabs */}
          <div className="xl:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  {report ? (
                    <div className="bg-[#1e293b]/30 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm prose prose-invert max-w-none">
                       <h2 className="text-2xl font-bold text-blue-400 mb-6">Strategic Analysis</h2>
                       <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-medium">
                         {report.analysis}
                       </div>
                    </div>
                  ) : (
                    <div className="h-[400px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600">
                      <Database size={48} className="mb-4 opacity-20"/>
                      <p>Enter details and click 'Run Global Scan' to generate intelligence.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'calendar' && (
                <motion.div key="calendar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                   <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><CalendarIcon className="text-blue-500"/> AI Suggested Content Plan</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {report?.calendar ? report.calendar.map((item, idx) => (
                          <div key={idx} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex gap-4 items-start">
                              <div className="bg-blue-600/20 text-blue-400 p-2 rounded-lg text-xs font-bold w-20 text-center">DAY {item.day || idx+1}</div>
                              <div>
                                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                <p className="text-sm text-slate-400">{item.hook}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="bg-slate-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{item.platform}</span>
                               <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{item.type}</span>
                            </div>
                          </div>
                        )) : <p className="text-slate-600 text-center py-10">Run analysis to generate your 14-day calendar.</p>}
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable Components
function StatCard({ icon, label, value, trend }) {
  return (
    <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-slate-800 p-3 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${trend.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-400'}`}>{trend}</span>
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
    </div>
  );
}

function InputGroup({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <input {...props} className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all text-white" />
    </div>
  );
}