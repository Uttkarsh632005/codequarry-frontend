import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
// 🚨 Error dene wale icons hata diye, safe icons laga diye
import { Loader2, Save, Globe, Building2, CheckCircle2, Link2 } from 'lucide-react';

export default function OverviewPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    businessName: '',
    websiteUrl: '',
    instagram: '',
    facebook: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              businessName: data.businessName || '',
              websiteUrl: data.websiteUrl || '',
              instagram: data.instagram || '',
              facebook: data.facebook || ''
            });
          }
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, formData, { merge: true });
      
      setMessage({ text: 'Workspace synced successfully! Real-time engine is ready.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } catch (error) {
      console.error("Save Error:", error);
      setMessage({ text: 'Failed to save workspace settings.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 font-sans bg-slate-50 min-h-screen">
      <header className="space-y-1 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Building2 className="text-blue-600" /> Workspace Setup
        </h1>
        <p className="text-slate-500 font-medium">Connect your brand's Core Meta Networks (Instagram & Facebook) to the CodeQuarry Engine.</p>
      </header>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-2 font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.type === 'success' && <CheckCircle2 size={20} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Core Brand Details */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-slate-800 border-b pb-4">Core Brand Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Business Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input 
                  type="text" 
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. CodeQuarry Studios" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input 
                  type="url" 
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Meta Network Integration */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-slate-800 border-b pb-4">Meta Network Integration</h3>
          <p className="text-sm text-slate-500 mb-6">Enter the full profile URLs for your brand. Our Apify Engine will sync real-time data automatically.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Link2 size={16} className="text-pink-600"/> Instagram URL
              </label>
              <input 
                type="url" 
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/codequarrystudios" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Link2 size={16} className="text-blue-600"/> Facebook Page URL
              </label>
              <input 
                type="url" 
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/yourpage" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-70 shadow-lg shadow-blue-200"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? 'Syncing...' : 'Sync Workspace'}
          </button>
        </div>

      </form>
    </div>
  );
}