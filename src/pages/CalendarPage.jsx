import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { Loader2, Calendar as CalendarIcon, Sparkles, History, ArrowRight, LayoutDashboard, Target } from 'lucide-react';

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [userData, setUserData] = useState(null);
  
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setUserData(docSnap.data());

          const historyRef = collection(db, 'users', user.uid, 'calendars');
          const q = query(historyRef, orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          
          const historyData = [];
          querySnapshot.forEach((document) => {
            historyData.push({ id: document.id, ...document.data() });
          });
          
          setHistory(historyData);
          if (historyData.length > 0) setActivePlan(historyData[0]); 

        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!userData) return alert("Please sync your workspace first!");
    setGenerating(true);
    setActiveTab('overview'); 
    
    try {
      const liveStats = JSON.parse(localStorage.getItem('liveStats') || '{}');
      // 🚀 YAHAN LIVE RENDER LINK LAGA DIYA HAI
      const response = await axios.post('https://codequarry-backend.onrender.com/api/generate-strategy', {
        businessName: userData.businessName,
        websiteUrl: userData.websiteUrl,
        liveStats: liveStats
      });

      if (response.data.success) {
        const newPlan = response.data.reportData;
        const savePayload = { ...newPlan, createdAt: new Date().toISOString() };
        const docRef = await addDoc(collection(db, 'users', auth.currentUser.uid, 'calendars'), savePayload);
        const finalPlan = { id: docRef.id, ...savePayload };
        
        setHistory([finalPlan, ...history]);
        setActivePlan(finalPlan);
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert("AI Generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  const igPosts = activePlan?.calendar?.filter(item => item.platform.toLowerCase().includes('instagram')) || [];
  const fbPosts = activePlan?.calendar?.filter(item => item.platform.toLowerCase().includes('facebook')) || [];

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto font-sans bg-slate-50 min-h-screen flex flex-col lg:flex-row gap-6">
      
      {/* LEFT SIDEBAR */}
      <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
          <Sparkles className="mx-auto text-blue-600 mb-4" size={32} />
          <h2 className="text-xl font-extrabold text-slate-800 mb-2">AI Engine</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">Generate targeted 14-day schedules for Instagram & Facebook.</p>
          
          <button 
            onClick={handleGenerate} 
            disabled={generating}
            className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 shadow-lg shadow-slate-200"
          >
            {generating ? <Loader2 className="animate-spin" size={18} /> : <CalendarIcon size={18} />}
            {generating ? 'Processing...' : 'Generate AI Plan'}
          </button>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex-1">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
            History
          </h3>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No history yet.</p>
            ) : (
              history.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => { setActivePlan(plan); setActiveTab('overview'); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center ${
                    activePlan?.id === plan.id 
                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm' 
                      : 'border-transparent hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">Strategy Plan</div>
                    <div className="text-xs mt-1 opacity-70">
                      {new Date(plan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <ArrowRight size={14} className={activePlan?.id === plan.id ? 'text-blue-600' : 'text-slate-400'}/>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (Tabs & Content) */}
      <div className="w-full flex-1">
        {!activePlan ? (
          <div className="bg-white h-full flex flex-col items-center justify-center p-12 rounded-3xl border border-slate-200 shadow-sm text-slate-400">
            <LayoutDashboard size={48} className="mb-4 opacity-50 text-slate-300" />
            <p className="text-lg font-medium text-slate-500">Select a plan or generate a new one.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            
            {/* 🚀 PREMIUM TABS NAVIGATION */}
            <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'overview' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Strategy Overview
              </button>
              <button 
                onClick={() => setActiveTab('instagram')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'instagram' ? 'bg-pink-50 text-pink-600 shadow-sm border border-pink-100' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Instagram ({igPosts.length})
              </button>
              <button 
                onClick={() => setActiveTab('facebook')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'facebook' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Facebook ({fbPosts.length})
              </button>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[75vh]">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="max-w-2xl">
                  <div className="mb-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Target size={14}/> Executive Summary
                    </h3>
                    <p className="text-xl font-medium text-slate-800 leading-snug">
                      {activePlan.summary || activePlan.analysis?.substring(0, 150) + "..."}
                    </p>
                  </div>

                  {activePlan.focus_areas && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core Focus Areas</h3>
                      <div className="space-y-3">
                        {activePlan.focus_areas.map((point, i) => (
                          <div key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">{i+1}</div>
                            <p className="text-sm font-medium text-slate-700">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: INSTAGRAM */}
              {activeTab === 'instagram' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {igPosts.map((item, index) => (
                    <div key={index} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 hover:shadow-lg transition-all group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black px-2 py-1 bg-pink-600 text-white rounded uppercase tracking-wider">DAY {item.day}</span>
                        <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest bg-pink-50 px-2 py-1 rounded">{item.type}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-2 leading-tight group-hover:text-pink-600 transition-colors">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.hook}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: FACEBOOK */}
              {activeTab === 'facebook' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fbPosts.map((item, index) => (
                    <div key={index} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black px-2 py-1 bg-blue-600 text-white rounded uppercase tracking-wider">DAY {item.day}</span>
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">{item.type}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.hook}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}
      </div>

    </div>
  );
}