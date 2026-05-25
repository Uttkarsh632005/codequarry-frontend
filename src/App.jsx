import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Pages & Components import
import LandingPage from './pages/LandingPage'; // 🚀 Naya import
import LoginPage from './pages/LoginPage';
import Overview from './pages/Overview';
import TrackingPage from './pages/TrackingPage';
import CalendarPage from './pages/CalendarPage';
import Sidebar from './components/Sidebar';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        <Routes>
          {/* 🚀 Unauthenticated Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 overflow-hidden">
          <Sidebar />
          <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden relative">
            <Routes>
              {/* 🚀 Authenticated Routes */}
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              {/* Login hone ke baad agar koi / par jata hai toh dashboard pe bhej do */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}