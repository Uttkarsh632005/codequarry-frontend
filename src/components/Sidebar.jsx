import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { LayoutDashboard, Calendar as CalendarIcon, Activity, LogOut, Sparkles, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const NavLinks = () => (
    <>
      <Link 
        to="/dashboard" 
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive('/dashboard') ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
      >
        <LayoutDashboard size={18} /> Workspace
      </Link>
      <Link 
        to="/calendar" 
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive('/calendar') ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
      >
        <CalendarIcon size={18} /> Content Calendar
      </Link>
      <Link 
        to="/tracking" 
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive('/tracking') ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
      >
        <Activity size={18} /> Live Tracking
      </Link>
    </>
  );

  return (
    <>
      {/* 📱 MOBILE HEADER (Shows only on small screens) */}
      <div className="md:hidden flex-shrink-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center w-full z-50">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <Sparkles size={18} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">CodeQuarry<span className="text-blue-600">.ai</span></span>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-1">
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* 📱 MOBILE OVERLAY MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-[73px] left-0 w-full h-[calc(100vh-73px)] bg-white z-40 flex flex-col justify-between border-b border-slate-200 shadow-2xl">
          <nav className="p-4 space-y-2 overflow-y-auto">
            <NavLinks />
          </nav>
          <div className="p-4 border-t border-slate-100 bg-white mt-auto">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
              <LogOut size={18} /> Logout Workspace
            </button>
          </div>
        </div>
      )}

      {/* 💻 DESKTOP SIDEBAR (Shows only on medium+ screens) */}
      <div className="hidden md:flex flex-col w-64 h-full bg-white border-r border-slate-200 flex-shrink-0">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Sparkles size={20} />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">CodeQuarry<span className="text-blue-600">.ai</span></span>
            </Link>
          </div>
          <nav className="p-4 space-y-2 mt-4">
            <NavLinks />
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-100 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={18} /> Logout Workspace
          </button>
        </div>
      </div>
    </>
  );
}