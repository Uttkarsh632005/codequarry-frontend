import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Mail, Lock, Sparkles, Loader2, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  // UI States
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Loading & Error States
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // 🚀 1. GOOGLE AUTH LOGIC
  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          businessName: '',
          websiteUrl: '',
          instagramToken: null,
          facebookToken: null
        });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error("Google Auth Failure:", err);
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setLoadingGoogle(false);
    }
  };

  // 🚀 2. EMAIL/PASSWORD AUTH LOGIC
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingEmail(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Save new email user to Firestore too
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: '',
          photoURL: '',
          createdAt: new Date().toISOString(),
          businessName: '',
          websiteUrl: '',
          instagramToken: null,
          facebookToken: null
        });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error("Email Auth error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Authentication failed. Please check your details.');
      }
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans">
      
      {/* LEFT SIDE: Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        
        <div className="relative z-10 text-white max-w-lg">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Sparkles size={28} className="text-white" />
            </div>
            <span className="text-3xl font-black tracking-tight">
              CodeQuarry<span className="text-blue-300">.ai</span>
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            The Ultimate Engine for <br/>
            <span className="text-blue-200">Digital Growth.</span>
          </h1>
          <p className="text-lg text-blue-100 font-medium leading-relaxed mb-8">
            Manage your workspaces, generate AI-driven content strategies, and track real-time Meta analytics all in one place.
          </p>
          
          <div className="flex items-center gap-4 text-sm font-bold text-blue-200 uppercase tracking-widest">
            <span>Web & App Dev</span>
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
            <span>UI/UX</span>
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
            <span>Analytics</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 my-8">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Sparkles size={20} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              CodeQuarry<span className="text-blue-600">.ai</span>
            </span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base">
              {isLogin ? 'Log in to access your CodeQuarry workspace.' : 'Sign up to start optimizing your digital presence.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-medium text-sm text-center">
              {error}
            </div>
          )}

          {/* 🔘 GOOGLE LOGIN BUTTON */}
          <button 
            onClick={handleGoogleLogin} 
            disabled={loadingGoogle || loadingEmail}
            className="w-full flex justify-center items-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 border border-slate-200 hover:border-blue-200 rounded-xl transition-all disabled:opacity-70 shadow-sm mb-6"
          >
            {loadingGoogle ? (
              <Loader2 className="animate-spin text-blue-600" size={20} />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* ➖ DIVIDER ➖ */}
          <div className="relative flex items-center py-2 mb-6">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* ✉️ EMAIL & PASSWORD FORM */}
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                  required
                  minLength="6"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loadingEmail || loadingGoogle}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 shadow-lg shadow-blue-200 mt-2"
            >
              {loadingEmail ? <Loader2 className="animate-spin" size={20} /> : null}
              {loadingEmail ? 'Authenticating...' : (isLogin ? 'Sign In with Email' : 'Create Account')}
              {!loadingEmail && <ArrowRight size={18} className="ml-1" />}
            </button>
          </form>

          {/* TOGGLE LOGIN/SIGNUP */}
          <div className="mt-8 text-center">
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(''); setShowPassword(false); }}
              className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-blue-600 underline underline-offset-2">
                {isLogin ? 'Sign up' : 'Log in'}
              </span>
            </button>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Secure 256-bit Encryption</span>
          </div>

        </div>
      </div>

    </div>
  );
}