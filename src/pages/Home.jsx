import { Link } from 'react-router-dom';
import { ArrowRight, Activity, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-blue-100">
      <motion.div 
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
      />
      <motion.div 
        animate={{ 
          y: [0, 30, 0],
          rotate: [0, -10, 5, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
      />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center max-w-4xl"
      >
        <motion.div 
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-white p-5 rounded-2xl shadow-xl mb-8 border border-white/50 backdrop-blur-sm"
        >
          <Activity className="w-12 h-12 text-blue-600" />
        </motion.div>

        <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
          Elevate Your <br/>
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            BrandMiner
          </span> Intelligence
        </h1>

        <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl font-medium">
          Deep dive into your social metrics and website performance. Get premium AI-powered strategies and a tailored content calendar instantly.
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/dashboard" className="group relative inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-blue-500/30 transition-all overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
              Start Mining Data
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}