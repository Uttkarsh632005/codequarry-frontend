import { Link } from 'react-router-dom';
import { Sparkles, BarChart3, Calendar, ArrowRight, Zap, Globe, Layout, Database } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900">
      
      {/* 🚀 NAVBAR */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
              <Sparkles size={22} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              CodeQuarry<span className="text-blue-600">.ai</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
              Log In
            </Link>
            <Link to="/login" className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO SECTION */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden relative">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
            <Zap size={14} className="text-blue-500" />
            CodeQuarry Engine v1.0 is Live
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Scale Your Digital Brand <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              On Autopilot.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 font-medium mb-10 leading-relaxed">
            The all-in-one workspace designed for ambitious agencies. Automate your Meta strategies, track real-time analytics, and unlock AI-driven growth.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1">
              Start Your Workspace <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </main>

      {/* 🚀 FEATURES SECTION */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Built for the Modern Web</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">Everything you need to manage your digital footprint, engineered with precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:border-blue-200 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Content Engine</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Generate highly creative, non-repetitive 14-day strategies for Instagram and Facebook powered by advanced AI models.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:border-blue-200 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Analytics</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Monitor your Meta network velocity with live data scraping, instant charts, and caching for lightning-fast performance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:border-blue-200 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layout className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Centralized Workspace</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Securely sync your brand details and manage everything from a single, beautifully designed dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 CAPABILITIES FOOTER STRIP */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <Sparkles size={20} className="text-blue-400" />
            <span className="text-lg font-black tracking-tight">CodeQuarry<span className="text-blue-400">.ai</span></span>
          </div>
          
          <div className="flex gap-6 text-sm font-bold text-slate-400">
            <span className="flex items-center gap-2 hover:text-white transition-colors"><Globe size={16}/> Web & App Dev</span>
            <span className="flex items-center gap-2 hover:text-white transition-colors"><Layout size={16}/> UI/UX</span>
            <span className="flex items-center gap-2 hover:text-white transition-colors"><Database size={16}/> Data Analytics</span>
          </div>
          
          <div className="text-slate-500 text-sm font-medium">
            © 2026 CodeQuarry Studios. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}