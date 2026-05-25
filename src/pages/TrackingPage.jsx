import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { Loader2, Eye, TrendingUp, RefreshCw, BarChart3, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function TrackingPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const CACHE_KEY = 'codequarry_tracking_data';
  const CACHE_TIME_KEY = 'codequarry_tracking_time';
  const CACHE_DURATION = 60 * 60 * 1000; 

  const fetchAnalytics = async (user, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    
    try {
      if (!isRefresh) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
        
        if (cachedData && cachedTime) {
          const now = new Date().getTime();
          if (now - parseInt(cachedTime) < CACHE_DURATION) {
            setTrackingData(JSON.parse(cachedData));
            setLoading(false);
            return; 
          }
        }
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        // 🚀 YAHAN BHI LIVE RENDER LINK LAGA DIYA HAI
        const response = await axios.post('https://codequarry-backend.onrender.com/api/live-tracking', {
          businessName: userData.businessName,
          instagram: userData.instagram,
          facebook: userData.facebook
        });

        if (response.data.success) {
          const newData = response.data.trackingData;
          setTrackingData(newData);
          
          localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
          localStorage.setItem(CACHE_TIME_KEY, new Date().getTime().toString());
          
          localStorage.setItem('liveStats', JSON.stringify(newData.rawStats));
          localStorage.setItem('websiteUrl', userData.websiteUrl || '');
        }
      } else {
        setError('Please sync your workspaces in the Dashboard first.');
      }
    } catch (err) {
      console.error("Tracking Error:", err);
      setError('Failed to fetch live data from the engine.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchAnalytics(user); 
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleRefresh = () => {
    if (currentUser) {
      fetchAnalytics(currentUser, true); 
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  const totalLikes = trackingData ? trackingData.platformData.reduce((sum, p) => sum + p.likes, 0) : 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 font-sans bg-slate-50 min-h-screen">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2 md:mb-8">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={28} /> Performance Analytics
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
            Monitoring engagement and growth velocity across Meta networks.
          </p>
        </header>
        
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-blue-600 font-bold py-2.5 px-5 rounded-xl transition-all disabled:opacity-50 shadow-sm w-full md:w-auto"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin text-blue-600" : ""} />
          {refreshing ? 'Syncing Live Data...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-medium">
          {error}
        </div>
      )}

      {trackingData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <StatCard title="TOTAL META AUDIENCE" value={trackingData.totalImpressions} icon={<Eye />} color="blue" />
            <StatCard title="AVG. ENGAGEMENT" value={trackingData.avgEngagement} icon={<TrendingUp />} color="emerald" />
            <StatCard title="AVG. TOTAL LIKES" value={totalLikes} icon={<Heart />} color="violet" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
            
            <div className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg md:text-xl font-bold mb-6 text-slate-800">7-Day Growth Trend</h3>
              <div className="h-64 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trackingData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                    <Tooltip 
                      cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      name="Total Audience" 
                      stroke="#3b82f6" 
                      strokeWidth={4} 
                      dot={{ fill: '#ffffff', stroke: '#3b82f6', strokeWidth: 3, r: 5 }} 
                      activeDot={{ r: 7, fill: '#2563eb', stroke: '#eff6ff', strokeWidth: 4 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg md:text-xl font-bold mb-6 text-slate-800">Platform Breakdown</h3>
              <div className="h-64 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trackingData.platformData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="platform" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }} 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '13px', fontWeight: '500', color: '#475569' }}/>
                    <Bar dataKey="followers" name="Followers" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={36} />
                    <Bar dataKey="likes" name="Avg Likes" fill="#93c5fd" radius={[6, 6, 0, 0]} barSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    violet: "text-violet-600 bg-violet-50 border-violet-100" 
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
      <div>
        <div className="text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{title}</div>
        <div className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">{value}</div>
      </div>
      <div className={`p-4 rounded-2xl border transition-colors ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
}